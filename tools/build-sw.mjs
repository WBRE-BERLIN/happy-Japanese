// Writes the list of app files and a content hash into public/sw.js, so the
// service worker caches everything and installed apps update when a file changes.
// Usage: node tools/build-sw.mjs [--check]   (--check fails if sw.js is out of date)
import { createHash } from 'node:crypto';
import { readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { join, relative } from 'node:path';

const root = new URL('../public/', import.meta.url).pathname;
const swPath = join(root, 'sw.js');

function walk(dir) {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    return statSync(path).isDirectory() ? walk(path) : [path];
  });
}

export function shellFiles() {
  const files = walk(join(root, 'assets')).map((p) => relative(root, p)).filter((p) => !p.endsWith('.DS_Store'));
  return ['./', 'index.html', 'manifest.webmanifest', ...files.sort()];
}

export function expectedSw() {
  const files = shellFiles();
  const hash = createHash('sha256');
  for (const file of files) if (file !== './') hash.update(file).update(readFileSync(join(root, file)));
  const version = hash.digest('hex').slice(0, 12);
  const current = readFileSync(swPath, 'utf8');
  return current
    .replace(/const VERSION = '[^']*';/, `const VERSION = '${version}';`)
    .replace(/const SHELL = \[[\s\S]*?\];/, `const SHELL = [\n${files.map((f) => `  '${f}',`).join('\n')}\n];`);
}

if (process.argv[1] && process.argv[1].endsWith('build-sw.mjs')) {
  const next = expectedSw();
  const current = readFileSync(swPath, 'utf8');
  if (process.argv.includes('--check')) {
    if (next !== current) {
      console.error('public/sw.js is out of date. Run: node tools/build-sw.mjs');
      process.exit(1);
    }
    console.log('sw.js is up to date.');
  } else {
    writeFileSync(swPath, next);
    console.log(`sw.js: ${shellFiles().length} files, version ${/VERSION = '([^']+)'/.exec(next)[1]}`);
  }
}
