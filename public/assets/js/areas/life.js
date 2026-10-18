/* Everyday areas: positions and directions, family words, travel phrases. */
import phrasesData from '../data/phrases.js';
import { html, jp } from '../lib/ui.js';
import { choiceTask, furiKana, hash, pick, sample, shuffle } from './common.js';

/* ---------- positions and directions ---------- */

const POSITIONS = [
  { id: 'ue', furi: '{上|うえ}', de: 'auf, über', cell: [0, 1] },
  { id: 'shita', furi: '{下|した}', de: 'unter', cell: [2, 1] },
  { id: 'migi', furi: '{右|みぎ}', de: 'rechts', cell: [1, 2] },
  { id: 'hidari', furi: '{左|ひだり}', de: 'links', cell: [1, 0] },
  { id: 'naka', furi: '{中|なか}', de: 'in, drinnen', cell: [1, 1] },
  { id: 'mae', furi: '{前|まえ}', de: 'vor', text: true },
  { id: 'ushiro', furi: 'うしろ', de: 'hinter', text: true },
  { id: 'soto', furi: '{外|そと}', de: 'draußen, außerhalb', text: true },
  { id: 'tonari', furi: '{隣|となり}', de: 'neben (gleiche Art)', text: true },
  { id: 'chikaku', furi: '{近|ちか}く', de: 'in der Nähe', text: true },
  { id: 'aida', furi: '{間|あいだ}', de: 'zwischen', text: true },
];

// [emoji, Japanese, German dative, German genitive]
const SCENE_THINGS = [['📦', '{箱|はこ}', 'der Kiste', 'der Kiste'], ['🛏️', 'ベッド', 'dem Bett', 'des Betts'], ['🚗', '{車|くるま}', 'dem Auto', 'des Autos'],
  ['🗄️', '{棚|たな}', 'dem Regal', 'des Regals'], ['🪑', 'いす', 'dem Stuhl', 'des Stuhls'], ['🧺', 'かご', 'dem Korb', 'des Korbs']];
const ANIMALS = [['🐈', '{猫|ねこ}', 'Die Katze'], ['🐕', '{犬|いぬ}', 'Der Hund'], ['🐦', '{鳥|とり}', 'Der Vogel']];
// German for the positions that are asked as a sentence ({d} dative, {g} genitive)
const POSITION_DE = { mae: 'vor {d}', ushiro: 'hinter {d}', soto: 'außerhalb {g}', chikaku: 'in der Nähe {g}', tonari: 'neben {d}', aida: 'zwischen {d} und dem Baum' };

function sceneHtml(position, thing, animal) {
  const cells = Array.from({ length: 9 }, () => '');
  cells[4] = `<span class="scene-thing">${thing[0]}</span>`;
  const [row, col] = position.cell;
  if (position.id === 'naka') cells[4] = `<span class="scene-thing inside">${thing[0]}<span class="scene-animal small">${animal[0]}</span></span>`;
  else cells[row * 3 + col] = `<span class="scene-animal">${animal[0]}</span>`;
  return `<div class="scene" role="img" aria-label="Bild">${cells.map((c) => `<span class="scene-cell">${c}</span>`).join('')}</div>`;
}

const COMPASS = [
  { id: 'kita', furi: '{北|きた}', de: 'Norden', angle: 0 },
  { id: 'higashi', furi: '{東|ひがし}', de: 'Osten', angle: 90 },
  { id: 'minami', furi: '{南|みなみ}', de: 'Süden', angle: 180 },
  { id: 'nishi', furi: '{西|にし}', de: 'Westen', angle: 270 },
];

const compassSvg = (angle) => `<svg class="compass" viewBox="0 0 100 100" role="img" aria-label="Kompass">
  <circle cx="50" cy="50" r="44" class="compass-face"/>
  <path d="M50 12 L56 50 L50 88 L44 50 Z" class="compass-rose"/>
  <path d="M12 50 L50 44 L88 50 L50 56 Z" class="compass-rose"/>
  <text x="50" y="9" class="compass-n">N</text>
  <g transform="rotate(${angle} 50 50)"><path d="M50 18 L58 36 H42 Z" class="compass-mark"/></g></svg>`;

const KOSOADO = [
  { id: 'kore', furi: 'これ', de: 'dies hier (beim Sprecher)', where: 'speaker', kind: 'thing' },
  { id: 'sore', furi: 'それ', de: 'das da (beim Zuhörer)', where: 'listener', kind: 'thing' },
  { id: 'are', furi: 'あれ', de: 'das dort (weit weg von beiden)', where: 'far', kind: 'thing' },
  { id: 'koko', furi: 'ここ', de: 'hier', where: 'speaker', kind: 'place' },
  { id: 'soko', furi: 'そこ', de: 'da (beim Zuhörer)', where: 'listener', kind: 'place' },
  { id: 'asoko', furi: 'あそこ', de: 'dort drüben', where: 'far', kind: 'place' },
  { id: 'kono', furi: 'この{本|ほん}', de: 'dieses Buch hier', where: 'speaker', kind: 'noun' },
  { id: 'sono', furi: 'その{本|ほん}', de: 'das Buch da (beim Zuhörer)', where: 'listener', kind: 'noun' },
  { id: 'ano', furi: 'あの{本|ほん}', de: 'das Buch dort', where: 'far', kind: 'noun' },
];

const kosoadoScene = (where, kind) => {
  const item = kind === 'place' ? '📍' : kind === 'noun' ? '📕' : '🎁';
  const slot = (w) => (w === where ? `<span class="ks-item">${item}</span>` : '<span class="ks-item"></span>');
  return `<div class="kosoado"><div class="ks-person">${slot('speaker')}<span class="ks-emoji">🙋</span><span class="small">ich</span></div>
    <div class="ks-person">${slot('listener')}<span class="ks-emoji">🧑</span><span class="small">du</span></div>
    <div class="ks-far">${slot('far')}<span class="small">weit weg</span></div></div>`;
};

const WAYS = [
  { id: 'massugu', furi: 'まっすぐ{行|い}ってください。', de: 'Gehen Sie geradeaus.', arrow: '⬆️' },
  { id: 'migi', furi: '{右|みぎ}へ{曲|ま}がってください。', de: 'Biegen Sie rechts ab.', arrow: '↱' },
  { id: 'hidari', furi: '{左|ひだり}へ{曲|ま}がってください。', de: 'Biegen Sie links ab.', arrow: '↰' },
  { id: 'shingou', furi: '{信号|しんごう}を{右|みぎ}へ{曲|ま}がってください。', de: 'Biegen Sie an der Ampel rechts ab.', arrow: '🚦↱' },
  { id: 'hashi', furi: '{橋|はし}を{渡|わた}ってください。', de: 'Gehen Sie über die Brücke.', arrow: '🌉' },
  { id: 'kado', furi: '2つ{目|め}の{角|かど}を{左|ひだり}へ{曲|ま}がってください。', de: 'Biegen Sie an der zweiten Ecke links ab.', arrow: '2️⃣↰' },
  { id: 'tomete', furi: 'ここで{止|と}めてください。', de: 'Halten Sie bitte hier (Taxi).', arrow: '🚕✋' },
];

export const positions = {
  id: 'positions',
  title: 'Orte & Richtungen',
  group: 'alltag',
  icon: 'compass',
  blurb: 'うえ・した・なか, Himmelsrichtungen, こ・そ・あ・ど, Wegbeschreibung',
  options: [{ key: 'part', label: 'Teil', choices: { all: 'Alles', pos: 'Positionen', compass: 'Himmelsrichtungen', kosoado: 'こ・そ・あ・ど', way: 'Weg beschreiben' }, default: 'all' }],
  items(ctx) {
    const part = ctx.opts.part ?? 'all';
    const items = [];
    if (part === 'all' || part === 'pos') items.push(...POSITIONS.map((p) => ({ id: `loc:${p.id}`, lesson: 10, tags: ['loc:pos'], pos: p })));
    if (part === 'all' || part === 'compass') items.push(...COMPASS.map((c) => ({ id: `loc:c:${c.id}`, lesson: 10, tags: ['loc:compass'], compass: c })));
    if (part === 'all' || part === 'kosoado') items.push(...KOSOADO.map((k) => ({ id: `loc:k:${k.id}`, lesson: k.kind === 'place' ? 3 : 2, tags: ['loc:kosoado'], kosoado: k })));
    if (part === 'all' || part === 'way') items.push(...WAYS.map((w) => ({ id: `loc:w:${w.id}`, lesson: 14, tags: ['loc:way'], way: w })));
    return items;
  },
  task(item, ctx) {
    const r = ctx.rng;
    if (item.pos) {
      const p = item.pos;
      const thing = pick(SCENE_THINGS, r);
      const animal = pick(ANIMALS, r);
      const wrong = sample(POSITIONS.filter((o) => o !== p && o.id !== 'aida' && (p.text ? true : !o.text)), 3, r);
      // となり is for things of the same kind, so the neighbour is another animal there.
      const place = (pos) => (pos.id === 'tonari' ? '{犬|いぬ}' : pos.id === 'aida' ? `${thing[1]}と{木|き}` : thing[1]);
      const sentence = (pos) => `${animal === ANIMALS[1] && pos.id === 'tonari' ? '{猫|ねこ}' : animal[1]}は${place(pos)}の${pos.furi}にいます。`;
      if (p.text) {
        const target = p.id === 'tonari' ? 'dem Hund' : thing[2];
        const german = `${p.id === 'tonari' && animal === ANIMALS[1] ? 'Die Katze' : animal[2]} ist ${POSITION_DE[p.id].replace('{d}', target).replace('{g}', thing[3])}.`;
        return choiceTask({ label: 'Wie sagt man das?', prompt: html`<div class="big-de">${german}</div>`.text, columns: 1, speakAnswer: furiKana(sentence(p)) },
          jp(sentence(p)).text, wrong.map((o) => jp(sentence(o)).text), r);
      }
      return choiceTask({ label: 'Wo ist das Tier?', prompt: '', visual: sceneHtml(p, thing, animal), columns: 1, speakAnswer: furiKana(sentence(p)) },
        jp(sentence(p)).text, wrong.map((o) => jp(sentence(o)).text), r);
    }
    if (item.compass) {
      const c = item.compass;
      const wrong = COMPASS.filter((o) => o !== c);
      return r() < 0.5
        ? choiceTask({ label: 'Welche Himmelsrichtung ist markiert?', prompt: '', visual: compassSvg(c.angle), columns: 2, explain: html`${jp(c.furi)} – ${c.de}. Am Bahnhof: ${jp(`${c.furi}{口|ぐち}`)} = ${c.de.replace(/en$/, '')}ausgang.`.text },
          jp(c.furi).text, wrong.map((o) => jp(o.furi).text), r)
        : choiceTask({ label: 'Was steht auf dem Schild am Bahnhof?', prompt: html`<div class="sign sign-yellow" lang="ja">${c.furi.replace(/\{(.+?)\|.+?\}/, '$1')}口</div>`.text, columns: 2, explain: html`${jp(`${c.furi}{口|ぐち}`)}`.text },
          html`${c.de}ausgang`.text.replace('enausgang', 'ausgang'), wrong.map((o) => html`${o.de}ausgang`.text.replace('enausgang', 'ausgang')), r);
    }
    if (item.kosoado) {
      const k = item.kosoado;
      const sameKind = KOSOADO.filter((o) => o.kind === k.kind && o !== k);
      const otherKind = KOSOADO.filter((o) => o.kind !== k.kind && o.where === k.where);
      const wrong = [...sameKind, pick(otherKind, r)];
      const what = { thing: 'Wie sagst du „das“?', place: 'Wie sagst du, wo das ist?', noun: 'Wie sagst du „das Buch“?' }[k.kind];
      return choiceTask({ label: what, prompt: '', visual: kosoadoScene(k.where, k.kind), columns: 2, explain: html`${jp(k.furi)}: ${k.de}`.text },
        jp(k.furi).text, wrong.map((o) => jp(o.furi).text), r);
    }
    const w = item.way;
    const wrong = sample(WAYS.filter((o) => o !== w), 3, r);
    return choiceTask({ label: 'Wie beschreibst du den Weg?', prompt: html`<div class="way-arrow">${w.arrow}</div><div class="big-de">${w.de}</div>`.text, columns: 1, speakAnswer: furiKana(w.furi) },
      jp(w.furi).text, wrong.map((o) => jp(o.furi).text), r);
  },
};

/* ---------- family ---------- */

export const FAMILY = [
  ['Vater', '{父|ちち}', 'お{父|とう}さん'], ['Mutter', '{母|はは}', 'お{母|かあ}さん'],
  ['älterer Bruder', '{兄|あに}', 'お{兄|にい}さん'], ['ältere Schwester', '{姉|あね}', 'お{姉|ねえ}さん'],
  ['jüngerer Bruder', '{弟|おとうと}', '{弟|おとうと}さん'], ['jüngere Schwester', '{妹|いもうと}', '{妹|いもうと}さん'],
  ['Ehemann', '{夫|おっと}', 'ご{主人|しゅじん}'], ['Ehefrau', '{妻|つま}', '{奥|おく}さん'],
  ['Kind', '{子|こ}ども', 'お{子|こ}さん'], ['Eltern', '{両親|りょうしん}', 'ご{両親|りょうしん}'],
  ['Geschwister', '{兄弟|きょうだい}', 'ご{兄弟|きょうだい}'], ['Familie', '{家族|かぞく}', 'ご{家族|かぞく}'],
  ['Großvater', '{祖父|そふ}', 'おじいさん'], ['Großmutter', '{祖母|そぼ}', 'おばあさん'],
  ['Sohn', '{息子|むすこ}', '{息子|むすこ}さん'], ['Tochter', '{娘|むすめ}', '{娘|むすめ}さん'],
  ['Onkel', 'おじ', 'おじさん'], ['Tante', 'おば', 'おばさん'],
];

export const family = {
  id: 'family',
  title: 'Familie',
  group: 'alltag',
  icon: 'family',
  blurb: 'Die eigene Familie (ちち) und die der anderen (おとうさん)',
  options: [],
  ref: 'family',
  items() {
    return FAMILY.flatMap((f) => ['own', 'other'].map((who) => ({ id: `fam:${furiKana(f[1])}:${who}`, lesson: 11, tags: [`fam:${who}`], f, who })));
  },
  task(item, ctx) {
    const r = ctx.rng;
    const [de, own, other] = item.f;
    const right = item.who === 'own' ? own : other;
    const opposite = item.who === 'own' ? other : own;
    const others = sample(FAMILY.filter((x) => x !== item.f), 2, r).map((x) => (item.who === 'own' ? x[1] : x[2]));
    const situation = item.who === 'own'
      ? `Du erzählst von deiner eigenen Familie: „mein/e ${de}“`
      : `Du sprichst mit jemandem über seine/ihre Familie: „Ihr/e ${de}“`;
    return choiceTask({
      label: situation,
      prompt: html`<div class="big-de">${de}</div>`.text,
      columns: 2,
      explain: html`Eigene Familie: ${jp(own)} · Familie anderer: ${jp(other)}`.text,
      speakAnswer: furiKana(right),
    }, jp(right).text, [opposite, ...others].map((x) => jp(x).text), r);
  },
};

/* ---------- travel phrases ---------- */

export const PHRASE_CATEGORIES = {
  basics: 'Grundlagen & Höflichkeit', restaurant: 'Restaurant', shopping: 'Einkaufen', train: 'Bahn & Verkehr',
  hotel: 'Hotel & Ryokan', directions: 'Wege & Orte', health: 'Gesundheit & Notfall', smalltalk: 'Smalltalk', culture: 'Onsen, Tempel & Etikette',
};

export const phrases = {
  id: 'phrases',
  title: 'Reise-Sätze',
  group: 'alltag',
  icon: 'train',
  blurb: 'Was sagt man im Restaurant, im Zug, im Hotel, im Notfall?',
  options: [{ key: 'cat', label: 'Situation', choices: { '': 'Alle', ...PHRASE_CATEGORIES }, default: '' }],
  ref: 'phrases',
  items(ctx) {
    return phrasesData.filter((p) => !ctx.opts.cat || p.cat === ctx.opts.cat)
      .map((p) => ({ id: `ph:${hash(p.jp)}`, tags: [`phr:${p.cat}`], p }));
  },
  task(item, ctx) {
    const { p } = item;
    return choiceTask({
      label: p.sit,
      prompt: '',
      columns: 1,
      explain: html`<p>${jp(p.jp)}</p><p class="muted">${p.de}</p>${p.why ? html`<p>${p.why}</p>` : ''}`.text,
      speakAnswer: furiKana(p.jp),
    }, jp(p.jp).text, shuffle(p.x, ctx.rng).slice(0, 3).map((x) => jp(x).text), ctx.rng);
  },
};
