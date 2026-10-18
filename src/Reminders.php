<?php

declare(strict_types=1);

namespace HappyJapanese;

use HappyJapanese\Push\Base64Url;
use HappyJapanese\Push\WebPush;

/**
 * Daily reminders as push notifications. A cron job calls run() every few
 * minutes; each user gets at most one reminder a day, at or after the chosen
 * time in their own time zone (up to three hours late, never later).
 */
final class Reminders
{
    private const LATEST_DELAY = 3 * 3600;

    private const DUE_TEXTS = [
        'Miau! %d Aufgaben warten auf dich.',
        '%d Aufgaben sind fällig – Mochi hat schon Tee gekocht. 🍵',
        'Eine kleine Runde Japanisch? %d Aufgaben sind fällig. 🐾',
        'Mochi sitzt auf deinen Karteikarten: %d sind dran. 🐈',
    ];
    private const IDLE_TEXTS = [
        'Zeit für eine kleine Runde Japanisch. 🐾',
        'Mochi möchte mit dir üben – nur fünf Minuten? 🐈',
        'Heute schon ein paar Vokabeln? がんばって！',
    ];

    public function __construct(
        private readonly Db $db,
        private readonly Progress $progress,
        private readonly WebPush $push,
        private readonly Config $config,
    ) {
    }

    /** @return array<string, mixed> */
    public function get(int $userId): array
    {
        $row = $this->db->one('SELECT enabled, time, days, tz, only_idle FROM reminders WHERE user_id = ?', [$userId])
            ?? ['enabled' => 0, 'time' => '19:00', 'days' => '0123456', 'tz' => 'Europe/Berlin', 'only_idle' => 1];

        return [
            'enabled' => (bool) $row['enabled'],
            'time' => (string) $row['time'],
            'days' => (string) $row['days'],
            'tz' => (string) $row['tz'],
            'only_idle' => (bool) $row['only_idle'],
            'devices' => (int) ($this->db->one('SELECT COUNT(*) AS n FROM push_subscriptions WHERE user_id = ?', [$userId])['n'] ?? 0),
        ];
    }

    /** @param array<string, mixed> $input @return array<string, mixed> */
    public function save(int $userId, array $input): array
    {
        $current = $this->get($userId);
        $time = (string) ($input['time'] ?? $current['time']);
        if (preg_match('/^([01]\d|2[0-3]):[0-5]\d$/', $time) !== 1) {
            throw new HttpError(422, 'Bitte eine Uhrzeit wie 19:30 angeben.');
        }
        $days = implode('', array_unique(str_split(preg_replace('/[^0-6]/', '', (string) ($input['days'] ?? $current['days'])) ?? '')));
        $tz = (string) ($input['tz'] ?? $current['tz']);
        if (!in_array($tz, \DateTimeZone::listIdentifiers(), true)) {
            $tz = 'Europe/Berlin';
        }
        $this->db->run(
            'INSERT INTO reminders (user_id, enabled, time, days, tz, only_idle) VALUES (?, ?, ?, ?, ?, ?)
             ON CONFLICT(user_id) DO UPDATE SET enabled = excluded.enabled, time = excluded.time, days = excluded.days, tz = excluded.tz, only_idle = excluded.only_idle',
            [$userId, empty($input['enabled'] ?? $current['enabled']) ? 0 : 1, $time, $days, $tz, empty($input['only_idle'] ?? $current['only_idle']) ? 0 : 1],
        );

        return $this->get($userId);
    }

    /** @param array<string, mixed> $subscription PushSubscription.toJSON() */
    public function subscribe(int $userId, array $subscription): void
    {
        $endpoint = (string) ($subscription['endpoint'] ?? '');
        $p256dh = (string) ($subscription['keys']['p256dh'] ?? '');
        $auth = (string) ($subscription['keys']['auth'] ?? '');
        if (strlen($endpoint) > 1000 || !$this->push->allowed($endpoint)) {
            throw new HttpError(422, 'Dieser Mitteilungsdienst wird nicht unterstützt.');
        }
        try {
            if (strlen(Base64Url::decode($p256dh)) !== 65 || strlen(Base64Url::decode($auth)) !== 16) {
                throw new \InvalidArgumentException();
            }
        } catch (\InvalidArgumentException) {
            throw new HttpError(422, 'Ungültige Anmeldung für Mitteilungen.');
        }
        $this->db->run(
            'INSERT INTO push_subscriptions (user_id, endpoint, p256dh, auth, user_agent, created_at) VALUES (?, ?, ?, ?, ?, ?)
             ON CONFLICT(endpoint) DO UPDATE SET user_id = excluded.user_id, p256dh = excluded.p256dh, auth = excluded.auth, failures = 0',
            [$userId, $endpoint, $p256dh, $auth, mb_substr((string) ($_SERVER['HTTP_USER_AGENT'] ?? ''), 0, 200), Db::now()],
        );
    }

    public function unsubscribe(int $userId, string $endpoint): void
    {
        $this->db->run('DELETE FROM push_subscriptions WHERE user_id = ? AND endpoint = ?', [$userId, $endpoint]);
    }

    /** @return int devices that accepted the message */
    public function sendTest(int $userId): int
    {
        return $this->sendTo($userId, [
            'title' => 'Happy Japanese',
            'body' => 'にゃー！ So sehen Mochis Erinnerungen aus.',
            'tag' => 'test',
        ]);
    }

    /**
     * Sends the reminders that are due at $now.
     * @return array{checked: int, sent: int, skipped: int}
     */
    public function run(\DateTimeImmutable $now): array
    {
        $summary = ['checked' => 0, 'sent' => 0, 'skipped' => 0];
        $rows = $this->db->all(
            'SELECT r.user_id, r.time, r.days, r.tz, r.only_idle, r.last_sent_on FROM reminders r
             WHERE r.enabled = 1 AND EXISTS (SELECT 1 FROM push_subscriptions p WHERE p.user_id = r.user_id)',
        );
        foreach ($rows as $row) {
            $summary['checked']++;
            $userId = (int) $row['user_id'];
            try {
                $tz = new \DateTimeZone((string) $row['tz']);
            } catch (\Exception) {
                $tz = new \DateTimeZone('Europe/Berlin');
            }
            $local = $now->setTimezone($tz);
            $today = $local->format('Y-m-d');
            if ($row['last_sent_on'] === $today || !str_contains((string) $row['days'], $local->format('w'))) {
                continue;
            }
            [$hour, $minute] = array_map('intval', explode(':', (string) $row['time']));
            $scheduled = $local->setTime($hour, $minute);
            $late = $local->getTimestamp() - $scheduled->getTimestamp();
            if ($late < 0 || $late > self::LATEST_DELAY) {
                continue;
            }
            $this->db->run('UPDATE reminders SET last_sent_on = ? WHERE user_id = ?', [$today, $userId]);

            if ((int) $row['only_idle'] === 1 && $this->progress->answeredSince($userId, $local->setTime(0, 0)->getTimestamp() * 1000) > 0) {
                $summary['skipped']++;
                continue;
            }
            $due = $this->progress->dueCount($userId, $now->getTimestamp() * 1000);
            $texts = $due > 0 ? self::DUE_TEXTS : self::IDLE_TEXTS;
            $text = $texts[(int) $local->format('z') % count($texts)];
            $summary['sent'] += $this->sendTo($userId, [
                'title' => 'Happy Japanese',
                'body' => $due > 0 ? sprintf($text, $due) : $text,
                'tag' => 'reminder',
            ]) > 0 ? 1 : 0;
        }

        return $summary;
    }

    /** @param array<string, string> $message */
    private function sendTo(int $userId, array $message): int
    {
        $payload = (string) json_encode($message + ['url' => './'], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
        $delivered = 0;
        foreach ($this->db->all('SELECT id, endpoint, p256dh, auth FROM push_subscriptions WHERE user_id = ?', [$userId]) as $sub) {
            $status = $this->push->send(['endpoint' => $sub['endpoint'], 'p256dh' => $sub['p256dh'], 'auth' => $sub['auth']], $payload, $this->subject());
            if ($status >= 200 && $status < 300) {
                $delivered++;
                $this->db->run('UPDATE push_subscriptions SET last_ok_at = ?, failures = 0 WHERE id = ?', [Db::now(), $sub['id']]);
            } elseif (in_array($status, [404, 410], true)) {
                // The browser revoked the subscription.
                $this->db->run('DELETE FROM push_subscriptions WHERE id = ?', [$sub['id']]);
            } else {
                $this->db->run('UPDATE push_subscriptions SET failures = failures + 1 WHERE id = ?', [$sub['id']]);
                $this->db->run('DELETE FROM push_subscriptions WHERE id = ? AND failures >= 20', [$sub['id']]);
                error_log("Happy Japanese: push to subscription {$sub['id']} answered {$status}");
            }
        }

        return $delivered;
    }

    /** Who is responsible for the messages (VAPID "sub"): config, else the site's address. */
    private function subject(): string
    {
        if ($this->config->pushContact !== '') {
            return $this->config->pushContact;
        }

        return $this->db->setting('app_origin') ?? 'mailto:happy-japanese@localhost';
    }
}
