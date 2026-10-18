<?php

declare(strict_types=1);

namespace HappyJapanese\Push;

use HappyJapanese\Db;

/**
 * The server's VAPID key pair (RFC 8292). Created on first use and kept in
 * the database; the public key goes to the browser when it subscribes.
 */
final class Vapid
{
    private ?\OpenSSLAsymmetricKey $private = null;

    public function __construct(private readonly Db $db)
    {
    }

    public function publicKey(): string
    {
        return Base64Url::encode(EcKeys::publicRaw($this->privateKey()));
    }

    /** The Authorization header for a push service. */
    public function authorization(string $endpoint, string $subject, ?int $now = null): string
    {
        $parts = parse_url($endpoint);
        $audience = ($parts['scheme'] ?? 'https') . '://' . ($parts['host'] ?? '') . (isset($parts['port']) ? ':' . $parts['port'] : '');
        $header = Base64Url::encode((string) json_encode(['typ' => 'JWT', 'alg' => 'ES256']));
        $claims = Base64Url::encode((string) json_encode(['aud' => $audience, 'exp' => ($now ?? time()) + 12 * 3600, 'sub' => $subject], JSON_UNESCAPED_SLASHES));
        if (!openssl_sign("{$header}.{$claims}", $der, $this->privateKey(), OPENSSL_ALGO_SHA256)) {
            throw new \RuntimeException('Could not sign the VAPID token.');
        }

        return sprintf('vapid t=%s.%s.%s, k=%s', $header, $claims, Base64Url::encode(EcKeys::derToRaw($der)), $this->publicKey());
    }

    private function privateKey(): \OpenSSLAsymmetricKey
    {
        if ($this->private !== null) {
            return $this->private;
        }
        $pem = $this->db->setting('vapid_private_key');
        if ($pem === null) {
            if (!openssl_pkey_export(EcKeys::generate(), $pem)) {
                throw new \RuntimeException('Could not export the VAPID key.');
            }
            $this->db->setSetting('vapid_private_key', $pem);
        }
        $key = openssl_pkey_get_private($pem);
        if ($key === false) {
            throw new \RuntimeException('The stored VAPID key is unreadable.');
        }

        return $this->private = $key;
    }
}
