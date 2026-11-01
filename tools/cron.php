<?php

declare(strict_types=1);

// Sends the due reminders and installs new versions (see public/cron.php).
// For hosts with a real cron: */10 * * * * php /path/to/tools/cron.php
if (PHP_SAPI !== 'cli') {
    exit;
}
$config = require __DIR__ . '/../src/bootstrap.php';
$app = new HappyJapanese\App($config);
$result = $app->reminders->run(new DateTimeImmutable());
if ($config->autoUpdate) {
    $result['update'] = $app->updater()->run();
}
echo json_encode($result, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE), "\n";
