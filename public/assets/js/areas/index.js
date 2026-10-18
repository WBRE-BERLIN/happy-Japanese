/* All exercise areas, their groups and readable names for the analysis tags. */
import { vocab, travel, DECKS, POS_LABEL } from './vocab.js';
import { kana, kanji, signsArea } from './script.js';
import {
  particles, verbFormsArea, verbGroups, verbCloze, adjFormsArea, adjType, adjCloze, plainPolite, grammarQuiz, sentenceBuilding, questionWords, TOPICS,
} from './grammar.js';
import { numbers, prices, clock, dates, timeWords, counters } from './numbers.js';
import { positions, family, phrases, PHRASE_CATEGORIES } from './life.js';
import { ADJ_FORMS, FORMS } from '../lib/conjugate.js';
import { counterById } from '../lib/numbers.js';

export const GROUPS = [
  { id: 'wort', title: 'Wortschatz & Schrift' },
  { id: 'gram', title: 'Grammatik' },
  { id: 'zahl', title: 'Zahlen & Zeit' },
  { id: 'alltag', title: 'Alltag & Reise' },
];

export const AREAS = [
  vocab, kana, kanji,
  particles, verbFormsArea, verbGroups, verbCloze, adjFormsArea, adjType, adjCloze, grammarQuiz, sentenceBuilding, questionWords, plainPolite,
  numbers, prices, clock, dates, timeWords, counters,
  phrases, travel, signsArea, positions, family,
];

export const areaById = Object.fromEntries(AREAS.map((a) => [a.id, a]));

/** Areas in the daily mix when the learner has not chosen. */
export const DEFAULT_MIX = ['vocab', 'particles', 'verbs', 'adjectives', 'grammar', 'numbers', 'counters', 'clock', 'dates', 'phrases'];

const PREFIX_AREA = {
  v: 'vocab', t: 'travel', k: 'kana', kj: 'kanji', sg: 'signs', pt: 'particles', vf: 'verbs', vg: 'verbgroups', vc: 'verbcloze',
  af: 'adjectives', at: 'adjtype', ac: 'adjcloze', pp: 'plainpolite', gr: 'grammar', sb: 'sentences', qw: 'questionwords',
  num: 'numbers', pr: 'prices', clk: 'clock', dt: 'dates', tw: 'timewords', ct: 'counters', loc: 'positions', fam: 'family', ph: 'phrases',
};

export const areaOfItem = (itemId) => areaById[PREFIX_AREA[itemId.split(':')[0]]];

/** Default option values of an area, overridden by the learner's choices. */
export function areaOptions(area, saved = {}) {
  const opts = {};
  for (const option of area.options ?? []) opts[option.key] = saved[option.key] ?? option.default;
  return opts;
}

const GROUP_LABEL = { 1: 'Verbgruppe I (Godan)', 2: 'Verbgruppe II (Ichidan)', 3: 'Verbgruppe III (する/来る)' };
const TE_LABEL = {
  tte: 'て-Form: う・つ・る → って', nde: 'て-Form: む・ぶ・ぬ → んで', ite: 'て-Form: く → いて', ide: 'て-Form: ぐ → いで', shite: 'て-Form: す → して',
  iku: 'て-Form: 行く → 行って', g2: 'て-Form der Gruppe II', suru: 'て-Form von する', kuru: 'て-Form von 来る',
};
const SOUND_LABEL = {
  '300': 'Zahlen: 300 = さんびゃく', '600': 'Zahlen: 600 = ろっぴゃく', '800': 'Zahlen: 800 = はっぴゃく', '3000': 'Zahlen: 3000 = さんぜん',
  '8000': 'Zahlen: 8000 = はっせん', ichiman: 'Zahlen: 10.000 = いちまん', issenman: 'Zahlen: 10 Mio. = いっせんまん', yoen: 'Preise auf 4: よえん',
};
const SIMPLE = {
  'trap:ru': 'Gruppe-I-Verben, die wie Gruppe II aussehen (帰る, 入る …)', 'trap:aru': 'ある → ない',
  'adj:i': 'い-Adjektive', 'adj:na': 'な-Adjektive', 'adj:ii': 'いい → よくない, よかった', 'adj:na-i': 'な-Adjektive auf い (きれい, 有名 …)',
  'kana:hira': 'Hiragana', 'kana:kata': 'Katakana', 'kana:basic': 'Kana-Grundzeichen', 'kana:voiced': 'Kana mit ゛/゜', 'kana:combined': 'Kana-Kombinationen (きゃ …)', 'kana:extended': 'Katakana für Fremdwörter (ティ, ファ …)',
  'kanji:N5': 'Grundkanji (N5)', 'kanji:N4': 'Kanji N4', 'kanji:reise': 'Reise-Kanji', 'kmode:meaning': 'Kanji: Bedeutung', 'kmode:reading': 'Kanji: Lesung', 'kmode:write': 'Kanji erkennen',
  'sign:meaning': 'Schilder: Bedeutung', 'sign:reading': 'Schilder: Lesung',
  'loc:pos': 'Positionen (上, 下, 中 …)', 'loc:compass': 'Himmelsrichtungen', 'loc:kosoado': 'こ・そ・あ・ど', 'loc:way': 'Weg beschreiben',
  'fam:own': 'Familie: die eigene (ちち, はは …)', 'fam:other': 'Familie: die der anderen (おとうさん …)',
  'date:dirr': 'Tage mit Sonderlesung (ついたち, はつか …)', 'date:dreg': 'Tage des Monats (regelmäßig)', 'date:m4': 'April: しがつ', 'date:m7': 'Juli: しちがつ', 'date:m9': 'September: くがつ', 'date:mx': 'Monate', 'date:wd': 'Wochentage', 'date:year': 'Jahreszahlen',
  'time:mhan': 'halb (はん)', 'time:mx0': 'volle 10 Minuten (じゅっぷん …)', 'ctr:sound': 'Zählwörter mit Lautwandel (1, 3, 6, 8, 10)',
  'num:build': 'Zahlen sagen', 'num:read': 'Zahlen aus der Lesung', 'num:kanji': 'Kanji-Zahlen', 'num:hear': 'Zahlen hören', 'num:price': 'Preise',
  'num:small': 'Zahlen bis 100', 'num:mid': 'Zahlen bis 9.999', 'num:big': 'Große Zahlen (万, 億)',
  'dir:jd': 'Japanisch → Deutsch', 'dir:dj': 'Deutsch → Japanisch', 'pp:toPlain': 'Höflich → einfach', 'pp:toPolite': 'Einfach → höflich', sb: 'Satzbau',
};

/** Readable name of an analysis tag. */
export function tagLabel(tag) {
  if (SIMPLE[tag]) return SIMPLE[tag];
  const [kind, value] = [tag.slice(0, tag.indexOf(':')), tag.slice(tag.indexOf(':') + 1)];
  if (/^L\d+$/.test(tag)) return `Lektion ${tag.slice(1)}`;
  switch (kind) {
    case 'part': return `Partikel ${value}`;
    case 'form': return FORMS[value] ? `Verben: ${FORMS[value].label}` : tag;
    case 'aform': return ADJ_FORMS[value] ? `Adjektive: ${ADJ_FORMS[value].label}` : tag;
    case 'grp': return GROUP_LABEL[value] ?? tag;
    case 'te': return TE_LABEL[value] ?? tag;
    case 'snd': return SOUND_LABEL[value] ?? tag;
    case 'gr': return `Grammatik: ${TOPICS[value] ?? value}`;
    case 'pos': return `Wortart: ${POS_LABEL[value] ?? value}`;
    case 'deck': return `Reise-Wortschatz: ${DECKS.find((d) => d.id === value)?.title ?? value}`;
    case 'phr': return `Reise-Sätze: ${PHRASE_CATEGORIES[value] ?? value}`;
    case 'ctr': return counterById[value] ? `Zählwort ${counterById[value].kanji} (${counterById[value].kana})` : tag;
    case 'time': return value.startsWith('h') ? `Uhrzeit: ${value.slice(1)} Uhr` : `Minuten auf ${value.slice(1)} (ふん/ぷん)`;
    case 'tw': return `Zeitangaben: ${{ day: 'Tage', morning: 'Morgen', evening: 'Abend', week: 'Wochen', month: 'Monate', year: 'Jahre', every: 'jeden …' }[value] ?? value}`;
    default: return tag;
  }
}

/** Which areas practise a tag (for "Schwäche üben"). */
export function areasForTag(tag) {
  const prefix = tag.split(':')[0];
  const map = {
    part: ['particles'], form: ['verbs', 'verbcloze'], te: ['verbs', 'verbcloze'], grp: ['verbgroups', 'verbs'], trap: ['verbgroups', 'verbs'],
    aform: ['adjectives', 'adjcloze'], adj: ['adjectives', 'adjtype', 'adjcloze'], kana: ['kana'], kanji: ['kanji'], kmode: ['kanji'], sign: ['signs'],
    loc: ['positions'], fam: ['family'], date: ['dates'], time: ['clock'], ctr: ['counters'], snd: ['numbers', 'prices'], num: ['numbers', 'prices'],
    gr: ['grammar', 'questionwords'], pos: ['vocab'], deck: ['travel'], phr: ['phrases'], tw: ['timewords'], dir: ['vocab'], pp: ['plainpolite'], sb: ['sentences'],
  }[prefix];
  if (map) return map;
  if (/^L\d+$/.test(tag)) return ['vocab', 'particles', 'grammar', 'verbcloze', 'sentences'];
  return AREAS.map((a) => a.id);
}
