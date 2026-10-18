import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { expectedSw } from '../../tools/build-sw.mjs';

test('service worker lists every app file (run node tools/build-sw.mjs)', () => {
  assert.equal(readFileSync(new URL('../../public/sw.js', import.meta.url), 'utf8'), expectedSw());
});
