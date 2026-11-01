<?php

declare(strict_types=1);

/*
 * Happy Japanese server tests: unit tests, then the API through a real PHP
 * server and a fake push service. No dependencies, no internet.
 *
 *     php tests/run.php
 */

$config = require __DIR__ . '/../src/bootstrap.php';

use HappyJapanese\App;
use HappyJapanese\Auth;
use HappyJapanese\Config;
use HappyJapanese\HttpError;
use HappyJapanese\Push\Base64Url;
use HappyJapanese\Push\EcKeys;
use HappyJapanese\Push\Transport;
use HappyJapanese\Push\WebPush;
use HappyJapanese\Update\GitHub;
use HappyJapanese\Update\Source;
use HappyJapanese\Updater;

final class Tests
{
    private int $passed = 0;
    /** @var list<string> */
    private array $failures = [];

    public function run(string $name, Closure $test): void
    {
        try {
            $test();
            $this->passed++;
            echo '.';
        } catch (Throwable $e) {
            $this->failures[] = "✗ {$name}\n    {$e->getMessage()} ({$e->getFile()}:{$e->getLine()})";
            echo 'F';
        }
    }

    public function finish(): never
    {
        echo "\n\n" . implode("\n", $this->failures) . ($this->failures ? "\n\n" : '');
        echo "{$this->passed} passed, " . count($this->failures) . " failed\n";
        exit($this->failures ? 1 : 0);
    }
}

function same(mixed $expected, mixed $actual, string $what = ''): void
{
    if ($expected !== $actual) {
        throw new RuntimeException(($what !== '' ? "{$what}: " : '') . 'expected ' . var_export($expected, true) . ', got ' . var_export($actual, true));
    }
}

function ok(bool $condition, string $what): void
{
    if (!$condition) {
        throw new RuntimeException($what);
    }
}

function tempDir(string $name): string
{
    $dir = sys_get_temp_dir() . '/happyjapanese-test-' . $name . '-' . bin2hex(random_bytes(4));
    mkdir($dir, 0777, true);

    return $dir;
}

function testConfig(string $dir, array $overrides = []): Config
{
    return new Config(...$overrides + [
        'dataDir' => $dir,
        'registration' => 'open',
        'registrationCode' => '',
        'cronToken' => 'cron-secret',
        'pushContact' => 'mailto:test@example.com',
        'pushHosts' => ['127.0.0.1', 'web.push.apple.com', '*http'],
    ]);
}

/** Records pushes instead of sending them. */
final class RecordingTransport implements Transport
{
    /** @var list<array{url: string, headers: array<string, string>, body: string}> */
    public array $sent = [];
    public int $status = 201;

    public function post(string $url, array $headers, string $body): int
    {
        $this->sent[] = ['url' => $url, 'headers' => $headers, 'body' => $body];

        return str_ends_with($url, '/gone') ? 410 : $this->status;
    }
}

/** Talks to the API like the app does: keeps the cookie, sends JSON and the X-Happy header. */
final class Client
{
    /** @var array<string, string> */
    private array $cookies = [];

    public function __construct(private readonly string $base)
    {
    }

    /** @return array{int, array<string, mixed>} */
    public function call(string $method, string $route, ?array $json = null, bool $csrfHeader = true): array
    {
        $handle = curl_init($this->base . '/api.php?r=' . rawurlencode($route));
        $headers = ['Accept: application/json'];
        if ($method !== 'GET' && $csrfHeader) {
            $headers[] = 'X-Happy: 1';
        }
        if ($json !== null) {
            $headers[] = 'Content-Type: application/json';
            curl_setopt($handle, CURLOPT_POSTFIELDS, json_encode($json));
        }
        if ($this->cookies) {
            $headers[] = 'Cookie: ' . implode('; ', array_map(static fn ($k, $v) => "{$k}={$v}", array_keys($this->cookies), $this->cookies));
        }
        curl_setopt_array($handle, [
            CURLOPT_CUSTOMREQUEST => $method,
            CURLOPT_HTTPHEADER => $headers,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_TIMEOUT => 20,
            CURLOPT_HEADERFUNCTION => function ($h, string $line): int {
                if (preg_match('/^Set-Cookie:\s*([^=]+)=([^;]*)/i', $line, $m) === 1) {
                    if ($m[2] === '' || str_contains(strtolower($line), 'max-age=0')) {
                        unset($this->cookies[$m[1]]);
                    } else {
                        $this->cookies[$m[1]] = $m[2];
                    }
                }

                return strlen($line);
            },
        ]);
        $body = (string) curl_exec($handle);
        $status = (int) curl_getinfo($handle, CURLINFO_RESPONSE_CODE);

        return [$status, json_decode($body, true) ?? ['raw' => $body]];
    }

    public function get(string $route): array
    {
        return $this->call('GET', $route);
    }

    public function post(string $route, array $json = []): array
    {
        return $this->call('POST', $route, $json);
    }

    public function forgetCookies(): void
    {
        $this->cookies = [];
    }
}

function startServer(string $docroot, int $port, array $env, ?string $router = null): mixed
{
    $command = array_merge([PHP_BINARY, '-S', "127.0.0.1:{$port}", '-t', $docroot], $router ? [$router] : []);
    $process = proc_open($command, [0 => ['pipe', 'r'], 1 => ['file', '/dev/null', 'w'], 2 => ['file', '/dev/null', 'w']], $pipes, null, $env + getenv());
    for ($i = 0; $i < 50; $i++) {
        if (@fsockopen('127.0.0.1', $port)) {
            return $process;
        }
        usleep(100_000);
    }
    throw new RuntimeException("Server on port {$port} did not start.");
}

$t = new Tests();
$nowMs = static fn (): int => (int) (microtime(true) * 1000);

/* ---------- unit tests ---------- */

$t->run('base64url round trip', function (): void {
    $bytes = random_bytes(65);
    same($bytes, Base64Url::decode(Base64Url::encode($bytes)));
    ok(!str_contains(Base64Url::encode("\xff\xfe\xfd"), '+'), 'no + in base64url');
});

$t->run('web push payload can be decrypted by the browser key', function (): void {
    $browser = EcKeys::generate();
    $auth = random_bytes(16);
    $payload = json_encode(['title' => 'Happy Japanese', 'body' => 'Miau! 12 Aufgaben warten auf dich.'], JSON_UNESCAPED_UNICODE);
    $body = WebPush::encrypt($payload, EcKeys::publicRaw($browser), $auth);
    same(4096, unpack('N', substr($body, 16, 4))[1], 'record size');
    same(65, ord($body[20]), 'key id length');
    same($payload, WebPush::decrypt($body, $browser, $auth));
});

$t->run('vapid token is a valid ES256 JWT for the push service', function () use ($config): void {
    $app = new App(testConfig(tempDir('vapid')), new RecordingTransport());
    $header = $app->vapid->authorization('https://web.push.apple.com/QGuQyavXutnMH', 'mailto:test@example.com', 1_800_000_000);
    ok(preg_match('/^vapid t=([^.]+)\.([^.]+)\.([^,]+), k=(.+)$/', $header, $m) === 1, 'header format');
    $claims = json_decode(Base64Url::decode($m[2]), true);
    same('https://web.push.apple.com', $claims['aud']);
    same('mailto:test@example.com', $claims['sub']);
    same(1_800_000_000 + 43200, $claims['exp']);
    same($app->vapid->publicKey(), $m[4]);
    $verified = openssl_verify("{$m[1]}.{$m[2]}", EcKeys::rawToDer(Base64Url::decode($m[3])), EcKeys::publicFromRaw(Base64Url::decode($m[4])), OPENSSL_ALGO_SHA256);
    same(1, $verified, 'signature');
    // The key pair is kept.
    $again = new App($app->config, new RecordingTransport());
    same($app->vapid->publicKey(), $again->vapid->publicKey());
});

$t->run('push goes only to known push services', function (): void {
    $push = new WebPush((new App(testConfig(tempDir('hosts'), ['pushHosts' => ['web.push.apple.com']]), new RecordingTransport()))->vapid, new RecordingTransport(), ['web.push.apple.com']);
    ok($push->allowed('https://web.push.apple.com/abc'), 'apple');
    ok($push->allowed('https://api.web.push.apple.com/abc'), 'subdomain');
    ok(!$push->allowed('http://web.push.apple.com/abc'), 'plain http');
    ok(!$push->allowed('https://evilweb.push.apple.com.example/abc'), 'look-alike');
    ok(!$push->allowed('https://127.0.0.1/abc'), 'local address');
});

$t->run('registration modes', function (): void {
    $closed = new App(testConfig(tempDir('closed'), ['registration' => 'closed']));
    try {
        $closed->auth->register('anna', 'katzenminze', '', '');
        throw new RuntimeException('closed registration accepted');
    } catch (HttpError $e) {
        same(403, $e->status);
    }
    $code = new App(testConfig(tempDir('code'), ['registration' => 'code', 'registrationCode' => 'neko']));
    try {
        $code->auth->register('anna', 'katzenminze', '', 'wrong');
        throw new RuntimeException('wrong code accepted');
    } catch (HttpError $e) {
        same(403, $e->status);
    }
    same('anna', $code->auth->register('anna', 'katzenminze', 'Anna', 'neko')['username']);
    try {
        Auth::checkUsername('a');
        throw new RuntimeException('one-letter name accepted');
    } catch (HttpError $e) {
        same(422, $e->status);
    }
});

$t->run('reminders: time, days, once a day, idle check, gone subscriptions', function (): void {
    $transport = new RecordingTransport();
    $app = new App(testConfig(tempDir('reminders')), $transport);
    $user = $app->auth->register('ben', 'katzenminze', 'Ben', '');
    $id = (int) $user['id'];
    $browser = EcKeys::generate();
    $auth = random_bytes(16);
    $app->reminders->subscribe($id, ['endpoint' => 'https://web.push.apple.com/device-1', 'keys' => ['p256dh' => Base64Url::encode(EcKeys::publicRaw($browser)), 'auth' => Base64Url::encode($auth)]]);
    $app->reminders->save($id, ['enabled' => true, 'time' => '19:00', 'days' => '12345', 'tz' => 'Europe/Berlin', 'only_idle' => true]);
    // Two items due, one not yet.
    $app->progress->sync($id, ['cursor' => 0, 'states' => [
        ['item' => 'v:4:起きます:r', 'data' => ['due' => 1_000], 'updated_at' => 1_760_000_000_000],
        ['item' => 'v:4:寝ます:r', 'data' => ['due' => 2_000], 'updated_at' => 1_760_000_000_000],
        ['item' => 'v:4:今:r', 'data' => ['due' => PHP_INT_MAX >> 1], 'updated_at' => 1_760_000_000_000],
    ], 'attempts' => []]);

    $tuesday = static fn (string $time): DateTimeImmutable => new DateTimeImmutable("2026-10-13 {$time}", new DateTimeZone('Europe/Berlin'));
    same(0, $app->reminders->run($tuesday('18:55'))['sent'], 'before the time');
    same(1, $app->reminders->run($tuesday('19:05'))['sent'], 'at the time');
    same(0, $app->reminders->run($tuesday('19:20'))['sent'], 'only once a day');
    $message = json_decode(WebPush::decrypt($transport->sent[0]['body'], $browser, $auth), true);
    ok(str_contains($message['body'], '2 Aufgaben'), 'mentions the due items: ' . $message['body']);
    same('aes128gcm', $transport->sent[0]['headers']['Content-Encoding']);

    $saturday = new DateTimeImmutable('2026-10-17 19:05', new DateTimeZone('Europe/Berlin'));
    same(0, $app->reminders->run($saturday)['sent'], 'not on a day off');

    // Wednesday: practised already → nothing.
    $wednesday = new DateTimeImmutable('2026-10-14 19:30', new DateTimeZone('Europe/Berlin'));
    $app->progress->sync($id, ['cursor' => 0, 'states' => [], 'attempts' => [
        ['uid' => 'attempt-0001', 'item' => 'v:4:起きます:r', 'ok' => 1, 'ms' => 2000, 'at' => $wednesday->setTime(8, 0)->getTimestamp() * 1000, 'kind' => 'flash', 'q' => 4, 'tags' => 'L4'],
    ]]);
    same(1, $app->reminders->run($wednesday)['skipped'], 'already practised');

    // Thursday at 23:00 is more than three hours late.
    same(0, $app->reminders->run(new DateTimeImmutable('2026-10-15 23:00', new DateTimeZone('Europe/Berlin')))['sent'], 'too late');

    // A revoked subscription is removed.
    $app->db->run('UPDATE push_subscriptions SET endpoint = ? WHERE user_id = ?', ['https://web.push.apple.com/gone', $id]);
    $app->reminders->run(new DateTimeImmutable('2026-10-16 19:01', new DateTimeZone('Europe/Berlin')));
    same(0, $app->reminders->get($id)['devices'], 'gone subscription deleted');
});

/* ---------- updates ---------- */

/** Serves a prepared ZIP instead of GitHub. */
final class FakeSource implements Source
{
    public int $downloads = 0;

    /** @param array<string, string> $files */
    public function __construct(public string $sha, private readonly array $files)
    {
    }

    public function latestSha(string $repo, string $branch): string
    {
        return $this->sha;
    }

    public function download(string $repo, string $sha, string $target): void
    {
        $this->downloads++;
        $zip = new ZipArchive();
        $zip->open($target, ZipArchive::CREATE | ZipArchive::OVERWRITE);
        foreach ($this->files as $path => $content) {
            $zip->addFromString("happy-Japanese-{$sha}/{$path}", $content);
        }
        $zip->close();
    }
}

function writeFiles(string $root, array $files): void
{
    foreach ($files as $path => $content) {
        @mkdir(dirname("{$root}/{$path}"), 0777, true);
        file_put_contents("{$root}/{$path}", $content);
    }
}

$t->run('update from the ZIP keeps data/ and config.php and removes old files', function (): void {
    $root = tempDir('zip-root');
    writeFiles($root, [
        'config.php' => '<?php return ["cron_token" => "secret"];',
        'data/happyjapanese.sqlite' => 'database',
        'public/index.html' => 'old page',
        'src/Old.php' => 'old class',
        'data/installed.json' => json_encode(['sha' => str_repeat('a', 40), 'files' => ['public/index.html', 'src/Old.php']]),
    ]);
    $source = new FakeSource(str_repeat('b', 40), [
        'public/index.html' => 'new page',
        'src/bootstrap.php' => 'bootstrap',
        'config.php' => 'from GitHub',
        'data/evil.sqlite' => 'never',
    ]);
    $updater = new Updater($root, "{$root}/data", 'WBRE-BERLIN/happy-Japanese', 'main', $source, null);
    $result = $updater->run();
    same('updated', $result['status'], json_encode($result));
    same('zip', $result['method']);
    same('new page', file_get_contents("{$root}/public/index.html"));
    same('bootstrap', file_get_contents("{$root}/src/bootstrap.php"));
    same('<?php return ["cron_token" => "secret"];', file_get_contents("{$root}/config.php"), 'config.php untouched');
    same('database', file_get_contents("{$root}/data/happyjapanese.sqlite"), 'data untouched');
    ok(!is_file("{$root}/data/evil.sqlite"), 'nothing written into data/');
    ok(!is_file("{$root}/src/Old.php"), 'file of the old version removed');
    ok(!is_file("{$root}/data/update.zip"), 'download cleaned up');
    same('bbbbbbb', Updater::version($root, "{$root}/data"));
    same('current', $updater->run()['status'], 'second run has nothing to do');
    same(1, $source->downloads);
    ok(str_contains((string) file_get_contents("{$root}/data/update.log"), '"updated"'), 'logged');
});

$t->run('update refuses a download with paths outside the app', function (): void {
    $root = tempDir('zip-evil');
    writeFiles($root, ['public/index.html' => 'old page', 'data/.keep' => '']);
    $source = new FakeSource(str_repeat('c', 40), ['public/index.html' => 'x', 'src/bootstrap.php' => 'x', '../../escape.txt' => 'x']);
    $result = (new Updater($root, "{$root}/data", 'r/r', 'main', $source, null))->run();
    same('error', $result['status']);
    same('old page', file_get_contents("{$root}/public/index.html"), 'nothing changed');
    ok(!is_file(dirname($root) . '/escape.txt'), 'nothing escaped');
});

$t->run('update of a git clone fast-forwards it', function (): void {
    $git = static function (string $dir, string ...$args): string {
        $out = [];
        exec('git -C ' . escapeshellarg($dir) . ' -c user.name=Test -c user.email=test@example.com ' . implode(' ', array_map('escapeshellarg', $args)) . ' 2>&1', $out, $code);
        if ($code !== 0) {
            throw new RuntimeException(implode("\n", $out));
        }

        return trim(implode("\n", $out));
    };
    $base = tempDir('git');
    exec('git init --quiet --bare -b main ' . escapeshellarg("{$base}/origin.git"));
    exec('git clone --quiet ' . escapeshellarg("{$base}/origin.git") . ' ' . escapeshellarg("{$base}/dev") . ' 2>&1');
    writeFiles("{$base}/dev", ['public/index.html' => 'v1', '.gitignore' => "/config.php\n/data/\n"]);
    $git("{$base}/dev", 'add', '-A');
    $git("{$base}/dev", 'commit', '--quiet', '-m', 'v1');
    $git("{$base}/dev", 'push', '--quiet', 'origin', 'HEAD:main');
    exec('git clone --quiet ' . escapeshellarg("{$base}/origin.git") . ' ' . escapeshellarg("{$base}/server") . ' 2>&1');
    writeFiles("{$base}/server", ['config.php' => 'secret', 'data/db' => 'database']);

    $updater = new Updater("{$base}/server", "{$base}/server/data", 'r/r', 'main', new FakeSource(str_repeat('d', 40), []), Updater::findGit());
    same('current', $updater->run()['status']);

    writeFiles("{$base}/dev", ['public/index.html' => 'v2']);
    $git("{$base}/dev", 'commit', '--quiet', '-am', 'v2');
    $git("{$base}/dev", 'push', '--quiet', 'origin', 'HEAD:main');
    $result = $updater->run();
    same('updated', $result['status'], json_encode($result));
    same('git', $result['method']);
    same('v2', file_get_contents("{$base}/server/public/index.html"));
    same('secret', file_get_contents("{$base}/server/config.php"));
    same(substr($git("{$base}/dev", 'rev-parse', 'HEAD'), 0, 7), Updater::version("{$base}/server", "{$base}/server/data"));

    // A changed file on the server stops the update instead of being overwritten.
    writeFiles("{$base}/server", ['public/index.html' => 'edited on the server']);
    writeFiles("{$base}/dev", ['public/index.html' => 'v3']);
    $git("{$base}/dev", 'commit', '--quiet', '-am', 'v3');
    $git("{$base}/dev", 'push', '--quiet', 'origin', 'HEAD:main');
    same('error', $updater->run()['status']);
    same('edited on the server', file_get_contents("{$base}/server/public/index.html"));
});

$t->run('the branch head is read from the git advertisement', function (): void {
    $sha = str_repeat('e', 40);
    $other = str_repeat('f', 40);
    $body = "001e# service=git-upload-pack\n0000015b{$other} HEAD\0multi_ack side-band-64k\n003f{$other} refs/heads/claude/x\n003d{$sha} refs/heads/main\n0000";
    same($sha, GitHub::shaFromRefs($body, 'main'));
    same(null, GitHub::shaFromRefs($body, 'mai'));
});

/* ---------- API through a real server ---------- */

$data = tempDir('api');
$pushDir = tempDir('push');
$port = random_int(20000, 30000);
$pushPort = $port + 1;
$env = [
    'HAPPYJ_DATA_DIR' => $data,
    'HAPPYJ_CRON_TOKEN' => 'cron-secret',
    'HAPPYJ_PUSH_HOSTS' => '127.0.0.1,*http',
    'HAPPYJ_PUSH_CONTACT' => 'mailto:test@example.com',
    'HAPPYJ_AUTO_UPDATE' => '0',
];
$server = startServer(__DIR__ . '/../public', $port, $env);
$pushServer = startServer(__DIR__, $pushPort, ['FAKE_PUSH_DIR' => $pushDir], __DIR__ . '/fake-push.php');
$base = "http://127.0.0.1:{$port}";

$a = new Client($base);
$b = new Client($base);
$other = new Client($base);

$t->run('signed out session', function () use ($a): void {
    [$status, $body] = $a->get('session');
    same(200, $status);
    same(false, $body['authenticated']);
    same('open', $body['registration']);
    same(401, $a->post('sync', ['cursor' => 0])[0], 'sync needs a sign-in');
});

$t->run('register, duplicate names, short passwords', function () use ($a, $other): void {
    [$status, $body] = $a->post('register', ['username' => 'Anna', 'password' => 'katzenminze', 'display_name' => 'Anna']);
    same(200, $status, json_encode($body));
    same(true, $body['authenticated']);
    same('Anna', $body['user']['username']);
    ok(strlen((string) $body['vapid_public_key']) > 80, 'vapid key for the browser');
    same(409, $other->post('register', ['username' => 'anna', 'password' => 'katzenminze'])[0], 'names are case-insensitive');
    same(422, $other->post('register', ['username' => 'Carla', 'password' => 'kurz'])[0], 'short password');
    same(200, $other->post('register', ['username' => 'Carla', 'password' => 'mochimochi'])[0]);
});

$t->run('writes need the X-Happy header', function () use ($a): void {
    same(403, $a->call('POST', 'sync', ['cursor' => 0], csrfHeader: false)[0]);
});

$t->run('sign in on a second device; wrong passwords lock the name', function () use ($b, $base): void {
    same(401, $b->post('login', ['username' => 'anna', 'password' => 'falsch!!'])[0]);
    [$status, $body] = $b->post('login', ['username' => 'anna', 'password' => 'katzenminze']);
    same(200, $status);
    same(true, $body['authenticated']);

    $intruder = new Client($base);
    for ($i = 0; $i < 5; $i++) {
        $intruder->post('login', ['username' => 'carla', 'password' => "falsch-{$i}"]);
    }
    same(429, $intruder->post('login', ['username' => 'carla', 'password' => 'mochimochi'])[0], 'locked after 5 failures');
});

$t->run('sync between two devices, last write wins', function () use ($a, $b, $nowMs): void {
    $now = $nowMs();
    [$status, $first] = $a->post('sync', [
        'cursor' => 0,
        'states' => [
            ['item' => 'v:6:食べます:r', 'data' => ['due' => $now - 1000, 'ivl' => 1, 'seen' => 1], 'updated_at' => $now - 5000],
            ['item' => 'vf:食べる:te', 'data' => ['due' => $now + 86_400_000, 'ivl' => 1, 'seen' => 1], 'updated_at' => $now - 5000],
        ],
        'attempts' => [
            ['uid' => 'a1b2c3d4-0001', 'item' => 'v:6:食べます:r', 'ok' => 1, 'ms' => 2300, 'at' => $now - 5000, 'kind' => 'flash', 'q' => 4, 'tags' => 'L6 pos:v'],
            ['uid' => 'a1b2c3d4-0002', 'item' => 'vf:食べる:te', 'ok' => 0, 'ms' => 8000, 'at' => $now - 4000, 'kind' => 'input', 'q' => 0, 'tags' => 'form:te grp:2'],
        ],
        'settings' => ['data' => ['lesson' => 7, 'theme' => 'dark'], 'updated_at' => $now - 5000],
    ]);
    same(200, $status, json_encode($first));
    same([], $first['states'], 'own writes are not sent back');
    same([], $first['attempts']);
    ok($first['cursor'] > 0, 'cursor moves');

    [, $second] = $b->post('sync', ['cursor' => 0, 'states' => [], 'attempts' => []]);
    same(2, count($second['states']), 'other device gets the states');
    same(2, count($second['attempts']), 'and the answers');
    same(7, $second['settings']['data']['lesson'], 'and the settings');
    same('L6 pos:v', $second['attempts'][0]['tags']);

    // B changes one item later; A sends an older version of it.
    [, $third] = $b->post('sync', ['cursor' => $second['cursor'], 'states' => [
        ['item' => 'vf:食べる:te', 'data' => ['due' => $now + 4 * 86_400_000, 'ivl' => 4], 'updated_at' => $now - 1000],
    ], 'attempts' => []]);
    [, $fourth] = $a->post('sync', ['cursor' => $first['cursor'], 'states' => [
        ['item' => 'vf:食べる:te', 'data' => ['due' => 1, 'ivl' => 0], 'updated_at' => $now - 3000],
    ], 'attempts' => []]);
    same(1, count($fourth['states']), 'newer server state comes back');
    same(4, $fourth['states'][0]['data']['ivl']);
    [, $fifth] = $b->post('sync', ['cursor' => $third['cursor'], 'states' => [], 'attempts' => []]);
    same([], $fifth['states'], 'older state was ignored');

    // "Als richtig werten" changes an answer that was already sent.
    $b->post('sync', ['cursor' => $fifth['cursor'], 'states' => [], 'attempts' => [
        ['uid' => 'a1b2c3d4-0002', 'item' => 'vf:食べる:te', 'ok' => 1, 'ms' => 8000, 'at' => $now - 4000, 'kind' => 'input', 'q' => 3, 'tags' => 'form:te grp:2'],
    ]]);
    [, $sixth] = $a->post('sync', ['cursor' => $fourth['cursor'], 'states' => [], 'attempts' => []]);
    same(1, count($sixth['attempts']), 'changed answer is sent again');
    same(1, $sixth['attempts'][0]['ok']);
});

$t->run('users never see each other\'s progress', function () use ($other): void {
    [, $body] = $other->post('sync', ['cursor' => 0, 'states' => [], 'attempts' => []]);
    same([], $body['states']);
    same([], $body['attempts']);
    same(null, $body['settings']);
});

$t->run('invalid sync data is refused', function () use ($a): void {
    same(422, $a->post('sync', ['cursor' => 0, 'states' => [['item' => '', 'data' => []]], 'attempts' => []])[0]);
    same(422, $a->post('sync', ['cursor' => 0, 'states' => [], 'attempts' => [['uid' => 'x', 'item' => 'a']]])[0]);
});

$t->run('export has the answers', function () use ($a): void {
    [$status, $body] = $a->get('export');
    same(200, $status);
    same('Anna', $body['user']['username']);
    same(2, count($body['attempts']));
    same(7, $body['settings']['lesson']);
});

$t->run('reminders and a test push through the push service', function () use ($a, $pushDir, $pushPort): void {
    [$status, $reminders] = $a->get('reminders');
    same(200, $status);
    same(false, $reminders['enabled']);
    [, $saved] = $a->post('reminders', ['enabled' => true, 'time' => '07:45', 'days' => '135', 'tz' => 'Europe/Berlin', 'only_idle' => false]);
    same('07:45', $saved['time']);
    same('135', $saved['days']);
    same(422, $a->post('reminders', ['time' => '25:00'])[0]);

    $browser = EcKeys::generate();
    $auth = random_bytes(16);
    same(422, $a->post('push/subscribe', ['subscription' => ['endpoint' => 'https://evil.example/x', 'keys' => ['p256dh' => Base64Url::encode(EcKeys::publicRaw($browser)), 'auth' => Base64Url::encode($auth)]]])[0], 'unknown push service');
    [$status, $subscribed] = $a->post('push/subscribe', ['subscription' => [
        'endpoint' => "http://127.0.0.1:{$pushPort}/push/device-1",
        'keys' => ['p256dh' => Base64Url::encode(EcKeys::publicRaw($browser)), 'auth' => Base64Url::encode($auth)],
    ]]);
    same(200, $status, json_encode($subscribed));
    same(1, $subscribed['devices']);
    [, $test] = $a->post('push/test');
    same(1, $test['sent']);

    $files = glob($pushDir . '/*.json');
    same(1, count($files), 'push service got one message');
    $received = json_decode((string) file_get_contents($files[0]), true);
    same('aes128gcm', $received['headers']['HTTP_CONTENT_ENCODING']);
    ok(str_starts_with($received['headers']['HTTP_AUTHORIZATION'], 'vapid t='), 'vapid header');
    $message = json_decode(WebPush::decrypt(base64_decode($received['body']), $browser, $auth), true);
    same('Happy Japanese', $message['title']);
});

$t->run('cron endpoint needs the token', function () use ($base): void {
    $handle = curl_init("{$base}/cron.php?token=wrong");
    curl_setopt($handle, CURLOPT_RETURNTRANSFER, true);
    curl_exec($handle);
    same(404, curl_getinfo($handle, CURLINFO_RESPONSE_CODE));
    $handle = curl_init("{$base}/cron.php?token=cron-secret");
    curl_setopt($handle, CURLOPT_RETURNTRANSFER, true);
    $body = json_decode((string) curl_exec($handle), true);
    same(200, curl_getinfo($handle, CURLINFO_RESPONSE_CODE));
    ok(isset($body['checked']), 'summary');
});

$t->run('changing the password signs out the other device', function () use ($a, $b): void {
    same(422, $a->post('password', ['current' => 'falsch!!', 'new' => 'neues-passwort'])[0]);
    same(200, $a->post('password', ['current' => 'katzenminze', 'new' => 'neues-passwort'])[0]);
    same(401, $b->post('sync', ['cursor' => 0, 'states' => [], 'attempts' => []])[0], 'other device signed out');
    same(200, $a->post('sync', ['cursor' => 0, 'states' => [], 'attempts' => []])[0], 'this device stays signed in');
});

$t->run('logout and account deletion', function () use ($a, $data): void {
    same(200, $a->post('logout')[0]);
    same(false, $a->get('session')[1]['authenticated']);
    same(200, $a->post('login', ['username' => 'anna', 'password' => 'neues-passwort'])[0]);
    same(422, $a->post('account/delete', ['password' => 'falsch!!'])[0]);
    same(200, $a->post('account/delete', ['password' => 'neues-passwort'])[0]);
    $db = new PDO('sqlite:' . $data . '/happyjapanese.sqlite');
    same(0, (int) $db->query("SELECT COUNT(*) FROM attempts a JOIN users u ON u.id = a.user_id WHERE u.username = 'Anna'")->fetchColumn());
    same(0, (int) $db->query('SELECT COUNT(*) FROM attempts WHERE user_id NOT IN (SELECT id FROM users)')->fetchColumn(), 'answers deleted with the account');
    same(401, $a->post('login', ['username' => 'anna', 'password' => 'neues-passwort'])[0]);
});

proc_terminate($server);
proc_terminate($pushServer);
$t->finish();
