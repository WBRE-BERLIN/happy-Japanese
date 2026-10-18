<?php

declare(strict_types=1);

namespace HappyJapanese;

/**
 * Settings of the installation. Read from config.php if it exists; the
 * HAPPYJ_* environment variables win (the tests use them).
 */
final readonly class Config
{
    /** @param list<string> $pushHosts */
    public function __construct(
        public string $dataDir,
        public string $registration,
        public string $registrationCode,
        public string $cronToken,
        public string $pushContact,
        public array $pushHosts,
    ) {
    }

    public static function load(string $root): self
    {
        $file = $root . '/config.php';
        $values = is_file($file) ? (array) require $file : [];

        $get = static fn (string $key, string $default): string
            => (string) (getenv('HAPPYJ_' . strtoupper($key)) ?: ($values[$key] ?? $default));

        $code = $get('registration_code', '');
        $registration = $get('registration', $code !== '' ? 'code' : 'open');

        return new self(
            dataDir: rtrim($get('data_dir', $root . '/data'), '/'),
            registration: in_array($registration, ['open', 'code', 'closed'], true) ? $registration : 'open',
            registrationCode: $code,
            cronToken: $get('cron_token', ''),
            pushContact: $get('push_contact', ''),
            // Push messages only go to these services (and their subdomains), never to arbitrary URLs.
            pushHosts: array_values(array_filter(array_map('trim', explode(',', $get(
                'push_hosts',
                'web.push.apple.com,fcm.googleapis.com,updates.push.services.mozilla.com,notify.windows.com,push.services.mozilla.com',
            ))))),
        );
    }
}
