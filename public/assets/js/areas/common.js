/* Helpers shared by the exercise areas. */
import { furiKana, furiPlain, wordFuri, hasKanji } from '../lib/furi.js';
import { normalizeAnswer } from '../lib/kana.js';
import { html, jp, raw } from '../lib/ui.js';

export const rand = (n, rng = Math.random) => Math.floor(rng() * n);
export const pick = (list, rng = Math.random) => list[rand(list.length, rng)];

export function shuffle(list, rng = Math.random) {
  const out = [...list];
  for (let i = out.length - 1; i > 0; i--) {
    const j = rand(i + 1, rng);
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

/** n distinct elements from list (fewer if the list is short). */
export const sample = (list, n, rng = Math.random) => shuffle(list, rng).slice(0, n);

/** Short stable id for a text (item ids of sentences). */
export function hash(text) {
  let h = 5381;
  for (const c of String(text)) h = ((h * 33) ^ c.codePointAt(0)) >>> 0;
  return h.toString(36);
}

/** Up to n wrong options: listed ones first, then others from the pool, never equal to the right one. */
export function distractors(right, preferred, pool, n = 3, rng = Math.random, key = (x) => x) {
  const seen = new Set([key(right)]);
  const out = [];
  for (const candidate of [...shuffle(preferred, rng), ...shuffle(pool, rng)]) {
    const k = key(candidate);
    if (seen.has(k)) continue;
    seen.add(k);
    out.push(candidate);
    if (out.length === n) break;
  }
  return out;
}

/** Accepted typed answers for Japanese: reading and written form, normalised. */
export function acceptJapanese(...pairs) {
  const set = new Set();
  for (const pair of pairs.flat()) {
    if (!pair) continue;
    const texts = typeof pair === 'string' ? [furiKana(pair), furiPlain(pair)] : [pair.reading, pair.written];
    for (const t of texts) if (t) set.add(normalizeAnswer(String(t).replace(/〜/g, '')));
  }
  set.delete('');
  return [...set];
}

/** A choice task from a right answer and wrong ones (HTML each). */
export function choiceTask(base, rightHtml, wrongHtml, rng = Math.random) {
  const options = shuffle([{ html: rightHtml, correct: true }, ...wrongHtml.map((h) => ({ html: h, correct: false }))], rng);
  return { kind: 'choice', ...base, options };
}

/** Word as furigana notation from written + reading. */
export const furiWord = (written, reading) => wordFuri(written, reading);

/** Japanese word HTML (written + reading). */
export const jpWord = (written, reading) => jp(wordFuri(written, reading));

export const lessonOk = (lesson, ctx) => !lesson || lesson <= (ctx.settings.lesson ?? 25);

export const tagLesson = (l) => (l ? [`L${l}`] : []);

/** Explanation box HTML. */
export const explain = (text) => (text ? html`<p>${text}</p>` : '');

export const answerLine = (label, furi) => html`<div class="answer-line"><span class="muted">${label}</span> ${jp(furi)}</div>`;

export { furiKana, furiPlain, hasKanji, html, jp, raw };
