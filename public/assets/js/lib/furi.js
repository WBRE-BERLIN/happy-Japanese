/*
 * Furigana notation used everywhere in the content:
 *
 *   {漢字|かんじ}  a run of kanji with its reading in hiragana
 *   everything else is read as written (kana, digits, punctuation)
 *
 *   '{毎朝|まいあさ}6{時|じ}に{起|お}きます。'
 *
 * Words in the word lists are stored as written form + reading instead;
 * autoFuri() turns such a pair into the notation.
 */

const TOKEN = /\{([^|{}]+)\|([^|{}]+)\}/g;

export const KANJI = /[㐀-䶿一-鿿豈-﫿々〆ヶ]/;
const KANJI_RUN = /[㐀-䶿一-鿿豈-﫿々〆ヶ]+/g;

export const hasKanji = (text) => KANJI.test(text);

/** Splits notation into parts: { text } or { text, ruby }. */
export function parseFuri(text) {
  const parts = [];
  let last = 0;
  for (const match of String(text).matchAll(TOKEN)) {
    if (match.index > last) parts.push({ text: text.slice(last, match.index) });
    parts.push({ text: match[1], ruby: match[2] });
    last = match.index + match[0].length;
  }
  if (last < text.length) parts.push({ text: text.slice(last) });
  return parts;
}

/** The reading: {漢字|かんじ} → かんじ. */
export const furiKana = (text) => String(text).replace(TOKEN, (_, base, ruby) => ruby);

/** The written form: {漢字|かんじ} → 漢字. */
export const furiPlain = (text) => String(text).replace(TOKEN, (_, base) => base);

const escapeHtml = (value) => String(value).replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);

/** HTML with <ruby> over every kanji run. With ruby: false the readings are left out. */
export function furiHtml(text, { ruby = true } = {}) {
  return parseFuri(String(text)).map((part) => {
    if (!part.ruby) return escapeHtml(part.text);
    if (!ruby) return escapeHtml(part.text);
    return `<ruby>${escapeHtml(part.text)}<rt>${escapeHtml(part.ruby)}</rt></ruby>`;
  }).join('');
}

const regexEscape = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const toHiragana = (text) => text.replace(/[ァ-ヶ]/g, (c) => String.fromCharCode(c.charCodeAt(0) - 0x60));

/**
 * Lines up a written form with its reading: ('食べます', 'たべます') →
 * '{食|た}べます'. Returns null when the kana in the written form do not
 * appear in the reading.
 */
export function autoFuri(written, reading) {
  written = String(written);
  reading = String(reading);
  if (!hasKanji(written)) return written;

  const runs = [];
  let last = 0;
  for (const match of written.matchAll(KANJI_RUN)) {
    if (match.index > last) runs.push({ kana: written.slice(last, match.index) });
    runs.push({ kanji: match[0] });
    last = match.index + match[0].length;
  }
  if (last < written.length) runs.push({ kana: written.slice(last) });

  const pattern = runs.map((run) => (run.kanji ? '(.+?)' : regexEscape(toHiragana(run.kana)))).join('');
  const found = new RegExp(`^${pattern}$`).exec(toHiragana(reading));
  if (!found) return null;

  let group = 1;
  return runs.map((run) => (run.kanji ? `{${run.kanji}|${found[group++]}}` : run.kana)).join('');
}

/** autoFuri, or the reading over the whole word when the parts cannot be lined up. */
export function wordFuri(written, reading) {
  if (!hasKanji(written)) return written;
  return autoFuri(written, reading) ?? `{${written}|${reading}}`;
}
