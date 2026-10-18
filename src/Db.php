<?php

declare(strict_types=1);

namespace HappyJapanese;

use PDO;
use PDOStatement;

/** The SQLite database. Migrations run on connect, tracked by PRAGMA user_version. */
final class Db
{
    /** Never edit a released migration; append a new one. */
    private const MIGRATIONS = [
        1 => <<<'SQL'
            CREATE TABLE users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                username TEXT NOT NULL UNIQUE COLLATE NOCASE,
                display_name TEXT NOT NULL DEFAULT '',
                password_hash TEXT NOT NULL,
                rev INTEGER NOT NULL DEFAULT 0,
                created_at TEXT NOT NULL,
                last_seen_at TEXT
            );

            CREATE TABLE auth_tokens (
                token_hash TEXT PRIMARY KEY,
                user_id INTEGER NOT NULL REFERENCES users (id) ON DELETE CASCADE,
                user_agent TEXT,
                created_at TEXT NOT NULL,
                last_used_at TEXT NOT NULL
            );
            CREATE INDEX auth_tokens_user ON auth_tokens (user_id);

            -- failed sign-ins and sign-ups per name or address, for the lockout
            CREATE TABLE throttle (
                key TEXT PRIMARY KEY,
                count INTEGER NOT NULL,
                locked_until INTEGER NOT NULL,
                updated_at INTEGER NOT NULL
            );

            CREATE TABLE settings (
                key TEXT PRIMARY KEY,
                value TEXT NOT NULL
            );

            -- the app's settings of a user (JSON), last write wins
            CREATE TABLE user_settings (
                user_id INTEGER PRIMARY KEY REFERENCES users (id) ON DELETE CASCADE,
                data TEXT NOT NULL,
                updated_at INTEGER NOT NULL,
                rev INTEGER NOT NULL
            );

            -- learning state per item (JSON from the app), last write wins
            CREATE TABLE item_states (
                user_id INTEGER NOT NULL REFERENCES users (id) ON DELETE CASCADE,
                item TEXT NOT NULL,
                data TEXT NOT NULL,
                due INTEGER,
                updated_at INTEGER NOT NULL,
                rev INTEGER NOT NULL,
                PRIMARY KEY (user_id, item)
            );
            CREATE INDEX item_states_rev ON item_states (user_id, rev);
            CREATE INDEX item_states_due ON item_states (user_id, due);

            -- every answer; times in milliseconds since 1970
            CREATE TABLE attempts (
                user_id INTEGER NOT NULL REFERENCES users (id) ON DELETE CASCADE,
                uid TEXT NOT NULL,
                item TEXT NOT NULL,
                ok INTEGER NOT NULL,
                q INTEGER,
                ms INTEGER NOT NULL,
                at INTEGER NOT NULL,
                kind TEXT,
                tags TEXT,
                rev INTEGER NOT NULL,
                PRIMARY KEY (user_id, uid)
            );
            CREATE INDEX attempts_rev ON attempts (user_id, rev);
            CREATE INDEX attempts_at ON attempts (user_id, at);

            CREATE TABLE push_subscriptions (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER NOT NULL REFERENCES users (id) ON DELETE CASCADE,
                endpoint TEXT NOT NULL UNIQUE,
                p256dh TEXT NOT NULL,
                auth TEXT NOT NULL,
                user_agent TEXT,
                created_at TEXT NOT NULL,
                last_ok_at TEXT,
                failures INTEGER NOT NULL DEFAULT 0
            );
            CREATE INDEX push_subscriptions_user ON push_subscriptions (user_id);

            CREATE TABLE reminders (
                user_id INTEGER PRIMARY KEY REFERENCES users (id) ON DELETE CASCADE,
                enabled INTEGER NOT NULL DEFAULT 0,
                time TEXT NOT NULL DEFAULT '19:00',
                days TEXT NOT NULL DEFAULT '0123456',
                tz TEXT NOT NULL DEFAULT 'Europe/Berlin',
                only_idle INTEGER NOT NULL DEFAULT 1,
                last_sent_on TEXT
            );
            SQL,
    ];

    public readonly PDO $pdo;

    public function __construct(string $path)
    {
        $this->pdo = new PDO('sqlite:' . $path, options: [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        ]);
        $this->pdo->exec('PRAGMA busy_timeout = 5000');
        $this->pdo->exec('PRAGMA foreign_keys = ON');
        $this->pdo->exec('PRAGMA journal_mode = WAL');
        $this->migrate();
    }

    /** @param array<int|string, mixed> $params */
    public function run(string $sql, array $params = []): PDOStatement
    {
        $statement = $this->pdo->prepare($sql);
        $statement->execute($params);

        return $statement;
    }

    /**
     * @param array<int|string, mixed> $params
     * @return array<string, mixed>|null
     */
    public function one(string $sql, array $params = []): ?array
    {
        $row = $this->run($sql, $params)->fetch();

        return is_array($row) ? $row : null;
    }

    /**
     * @param array<int|string, mixed> $params
     * @return list<array<string, mixed>>
     */
    public function all(string $sql, array $params = []): array
    {
        return $this->run($sql, $params)->fetchAll();
    }

    /** @template T @param callable(): T $work @return T */
    public function transaction(callable $work): mixed
    {
        $this->pdo->exec('BEGIN IMMEDIATE');
        try {
            $result = $work();
            $this->pdo->exec('COMMIT');

            return $result;
        } catch (\Throwable $e) {
            $this->pdo->exec('ROLLBACK');
            throw $e;
        }
    }

    public static function now(): string
    {
        return gmdate('Y-m-d\TH:i:s\Z');
    }

    public function setting(string $key): ?string
    {
        $row = $this->one('SELECT value FROM settings WHERE key = ?', [$key]);

        return $row === null ? null : (string) $row['value'];
    }

    public function setSetting(string $key, string $value): void
    {
        $this->run('INSERT INTO settings (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value', [$key, $value]);
    }

    private function migrate(): void
    {
        $version = (int) $this->pdo->query('PRAGMA user_version')->fetchColumn();

        foreach (self::MIGRATIONS as $target => $sql) {
            if ($target <= $version) {
                continue;
            }
            $this->pdo->beginTransaction();
            $this->pdo->exec($sql);
            $this->pdo->exec('PRAGMA user_version = ' . $target);
            $this->pdo->commit();
        }
    }
}
