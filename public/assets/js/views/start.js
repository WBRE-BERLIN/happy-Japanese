/* Asks what the learner wants to see before a vocabulary-like practice starts. */
import { closeSheet, html, sheet } from '../lib/ui.js';

const DIRECTIONS = [
  ['jd', 'Japanisch sehen', 'Ich sage, was es auf Deutsch heißt.'],
  ['dj', 'Deutsch sehen', 'Ich sage es auf Japanisch.'],
  ['mix', 'Gemischt', 'Mal so, mal so.'],
];

/** Areas whose direction is chosen at the start instead of on the area page. */
export const asksDirection = (area) => area.options?.some((o) => o.key === 'dir');

/**
 * Shows the choice of direction (and the kind of task, if the area has one)
 * and calls start(saved) with the learner's choice, which is also remembered.
 */
export function chooseAndStart(app, area, saved, start) {
  const modeOption = area.options.find((o) => o.key === 'mode');
  let mode = saved.mode ?? modeOption?.default;
  const current = saved.dir ?? 'mix';
  const el = sheet(html`
    <h2 class="sheet-title">Was möchtest du sehen?</h2>
    ${modeOption ? html`<div class="option"><span class="option-label">Übungsart</span>
      <div class="segmented">${Object.entries(modeOption.choices).map(([key, label]) => html`<button type="button" class="${key === mode ? 'on' : ''}" data-mode="${key}">${label.replace(/ \(.*\)$/, '')}</button>`)}</div></div>` : ''}
    <div class="direction-choices">${DIRECTIONS.map(([key, title, text]) => html`
      <button class="direction ${key === current ? 'last' : ''}" data-dir="${key}"><strong>${title}</strong><span class="muted small">${text}</span></button>`)}</div>
    <button class="btn btn-ghost wide" data-close-sheet>Abbrechen</button>`.text);
  el.addEventListener('click', (event) => {
    const modeButton = event.target.closest('[data-mode]');
    if (modeButton) {
      mode = modeButton.dataset.mode;
      el.querySelectorAll('[data-mode]').forEach((b) => b.classList.toggle('on', b === modeButton));
      return;
    }
    const dirButton = event.target.closest('[data-dir]');
    if (!dirButton) return;
    const next = { ...saved, dir: dirButton.dataset.dir, ...(modeOption ? { mode } : {}) };
    app.saveAreaOptions(area.id, next);
    closeSheet();
    start(next);
  });
}
