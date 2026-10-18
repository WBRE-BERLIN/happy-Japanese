/* Writing: kana, kanji and the signs a traveller reads. */
import kanjiList from '../data/kanji.js';
import signs from '../data/signs.js';
import { KANA, normalizeAnswer, toHiragana } from '../lib/kana.js';
import { html, jp } from '../lib/ui.js';
import { choiceTask, distractors, furiWord, hash, pick } from './common.js';

/* ---------- kana ---------- */

// Kana that look alike, used as distractors.
const LOOKALIKE = [
  'さちき', 'ぬめ', 'ねれわ', 'るろ', 'はほけ', 'いり', 'こに', 'くへ', 'あおめ', 'たな', 'うら', 'しつ', 'ソンリ', 'シツ', 'クケタ', 'ウワフ', 'コユロ', 'アマ', 'ナメ', 'チテ', 'ヌス', 'ノメ', 'セヤ', 'ルレ',
];
const lookalikes = (kana) => LOOKALIKE.filter((group) => group.includes(kana)).flatMap((group) => [...group]).filter((k) => k !== kana);

const KANA_SETS = { basic: 'Grundzeichen', voiced: 'mit ゛ und ゜', combined: 'Kombinationen (きゃ …)', all: 'Alle' };

export const kana = {
  id: 'kana',
  title: 'Hiragana & Katakana',
  group: 'wort',
  icon: 'kana',
  blurb: 'Die Silbenschriften lesen und erkennen',
  options: [
    { key: 'script', label: 'Schrift', choices: { hira: 'Hiragana', kata: 'Katakana', both: 'Beide' }, default: 'both' },
    { key: 'set', label: 'Zeichen', choices: KANA_SETS, default: 'all' },
    { key: 'mode', label: 'Übungsart', choices: { read: 'Lesen: Romaji eintippen', find: 'Finden: Zeichen auswählen', mix: 'Gemischt' }, default: 'mix' },
  ],
  ref: 'kana',
  items(ctx) {
    const script = ctx.opts.script ?? 'both';
    const set = ctx.opts.set ?? 'all';
    return KANA
      .filter((k) => script === 'both' || k.script === script)
      .filter((k) => set === 'all' || k.group === set || (set === 'combined' && k.group === 'extended'))
      .map((k) => ({ id: `k:${k.kana}`, tags: [`kana:${k.script}`, `kana:${k.group}`], k }));
  },
  task(item, ctx) {
    const { k } = item;
    const mode = ctx.opts.mode === 'mix' || !ctx.opts.mode ? pick(['read', 'find'], ctx.rng) : ctx.opts.mode;
    const name = k.script === 'hira' ? 'Hiragana' : 'Katakana';
    if (mode === 'read') {
      return {
        kind: 'input',
        label: `${name}: Wie liest man das?`,
        prompt: html`<div class="huge-jp" lang="ja">${k.kana}</div>`.text,
        speak: toHiragana(k.kana),
        placeholder: 'Romaji, z. B. ka',
        // Typed romaji becomes kana while typing, so compare the kana.
        accept: [...new Set([toHiragana(k.kana), ...k.accept.map(normalizeAnswer)])],
        answerHtml: html`<span lang="ja">${k.kana}</span> = ${k.accept.join(' / ')}`.text,
      };
    }
    const sameScript = KANA.filter((o) => o.script === k.script && o.group === k.group);
    const wrong = distractors(k, lookalikes(k.kana).map((c) => KANA.find((o) => o.kana === c)).filter(Boolean), sameScript, 3, ctx.rng, (o) => o.kana);
    return choiceTask({ label: `${name}: Welches Zeichen ist „${k.romaji}“?`, prompt: html`<div class="big-de">${k.romaji}</div>`.text, speakAnswer: toHiragana(k.kana), columns: 2 },
      html`<span class="option-jp" lang="ja">${k.kana}</span>`.text, wrong.map((o) => html`<span class="option-jp" lang="ja">${o.kana}</span>`.text), ctx.rng);
  },
};

/* ---------- kanji ---------- */

export const KANJI = kanjiList.map(([k, on, kun, de, examples, level = 'N5'], index) => ({
  k, on, kun, de, level, index, examples: examples.map(([w, r, g]) => ({ written: w, reading: r, de: g, furi: furiWord(w, r) })),
}));

const kanjiInfo = (entry) => html`
  <div class="kanji-info">
    <span class="kanji-big" lang="ja">${entry.k}</span>
    <div><div><strong>${entry.de}</strong></div>
      ${entry.on ? html`<div class="small"><span class="muted">On:</span> <span lang="ja">${entry.on}</span></div>` : ''}
      ${entry.kun ? html`<div class="small"><span class="muted">Kun:</span> <span lang="ja">${entry.kun}</span></div>` : ''}</div>
  </div>
  <ul class="examples">${entry.examples.map((e) => html`<li>${jp(e.furi)} <span class="muted">${e.de}</span></li>`)}</ul>`.text;

export const kanji = {
  id: 'kanji',
  title: 'Kanji',
  group: 'wort',
  icon: 'kanji',
  blurb: 'Bedeutung und Lesung der wichtigsten Kanji',
  options: [
    { key: 'level', label: 'Auswahl', choices: { N5: 'Grundkanji (N5)', N4: 'Aufbau (N4)', reise: 'Reise-Kanji', all: 'Alle' }, default: 'all' },
    { key: 'mode', label: 'Übungsart', choices: { mix: 'Gemischt', meaning: 'Bedeutung', reading: 'Lesung von Wörtern', write: 'Kanji erkennen' }, default: 'mix' },
  ],
  ref: 'kanji',
  items(ctx) {
    const level = ctx.opts.level ?? 'all';
    const modes = ctx.opts.mode && ctx.opts.mode !== 'mix' ? [ctx.opts.mode] : ['meaning', 'reading', 'write'];
    return KANJI.filter((e) => level === 'all' || e.level === level)
      .flatMap((e) => modes.map((mode) => ({ id: `kj:${e.k}:${mode}`, group: `kj:${e.k}`, tags: [`kanji:${e.level}`, `kmode:${mode}`], entry: e, mode })));
  },
  task(item, ctx) {
    const e = item.entry;
    const others = KANJI.filter((o) => o !== e);
    if (item.mode === 'meaning') {
      const wrong = distractors(e, others.filter((o) => o.level === e.level), others, 3, ctx.rng, (o) => o.de);
      return choiceTask({ label: 'Was bedeutet dieses Kanji?', prompt: html`<div class="huge-jp" lang="ja">${e.k}</div>`.text, explain: kanjiInfo(e), columns: 1 },
        html`${e.de}`.text, wrong.map((o) => html`${o.de}`.text), ctx.rng);
    }
    if (item.mode === 'write') {
      const wrong = distractors(e, others.filter((o) => o.level === e.level), others, 3, ctx.rng, (o) => o.k);
      return choiceTask({ label: 'Welches Kanji bedeutet das?', prompt: html`<div class="big-de">${e.de}</div>`.text, explain: kanjiInfo(e), columns: 2 },
        html`<span class="option-jp" lang="ja">${e.k}</span>`.text, wrong.map((o) => html`<span class="option-jp" lang="ja">${o.k}</span>`.text), ctx.rng);
    }
    // reading of an example word; the furigana are hidden in the prompt on purpose
    const example = pick(e.examples, ctx.rng);
    const pool = KANJI.flatMap((o) => o.examples).filter((x) => x.reading !== example.reading);
    const sameLength = pool.filter((x) => Math.abs(x.reading.length - example.reading.length) <= 1);
    const wrong = distractors(example, sameLength.filter((x) => x.written.includes(e.k) || x.written.length === example.written.length), pool, 3, ctx.rng, (x) => x.reading);
    return choiceTask({
      label: `Wie liest man das? (${example.de})`,
      prompt: html`<div class="big-jp" lang="ja">${example.written}</div>`.text,
      speakAnswer: example.reading,
      explain: kanjiInfo(e),
      answerHtml: jp(example.furi).text,
    }, html`<span lang="ja">${example.reading}</span>`.text, wrong.map((x) => html`<span lang="ja">${x.reading}</span>`.text), ctx.rng);
  },
};

/* ---------- signs ---------- */

export const SIGNS = signs.map(([text, reading, de, style, note], index) => ({ text, reading, de, style, note, index, furi: furiWord(text, reading) }));

export const signHtml = (s, { small = false } = {}) => html`<div class="sign sign-${s.style} ${small ? 'small' : ''}" lang="ja">${s.text}</div>`.text;

export const signsArea = {
  id: 'signs',
  title: 'Schilder lesen',
  group: 'alltag',
  icon: 'sign',
  blurb: 'Ausgang, Gleis, geöffnet, Rauchen verboten – was steht da?',
  options: [{ key: 'mode', label: 'Übungsart', choices: { meaning: 'Bedeutung', reading: 'Lesung', mix: 'Gemischt' }, default: 'meaning' }],
  ref: 'signs',
  items(ctx) {
    const modes = ctx.opts.mode === 'mix' ? ['meaning', 'reading'] : [ctx.opts.mode ?? 'meaning'];
    return SIGNS.flatMap((s) => modes.map((mode) => ({ id: `sg:${hash(s.text)}:${mode}`, group: `sg:${hash(s.text)}`, tags: [`sign:${mode}`], sign: s, mode })));
  },
  task(item, ctx) {
    const s = item.sign;
    const others = SIGNS.filter((o) => o !== s);
    const info = html`${jp(s.furi)} – ${s.de}${s.note ? html`<p class="note">${s.note}</p>` : ''}`.text;
    if (item.mode === 'reading') {
      const wrong = distractors(s, others.filter((o) => o.style === s.style), others, 3, ctx.rng, (o) => o.reading);
      return choiceTask({ label: 'Wie liest man das Schild?', prompt: signHtml(s), explain: info, speakAnswer: s.reading, columns: 1 },
        html`<span lang="ja">${s.reading}</span>`.text, wrong.map((o) => html`<span lang="ja">${o.reading}</span>`.text), ctx.rng);
    }
    const wrong = distractors(s, others.filter((o) => o.style === s.style), others, 3, ctx.rng, (o) => o.de);
    return choiceTask({ label: 'Was bedeutet das Schild?', prompt: signHtml(s), explain: info, speakAnswer: s.reading, columns: 1 },
      html`${s.de}`.text, wrong.map((o) => html`${o.de}`.text), ctx.rng);
  },
};
