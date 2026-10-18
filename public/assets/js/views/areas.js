/* The list of areas and the page of one area with its options. */
import { levels } from '../lib/analysis.js';
import { isDue, LEVELS } from '../lib/srs.js';
import { html, icon, toast } from '../lib/ui.js';
import { AREAS, GROUPS, areaById, areaOptions } from '../areas/index.js';
import { areaItems } from '../session.js';
import { cat } from '../lib/cat.js';

function areaStats(app, area, saved) {
  const items = areaItems(area, app.settings, saved);
  const states = app.store.states;
  const counts = levels(items.map((i) => i.id), states);
  const due = items.filter((i) => isDue(states.get(i.id))).length;
  // Nothing yet for the learner's lesson: from which lesson on is there something?
  const from = items.length ? null : Math.min(...areaItems(area, app.settings, saved, { ignoreLesson: true }).map((i) => i.lesson ?? 1), 25);
  return { items, counts, due, total: items.length, from };
}

const levelBar = (counts, total) => html`<div class="levels" aria-label="Fortschritt">
  ${counts.slice(1).map((n, i) => (n ? html`<span class="lv lv${i + 1}" style="width:${((n / total) * 100).toFixed(1)}%"></span>` : ''))}</div>`;

export function renderAreas(app, main) {
  const mix = new Set(app.settings.mix);
  main.innerHTML = html`
    <header class="page-head"><h1>Bereiche</h1><p class="muted">Wähle, was du üben möchtest. Mit ★ markierte Bereiche sind im Tagesmix.</p></header>
    ${GROUPS.map((group) => html`<section class="area-group">
      <h2>${group.title}</h2>
      <div class="area-list">${AREAS.filter((a) => a.group === group.id).map((area) => {
        const stats = areaStats(app, area, app.areaSaved(area.id));
        return html`<a class="area-row" href="#/bereich/${area.id}">
          <span class="area-icon">${icon(area.icon)}</span>
          <span class="area-text"><strong>${area.title}${mix.has(area.id) ? html` <span class="star" aria-label="im Tagesmix">★</span>` : ''}</strong>
            <span class="muted small">${area.blurb}</span>
            ${stats.total ? levelBar(stats.counts, stats.total) : html`<span class="muted small">ab Lektion ${stats.from}</span>`}</span>
          ${stats.due ? html`<span class="badge">${stats.due}</span>` : ''}
        </a>`;
      })}</div></section>`)}`.text;
}

function optionControl(option, value) {
  const entries = Object.entries(option.choices);
  const short = entries.length <= 3 && entries.every(([, label]) => label.length <= 18);
  if (short) {
    return html`<div class="option"><span class="option-label">${option.label}</span>
      <div class="segmented">${entries.map(([key, label]) => html`<button type="button" class="${key === value ? 'on' : ''}" data-opt="${option.key}" data-value="${key}">${label}</button>`)}</div></div>`;
  }
  return html`<label class="option"><span class="option-label">${option.label}</span>
    <select data-opt-select="${option.key}">${entries.map(([key, label]) => html`<option value="${key}" ${key === value ? 'selected' : ''}>${label}</option>`)}</select></label>`;
}

export function renderArea(app, main, [id]) {
  const area = areaById[id];
  if (!area) {
    app.go('#/bereiche');
    return;
  }
  let saved = { ...app.areaSaved(id) };

  const draw = () => {
    const opts = areaOptions(area, saved);
    const stats = areaStats(app, area, saved);
    const inMix = app.settings.mix.includes(id);
    const fresh = stats.counts[0];
    main.innerHTML = html`
      <header class="page-head with-back">
        <a class="icon-btn" href="#/bereiche" aria-label="Zurück">${icon('back')}</a>
        <div><h1>${area.title}</h1><p class="muted">${area.blurb}</p></div>
      </header>

      ${stats.total ? html`<section class="card area-summary">
        <div class="summary-numbers">
          <div><strong>${stats.total}</strong><span>Aufgaben</span></div>
          <div><strong>${stats.due}</strong><span>fällig</span></div>
          <div><strong>${fresh}</strong><span>neu</span></div>
          <div><strong>${stats.counts[4]}</strong><span>gemeistert</span></div>
        </div>
        ${levelBar(stats.counts, stats.total)}
        <div class="legend">${LEVELS.slice(1).map((label, i) => html`<span><i class="lv lv${i + 1}"></i>${label} ${stats.counts[i + 1]}</span>`)}</div>
      </section>` : html`<section class="card soft empty">${cat('think', { size: 90 })}
        <p>Für deine Lektion (${app.settings.lesson}) gibt es hier noch nichts – das kommt ab Lektion ${stats.from}.</p>
        <button class="btn btn-ghost" data-act="anyway">Trotzdem üben (alle Lektionen)</button></section>`}

      ${area.options?.length ? html`<section class="card options-card"><h2>Einstellungen</h2>${area.options.map((o) => optionControl(o, opts[o.key]))}</section>` : ''}

      <div class="practice-buttons">
        <button class="btn btn-primary btn-hero" data-act="mix" ${stats.total ? '' : 'disabled'}>${icon('play')} <span>Üben<small>Fällige, neue und schwierige Aufgaben</small></span></button>
        <div class="quick">
          <button class="quick-btn" data-act="review" ${stats.due ? '' : 'disabled'}>${icon('refresh')}<span>Wiederholen</span></button>
          <button class="quick-btn" data-act="weak" ${stats.total - fresh ? '' : 'disabled'}>${icon('target')}<span>Schwierige</span></button>
          <button class="quick-btn" data-act="new" ${fresh ? '' : 'disabled'}>${icon('sparkle')}<span>Nur neue</span></button>
        </div>
      </div>

      <section class="card toggle-card">
        <label class="switch-row"><span><strong>Im Tagesmix</strong><span class="muted small">Dieser Bereich kommt im Tagesmix auf der Startseite vor.</span></span>
          <input type="checkbox" role="switch" data-act="mix-toggle" ${inMix ? 'checked' : ''}></label>
        ${area.ref ? html`<a class="link" href="#/liste/${area.ref}">${icon('book')} Zum Nachschlagen</a>` : ''}
      </section>`.text;
  };

  main.addEventListener('click', (event) => {
    const optButton = event.target.closest('[data-opt]');
    if (optButton) {
      saved = { ...saved, [optButton.dataset.opt]: optButton.dataset.value };
      app.saveAreaOptions(id, saved);
      draw();
      return;
    }
    const act = event.target.closest('[data-act]')?.dataset.act;
    const sources = [{ area, saved }];
    const title = area.title;
    if (act === 'mix') app.startPractice({ sources, title, explicit: true });
    if (act === 'review') app.startPractice({ sources, focus: 'review', title });
    if (act === 'weak') app.startPractice({ sources, focus: 'weak', title: `${title}: Schwierige` });
    if (act === 'new') app.startPractice({ sources, focus: 'new', title: `${title}: Neue`, explicit: true });
    if (act === 'anyway') app.startPractice({ sources, title, explicit: true, ignoreLesson: true });
  });

  main.addEventListener('change', (event) => {
    const select = event.target.closest('[data-opt-select]');
    if (select) {
      saved = { ...saved, [select.dataset.optSelect]: select.value };
      app.saveAreaOptions(id, saved);
      draw();
    }
    if (event.target.matches('[data-act="mix-toggle"]')) {
      const mix = new Set(app.settings.mix);
      if (event.target.checked) mix.add(id);
      else mix.delete(id);
      app.saveSettings({ mix: [...mix] });
      toast(event.target.checked ? `${area.title} ist jetzt im Tagesmix.` : `${area.title} ist nicht mehr im Tagesmix.`);
    }
  });

  draw();
}
