<?php

declare(strict_types=1);

if (PHP_VERSION_ID < 80300) {
    http_response_code(500);
    exit('Happy Japanese needs PHP 8.3 or newer, 8.5 recommended (this server runs ' . PHP_VERSION . ').');
}

spl_autoload_register(static function (string $class): void {
    $prefix = 'HappyJapanese\\';
    if (!str_starts_with($class, $prefix)) {
        return;
    }
    $file = __DIR__ . '/' . str_replace('\\', '/', substr($class, strlen($prefix))) . '.php';
    if (is_file($file)) {
        require $file;
    }
});

return HappyJapanese\Config::load(dirname(__DIR__));
