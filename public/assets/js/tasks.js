/*
 * Renders one task and reports the result. Task kinds:
 *   flash   card with front and back, the learner says "wusste ich" or not
 *   choice  pick one option
 *   input   type the answer (kana, romaji is converted while typing; or digits)
 *   tiles   put tiles in order
 *   palette fill gaps in a sentence from a set of particles
 */
import { normalizeAnswer, romajiToKana } from './lib/kana.js';
import { html, icon, raw, speak, canSpeak, haptic } from './lib/ui.js';

const PRAISE = ['Richtig!', 'Sehr gut!', 'Genau!', 'Prima!', 'Richtig – にゃん!', 'すごい!'];
const MAX_MS = 60_000;

/**
 * @param {HTMLElement} host
 * @param {object} task
 * @param {{ onResult: (r: {ok: boolean, ms: number, hinted?: boolean}) => void,
 *           onOverride: () => void, onNext: () => void, prefs: object }} hooks
 */
export function renderTask(host, task, hooks) {
  const started = performance.now();
  let hiddenSince = null;
  let hiddenTotal = 0;
  const onVisibility = () => {
    if (document.hidden) hiddenSince = performance.now();
    else if (hiddenSince !== null) {
      hiddenTotal += performance.now() - hiddenSince;
      hiddenSince = null;
    }
  };
  document.addEventListener('visibilitychange', onVisibility);
  const elapsed = () => Math.min(MAX_MS, performance.now() - started - hiddenTotal);

  let answered = false;
  const finish = (ok, extra = {}) => {
    if (answered) return;
    answered = true;
    document.removeEventListener('visibilitychange', onVisibility);
    const ms = elapsed();
    hooks.onResult({ ok, ms, ...extra });
    haptic(ok ? 10 : [20, 40, 20]);
    return ms;
  };

  const speakButton = (text, cls = '') => (text && canSpeak()
    ? html`<button class="icon-btn ${cls}" data-speak="${text}" aria-label="Vorlesen">${icon('sound')}</button>` : '');

  const header = html`
    ${task.visual ? html`<div class="task-visual">${raw(task.visual)}</div>` : ''}
    ${task.label ? html`<div class="task-label">${task.label}</div>` : ''}
    <div class="task-prompt ${task.promptClass ?? ''}">${raw(task.prompt)}${speakButton(task.speak, 'prompt-speak')}</div>
    ${task.sub ? html`<div class="task-sub">${raw(task.sub)}</div>` : ''}`;

  host.innerHTML = '';
  const card = document.createElement('div');
  card.className = `task task-${task.kind}`;
  host.append(card);

  card.addEventListener('click', (event) => {
    const speaker = event.target.closest('[data-speak]');
    if (speaker) {
      event.stopPropagation();
      speak(speaker.dataset.speak);
    }
  });

  if (hooks.prefs.autoSpeak && task.speak && task.kind !== 'input') setTimeout(() => speak(task.speak), 250);

  /* ---------- feedback ---------- */
  function feedback(ok, { given, override = false } = {}) {
    const box = document.createElement('div');
    box.className = `feedback ${ok ? 'ok' : 'bad'}`;
    box.innerHTML = html`
      <div class="feedback-head">${icon(ok ? 'check' : 'x')}<strong>${ok ? PRAISE[Math.floor(Math.random() * PRAISE.length)] : 'Leider nicht.'}</strong>
        ${speakButton(task.speakAnswer)}</div>
      ${!ok && given ? html`<div class="answer-line"><span class="muted">Deine Antwort:</span> <span class="given" lang="ja">${given}</span></div>` : ''}
      ${task.answerHtml && (!ok || task.kind !== 'choice') ? html`<div class="answer-line"><span class="muted">${ok ? 'Antwort:' : 'Richtig:'}</span> ${raw(task.answerHtml)}</div>` : ''}
      ${task.explain ? html`<div class="explain">${raw(task.explain)}</div>` : ''}
      <div class="feedback-actions">
        ${override ? html`<button class="btn btn-ghost small" data-act="override">Als richtig werten</button>` : ''}
        <button class="btn btn-primary" data-act="next">Weiter ${icon('next')}</button>
      </div>`.text;
    card.append(box);
    if (hooks.prefs.autoSpeak && task.speakAnswer) speak(task.speakAnswer);
    const next = box.querySelector('[data-act="next"]');
    next.addEventListener('click', () => hooks.onNext());
    box.querySelector('[data-act="override"]')?.addEventListener('click', () => {
      hooks.onOverride();
      hooks.onNext();
    });
    box.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    if (ok && !task.explain && hooks.prefs.autoNext !== false) {
      box.classList.add('auto');
      setTimeout(() => { if (box.isConnected) hooks.onNext(); }, 900);
    } else {
      setTimeout(() => next.focus({ preventScroll: true }), 50);
    }
  }

  /* ---------- kinds ---------- */
  if (task.kind === 'flash') {
    card.innerHTML = html`
      <button class="flashcard" data-act="flip" aria-label="Karte umdrehen">
        <div class="flash-front">${header}<div class="flash-hint">Antippen zum Aufdecken</div></div>
      </button>
      <div class="flash-actions" hidden>
        <button class="btn btn-bad" data-act="no">${icon('x')} Wusste ich nicht</button>
        <button class="btn btn-good" data-act="yes">${icon('check')} Wusste ich</button>
      </div>`.text;
    let revealMs = 0;
    const flip = () => {
      const front = card.querySelector('.flashcard');
      if (front.classList.contains('flipped')) return;
      revealMs = elapsed();
      front.classList.add('flipped');
      front.insertAdjacentHTML('beforeend', html`<div class="flash-back">${raw(task.back)}${speakButton(task.speakAnswer, 'back-speak')}</div>`.text);
      card.querySelector('.flash-hint')?.remove();
      card.querySelector('.flash-actions').hidden = false;
      if (hooks.prefs.autoSpeak && task.speakAnswer) speak(task.speakAnswer);
    };
    card.addEventListener('click', (event) => {
      const act = event.target.closest('[data-act]')?.dataset.act;
      if (act === 'flip') flip();
      if (act === 'yes' || act === 'no') {
        if (answered) return;
        answered = true;
        document.removeEventListener('visibilitychange', onVisibility);
        hooks.onResult({ ok: act === 'yes', ms: revealMs });
        hooks.onNext();
      }
    });
    return;
  }

  if (task.kind === 'choice') {
    const long = task.options.some((o) => o.html.replace(/<rt>.*?<\/rt>|<[^>]+>/g, '').length > 14);
    card.innerHTML = html`${header}
      <div class="options ${long || task.columns === 1 ? 'one' : 'two'}">
        ${task.options.map((o, i) => html`<button class="choice" data-option="${i}">${raw(o.html)}</button>`)}
      </div>`.text;
    card.querySelector('.options').addEventListener('click', (event) => {
      const button = event.target.closest('[data-option]');
      if (!button || answered) return;
      const option = task.options[Number(button.dataset.option)];
      finish(option.correct);
      card.querySelectorAll('.choice').forEach((el, i) => {
        el.disabled = true;
        if (task.options[i].correct) el.classList.add('right');
      });
      if (!option.correct) button.classList.add('wrong');
      feedback(option.correct);
    });
    return;
  }

  if (task.kind === 'input') {
    const numeric = task.numeric === true;
    card.innerHTML = html`${header}
      <form class="answer-form" autocomplete="off" novalidate>
        <input class="answer-input" name="answer" ${numeric ? raw('inputmode="numeric"') : raw('lang="ja"')}
          autocapitalize="off" autocorrect="off" spellcheck="false" enterkeyhint="done"
          placeholder="${task.placeholder ?? (numeric ? 'Zahl' : 'Antwort (Kana oder Romaji)')}" aria-label="Antwort">
        <div class="answer-buttons">
          ${task.hint ? html`<button type="button" class="btn btn-ghost small" data-act="hint">Tipp</button>` : ''}
          <button type="button" class="btn btn-ghost small" data-act="skip">Weiß nicht</button>
          <button class="btn btn-primary" type="submit">Prüfen</button>
        </div>
      </form>`.text;
    const form = card.querySelector('form');
    const input = form.answer;
    let hinted = false;
    let composing = false;
    input.addEventListener('compositionstart', () => { composing = true; });
    input.addEventListener('compositionend', () => { composing = false; });
    input.addEventListener('input', () => {
      if (numeric || composing || hooks.prefs.romaji === false || !/[a-z]/i.test(input.value)) return;
      const converted = romajiToKana(input.value, { final: false });
      if (converted !== input.value) input.value = converted;
    });
    const check = (given) => {
      const value = numeric ? given.replace(/[^\d]/g, '') : normalizeAnswer(given);
      const ok = value !== '' && task.accept.includes(value);
      finish(ok, { hinted });
      input.readOnly = true;
      input.classList.add(ok ? 'right' : 'wrong');
      form.querySelector('.answer-buttons').remove();
      feedback(ok, { given: given || '—', override: !ok && given.trim() !== '' && !numeric });
    };
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      if (answered) return;
      if (!input.value.trim()) {
        input.focus();
        return;
      }
      check(numeric ? input.value : romajiToKana(input.value.normalize('NFKC')));
    });
    form.addEventListener('click', (event) => {
      const act = event.target.closest('[data-act]')?.dataset.act;
      if (act === 'skip' && !answered) check('');
      if (act === 'hint' && !hinted) {
        hinted = true;
        event.target.closest('button').disabled = true;
        form.insertAdjacentHTML('beforebegin', html`<div class="hint">Tipp: ${raw(task.hint)}</div>`.text);
      }
    });
    setTimeout(() => input.focus({ preventScroll: true }), 120);
    return;
  }

  if (task.kind === 'tiles') {
    const placed = [];
    card.innerHTML = html`${header}
      <div class="tile-answer" aria-label="Deine Antwort"></div>
      <div class="tile-pool">${task.tiles.map((t, i) => html`<button class="tile" data-tile="${i}">${raw(t.html)}</button>`)}</div>
      <div class="answer-buttons">
        <button class="btn btn-ghost small" data-act="clear">Zurücksetzen</button>
        <button class="btn btn-primary" data-act="check" disabled>Prüfen</button>
      </div>`.text;
    const answer = card.querySelector('.tile-answer');
    const pool = card.querySelector('.tile-pool');
    const checkButton = card.querySelector('[data-act="check"]');
    const refresh = () => {
      answer.innerHTML = placed.map((i) => `<button class="tile placed" data-placed="${i}">${task.tiles[i].html}</button>`).join('') || '<span class="tile-empty">Tippe die Bausteine in der richtigen Reihenfolge an.</span>';
      pool.querySelectorAll('[data-tile]').forEach((el) => { el.classList.toggle('used', placed.includes(Number(el.dataset.tile))); });
      checkButton.disabled = placed.length === 0;
    };
    refresh();
    card.addEventListener('click', (event) => {
      if (answered) return;
      const tile = event.target.closest('[data-tile]');
      const back = event.target.closest('[data-placed]');
      const act = event.target.closest('[data-act]')?.dataset.act;
      if (tile && !placed.includes(Number(tile.dataset.tile))) placed.push(Number(tile.dataset.tile));
      if (back) placed.splice(placed.indexOf(Number(back.dataset.placed)), 1);
      if (act === 'clear') placed.length = 0;
      if (act === 'check') {
        const keys = placed.map((i) => task.tiles[i].key);
        const ok = task.solutions.some((solution) => solution.length === keys.length && solution.every((k, i) => (Array.isArray(k) ? k.includes(keys[i]) : k === keys[i])));
        finish(ok);
        answer.classList.add(ok ? 'right' : 'wrong');
        card.querySelector('.answer-buttons').remove();
        pool.classList.add('done');
        feedback(ok);
        return;
      }
      refresh();
    });
    return;
  }

  if (task.kind === 'palette') {
    const filled = task.answers.map(() => null);
    let current = 0;
    card.innerHTML = html`${header}
      <div class="palette-sentence jp" lang="ja"></div>
      <div class="palette">${task.palette.map((p) => html`<button class="tile" data-particle="${p}">${p}</button>`)}</div>
      <div class="answer-buttons"><button class="btn btn-primary" data-act="check" disabled>Prüfen</button></div>`.text;
    const sentence = card.querySelector('.palette-sentence');
    const checkButton = card.querySelector('[data-act="check"]');
    const draw = (result) => {
      sentence.innerHTML = task.parts.map((part, i) => {
        if (i === task.parts.length - 1) return part;
        const value = filled[i];
        const state = result ? (result[i] ? 'right' : 'wrong') : (i === current ? 'current' : '');
        return `${part}<button class="slot ${state}" data-slot="${i}">${value ?? '＿'}</button>`;
      }).join('');
      checkButton.disabled = filled.some((f) => f === null);
    };
    draw();
    card.addEventListener('click', (event) => {
      if (answered) return;
      const particle = event.target.closest('[data-particle]')?.dataset.particle;
      const slot = event.target.closest('[data-slot]');
      if (particle) {
        filled[current] = particle;
        const nextEmpty = filled.findIndex((f) => f === null);
        current = nextEmpty === -1 ? current : nextEmpty;
      }
      if (slot) {
        current = Number(slot.dataset.slot);
        filled[current] = null;
      }
      if (event.target.closest('[data-act="check"]')) {
        const result = filled.map((value, i) => task.answers[i].includes(value));
        const ok = result.every(Boolean);
        finish(ok);
        draw(result);
        card.querySelector('.palette').classList.add('done');
        card.querySelector('.answer-buttons').remove();
        feedback(ok);
        return;
      }
      draw();
    });
  }
}
