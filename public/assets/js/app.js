/*
 * Happy Japanese: a single-page app without a build step. Views render
 * escaped template strings into a fresh <main>; events are delegated.
 */
import { api, post, ApiError } from './lib/api.js';
import { Store } from './lib/store.js';
import { prefs, toast, closeSheet } from './lib/ui.js';
import { AREAS, DEFAULT_MIX, areaById } from './areas/index.js';
import { planSession, Session } from './session.js';
import { newToday } from './lib/analysis.js';
import { renderAuth } from './views/auth.js';
import { renderHome } from './views/home.js';
import { renderAreas, renderArea } from './views/areas.js';
import { renderPractice } from './views/practice.js';
import { renderStats } from './views/stats.js';
import { renderLists, renderList } from './views/lists.js';
import { renderSettings } from './views/settings.js';

export const DEFAULT_SETTINGS = {
  lesson: 1,
  mix: DEFAULT_MIX,
  areaOpts: {},
  size: 20,
  newPerDay: 15,
  goal: 30,
  furigana: true,
  romaji: true,
  autoSpeak: false,
  autoNext: true,
  theme: 'auto',
};

const SESSION_KEY = 'happyjapanese.session';
const THEME_KEY = 'happyjapanese.theme';

const readLocal = (key) => {
  try { return JSON.parse(localStorage.getItem(key)); } catch { return null; }
};
const writeLocal = (key, value) => {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* private mode */ }
};

export const app = {
  root: document.getElementById('app'),
  auth: null,
  user: null,
  store: null,
  settings: { ...DEFAULT_SETTINGS },
  practice: null,
  offline: false,
  syncState: 'idle',

  go(hash) {
    if (location.hash === hash) router();
    else location.hash = hash;
  },

  saveSettings(patch) {
    this.settings = { ...this.settings, ...patch };
    this.store?.setSettings(this.settings);
    applySettings(this.settings);
    this.scheduleSync();
  },

  areaSaved(areaId) { return this.settings.areaOpts?.[areaId] ?? {}; },

  saveAreaOptions(areaId, opts) {
    this.saveSettings({ areaOpts: { ...this.settings.areaOpts, [areaId]: opts } });
  },

  mixSources() {
    const ids = (this.settings.mix ?? DEFAULT_MIX).filter((id) => areaById[id]);
    return ids.map((id) => ({ area: areaById[id], saved: this.areaSaved(id) }));
  },

  /** Starts a session and opens the practice view. Returns false when there is nothing to practise. */
  startPractice({ sources, focus = 'mix', title, size, weakTags = [], explicit = false, ignoreLesson = false, items: given = null }) {
    const items = given ?? planSession({
      sources,
      settings: this.settings,
      states: this.store.states,
      size: size ?? this.settings.size,
      focus,
      newLeft: Math.max(0, this.settings.newPerDay - newToday(this.store.states)),
      weakTags,
      explicit,
      ignoreLesson,
    });
    if (!items.length) {
      toast('Gerade gibt es hier nichts zu üben.', { kind: 'info' });
      return false;
    }
    this.practice = new Session(items, { store: this.store, settings: this.settings, title, onRecord: () => this.scheduleSync(8000) });
    this.go('#/ueben');
    return true;
  },

  syncTimer: null,
  scheduleSync(delay = 3000) {
    clearTimeout(this.syncTimer);
    this.syncTimer = setTimeout(() => this.sync({ quiet: true }), delay);
  },

  async sync({ quiet = false } = {}) {
    if (!this.store || !this.user) return;
    this.syncState = 'syncing';
    updateSyncBadge();
    try {
      const changed = await this.store.sync(post);
      this.offline = false;
      this.syncState = 'ok';
      if (changed && !this.practice) refreshIfIdle();
      if (!quiet) toast('Fortschritt synchronisiert.', { kind: 'ok' });
    } catch (err) {
      this.syncState = err instanceof ApiError ? 'error' : 'offline';
      if (err instanceof ApiError && err.status === 401) {
        this.auth = { authenticated: false };
        renderSignedOut();
        return;
      }
      if (err instanceof ApiError === false) this.offline = true;
      if (!quiet) toast(err.message, { kind: 'error' });
    }
    updateSyncBadge();
  },

  async signedIn(session) {
    this.auth = session;
    this.user = session.user;
    writeLocal(SESSION_KEY, { user: session.user, vapid_public_key: session.vapid_public_key, registration: session.registration });
    this.store = await Store.open(this.user.id);
    this.settings = { ...DEFAULT_SETTINGS, ...(this.store.settings.data ?? {}) };
    if (!this.store.persistent) toast('Dieser Browser speichert offline nichts. Dein Fortschritt wird direkt synchronisiert.', { kind: 'info', timeout: 6000 });
    this.store.onChange((what) => {
      if (what === 'settings') {
        this.settings = { ...DEFAULT_SETTINGS, ...this.store.settings.data };
        applySettings(this.settings);
      }
    });
    applySettings(this.settings);
    document.getElementById('tabbar').hidden = false;
    router();
    this.sync({ quiet: true });
  },

  async logout() {
    try { await this.store?.sync(post); } catch { /* offline: unsynced changes are lost, the confirmation said so */ }
    try { await post('logout'); } catch { /* offline: the cookie stays, the local data goes */ }
    await this.store?.destroy();
    this.store = null;
    this.user = null;
    this.practice = null;
    writeLocal(SESSION_KEY, null);
    this.auth = { authenticated: false, registration: this.auth?.registration };
    renderSignedOut();
  },
};

function applySettings(settings) {
  prefs.furigana = settings.furigana !== false;
  const theme = settings.theme ?? 'auto';
  document.documentElement.dataset.theme = theme;
  document.documentElement.classList.toggle('no-furigana', settings.furigana === false);
  writeLocal(THEME_KEY, theme);
  const dark = theme === 'dark' || (theme === 'auto' && matchMedia('(prefers-color-scheme: dark)').matches);
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', dark ? '#16181f' : '#f7f2ea');
}

function updateSyncBadge() {
  const badge = document.getElementById('sync-badge');
  if (!badge) return;
  const pending = app.store?.pendingCount() ?? 0;
  badge.dataset.state = app.syncState;
  badge.textContent = { syncing: 'Sync …', ok: `${pending} offen`, offline: 'Offline', error: 'Sync-Fehler', idle: '' }[app.syncState];
  badge.title = { syncing: 'Synchronisiere …', ok: 'Wird gleich synchronisiert', offline: 'Offline – dein Fortschritt wird später synchronisiert', error: 'Synchronisieren fehlgeschlagen', idle: '' }[app.syncState];
  badge.hidden = app.syncState === 'idle' || (app.syncState === 'ok' && pending === 0);
}

let currentView = '';
function refreshIfIdle() {
  if (['home', 'stats', 'areas', 'area'].includes(currentView)) router();
}

const ROUTES = [
  [/^#?\/?$/, 'home', () => renderHome],
  [/^#\/bereiche$/, 'areas', () => renderAreas],
  [/^#\/bereich\/([a-z]+)$/, 'area', () => renderArea],
  [/^#\/ueben$/, 'practice', () => renderPractice],
  [/^#\/fortschritt$/, 'stats', () => renderStats],
  [/^#\/listen$/, 'lists', () => renderLists],
  [/^#\/liste\/([a-z-]+)$/, 'list', () => renderList],
  [/^#\/einstellungen$/, 'settings', () => renderSettings],
];

export function router() {
  closeSheet();
  if (!app.user) return renderSignedOut();
  const hash = location.hash || '#/';
  for (const [pattern, name, view] of ROUTES) {
    const match = pattern.exec(hash);
    if (!match) continue;
    if (name === 'practice' && !app.practice) {
      location.replace('#/');
      return;
    }
    if (currentView === 'practice' && name !== 'practice' && app.practice) app.practice = null;
    currentView = name;
    const main = document.createElement('main');
    main.className = `view view-${name}`;
    app.root.replaceChildren(main);
    document.getElementById('tabbar').hidden = name === 'practice';
    document.querySelectorAll('#tabbar a').forEach((a) => a.classList.toggle('active', a.dataset.tab === tabOf(name)));
    window.scrollTo(0, 0);
    view()(app, main, match.slice(1));
    updateSyncBadge();
    return;
  }
  location.replace('#/');
}

const tabOf = (view) => ({ home: 'home', areas: 'areas', area: 'areas', stats: 'stats', lists: 'lists', list: 'lists', settings: 'settings' }[view]);

function renderSignedOut() {
  currentView = 'auth';
  document.getElementById('tabbar').hidden = true;
  const main = document.createElement('main');
  main.className = 'view view-auth';
  app.root.replaceChildren(main);
  renderAuth(app, main);
}

async function boot() {
  const theme = readLocal(THEME_KEY);
  if (theme) document.documentElement.dataset.theme = theme;

  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js').catch((err) => console.warn('Service worker', err));
    // Reload when an update takes over; the very first install needs no reload.
    const hadController = Boolean(navigator.serviceWorker.controller);
    let reloading = false;
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      if (reloading || !hadController) return;
      if (app.practice) {
        toast('Eine neue Version ist da – sie lädt nach dieser Übung.', { kind: 'info' });
        return;
      }
      reloading = true;
      location.reload();
    });
  }

  window.addEventListener('hashchange', router);
  window.addEventListener('online', () => app.sync({ quiet: true }));
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') app.sync({ quiet: true });
  });
  matchMedia('(prefers-color-scheme: dark)').addEventListener?.('change', () => applySettings(app.settings));

  let session;
  try {
    session = await api('session', { timeout: 6000 });
  } catch (err) {
    const cached = readLocal(SESSION_KEY);
    if (cached?.user) {
      app.offline = true;
      app.syncState = 'offline';
      await app.signedIn({ authenticated: true, ...cached });
      return;
    }
    session = { authenticated: false, offline: true };
  }
  if (session.authenticated) await app.signedIn(session);
  else {
    app.auth = session;
    renderSignedOut();
  }
}

boot();

export { AREAS };
