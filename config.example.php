<?php

declare(strict_types=1);

// Optional. Copy this file to config.php to change the defaults.
return [
    // Who may create an account: 'open' (anyone), 'code' (with registration_code) or 'closed'.
    // Setting a registration_code switches to 'code' automatically.
    // 'registration' => 'open',
    // 'registration_code' => 'katze-2026',

    // Secret for cron.php (reminders). Without it cron.php does nothing.
    // Make one with: php -r "echo bin2hex(random_bytes(16));"
    // 'cron_token' => '',

    // Contact for the push services (VAPID "sub"), e.g. 'mailto:you@example.com'.
    // Default: the address of the site, e.g. https://japan.kumogrid.de
    // 'push_contact' => '',

    // Where the database is stored. Must be writable by PHP and not reachable from the web.
    // 'data_dir' => __DIR__ . '/data',
];
