<?php

declare(strict_types=1);

namespace HappyJapanese\Update;

/** Where new versions come from (GitHub; the tests use a fake). */
interface Source
{
    /** The newest commit of the branch, 40 hex digits. */
    public function latestSha(string $repo, string $branch): string;

    /** Saves the ZIP of that commit to $target. */
    public function download(string $repo, string $sha, string $target): void;
}
