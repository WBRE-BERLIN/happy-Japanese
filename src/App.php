<?php

declare(strict_types=1);

namespace HappyJapanese;

use HappyJapanese\Push\CurlTransport;
use HappyJapanese\Push\Transport;
use HappyJapanese\Push\Vapid;
use HappyJapanese\Push\WebPush;

/** Wires the parts together for one request. */
final class App
{
    public readonly Db $db;
    public readonly Auth $auth;
    public readonly Progress $progress;
    public readonly Vapid $vapid;
    public readonly WebPush $push;
    public readonly Reminders $reminders;

    public function __construct(public readonly Config $config, ?Transport $transport = null)
    {
        $dir = $config->dataDir;
        if (!is_dir($dir) && !mkdir($dir, 0775, true) && !is_dir($dir)) {
            throw new \RuntimeException("Cannot create the data folder {$dir}.");
        }
        if (!is_writable($dir)) {
            throw new \RuntimeException("The data folder {$dir} is not writable.");
        }

        $this->db = new Db($dir . '/happyjapanese.sqlite');
        $this->auth = new Auth($this->db, $config);
        $this->progress = new Progress($this->db);
        $this->vapid = new Vapid($this->db);
        $this->push = new WebPush($this->vapid, $transport ?? new CurlTransport(), $config->pushHosts);
        $this->reminders = new Reminders($this->db, $this->progress, $this->push, $config);
    }
}
