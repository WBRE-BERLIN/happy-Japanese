/*
 * Numbers, prices, clock times, dates and counters with their readings and
 * the typical mistakes (wrong sound changes) used as distractors.
 */

const DIGIT = ['', 'いち', 'に', 'さん', 'よん', 'ご', 'ろく', 'なな', 'はち', 'きゅう'];
const KANJI_DIGIT = ['〇', '一', '二', '三', '四', '五', '六', '七', '八', '九'];
const HUNDREDS = ['', 'ひゃく', 'にひゃく', 'さんびゃく', 'よんひゃく', 'ごひゃく', 'ろっぴゃく', 'ななひゃく', 'はっぴゃく', 'きゅうひゃく'];
const THOUSANDS = ['', 'せん', 'にせん', 'さんぜん', 'よんせん', 'ごせん', 'ろくせん', 'ななせん', 'はっせん', 'きゅうせん'];
const WRONG_HUNDREDS = { 1: ['いちひゃく', 'いっぴゃく'], 3: ['さんひゃく', 'さんぴゃく'], 6: ['ろくひゃく', 'ろっびゃく'], 8: ['はちひゃく', 'はっびゃく'], 4: ['よんびゃく'], 9: ['きゅうびゃく'] };
const WRONG_THOUSANDS = { 1: ['いちせん'], 3: ['さんせん'], 6: ['ろっせん'], 8: ['はちせん', 'はっぜん'], 4: ['よんぜん'], 2: ['にぜん'] };
const ONES_ALT = { 4: ['し'], 7: ['しち'], 9: ['く'] };

/** A number as reading parts, one per place: 36800 → さんまん・ろくせん・はっぴゃく. */
export function numberParts(n) {
  if (!Number.isInteger(n) || n < 0 || n >= 1e12) throw new Error(`Number out of range: ${n}`);
  if (n === 0) return [{ kana: 'ゼロ', alt: ['れい', 'ぜろ'], wrong: [], kanji: '〇' }];

  const parts = [];
  const groups = [[Math.floor(n / 1e8) % 1e4, 'おく', '億'], [Math.floor(n / 1e4) % 1e4, 'まん', '万'], [n % 1e4, '', '']];
  for (const [group, suffix, suffixKanji] of groups) {
    if (group === 0) continue;
    const t = Math.floor(group / 1000);
    const h = Math.floor(group / 100) % 10;
    const te = Math.floor(group / 10) % 10;
    const o = group % 10;
    const groupParts = [];
    if (t) {
      groupParts.push(t === 1 && suffix
        ? { kana: 'いっせん', alt: ['せん'], wrong: ['いちせん'], kanji: '千' }
        : { kana: THOUSANDS[t], alt: [], wrong: WRONG_THOUSANDS[t] ?? [], kanji: (t > 1 ? KANJI_DIGIT[t] : '') + '千' });
    }
    if (h) groupParts.push({ kana: HUNDREDS[h], alt: [], wrong: WRONG_HUNDREDS[h] ?? [], kanji: (h > 1 ? KANJI_DIGIT[h] : '') + '百' });
    if (te) groupParts.push({ kana: te === 1 ? 'じゅう' : `${DIGIT[te]}じゅう`, alt: [], wrong: te === 1 ? ['いちじゅう'] : [], kanji: (te > 1 ? KANJI_DIGIT[te] : '') + '十' });
    if (o) groupParts.push({ kana: DIGIT[o], alt: ONES_ALT[o] ?? [], wrong: [], kanji: KANJI_DIGIT[o] });
    if (suffix) {
      const last = groupParts.at(-1);
      last.kana += suffix;
      last.alt = last.alt.map((a) => a + suffix);
      last.wrong = [...last.wrong.map((w) => w + suffix), ...(group === 1 ? [suffix] : [])];
      last.kanji += suffixKanji;
    }
    parts.push(...groupParts);
  }
  return parts;
}

/** Full reading: 36800 → さんまんろくせんはっぴゃく */
export const numberKana = (n) => numberParts(n).map((p) => p.kana).join('');

/** All accepted readings (alternatives of single parts combined). */
export function numberReadings(n, parts = numberParts(n)) {
  let readings = [''];
  for (const part of parts) readings = readings.flatMap((r) => [part.kana, ...part.alt].map((k) => r + k));
  return readings;
}

/** Kanji numerals: 36800 → 三万六千八百 */
export const numberKanji = (n) => (n === 0 ? '〇' : numberParts(n).map((p) => p.kanji).join(''));

/** Groups digits the Japanese way for display: 36800 → 36,800 (and 3万6800 as a hint). */
export const formatNumber = (n) => n.toLocaleString('de-DE');

/** Price parts: like numbers, plus えん; 4 before 円 is よ (よえん). */
export function priceParts(n) {
  const parts = numberParts(n).map((p) => ({ ...p, alt: [...p.alt], wrong: [...p.wrong] }));
  const last = parts.at(-1);
  if (n % 10 === 4) {
    last.kana = last.kana.replace(/よん$/, 'よ');
    last.alt = [];
    last.wrong = ['よん', 'し'].map((w) => last.kana.replace(/よ$/, w));
  }
  if (n % 10 === 9) last.alt = [];
  return [...parts, { kana: 'えん', alt: [], wrong: [], kanji: '円' }];
}

/* ---------- clock ---------- */

const HOURS = ['', 'いちじ', 'にじ', 'さんじ', 'よじ', 'ごじ', 'ろくじ', 'しちじ', 'はちじ', 'くじ', 'じゅうじ', 'じゅういちじ', 'じゅうにじ'];
const WRONG_HOURS = { 4: ['よんじ', 'しじ'], 7: ['ななじ'], 9: ['きゅうじ'], 1: ['いっじ'], 6: ['ろっじ'] };
const MINUTE_ONES = ['', 'いっぷん', 'にふん', 'さんぷん', 'よんぷん', 'ごふん', 'ろっぷん', 'ななふん', 'はっぷん', 'きゅうふん'];
const MINUTE_ALT = { 8: ['はちふん'] };
const WRONG_MINUTES = {
  1: ['いちふん', 'いっふん'], 2: ['にぷん'], 3: ['さんふん'], 4: ['よんふん', 'よふん'], 5: ['ごぷん'],
  6: ['ろくふん', 'ろっふん'], 7: ['ななぷん', 'しちふん'], 8: ['はっふん'], 9: ['きゅうぷん', 'くふん'],
};

export const hourKana = (h) => HOURS[h];
export const hourWrong = (h) => WRONG_HOURS[h] ?? [];

/** Reading of 1–59 minutes: { kana, alt, wrong }. */
export function minuteReading(m) {
  const tens = Math.floor(m / 10);
  const ones = m % 10;
  const prefix = tens === 0 ? '' : tens === 1 ? 'じゅう' : `${DIGIT[tens]}じゅう`;
  if (ones === 0) {
    const stem = tens === 1 ? '' : DIGIT[tens];
    return { kana: `${stem}じゅっぷん`, alt: [`${stem}じっぷん`], wrong: [`${stem}じゅうふん`, `${stem}じゅっふん`] };
  }
  return {
    kana: prefix + MINUTE_ONES[ones],
    alt: (MINUTE_ALT[ones] ?? []).map((a) => prefix + a),
    wrong: (WRONG_MINUTES[ones] ?? []).map((w) => prefix + w),
  };
}

/**
 * Clock time as parts: [ごご] [よじ] [じゅうごふん]. h in 0–23.
 * With ampm: false the ごぜん/ごご part is left out (analog clocks).
 */
export function timeParts(h, m, { ampm = true } = {}) {
  const h12 = h % 12 === 0 ? 12 : h % 12;
  const parts = [];
  if (ampm) parts.push({ kana: h < 12 ? 'ごぜん' : 'ごご', alt: [], wrong: [h < 12 ? 'ごご' : 'ごぜん'] });
  parts.push({ kana: HOURS[h12], alt: [], wrong: hourWrong(h12) });
  if (m === 30) parts.push({ kana: 'はん', alt: ['さんじゅっぷん', 'さんじっぷん'], wrong: ['はんぷん'] });
  else if (m > 0) parts.push(minuteReading(m));
  return parts;
}

/* ---------- calendar ---------- */

const MONTHS = ['', 'いちがつ', 'にがつ', 'さんがつ', 'しがつ', 'ごがつ', 'ろくがつ', 'しちがつ', 'はちがつ', 'くがつ', 'じゅうがつ', 'じゅういちがつ', 'じゅうにがつ'];
const WRONG_MONTHS = { 4: ['よんがつ', 'よがつ'], 7: ['なながつ'], 9: ['きゅうがつ'], 1: ['いっがつ'], 6: ['ろっがつ'] };

const DAYS = ['', 'ついたち', 'ふつか', 'みっか', 'よっか', 'いつか', 'むいか', 'なのか', 'ようか', 'ここのか', 'とおか',
  'じゅういちにち', 'じゅうににち', 'じゅうさんにち', 'じゅうよっか', 'じゅうごにち', 'じゅうろくにち', 'じゅうしちにち', 'じゅうはちにち', 'じゅうくにち', 'はつか',
  'にじゅういちにち', 'にじゅうににち', 'にじゅうさんにち', 'にじゅうよっか', 'にじゅうごにち', 'にじゅうろくにち', 'にじゅうしちにち', 'にじゅうはちにち', 'にじゅうくにち', 'さんじゅうにち', 'さんじゅういちにち'];
const WRONG_DAYS = {
  1: ['いちにち', 'ついたいち'], 2: ['ににち', 'ふたか'], 3: ['さんにち', 'みつか'], 4: ['よんにち', 'よんか'], 5: ['ごにち', 'いつつか'],
  6: ['ろくにち', 'むっか'], 7: ['ななにち', 'しちにち'], 8: ['はちにち', 'やっか'], 9: ['くにち', 'きゅうにち'], 10: ['じゅうにち', 'とうか'],
  14: ['じゅうよんにち', 'じゅうよっにち'], 17: ['じゅうななにち'], 19: ['じゅうきゅうにち'], 20: ['にじゅうにち', 'はたか'],
  24: ['にじゅうよんにち'], 27: ['にじゅうななにち'], 29: ['にじゅうきゅうにち'],
};

export const WEEKDAYS = [
  { kana: 'にちようび', kanji: '日曜日', de: 'Sonntag', short: '日' },
  { kana: 'げつようび', kanji: '月曜日', de: 'Montag', short: '月' },
  { kana: 'かようび', kanji: '火曜日', de: 'Dienstag', short: '火' },
  { kana: 'すいようび', kanji: '水曜日', de: 'Mittwoch', short: '水' },
  { kana: 'もくようび', kanji: '木曜日', de: 'Donnerstag', short: '木' },
  { kana: 'きんようび', kanji: '金曜日', de: 'Freitag', short: '金' },
  { kana: 'どようび', kanji: '土曜日', de: 'Samstag', short: '土' },
];

export const monthReading = (m) => ({ kana: MONTHS[m], alt: [], wrong: WRONG_MONTHS[m] ?? [`${DIGIT[m % 10] || ''}がつ`] });
export const dayReading = (d) => ({ kana: DAYS[d], alt: [], wrong: WRONG_DAYS[d] ?? [] });

/** Year: 2026 → にせんにじゅうろくねん; 4 → よねん, 9 → きゅうねん/くねん, 7 → ななねん/しちねん. */
export function yearParts(y) {
  const parts = numberParts(y).map((p) => ({ ...p, alt: [...p.alt], wrong: [...p.wrong] }));
  const last = parts.at(-1);
  if (y % 10 === 4) {
    last.kana = last.kana.replace(/よん$/, 'よ');
    last.alt = [];
    last.wrong = [last.kana.replace(/よ$/, 'よん'), last.kana.replace(/よ$/, 'し')];
  }
  return [...parts, { kana: 'ねん', alt: [], wrong: [] }];
}

/* ---------- relative time words ---------- */

export const TIME_GRID = {
  rows: [
    { id: 'day', de: 'Tag', words: [['一昨日', 'おととい', 'vorgestern'], ['昨日', 'きのう', 'gestern'], ['今日', 'きょう', 'heute'], ['明日', 'あした', 'morgen'], ['明後日', 'あさって', 'übermorgen']] },
    { id: 'morning', de: 'Morgen', words: [null, ['昨日の朝', 'きのうのあさ', 'gestern Morgen'], ['今朝', 'けさ', 'heute Morgen'], ['明日の朝', 'あしたのあさ', 'morgen früh'], null] },
    { id: 'evening', de: 'Abend', words: [null, ['昨日の晩', 'きのうのばん', 'gestern Abend'], ['今晩', 'こんばん', 'heute Abend'], ['明日の晩', 'あしたのばん', 'morgen Abend'], null] },
    { id: 'week', de: 'Woche', words: [['先々週', 'せんせんしゅう', 'vorletzte Woche'], ['先週', 'せんしゅう', 'letzte Woche'], ['今週', 'こんしゅう', 'diese Woche'], ['来週', 'らいしゅう', 'nächste Woche'], ['再来週', 'さらいしゅう', 'übernächste Woche']] },
    { id: 'month', de: 'Monat', words: [['先々月', 'せんせんげつ', 'vorletzter Monat'], ['先月', 'せんげつ', 'letzter Monat'], ['今月', 'こんげつ', 'dieser Monat'], ['来月', 'らいげつ', 'nächster Monat'], ['再来月', 'さらいげつ', 'übernächster Monat']] },
    { id: 'year', de: 'Jahr', words: [['一昨年', 'おととし', 'vorletztes Jahr'], ['去年', 'きょねん', 'letztes Jahr'], ['今年', 'ことし', 'dieses Jahr'], ['来年', 'らいねん', 'nächstes Jahr'], ['再来年', 'さらいねん', 'übernächstes Jahr']] },
  ],
  every: [['毎日', 'まいにち', 'jeden Tag'], ['毎朝', 'まいあさ', 'jeden Morgen'], ['毎晩', 'まいばん', 'jeden Abend'], ['毎週', 'まいしゅう', 'jede Woche'], ['毎月', 'まいつき', 'jeden Monat'], ['毎年', 'まいとし', 'jedes Jahr']],
};

/* ---------- counters ---------- */

/**
 * Counters with their readings for 1–10 and the question word. alt holds
 * readings that are also correct; objects are things counted with it.
 */
export const COUNTERS = [
  { id: 'tsu', kanji: 'つ', kana: 'つ', de: 'allgemein (Dinge, Stück)', q: 'いくつ', lesson: 11,
    readings: ['ひとつ', 'ふたつ', 'みっつ', 'よっつ', 'いつつ', 'むっつ', 'ななつ', 'やっつ', 'ここのつ', 'とお'],
    wrong: { 1: ['ひとっつ', 'いちつ'], 2: ['ふたっつ', 'につ'], 3: ['みつ', 'さんつ'], 4: ['よんつ', 'よつ'], 5: ['ごつ', 'いつっつ'], 6: ['むつ', 'ろくつ'], 7: ['なのつ', 'しちつ'], 8: ['やつ', 'はっつ'], 9: ['ここのっつ', 'きゅうつ'], 10: ['とおつ', 'じゅっつ'] } },
  { id: 'nin', kanji: '人', kana: 'にん', de: 'Personen', q: 'なんにん', lesson: 11,
    readings: ['ひとり', 'ふたり', 'さんにん', 'よにん', 'ごにん', 'ろくにん', 'ななにん', 'はちにん', 'きゅうにん', 'じゅうにん'],
    alt: { 7: ['しちにん'] }, wrong: { 1: ['いちにん', 'ひとにん'], 2: ['ににん', 'ふたにん'], 4: ['よんにん', 'しにん'], 9: ['くにん'] } },
  { id: 'mai', kanji: '枚', kana: 'まい', de: 'flache, dünne Dinge', q: 'なんまい', lesson: 11,
    readings: ['いちまい', 'にまい', 'さんまい', 'よんまい', 'ごまい', 'ろくまい', 'ななまい', 'はちまい', 'きゅうまい', 'じゅうまい'] },
  { id: 'dai', kanji: '台', kana: 'だい', de: 'Maschinen, Fahrzeuge', q: 'なんだい', lesson: 11,
    readings: ['いちだい', 'にだい', 'さんだい', 'よんだい', 'ごだい', 'ろくだい', 'ななだい', 'はちだい', 'きゅうだい', 'じゅうだい'] },
  { id: 'hon', kanji: '本', kana: 'ほん', de: 'lange, dünne Dinge', q: 'なんぼん', lesson: 11,
    readings: ['いっぽん', 'にほん', 'さんぼん', 'よんほん', 'ごほん', 'ろっぽん', 'ななほん', 'はっぽん', 'きゅうほん', 'じゅっぽん'],
    alt: { 8: ['はちほん'], 10: ['じっぽん'] } },
  { id: 'satsu', kanji: '冊', kana: 'さつ', de: 'Bücher, Hefte', q: 'なんさつ', lesson: 11,
    readings: ['いっさつ', 'にさつ', 'さんさつ', 'よんさつ', 'ごさつ', 'ろくさつ', 'ななさつ', 'はっさつ', 'きゅうさつ', 'じゅっさつ'],
    alt: { 10: ['じっさつ'] } },
  { id: 'hiki', kanji: '匹', kana: 'ひき', de: 'kleine Tiere', q: 'なんびき', lesson: 11,
    readings: ['いっぴき', 'にひき', 'さんびき', 'よんひき', 'ごひき', 'ろっぴき', 'ななひき', 'はっぴき', 'きゅうひき', 'じゅっぴき'],
    alt: { 8: ['はちひき'], 10: ['じっぴき'] } },
  { id: 'tou', kanji: '頭', kana: 'とう', de: 'große Tiere', q: 'なんとう', lesson: 11,
    readings: ['いっとう', 'にとう', 'さんとう', 'よんとう', 'ごとう', 'ろくとう', 'ななとう', 'はっとう', 'きゅうとう', 'じゅっとう'],
    alt: { 8: ['はちとう'], 10: ['じっとう'] } },
  { id: 'wa', kanji: '羽', kana: 'わ', de: 'Vögel', q: 'なんわ', lesson: 11,
    readings: ['いちわ', 'にわ', 'さんわ', 'よんわ', 'ごわ', 'ろくわ', 'ななわ', 'はちわ', 'きゅうわ', 'じゅうわ'],
    alt: { 3: ['さんば'], 6: ['ろっぱ'], 8: ['はっぱ'], 10: ['じゅっぱ', 'じっぱ'] } },
  { id: 'ko', kanji: '個', kana: 'こ', de: 'kleine Gegenstände', q: 'なんこ', lesson: 11,
    readings: ['いっこ', 'にこ', 'さんこ', 'よんこ', 'ごこ', 'ろっこ', 'ななこ', 'はっこ', 'きゅうこ', 'じゅっこ'],
    alt: { 8: ['はちこ'], 10: ['じっこ'] } },
  { id: 'hai', kanji: '杯', kana: 'はい', de: 'Tassen, Gläser, Schalen', q: 'なんばい', lesson: 11,
    readings: ['いっぱい', 'にはい', 'さんばい', 'よんはい', 'ごはい', 'ろっぱい', 'ななはい', 'はっぱい', 'きゅうはい', 'じゅっぱい'],
    alt: { 8: ['はちはい'], 10: ['じっぱい'] } },
  { id: 'kai', kanji: '回', kana: 'かい', de: 'Male (wie oft)', q: 'なんかい', lesson: 11,
    readings: ['いっかい', 'にかい', 'さんかい', 'よんかい', 'ごかい', 'ろっかい', 'ななかい', 'はっかい', 'きゅうかい', 'じゅっかい'],
    alt: { 8: ['はちかい'], 10: ['じっかい'] } },
  { id: 'kaidan', kanji: '階', kana: 'かい', de: 'Stockwerke', q: 'なんがい', lesson: 3,
    readings: ['いっかい', 'にかい', 'さんがい', 'よんかい', 'ごかい', 'ろっかい', 'ななかい', 'はっかい', 'きゅうかい', 'じゅっかい'],
    alt: { 3: ['さんかい'], 8: ['はちかい'], 10: ['じっかい'] } },
  { id: 'sai', kanji: '歳', kana: 'さい', de: 'Lebensjahre (Alter)', q: 'なんさい', lesson: 1,
    readings: ['いっさい', 'にさい', 'さんさい', 'よんさい', 'ごさい', 'ろくさい', 'ななさい', 'はっさい', 'きゅうさい', 'じゅっさい'],
    alt: { 10: ['じっさい'] } },
  { id: 'soku', kanji: '足', kana: 'そく', de: 'Paare (Schuhe, Socken)', q: 'なんぞく', lesson: 11,
    readings: ['いっそく', 'にそく', 'さんぞく', 'よんそく', 'ごそく', 'ろくそく', 'ななそく', 'はっそく', 'きゅうそく', 'じゅっそく'],
    alt: { 10: ['じっそく'] } },
  { id: 'chaku', kanji: '着', kana: 'ちゃく', de: 'Kleidungsstücke (Anzüge, Kleider)', q: 'なんちゃく', lesson: 11,
    readings: ['いっちゃく', 'にちゃく', 'さんちゃく', 'よんちゃく', 'ごちゃく', 'ろくちゃく', 'ななちゃく', 'はっちゃく', 'きゅうちゃく', 'じゅっちゃく'],
    alt: { 10: ['じっちゃく'] } },
  { id: 'ken', kanji: '軒', kana: 'けん', de: 'Häuser, Läden', q: 'なんげん', lesson: 11,
    readings: ['いっけん', 'にけん', 'さんげん', 'よんけん', 'ごけん', 'ろっけん', 'ななけん', 'はっけん', 'きゅうけん', 'じゅっけん'],
    alt: { 3: ['さんけん'], 10: ['じっけん'] } },
  { id: 'haku', kanji: '泊', kana: 'はく', de: 'Übernachtungen', q: 'なんぱく', lesson: 19,
    readings: ['いっぱく', 'にはく', 'さんぱく', 'よんはく', 'ごはく', 'ろっぱく', 'ななはく', 'はっぱく', 'きゅうはく', 'じゅっぱく'],
    alt: { 4: ['よんぱく'], 10: ['じっぱく'] } },
  { id: 'mei', kanji: '名', kana: 'めい', de: 'Personen (höflich)', q: 'なんめい', lesson: 11,
    readings: ['いちめい', 'にめい', 'さんめい', 'よんめい', 'ごめい', 'ろくめい', 'ななめい', 'はちめい', 'きゅうめい', 'じゅうめい'] },
  { id: 'ban', kanji: '番', kana: 'ばん', de: 'Nummer, Platz in einer Reihenfolge', q: 'なんばん', lesson: 4,
    readings: ['いちばん', 'にばん', 'さんばん', 'よんばん', 'ごばん', 'ろくばん', 'ななばん', 'はちばん', 'きゅうばん', 'じゅうばん'] },
  { id: 'bansen', kanji: '番線', kana: 'ばんせん', de: 'Gleis', q: 'なんばんせん', lesson: 5,
    readings: ['いちばんせん', 'にばんせん', 'さんばんせん', 'よんばんせん', 'ごばんせん', 'ろくばんせん', 'ななばんせん', 'はちばんせん', 'きゅうばんせん', 'じゅうばんせん'] },
  { id: 'gousha', kanji: '号車', kana: 'ごうしゃ', de: 'Wagen (im Zug)', q: 'なんごうしゃ', lesson: 5,
    readings: ['いちごうしゃ', 'にごうしゃ', 'さんごうしゃ', 'よんごうしゃ', 'ごごうしゃ', 'ろくごうしゃ', 'ななごうしゃ', 'はちごうしゃ', 'きゅうごうしゃ', 'じゅうごうしゃ'] },
  { id: 'do', kanji: '度', kana: 'ど', de: 'Grad; Male', q: 'なんど', lesson: 19,
    readings: ['いちど', 'にど', 'さんど', 'よんど', 'ごど', 'ろくど', 'ななど', 'はちど', 'きゅうど', 'じゅうど'] },
  { id: 'tsuu', kanji: '通', kana: 'つう', de: 'Briefe, E-Mails', q: 'なんつう', lesson: 11,
    readings: ['いっつう', 'につう', 'さんつう', 'よんつう', 'ごつう', 'ろくつう', 'ななつう', 'はっつう', 'きゅうつう', 'じゅっつう'],
    alt: { 10: ['じっつう'] } },
  { id: 'kyoku', kanji: '曲', kana: 'きょく', de: 'Lieder, Musikstücke', q: 'なんきょく', lesson: 18,
    readings: ['いっきょく', 'にきょく', 'さんきょく', 'よんきょく', 'ごきょく', 'ろっきょく', 'ななきょく', 'はっきょく', 'きゅうきょく', 'じゅっきょく'],
    alt: { 10: ['じっきょく'] } },
  // durations (lesson 11)
  { id: 'jikan', kanji: '時間', kana: 'じかん', de: 'Stunden (Dauer)', q: 'なんじかん', lesson: 11, duration: true,
    readings: ['いちじかん', 'にじかん', 'さんじかん', 'よじかん', 'ごじかん', 'ろくじかん', 'ななじかん', 'はちじかん', 'くじかん', 'じゅうじかん'],
    alt: { 7: ['しちじかん'] }, wrong: { 4: ['よんじかん'], 9: ['きゅうじかん'] } },
  { id: 'fun', kanji: '分', kana: 'ふん', de: 'Minuten (Dauer)', q: 'なんぷん', lesson: 11, duration: true,
    readings: ['いっぷん', 'にふん', 'さんぷん', 'よんぷん', 'ごふん', 'ろっぷん', 'ななふん', 'はっぷん', 'きゅうふん', 'じゅっぷん'],
    alt: { 8: ['はちふん'], 10: ['じっぷん'] } },
  { id: 'nichi', kanji: '日', kana: 'にち', de: 'Tage (Dauer)', q: 'なんにち', lesson: 11, duration: true,
    readings: ['いちにち', 'ふつか', 'みっか', 'よっか', 'いつか', 'むいか', 'なのか', 'ようか', 'ここのか', 'とおか'],
    wrong: { 1: ['ついたち'], 2: ['ににち'], 3: ['さんにち'], 4: ['よんにち'], 5: ['ごにち'], 6: ['ろくにち'], 7: ['ななにち'], 8: ['はちにち'], 9: ['きゅうにち'], 10: ['じゅうにち'] } },
  { id: 'shuukan', kanji: '週間', kana: 'しゅうかん', de: 'Wochen (Dauer)', q: 'なんしゅうかん', lesson: 11, duration: true,
    readings: ['いっしゅうかん', 'にしゅうかん', 'さんしゅうかん', 'よんしゅうかん', 'ごしゅうかん', 'ろくしゅうかん', 'ななしゅうかん', 'はっしゅうかん', 'きゅうしゅうかん', 'じゅっしゅうかん'],
    alt: { 10: ['じっしゅうかん'] } },
  { id: 'kagetsu', kanji: 'か月', kana: 'かげつ', de: 'Monate (Dauer)', q: 'なんかげつ', lesson: 11, duration: true,
    readings: ['いっかげつ', 'にかげつ', 'さんかげつ', 'よんかげつ', 'ごかげつ', 'ろっかげつ', 'ななかげつ', 'はっかげつ', 'きゅうかげつ', 'じゅっかげつ'],
    alt: { 8: ['はちかげつ'], 10: ['じっかげつ'] } },
  { id: 'nen', kanji: '年', kana: 'ねん', de: 'Jahre (Dauer)', q: 'なんねん', lesson: 11, duration: true,
    readings: ['いちねん', 'にねん', 'さんねん', 'よねん', 'ごねん', 'ろくねん', 'ななねん', 'はちねん', 'きゅうねん', 'じゅうねん'],
    alt: { 7: ['しちねん'], 9: ['くねん'] }, wrong: { 4: ['よんねん'] } },
];

export const counterById = Object.fromEntries(COUNTERS.map((c) => [c.id, c]));

/** Things to count, with the counters that fit (several when both are usual). */
export const COUNT_OBJECTS = [
  ['🐱', '{猫|ねこ}', 'Katzen', ['hiki']], ['🐶', '{犬|いぬ}', 'Hunde', ['hiki']], ['🐟', '{魚|さかな}', 'Fische', ['hiki']],
  ['🐘', 'ぞう', 'Elefanten', ['tou']], ['🐄', '{牛|うし}', 'Kühe', ['tou']], ['🐎', '{馬|うま}', 'Pferde', ['tou']],
  ['🐦', '{鳥|とり}', 'Vögel', ['wa']], ['🐓', 'にわとり', 'Hühner', ['wa']],
  ['🚗', '{車|くるま}', 'Autos', ['dai']], ['🚲', '{自転車|じてんしゃ}', 'Fahrräder', ['dai']], ['📺', 'テレビ', 'Fernseher', ['dai']],
  ['💻', 'パソコン', 'Computer', ['dai']], ['📷', 'カメラ', 'Kameras', ['dai']],
  ['🎫', '{切符|きっぷ}', 'Fahrkarten', ['mai']], ['👕', 'シャツ', 'T-Shirts', ['mai']], ['📄', '{紙|かみ}', 'Blätter Papier', ['mai']],
  ['💿', 'CD', 'CDs', ['mai']], ['🍽️', 'お{皿|さら}', 'Teller', ['mai']], ['🏞️', '{写真|しゃしん}', 'Fotos', ['mai']],
  ['🖊️', 'ボールペン', 'Kugelschreiber', ['hon']], ['☂️', '{傘|かさ}', 'Regenschirme', ['hon']], ['🍾', 'ワイン', 'Flaschen Wein', ['hon']],
  ['🍌', 'バナナ', 'Bananen', ['hon']], ['🌹', 'ばら', 'Rosen', ['hon']], ['🥕', 'にんじん', 'Karotten', ['hon']], ['🌲', '{木|き}', 'Bäume', ['hon']],
  ['📚', '{本|ほん}', 'Bücher', ['satsu']], ['📓', 'ノート', 'Hefte', ['satsu']], ['📕', '{辞書|じしょ}', 'Wörterbücher', ['satsu']],
  ['🥚', '{卵|たまご}', 'Eier', ['ko', 'tsu']], ['🍎', 'りんご', 'Äpfel', ['ko', 'tsu']], ['🍊', 'みかん', 'Mandarinen', ['ko', 'tsu']],
  ['🍙', 'おにぎり', 'Reisbällchen', ['ko', 'tsu']], ['🍰', 'ケーキ', 'Stücke Kuchen', ['ko', 'tsu']],
  ['☕', 'コーヒー', 'Tassen Kaffee', ['hai']], ['🍺', 'ビール', 'Gläser Bier', ['hai']], ['🍚', 'ご{飯|はん}', 'Schalen Reis', ['hai']], ['🍵', 'お{茶|ちゃ}', 'Tassen Tee', ['hai']],
  ['👟', '{靴|くつ}', 'Paar Schuhe', ['soku']], ['🧦', '{靴下|くつした}', 'Paar Socken', ['soku']],
  ['🏠', '{家|いえ}', 'Häuser', ['ken']], ['🏪', 'コンビニ', 'Konbinis', ['ken']],
  ['👔', 'スーツ', 'Anzüge', ['chaku']], ['👗', 'ワンピース', 'Kleider', ['chaku', 'mai']],
  ['✉️', '{手紙|てがみ}', 'Briefe', ['tsuu']], ['🎵', '{歌|うた}', 'Lieder', ['kyoku']],
  ['🧑', '{人|ひと}', 'Personen', ['nin']],
];

/** Reading of a counter for n in 1–10: { kana, alt, wrong }. */
export function counterReading(counter, n) {
  return {
    kana: counter.readings[n - 1],
    alt: counter.alt?.[n] ?? [],
    wrong: counter.wrong?.[n] ?? [],
  };
}

const PREFIX_VARIANTS = { 1: ['いち', 'いっ'], 2: ['に'], 3: ['さん'], 4: ['よん', 'よ', 'し'], 5: ['ご'], 6: ['ろく', 'ろっ'], 7: ['なな', 'しち'], 8: ['はち', 'はっ'], 9: ['きゅう', 'く'], 10: ['じゅう', 'じゅっ'] };
const voiced = { か: 'が', き: 'ぎ', く: 'ぐ', け: 'げ', こ: 'ご', さ: 'ざ', し: 'じ', す: 'ず', せ: 'ぜ', そ: 'ぞ', た: 'だ', ち: 'ぢ', つ: 'づ', て: 'で', と: 'ど', は: 'ば', ひ: 'び', ふ: 'ぶ', へ: 'べ', ほ: 'ぼ' };
const halfVoiced = { は: 'ぱ', ひ: 'ぴ', ふ: 'ぷ', へ: 'ぺ', ほ: 'ぽ' };

/**
 * Plausible wrong readings for counter × n: other sound changes on the
 * number and on the counter. Never one of the accepted readings.
 */
export function counterDistractors(counter, n) {
  const { kana, alt, wrong } = counterReading(counter, n);
  const right = new Set([kana, ...alt]);
  const base = counter.kana;
  const bases = new Set([base]);
  if (voiced[base[0]]) bases.add(voiced[base[0]] + base.slice(1));
  if (halfVoiced[base[0]]) bases.add(halfVoiced[base[0]] + base.slice(1));
  const candidates = new Set(wrong);
  // つ and days are irregular; only their listed mistakes make sense.
  if (counter.id !== 'tsu' && counter.id !== 'nichi') {
    for (const prefix of PREFIX_VARIANTS[n]) {
      for (const b of bases) {
        // っ cannot stand before a vowel or n/m/y/w sounds.
        if (prefix.endsWith('っ') && /^[あいうえおなにぬねのまみむめもやゆよわ]/.test(b)) continue;
        candidates.add(prefix + b);
      }
    }
  }
  return [...candidates].filter((c) => !right.has(c));
}

/** Plausible wrong options for a list of parts (numbers, prices, times). */
export const partsDistractors = (parts) => parts.flatMap((p) => p.wrong);
