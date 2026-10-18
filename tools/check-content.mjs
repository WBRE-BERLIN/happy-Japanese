// Checks the learning content in public/assets/js/data/ (formats: docs/content.md).
// Usage: node tools/check-content.mjs [--warnings]
import { existsSync } from 'node:fs';
import { autoFuri, furiKana, hasKanji, KANJI } from '../public/assets/js/lib/furi.js';

const DATA = new URL('../public/assets/js/data/', import.meta.url);
const showWarnings = process.argv.includes('--warnings');
const errors = [];
const warnings = [];
const counts = {};

const load = async (name) => {
  const url = new URL(name, DATA);
  if (!existsSync(url)) return null;
  return (await import(url.href)).default;
};

const KANA_ONLY = /^[぀-ゟ゠-ヿー〜・]+$/;
const BLANK = '＿';
const POS = new Set(['n', 'v', 'i', 'na', 'adv', 'pron', 'q', 'expr', 'ctr', 'conj', 'num', 'part']);
const PARTICLES = new Set(['は', 'が', 'を', 'に', 'で', 'へ', 'と', 'も', 'の', 'か', 'や', 'から', 'まで', 'より', 'ね', 'よ', 'までに', 'だけ', 'しか', 'ぐらい', 'ごろ', 'など', 'で/に', 'でも', 'とか']);
const SIGN_STYLES = new Set(['green', 'red', 'blue', 'white', 'yellow', 'ink']);

/** Notation check: braces well-formed, readings in kana, no kanji outside braces. */
function checkFuri(text, where) {
  if (typeof text !== 'string' || text === '') {
    errors.push(`${where}: empty text`);
    return;
  }
  const outside = text.replace(/\{([^|{}]+)\|([^|{}]+)\}/g, (match, base, ruby) => {
    if (!hasKanji(base)) errors.push(`${where}: {${base}|${ruby}} has no kanji`);
    if (!KANA_ONLY.test(ruby)) errors.push(`${where}: reading "${ruby}" is not kana`);
    if (KANA_ONLY.test(base[base.length - 1]) && base.length > 1) warnings.push(`${where}: okurigana inside braces in {${base}|${ruby}}`);
    return '';
  });
  if (/[{}|]/.test(outside)) errors.push(`${where}: broken braces in "${text}"`);
  const stray = [...outside].filter((c) => KANJI.test(c));
  if (stray.length) errors.push(`${where}: kanji without reading (${stray.join('')}) in "${text}"`);
}

function checkWord([written, reading, german, pos, note], where, seen) {
  if (!written || !reading || !german) errors.push(`${where}: missing field in ${JSON.stringify([written, reading, german])}`);
  if (reading && !KANA_ONLY.test(reading.replace(/[ 　]/g, ''))) errors.push(`${where}: reading "${reading}" of ${written} is not kana`);
  if (pos !== undefined && !POS.has(pos)) errors.push(`${where}: unknown part of speech "${pos}" for ${written}`);
  if (note !== undefined && typeof note !== 'string') errors.push(`${where}: note of ${written} must be text`);
  if (written && reading && hasKanji(written) && autoFuri(written, reading) === null) {
    errors.push(`${where}: kana in "${written}" do not match the reading "${reading}"`);
  }
  if (seen) {
    const key = `${written}|${reading}`;
    if (seen.has(key)) warnings.push(`${where}: ${written} (${reading}) also in ${seen.get(key)}`);
    else seen.set(key, where);
  }
}

const blanks = (text) => [...text].filter((c) => c === BLANK).length;

const vocabSeen = new Map();
for (const file of ['vocab-1.js', 'vocab-2.js']) {
  const lessons = await load(file);
  if (!lessons) continue;
  for (const [lesson, words] of Object.entries(lessons)) {
    if (!(Number(lesson) >= 1 && Number(lesson) <= 25)) errors.push(`${file}: lesson key ${lesson}`);
    words.forEach((word, i) => checkWord(word, `${file} L${lesson} #${i + 1}`, vocabSeen));
    counts[`vocab L${lesson}`] = words.length;
  }
}

const travel = await load('vocab-travel.js');
if (travel) {
  const ids = new Set();
  for (const deck of travel) {
    if (!deck.id || ids.has(deck.id)) errors.push(`vocab-travel.js: missing or repeated id ${deck.id}`);
    ids.add(deck.id);
    if (!deck.title) errors.push(`vocab-travel.js: deck ${deck.id} has no title`);
    const seen = new Map();
    deck.words.forEach((word, i) => checkWord(word, `vocab-travel.js ${deck.id} #${i + 1}`, seen));
    counts[`travel ${deck.id}`] = deck.words.length;
  }
}

const particles = await load('particles.js');
if (particles) {
  particles.forEach((item, i) => {
    const where = `particles.js #${i + 1}`;
    checkFuri(item.s, where);
    if (!Array.isArray(item.a) || blanks(item.s) !== item.a.length) errors.push(`${where}: ${blanks(item.s)} blanks but ${item.a?.length} answers`);
    for (const answer of item.a ?? []) {
      for (const option of answer.split('/')) {
        if (!PARTICLES.has(option)) errors.push(`${where}: unknown particle "${option}"`);
      }
    }
    if (!item.de || !item.why) errors.push(`${where}: de and why are needed`);
    if (!(item.l >= 1 && item.l <= 25)) errors.push(`${where}: lesson ${item.l}`);
  });
  counts.particles = particles.length;
}

const conjugate = existsSync(new URL('../public/assets/js/lib/conjugate.js', import.meta.url))
  ? await import('../public/assets/js/lib/conjugate.js') : null;
const verbs = await load('verbs.js');
const adjectives = await load('adjectives.js');

if (verbs) {
  const seen = new Set();
  verbs.forEach(([dict, reading, group, german, lesson], i) => {
    const where = `verbs.js #${i + 1} ${dict}`;
    if (seen.has(dict)) errors.push(`${where}: listed twice`);
    seen.add(dict);
    if (![1, 2, 3].includes(group)) errors.push(`${where}: group ${group}`);
    if (!german || !(lesson >= 1 && lesson <= 25)) errors.push(`${where}: german or lesson missing`);
    if (!/[うくぐすつぬぶむる]$/.test(reading)) errors.push(`${where}: reading does not end like a verb`);
    if (group === 2 && !/[いきぎしじちにひびみりえけげせぜてでねへべめれ]る$/.test(reading)) errors.push(`${where}: group 2 must end in -iru/-eru`);
    if (hasKanji(dict) && autoFuri(dict, reading) === null) errors.push(`${where}: kana do not match the reading`);
  });
  counts.verbs = verbs.length;
}

if (adjectives) {
  const seen = new Set();
  adjectives.forEach(([word, reading, type, german, lesson], i) => {
    const where = `adjectives.js #${i + 1} ${word}`;
    if (seen.has(word)) errors.push(`${where}: listed twice`);
    seen.add(word);
    if (!['i', 'na'].includes(type)) errors.push(`${where}: type ${type}`);
    if (type === 'i' && !reading.endsWith('い')) errors.push(`${where}: い-adjective must end in い`);
    if (!german || !(lesson >= 0 && lesson <= 25)) errors.push(`${where}: german or lesson missing`);
    if (hasKanji(word) && autoFuri(word, reading) === null) errors.push(`${where}: kana do not match the reading`);
  });
  counts.adjectives = adjectives.length;
}

const verbcloze = await load('verbcloze.js');
if (verbcloze) {
  const known = new Set((verbs ?? []).map(([dict]) => dict));
  verbcloze.forEach((item, i) => {
    const where = `verbcloze.js #${i + 1}`;
    checkFuri(item.s, where);
    if (blanks(item.s) !== 1) errors.push(`${where}: needs exactly one blank`);
    if (verbs && !known.has(item.v)) errors.push(`${where}: verb ${item.v} is not in verbs.js`);
    if (conjugate && !conjugate.FORMS[item.f]) errors.push(`${where}: unknown form ${item.f}`);
    if (!item.de || !(item.l >= 1 && item.l <= 25)) errors.push(`${where}: de or lesson missing`);
  });
  counts.verbcloze = verbcloze.length;
}

const adjcloze = await load('adjcloze.js');
if (adjcloze) {
  const known = new Set((adjectives ?? []).map(([word]) => word));
  adjcloze.forEach((item, i) => {
    const where = `adjcloze.js #${i + 1}`;
    checkFuri(item.s, where);
    if (blanks(item.s) !== 1) errors.push(`${where}: needs exactly one blank`);
    if (adjectives && !known.has(item.a)) errors.push(`${where}: adjective ${item.a} is not in adjectives.js`);
    if (conjugate && !conjugate.ADJ_FORMS[item.f]) errors.push(`${where}: unknown form ${item.f}`);
    if (!item.de || !(item.l >= 1 && item.l <= 25)) errors.push(`${where}: de or lesson missing`);
  });
  counts.adjcloze = adjcloze.length;
}

const grammar = await load('grammar.js');
if (grammar) {
  grammar.forEach((item, i) => {
    const where = `grammar.js #${i + 1}`;
    checkFuri(item.s, where);
    if (blanks(item.s) !== 1 && !item.q) errors.push(`${where}: needs one blank or a question q`);
    if (!Array.isArray(item.o) || item.o.length < 3) errors.push(`${where}: needs at least 3 options`);
    if (new Set(item.o).size !== item.o?.length) errors.push(`${where}: options repeat`);
    item.o?.forEach((option, j) => checkFuri(option, `${where} option ${j + 1}`));
    if (!item.de || !item.why || !item.t) errors.push(`${where}: de, why and t are needed`);
    if (!(item.l >= 1 && item.l <= 25)) errors.push(`${where}: lesson ${item.l}`);
  });
  counts.grammar = grammar.length;
}

const sentences = await load('sentences.js');
if (sentences) {
  sentences.forEach((item, i) => {
    const where = `sentences.js #${i + 1}`;
    if (!Array.isArray(item.c) || item.c.length < 3) errors.push(`${where}: needs at least 3 chunks`);
    item.c?.forEach((chunk, j) => checkFuri(chunk, `${where} chunk ${j + 1}`));
    if (new Set(item.c.map(furiKana)).size !== item.c.length) errors.push(`${where}: two chunks read the same`);
    for (const order of item.alt ?? []) {
      if ([...order].sort((a, b) => a - b).join() !== item.c.map((_, j) => j).join()) errors.push(`${where}: alt ${order} is not a permutation`);
    }
    if (!item.de || !(item.l >= 1 && item.l <= 25)) errors.push(`${where}: de or lesson missing`);
  });
  counts.sentences = sentences.length;
}

const kanji = await load('kanji.js');
if (kanji) {
  const seen = new Set();
  kanji.forEach(([character, on, kun, german, examples], i) => {
    const where = `kanji.js #${i + 1} ${character}`;
    if ([...character].length !== 1 || !hasKanji(character)) errors.push(`${where}: not a single kanji`);
    if (seen.has(character)) errors.push(`${where}: listed twice`);
    seen.add(character);
    if (!on && !kun) errors.push(`${where}: no readings`);
    if (!german) errors.push(`${where}: no meaning`);
    if (!Array.isArray(examples) || examples.length === 0) errors.push(`${where}: no examples`);
    examples?.forEach((example, j) => {
      checkWord(example, `${where} example ${j + 1}`);
      if (!example[0].includes(character)) errors.push(`${where} example ${j + 1}: ${example[0]} does not contain ${character}`);
    });
  });
  counts.kanji = kanji.length;
}

const signs = await load('signs.js');
if (signs) {
  signs.forEach(([text, reading, german, style], i) => {
    const where = `signs.js #${i + 1} ${text}`;
    checkWord([text, reading, german], where);
    if (!SIGN_STYLES.has(style)) errors.push(`${where}: style ${style}`);
  });
  counts.signs = signs.length;
}

const phrases = await load('phrases.js');
if (phrases) {
  phrases.forEach((item, i) => {
    const where = `phrases.js #${i + 1}`;
    checkFuri(item.jp, where);
    if (!item.de || !item.sit || !item.cat) errors.push(`${where}: de, sit and cat are needed`);
    if (!Array.isArray(item.x) || item.x.length < 2) errors.push(`${where}: needs at least 2 wrong answers`);
    item.x?.forEach((option, j) => {
      checkFuri(option, `${where} wrong ${j + 1}`);
      if (furiKana(option) === furiKana(item.jp)) errors.push(`${where}: wrong answer ${j + 1} equals the right one`);
    });
  });
  counts.phrases = phrases.length;
}

console.log(Object.entries(counts).map(([name, count]) => `${name}: ${count}`).join('\n'));
if (showWarnings && warnings.length) console.log(`\nWarnings:\n${warnings.join('\n')}`);
if (errors.length) {
  console.error(`\n${errors.length} problem(s):\n${errors.join('\n')}`);
  process.exit(1);
}
console.log(`\nContent OK${warnings.length ? ` (${warnings.length} warnings, show with --warnings)` : ''}.`);
