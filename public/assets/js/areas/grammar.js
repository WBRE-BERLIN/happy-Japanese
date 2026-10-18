/* Grammar areas: particles, verb and adjective forms, the grammar quiz, sentence building. */
import particlesData from '../data/particles.js';
import verbs from '../data/verbs.js';
import adjectives from '../data/adjectives.js';
import verbcloze from '../data/verbcloze.js';
import adjcloze from '../data/adjcloze.js';
import grammarData from '../data/grammar.js';
import sentencesData from '../data/sentences.js';
import { furiHtml } from '../lib/furi.js';
import { ADJ_FORMS, FORMS, PLAIN_OF, adjForm, looksIchidan, teRule, verbForm } from '../lib/conjugate.js';
import { html, jp, prefs, raw } from '../lib/ui.js';
import { acceptJapanese, choiceTask, furiKana, furiWord, hash, pick, shuffle } from './common.js';

const BLANK = '＿';
const max = (ctx) => ctx.settings.lesson ?? 25;

/* ---------- particles ---------- */

const CORE_PARTICLES = ['は', 'が', 'を', 'に', 'で', 'へ', 'と', 'も', 'の', 'か', 'から', 'まで', 'より', 'や'];

/** The sentence with the answers filled in and marked. */
function filled(sentence, answers) {
  const parts = sentence.split(BLANK);
  return parts.map((part, i) => furiHtml(part, { ruby: prefs.furigana }) + (i < answers.length ? `<mark>${answers[i]}</mark>` : '')).join('');
}

export const particles = {
  id: 'particles',
  title: 'Partikel',
  group: 'gram',
  icon: 'blocks',
  blurb: 'は, が, を, に, で … – die richtige Partikel in die Lücke',
  options: [{ key: 'focus', label: 'Partikel', choices: { '': 'Alle', ...Object.fromEntries(['は/が', 'に/で', 'を', 'へ', 'と', 'も', 'の', 'から/まで', 'より']
    .map((p) => [p, p])) }, default: '' }],
  ref: 'particles',
  items(ctx) {
    const focus = ctx.opts.focus ? ctx.opts.focus.split('/') : null;
    return particlesData
      .filter((p) => p.l <= max(ctx))
      .filter((p) => !focus || p.a.some((a) => a.split('/').some((x) => focus.includes(x))))
      .map((p) => ({ id: `pt:${hash(p.s)}`, lesson: p.l, tags: [`L${p.l}`, ...new Set(p.a.map((a) => `part:${a.split('/')[0]}`))], p }));
  },
  task(item, ctx) {
    const { p } = item;
    const answers = p.a.map((a) => a.split('/'));
    const extra = shuffle(['ね', 'よ', 'までに', 'だけ', 'ぐらい', 'ごろ'], ctx.rng).slice(0, 2);
    const palette = [...new Set([...CORE_PARTICLES, ...answers.flat(), ...extra])];
    return {
      kind: 'palette',
      label: answers.length > 1 ? 'Setze die Partikel ein' : 'Welche Partikel fehlt?',
      prompt: '',
      sub: html`${p.de}`.text,
      parts: p.s.split(BLANK).map((part) => furiHtml(part, { ruby: prefs.furigana })),
      answers,
      palette,
      answerHtml: html`<span class="jp" lang="ja">${raw(filled(p.s, answers.map((a) => a.join('/'))))}</span>`.text,
      explain: html`${p.why}`.text,
      speakAnswer: furiKana(p.s.split(BLANK).map((part, i) => part + (answers[i]?.[0] ?? '')).join('')),
    };
  },
};

/* ---------- verbs ---------- */

export const VERBS = verbs.map((v) => ({ v, dict: v[0], reading: v[1], group: v[2], de: v[3], lesson: v[4], pattern: v[5] ?? '' }));
const verbByDict = Object.fromEntries(VERBS.map((v) => [v.dict, v]));

const GROUP_NAME = { 1: 'Gruppe I', 2: 'Gruppe II', 3: 'Gruppe III' };
const TE_TAG = {
  'う・つ・る → って': 'te:tte', 'む・ぶ・ぬ → んで': 'te:nde', 'く → いて': 'te:ite', 'ぐ → いで': 'te:ide', 'す → して': 'te:shite',
  '行く (Ausnahme)': 'te:iku', 'Gruppe II': 'te:g2', 'する': 'te:suru', '来る': 'te:kuru',
};
const TE_FORMS = new Set(['te', 'ta', 'tara', 'temo']);
const NAI_FORMS = new Set(['nai', 'nakatta']);

export function verbTags(v, form) {
  const tags = [`grp:${v.group}`];
  if (form) tags.push(`form:${form}`);
  if (TE_FORMS.has(form)) tags.push(TE_TAG[teRule(v.v)]);
  if (looksIchidan(v.v) && form !== 'masu') tags.push('trap:ru');
  if (v.reading === 'ある' && NAI_FORMS.has(form)) tags.push('trap:aru');
  return tags;
}

/** One-line rule for a verb form. */
function verbRule(v, form) {
  const g = GROUP_NAME[v.group];
  if (TE_FORMS.has(form)) return `${g}: ${teRule(v.v)}${form === 'tara' ? ' + ら' : form === 'temo' ? ' + も' : form === 'ta' ? ' (て → た)' : ''}`;
  if (NAI_FORMS.has(form)) {
    if (v.reading === 'ある') return 'Ausnahme: ある → ない';
    if (v.group === 1) return `${g}: -u → -a + ない${v.reading.endsWith('う') ? ' (う → わ)' : ''}`;
    if (v.group === 2) return `${g}: る weg + ない`;
    return v.reading.endsWith('くる') ? '来る → 来ない (こない)' : 'する → しない';
  }
  if (form === 'dict') return v.group === 1 ? `${g}: ます-Stamm -i → -u` : v.group === 2 ? `${g}: ます → る` : 'します → する, 来ます → 来る (くる)';
  return v.group === 1 ? `${g}: -u → -i + ${FORMS[form].label.replace('-Form', '')}` : v.group === 2 ? `${g}: る weg` : 'する → し, 来る → 来 (き)';
}

const FORM_SETS = {
  auto: 'Alle bisher gelernten Formen',
  masu: 'ます-Formen (ません, ました …)',
  te: 'て-Form',
  nai: 'ない-Form',
  dict: 'Wörterbuchform',
  ta: 'た-Form',
  plain: 'Einfache Formen (ない, た, なかった)',
  cond: 'たら und ても',
};
const FORM_SET_KEYS = {
  masu: ['masen', 'mashita', 'masendeshita', 'mashou', 'masenka', 'tai'], te: ['te'], nai: ['nai'], dict: ['dict'], ta: ['ta'],
  plain: ['nai', 'ta', 'nakatta'], cond: ['tara', 'temo'],
};

export const verbFormsArea = {
  id: 'verbs',
  title: 'Verbformen',
  group: 'gram',
  icon: 'verb',
  blurb: 'て-Form, ない-Form, た-Form … selbst bilden',
  options: [
    { key: 'forms', label: 'Formen', choices: FORM_SETS, default: 'auto' },
    { key: 'from', label: 'Ausgangsform', choices: { masu: 'ます-Form (wie im Buch)', dict: 'Wörterbuchform' }, default: 'masu' },
  ],
  ref: 'verbs',
  items(ctx) {
    const set = ctx.opts.forms ?? 'auto';
    const from = ctx.opts.from ?? 'masu';
    const keys = (set === 'auto' ? Object.keys(FORMS).filter((f) => !['masu', 'stem'].includes(f)) : FORM_SET_KEYS[set])
      .filter((f) => FORMS[f].lesson <= max(ctx) || set !== 'auto')
      .filter((f) => f !== from);
    return VERBS.filter((v) => v.lesson <= max(ctx)).flatMap((v) => keys.map((form) => ({
      id: `vf:${v.dict}:${form}`, lesson: Math.max(v.lesson, FORMS[form].lesson), tags: [`L${v.lesson}`, ...verbTags(v, form)], verb: v, form,
    })));
  },
  task(item, ctx) {
    const v = item.verb;
    const from = ctx.opts.from ?? 'masu';
    const source = verbForm(v.v, from);
    const target = verbForm(v.v, item.form);
    return {
      kind: 'input',
      label: `${FORMS[from].label} → ${FORMS[item.form].label}`,
      prompt: html`<div class="big-jp">${jp(source.furi)}</div>`.text,
      sub: html`${v.de}${v.pattern ? html` <span class="muted">(${v.pattern})</span>` : ''}`.text,
      accept: acceptJapanese(target),
      answerHtml: jp(target.furi).text,
      explain: html`${verbRule(v, item.form)}`.text,
      hint: html`${GROUP_NAME[v.group]}`.text,
      speakAnswer: target.reading,
    };
  },
};

export const verbGroups = {
  id: 'verbgroups',
  title: 'Verbgruppen',
  group: 'gram',
  icon: 'grid',
  blurb: 'Gruppe I, II oder III? Mit den typischen Fallen',
  options: [{ key: 'from', label: 'Gezeigte Form', choices: { mix: 'Gemischt', masu: 'ます-Form', dict: 'Wörterbuchform' }, default: 'mix' }],
  ref: 'verbs',
  items(ctx) {
    return VERBS.filter((v) => v.lesson <= max(ctx)).map((v) => ({ id: `vg:${v.dict}`, lesson: v.lesson, tags: [`L${v.lesson}`, ...verbTags(v)], verb: v }));
  },
  task(item, ctx) {
    const v = item.verb;
    const from = ctx.opts.from === 'mix' || !ctx.opts.from ? pick(['masu', 'dict'], ctx.rng) : ctx.opts.from;
    const shown = verbForm(v.v, from);
    const why = {
      1: looksIchidan(v.v) ? 'Achtung, Falle: endet auf -iru/-eru, ist aber Gruppe I. ます-Form: ' : 'ます-Stamm auf -i, Wörterbuchform auf -u. ます-Form: ',
      2: 'ます-Stamm auf -e – oder eine der Ausnahmen auf -i (見ます, 起きます, 借ります …). Wörterbuchform: ',
      3: 'Unregelmäßig: する, 来る und Nomen + する. Wörterbuchform: ',
    }[v.group];
    const other = verbForm(v.v, v.group === 1 ? 'masu' : 'dict');
    return {
      kind: 'choice',
      label: 'Zu welcher Gruppe gehört das Verb?',
      prompt: html`<div class="big-jp">${jp(shown.furi)}</div>`.text,
      sub: html`${v.de}`.text,
      columns: 1,
      options: [1, 2, 3].map((g) => ({ html: html`${GROUP_NAME[g]} <span class="muted">${['', '(Godan, 五段)', '(Ichidan, 一段)', '(unregelmäßig)'][g]}</span>`.text, correct: g === v.group })),
      explain: html`${why}${jp(other.furi)}`.text,
    };
  },
};

export const verbCloze = {
  id: 'verbcloze',
  title: 'Verben im Satz',
  group: 'gram',
  icon: 'pen',
  blurb: 'Das Verb fehlt – setz es in der richtigen Form ein',
  options: [{ key: 'form', label: 'Form', choices: { '': 'Alle', ...Object.fromEntries(Object.entries(FORMS).map(([k, f]) => [k, f.label])) }, default: '' }],
  items(ctx) {
    return verbcloze.filter((c) => c.l <= max(ctx) && (!ctx.opts.form || c.f === ctx.opts.form) && verbByDict[c.v])
      .map((c) => ({ id: `vc:${hash(c.s + c.v)}`, lesson: c.l, tags: [`L${c.l}`, ...verbTags(verbByDict[c.v], c.f)], c }));
  },
  task(item) {
    const { c } = item;
    const v = verbByDict[c.v];
    const form = verbForm(v.v, c.f);
    const [before, after] = c.s.split(BLANK);
    const hintWord = furiWord(v.dict, v.reading);
    return {
      kind: 'input',
      label: `Setz das Verb ein (${FORMS[c.f].label})`,
      prompt: html`<div class="sentence">${jp(before)}<span class="gap">（${jp(hintWord)}）</span>${jp(after)}</div>`.text,
      sub: html`${c.de}`.text,
      accept: acceptJapanese(form),
      answerHtml: html`<span class="sentence">${jp(before)}<mark>${jp(form.furi)}</mark>${jp(after)}</span>`.text,
      explain: html`${verbRule(v, c.f)}`.text,
      speakAnswer: furiKana(before) + form.reading + furiKana(after),
    };
  },
};

/* ---------- adjectives ---------- */

export const ADJS = adjectives.map((a) => ({ a, word: a[0], reading: a[1], type: a[2], de: a[3], lesson: a[4] }));
const adjByWord = Object.fromEntries(ADJS.map((a) => [a.word, a]));
const adjLesson = (a) => a.lesson || 8;

export function adjTags(a, form) {
  const tags = [`adj:${a.type}`];
  if (form) tags.push(`aform:${form}`);
  if (a.type === 'i' && /^(いい|かっこいい)$/.test(a.reading)) tags.push('adj:ii');
  if (a.type === 'na' && a.reading.endsWith('い')) tags.push('adj:na-i');
  return tags;
}

function adjRule(a, form) {
  if (a.type === 'na') {
    return {
      p_pres: 'な-Adjektiv + です', p_neg: 'な-Adjektiv + じゃありません', attr: 'な-Adjektiv + な + Nomen', p_past: 'な-Adjektiv + でした',
      p_pastneg: 'な-Adjektiv + じゃありませんでした', te: 'な-Adjektiv + で', adv: 'な-Adjektiv + に', naru: 'な-Adjektiv + になります',
      pl_pres: 'な-Adjektiv + だ', pl_neg: 'な-Adjektiv + じゃない', pl_past: 'な-Adjektiv + だった', pl_pastneg: 'な-Adjektiv + じゃなかった',
    }[form] + (a.reading.endsWith('い') ? ` – Achtung: ${a.word} endet auf い, ist aber ein な-Adjektiv.` : '');
  }
  const ii = /^(いい|かっこいい)$/.test(a.reading) ? ' – いい wird zu よ…: よくない, よかった.' : '';
  return {
    p_pres: 'い-Adjektiv + です', p_neg: 'い → くないです', attr: 'い-Adjektiv direkt vor dem Nomen', p_past: 'い → かったです',
    p_pastneg: 'い → くなかったです', te: 'い → くて', adv: 'い → く', naru: 'い → くなります',
    pl_pres: 'Grundform (ohne です)', pl_neg: 'い → くない', pl_past: 'い → かった', pl_pastneg: 'い → くなかった',
  }[form] + ii;
}

const ADJ_SETS = {
  auto: 'Alle bisher gelernten Formen',
  polite: 'Höfliche Formen (です …)',
  plain: 'Einfache Formen',
  te: 'て-Form, Adverb, 〜なります',
};
const ADJ_SET_KEYS = { polite: ['p_neg', 'p_past', 'p_pastneg'], plain: ['pl_neg', 'pl_past', 'pl_pastneg', 'pl_pres'], te: ['te', 'adv', 'naru'] };

export const adjFormsArea = {
  id: 'adjectives',
  title: 'Adjektivformen',
  group: 'gram',
  icon: 'sparkle',
  blurb: 'い- und な-Adjektive verneinen, in die Vergangenheit setzen …',
  options: [
    { key: 'forms', label: 'Formen', choices: ADJ_SETS, default: 'auto' },
    { key: 'words', label: 'Wörter', choices: { all: 'Mit Zusatzwörtern (ca. 120)', book: 'Nur aus dem Buch' }, default: 'all' },
  ],
  ref: 'adjectives',
  items(ctx) {
    const set = ctx.opts.forms ?? 'auto';
    const keys = set === 'auto' ? Object.keys(ADJ_FORMS).filter((f) => f !== 'p_pres' && ADJ_FORMS[f].lesson <= max(ctx)) : ADJ_SET_KEYS[set];
    return ADJS.filter((a) => adjLesson(a) <= max(ctx) && (ctx.opts.words !== 'book' || a.lesson > 0))
      .flatMap((a) => keys.map((form) => ({ id: `af:${a.word}:${form}`, lesson: Math.max(adjLesson(a), ADJ_FORMS[form].lesson), tags: [...(a.lesson ? [`L${a.lesson}`] : []), ...adjTags(a, form)], adj: a, form })));
  },
  task(item) {
    const a = item.adj;
    const target = adjForm(a.a, item.form);
    return {
      kind: 'input',
      label: `→ ${ADJ_FORMS[item.form].label}`,
      prompt: html`<div class="big-jp">${jp(furiWord(a.word, a.reading))}</div>`.text,
      sub: html`${a.de} <span class="muted">(${a.type === 'i' ? 'い' : 'な'}-Adjektiv)</span>`.text,
      accept: acceptJapanese(target, target.accept),
      answerHtml: html`${jp(target.furi)}${target.accept.length ? html` <span class="muted small">auch: ${target.accept.map((x) => x.written).join(', ')}</span>` : ''}`.text,
      explain: html`${adjRule(a, item.form)}`.text,
      speakAnswer: target.reading,
    };
  },
};

export const adjType = {
  id: 'adjtype',
  title: 'い oder な?',
  group: 'gram',
  icon: 'quiz',
  blurb: 'Welche Adjektivart? Vorsicht bei きれい und Co.',
  options: [],
  ref: 'adjectives',
  items(ctx) {
    return ADJS.filter((a) => adjLesson(a) <= max(ctx))
      .map((a) => ({ id: `at:${a.word}`, lesson: adjLesson(a), tags: [...(a.lesson ? [`L${a.lesson}`] : []), ...adjTags(a)], adj: a }));
  },
  task(item) {
    const a = item.adj;
    const example = adjForm(a.a, 'attr');
    const neg = adjForm(a.a, 'p_neg');
    return {
      kind: 'choice',
      label: 'Was für ein Adjektiv ist das?',
      prompt: html`<div class="big-jp">${jp(furiWord(a.word, a.reading))}</div>`.text,
      sub: html`${a.de}`.text,
      columns: 2,
      options: [
        { html: html`<span class="option-jp" lang="ja">い</span><span class="muted small">-Adjektiv</span>`.text, correct: a.type === 'i' },
        { html: html`<span class="option-jp" lang="ja">な</span><span class="muted small">-Adjektiv</span>`.text, correct: a.type === 'na' },
      ],
      explain: html`${jp(example.furi)}〜 · ${jp(neg.furi)}${a.type === 'na' && a.reading.endsWith('い') ? html`<br>Endet auf い, ist aber ein な-Adjektiv.` : ''}`.text,
    };
  },
};

export const adjCloze = {
  id: 'adjcloze',
  title: 'Adjektive im Satz',
  group: 'gram',
  icon: 'pen',
  blurb: 'Das Adjektiv fehlt – in der passenden Form einsetzen',
  options: [],
  items(ctx) {
    return adjcloze.filter((c) => c.l <= max(ctx) && adjByWord[c.a])
      .map((c) => ({ id: `ac:${hash(c.s + c.a)}`, lesson: c.l, tags: [`L${c.l}`, ...adjTags(adjByWord[c.a], c.f)], c }));
  },
  task(item) {
    const { c } = item;
    const a = adjByWord[c.a];
    const form = adjForm(a.a, c.f);
    const [before, after] = c.s.split(BLANK);
    return {
      kind: 'input',
      label: `Setz das Adjektiv ein (${ADJ_FORMS[c.f].label})`,
      prompt: html`<div class="sentence">${jp(before)}<span class="gap">（${jp(furiWord(a.word, a.reading))}）</span>${jp(after)}</div>`.text,
      sub: html`${c.de}`.text,
      accept: acceptJapanese(form, form.accept),
      answerHtml: html`<span class="sentence">${jp(before)}<mark>${jp(form.furi)}</mark>${jp(after)}</span>`.text,
      explain: html`${adjRule(a, c.f)}`.text,
      speakAnswer: furiKana(before) + form.reading + furiKana(after),
    };
  },
};

/* ---------- plain ↔ polite (lesson 20) ---------- */

const ADJ_PLAIN_OF = { p_pres: 'pl_pres', p_neg: 'pl_neg', p_past: 'pl_past', p_pastneg: 'pl_pastneg' };

export const plainPolite = {
  id: 'plainpolite',
  title: 'Höflich ↔ Einfach',
  group: 'gram',
  icon: 'swap',
  blurb: 'ます-Form und einfache Form (Lektion 20) umwandeln',
  options: [{ key: 'dir', label: 'Richtung', choices: { toPlain: 'Höflich → Einfach', toPolite: 'Einfach → Höflich', mix: 'Gemischt' }, default: 'mix' }],
  items(ctx) {
    if (max(ctx) < 20) return [];
    const dirs = ctx.opts.dir === 'mix' || !ctx.opts.dir ? ['toPlain', 'toPolite'] : [ctx.opts.dir];
    const verbItems = VERBS.flatMap((v) => Object.keys(PLAIN_OF).flatMap((form) => dirs.map((dir) => ({
      id: `pp:${v.dict}:${form}:${dir}`, lesson: 20, tags: ['L20', `pp:${dir}`, ...verbTags(v, PLAIN_OF[form])], verb: v, form, dir,
    }))));
    const adjItems = ADJS.filter((a) => a.lesson > 0).flatMap((a) => Object.keys(ADJ_PLAIN_OF).flatMap((form) => dirs.map((dir) => ({
      id: `pp:${a.word}:${form}:${dir}`, lesson: 20, tags: ['L20', `pp:${dir}`, ...adjTags(a, ADJ_PLAIN_OF[form])], adj: a, form, dir,
    }))));
    return [...verbItems, ...adjItems];
  },
  task(item) {
    const polite = item.verb ? verbForm(item.verb.v, item.form) : adjForm(item.adj.a, item.form);
    const plain = item.verb ? verbForm(item.verb.v, PLAIN_OF[item.form]) : adjForm(item.adj.a, ADJ_PLAIN_OF[item.form]);
    const [from, to] = item.dir === 'toPlain' ? [polite, plain] : [plain, polite];
    return {
      kind: 'input',
      label: item.dir === 'toPlain' ? 'Wie lautet die einfache Form?' : 'Wie lautet die höfliche Form?',
      prompt: html`<div class="big-jp">${jp(from.furi)}</div>`.text,
      sub: html`${item.verb ? item.verb.de : item.adj.de}`.text,
      accept: acceptJapanese(to, to.accept ?? []),
      answerHtml: jp(to.furi).text,
      speakAnswer: to.reading,
    };
  },
};

/* ---------- grammar quiz ---------- */

export const TOPICS = {
  desu: 'です / じゃありません', kosoado: 'こ・そ・あ・ど', no: 'Partikel の', mo: 'も (auch)', question: 'Fragewörter',
  time: 'Zeitangaben', motion: 'Bewegung (行きます …)', object: 'Objekt mit を', invite: 'Einladen (〜ませんか)',
  giving: 'Geben & Bekommen', adj: 'Adjektive', suki: '好き / 上手 / 分かります', reason: 'Begründen (から)',
  exist: 'あります / います', location: 'Lage (上, 中 …)', counter: 'Zählwörter', compare: 'Vergleichen',
  want: 'Wünsche (ほしい / たい)', purpose: 'Zweck (〜に行きます)', 'te-request': 'Bitten (〜てください)',
  'te-iru': '〜ています', permission: 'Erlaubnis & Verbot', 'te-sequence': 'Reihenfolge (〜て, 〜てから)',
  nai: 'ない-Form-Muster', dict: 'Wörterbuchform-Muster', ta: 'た-Form-Muster', naru: '〜くなります / 〜になります',
  plain: 'Einfache Form', omou: 'と思います / と言いました', modify: 'Relativsätze', toki: 'とき',
  'to-cond': 'Bedingung mit と', tara: 'たら', temo: 'ても', kureru: '〜てあげます / もらいます / くれます',
};

export const grammarQuiz = {
  id: 'grammar',
  title: 'Grammatik-Quiz',
  group: 'gram',
  icon: 'quiz',
  blurb: 'Multiple Choice mit kniffligen Antworten, Lektion 1–25',
  options: [{ key: 'topic', label: 'Thema', choices: { '': 'Alle Themen', ...TOPICS }, default: '' }],
  items(ctx) {
    return grammarData.filter((g) => g.l <= max(ctx) && (!ctx.opts.topic || g.t === ctx.opts.topic))
      .map((g) => ({ id: `gr:${hash(g.s + g.o[0])}`, lesson: g.l, tags: [`L${g.l}`, `gr:${g.t}`], g }));
  },
  task(item, ctx) {
    const { g } = item;
    const [before, after = ''] = g.s.split(BLANK);
    const hasGap = g.s.includes(BLANK);
    return choiceTask({
      label: g.q ?? 'Was passt in die Lücke?',
      prompt: html`<div class="sentence">${jp(before)}${hasGap ? html`<span class="gap">＿＿</span>` : ''}${jp(after)}</div>`.text,
      columns: 1,
      explain: html`<p class="sentence">${jp(before)}<mark>${jp(g.o[0])}</mark>${jp(after)}</p><p class="muted">${g.de}</p><p>${g.why}</p>`.text,
      speakAnswer: furiKana(before) + furiKana(g.o[0]) + furiKana(after),
    }, jp(g.o[0]).text, g.o.slice(1).map((o) => jp(o).text), ctx.rng);
  },
};

/* ---------- sentence building ---------- */

export const sentenceBuilding = {
  id: 'sentences',
  title: 'Satzbau',
  group: 'gram',
  icon: 'blocks',
  blurb: 'Bausteine in die richtige Reihenfolge bringen',
  options: [],
  items(ctx) {
    return sentencesData.filter((s) => s.l <= max(ctx)).map((s) => ({ id: `sb:${hash(s.de + s.c.join(''))}`, lesson: s.l, tags: [`L${s.l}`, 'sb'], s }));
  },
  task(item, ctx) {
    const { s } = item;
    const keys = s.c.map((chunk) => furiKana(chunk));
    const orders = [s.c.map((_, i) => i), ...(s.alt ?? [])];
    const tiles = shuffle(s.c.map((chunk, i) => ({ key: keys[i], html: jp(chunk).text })), ctx.rng);
    return {
      kind: 'tiles',
      label: 'Bilde den Satz auf Japanisch',
      prompt: html`<div class="big-de">${s.de}</div>`.text,
      tiles,
      solutions: orders.map((order) => order.map((i) => keys[i])),
      answerHtml: html`<span class="sentence">${s.c.map((chunk) => jp(chunk))}</span>`.text,
      speakAnswer: keys.join(''),
    };
  },
};

/* ---------- question words ---------- */

export const QUESTION_WORDS = [
  ['{何|なに}・{何|なん}', 'was', '{何|なに}を{食|た}べますか。'],
  ['だれ', 'wer', 'あの{人|ひと}はだれですか。'],
  ['どなた', 'wer (höflich)', 'あの{方|かた}はどなたですか。'],
  ['どこ', 'wo, wohin', 'トイレはどこですか。'],
  ['どちら', 'wo (höflich); welche von zweien', 'お{国|くに}はどちらですか。'],
  ['いつ', 'wann', 'いつ{日本|にほん}へ{行|い}きますか。'],
  ['いくら', 'wie viel (Preis)', 'これはいくらですか。'],
  ['いくつ', 'wie viele (Stück); wie alt', 'りんごをいくつ{買|か}いますか。'],
  ['おいくつ', 'wie alt (höflich)', 'お{子|こ}さんはおいくつですか。'],
  ['どうして', 'warum', 'どうして{来|き}ませんでしたか。'],
  ['どう', 'wie (Eindruck)', '{日本|にほん}の{生活|せいかつ}はどうですか。'],
  ['いかが', 'wie (höflich); möchten Sie …?', 'コーヒーはいかがですか。'],
  ['どんな', 'was für ein', 'どんな{音楽|おんがく}が{好|す}きですか。'],
  ['どれ', 'welches (von mehreren)', 'あなたの{傘|かさ}はどれですか。'],
  ['どの', 'welcher/welche + Nomen', 'どの{人|ひと}が{先生|せんせい}ですか。'],
  ['{何時|なんじ}', 'wie spät, um wie viel Uhr', '{今|いま}{何時|なんじ}ですか。'],
  ['{何曜日|なんようび}', 'welcher Wochentag', '{今日|きょう}は{何曜日|なんようび}ですか。'],
  ['{何|なん}で', 'womit, wie (Verkehrsmittel)', '{何|なん}で{会社|かいしゃ}へ{行|い}きますか。'],
  ['どのくらい', 'wie lange, wie viel', '{東京|とうきょう}から{大阪|おおさか}までどのくらいかかりますか。'],
  ['{何人|なんにん}', 'wie viele Personen', '{家族|かぞく}は{何人|なんにん}ですか。'],
  ['{何歳|なんさい}', 'wie alt', '{何歳|なんさい}ですか。'],
  ['{何階|なんがい}', 'welcher Stock', 'レストランは{何階|なんがい}ですか。'],
  ['{何番|なんばん}', 'welche Nummer', '{電話番号|でんわばんごう}は{何番|なんばん}ですか。'],
  ['{何月|なんがつ}', 'welcher Monat', '{誕生日|たんじょうび}は{何月|なんがつ}{何日|なんにち}ですか。'],
  ['{何日|なんにち}', 'welcher Tag (Datum); wie viele Tage', '{何日|なんにち}に{日本|にほん}へ{行|い}きますか。'],
  ['どうやって', 'wie (auf welche Weise)', '{駅|えき}までどうやって{行|い}きますか。'],
];

export const questionWords = {
  id: 'questionwords',
  title: 'Fragewörter',
  group: 'gram',
  icon: 'question',
  blurb: 'Was, wer, wo, wann, wie viel …',
  options: [{ key: 'dir', label: 'Richtung', choices: { mix: 'Gemischt', jd: 'Japanisch → Deutsch', dj: 'Deutsch → Japanisch' }, default: 'mix' }],
  items(ctx) {
    const dirs = ctx.opts.dir === 'mix' || !ctx.opts.dir ? ['jd', 'dj'] : [ctx.opts.dir];
    return QUESTION_WORDS.flatMap((q) => dirs.map((dir) => ({ id: `qw:${furiKana(q[0])}:${dir}`, tags: ['gr:question', `dir:${dir}`], q, dir })));
  },
  task(item, ctx) {
    const [word, de, example] = item.q;
    const others = shuffle(QUESTION_WORDS.filter((q) => q !== item.q && q[1] !== de), ctx.rng).slice(0, 3);
    const explain = html`${jp(example)}`.text;
    if (item.dir === 'jd') {
      return choiceTask({ label: 'Was bedeutet das Fragewort?', prompt: html`<div class="big-jp">${jp(word)}</div>`.text, explain, speak: furiKana(word), columns: 1 },
        html`${de}`.text, others.map((q) => html`${q[1]}`.text), ctx.rng);
    }
    return choiceTask({ label: 'Welches Fragewort passt?', prompt: html`<div class="big-de">${de}</div>`.text, explain, columns: 2 },
      jp(word).text, others.map((q) => jp(q[0]).text), ctx.rng);
  },
};

