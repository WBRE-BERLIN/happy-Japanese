<?php

declare(strict_types=1);

namespace HappyJapanese;

/**
 * The learning progress of a user: item states, answers and settings.
 * Every write gets the next revision number of the user; a device sends
 * the last revision it knows (cursor) and receives everything newer.
 */
final class Progress
{
    private const PAGE_STATES = 1000;
    private const PAGE_ATTEMPTS = 2000;
    private const MAX_STATES_IN = 1000;
    private const MAX_ATTEMPTS_IN = 2000;

    public function __construct(private readonly Db $db)
    {
    }

    /**
     * @param array<string, mixed> $input {cursor, states: [{item, data, updated_at}], attempts: [{uid, item, ok, ms, at, kind, q, tags}], settings: {data, updated_at}|null}
     * @return array<string, mixed>
     */
    public function sync(int $userId, array $input): array
    {
        $cursor = max(0, (int) ($input['cursor'] ?? 0));
        $states = self::listOf($input['states'] ?? [], self::MAX_STATES_IN, 'states');
        $attempts = self::listOf($input['attempts'] ?? [], self::MAX_ATTEMPTS_IN, 'attempts');
        $settings = is_array($input['settings'] ?? null) ? $input['settings'] : null;

        [$writtenItems, $writtenUids, $wroteSettings, $rev] = $this->db->transaction(function () use ($userId, $states, $attempts, $settings): array {
            $rev = (int) ($this->db->one('SELECT rev FROM users WHERE id = ?', [$userId])['rev'] ?? 0);
            $writtenItems = [];
            $writtenUids = [];

            foreach ($states as $state) {
                $item = self::item($state['item'] ?? null);
                $data = is_array($state['data'] ?? null) ? $state['data'] : throw new HttpError(422, 'Ungültiger Lernstand.');
                $json = json_encode($data, JSON_UNESCAPED_UNICODE | JSON_THROW_ON_ERROR);
                if (strlen($json) > 4000) {
                    throw new HttpError(422, 'Lernstand zu groß.');
                }
                $updatedAt = self::time($state['updated_at'] ?? null);
                $existing = $this->db->one('SELECT updated_at FROM item_states WHERE user_id = ? AND item = ?', [$userId, $item]);
                // An older state than the server's is ignored, and the server's goes back to the device.
                if ($existing !== null && (int) $existing['updated_at'] >= $updatedAt) {
                    continue;
                }
                $writtenItems[$item] = true;
                $rev++;
                $this->db->run(
                    'INSERT INTO item_states (user_id, item, data, due, updated_at, rev) VALUES (?, ?, ?, ?, ?, ?)
                     ON CONFLICT(user_id, item) DO UPDATE SET data = excluded.data, due = excluded.due, updated_at = excluded.updated_at, rev = excluded.rev',
                    [$userId, $item, $json, isset($data['due']) && is_numeric($data['due']) ? (int) $data['due'] : null, $updatedAt, $rev],
                );
            }

            foreach ($attempts as $attempt) {
                $uid = (string) ($attempt['uid'] ?? '');
                if (preg_match('/^[A-Za-z0-9-]{8,64}$/', $uid) !== 1) {
                    throw new HttpError(422, 'Ungültige Antwort-ID.');
                }
                $writtenUids[$uid] = true;
                $rev++;
                $this->db->run(
                    'INSERT INTO attempts (user_id, uid, item, ok, q, ms, at, kind, tags, rev) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                     ON CONFLICT(user_id, uid) DO UPDATE SET ok = excluded.ok, q = excluded.q, rev = excluded.rev
                     WHERE attempts.ok <> excluded.ok OR attempts.q IS NOT excluded.q',
                    [
                        $userId, $uid, self::item($attempt['item'] ?? null),
                        empty($attempt['ok']) ? 0 : 1,
                        isset($attempt['q']) ? max(0, min(5, (int) $attempt['q'])) : null,
                        max(0, min(600_000, (int) ($attempt['ms'] ?? 0))),
                        self::time($attempt['at'] ?? null),
                        mb_substr((string) ($attempt['kind'] ?? ''), 0, 12),
                        mb_substr((string) ($attempt['tags'] ?? ''), 0, 600),
                        $rev,
                    ],
                );
            }

            $wroteSettings = false;
            if ($settings !== null && is_array($settings['data'] ?? null)) {
                $json = json_encode($settings['data'], JSON_UNESCAPED_UNICODE | JSON_THROW_ON_ERROR);
                if (strlen($json) > 20000) {
                    throw new HttpError(422, 'Einstellungen zu groß.');
                }
                $updatedAt = self::time($settings['updated_at'] ?? null);
                $existing = $this->db->one('SELECT updated_at FROM user_settings WHERE user_id = ?', [$userId]);
                if ($existing === null || (int) $existing['updated_at'] < $updatedAt) {
                    $wroteSettings = true;
                    $rev++;
                    $this->db->run(
                        'INSERT INTO user_settings (user_id, data, updated_at, rev) VALUES (?, ?, ?, ?)
                         ON CONFLICT(user_id) DO UPDATE SET data = excluded.data, updated_at = excluded.updated_at, rev = excluded.rev',
                        [$userId, $json, $updatedAt, $rev],
                    );
                }
            }

            $this->db->run('UPDATE users SET rev = ? WHERE id = ?', [$rev, $userId]);

            return [$writtenItems, $writtenUids, $wroteSettings, $rev];
        });

        // What this device does not know yet. Rows it just sent are left out.
        $stateRows = $this->db->all(
            'SELECT item, data, updated_at, rev FROM item_states WHERE user_id = ? AND rev > ? ORDER BY rev LIMIT ' . self::PAGE_STATES,
            [$userId, $cursor],
        );
        $attemptRows = $this->db->all(
            'SELECT uid, item, ok, q, ms, at, kind, tags, rev FROM attempts WHERE user_id = ? AND rev > ? ORDER BY rev LIMIT ' . self::PAGE_ATTEMPTS,
            [$userId, $cursor],
        );
        $more = count($stateRows) === self::PAGE_STATES || count($attemptRows) === self::PAGE_ATTEMPTS;
        $next = $rev;
        if ($more) {
            $next = min(
                count($stateRows) === self::PAGE_STATES ? (int) end($stateRows)['rev'] : PHP_INT_MAX,
                count($attemptRows) === self::PAGE_ATTEMPTS ? (int) end($attemptRows)['rev'] : PHP_INT_MAX,
            );
        }

        $settingsRow = $this->db->one('SELECT data, updated_at, rev FROM user_settings WHERE user_id = ?', [$userId]);

        return [
            'cursor' => $next,
            'more' => $more,
            'states' => array_values(array_map(static fn (array $r): array => [
                'item' => $r['item'],
                'data' => json_decode((string) $r['data'], true),
                'updated_at' => (int) $r['updated_at'],
            ], array_filter($stateRows, static fn (array $r): bool => !isset($writtenItems[$r['item']]) && (int) $r['rev'] <= $next))),
            'attempts' => array_values(array_map(static fn (array $r): array => [
                'uid' => $r['uid'],
                'item' => $r['item'],
                'ok' => (int) $r['ok'],
                'q' => $r['q'] === null ? null : (int) $r['q'],
                'ms' => (int) $r['ms'],
                'at' => (int) $r['at'],
                'kind' => $r['kind'],
                'tags' => $r['tags'],
            ], array_filter($attemptRows, static fn (array $r): bool => !isset($writtenUids[$r['uid']]) && (int) $r['rev'] <= $next))),
            'settings' => $settingsRow !== null && (int) $settingsRow['rev'] > $cursor && !$wroteSettings
                ? ['data' => json_decode((string) $settingsRow['data'], true), 'updated_at' => (int) $settingsRow['updated_at']]
                : null,
        ];
    }

    /** Everything stored about a user, for the download. */
    public function export(array $user): array
    {
        $id = (int) $user['id'];
        $settings = $this->db->one('SELECT data FROM user_settings WHERE user_id = ?', [$id]);

        return [
            'exported_at' => Db::now(),
            'user' => ['username' => $user['username'], 'display_name' => $user['display_name'], 'created_at' => $user['created_at']],
            'settings' => $settings ? json_decode((string) $settings['data'], true) : null,
            'reminders' => $this->db->one('SELECT enabled, time, days, tz, only_idle FROM reminders WHERE user_id = ?', [$id]),
            'states' => array_map(
                static fn (array $r): array => ['item' => $r['item'], 'data' => json_decode((string) $r['data'], true)],
                $this->db->all('SELECT item, data FROM item_states WHERE user_id = ? ORDER BY item', [$id]),
            ),
            'attempts' => $this->db->all('SELECT uid, item, ok, q, ms, at, kind, tags FROM attempts WHERE user_id = ? ORDER BY at', [$id]),
        ];
    }

    /** Items due now (for the reminder text). */
    public function dueCount(int $userId, int $nowMs): int
    {
        return (int) ($this->db->one('SELECT COUNT(*) AS n FROM item_states WHERE user_id = ? AND due IS NOT NULL AND due <= ?', [$userId, $nowMs])['n'] ?? 0);
    }

    public function answeredSince(int $userId, int $sinceMs): int
    {
        return (int) ($this->db->one('SELECT COUNT(*) AS n FROM attempts WHERE user_id = ? AND at >= ?', [$userId, $sinceMs])['n'] ?? 0);
    }

    /** @return list<array<string, mixed>> */
    private static function listOf(mixed $value, int $max, string $what): array
    {
        if (!is_array($value) || !array_is_list($value)) {
            throw new HttpError(422, "Ungültige Daten ({$what}).");
        }
        if (count($value) > $max) {
            throw new HttpError(413, 'Zu viele Einträge auf einmal.');
        }

        return array_values(array_filter($value, 'is_array'));
    }

    private static function item(mixed $value): string
    {
        $item = (string) $value;
        if ($item === '' || mb_strlen($item) > 160 || preg_match('/[\x00-\x1f]/', $item) === 1) {
            throw new HttpError(422, 'Ungültige Aufgaben-ID.');
        }

        return $item;
    }

    /** Milliseconds since 1970; later than "now plus a day" counts as now. */
    private static function time(mixed $value): int
    {
        $now = (int) (microtime(true) * 1000);
        $time = is_numeric($value) ? (int) $value : $now;

        return $time > $now + 86_400_000 || $time < 1_600_000_000_000 ? $now : $time;
    }
}
