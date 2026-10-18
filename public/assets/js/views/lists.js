/* Reference lists: every verb and adjective in all forms, counters, numbers, dates, kana, kanji … */
import { ADJ_FORMS, FORMS, adjForm, verbForm } from '../lib/conjugate.js';
import { COUNTERS, TIME_GRID, WEEKDAYS, dayReading, monthReading, numberKana, numberKanji, minuteReading, hourKana } from '../lib/numbers.js';
import { KANA_ROWS, kanaToRomaji, toKatakana } from '../lib/kana.js';
import { wordFuri as furiWord } from '../lib/furi.js';
import { html, icon, jp, raw } from '../lib/ui.js';
import { VERBS, ADJS, QUESTION_WORDS } from '../areas/grammar.js';
import { LESSON_WORDS, TRAVEL_WORDS, DECKS } from '../areas/vocab.js';
import { KANJI, SIGNS, signHtml } from '../areas/script.js';
import { FAMILY, PHRASE_CATEGORIES } from '../areas/life.js';
import phrasesData from '../data/phrases.js';

const GROUP = { 1: 'I', 2: 'II', 3: 'III' };

const PARTICLE_GUIDE = [
  ['は', 'Thema des Satzes: „was … betrifft“', '{私|わたし}は{学生|がくせい}です。'],
  ['が', 'Subjekt, neue Information; bei 好き, 上手, 分かります, あります, います; nach Fragewort als Subjekt', 'だれが{来|き}ましたか。'],
  ['を', 'direktes Objekt; Ort, den man verlässt oder durchquert (出ます, 降ります, 渡ります)', '{橋|はし}を{渡|わた}ります。'],
  ['に', 'Zeitpunkt, Ziel, Ort des Daseins, Empfänger, Zweck, Einsteigen (乗ります)', '7{時|じ}に{起|お}きます。'],
  ['で', 'Ort einer Handlung; Mittel, Werkzeug, Sprache; Umfang (全部で, 世界で)', '{図書館|としょかん}で{勉強|べんきょう}します。'],
  ['へ', 'Richtung', '{日本|にほん}へ{行|い}きます。'],
  ['と', 'zusammen mit; und (vollständige Aufzählung); Zitat (と思います)', '{友達|ともだち}と{行|い}きます。'],
  ['も', 'auch; mit Fragewort und Verneinung: 何も, どこも, だれも', '{私|わたし}も{行|い}きます。'],
  ['の', 'Besitz, Zugehörigkeit; verbindet zwei Nomen', '{私|わたし}の{本|ほん}'],
  ['か', 'Frage am Satzende; „oder“ zwischen Nomen', 'コーヒーか{紅茶|こうちゃ}'],
  ['や', '„und“ – Beispiele aus einer längeren Liste', 'りんごやみかん'],
  ['から', 'ab, von (Zeit, Ort); weil (nach dem Grund)', '9{時|じ}から'],
  ['まで', 'bis (Zeit, Ort)', '5{時|じ}まで'],
  ['までに', 'bis spätestens (Frist)', '{金曜日|きんようび}までに'],
  ['より', 'als (Vergleich)', '{東京|とうきょう}は{大阪|おおさか}より{大|おお}きいです。'],
  ['ね / よ', 'ね: Zustimmung erwarten; よ: dem anderen etwas Neues sagen', 'いい{天気|てんき}ですね。'],
  ['だけ / ぐらい / ごろ', 'nur; ungefähr (Menge, Dauer); ungefähr (Zeitpunkt)', '3{時|じ}ごろ'],
];

const LISTS = [
  { id: 'vocab', title: 'Vokabeln nach Lektion', icon: 'cards' },
  { id: 'verbs', title: 'Verben in allen Formen', icon: 'verb' },
  { id: 'adjectives', title: 'Adjektive in allen Formen', icon: 'sparkle' },
  { id: 'particles', title: 'Partikel-Übersicht', icon: 'blocks' },
  { id: 'counters', title: 'Zählwörter', icon: 'abacus' },
  { id: 'numbers', title: 'Zahlen & Lautwandel', icon: 'hash' },
  { id: 'time', title: 'Uhrzeit', icon: 'clock' },
  { id: 'dates', title: 'Datum & Zeitangaben', icon: 'calendar' },
  { id: 'kana', title: 'Hiragana & Katakana', icon: 'kana' },
  { id: 'kanji', title: 'Kanji', icon: 'kanji' },
  { id: 'signs', title: 'Schilder', icon: 'sign' },
  { id: 'phrases', title: 'Reise-Sätze', icon: 'train' },
  { id: 'travel', title: 'Reise-Wortschatz', icon: 'train' },
  { id: 'family', title: 'Familie & Fragewörter', icon: 'family' },
];

export function renderLists(app, main) {
  main.innerHTML = html`
    <header class="page-head"><h1>Nachschlagen</h1><p class="muted">Alles zum Nachlesen – auch offline.</p></header>
    <div class="list-index">${LISTS.map((l) => html`<a class="area-row" href="#/liste/${l.id}"><span class="area-icon">${icon(l.icon)}</span><span class="area-text"><strong>${l.title}</strong></span>${icon('next')}</a>`)}</div>`.text;
}

const searchBox = (placeholder) => html`<input class="search" type="search" placeholder="${placeholder}" aria-label="Suchen" autocapitalize="off" autocorrect="off">`;

function formGrid(entries) {
  return html`<div class="form-grid">${entries.map(([label, form]) => html`<span class="form-label">${label}</span><span>${jp(form.furi)}</span>`)}</div>`;
}

const BUILDERS = {
  vocab(app) {
    const lessons = [...new Set(LESSON_WORDS.map((w) => w.lesson))].sort((a, b) => a - b);
    return html`${searchBox('Suchen: Deutsch, Kana oder Kanji')}
      ${lessons.map((l) => html`<details class="card list-section" ${l === app.settings.lesson ? 'open' : ''}><summary>Lektion ${l} <span class="muted small">${LESSON_WORDS.filter((w) => w.lesson === l).length} Wörter</span></summary>
        <ul class="word-list">${LESSON_WORDS.filter((w) => w.lesson === l).map((w) => html`<li data-search="${`${w.written} ${w.reading} ${w.de}`.toLowerCase()}">
          <span>${jp(w.furi)}</span><span class="muted">${w.de}${w.note ? html` <em>(${w.note})</em>` : ''}</span></li>`)}</ul></details>`)}`;
  },
  travel() {
    return html`${searchBox('Suchen')}${DECKS.map((d) => html`<details class="card list-section"><summary>${d.title} <span class="muted small">${d.count}</span></summary>
      <ul class="word-list">${TRAVEL_WORDS.filter((w) => w.deck === d.id).map((w) => html`<li data-search="${`${w.written} ${w.reading} ${w.de}`.toLowerCase()}"><span>${jp(w.furi)}</span><span class="muted">${w.de}</span></li>`)}</ul></details>`)}`;
  },
  verbs() {
    const formKeys = Object.keys(FORMS).filter((f) => f !== 'stem');
    return html`${searchBox('Verb suchen: Deutsch, Kana oder Kanji')}
      <div class="segmented filter" data-filter-group>${['alle', 'I', 'II', 'III'].map((g, i) => html`<button class="${i === 0 ? 'on' : ''}" data-group="${g}">${g === 'alle' ? 'Alle' : `Gruppe ${g}`}</button>`)}</div>
      <p class="muted small">${VERBS.length} Verben. Antippen zeigt alle Formen.</p>
      ${VERBS.map((v) => html`<details class="card list-item" data-group="${GROUP[v.group]}" data-search="${`${v.dict} ${v.reading} ${v.de}`.toLowerCase()}">
        <summary><span>${jp(furiWord(v.dict, v.reading))}</span><span class="muted">${v.de}</span><span class="badge soft">${GROUP[v.group]}</span></summary>
        ${v.pattern ? html`<p class="muted small" lang="ja">${v.pattern}</p>` : ''}
        ${formGrid(formKeys.map((f) => [FORMS[f].label, verbForm(v.v, f)]))}
        <p class="muted small">Lektion ${v.lesson}</p></details>`)}`;
  },
  adjectives() {
    return html`${searchBox('Adjektiv suchen')}
      <div class="segmented filter" data-filter-group>${['alle', 'い', 'な'].map((g, i) => html`<button class="${i === 0 ? 'on' : ''}" data-group="${g}">${g === 'alle' ? 'Alle' : `${g}-Adjektive`}</button>`)}</div>
      <p class="muted small">${ADJS.length} Adjektive (Lektion 0 = Zusatzwort).</p>
      ${ADJS.map((a) => html`<details class="card list-item" data-group="${a.type === 'i' ? 'い' : 'な'}" data-search="${`${a.word} ${a.reading} ${a.de}`.toLowerCase()}">
        <summary><span>${jp(furiWord(a.word, a.reading))}</span><span class="muted">${a.de}</span><span class="badge soft">${a.type === 'i' ? 'い' : 'な'}</span></summary>
        ${formGrid(Object.keys(ADJ_FORMS).map((f) => [ADJ_FORMS[f].label, adjForm(a.a, f)]))}</details>`)}`;
  },
  particles() {
    return html`<ul class="guide">${PARTICLE_GUIDE.map(([p, text, example]) => html`<li class="card"><div class="guide-head"><span class="guide-key" lang="ja">${p}</span><span>${text}</span></div><div class="guide-example">${jp(example)}</div></li>`)}</ul>`;
  },
  counters() {
    return html`${COUNTERS.map((c) => html`<details class="card list-item"><summary><span class="counter-opt"><span lang="ja">${c.kanji}</span> <span class="muted" lang="ja">${c.kana}</span></span><span class="muted">${c.de}</span></summary>
      <div class="form-grid">${c.readings.map((r, i) => html`<span class="form-label">${i + 1}</span><span lang="ja">${r}${c.alt?.[i + 1] ? html` <span class="muted small">(${c.alt[i + 1].join(', ')})</span>` : ''}</span>`)}
      <span class="form-label">?</span><span lang="ja">${c.q}</span></div></details>`)}`;
  },
  numbers() {
    const row = (values) => html`<div class="form-grid">${values.map((n) => html`<span class="form-label">${n.toLocaleString('de-DE')}</span><span lang="ja">${numberKana(n)} <span class="muted small">${numberKanji(n)}</span></span>`)}</div>`;
    return html`
      <section class="card"><h2>1–10</h2>${row([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10])}<p class="muted small">4 auch し, 7 auch しち, 9 auch く – in großen Zahlen nimmt man よん, なな, きゅう.</p></section>
      <section class="card"><h2>Zehner</h2>${row([20, 30, 40, 50, 60, 70, 80, 90])}</section>
      <section class="card"><h2>Hunderter – Lautwandel bei 3, 6, 8</h2>${row([100, 200, 300, 400, 500, 600, 700, 800, 900])}</section>
      <section class="card"><h2>Tausender – Lautwandel bei 3, 8</h2>${row([1000, 2000, 3000, 4000, 5000, 6000, 7000, 8000, 9000])}</section>
      <section class="card"><h2>万 und 億</h2>${row([10000, 100000, 1000000, 10000000, 100000000])}
        <p class="muted small">Japanisch zählt in Viererblöcken: 1万 = 10.000, 1億 = 100.000.000. 36.800 = 3万6800 = さんまん ろくせん はっぴゃく.</p></section>`;
  },
  time() {
    return html`<section class="card"><h2>Stunden</h2><div class="form-grid">${Array.from({ length: 12 }, (_, i) => html`<span class="form-label">${i + 1} Uhr</span><span lang="ja" class="${[4, 7, 9].includes(i + 1) ? 'changed' : ''}">${hourKana(i + 1)}</span>`)}</div></section>
      <section class="card"><h2>Minuten</h2><div class="form-grid">${[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 15, 20, 30, 45].map((m) => html`<span class="form-label">${m} Min.</span><span lang="ja">${minuteReading(m).kana}${m === 30 ? '・はん' : ''}</span>`)}</div>
        <p class="muted small">ふん nach 2, 5, 7, 9; ぷん nach 1, 3, 4, 6, 8, 10. ごぜん = vormittags, ごご = nachmittags.</p></section>`;
  },
  dates() {
    return html`<section class="card"><h2>Monate</h2><div class="form-grid">${Array.from({ length: 12 }, (_, i) => html`<span class="form-label">${i + 1}月</span><span lang="ja" class="${[4, 7, 9].includes(i + 1) ? 'changed' : ''}">${monthReading(i + 1).kana}</span>`)}</div></section>
      <section class="card"><h2>Tage des Monats</h2><div class="form-grid">${Array.from({ length: 31 }, (_, i) => html`<span class="form-label">${i + 1}日</span><span lang="ja" class="${i < 10 || [13, 19, 23].includes(i) ? 'changed' : ''}">${dayReading(i + 1).kana}</span>`)}</div></section>
      <section class="card"><h2>Wochentage</h2><div class="form-grid">${WEEKDAYS.map((w) => html`<span class="form-label">${w.de}</span><span>${jp(furiWord(w.kanji, w.kana))}</span>`)}</div></section>
      <section class="card"><h2>Zeitangaben</h2><div class="form-grid">${TIME_GRID.rows.flatMap((r) => r.words.filter(Boolean)).concat(TIME_GRID.every).map(([k, r, de]) => html`<span class="form-label">${de}</span><span>${jp(furiWord(k, r))}</span>`)}</div></section>`;
  },
  kana() {
    const table = (rows, kata) => html`<div class="kana-table">${rows.map((row) => html`<div class="kana-row">${row.map((k) => (k ? html`<span class="kana-cell"><span lang="ja">${kata ? toKatakana(k) : k}</span><small>${kanaToRomaji(k)}</small></span>` : html`<span class="kana-cell empty"></span>`))}</div>`)}</div>`;
    return html`${[['Hiragana', false], ['Katakana', true]].map(([name, kata]) => html`<section class="card"><h2>${name}</h2>${table(KANA_ROWS.basic, kata)}
      <h3>Mit ゛ und ゜</h3>${table(KANA_ROWS.voiced, kata)}<h3>Kombinationen</h3>${table(KANA_ROWS.combined, kata)}</section>`)}`;
  },
  kanji() {
    return html`${searchBox('Kanji oder Bedeutung suchen')}
      <div class="kanji-grid">${KANJI.map((k) => html`<details class="card kanji-item" data-search="${`${k.k} ${k.de} ${k.on} ${k.kun}`.toLowerCase()}">
        <summary><span class="kanji-big" lang="ja">${k.k}</span><span class="small">${k.de}</span></summary>
        <div class="small"><span class="muted">On:</span> <span lang="ja">${k.on || '–'}</span><br><span class="muted">Kun:</span> <span lang="ja">${k.kun || '–'}</span></div>
        <ul class="examples">${k.examples.map((e) => html`<li>${jp(e.furi)} <span class="muted">${e.de}</span></li>`)}</ul></details>`)}</div>`;
  },
  signs() {
    return html`${searchBox('Schild suchen')}<div class="sign-list">${SIGNS.map((s) => html`<div class="card sign-item" data-search="${`${s.text} ${s.reading} ${s.de}`.toLowerCase()}">
      ${raw(signHtml(s, { small: true }))}<div><div>${jp(s.furi)}</div><strong>${s.de}</strong>${s.note ? html`<p class="muted small">${s.note}</p>` : ''}</div></div>`)}</div>`;
  },
  phrases() {
    return html`${searchBox('Satz suchen')}${Object.entries(PHRASE_CATEGORIES).map(([cat, title]) => html`<details class="card list-section"><summary>${title}</summary>
      <ul class="word-list">${phrasesData.filter((p) => p.cat === cat).map((p) => html`<li data-search="${`${p.jp} ${p.de}`.toLowerCase()}"><span>${jp(p.jp)}</span><span class="muted">${p.de}</span></li>`)}</ul></details>`)}`;
  },
  family() {
    return html`<section class="card"><h2>Familie</h2><div class="family-table"><span class="th"></span><span class="th">eigene</span><span class="th">andere</span>
      ${FAMILY.map(([de, own, other]) => html`<span class="form-label">${de}</span><span>${jp(own)}</span><span>${jp(other)}</span>`)}</div></section>
      <section class="card"><h2>Fragewörter</h2><ul class="word-list">${QUESTION_WORDS.map(([w, de, ex]) => html`<li><span>${jp(w)}</span><span class="muted">${de}</span><span class="small">${jp(ex)}</span></li>`)}</ul></section>`;
  },
};

export function renderList(app, main, [id]) {
  const list = LISTS.find((l) => l.id === id);
  if (!list) {
    app.go('#/listen');
    return;
  }
  main.innerHTML = html`<header class="page-head with-back"><a class="icon-btn" href="#/listen" aria-label="Zurück">${icon('back')}</a><div><h1>${list.title}</h1></div></header>
    <div class="list-body">${BUILDERS[id](app)}</div>`.text;

  let group = 'alle';
  let query = '';
  const apply = () => {
    main.querySelectorAll('[data-search]').forEach((el) => {
      const matchesGroup = group === 'alle' || !el.dataset.group || el.dataset.group === group;
      el.hidden = !(matchesGroup && (!query || el.dataset.search.includes(query)));
    });
    if (query) main.querySelectorAll('details.list-section').forEach((d) => { d.open = true; });
  };
  main.querySelector('.search')?.addEventListener('input', (event) => {
    query = event.target.value.trim().toLowerCase();
    apply();
  });
  main.querySelector('[data-filter-group]')?.addEventListener('click', (event) => {
    const button = event.target.closest('[data-group]');
    if (!button) return;
    group = button.dataset.group;
    main.querySelectorAll('[data-filter-group] button').forEach((b) => b.classList.toggle('on', b === button));
    apply();
  });
}

