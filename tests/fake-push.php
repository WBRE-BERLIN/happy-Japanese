<?php

declare(strict_types=1);

// A stand-in push service for the tests: stores what it receives and answers like Apple's.
$dir = (string) getenv('FAKE_PUSH_DIR');
$path = parse_url((string) $_SERVER['REQUEST_URI'], PHP_URL_PATH);
if (str_ends_with((string) $path, '/gone')) {
    http_response_code(410);
    exit;
}
$headers = [];
foreach ($_SERVER as $key => $value) {
    if (str_starts_with($key, 'HTTP_') || in_array($key, ['CONTENT_TYPE', 'CONTENT_LENGTH'], true)) {
        $headers[$key] = $value;
    }
}
file_put_contents($dir . '/' . microtime(true) . '-' . bin2hex(random_bytes(3)) . '.json', json_encode([
    'path' => $path,
    'headers' => $headers,
    'body' => base64_encode((string) file_get_contents('php://input')),
]));
http_response_code(201);
