<?php

declare(strict_types=1);

namespace HappyJapanese\Push;

final class CurlTransport implements Transport
{
    public function post(string $url, array $headers, string $body): int
    {
        $handle = curl_init($url);
        curl_setopt_array($handle, [
            CURLOPT_POST => true,
            CURLOPT_POSTFIELDS => $body,
            CURLOPT_HTTPHEADER => array_map(static fn (string $k, string $v): string => "{$k}: {$v}", array_keys($headers), $headers),
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_CONNECTTIMEOUT => 5,
            CURLOPT_TIMEOUT => 10,
            CURLOPT_FOLLOWLOCATION => false,
            CURLOPT_PROTOCOLS => CURLPROTO_HTTPS | CURLPROTO_HTTP,
        ]);
        $ok = curl_exec($handle);

        return $ok === false ? 0 : (int) curl_getinfo($handle, CURLINFO_RESPONSE_CODE);
    }
}
