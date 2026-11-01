<?php

declare(strict_types=1);

namespace HappyJapanese;

use HappyJapanese\Update\Source;

/**
 * Keeps the installation up to date with the GitHub repository; the cron
 * job calls run(). A git clone is fast-forwarded with git. Where there is no
 * clone, or PHP cannot run git, the files of the newest commit are unpacked
 * from GitHub's ZIP download. data/ and config.php are never touched.
 */
final class Updater
{
    /** Paths an update never writes or deletes. */
    private const KEEP = ['data', 'config.php', '.git'];
    private const LOG_BYTES = 64_000;

    public function __construct(
        private readonly string $root,
        private readonly string $dataDir,
        private readonly string $repo,
        private readonly string $branch,
        private readonly Source $source,
        private readonly ?string $git = null,
    ) {
    }

    /** @return array<string, string> status: current, updated or error */
    public function run(): array
    {
        try {
            $git = is_dir($this->root . '/.git') ? ($this->git ?? self::findGit()) : null;
            $result = $git !== null ? $this->viaGit($git) : $this->viaZip();
        } catch (\Throwable $e) {
            $result = ['status' => 'error', 'error' => mb_substr($e->getMessage(), 0, 300)];
        }
        if ($result['status'] !== 'current') {
            $this->log($result);
        }

        return $result;
    }

    /** The installed commit, short, or null when unknown. */
    public static function version(string $root, string $dataDir): ?string
    {
        $sha = self::gitHead($root);
        if ($sha === null && is_file($dataDir . '/installed.json')) {
            $sha = (string) (json_decode((string) file_get_contents($dataDir . '/installed.json'), true)['sha'] ?? '');
        }

        return $sha !== null && preg_match('/^[0-9a-f]{40}$/', $sha) === 1 ? substr($sha, 0, 7) : null;
    }

    /* ---------- git ---------- */

    /** @return array<string, string> */
    private function viaGit(string $git): array
    {
        $head = $this->runGit($git, ['rev-parse', 'HEAD']);
        $this->runGit($git, ['fetch', '--quiet', 'origin', $this->branch]);
        $remote = $this->runGit($git, ['rev-parse', 'FETCH_HEAD']);
        if ($head === $remote) {
            return ['status' => 'current', 'method' => 'git', 'version' => substr($head, 0, 7)];
        }
        // Only fast-forward: local changes or local commits stop the update instead of being lost.
        $this->runGit($git, ['merge', '--ff-only', '--quiet', 'FETCH_HEAD']);

        return ['status' => 'updated', 'method' => 'git', 'from' => substr($head, 0, 7), 'to' => substr($remote, 0, 7)];
    }

    /** @param list<string> $args */
    private function runGit(string $git, array $args): string
    {
        $command = [$git, '-c', 'safe.directory=' . $this->root, '-C', $this->root, ...$args];
        $env = ['GIT_TERMINAL_PROMPT' => '0', 'HOME' => getenv('HOME') ?: $this->dataDir, 'PATH' => getenv('PATH') ?: '/usr/local/bin:/usr/bin:/bin'];
        $process = proc_open($command, [1 => ['pipe', 'w'], 2 => ['pipe', 'w']], $pipes, $this->root, $env);
        if (!is_resource($process)) {
            throw new \RuntimeException('git could not be started.');
        }
        $out = trim((string) stream_get_contents($pipes[1]));
        $err = trim((string) stream_get_contents($pipes[2]));
        fclose($pipes[1]);
        fclose($pipes[2]);
        if (proc_close($process) !== 0) {
            throw new \RuntimeException('git ' . $args[0] . ': ' . ($err !== '' ? $err : 'failed'));
        }

        return $out;
    }

    /** A git that PHP may run, or null (no proc_open, no git). */
    public static function findGit(): ?string
    {
        if (!function_exists('proc_open')) {
            return null;
        }
        foreach (['/usr/bin/git', '/usr/local/bin/git', '/bin/git'] as $path) {
            if (@is_executable($path)) {
                return $path;
            }
        }

        return null;
    }

    private static function gitHead(string $root): ?string
    {
        $head = @file_get_contents($root . '/.git/HEAD');
        if ($head === false) {
            return null;
        }
        $head = trim($head);
        if (!str_starts_with($head, 'ref: ')) {
            return $head;
        }
        $ref = substr($head, 5);
        $sha = @file_get_contents($root . '/.git/' . $ref);
        if ($sha !== false) {
            return trim($sha);
        }
        foreach (@file($root . '/.git/packed-refs', FILE_IGNORE_NEW_LINES) ?: [] as $line) {
            if (str_ends_with($line, ' ' . $ref)) {
                return substr($line, 0, 40);
            }
        }

        return null;
    }

    /* ---------- ZIP ---------- */

    /** @return array<string, string> */
    private function viaZip(): array
    {
        $installed = $this->installed();
        $sha = $this->source->latestSha($this->repo, $this->branch);
        if (preg_match('/^[0-9a-f]{40}$/', $sha) !== 1) {
            throw new \RuntimeException('GitHub did not name the newest version.');
        }
        if (($installed['sha'] ?? '') === $sha) {
            return ['status' => 'current', 'method' => 'zip', 'version' => substr($sha, 0, 7)];
        }

        $zipPath = $this->dataDir . '/update.zip';
        try {
            $this->source->download($this->repo, $sha, $zipPath);
            $files = $this->unpack($zipPath);
        } finally {
            @unlink($zipPath);
        }

        // Files the previous version had and this one has not.
        $now = array_flip($files);
        foreach ($installed['files'] ?? [] as $old) {
            if (is_string($old) && !isset($now[$old]) && self::safePath($old) && !self::kept($old)) {
                @unlink($this->root . '/' . $old);
            }
        }
        file_put_contents($this->dataDir . '/installed.json', json_encode(['sha' => $sha, 'at' => gmdate('c'), 'files' => $files], JSON_UNESCAPED_SLASHES));

        $from = isset($installed['sha']) ? substr((string) $installed['sha'], 0, 7) : '?';

        return ['status' => 'updated', 'method' => 'zip', 'from' => $from, 'to' => substr($sha, 0, 7)];
    }

    /** @return list<string> the files written, relative to the root */
    private function unpack(string $zipPath): array
    {
        $zip = new \ZipArchive();
        if ($zip->open($zipPath) !== true) {
            throw new \RuntimeException('The download is not a ZIP file.');
        }
        try {
            // GitHub puts everything into one folder named after the repository and commit.
            $entries = [];
            for ($i = 0; $i < $zip->numFiles; $i++) {
                $name = (string) $zip->getNameIndex($i);
                $slash = strpos($name, '/');
                $path = $slash === false ? '' : substr($name, $slash + 1);
                if ($path === '' || str_ends_with($path, '/')) {
                    continue;
                }
                if (!self::safePath($path)) {
                    throw new \RuntimeException("Refusing the path {$path} in the download.");
                }
                if (!self::kept($path)) {
                    $entries[$i] = $path;
                }
            }
            $paths = array_flip($entries);
            if (!isset($paths['src/bootstrap.php'], $paths['public/index.html'])) {
                throw new \RuntimeException('The download does not look like Happy Japanese.');
            }

            foreach ($entries as $i => $path) {
                $content = $zip->getFromIndex($i);
                if ($content === false) {
                    throw new \RuntimeException("Could not read {$path} from the download.");
                }
                $target = $this->root . '/' . $path;
                $dir = dirname($target);
                if (!is_dir($dir) && !mkdir($dir, 0775, true) && !is_dir($dir)) {
                    throw new \RuntimeException("Cannot create {$dir}.");
                }
                // Write next to the file and rename, so a request never reads half a file.
                $temp = $target . '.update-' . bin2hex(random_bytes(4));
                if (file_put_contents($temp, $content) === false || !rename($temp, $target)) {
                    @unlink($temp);
                    throw new \RuntimeException("Cannot write {$path}.");
                }
            }

            return array_values($entries);
        } finally {
            $zip->close();
        }
    }

    /** @return array<string, mixed> */
    private function installed(): array
    {
        $file = $this->dataDir . '/installed.json';
        $data = is_file($file) ? json_decode((string) file_get_contents($file), true) : null;

        return is_array($data) ? $data : [];
    }

    private static function safePath(string $path): bool
    {
        return $path !== '' && !str_starts_with($path, '/') && !str_contains($path, '\\') && !str_contains($path, "\0")
            && !in_array('..', explode('/', $path), true) && !in_array('.', explode('/', $path), true);
    }

    private static function kept(string $path): bool
    {
        $first = explode('/', $path)[0];

        return in_array($first, self::KEEP, true);
    }

    /** @param array<string, string> $result */
    private function log(array $result): void
    {
        $file = $this->dataDir . '/update.log';
        if (is_file($file) && filesize($file) > self::LOG_BYTES) {
            file_put_contents($file, substr((string) file_get_contents($file), -intdiv(self::LOG_BYTES, 2)));
        }
        file_put_contents($file, gmdate('Y-m-d H:i:s') . ' ' . json_encode($result, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE) . "\n", FILE_APPEND);
    }
}
