/* Progress: streak, the last two weeks, mastery per area, weak spots and problem items. */
import { accuracy, dailyCounts, leeches, levels, streak, todayCount, weakSpots } from '../lib/analysis.js';
import { expectedTimes } from '../lib/srs.js';
import { html, icon, raw } from '../lib/ui.js';
import { AREAS, areaById, areaOfItem, areasForTag, tagLabel } from '../areas/index.js';
import { areaItems } from '../session.js';

const WEEKDAY = ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'];

/** Bars of answers per day; one series, so no legend – the heading names it. */
function dayChart(days) {
  const max = Math.max(10, ...days.map((d) => d.n));
  const w = 320;
  const h = 120;
  const gap = 4;
  const barW = (w - gap * (days.length - 1)) / days.length;
  const bars = days.map((d, i) => {
    const bh = d.n ? Math.max(3, (d.n / max) * (h - 22)) : 0;
    const x = i * (barW + gap);
    const y = h - 18 - bh;
    const date = new Date(`${d.day}T12:00:00`);
    const label = `${WEEKDAY[date.getDay()]} ${date.getDate()}.${date.getMonth() + 1}.: ${d.n} Aufgaben${d.n ? `, ${Math.round((d.ok / d.n) * 100)} % richtig` : ''}`;
    return `<g class="bar-hit" tabindex="0" data-label="${label}">
      <rect x="${x.toFixed(1)}" y="0" width="${barW.toFixed(1)}" height="${h - 18}" class="hit"/>
      ${bh ? `<path class="bar" d="M${x.toFixed(1)} ${h - 18} V${(y + 4).toFixed(1)} q0 -4 4 -4 H${(x + barW - 4).toFixed(1)} q4 0 4 4 V${h - 18} Z"/>` : ''}
      <text x="${(x + barW / 2).toFixed(1)}" y="${h - 4}" class="axis-label">${WEEKDAY[date.getDay()].slice(0, 2)}</text>
      <title>${label}</title></g>`;
  }).join('');
  return raw(`<svg class="day-chart" viewBox="0 0 ${w} ${h}" role="img" aria-label="Aufgaben pro Tag in den letzten zwei Wochen">
    <line x1="0" x2="${w}" y1="${h - 18}" y2="${h - 18}" class="baseline"/>${bars}</svg>`);
}

/** Readable name of an item for the problem list. */
function itemName(itemId, index) {
  const found = index.get(itemId);
  if (!found) return html`${areaOfItem(itemId)?.title ?? 'Aufgabe'}`;
  const { item } = found;
  if (item.word) return raw(html`<span lang="ja">${item.word.written}</span> <span class="muted">${item.word.de}</span>`.text);
  if (item.verb) return raw(html`<span lang="ja">${item.verb.dict}</span> <span class="muted">${item.form ?? 'Gruppe'}</span>`.text);
  if (item.adj) return raw(html`<span lang="ja">${item.adj.word}</span> <span class="muted">${item.form ?? 'い/な'}</span>`.text);
  if (item.entry) return raw(html`<span lang="ja">${item.entry.k}</span> <span class="muted">${item.entry.de}</span>`.text);
  if (item.k) return raw(html`<span lang="ja">${item.k.kana}</span>`.text);
  if (item.sign) return raw(html`<span lang="ja">${item.sign.text}</span> <span class="muted">${item.sign.de}</span>`.text);
  if (item.counter) return raw(html`<span lang="ja">${item.counter.readings[item.n - 1]}</span>`.text);
  if (item.p?.de) return html`${item.p.de}`;
  if (item.g) return html`${item.g.de}`;
  if (item.c?.de) return html`${item.c.de}`;
  return html`${found.area.title}`;
}

export function renderStats(app, main) {
  const { store } = app;
  const attempts = store.attempts;
  const states = store.states;
  const expected = expectedTimes(attempts);
  const week = attempts.filter((a) => a.at > Date.now() - 7 * 86400000);
  const avgMs = week.length ? week.reduce((s, a) => s + a.ms, 0) / week.length : 0;
  const acc = accuracy(attempts);
  const learned = [...states.values()].filter((s) => s.ivl >= 1).length;
  const weak = weakSpots(attempts, { expected, limit: 10 });
  const problem = leeches(states, 15);

  const index = new Map();
  const perArea = AREAS.map((area) => {
    const items = areaItems(area, app.settings, app.areaSaved(area.id));
    for (const item of items) index.set(item.id, { item, area });
    const counts = levels(items.map((i) => i.id), states);
    return { area, counts, total: items.length, seen: items.length - counts[0] };
  }).filter((a) => a.seen > 0);

  main.innerHTML = html`
    <header class="page-head"><h1>Fortschritt</h1></header>
    <section class="stat-tiles">
      <div class="tile">${icon('flame')}<strong>${streak(attempts)}</strong><span>Tage in Folge</span></div>
      <div class="tile">${icon('check')}<strong>${todayCount(attempts)}</strong><span>heute</span></div>
      <div class="tile">${icon('target')}<strong>${acc === null ? '–' : `${Math.round(acc * 100)} %`}</strong><span>richtig (7 Tage)</span></div>
      <div class="tile">${icon('clock')}<strong>${avgMs ? `${(avgMs / 1000).toFixed(1)} s` : '–'}</strong><span>pro Antwort (7 Tage)</span></div>
      <div class="tile">${icon('sparkle')}<strong>${learned}</strong><span>gelernt</span></div>
      <div class="tile">${icon('cards')}<strong>${attempts.length}</strong><span>Antworten gesamt</span></div>
    </section>

    <section class="card">
      <h2>Aufgaben pro Tag</h2>
      ${dayChart(dailyCounts(attempts))}
      <p class="chart-readout muted small" aria-live="polite">Tippe auf einen Balken für Details.</p>
    </section>

    <section class="card">
      <h2>Hier hakt es</h2>
      ${weak.length ? html`<ul class="weak-list">${weak.map((w) => html`<li>
        <div><span>${tagLabel(w.tag)}</span>
          <span class="muted small">${Math.round(w.acc * 100)} % richtig · ${w.n} Versuche${w.slowShare > 0.3 ? ' · oft langsam' : ''}</span>
          <div class="bar"><span style="width:${Math.round(w.acc * 100)}%"></span></div></div>
        <button class="btn btn-ghost small" data-weak="${w.tag}">Üben</button></li>`)}</ul>`
        : html`<p class="muted">Noch keine Schwachstellen – oder noch zu wenige Antworten. Weiter so!</p>`}
    </section>

    ${problem.length ? html`<section class="card">
      <h2>Problemfälle</h2>
      <p class="muted small">Aufgaben, die immer wieder danebengehen.</p>
      <ul class="problem-list">${problem.map(({ item, state }) => html`<li><span>${itemName(item, index)}</span>
        <span class="muted small">${state.bad}× falsch</span></li>`)}</ul>
      <button class="btn btn-primary" data-act="leeches">${icon('target')} Problemfälle üben</button>
    </section>` : ''}

    <section class="card">
      <h2>Nach Bereichen</h2>
      ${perArea.length ? html`<ul class="area-progress">${perArea.map(({ area, counts, total, seen }) => html`<li>
        <a href="#/bereich/${area.id}"><span>${area.title}</span><span class="muted small">${seen} von ${total} begonnen · ${counts[4]} gemeistert</span></a>
        <div class="levels">${counts.slice(1).map((n, i) => (n ? html`<span class="lv lv${i + 1}" style="width:${((n / total) * 100).toFixed(1)}%"></span>` : ''))}</div></li>`)}</ul>
      <div class="legend">${['lernt', 'vertraut', 'sicher', 'gemeistert'].map((label, i) => html`<span><i class="lv lv${i + 1}"></i>${label}</span>`)}</div>`
        : html`<p class="muted">Noch nichts geübt.</p>`}
    </section>`.text;

  const readout = main.querySelector('.chart-readout');
  const show = (target) => {
    const bar = target.closest('.bar-hit');
    if (!bar) return;
    main.querySelectorAll('.bar-hit').forEach((b) => b.classList.toggle('active', b === bar));
    readout.textContent = bar.dataset.label;
  };
  main.querySelector('.day-chart')?.addEventListener('pointerover', (e) => show(e.target));
  main.querySelector('.day-chart')?.addEventListener('focusin', (e) => show(e.target));

  main.addEventListener('click', (event) => {
    show(event.target);
    const weakTag = event.target.closest('[data-weak]')?.dataset.weak;
    if (weakTag) {
      const sources = areasForTag(weakTag).map((id) => ({ area: areaById[id], saved: app.areaSaved(id) }));
      app.startPractice({ sources, focus: 'weak', weakTags: [weakTag], title: tagLabel(weakTag) });
    }
    if (event.target.closest('[data-act="leeches"]')) {
      const items = problem.map(({ item }) => index.get(item)?.item && { ...index.get(item).item, area: index.get(item).area }).filter(Boolean);
      if (items.length) app.startPractice({ sources: [], title: 'Problemfälle', items });
    }
  });
}
