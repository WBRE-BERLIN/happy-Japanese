<?php

declare(strict_types=1);

namespace HappyJapanese\Push;

/** Sends one HTTP POST to a push service. */
interface Transport
{
    /** @param array<string, string> $headers @return int HTTP status, 0 if no answer */
    public function post(string $url, array $headers, string $body): int;
}
