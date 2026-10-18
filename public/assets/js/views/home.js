/* Start page: today, the daily mix, weak spots, current lesson. */
import { weakSpots, streak, todayCount } from '../lib/analysis.js';
import { expectedTimes, isDue } from '../lib/srs.js';
import { cat } from '../lib/cat.js';
import { html, icon, raw } from '../lib/ui.js';
import { areasForTag, areaById, tagLabel } from '../areas/index.js';
import { areaItems } from '../session.js';

const HINT_KEY = 'happyjapanese.installHintClosed';

function greeting(date = new Date()) {
  const h = date.getHours();
  if (h >= 4 && h < 10) return ['おはようございます', 'Guten Morgen'];
  if (h >= 10 && h < 18) return ['こんにちは', 'Guten Tag'];
  return ['こんばんは', 'Guten Abend'];
}

export function countDue(app, sources) {
  const states = app.store.states;
  let due = 0;
  let fresh = 0;
  for (const { area, saved } of sources) {
    for (const item of areaItems(area, app.settings, saved)) {
      const state = states.get(item.id);
      if (!state) fresh++;
      else if (isDue(state)) due++;
    }
  }
  return { due, fresh };
}

const ring = (value, max) => {
  const share = Math.min(1, max ? value / max : 0);
  const c = 2 * Math.PI * 34;
  return raw(`<svg class="ring" viewBox="0 0 80 80" aria-hidden="true"><circle cx="40" cy="40" r="34" class="ring-bg"/>
    <circle cx="40" cy="40" r="34" class="ring-fg" stroke-dasharray="${(c * share).toFixed(1)} ${c.toFixed(1)}" transform="rotate(-90 40 40)"/></svg>`);
};

export function renderHome(app, main) {
  const { store, settings } = app;
  const today = todayCount(store.attempts);
  const days = streak(store.attempts);
  const goal = settings.goal ?? 30;
  const sources = app.mixSources();
  const { due } = countDue(app, sources);
  const weak = weakSpots(store.attempts, { expected: expectedTimes(store.attempts), limit: 3 });
  const [jp, de] = greeting();
  const hour = new Date().getHours();
  const mood = today >= goal ? 'happy' : hour >= 23 || hour < 5 ? 'sleep' : 'sit';
  const isIos = /iPhone|iPad|iPod/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  const standalone = navigator.standalone === true || matchMedia('(display-mode: standalone)').matches;
  let hintClosed = false;
  try { hintClosed = localStorage.getItem(HINT_KEY) === '1'; } catch { /* ignore */ }

  main.innerHTML = html`
    <header class="home-head">
      <div>
        <p class="greet-jp" lang="ja">${jp}</p>
        <h1>${de}, ${app.user.display_name || app.user.username}!</h1>
      </div>
      <span id="sync-badge" class="sync-badge" hidden></span>
    </header>

    <section class="card today">
      <div class="today-ring">${ring(today, goal)}<div class="ring-label"><strong>${today}</strong><span>/ ${goal}</span></div></div>
      <div class="today-text">
        <div class="today-stats">
          <span class="stat">${icon('flame')} <strong>${days}</strong> ${days === 1 ? 'Tag' : 'Tage'} in Folge</span>
          <span class="stat">${icon('refresh')} <strong>${due}</strong> fällig</span>
        </div>
        <p class="muted small">${today >= goal ? 'Tagesziel geschafft – よくできました！' : `Noch ${goal - today} Aufgaben bis zum Tagesziel.`}</p>
      </div>
      <div class="today-cat">${cat(mood, { size: 92 })}</div>
    </section>

    <button class="btn btn-primary btn-hero" data-act="mix">${icon('play')} <span>Tagesmix starten<small>${settings.size} Aufgaben aus deinen Bereichen</small></span></button>

    <div class="quick">
      <button class="quick-btn" data-act="weak" ${weak.length ? '' : 'disabled'}>${icon('target')}<span>Schwächen üben</span></button>
      <button class="quick-btn" data-act="new">${icon('sparkle')}<span>Neue Wörter L${settings.lesson}</span></button>
      <button class="quick-btn" data-act="review" ${due ? '' : 'disabled'}>${icon('refresh')}<span>Nur Wiederholen</span></button>
    </div>

    <section class="card lesson-card">
      <div>
        <h2>Deine Lektion</h2>
        <p class="muted small">Übungen bis einschließlich dieser Lektion von Minna no Nihongo I</p>
      </div>
      <div class="stepper" role="group" aria-label="Lektion">
        <button class="icon-btn" data-act="lesson-down" aria-label="Eine Lektion zurück" ${settings.lesson <= 1 ? 'disabled' : ''}>−</button>
        <span class="stepper-value">${settings.lesson}</span>
        <button class="icon-btn" data-act="lesson-up" aria-label="Eine Lektion weiter" ${settings.lesson >= 25 ? 'disabled' : ''}>+</button>
      </div>
    </section>

    ${weak.length ? html`<section class="card">
      <h2>Hier hakt es noch</h2>
      <ul class="weak-list">${weak.map((w) => html`<li>
        <div><span>${tagLabel(w.tag)}</span><span class="muted small">${Math.round(w.acc * 100)} % richtig · ${w.n} Versuche</span>
          <div class="bar"><span style="width:${Math.round(w.acc * 100)}%"></span></div></div>
        <button class="btn btn-ghost small" data-weak="${w.tag}">Üben</button></li>`)}</ul>
      <a class="link small" href="#/fortschritt">Alle Auswertungen ${icon('next')}</a>
    </section>` : html`<section class="card soft">
      <p class="muted">Sobald du ein paar Runden geübt hast, zeigt dir Mochi hier, wo es noch hakt.</p></section>`}

    ${isIos && !standalone && !hintClosed ? html`<section class="card hint-card">
      <button class="icon-btn close" data-act="close-hint" aria-label="Hinweis schließen">${icon('close')}</button>
      <h2>Als App installieren</h2>
      <p class="small">In Safari unten auf <strong>Teilen</strong> tippen, dann <strong>Zum Home-Bildschirm</strong>. Dann läuft Happy Japanese offline und kann dir Erinnerungen schicken.</p>
    </section>` : ''}

    <section class="shortcuts">
      <h2>Direkt üben</h2>
      <div class="chips">${['vocab', 'particles', 'verbs', 'counters', 'numbers', 'clock', 'phrases', 'kanji'].map((id) => html`<a class="chip" href="#/bereich/${id}">${icon(areaById[id].icon)}${areaById[id].title}</a>`)}</div>
    </section>`.text;

  main.addEventListener('click', (event) => {
    const act = event.target.closest('[data-act]')?.dataset.act;
    const weakTag = event.target.closest('[data-weak]')?.dataset.weak;
    if (weakTag) {
      const sources = areasForTag(weakTag).map((id) => ({ area: areaById[id], saved: app.areaSaved(id) }));
      app.startPractice({ sources, focus: 'weak', weakTags: [weakTag], title: tagLabel(weakTag) });
      return;
    }
    switch (act) {
      case 'mix': app.startPractice({ sources, title: 'Tagesmix' }); break;
      case 'review': app.startPractice({ sources, focus: 'review', title: 'Wiederholen' }); break;
      case 'weak': app.startPractice({ sources, focus: 'weak', weakTags: weak.map((w) => w.tag), title: 'Schwächen üben' }); break;
      case 'new': app.startPractice({
        sources: [{ area: areaById.vocab, saved: { ...app.areaSaved('vocab'), lessons: 'current' } }], focus: 'new', title: `Neue Wörter Lektion ${settings.lesson}`, explicit: true,
      }); break;
      case 'lesson-up': app.saveSettings({ lesson: Math.min(25, settings.lesson + 1) }); app.go('#/'); break;
      case 'lesson-down': app.saveSettings({ lesson: Math.max(1, settings.lesson - 1) }); app.go('#/'); break;
      case 'close-hint':
        try { localStorage.setItem(HINT_KEY, '1'); } catch { /* ignore */ }
        event.target.closest('.hint-card').remove();
        break;
      default:
    }
  });
}
