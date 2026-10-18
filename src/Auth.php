<?php

declare(strict_types=1);

namespace HappyJapanese;

/**
 * Accounts with name and password (no e-mail, no second factor). Signing in
 * sets a long-lived random token cookie (only its hash is stored), so the
 * home-screen app on the iPhone stays signed in.
 */
final class Auth
{
    private const COOKIE = 'happyjapanese_auth';
    private const LIFETIME = 400 * 86400;
    private const MIN_LENGTH = 8;
    private const MAX_FAILURES = 5;
    private const LOCK_SECONDS = 300;
    private const SIGNUPS_PER_HOUR = 5;

    /** @var array<string, mixed>|null */
    private ?array $user = null;
    private ?string $tokenHash = null;

    public function __construct(private readonly Db $db, private readonly Config $config)
    {
    }

    /** @return array<string, mixed> */
    public function register(string $username, string $password, string $displayName, string $code): array
    {
        if ($this->config->registration === 'closed') {
            throw new HttpError(403, 'Neue Konten sind auf diesem Server abgeschaltet.');
        }
        if ($this->config->registration === 'code' && !hash_equals($this->config->registrationCode, trim($code))) {
            usleep(300_000);
            throw new HttpError(403, 'Der Einladungscode stimmt nicht.');
        }
        $username = self::checkUsername($username);
        $displayName = trim(mb_substr(preg_replace('/\s+/u', ' ', $displayName) ?? '', 0, 40));
        $this->throttle('signup:' . self::ip(), 'Zu viele neue Konten von hier. Bitte später noch einmal.');

        if ($this->db->one('SELECT id FROM users WHERE username = ?', [$username]) !== null) {
            throw new HttpError(409, 'Diesen Benutzernamen gibt es schon.');
        }
        $this->db->run(
            'INSERT INTO users (username, display_name, password_hash, created_at) VALUES (?, ?, ?, ?)',
            [$username, $displayName, password_hash(self::checkPassword($password), PASSWORD_DEFAULT), Db::now()],
        );
        $this->countAttempt('signup:' . self::ip(), self::SIGNUPS_PER_HOUR, 3600);
        $id = (int) $this->db->pdo->lastInsertId();
        $this->issueToken($id);

        return $this->userRow($id);
    }

    /** @return array<string, mixed> */
    public function logIn(string $username, string $password): array
    {
        $username = trim($username);
        $keys = ['user:' . mb_strtolower($username), 'ip:' . self::ip()];
        foreach ($keys as $key) {
            $this->throttle($key, 'Zu viele falsche Versuche. Bitte warte ein paar Minuten.');
        }

        $row = $this->db->one('SELECT id, password_hash FROM users WHERE username = ?', [$username]);
        // Verify against a dummy hash for unknown names, so both take the same time.
        $hash = $row['password_hash'] ?? '$2y$10$8B1PZnZLK.p/3ewOKeiQ0ejAGW8kVOcZRKNWXzuAdpZFYcWsq7h7.';
        if (!password_verify($password, (string) $hash) || $row === null) {
            usleep(300_000);
            foreach ($keys as $key) {
                $this->countAttempt($key, $key[0] === 'u' ? self::MAX_FAILURES : self::MAX_FAILURES * 4, self::LOCK_SECONDS);
            }
            throw new HttpError(401, 'Benutzername oder Passwort stimmen nicht.');
        }
        $this->db->run('DELETE FROM throttle WHERE key = ?', [$keys[0]]);
        if (password_needs_rehash((string) $hash, PASSWORD_DEFAULT)) {
            $this->db->run('UPDATE users SET password_hash = ? WHERE id = ?', [password_hash($password, PASSWORD_DEFAULT), $row['id']]);
        }
        $this->db->run('DELETE FROM auth_tokens WHERE last_used_at < ?', [gmdate('Y-m-d\TH:i:s\Z', time() - self::LIFETIME)]);
        $this->issueToken((int) $row['id']);

        return $this->userRow((int) $row['id']);
    }

    /** The signed-in user, or null. */
    public function user(): ?array
    {
        if ($this->user !== null) {
            return $this->user;
        }
        $token = $_COOKIE[self::COOKIE] ?? '';
        if (!is_string($token) || preg_match('/^[a-f0-9]{64}$/', $token) !== 1) {
            return null;
        }
        $hash = hash('sha256', $token);
        $row = $this->db->one('SELECT user_id, last_used_at FROM auth_tokens WHERE token_hash = ?', [$hash]);
        if ($row === null) {
            return null;
        }
        // Slide the expiry forward, at most once a day.
        if ((int) strtotime((string) $row['last_used_at']) < time() - 86400) {
            $this->db->run('UPDATE auth_tokens SET last_used_at = ? WHERE token_hash = ?', [Db::now(), $hash]);
            $this->db->run('UPDATE users SET last_seen_at = ? WHERE id = ?', [Db::now(), $row['user_id']]);
            $this->sendCookie($token, time() + self::LIFETIME);
        }
        $this->tokenHash = $hash;
        $this->user = $this->userRow((int) $row['user_id']);

        return $this->user;
    }

    public function requireUser(): array
    {
        return $this->user() ?? throw new HttpError(401, 'Bitte melde dich an.');
    }

    public function logOut(): void
    {
        if ($this->user() !== null) {
            $this->db->run('DELETE FROM auth_tokens WHERE token_hash = ?', [$this->tokenHash]);
        }
        $this->user = null;
        $this->tokenHash = null;
        $this->sendCookie('', time() - 3600);
    }

    /** Changes the password and signs out every other device. */
    public function changePassword(string $current, string $new): void
    {
        $user = $this->requireUser();
        $this->verify((int) $user['id'], $current);
        $this->db->run('UPDATE users SET password_hash = ? WHERE id = ?', [password_hash(self::checkPassword($new), PASSWORD_DEFAULT), $user['id']]);
        $this->db->run('DELETE FROM auth_tokens WHERE user_id = ? AND token_hash <> ?', [$user['id'], (string) $this->tokenHash]);
    }

    /** Deletes the account with all progress (foreign keys cascade). */
    public function deleteAccount(string $password): void
    {
        $user = $this->requireUser();
        $this->verify((int) $user['id'], $password);
        $this->db->run('DELETE FROM users WHERE id = ?', [$user['id']]);
        $this->user = null;
        $this->sendCookie('', time() - 3600);
    }

    /** Sets a password directly (command line tool for the administrator). */
    public function resetPassword(string $username, string $password): void
    {
        $row = $this->db->one('SELECT id FROM users WHERE username = ?', [$username]) ?? throw new HttpError(404, 'Unbekannter Benutzer.');
        $this->db->run('UPDATE users SET password_hash = ? WHERE id = ?', [password_hash(self::checkPassword($password), PASSWORD_DEFAULT), $row['id']]);
        $this->db->run('DELETE FROM auth_tokens WHERE user_id = ?', [$row['id']]);
    }

    private function verify(int $userId, string $password): void
    {
        $hash = (string) ($this->db->one('SELECT password_hash FROM users WHERE id = ?', [$userId])['password_hash'] ?? '');
        if (!password_verify($password, $hash)) {
            usleep(300_000);
            throw new HttpError(422, 'Das Passwort stimmt nicht.');
        }
    }

    /** @return array<string, mixed> */
    private function userRow(int $id): array
    {
        $row = $this->db->one('SELECT id, username, display_name, created_at FROM users WHERE id = ?', [$id]) ?? throw new HttpError(401, 'Bitte melde dich an.');
        $row['id'] = (int) $row['id'];

        return $row;
    }

    public static function checkUsername(string $username): string
    {
        $username = trim($username);
        if (mb_strlen($username) < 2 || mb_strlen($username) > 40 || preg_match('/^[\p{L}\p{N}._\- ]+$/u', $username) !== 1) {
            throw new HttpError(422, 'Der Benutzername braucht 2 bis 40 Zeichen: Buchstaben, Ziffern, Punkt, Minus, Unterstrich.');
        }

        return $username;
    }

    private static function checkPassword(string $password): string
    {
        if (mb_strlen($password) < self::MIN_LENGTH) {
            throw new HttpError(422, 'Bitte nimm mindestens ' . self::MIN_LENGTH . ' Zeichen für das Passwort.');
        }
        if (strlen($password) > 200) {
            throw new HttpError(422, 'Das Passwort ist zu lang.');
        }

        return $password;
    }

    private function throttle(string $key, string $message): void
    {
        $row = $this->db->one('SELECT locked_until FROM throttle WHERE key = ?', [$key]);
        if ($row !== null && (int) $row['locked_until'] > time()) {
            throw new HttpError(429, $message);
        }
    }

    private function countAttempt(string $key, int $max, int $seconds): void
    {
        $row = $this->db->one('SELECT count, updated_at FROM throttle WHERE key = ?', [$key]);
        $count = $row !== null && (int) $row['updated_at'] > time() - $seconds ? (int) $row['count'] + 1 : 1;
        $locked = $count >= $max ? time() + $seconds : 0;
        $this->db->run(
            'INSERT INTO throttle (key, count, locked_until, updated_at) VALUES (?, ?, ?, ?)
             ON CONFLICT(key) DO UPDATE SET count = excluded.count, locked_until = excluded.locked_until, updated_at = excluded.updated_at',
            [$key, $locked ? 0 : $count, $locked, time()],
        );
    }

    private static function ip(): string
    {
        return (string) ($_SERVER['REMOTE_ADDR'] ?? 'cli');
    }

    private function issueToken(int $userId): void
    {
        $token = bin2hex(random_bytes(32));
        $this->db->run(
            'INSERT INTO auth_tokens (token_hash, user_id, user_agent, created_at, last_used_at) VALUES (?, ?, ?, ?, ?)',
            [hash('sha256', $token), $userId, mb_substr((string) ($_SERVER['HTTP_USER_AGENT'] ?? ''), 0, 200), Db::now(), Db::now()],
        );
        $this->db->run('UPDATE users SET last_seen_at = ? WHERE id = ?', [Db::now(), $userId]);
        $this->tokenHash = hash('sha256', $token);
        $this->user = $this->userRow($userId);
        $this->sendCookie($token, time() + self::LIFETIME);
    }

    private function sendCookie(string $value, int $expires): void
    {
        if (PHP_SAPI === 'cli' || headers_sent()) {
            return;
        }
        $https = ($_SERVER['HTTPS'] ?? 'off') !== 'off' || ($_SERVER['HTTP_X_FORWARDED_PROTO'] ?? '') === 'https';

        setcookie(self::COOKIE, $value, [
            'expires' => $expires,
            'path' => rtrim(dirname((string) ($_SERVER['SCRIPT_NAME'] ?? '/')), '/\\') . '/',
            'secure' => $https,
            'httponly' => true,
            'samesite' => 'Lax',
        ]);
    }
}
