// Browser test on an emulated iPhone: sign up, practise, every area, offline, sync.
// Usage: cd tools && npm install && npm run e2e   (CHROMIUM_PATH=/path/to/chrome if needed)
// Screenshots go to tools/output/.
import { spawn, execFileSync } from 'node:child_process';
import { mkdirSync, mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { chromium, devices } from 'playwright-core';

const root = new URL('..', import.meta.url).pathname;
const out = join(root, 'tools/output');
mkdirSync(out, { recursive: true });
const data = mkdtempSync(join(tmpdir(), 'happyjapanese-e2e-'));
const port = 18000 + Math.floor(Math.random() * 1000);
const base = `http://127.0.0.1:${port}`;

const server = spawn('php', ['-S', `127.0.0.1:${port}`, '-t', join(root, 'public')], {
  env: { ...process.env, HAPPYJ_DATA_DIR: data, HAPPYJ_CRON_TOKEN: 'e2e' }, stdio: 'ignore',
});
await new Promise((r) => setTimeout(r, 700));

const errors = [];
const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || undefined });
// Reduced motion switches the fade-in off, so screenshots show the finished screen.
const context = await browser.newContext({ ...devices['iPhone 13'], locale: 'de-DE', timezoneId: 'Europe/Berlin', reducedMotion: 'reduce' });
// iOS has Japanese voices; Chromium on Linux may not, which only hides the speaker buttons.
const page = await context.newPage();
page.on('pageerror', (err) => errors.push(`pageerror: ${err.message}`));
page.on('console', (msg) => { if (msg.type() === 'error' && !/Failed to load resource/.test(msg.text())) errors.push(`console: ${msg.text()}`); });

const shot = (name) => page.screenshot({ path: join(out, `${name}.png`), fullPage: true });
const step = async (name, fn) => {
  process.stdout.write(`• ${name} … `);
  await fn();
  console.log('ok');
};

/** Answers whatever task is on screen; returns false when the session is over. */
async function answerOne(i) {
  await page.waitForSelector('.task, .result', { timeout: 8000 });
  if (await page.$('.result')) return false;
  const kind = await page.$eval('.task', (el) => el.className.replace('task task-', ''));
  if (kind === 'flash') {
    await page.click('.flashcard');
    await page.click(i % 3 ? '[data-act="yes"]' : '[data-act="no"]');
    return true;
  }
  if (kind === 'choice') {
    const options = await page.$$('.choice');
    await options[i % options.length].click();
  } else if (kind === 'input') {
    const numeric = await page.$eval('.answer-input', (el) => el.inputMode === 'numeric');
    await page.fill('.answer-input', numeric ? String(100 + i) : i % 2 ? 'taberu' : 'ねこ');
    await page.click('.answer-form [type="submit"]');
  } else if (kind === 'tiles') {
    for (const tile of await page.$$('.tile-pool .tile')) await tile.click();
    await page.click('[data-act="check"]');
  } else if (kind === 'palette') {
    while (await page.$eval('[data-act="check"]', (b) => b.disabled)) await page.click('.palette .tile');
    await page.click('[data-act="check"]');
  }
  await page.waitForSelector('.feedback');
  const next = await page.$('.feedback [data-act="next"]');
  if (next && await next.isVisible()) await next.click().catch(() => {});
  await page.waitForTimeout(120);
  return true;
}

async function practise(max = 40) {
  for (let i = 0; i < max; i++) if (!(await answerOne(i))) return;
}

try {
  await step('sign up', async () => {
    await page.goto(base);
    await page.waitForSelector('.auth');
    await shot('01-auth');
    await page.click('[data-mode="register"]');
    await page.fill('input[name="username"]', 'Testkatze');
    await page.fill('input[name="display_name"]', 'Mochi-Fan');
    await page.fill('input[name="password"]', 'mochimochi');
    await page.click('.auth-form [type="submit"]');
    await page.waitForSelector('.home-head');
    await shot('02-home-new');
  });

  await step('daily mix', async () => {
    await page.click('[data-act="mix"]');
    await page.waitForSelector('.task');
    await shot('03-task-first');
    await practise();
    await page.waitForSelector('.result');
    await shot('04-result');
    await page.click('[data-act="home"]');
    await page.waitForSelector('.home-head');
  });

  await step('every area', async () => {
    const ids = await page.evaluate(async () => (await import('./assets/js/areas/index.js')).AREAS.map((a) => a.id));
    for (const id of ids) {
      await page.goto(`${base}/#/bereich/${id}`);
      await page.waitForSelector('.view-area');
      const start = (await page.$('[data-act="mix"]:not([disabled])')) ?? (await page.$('[data-act="anyway"]'));
      if (!start) throw new Error(`no way to practise ${id}`);
      await start.click();
      await page.waitForSelector('.task, .sheet [data-dir]');
      // Vocabulary-like areas ask what to see first.
      const direction = await page.$('.sheet [data-dir]');
      if (direction) {
        await shot(`area-${id}-start`);
        await direction.click();
      }
      await page.waitForSelector('.task');
      await shot(`area-${id}`);
      for (let i = 0; i < 4; i++) if (!(await answerOne(i))) break;
      await page.goto(`${base}/#/`);
    }
  });

  await step('pages', async () => {
    for (const [hash, name] of [['#/', 'home'], ['#/bereiche', 'areas'], ['#/fortschritt', 'stats'], ['#/listen', 'lists'], ['#/liste/verbs', 'list-verbs'], ['#/liste/counters', 'list-counters'], ['#/liste/kana', 'list-kana'], ['#/einstellungen', 'settings']]) {
      await page.goto(`${base}/${hash}`);
      await page.waitForSelector('main.view');
      await page.waitForTimeout(150);
      await shot(`page-${name}`);
    }
    await page.goto(`${base}/#/liste/verbs`);
    await page.click('details.list-item summary');
    await shot('page-list-verbs-open');
  });

  await step('large text', async () => {
    await page.goto(`${base}/#/einstellungen`);
    await page.click('[data-seg="fontSize"][data-value="xl"]');
    await page.goto(`${base}/#/bereich/counters`);
    await page.click('[data-act="mix"]');
    await page.waitForSelector('.task');
    await shot('large-task');
    await page.goto(`${base}/#/einstellungen`);
    await page.click('[data-seg="fontSize"][data-value="m"]');
  });

  await step('dark mode', async () => {
    await page.goto(`${base}/#/einstellungen`);
    await page.click('[data-seg="theme"][data-value="dark"]');
    await page.goto(`${base}/#/`);
    await page.waitForSelector('.home-head');
    await shot('dark-home');
    await page.click('[data-act="mix"]');
    await page.waitForSelector('.task');
    await shot('dark-task');
    await answerOne(1);
    await shot('dark-feedback');
    await page.goto(`${base}/#/einstellungen`);
    await page.click('[data-seg="theme"][data-value="light"]');
  });

  await step('offline', async () => {
    await page.goto(`${base}/#/`);
    await page.evaluate(() => navigator.serviceWorker.ready);
    await page.reload();
    await page.waitForSelector('.home-head');
    await context.setOffline(true);
    await page.reload();
    await page.waitForSelector('.home-head', { timeout: 8000 });
    await page.click('[data-act="mix"]');
    for (let i = 0; i < 5; i++) await answerOne(i);
    const pending = await page.evaluate(async () => (await import('./assets/js/app.js')).app.store.pendingCount());
    if (pending < 5) throw new Error(`expected pending answers offline, got ${pending}`);
    await page.goto(`${base}/#/`).catch(() => {});
    await context.setOffline(false);
    await page.evaluate(async () => (await import('./assets/js/app.js')).app.sync({ quiet: true }));
    const left = await page.evaluate(async () => (await import('./assets/js/app.js')).app.store.pendingCount());
    if (left !== 0) throw new Error(`still ${left} changes not synced`);
  });

  await step('server has the answers', async () => {
    const count = execFileSync('php', ['-r', `$db = new PDO('sqlite:${data}/happyjapanese.sqlite'); echo $db->query('SELECT COUNT(*) FROM attempts')->fetchColumn();`]).toString();
    if (Number(count) < 30) throw new Error(`only ${count} answers on the server`);
  });

  await step('second device gets the progress', async () => {
    const other = await browser.newContext({ ...devices['iPhone 13'], locale: 'de-DE' });
    const p2 = await other.newPage();
    p2.on('pageerror', (err) => errors.push(`pageerror (device 2): ${err.message}`));
    await p2.goto(base);
    await p2.fill('input[name="username"]', 'testkatze');
    await p2.fill('input[name="password"]', 'mochimochi');
    await p2.click('.auth-form [type="submit"]');
    await p2.waitForSelector('.home-head', { timeout: 8000 }).catch(async (err) => {
      await p2.screenshot({ path: join(out, 'failure-device-2.png'), fullPage: true });
      throw err;
    });
    await p2.waitForFunction(async () => (await import('./assets/js/app.js')).app.store.attempts.length >= 30, null, { timeout: 8000 });
    await other.close();
  });
} catch (err) {
  await shot('failure').catch(() => {});
  errors.push(err.stack ?? String(err));
} finally {
  await browser.close();
  server.kill();
}

if (errors.length) {
  console.error(`\n${errors.length} problem(s):\n${errors.join('\n')}`);
  process.exit(1);
}
console.log(`\nAll good. Screenshots in ${out}`);
