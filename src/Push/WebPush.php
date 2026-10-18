<?php

declare(strict_types=1);

namespace HappyJapanese\Push;

/**
 * Web Push without libraries: the message is encrypted for the browser
 * (RFC 8291, aes128gcm) and sent with a VAPID token. This is what Safari
 * on the iPhone (iOS 16.4+, installed web app) uses for notifications.
 */
final class WebPush
{
    /** @param list<string> $allowedHosts */
    public function __construct(
        private readonly Vapid $vapid,
        private readonly Transport $transport,
        private readonly array $allowedHosts,
    ) {
    }

    public function allowed(string $endpoint): bool
    {
        $parts = parse_url($endpoint);
        $host = strtolower((string) ($parts['host'] ?? ''));
        if (($parts['scheme'] ?? '') !== 'https' && !in_array('*http', $this->allowedHosts, true)) {
            return false;
        }
        foreach ($this->allowedHosts as $allowed) {
            if ($host === $allowed || str_ends_with($host, '.' . $allowed)) {
                return true;
            }
        }

        return false;
    }

    /**
     * @param array{endpoint: string, p256dh: string, auth: string} $subscription
     * @return int HTTP status of the push service (201 = delivered, 404/410 = subscription gone)
     */
    public function send(array $subscription, string $payload, string $subject, int $ttl = 43200): int
    {
        if (!$this->allowed($subscription['endpoint'])) {
            return 0;
        }
        $body = self::encrypt($payload, Base64Url::decode($subscription['p256dh']), Base64Url::decode($subscription['auth']));

        return $this->transport->post($subscription['endpoint'], [
            'Content-Type' => 'application/octet-stream',
            'Content-Encoding' => 'aes128gcm',
            'TTL' => (string) $ttl,
            'Urgency' => 'normal',
            'Authorization' => $this->vapid->authorization($subscription['endpoint'], $subject),
        ], $body);
    }

    /** RFC 8291 encryption; one record, so the padding delimiter is 0x02. */
    public static function encrypt(string $payload, string $userPublic, string $authSecret, ?\OpenSSLAsymmetricKey $local = null, ?string $salt = null): string
    {
        $local ??= EcKeys::generate();
        $salt ??= random_bytes(16);
        $localPublic = EcKeys::publicRaw($local);
        $shared = openssl_pkey_derive(EcKeys::publicFromRaw($userPublic), $local, 32);
        if ($shared === false) {
            throw new \RuntimeException('Key agreement failed.');
        }
        $ikm = hash_hkdf('sha256', $shared, 32, "WebPush: info\0" . $userPublic . $localPublic, $authSecret);
        $cek = hash_hkdf('sha256', $ikm, 16, "Content-Encoding: aes128gcm\0", $salt);
        $nonce = hash_hkdf('sha256', $ikm, 12, "Content-Encoding: nonce\0", $salt);
        $cipher = openssl_encrypt($payload . "\x02", 'aes-128-gcm', $cek, OPENSSL_RAW_DATA, $nonce, $tag, '', 16);
        if ($cipher === false) {
            throw new \RuntimeException('Encryption failed.');
        }

        return $salt . pack('N', 4096) . chr(strlen($localPublic)) . $localPublic . $cipher . $tag;
    }

    /** The browser's side, used by the tests to check encrypt(). */
    public static function decrypt(string $body, \OpenSSLAsymmetricKey $userPrivate, string $authSecret): string
    {
        $salt = substr($body, 0, 16);
        $idLength = ord($body[20]);
        $senderPublic = substr($body, 21, $idLength);
        $data = substr($body, 21 + $idLength);
        $userPublic = EcKeys::publicRaw($userPrivate);
        $shared = openssl_pkey_derive(EcKeys::publicFromRaw($senderPublic), $userPrivate, 32);
        $ikm = hash_hkdf('sha256', (string) $shared, 32, "WebPush: info\0" . $userPublic . $senderPublic, $authSecret);
        $cek = hash_hkdf('sha256', $ikm, 16, "Content-Encoding: aes128gcm\0", $salt);
        $nonce = hash_hkdf('sha256', $ikm, 12, "Content-Encoding: nonce\0", $salt);
        $plain = openssl_decrypt(substr($data, 0, -16), 'aes-128-gcm', $cek, OPENSSL_RAW_DATA, $nonce, substr($data, -16));
        if ($plain === false) {
            throw new \RuntimeException('Decryption failed.');
        }

        return rtrim($plain, "\0") === '' ? '' : substr(rtrim($plain, "\0"), 0, -1);
    }
}
