/* Kana helpers: romaji input, hiragana/katakana, and answer normalisation. */

const ROMAJI = {
  a: 'あ', i: 'い', u: 'う', e: 'え', o: 'お',
  ka: 'か', ki: 'き', ku: 'く', ke: 'け', ko: 'こ',
  ga: 'が', gi: 'ぎ', gu: 'ぐ', ge: 'げ', go: 'ご',
  sa: 'さ', shi: 'し', si: 'し', su: 'す', se: 'せ', so: 'そ',
  za: 'ざ', ji: 'じ', zi: 'じ', zu: 'ず', ze: 'ぜ', zo: 'ぞ',
  ta: 'た', chi: 'ち', ti: 'ち', tsu: 'つ', tu: 'つ', te: 'て', to: 'と',
  da: 'だ', di: 'ぢ', du: 'づ', de: 'で', do: 'ど',
  na: 'な', ni: 'に', nu: 'ぬ', ne: 'ね', no: 'の',
  ha: 'は', hi: 'ひ', fu: 'ふ', hu: 'ふ', he: 'へ', ho: 'ほ',
  ba: 'ば', bi: 'び', bu: 'ぶ', be: 'べ', bo: 'ぼ',
  pa: 'ぱ', pi: 'ぴ', pu: 'ぷ', pe: 'ぺ', po: 'ぽ',
  ma: 'ま', mi: 'み', mu: 'む', me: 'め', mo: 'も',
  ya: 'や', yu: 'ゆ', yo: 'よ',
  ra: 'ら', ri: 'り', ru: 'る', re: 'れ', ro: 'ろ',
  la: 'ら', li: 'り', lu: 'る', le: 'れ', lo: 'ろ',
  wa: 'わ', wo: 'を', wi: 'うぃ', we: 'うぇ',
  kya: 'きゃ', kyu: 'きゅ', kyo: 'きょ',
  gya: 'ぎゃ', gyu: 'ぎゅ', gyo: 'ぎょ',
  sha: 'しゃ', shu: 'しゅ', she: 'しぇ', sho: 'しょ', sya: 'しゃ', syu: 'しゅ', syo: 'しょ',
  ja: 'じゃ', ju: 'じゅ', je: 'じぇ', jo: 'じょ', jya: 'じゃ', jyu: 'じゅ', jyo: 'じょ', zya: 'じゃ', zyu: 'じゅ', zyo: 'じょ',
  cha: 'ちゃ', chu: 'ちゅ', che: 'ちぇ', cho: 'ちょ', cya: 'ちゃ', cyu: 'ちゅ', cyo: 'ちょ', tya: 'ちゃ', tyu: 'ちゅ', tyo: 'ちょ',
  nya: 'にゃ', nyu: 'にゅ', nyo: 'にょ',
  hya: 'ひゃ', hyu: 'ひゅ', hyo: 'ひょ',
  bya: 'びゃ', byu: 'びゅ', byo: 'びょ',
  pya: 'ぴゃ', pyu: 'ぴゅ', pyo: 'ぴょ',
  mya: 'みゃ', myu: 'みゅ', myo: 'みょ',
  rya: 'りゃ', ryu: 'りゅ', ryo: 'りょ',
  fa: 'ふぁ', fi: 'ふぃ', fe: 'ふぇ', fo: 'ふぉ',
  thi: 'てぃ', dhi: 'でぃ', twu: 'とぅ', dwu: 'どぅ',
  va: 'ゔぁ', vi: 'ゔぃ', vu: 'ゔ', ve: 'ゔぇ', vo: 'ゔぉ',
  xa: 'ぁ', xi: 'ぃ', xu: 'ぅ', xe: 'ぇ', xo: 'ぉ',
  xya: 'ゃ', xyu: 'ゅ', xyo: 'ょ', xtu: 'っ', xtsu: 'っ', ltu: 'っ', ltsu: 'っ', xwa: 'ゎ',
  '-': 'ー',
};
const VOWELS = 'aiueo';
const PREFIXES = new Set(Object.keys(ROMAJI).flatMap((key) => [...key].map((_, i) => key.slice(0, i + 1))));

const isLetter = (c) => c >= 'a' && c <= 'z';

/**
 * Romaji to hiragana. With final: false (while typing) an unfinished
 * syllable at the end stays in Latin letters, so "tabe" + "r" shows "たべr".
 */
export function romajiToKana(input, { final = true } = {}) {
  const s = String(input).toLowerCase();
  let out = '';
  let i = 0;
  while (i < s.length) {
    const c = s[i];
    const next = s[i + 1];
    if (!isLetter(c) && c !== '-' && c !== "'") {
      out += c;
      i++;
      continue;
    }
    if (c === "'") { i++; continue; }
    if (c === 'n') {
      if (next === undefined) {
        out += final ? 'ん' : 'n';
        i++;
        continue;
      }
      if (next === "'") { out += 'ん'; i += 2; continue; }
      if (next === 'n') {
        const after = s[i + 2];
        out += 'ん';
        i += after !== undefined && (VOWELS.includes(after) || after === 'y') ? 1 : 2;
        continue;
      }
      if (!VOWELS.includes(next) && next !== 'y') { out += 'ん'; i++; continue; }
    }
    if (isLetter(c) && c === next && !VOWELS.includes(c)) { out += 'っ'; i++; continue; }
    if (c === 't' && next === 'c' && s[i + 2] === 'h') { out += 'っ'; i++; continue; }

    let matched = false;
    for (const length of [4, 3, 2, 1]) {
      const piece = s.slice(i, i + length);
      if (piece.length === length && ROMAJI[piece]) {
        out += ROMAJI[piece];
        i += length;
        matched = true;
        break;
      }
    }
    if (matched) continue;
    if (!final && PREFIXES.has(s.slice(i))) {
      out += s.slice(i);
      break;
    }
    out += c;
    i++;
  }
  return out;
}

export const toHiragana = (text) => String(text).replace(/[ァ-ヶ]/g, (c) => String.fromCharCode(c.charCodeAt(0) - 0x60));
export const toKatakana = (text) => String(text).replace(/[ぁ-ゖ]/g, (c) => String.fromCharCode(c.charCodeAt(0) + 0x60));

export const isKana = (text) => /^[぀-ゟ゠-ヿー]+$/.test(text);
export const hasLatin = (text) => /[a-z]/i.test(text);

const VOWEL_OF = {};
for (const [vowel, row] of Object.entries({
  あ: 'あかさたなはまやらわがざだばぱぁゃゎ', い: 'いきしちにひみりぎじぢびぴぃ', う: 'うくすつぬふむゆるぐずづぶぷぅゅゔ',
  え: 'えけせてねへめれげぜでべぺぇ', お: 'おこそとのほもよろをごぞどぼぽぉょ',
})) {
  for (const kana of row) VOWEL_OF[kana] = vowel;
}

/** ー after a kana becomes that kana's vowel: こーひー → こおひい. */
const expandLongVowels = (text) => text.replace(/(.)ー+/g, (match, kana) => kana + (VOWEL_OF[kana] ?? '').repeat(match.length - 1));

/**
 * Makes typed answers comparable: full-width/half-width, spaces,
 * punctuation, romaji, katakana and the long vowel mark.
 */
export function normalizeAnswer(text) {
  let value = String(text ?? '').normalize('NFKC').toLowerCase().trim();
  value = value.replace(/[\s　。、．，,.!！?？「」『』（）()~～〜・…]/g, '');
  if (hasLatin(value)) value = romajiToKana(value);
  return expandLongVowels(toHiragana(value));
}

/* ---------- kana charts for the kana trainer ---------- */

// [kana, romaji shown, other accepted romaji]
const BASIC = [
  ['あ', 'a'], ['い', 'i'], ['う', 'u'], ['え', 'e'], ['お', 'o'],
  ['か', 'ka'], ['き', 'ki'], ['く', 'ku'], ['け', 'ke'], ['こ', 'ko'],
  ['さ', 'sa'], ['し', 'shi', 'si'], ['す', 'su'], ['せ', 'se'], ['そ', 'so'],
  ['た', 'ta'], ['ち', 'chi', 'ti'], ['つ', 'tsu', 'tu'], ['て', 'te'], ['と', 'to'],
  ['な', 'na'], ['に', 'ni'], ['ぬ', 'nu'], ['ね', 'ne'], ['の', 'no'],
  ['は', 'ha'], ['ひ', 'hi'], ['ふ', 'fu', 'hu'], ['へ', 'he'], ['ほ', 'ho'],
  ['ま', 'ma'], ['み', 'mi'], ['む', 'mu'], ['め', 'me'], ['も', 'mo'],
  ['や', 'ya'], ['ゆ', 'yu'], ['よ', 'yo'],
  ['ら', 'ra'], ['り', 'ri'], ['る', 'ru'], ['れ', 're'], ['ろ', 'ro'],
  ['わ', 'wa'], ['を', 'wo', 'o'], ['ん', 'n', 'nn'],
];
const VOICED = [
  ['が', 'ga'], ['ぎ', 'gi'], ['ぐ', 'gu'], ['げ', 'ge'], ['ご', 'go'],
  ['ざ', 'za'], ['じ', 'ji', 'zi'], ['ず', 'zu'], ['ぜ', 'ze'], ['ぞ', 'zo'],
  ['だ', 'da'], ['ぢ', 'ji', 'di'], ['づ', 'zu', 'du'], ['で', 'de'], ['ど', 'do'],
  ['ば', 'ba'], ['び', 'bi'], ['ぶ', 'bu'], ['べ', 'be'], ['ぼ', 'bo'],
  ['ぱ', 'pa'], ['ぴ', 'pi'], ['ぷ', 'pu'], ['ぺ', 'pe'], ['ぽ', 'po'],
];
const COMBINED = [
  ['きゃ', 'kya'], ['きゅ', 'kyu'], ['きょ', 'kyo'],
  ['しゃ', 'sha', 'sya'], ['しゅ', 'shu', 'syu'], ['しょ', 'sho', 'syo'],
  ['ちゃ', 'cha', 'tya'], ['ちゅ', 'chu', 'tyu'], ['ちょ', 'cho', 'tyo'],
  ['にゃ', 'nya'], ['にゅ', 'nyu'], ['にょ', 'nyo'],
  ['ひゃ', 'hya'], ['ひゅ', 'hyu'], ['ひょ', 'hyo'],
  ['みゃ', 'mya'], ['みゅ', 'myu'], ['みょ', 'myo'],
  ['りゃ', 'rya'], ['りゅ', 'ryu'], ['りょ', 'ryo'],
  ['ぎゃ', 'gya'], ['ぎゅ', 'gyu'], ['ぎょ', 'gyo'],
  ['じゃ', 'ja', 'jya', 'zya'], ['じゅ', 'ju', 'jyu', 'zyu'], ['じょ', 'jo', 'jyo', 'zyo'],
  ['びゃ', 'bya'], ['びゅ', 'byu'], ['びょ', 'byo'],
  ['ぴゃ', 'pya'], ['ぴゅ', 'pyu'], ['ぴょ', 'pyo'],
];
// Katakana-only combinations for loanwords.
const EXTENDED = [
  ['ティ', 'ti', 'thi'], ['ディ', 'di', 'dhi'], ['ファ', 'fa'], ['フィ', 'fi'], ['フェ', 'fe'], ['フォ', 'fo'],
  ['ウィ', 'wi'], ['ウェ', 'we'], ['ウォ', 'wo'], ['シェ', 'she'], ['ジェ', 'je'], ['チェ', 'che'], ['ヴ', 'vu'],
];

const entry = (group, script) => ([kana, romaji, ...alts]) => ({
  kana: script === 'kata' ? toKatakana(kana) : kana,
  romaji,
  accept: [romaji, ...alts],
  group,
  script,
});

export const KANA = [
  ...BASIC.map(entry('basic', 'hira')),
  ...VOICED.map(entry('voiced', 'hira')),
  ...COMBINED.map(entry('combined', 'hira')),
  ...BASIC.map(entry('basic', 'kata')),
  ...VOICED.map(entry('voiced', 'kata')),
  ...COMBINED.map(entry('combined', 'kata')),
  ...EXTENDED.map(([kana, romaji, ...alts]) => ({ kana, romaji, accept: [romaji, ...alts], group: 'extended', script: 'kata' })),
];

/** Chart rows for the reference table, in gojūon order. */
export const KANA_ROWS = {
  basic: [['あ', 'い', 'う', 'え', 'お'], ['か', 'き', 'く', 'け', 'こ'], ['さ', 'し', 'す', 'せ', 'そ'], ['た', 'ち', 'つ', 'て', 'と'],
    ['な', 'に', 'ぬ', 'ね', 'の'], ['は', 'ひ', 'ふ', 'へ', 'ほ'], ['ま', 'み', 'む', 'め', 'も'], ['や', '', 'ゆ', '', 'よ'],
    ['ら', 'り', 'る', 'れ', 'ろ'], ['わ', '', '', '', 'を'], ['ん', '', '', '', '']],
  voiced: [['が', 'ぎ', 'ぐ', 'げ', 'ご'], ['ざ', 'じ', 'ず', 'ぜ', 'ぞ'], ['だ', 'ぢ', 'づ', 'で', 'ど'], ['ば', 'び', 'ぶ', 'べ', 'ぼ'], ['ぱ', 'ぴ', 'ぷ', 'ぺ', 'ぽ']],
  combined: [['きゃ', 'きゅ', 'きょ'], ['しゃ', 'しゅ', 'しょ'], ['ちゃ', 'ちゅ', 'ちょ'], ['にゃ', 'にゅ', 'にょ'], ['ひゃ', 'ひゅ', 'ひょ'],
    ['みゃ', 'みゅ', 'みょ'], ['りゃ', 'りゅ', 'りょ'], ['ぎゃ', 'ぎゅ', 'ぎょ'], ['じゃ', 'じゅ', 'じょ'], ['びゃ', 'びゅ', 'びょ'], ['ぴゃ', 'ぴゅ', 'ぴょ']],
};

const ROMAJI_OF = Object.fromEntries([...BASIC, ...VOICED, ...COMBINED].map(([kana, romaji]) => [kana, romaji]));

/** Hepburn romaji for a kana word (for hints): がっこう → gakkou. */
export function kanaToRomaji(text) {
  const s = toHiragana(String(text));
  let out = '';
  for (let i = 0; i < s.length; i++) {
    const pair = s.slice(i, i + 2);
    if (ROMAJI_OF[pair] && pair.length === 2) { out += ROMAJI_OF[pair]; i++; continue; }
    const c = s[i];
    if (c === 'っ') {
      const following = ROMAJI_OF[s.slice(i + 1, i + 3)] ?? ROMAJI_OF[s[i + 1]] ?? '';
      out += following.startsWith('ch') ? 't' : following[0] ?? '';
      continue;
    }
    if (c === 'ー') { out += out.at(-1) ?? ''; continue; }
    out += ROMAJI_OF[c] ?? c;
  }
  return out;
}
