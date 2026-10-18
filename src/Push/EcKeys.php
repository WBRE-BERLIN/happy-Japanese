<?php

declare(strict_types=1);

namespace HappyJapanese\Push;

/** P-256 keys as Web Push needs them: raw uncompressed points (65 bytes) and OpenSSL keys. */
final class EcKeys
{
    /** DER prefix of a SubjectPublicKeyInfo for a P-256 key. */
    private const SPKI_PREFIX = '3059301306072a8648ce3d020106082a8648ce3d030107034200';

    public static function generate(): \OpenSSLAsymmetricKey
    {
        $key = openssl_pkey_new(['private_key_type' => OPENSSL_KEYTYPE_EC, 'curve_name' => 'prime256v1']);
        if ($key === false) {
            throw new \RuntimeException('OpenSSL cannot create P-256 keys: ' . openssl_error_string());
        }

        return $key;
    }

    /** The public key of a private key as 0x04 || X || Y. */
    public static function publicRaw(\OpenSSLAsymmetricKey $key): string
    {
        $details = openssl_pkey_get_details($key);
        if (!is_array($details) || !isset($details['ec']['x'], $details['ec']['y'])) {
            throw new \RuntimeException('Not an EC key.');
        }

        return "\x04" . str_pad($details['ec']['x'], 32, "\0", STR_PAD_LEFT) . str_pad($details['ec']['y'], 32, "\0", STR_PAD_LEFT);
    }

    public static function publicFromRaw(string $raw): \OpenSSLAsymmetricKey
    {
        if (strlen($raw) !== 65 || $raw[0] !== "\x04") {
            throw new \InvalidArgumentException('Not an uncompressed P-256 point.');
        }
        $pem = "-----BEGIN PUBLIC KEY-----\n" . chunk_split(base64_encode(hex2bin(self::SPKI_PREFIX) . $raw), 64, "\n") . "-----END PUBLIC KEY-----\n";
        $key = openssl_pkey_get_public($pem);
        if ($key === false) {
            throw new \InvalidArgumentException('Invalid public key.');
        }

        return $key;
    }

    /** ECDSA signature from DER (what OpenSSL returns) to the raw r || s that JWT uses. */
    public static function derToRaw(string $der): string
    {
        $offset = 2;
        if (ord($der[1]) & 0x80) {
            $offset += ord($der[1]) & 0x7f;
        }
        $parts = [];
        for ($i = 0; $i < 2; $i++) {
            if ($der[$offset] !== "\x02") {
                throw new \RuntimeException('Unexpected signature format.');
            }
            $length = ord($der[$offset + 1]);
            $value = ltrim(substr($der, $offset + 2, $length), "\0");
            $parts[] = str_pad($value, 32, "\0", STR_PAD_LEFT);
            $offset += 2 + $length;
        }

        return $parts[0] . $parts[1];
    }

    /** Raw r || s back to DER (for verifying in tests). */
    public static function rawToDer(string $raw): string
    {
        $encode = static function (string $int): string {
            $int = ltrim($int, "\0");
            if ($int === '' || ord($int[0]) & 0x80) {
                $int = "\0" . $int;
            }

            return "\x02" . chr(strlen($int)) . $int;
        };
        $body = $encode(substr($raw, 0, 32)) . $encode(substr($raw, 32, 32));

        return "\x30" . chr(strlen($body)) . $body;
    }
}
