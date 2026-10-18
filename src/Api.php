<?php

declare(strict_types=1);

namespace HappyJapanese;

/**
 * The JSON API behind the app, reached as api.php?r=<route>. No rewrite
 * rules needed. Writes must send the header X-Happy: 1 (browsers do not
 * let other sites add custom headers without CORS approval, which this API
 * never gives).
 */
final class Api
{
    /** @var array<string, mixed>|null */
    private ?array $input = null;

    private function __construct(private readonly App $app)
    {
    }

    public static function run(Config $config): void
    {
        header('X-Content-Type-Options: nosniff');
        header('Referrer-Policy: same-origin');

        try {
            $api = new self(new App($config));
            $method = $_SERVER['REQUEST_METHOD'] ?? 'GET';
            if ($method !== 'GET' && $method !== 'HEAD') {
                self::guardAgainstCsrf();
            }
            $api->rememberOrigin();
            $result = $api->route($method, trim((string) ($_GET['r'] ?? ''), '/'));
            if ($result !== null) {
                self::json(200, $result);
            }
        } catch (HttpError $e) {
            self::json($e->status, ['error' => $e->getMessage()]);
        } catch (\Throwable $e) {
            error_log('Happy Japanese: ' . $e);
            self::json(500, ['error' => str_starts_with($e->getMessage(), 'The data folder') || str_starts_with($e->getMessage(), 'Cannot create')
                ? $e->getMessage()
                : 'Auf dem Server ist etwas schiefgelaufen. Details stehen im PHP-Fehlerprotokoll.']);
        }
    }

    /** @return array<string, mixed>|null null when the response was already sent */
    private function route(string $method, string $route): ?array
    {
        $auth = $this->app->auth;
        $in = fn (string $key): string => (string) ($this->input()[$key] ?? '');

        $public = match ("{$method} {$route}") {
            'GET session' => fn (): array => $this->session(),
            'POST register' => function () use ($auth, $in): array {
                $auth->register($in('username'), $in('password'), $in('display_name'), $in('code'));

                return $this->session();
            },
            'POST login' => function () use ($auth, $in): array {
                $auth->logIn($in('username'), $in('password'));

                return $this->session();
            },
            'POST logout' => function () use ($auth): array {
                $auth->logOut();

                return ['ok' => true];
            },
            default => null,
        };
        if ($public !== null) {
            return $public();
        }

        $user = $auth->requireUser();
        $id = (int) $user['id'];

        return match ("{$method} {$route}") {
            'POST sync' => $this->app->progress->sync($id, $this->input()),
            'GET export' => $this->export($user),
            'POST password' => (function () use ($auth, $in): array {
                $auth->changePassword($in('current'), $in('new'));

                return ['ok' => true];
            })(),
            'POST account/delete' => (function () use ($auth, $in): array {
                $auth->deleteAccount($in('password'));

                return ['ok' => true];
            })(),
            'GET reminders' => $this->app->reminders->get($id),
            'POST reminders' => $this->app->reminders->save($id, $this->input()),
            'POST push/subscribe' => (function () use ($id): array {
                $subscription = $this->input()['subscription'] ?? null;
                if (!is_array($subscription)) {
                    throw new HttpError(422, 'Ungültige Anmeldung für Mitteilungen.');
                }
                $this->app->reminders->subscribe($id, $subscription);

                return $this->app->reminders->get($id);
            })(),
            'POST push/unsubscribe' => (function () use ($id, $in): array {
                $this->app->reminders->unsubscribe($id, $in('endpoint'));

                return $this->app->reminders->get($id);
            })(),
            'POST push/test' => ['sent' => $this->app->reminders->sendTest($id)],
            default => throw new HttpError(404, 'Unbekannte Anfrage.'),
        };
    }

    /** @return array<string, mixed> */
    private function session(): array
    {
        $user = $this->app->auth->user();

        return [
            'authenticated' => $user !== null,
            'user' => $user === null ? null : ['id' => $user['id'], 'username' => $user['username'], 'display_name' => $user['display_name']],
            'registration' => $this->app->config->registration,
            'vapid_public_key' => $user === null ? null : $this->app->vapid->publicKey(),
        ];
    }

    private function export(array $user): null
    {
        header('Content-Type: application/json; charset=utf-8');
        header('Cache-Control: no-store');
        header(sprintf('Content-Disposition: attachment; filename="happy-japanese-%s.json"', date('Y-m-d')));
        echo json_encode($this->app->progress->export($user), JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_THROW_ON_ERROR);

        return null;
    }

    /** The site's address, used as contact in push messages sent by the cron job. */
    private function rememberOrigin(): void
    {
        $host = (string) ($_SERVER['HTTP_HOST'] ?? '');
        if ($host === '' || preg_match('/^[a-z0-9.:-]+$/i', $host) !== 1) {
            return;
        }
        $https = ($_SERVER['HTTPS'] ?? 'off') !== 'off' || ($_SERVER['HTTP_X_FORWARDED_PROTO'] ?? '') === 'https';
        $origin = ($https ? 'https://' : 'http://') . strtolower($host);
        if ($https && $this->app->db->setting('app_origin') !== $origin) {
            $this->app->db->setSetting('app_origin', $origin);
        }
    }

    /** @return array<string, mixed> */
    private function input(): array
    {
        if ($this->input === null) {
            $raw = (string) file_get_contents('php://input');
            if (strlen($raw) > 4_000_000) {
                throw new HttpError(413, 'Anfrage zu groß.');
            }
            $data = str_contains((string) ($_SERVER['CONTENT_TYPE'] ?? ''), 'application/json') ? json_decode($raw, true) : $_POST;
            $this->input = is_array($data) ? $data : [];
        }

        return $this->input;
    }

    private static function guardAgainstCsrf(): void
    {
        if (($_SERVER['HTTP_X_HAPPY'] ?? '') !== '1') {
            throw new HttpError(403, 'Anfrage abgelehnt.');
        }
        $origin = $_SERVER['HTTP_ORIGIN'] ?? null;
        if ($origin !== null && parse_url((string) $origin, PHP_URL_HOST) !== parse_url('//' . ($_SERVER['HTTP_HOST'] ?? ''), PHP_URL_HOST)) {
            throw new HttpError(403, 'Anfrage abgelehnt.');
        }
    }

    /** @param array<string, mixed> $data */
    private static function json(int $status, array $data): void
    {
        http_response_code($status);
        header('Content-Type: application/json; charset=utf-8');
        header('Cache-Control: no-store');
        echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_THROW_ON_ERROR);
    }
}
