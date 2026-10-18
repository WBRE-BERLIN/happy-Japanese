/* Numbers and time: numbers, prices, clock, dates, time words, counters. */
import {
  COUNTERS, COUNT_OBJECTS, TIME_GRID, WEEKDAYS, counterById, counterDistractors, counterReading, dayReading, monthReading,
  numberKana, numberKanji, numberParts, priceParts, timeParts, yearParts,
} from '../lib/numbers.js';
import { canSpeak, html, jp, raw } from '../lib/ui.js';
import { choiceTask, furiWord, pick, rand, sample, shuffle } from './common.js';

const fmt = (n) => n.toLocaleString('en-US');

/* ---------- shared builders ---------- */

/** Tiles for reading parts plus a few wrong tiles. */
function partsTiles(parts, rng, extraWrong = []) {
  const right = parts.map((p) => p.kana);
  const allowed = new Set(parts.flatMap((p) => [p.kana, ...p.alt]));
  const wrong = shuffle([...new Set([...parts.flatMap((p) => p.wrong), ...extraWrong])].filter((w) => !allowed.has(w)), rng).slice(0, Math.min(3, Math.max(2, parts.length)));
  return {
    tiles: shuffle([...right, ...wrong].map((kana) => ({ key: kana, html: `<span lang="ja">${kana}</span>` })), rng),
    solutions: [parts.map((p) => [p.kana, ...p.alt])],
    answerHtml: html`<span lang="ja">${right.join(' ')}</span>`.text,
  };
}

const speakerPrompt = (text) => html`<button class="speaker-big" data-speak="${text}" aria-label="Noch einmal anhören">${raw('<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9.5h3.5L12 5.5v13l-4.5-4H4z"/><path d="M15.5 9a4 4 0 0 1 0 6M18 6.5a7.5 7.5 0 0 1 0 11"/></svg>')}</button>`.text;

/* ---------- numbers ---------- */

const between = (lo, hi, rng) => lo + rand(hi - lo + 1, rng);
/** A number with only a few significant digits, so it looks like a real price or amount. */
const round = (n, keep, rng) => {
  const digits = String(n).length;
  const unit = 10 ** Math.max(0, digits - keep - (rng() < 0.5 ? 1 : 0));
  return Math.max(unit, Math.round(n / unit) * unit);
};

const NUMBER_FOCUS = [
  { id: '1-10', range: 'small', label: '1 bis 10', gen: (r) => between(0, 10, r) },
  { id: '11-99', range: 'small', label: '11 bis 99', gen: (r) => between(11, 99, r) },
  { id: '100', range: 'mid', label: 'Hunderter', gen: (r) => between(100, 999, r) },
  { id: '300', range: 'mid', label: '300 (さんびゃく)', gen: (r) => between(300, 399, r) },
  { id: '600', range: 'mid', label: '600 (ろっぴゃく)', gen: (r) => between(600, 699, r) },
  { id: '800', range: 'mid', label: '800 (はっぴゃく)', gen: (r) => between(800, 899, r) },
  { id: '1000', range: 'mid', label: 'Tausender', gen: (r) => between(1000, 9999, r) },
  { id: '3000', range: 'mid', label: '3000 (さんぜん)', gen: (r) => between(3000, 3999, r) },
  { id: '8000', range: 'mid', label: '8000 (はっせん)', gen: (r) => between(8000, 8999, r) },
  { id: 'man', range: 'big', label: 'Zehntausender (万)', gen: (r) => round(between(10000, 99999, r), 3, r) },
  { id: 'ichiman', range: 'big', label: '10.000 (いちまん)', gen: (r) => round(between(10000, 19999, r), 3, r) },
  { id: 'manbig', range: 'big', label: 'Hunderttausende, Millionen', gen: (r) => round(between(100000, 9999999, r), 3, r) },
  { id: 'issenman', range: 'big', label: '10 Millionen (いっせんまん)', gen: (r) => round(between(10000000, 19999999, r), 3, r) },
  { id: 'oku', range: 'big', label: 'Hundert Millionen (億)', gen: (r) => round(between(100000000, 9999999999, r), 2, r) },
];

/** Tags for the sound changes a number contains. */
function numberTags(n) {
  const tags = [];
  for (let group = n; group > 0; group = Math.floor(group / 10000)) {
    const g = group % 10000;
    const h = Math.floor(g / 100) % 10;
    const t = Math.floor(g / 1000);
    if ([3, 6, 8].includes(h)) tags.push(`snd:${h}00`);
    if ([3, 8].includes(t)) tags.push(`snd:${t}000`);
  }
  if (Math.floor(n / 10000) % 10000 === 1) tags.push('snd:ichiman');
  if (Math.floor(n / 10000000) % 10 === 1) tags.push('snd:issenman');
  return [...new Set(tags)];
}

const NUMBER_MODES = { build: 'Lesung bauen (Bausteine)', read: 'Lesung → Zahl', kanji: 'Kanji-Zahl → Zahl', hear: 'Hören → Zahl', mix: 'Gemischt' };

function numberTask(n, mode, rng, { label, parts = numberParts(n), suffix = '', visual = '' } = {}) {
  const kana = parts.map((p) => p.kana).join('');
  if (mode === 'hear' && !canSpeak()) mode = 'read';
  if (mode === 'build') {
    return {
      kind: 'tiles', visual,
      label: label ?? 'Wie liest man die Zahl?',
      prompt: html`<div class="big-number">${fmt(n)}${suffix}</div>`.text,
      ...partsTiles(parts, rng),
      speakAnswer: kana,
    };
  }
  const prompt = {
    read: html`<div class="big-jp" lang="ja">${parts.map((p) => p.kana).join(' ')}</div>`.text,
    kanji: html`<div class="big-jp" lang="ja">${numberKanji(n)}${suffix ? '円' : ''}</div>`.text,
    hear: speakerPrompt(kana),
  }[mode];
  return {
    kind: 'input', numeric: true, visual,
    label: { read: 'Welche Zahl ist das?', kanji: 'Welche Zahl ist das?', hear: 'Hör zu: Welche Zahl hörst du?' }[mode],
    prompt,
    speak: mode === 'hear' ? kana : undefined,
    autoSpeak: mode === 'hear',
    accept: [String(n)],
    answerHtml: html`${fmt(n)}${suffix} = <span lang="ja">${parts.map((p) => p.kana).join(' ')}</span>`.text,
    speakAnswer: kana,
  };
}

export const numbers = {
  id: 'numbers',
  title: 'Zahlen',
  group: 'zahl',
  icon: 'hash',
  blurb: 'Große Zahlen bilden, lesen und hören – mit 万 und 億',
  options: [
    { key: 'range', label: 'Bereich', choices: { all: 'Alle', small: 'bis 100', mid: '100 bis 9.999', big: 'ab 10.000 (万, 億)' }, default: 'all' },
    { key: 'mode', label: 'Übungsart', choices: NUMBER_MODES, default: 'mix' },
  ],
  ref: 'numbers',
  items(ctx) {
    const modes = ctx.opts.mode && ctx.opts.mode !== 'mix' ? [ctx.opts.mode] : ['build', 'read', 'kanji', 'hear'];
    return NUMBER_FOCUS.filter((f) => !ctx.opts.range || ctx.opts.range === 'all' || f.range === ctx.opts.range)
      .flatMap((f) => modes.map((mode) => ({ id: `num:${mode}:${f.id}`, lesson: f.range === 'small' ? 1 : 3, tags: [`num:${mode}`, `num:${f.range}`], focus: f, mode })));
  },
  task(item, ctx) {
    const n = item.focus.gen(ctx.rng);
    return { ...numberTask(n, item.mode, ctx.rng), tags: numberTags(n) };
  },
};

/* ---------- prices ---------- */

const PRODUCTS = [
  ['🍙', 'おにぎり', 110, 250], ['☕', 'コーヒー', 280, 650], ['🍜', 'ラーメン', 750, 1600], ['🍱', 'お{弁当|べんとう}', 450, 1300],
  ['🍣', 'すし', 1200, 9800], ['🍺', 'ビール', 380, 880], ['🍵', 'お{茶|ちゃ}', 130, 480], ['🍰', 'ケーキ', 320, 780],
  ['🎫', '{切符|きっぷ}', 140, 1980], ['🚄', '{新幹線|しんかんせん}の{切符|きっぷ}', 8000, 29000], ['🏨', 'ホテル', 7800, 38000],
  ['🚕', 'タクシー', 730, 6800], ['📷', 'カメラ', 24800, 189000], ['👘', '{着物|きもの}', 39800, 298000], ['🧴', 'シャンプー', 398, 1480],
  ['🍡', 'だんご', 120, 480], ['🎁', 'お{土産|みやげ}', 540, 5400], ['🍶', 'お{酒|さけ}', 980, 4800],
];

const priceTags = (n) => [...numberTags(n), ...(n % 10 === 4 ? ['snd:yoen'] : [])];

const PRICE_FOCUS = [
  { id: 'small', label: 'unter 1.000円', test: (p) => p[3] < 1000 || p[2] < 1000 },
  { id: 'sen', label: '1.000 bis 9.999円', test: (p) => p[3] >= 1000 && p[2] < 10000 },
  { id: 'man', label: 'ab 10.000円', test: (p) => p[3] >= 10000 },
  { id: 'yoen', label: 'Preise auf 4円 (よえん)', test: (p) => p[2] < 1000 },
];

export const prices = {
  id: 'prices',
  title: 'Preise & Geld',
  group: 'zahl',
  icon: 'yen',
  blurb: 'Was kostet das? Preise lesen, sagen und verstehen',
  options: [{ key: 'mode', label: 'Übungsart', choices: { build: 'Preis sagen (Bausteine)', hear: 'Hören → Preis', read: 'Lesung → Preis', mix: 'Gemischt' }, default: 'mix' }],
  ref: 'numbers',
  items(ctx) {
    const modes = ctx.opts.mode && ctx.opts.mode !== 'mix' ? [ctx.opts.mode] : ['build', 'hear', 'read'];
    return PRICE_FOCUS.flatMap((f) => modes.map((mode) => ({ id: `pr:${mode}:${f.id}`, lesson: 3, tags: [`num:${mode}`, 'num:price'], focus: f, mode })));
  },
  task(item, ctx) {
    const product = pick(PRODUCTS.filter(item.focus.test), ctx.rng);
    let n = round(between(product[2], product[3], ctx.rng), 3, ctx.rng);
    if (n >= 100 && n < 10000 && ctx.rng() < 0.5) n = Math.floor(n / 100) * 100 + (ctx.rng() < 0.5 ? 80 : 98) % 100;
    if (item.focus.id === 'yoen') n = Math.floor(between(product[2], Math.min(product[3], 999), ctx.rng) / 10) * 10 + 4;
    const visual = html`<div class="price-tag"><span class="price-emoji">${product[0]}</span><span class="price-name">${jp(product[1])}</span></div>`.text;
    return {
      ...numberTask(n, item.mode, ctx.rng, { label: 'Wie sagt man den Preis?', parts: priceParts(n), suffix: '円', visual }),
      tags: priceTags(n),
    };
  },
};

/* ---------- clock ---------- */

export function clockSvg(h, m) {
  const hourAngle = ((h % 12) + m / 60) * 30;
  const minuteAngle = m * 6;
  const ticks = Array.from({ length: 60 }, (_, i) => {
    const major = i % 5 === 0;
    return `<line x1="50" y1="${major ? 7 : 8}" x2="50" y2="${major ? 12 : 10}" transform="rotate(${i * 6} 50 50)" class="${major ? 'tick major' : 'tick'}"/>`;
  }).join('');
  const numbersSvg = Array.from({ length: 12 }, (_, i) => {
    const angle = ((i + 1) * 30 - 90) * (Math.PI / 180);
    return `<text x="${(50 + 31 * Math.cos(angle)).toFixed(1)}" y="${(50 + 31 * Math.sin(angle) + 3.6).toFixed(1)}" class="clock-num">${i + 1}</text>`;
  }).join('');
  return `<svg class="clock" viewBox="0 0 100 100" role="img" aria-label="Uhr: ${h}:${String(m).padStart(2, '0')}">
    <circle cx="50" cy="50" r="46" class="clock-face"/>${ticks}${numbersSvg}
    <line x1="50" y1="50" x2="50" y2="27" class="hand hour" transform="rotate(${hourAngle} 50 50)"/>
    <line x1="50" y1="50" x2="50" y2="15" class="hand minute" transform="rotate(${minuteAngle} 50 50)"/>
    <circle cx="50" cy="50" r="2.6" class="clock-pin"/></svg>`;
}

const MINUTE_FOCUS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 'x0', 'han'];

/** A wrong time reading: one part replaced by a typical mistake or a near time. */
function wrongTimes(h, m, ampm, rng) {
  const parts = timeParts(h, m, { ampm });
  const out = new Set();
  parts.forEach((p, i) => {
    for (const w of p.wrong) out.add(parts.map((q, j) => (j === i ? w : q.kana)).join(' '));
  });
  // neighbours: other hour, other minutes, hands swapped
  const near = [[(h + 1) % 24, m], [h, (m + 5) % 60], [(h + 23) % 24, m], [Math.round(m / 5) % 12, (h % 12) * 5]];
  for (const [nh, nm] of near) out.add(timeParts(nh, nm, { ampm }).map((p) => p.kana).join(' '));
  out.delete(parts.map((p) => p.kana).join(' '));
  return shuffle([...out], rng);
}

export const clock = {
  id: 'clock',
  title: 'Uhrzeit',
  group: 'zahl',
  icon: 'clock',
  blurb: 'よじ, しちじ, くじ, いっぷん … die Uhr ablesen',
  options: [{ key: 'mode', label: 'Übungsart', choices: { mix: 'Gemischt', analog: 'Analoge Uhr (Auswahl)', digital: 'Digital mit ごぜん/ごご (Bausteine)' }, default: 'mix' }],
  ref: 'time',
  items(ctx) {
    const hours = Array.from({ length: 12 }, (_, i) => ({ id: `clk:h:${i + 1}`, lesson: 4, tags: [`time:h${i + 1}`], focus: { hour: i + 1 } }));
    const minutes = MINUTE_FOCUS.map((m) => ({ id: `clk:m:${m}`, lesson: 4, tags: [`time:m${m}`], focus: { minute: m } }));
    return ctx.opts.mode === 'analog' ? hours : [...hours, ...minutes];
  },
  task(item, ctx) {
    const { focus } = item;
    const r = ctx.rng;
    let mode = ctx.opts.mode === 'analog' || ctx.opts.mode === 'digital' ? ctx.opts.mode : pick(['analog', 'digital'], r);
    if (focus.minute !== undefined) mode = 'digital';
    let h = focus.hour ? (focus.hour % 12) + (r() < 0.5 ? 0 : 12) : rand(24, r);
    let m;
    if (focus.minute === 'han') m = 30;
    else if (focus.minute === 'x0') m = pick([10, 20, 40, 50], r);
    else if (focus.minute) m = rand(6, r) * 10 + focus.minute;
    else m = mode === 'analog' ? rand(12, r) * 5 : rand(60, r);
    if (focus.hour === 12) h = r() < 0.5 ? 0 : 12;
    const ampm = mode === 'digital';
    const parts = timeParts(h, m, { ampm });
    const reading = parts.map((p) => p.kana).join(' ');
    const tags = [`time:h${h % 12 || 12}`, ...(m === 30 ? ['time:mhan'] : m ? [`time:m${m % 10 || 'x0'}`] : [])];
    if (mode === 'analog') {
      return {
        ...choiceTask({ label: 'Wie spät ist es?', prompt: '', visual: clockSvg(h, m), columns: 1, speakAnswer: reading.replace(/ /g, '') },
          html`<span lang="ja">${reading}</span>`.text, wrongTimes(h, m, false, r).slice(0, 3).map((w) => html`<span lang="ja">${w}</span>`.text), r),
        tags,
      };
    }
    const shown = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
    return {
      kind: 'tiles',
      label: 'Wie spät ist es? (mit ごぜん / ごご)',
      visual: html`<div class="digital-clock">${shown}</div>`.text,
      prompt: '',
      ...partsTiles(parts, r),
      speakAnswer: reading.replace(/ /g, ''),
      explain: m === 30 ? html`30 Minuten: はん oder さんじゅっぷん.`.text : '',
      tags,
    };
  },
};

/* ---------- dates ---------- */

const daysIn = (year, month) => new Date(year, month, 0).getDate();
const dateText = (y, m, d) => `${m}月${d}日（${WEEKDAYS[new Date(y, m - 1, d).getDay()].short}）`;

export const dates = {
  id: 'dates',
  title: 'Datum & Wochentage',
  group: 'zahl',
  icon: 'calendar',
  blurb: 'ついたち, ふつか … Monate, Tage, Wochentage, Jahre',
  options: [{ key: 'mode', label: 'Übungsart', choices: { mix: 'Gemischt', read: 'Datum lesen (Bausteine)', day: 'Tage des Monats', week: 'Wochentage', year: 'Jahreszahlen' }, default: 'mix' }],
  ref: 'dates',
  items(ctx) {
    const mode = ctx.opts.mode ?? 'mix';
    const items = [];
    if (mode === 'mix' || mode === 'read' || mode === 'day') {
      for (let d = 1; d <= 31; d++) items.push({ id: `dt:d:${d}`, lesson: 5, tags: [`date:d${d <= 10 || [14, 20, 24].includes(d) ? 'irr' : 'reg'}`], focus: { day: d } });
    }
    if (mode === 'mix' || mode === 'read') for (let m = 1; m <= 12; m++) items.push({ id: `dt:m:${m}`, lesson: 5, tags: [`date:m${[4, 7, 9].includes(m) ? m : 'x'}`], focus: { month: m } });
    if (mode === 'mix' || mode === 'week') for (let w = 0; w < 7; w++) items.push({ id: `dt:w:${w}`, lesson: 4, tags: ['date:wd'], focus: { weekday: w } });
    if (mode === 'mix' || mode === 'year') items.push(...['y:a', 'y:b', 'y:c'].map((id) => ({ id: `dt:${id}`, lesson: 5, tags: ['date:year'], focus: { year: true } })));
    return items;
  },
  task(item, ctx) {
    const r = ctx.rng;
    const { focus } = item;
    const mode = ctx.opts.mode ?? 'mix';
    const year = new Date().getFullYear();

    if (focus.weekday !== undefined) {
      const wd = WEEKDAYS[focus.weekday];
      const others = sample(WEEKDAYS.filter((w) => w !== wd), 3, r);
      return r() < 0.5
        ? choiceTask({ label: 'Welcher Wochentag ist das?', prompt: html`<div class="big-jp">${jp(furiWord(wd.kanji, wd.kana))}</div>`.text, speak: wd.kana, columns: 2 },
          html`${wd.de}`.text, others.map((w) => html`${w.de}`.text), r)
        : choiceTask({ label: 'Wie heißt der Wochentag auf Japanisch?', prompt: html`<div class="big-de">${wd.de}</div>`.text, speakAnswer: wd.kana, columns: 1 },
          jp(furiWord(wd.kanji, wd.kana)).text, others.map((w) => jp(furiWord(w.kanji, w.kana)).text), r);
    }

    if (focus.year) {
      const y = pick([between(1960, 2035, r), between(2000, 2030, r), between(1985, 2010, r)], r);
      return { ...numberTask(y, 'build', r, { label: 'Wie liest man das Jahr?', parts: yearParts(y), suffix: '年' }), tags: ['date:year'] };
    }

    let month = focus.month ?? between(1, 12, r);
    const day = focus.day ?? between(1, daysIn(year, month), r);
    while (day > daysIn(year, month)) month = between(1, 12, r);
    const weekday = WEEKDAYS[new Date(year, month - 1, day).getDay()];
    const calendar = html`<div class="calendar-page"><div class="cal-month" lang="ja">${month}月</div><div class="cal-day">${day}</div><div class="cal-week" lang="ja">${weekday.kanji.slice(0, 1)}</div></div>`.text;

    if (focus.day && mode !== 'read' && r() < 0.6) {
      const reading = dayReading(day);
      const near = [day - 1, day + 1, day + 10, day - 10].filter((d) => d >= 1 && d <= 31).map((d) => dayReading(d).kana);
      const wrong = [...new Set([...reading.wrong, ...near])].filter((w) => w !== reading.kana);
      return choiceTask({ label: 'Wie liest man den Tag?', prompt: html`<div class="big-jp" lang="ja">${day}日</div>`.text, speakAnswer: reading.kana, columns: 2 },
        html`<span lang="ja">${reading.kana}</span>`.text, shuffle(wrong, r).slice(0, 3).map((w) => html`<span lang="ja">${w}</span>`.text), r);
    }

    const parts = [
      { ...monthReading(month) },
      { ...dayReading(day) },
      { kana: weekday.kana, alt: [], wrong: [] },
    ];
    const otherWeekday = pick(WEEKDAYS.filter((w) => w !== weekday), r).kana;
    return {
      kind: 'tiles',
      label: 'Lies das Datum vor',
      visual: calendar,
      prompt: html`<div class="big-jp" lang="ja">${dateText(year, month, day)}</div>`.text,
      ...partsTiles(parts, r, [otherWeekday]),
      speakAnswer: parts.map((p) => p.kana).join(''),
    };
  },
};

/* ---------- time words ---------- */

const GRID_ITEMS = TIME_GRID.rows.flatMap((row) => row.words.map((w, col) => (w ? { row, col, w } : null)).filter(Boolean));

function gridSvg(row, col) {
  const labels = ['−2', '−1', 'jetzt', '+1', '+2'];
  return html`<div class="time-grid">
    <div class="tg-row tg-head"><span></span>${labels.map((l, i) => html`<span class="${i === 2 ? 'now' : ''}">${l}</span>`)}</div>
    ${TIME_GRID.rows.filter((r) => ['day', 'week', 'month', 'year'].includes(r.id) || r === row).map((r) => html`<div class="tg-row"><span class="tg-label">${r.de}</span>
      ${r.words.map((w, i) => html`<span class="tg-cell ${r === row && i === col ? 'target' : ''} ${!w ? 'empty' : ''} ${i === 2 ? 'now' : ''}">${r === row && i === col ? '?' : ''}</span>`)}</div>`)}
  </div>`.text;
}

export const timeWords = {
  id: 'timewords',
  title: 'Zeitangaben',
  group: 'zahl',
  icon: 'hourglass',
  blurb: 'Gestern, nächste Woche, letztes Jahr, jeden Morgen …',
  options: [],
  ref: 'dates',
  items() {
    return [
      ...GRID_ITEMS.map((g) => ({ id: `tw:${g.w[1]}`, lesson: g.row.id === 'day' || g.row.id === 'morning' || g.row.id === 'evening' ? 4 : 5, tags: [`tw:${g.row.id}`], g })),
      ...TIME_GRID.every.map((w) => ({ id: `tw:${w[1]}`, lesson: 4, tags: ['tw:every'], every: w })),
    ];
  },
  task(item, ctx) {
    const r = ctx.rng;
    if (item.every) {
      const [kanji, kana, de] = item.every;
      const others = sample(TIME_GRID.every.filter((w) => w !== item.every), 3, r);
      return choiceTask({ label: 'Wie sagt man das?', prompt: html`<div class="big-de">${de}</div>`.text, speakAnswer: kana, columns: 1 },
        jp(furiWord(kanji, kana)).text, others.map((w) => jp(furiWord(w[0], w[1])).text), r);
    }
    const { row, col, w } = item.g;
    const sameRow = row.words.filter((x) => x && x !== w);
    const sameCol = TIME_GRID.rows.map((rw) => rw.words[col]).filter((x) => x && x !== w);
    const wrong = shuffle([...new Set([...sameRow, ...sameCol])], r).slice(0, 3);
    return choiceTask({
      label: `Welches Wort gehört ins markierte Feld? (${w[2]})`,
      prompt: '',
      visual: gridSvg(row, col),
      speakAnswer: w[1],
      columns: 1,
    }, jp(furiWord(w[0], w[1])).text, wrong.map((x) => jp(furiWord(x[0], x[1])).text), r);
  },
};

/* ---------- counters ---------- */

const COMMON = new Set(['tsu', 'nin', 'mai', 'dai', 'hon', 'satsu', 'hiki', 'ko', 'hai', 'kai', 'kaidan', 'sai']);

// How to show "n of" for counters without objects.
const ABSTRACT = {
  kai: ['🔁', (n) => `${n}-mal`], kaidan: ['🏢', (n) => `${n}. Stock`], sai: ['🎂', (n) => `${n} Jahre alt`], haku: ['🏨', (n) => `${n} Übernachtung${n > 1 ? 'en' : ''}`],
  mei: ['🍽️', (n) => `${n} Person${n > 1 ? 'en' : ''} (im Restaurant)`], ban: ['🎫', (n) => `Nummer ${n}`], bansen: ['🚉', (n) => `Gleis ${n}`],
  gousha: ['🚃', (n) => `Wagen ${n}`], do: ['🌡️', (n) => `${n} Grad`], jikan: ['⏱️', (n) => `${n} Stunde${n > 1 ? 'n' : ''}`],
  fun: ['⏱️', (n) => `${n} Minute${n > 1 ? 'n' : ''}`], nichi: ['📅', (n) => `${n} Tag${n > 1 ? 'e' : ''}`], shuukan: ['📅', (n) => `${n} Woche${n > 1 ? 'n' : ''}`],
  kagetsu: ['📅', (n) => `${n} Monat${n > 1 ? 'e' : ''}`], nen: ['📅', (n) => `${n} Jahr${n > 1 ? 'e' : ''}`],
};

const counterLabel = (c) => html`<span class="counter-opt"><span lang="ja">${c.kanji}</span> <span class="muted small" lang="ja">${c.kana}</span></span>`.text;
const counterExplain = (c) => html`<p><strong lang="ja">${c.kanji}（${c.kana}）</strong>: ${c.de}</p><p class="small" lang="ja">${c.readings.slice(0, 6).join('・')} …</p>`.text;

export const counters = {
  id: 'counters',
  title: 'Zählwörter',
  group: 'zahl',
  icon: 'abacus',
  blurb: 'まい, だい, ほん, ひき … mit Lautwandel: さんぼん, ろっぴき',
  options: [
    { key: 'set', label: 'Zählwörter', choices: { common: 'Die wichtigsten 12', all: 'Alle', duration: 'Zeitdauer (時間, 週間 …)' }, default: 'common' },
    { key: 'mode', label: 'Übungsart', choices: { mix: 'Gemischt', pick: 'Welches Zählwort?', count: 'Wie viele? (Lesung)' }, default: 'mix' },
  ],
  ref: 'counters',
  items(ctx) {
    const set = ctx.opts.set ?? 'common';
    const mode = ctx.opts.mode ?? 'mix';
    const chosen = COUNTERS.filter((c) => (set === 'all' ? true : set === 'duration' ? c.duration : COMMON.has(c.id)));
    const ids = new Set(chosen.map((c) => c.id));
    const items = [];
    if (mode !== 'count' && set !== 'duration') {
      for (const [emoji, , , accepted] of COUNT_OBJECTS) {
        if (accepted.some((id) => ids.has(id))) items.push({ id: `ct:pick:${emoji}`, lesson: 11, tags: accepted.map((id) => `ctr:${id}`), object: COUNT_OBJECTS.find((o) => o[0] === emoji) });
      }
    }
    if (mode !== 'pick') {
      for (const c of chosen) for (let n = 1; n <= 10; n++) items.push({ id: `ct:n:${c.id}:${n}`, lesson: c.lesson, tags: [`ctr:${c.id}`], counter: c, n });
    }
    return items;
  },
  task(item, ctx) {
    const r = ctx.rng;
    if (item.object) {
      const [emoji, name, de, accepted] = item.object;
      const right = counterById[accepted[0]];
      const others = sample(COUNTERS.filter((c) => !accepted.includes(c.id) && !c.duration && !['ban', 'bansen', 'gousha', 'do', 'kaidan', 'sai', 'kai', 'mei'].includes(c.id)), 3, r);
      return choiceTask({
        label: `Mit welchem Zählwort zählt man ${de}?`,
        visual: html`<div class="count-emoji single">${emoji}</div>`.text,
        prompt: html`<div class="big-jp">${jp(name)}</div>`.text,
        columns: 2,
        explain: accepted.map((id) => counterExplain(counterById[id])).join(''),
      }, counterLabel(right), others.map(counterLabel), r);
    }
    const { counter: c, n } = item;
    const reading = counterReading(c, n);
    const objects = COUNT_OBJECTS.filter((o) => o[3].includes(c.id));
    let visual;
    let label;
    if (objects.length && !ABSTRACT[c.id]) {
      const [emoji, , de] = pick(objects, r);
      visual = html`<div class="count-emoji">${Array.from({ length: n }, () => emoji).join('')}</div>`.text;
      label = `Wie viele ${de}? (${n})`;
    } else {
      const [emoji, text] = ABSTRACT[c.id] ?? ['🔢', (x) => `${x}`];
      visual = html`<div class="count-emoji single">${emoji}</div>`.text;
      label = text(n);
    }
    const sound = shuffle(counterDistractors(c, n), r).slice(0, 2);
    const otherCounters = shuffle(COUNTERS.filter((o) => o.id !== c.id && !o.duration === !c.duration), r)
      .map((o) => o.readings[n - 1]).filter((x) => x !== reading.kana && !reading.alt.includes(x));
    const wrong = [...new Set([...sound, ...otherCounters])].slice(0, 3);
    return {
      ...choiceTask({ label, prompt: '', visual, speakAnswer: reading.kana, columns: 2, explain: counterExplain(c) },
        html`<span lang="ja">${reading.kana}</span>`.text, wrong.map((w) => html`<span lang="ja">${w}</span>`.text), r),
      tags: [`ctr:${c.id}`, ...([1, 3, 6, 8, 10].includes(n) ? ['ctr:sound'] : [])],
    };
  },
};

export { numberKana };
