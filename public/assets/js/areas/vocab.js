/* Vocabulary areas: Minna no Nihongo lessons and the travel decks. */
import vocab1 from '../data/vocab-1.js';
import vocab2 from '../data/vocab-2.js';
import travelDecks from '../data/vocab-travel.js';
import { kanaToRomaji } from '../lib/kana.js';
import { html, jp, raw } from '../lib/ui.js';
import { acceptJapanese, choiceTask, distractors, furiWord, furiKana } from './common.js';

export const POS_LABEL = {
  n: 'Nomen', v: 'Verb', i: 'い-Adjektiv', na: 'な-Adjektiv', adv: 'Adverb', pron: 'Pronomen', q: 'Fragewort',
  expr: 'Ausdruck', ctr: 'Zähleinheit', conj: 'Konjunktion', num: 'Zahl', part: 'Partikel',
};

const toWord = (lesson, deck) => ([written, reading, de, pos = 'n', note = ''], i) => ({
  lesson, deck, written, reading, de, pos, note, furi: furiWord(written, reading), index: i,
});

export const LESSON_WORDS = [vocab1, vocab2].flatMap((lessons) => Object.entries(lessons)
  .flatMap(([lesson, words]) => words.map(toWord(Number(lesson), null))));

export const TRAVEL_WORDS = travelDecks.flatMap((deck) => deck.words.map(toWord(0, deck.id)));
export const DECKS = travelDecks.map(({ id, title, words }) => ({ id, title, count: words.length }));

const wordKey = (w) => `${w.lesson || w.deck}:${w.written}`;

const LESSON_CHOICES = { '': 'Bis zu meiner Lektion', current: 'Nur meine aktuelle Lektion',
  ...Object.fromEntries(Array.from({ length: 25 }, (_, i) => [String(i + 1), `Lektion ${i + 1}`])) };

const DIR = { mix: 'Gemischt', jd: 'Japanisch → Deutsch', dj: 'Deutsch → Japanisch' };
const MODE = { flash: 'Karteikarte', choice: 'Auswahl (4 Antworten)', input: 'Eintippen (nur Deutsch → Japanisch)' };

function itemsFor(words, prefix, ctx) {
  const dirs = ctx.opts.dir === 'mix' || !ctx.opts.dir ? ['jd', 'dj'] : [ctx.opts.dir];
  return words.flatMap((w) => dirs.map((dir) => ({
    id: `${prefix}:${wordKey(w)}:${dir === 'jd' ? 'r' : 'p'}`,
    // Both directions of a word are one group: never both in the same session.
    group: `${prefix}:${wordKey(w)}`,
    lesson: w.lesson || undefined,
    tags: [w.lesson ? `L${w.lesson}` : `deck:${w.deck}`, `pos:${w.pos}`, `dir:${dir}`],
    word: w,
    dir,
  })));
}

function wordBack(w, { showGerman }) {
  return html`
    ${showGerman ? html`<div class="back-main">${w.de}</div>` : html`<div class="back-main">${jp(w.furi)}</div>
      <div class="muted small">${furiKana(w.furi) !== w.written ? w.reading : ''} <span class="romaji">${kanaToRomaji(w.reading.replace(/〜/g, '~'))}</span></div>`}
    ${w.note ? html`<div class="note">${w.note}</div>` : ''}
    <div class="tag-line">${w.lesson ? `Lektion ${w.lesson}` : ''} · ${POS_LABEL[w.pos] ?? ''}</div>`.text;
}

/** A task for a word in one direction and mode. */
export function wordTask(item, ctx, pool) {
  const w = item.word;
  const mode = item.dir === 'jd' && ctx.opts.mode === 'input' ? 'choice' : ctx.opts.mode ?? 'flash';
  const speakText = w.reading.replace(/〜/g, '');
  const jpPrompt = html`<div class="big-jp">${jp(w.furi)}</div>`.text;
  const dePrompt = html`<div class="big-de">${w.de}</div>${w.note && item.dir === 'dj' ? html`<div class="note">${w.note}</div>` : ''}`.text;

  if (mode === 'flash') {
    return item.dir === 'jd'
      ? { kind: 'flash', label: 'Was bedeutet das?', prompt: jpPrompt, speak: speakText, back: wordBack(w, { showGerman: true }) }
      : { kind: 'flash', label: 'Wie heißt das auf Japanisch?', prompt: dePrompt, back: wordBack(w, { showGerman: false }), speakAnswer: speakText };
  }

  const similar = pool.filter((o) => o.pos === w.pos && o !== w && o.de !== w.de && o.reading !== w.reading);
  const near = similar.filter((o) => Math.abs((o.lesson || 0) - (w.lesson || 0)) <= 3 || (o.deck && o.deck === w.deck));
  if (mode === 'choice') {
    const wrong = distractors(w, near, similar.length >= 3 ? similar : pool.filter((o) => o !== w), 3, ctx.rng, (o) => (item.dir === 'jd' ? o.de : o.reading));
    if (item.dir === 'jd') {
      return choiceTask({ label: 'Was bedeutet das?', prompt: jpPrompt, speak: speakText, answerHtml: html`${w.de}`.text, explain: w.note ? html`${w.note}`.text : '' },
        html`${w.de}`.text, wrong.map((o) => html`${o.de}`.text), ctx.rng);
    }
    return choiceTask({ label: 'Wie heißt das auf Japanisch?', prompt: dePrompt, speakAnswer: speakText, answerHtml: jp(w.furi).text },
      jp(w.furi).text, wrong.map((o) => jp(o.furi).text), ctx.rng);
  }

  return {
    kind: 'input',
    label: 'Schreib das auf Japanisch',
    prompt: dePrompt,
    accept: acceptJapanese({ written: w.written, reading: w.reading }),
    answerHtml: jp(w.furi).text,
    hint: html`${w.reading.replace(/〜/g, '')[0]}…`.text,
    speakAnswer: speakText,
  };
}

export const vocab = {
  id: 'vocab',
  title: 'Vokabeln',
  group: 'wort',
  icon: 'cards',
  blurb: 'Karteikarten zu den Lektionen von Minna no Nihongo',
  options: [
    { key: 'lessons', label: 'Lektionen', choices: LESSON_CHOICES, default: '' },
    { key: 'dir', label: 'Richtung', choices: DIR, default: 'mix' },
    { key: 'mode', label: 'Übungsart', choices: MODE, default: 'flash' },
  ],
  ref: 'vocab',
  items(ctx) {
    const max = ctx.settings.lesson ?? 25;
    const choice = ctx.opts.lessons ?? '';
    const words = LESSON_WORDS.filter((w) => (choice === '' ? w.lesson <= max : choice === 'current' ? w.lesson === max : w.lesson === Number(choice)));
    return itemsFor(words, 'v', ctx);
  },
  task: (item, ctx) => wordTask(item, ctx, LESSON_WORDS),
};

export const travel = {
  id: 'travel',
  title: 'Reise-Wortschatz',
  group: 'alltag',
  icon: 'train',
  blurb: 'Bahn, Essen, Einkaufen, Hotel, Onsen – Wörter für unterwegs',
  options: [
    { key: 'deck', label: 'Thema', choices: { '': 'Alle Themen', ...Object.fromEntries(DECKS.map((d) => [d.id, d.title])) }, default: '' },
    { key: 'dir', label: 'Richtung', choices: DIR, default: 'mix' },
    { key: 'mode', label: 'Übungsart', choices: MODE, default: 'flash' },
  ],
  ref: 'travel',
  items(ctx) {
    const words = TRAVEL_WORDS.filter((w) => !ctx.opts.deck || w.deck === ctx.opts.deck);
    return itemsFor(words, 't', ctx);
  },
  task: (item, ctx) => wordTask(item, ctx, TRAVEL_WORDS),
};

export const vocabLabel = (w) => raw(`${jp(w.furi)} <span class="muted">${w.de}</span>`);
