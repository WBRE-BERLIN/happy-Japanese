<?php

declare(strict_types=1);

/*
 * Sends the daily reminders and installs new versions from GitHub
 * (unless 'auto_update' => false in config.php). Call it every 5 to 15 minutes:
 *   all-inkl (KAS → Tools → Cronjobs): https://japan.kumogrid.de/cron.php?token=<cron_token from config.php>
 *   with a real cron: php tools/cron.php
 * Without a cron_token in config.php this address does nothing.
 */

$config = require __DIR__ . '/../src/bootstrap.php';

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');

$token = (string) ($_GET['token'] ?? '');
if ($config->cronToken === '' || !hash_equals($config->cronToken, $token)) {
    http_response_code(404);
    echo json_encode(['error' => 'Not found']);
    exit;
}

try {
    $app = new HappyJapanese\App($config);
    $result = $app->reminders->run(new DateTimeImmutable());
    // Last, so that this request does not mix old and new code.
    if ($config->autoUpdate) {
        $result['update'] = $app->updater()->run();
    }
    echo json_encode($result, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
} catch (Throwable $e) {
    error_log('Happy Japanese cron: ' . $e);
    http_response_code(500);
    echo json_encode(['error' => 'failed']);
}
