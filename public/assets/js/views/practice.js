/* A running practice session and its result. */
import { renderTask } from '../tasks.js';
import { cat } from '../lib/cat.js';
import { confirmSheet, formatDuration, html, icon, raw } from '../lib/ui.js';

/** Question and right answer of a task, for the list of mistakes. */
function summaryOf(task) {
  const right = task.answerHtml ?? task.options?.find((o) => o.correct)?.html ?? task.back ?? '';
  const question = task.prompt || html`${task.label ?? ''}`.text;
  return html`<div class="wl-q">${raw(question)}</div><div class="wl-a">${raw(right)}</div>`.text;
}

export function renderPractice(app, main) {
  const session = app.practice;
  main.innerHTML = html`
    <header class="practice-head">
      <button class="icon-btn" data-act="quit" aria-label="Übung beenden">${icon('close')}</button>
      <div class="progress" role="progressbar" aria-valuemin="0"><span></span></div>
      <span class="progress-count"></span>
    </header>
    <div class="practice-title muted small">${session.title ?? ''}</div>
    <div class="task-host"></div>`.text;

  const host = main.querySelector('.task-host');
  const bar = main.querySelector('.progress span');
  const count = main.querySelector('.progress-count');

  const progress = () => {
    const done = session.position;
    const total = Math.max(session.total, done + session.remaining + (session.current ? 1 : 0));
    bar.style.width = `${(done / total) * 100}%`;
    count.textContent = `${Math.min(done + 1, total)} / ${total}`;
  };

  const step = () => {
    const next = session.next();
    if (!next) {
      finish();
      return;
    }
    progress();
    renderTask(host, next.task, {
      prefs: app.settings,
      onResult: (result) => {
        session.answer(result);
        progress();
      },
      onOverride: () => session.override(),
      onNext: step,
    });
  };

  const finish = () => {
    const s = session.summary();
    app.practice = null;
    app.sync({ quiet: true });
    const share = s.answered ? s.correct / s.answered : 0;
    const mood = share >= 0.8 ? 'happy' : share >= 0.5 ? 'sit' : 'think';
    const message = share >= 0.9 ? 'すばらしい！ Hervorragend!' : share >= 0.7 ? 'よくできました！ Gut gemacht!' : share >= 0.5 ? 'がんばって！ Weiter so!' : 'だいじょうぶ！ Übung macht den Meister.';
    main.innerHTML = html`
      <section class="result">
        ${cat(mood, { size: 140 })}
        <h1>${message}</h1>
        <div class="result-numbers">
          <div><strong>${s.correct}</strong><span>von ${s.answered} richtig</span></div>
          <div><strong>${Math.round(share * 100)} %</strong><span>Trefferquote</span></div>
          <div><strong>${formatDuration(s.duration)}</strong><span>Dauer</span></div>
        </div>
        ${s.wrongItems.length ? html`<section class="card">
          <h2>Das üben wir noch einmal</h2>
          <ul class="wrong-list">${s.wrongItems.slice(0, 12).map((r) => html`<li>${raw(summaryOf(r.task))}</li>`)}</ul>
          <p class="muted small">Diese Aufgaben kommen bald wieder dran.</p>
        </section>` : ''}
        <div class="result-actions">
          ${s.wrongItems.length ? html`<button class="btn btn-primary" data-act="again">${icon('refresh')} Fehler üben</button>` : ''}
          <button class="btn ${s.wrongItems.length ? 'btn-ghost' : 'btn-primary'}" data-act="home">Fertig</button>
        </div>
      </section>`.text;
    main.querySelector('[data-act="again"]')?.addEventListener('click', () => {
      const items = s.wrongItems.map((r) => r.item);
      app.startPractice({ sources: [], title: 'Fehler wiederholen', items });
    });
    main.querySelector('[data-act="home"]').addEventListener('click', () => app.go('#/'));
  };

  main.querySelector('[data-act="quit"]').addEventListener('click', async () => {
    if (session.position > 0 && session.remaining > 0) {
      const leave = await confirmSheet({ title: 'Übung beenden?', text: 'Deine bisherigen Antworten sind gespeichert.', ok: 'Beenden', cancel: 'Weiter üben' });
      if (!leave) return;
    }
    if (session.position > 0) finish();
    else {
      app.practice = null;
      history.back();
    }
  });

  step();
}

