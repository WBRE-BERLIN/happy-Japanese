// Renders the PNG app icons from public/assets/icons/favicon.svg.
// Usage: cd tools && npm install && npm run icons   (CHROMIUM_PATH=/path/to/chrome if needed)
import { readFile, writeFile } from 'node:fs/promises';
import { chromium } from 'playwright-core';

const dir = new URL('../public/assets/icons/', import.meta.url);
const svg = await readFile(new URL('favicon.svg', dir), 'utf8');

// iOS and maskable icons must fill the square; the system rounds the corners itself.
const fullBleed = svg.replace('rx="112"', 'rx="0"');
// Maskable icons may be cropped to a circle: shrink the artwork into the safe zone.
const maskable = fullBleed.replace('<g id="art">', '<g id="art" transform="translate(256 256) scale(.78) translate(-256 -256)">');

const icons = [
  ['icon-192.png', svg, 192],
  ['icon-512.png', svg, 512],
  ['apple-touch-icon.png', fullBleed, 180],
  ['icon-maskable-512.png', maskable, 512],
];

const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || undefined });
const page = await browser.newPage();
for (const [name, source, size] of icons) {
  await page.setViewportSize({ width: size, height: size });
  const src = `data:image/svg+xml;base64,${Buffer.from(source).toString('base64')}`;
  await page.setContent(`<style>html,body{margin:0;background:transparent}</style><img src="${src}" width="${size}" height="${size}">`);
  await page.waitForFunction(() => document.images[0].complete);
  await writeFile(new URL(name, dir), await page.screenshot({ omitBackground: true }));
  console.log('wrote', name);
}
await browser.close();
