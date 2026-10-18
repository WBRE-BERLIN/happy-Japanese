<?php

declare(strict_types=1);

namespace HappyJapanese;

/** An error the API reports to the app with a status code and a readable (German) message. */
final class HttpError extends \RuntimeException
{
    public function __construct(public readonly int $status, string $message)
    {
        parent::__construct($message);
    }
}
