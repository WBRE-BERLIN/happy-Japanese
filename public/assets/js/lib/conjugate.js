/*
 * Verb and adjective forms of Minna no Nihongo I. Every form is built for
 * the written form and the reading at the same time; the furigana come from
 * lining the two up again.
 */
import { wordFuri } from './furi.js';

/** Verb forms in the order the book introduces them. */
export const FORMS = {
  masu: { label: 'ます-Form', example: '食べます', lesson: 4 },
  masen: { label: 'ません', example: '食べません', lesson: 4 },
  mashita: { label: 'ました', example: '食べました', lesson: 4 },
  masendeshita: { label: 'ませんでした', example: '食べませんでした', lesson: 4 },
  mashou: { label: 'ましょう', example: '食べましょう', lesson: 6 },
  masenka: { label: 'ませんか', example: '食べませんか', lesson: 6 },
  stem: { label: 'ます-Stamm', example: '食べ(に行きます)', lesson: 13 },
  tai: { label: 'たい-Form', example: '食べたい', lesson: 13 },
  te: { label: 'て-Form', example: '食べて', lesson: 14 },
  nai: { label: 'ない-Form', example: '食べない', lesson: 17 },
  dict: { label: 'Wörterbuchform', example: '食べる', lesson: 18 },
  ta: { label: 'た-Form', example: '食べた', lesson: 19 },
  nakatta: { label: 'なかった-Form', example: '食べなかった', lesson: 20 },
  tara: { label: 'たら-Form', example: '食べたら', lesson: 25 },
  temo: { label: 'ても-Form', example: '食べても', lesson: 25 },
};

/** Plain ↔ polite pairs (lesson 20). */
export const PLAIN_OF = { masu: 'dict', masen: 'nai', mashita: 'ta', masendeshita: 'nakatta' };

const U_TO = {
  う: ['い', 'わ', 'って'], く: ['き', 'か', 'いて'], ぐ: ['ぎ', 'が', 'いで'], す: ['し', 'さ', 'して'],
  つ: ['ち', 'た', 'って'], ぬ: ['に', 'な', 'んで'], ぶ: ['び', 'ば', 'んで'], む: ['み', 'ま', 'んで'], る: ['り', 'ら', 'って'],
};

const toPast = (te) => te.replace(/て$/, 'た').replace(/で$/, 'だ');

/**
 * The building blocks of a verb for one script: the ます-stem, the ない-stem
 * and the て-form. `isIku` marks 行く and its compounds.
 */
function blocks(text, group, kana, kind) {
  if (kind === 'kuru') {
    const base = text.slice(0, -2);
    const k = kana ? ['き', 'こ', 'きて'] : ['来', '来', '来て'];
    return { stem: base + k[0], nai: base + k[1], te: base + k[2] };
  }
  if (group === 3) {
    const base = text.slice(0, -2);
    return { stem: `${base}し`, nai: `${base}し`, te: `${base}して` };
  }
  const base = text.slice(0, -1);
  if (group === 2) return { stem: base, nai: base, te: `${base}て` };

  const [i, a, te] = U_TO[text.at(-1)];
  return { stem: base + i, nai: base + a, te: kind === 'iku' ? `${base}って` : base + te };
}

function kindOf(written, reading, group) {
  if (group === 3 && reading.endsWith('くる')) return 'kuru';
  if (group === 1 && reading.endsWith('いく') && (written.endsWith('行く') || written === 'いく')) return 'iku';
  if (reading === 'ある') return 'aru';
  return 'regular';
}

function build(text, group, kana, kind, form) {
  const b = blocks(text, group, kana, kind);
  const nai = kind === 'aru' ? '' : b.nai;
  switch (form) {
    case 'masu': return `${b.stem}ます`;
    case 'masen': return `${b.stem}ません`;
    case 'mashita': return `${b.stem}ました`;
    case 'masendeshita': return `${b.stem}ませんでした`;
    case 'mashou': return `${b.stem}ましょう`;
    case 'masenka': return `${b.stem}ませんか`;
    case 'stem': return b.stem;
    case 'tai': return `${b.stem}たい`;
    case 'te': return b.te;
    case 'nai': return `${nai}ない`;
    case 'dict': return text;
    case 'ta': return toPast(b.te);
    case 'nakatta': return `${nai}なかった`;
    case 'tara': return `${toPast(b.te)}ら`;
    case 'temo': return `${b.te}も`;
    default: throw new Error(`Unknown verb form ${form}`);
  }
}

/** One form of a verb: { written, reading, furi }. */
export function verbForm([written, reading, group], form) {
  const kind = kindOf(written, reading, group);
  const formWritten = build(written, group, false, kind, form);
  const formReading = build(reading, group, true, kind, form);
  return { written: formWritten, reading: formReading, furi: wordFuri(formWritten, formReading), accept: [] };
}

/**
 * The rule a learner needs for the て/た-form, as a short label for the
 * weak-spot analysis: 'う・つ・る → って', 'く → いて', '行く (Ausnahme)' …
 */
export function teRule([written, reading, group]) {
  const kind = kindOf(written, reading, group);
  if (kind === 'kuru') return '来る';
  if (group === 3) return 'する';
  if (group === 2) return 'Gruppe II';
  if (kind === 'iku') return '行く (Ausnahme)';
  return {
    う: 'う・つ・る → って', つ: 'う・つ・る → って', る: 'う・つ・る → って', む: 'む・ぶ・ぬ → んで', ぶ: 'む・ぶ・ぬ → んで', ぬ: 'む・ぶ・ぬ → んで',
    く: 'く → いて', ぐ: 'ぐ → いで', す: 'す → して',
  }[reading.at(-1)];
}

/** Godan verbs that look like ichidan verbs (-iru/-eru): the classic traps. */
export const looksIchidan = ([, reading, group]) => group === 1 && /[いきぎしじちにひびみりえけげせぜてでねへべめれ]る$/.test(reading);

/* ---------- adjectives ---------- */

export const ADJ_FORMS = {
  p_pres: { label: 'höflich, Gegenwart', example: '大きいです / 静かです', lesson: 8 },
  p_neg: { label: 'höflich, verneint', example: '大きくないです / 静かじゃありません', lesson: 8 },
  attr: { label: 'vor einem Nomen', example: '大きい〜 / 静かな〜', lesson: 8 },
  p_past: { label: 'höflich, Vergangenheit', example: '大きかったです / 静かでした', lesson: 12 },
  p_pastneg: { label: 'höflich, Vergangenheit verneint', example: '大きくなかったです / 静かじゃありませんでした', lesson: 12 },
  te: { label: 'て-Form', example: '大きくて / 静かで', lesson: 16 },
  adv: { label: 'als Adverb', example: '大きく / 静かに', lesson: 19 },
  naru: { label: '〜なります', example: '大きくなります / 静かになります', lesson: 19 },
  pl_pres: { label: 'einfach, Gegenwart', example: '大きい / 静かだ', lesson: 20 },
  pl_neg: { label: 'einfach, verneint', example: '大きくない / 静かじゃない', lesson: 20 },
  pl_past: { label: 'einfach, Vergangenheit', example: '大きかった / 静かだった', lesson: 20 },
  pl_pastneg: { label: 'einfach, Vergangenheit verneint', example: '大きくなかった / 静かじゃなかった', lesson: 20 },
};

/** いい and words ending in it change their stem to よ-. */
const isIi = (reading) => reading === 'いい' || reading.endsWith('っこいい') || reading.endsWith('もちいい');

function adjText(text, type, irregular, form) {
  if (type === 'na') {
    return {
      p_pres: [`${text}です`],
      p_neg: [`${text}じゃありません`, `${text}ではありません`, `${text}じゃないです`, `${text}ではないです`],
      attr: [`${text}な`],
      p_past: [`${text}でした`],
      p_pastneg: [`${text}じゃありませんでした`, `${text}ではありませんでした`, `${text}じゃなかったです`, `${text}ではなかったです`],
      te: [`${text}で`],
      adv: [`${text}に`],
      naru: [`${text}になります`],
      pl_pres: [`${text}だ`],
      pl_neg: [`${text}じゃない`, `${text}ではない`],
      pl_past: [`${text}だった`],
      pl_pastneg: [`${text}じゃなかった`, `${text}ではなかった`],
    }[form];
  }
  const stem = irregular ? `${text.slice(0, -2)}よ` : text.slice(0, -1);
  return {
    p_pres: [`${text}です`],
    p_neg: [`${stem}くないです`, `${stem}くありません`],
    attr: [text],
    p_past: [`${stem}かったです`],
    p_pastneg: [`${stem}くなかったです`, `${stem}くありませんでした`],
    te: [`${stem}くて`],
    adv: [`${stem}く`],
    naru: [`${stem}くなります`],
    pl_pres: [text],
    pl_neg: [`${stem}くない`],
    pl_past: [`${stem}かった`],
    pl_pastneg: [`${stem}くなかった`],
  }[form];
}

/** One adjective form: { written, reading, furi, accept: [{ written, reading }] } with the book's form first. */
export function adjForm([word, reading, type], form) {
  if (!ADJ_FORMS[form]) throw new Error(`Unknown adjective form ${form}`);
  const irregular = type === 'i' && isIi(reading);
  // The written form of いい-words is written in kana in the book (よくない).
  const writtenBase = irregular ? reading : word;
  const written = adjText(writtenBase, type, irregular, form);
  const read = adjText(reading, type, irregular, form);
  return {
    written: written[0],
    reading: read[0],
    furi: wordFuri(written[0], read[0]),
    accept: written.slice(1).map((w, i) => ({ written: w, reading: read[i + 1] })),
  };
}

export const isIrregularAdjective = ([, reading, type]) => type === 'i' && isIi(reading);
