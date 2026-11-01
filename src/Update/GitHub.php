<?php

declare(strict_types=1);

namespace HappyJapanese\Update;

/**
 * A public GitHub repository, read without an account: the branch head from
 * the git smart-HTTP advertisement (no API rate limit), the files from
 * GitHub's ZIP download.
 */
final class GitHub implements Source
{
    private const MAX_BYTES = 40_000_000;

    public function latestSha(string $repo, string $branch): string
    {
        $body = $this->get("https://github.com/{$repo}.git/info/refs?service=git-upload-pack", 2_000_000);

        return self::shaFromRefs($body, $branch) ?? throw new \RuntimeException("Branch {$branch} not found on GitHub.");
    }

    public function download(string $repo, string $sha, string $target): void
    {
        if (file_put_contents($target, $this->get("https://codeload.github.com/{$repo}/zip/{$sha}", self::MAX_BYTES)) === false) {
            throw new \RuntimeException('Cannot save the download.');
        }
    }

    /** Reads refs/heads/<branch> from a git-upload-pack advertisement. */
    public static function shaFromRefs(string $body, string $branch): ?string
    {
        return preg_match('/([0-9a-f]{40}) refs\/heads\/' . preg_quote($branch, '/') . '(?:\x00|\n|$)/', $body, $m) === 1 ? $m[1] : null;
    }

    private function get(string $url, int $maxBytes): string
    {
        $body = '';
        $handle = curl_init($url);
        curl_setopt_array($handle, [
            CURLOPT_FOLLOWLOCATION => true,
            CURLOPT_MAXREDIRS => 3,
            CURLOPT_CONNECTTIMEOUT => 10,
            CURLOPT_TIMEOUT => 60,
            CURLOPT_USERAGENT => 'HappyJapanese-Updater',
            CURLOPT_PROTOCOLS => CURLPROTO_HTTPS,
            CURLOPT_WRITEFUNCTION => static function ($handle, string $chunk) use (&$body, $maxBytes): int {
                if (strlen($body) + strlen($chunk) > $maxBytes) {
                    return 0;
                }
                $body .= $chunk;

                return strlen($chunk);
            },
        ]);
        $ok = curl_exec($handle);
        $status = (int) curl_getinfo($handle, CURLINFO_RESPONSE_CODE);
        if ($ok === false || $status !== 200) {
            throw new \RuntimeException("GitHub answered {$status} for {$url}" . ($ok === false ? ': ' . curl_error($handle) : '.'));
        }

        return $body;
    }
}
