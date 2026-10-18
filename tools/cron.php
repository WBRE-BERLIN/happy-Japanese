<?php

declare(strict_types=1);

// Sends the due reminders. For hosts with a real cron: */10 * * * * php /path/to/tools/cron.php
if (PHP_SAPI !== 'cli') {
    exit;
}
$config = require __DIR__ . '/../src/bootstrap.php';
$app = new HappyJapanese\App($config);
echo json_encode($app->reminders->run(new DateTimeImmutable())), "\n";
