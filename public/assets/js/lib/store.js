/*
 * The learner's progress on this device: item states, every attempt and the
 * settings, kept in IndexedDB (one database per user) so the app works
 * offline. sync() exchanges the changes with the server.
 */
import { review } from './srs.js';

const DB_VERSION = 1;

const promised = (request) => new Promise((resolve, reject) => {
  request.onsuccess = () => resolve(request.result);
  request.onerror = () => reject(request.error);
});

function openDb(name) {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(name, DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      db.createObjectStore('states', { keyPath: 'item' });
      db.createObjectStore('attempts', { keyPath: 'uid' });
      db.createObjectStore('meta');
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
    request.onblocked = () => reject(new Error('database blocked'));
  });
}

const uid = () => (crypto.randomUUID ? crypto.randomUUID() : `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 12)}`);

export class Store {
  /** @type {Map<string, {item: string, s: object, u: number, d: number}>} */
  records = new Map();
  /** sorted by time */
  attempts = [];
  uids = new Set();
  settings = { data: {}, u: 0, d: 0 };
  cursor = 0;
  db = null;
  listeners = new Set();
  syncing = null;

  static async open(userId) {
    const store = new Store();
    try {
      store.db = await openDb(`happyjapanese-${userId}`);
      const tx = store.db.transaction(['states', 'attempts', 'meta']);
      const [states, attempts, settings, cursor] = await Promise.all([
        promised(tx.objectStore('states').getAll()),
        promised(tx.objectStore('attempts').getAll()),
        promised(tx.objectStore('meta').get('settings')),
        promised(tx.objectStore('meta').get('cursor')),
      ]);
      for (const record of states) store.records.set(record.item, record);
      store.attempts = attempts.sort((a, b) => a.at - b.at);
      for (const a of attempts) store.uids.add(a.uid);
      if (settings) store.settings = settings;
      store.cursor = cursor ?? 0;
    } catch (err) {
      console.warn('IndexedDB unavailable, progress stays in memory', err);
      store.db = null;
    }
    return store;
  }

  get persistent() { return this.db !== null; }

  onChange(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  emit(what) { for (const listener of this.listeners) listener(what); }

  put(storeName, value, key) {
    if (!this.db) return;
    try {
      const tx = this.db.transaction(storeName, 'readwrite');
      tx.objectStore(storeName).put(value, key);
    } catch (err) {
      console.warn('Could not save', err);
    }
  }

  state(item) { return this.records.get(item)?.s; }

  statesCache = null;

  /** Map item → state, for the scheduler and the statistics (rebuilt after changes). */
  get states() {
    if (!this.statesCache) {
      this.statesCache = new Map();
      for (const [item, record] of this.records) this.statesCache.set(item, record.s);
    }
    return this.statesCache;
  }

  /** Saves one answer and moves the item's schedule. */
  record({ item, ok, ms, q, kind, tags }) {
    const now = Date.now();
    const before = this.state(item);
    const state = review(before, q, ms, now);
    // prev lets "Als richtig werten" redo this answer.
    const record = { item, s: state, u: now, d: 1, prev: before ?? null };
    this.records.set(item, record);
    this.statesCache = null;
    const attempt = { uid: uid(), item, ok: ok ? 1 : 0, ms: Math.round(ms), at: now, kind, tags, q, sy: 0 };
    this.attempts.push(attempt);
    this.uids.add(attempt.uid);
    this.put('states', record);
    this.put('attempts', attempt);
    return state;
  }

  /** "Als richtig werten": the last answer to this item counts as correct after all. */
  replaceLast(item, result) {
    const index = this.attempts.findLastIndex((a) => a.item === item);
    if (index < 0) return null;
    const previous = this.attempts[index];
    previous.ok = 1;
    previous.q = result.q;
    previous.sy = 0;
    this.put('attempts', previous);
    const before = this.records.get(item)?.prev ?? undefined;
    const state = review(before, result.q, previous.ms, previous.at);
    const record = { item, s: state, u: Date.now(), d: 1, prev: before ?? null };
    this.records.set(item, record);
    this.statesCache = null;
    this.put('states', record);
    return state;
  }

  setSettings(data) {
    this.settings = { data: { ...data }, u: Date.now(), d: 1 };
    this.put('meta', this.settings, 'settings');
    this.emit('settings');
  }

  pendingCount() {
    let n = 0;
    for (const r of this.records.values()) if (r.d) n++;
    for (const a of this.attempts) if (!a.sy) n++;
    return n + (this.settings.d ? 1 : 0);
  }

  /**
   * Sends local changes and takes the server's. post(route, body) returns
   * the server's JSON or throws. Runs once at a time.
   */
  sync(post) {
    if (this.syncing) return this.syncing;
    this.syncing = (async () => {
      let changed = false;
      for (let round = 0; round < 25; round++) {
        const states = [];
        for (const r of this.records.values()) {
          if (r.d) states.push(r);
          if (states.length >= 300) break;
        }
        const attempts = this.attempts.filter((a) => !a.sy).slice(0, 600);
        const settings = this.settings.d ? { data: this.settings.data, updated_at: this.settings.u } : null;

        const response = await post('sync', {
          cursor: this.cursor,
          states: states.map((r) => ({ item: r.item, data: r.s, updated_at: r.u })),
          attempts: attempts.map(({ uid: id, item, ok, ms, at, kind, tags, q }) => ({ uid: id, item, ok, ms, at, kind, q, tags: (tags ?? []).join(' ') })),
          settings,
        });

        const sentAt = new Map(states.map((r) => [r.item, r.u]));
        for (const [item, u] of sentAt) {
          const current = this.records.get(item);
          if (current && current.u === u) {
            current.d = 0;
            this.put('states', current);
          }
        }
        for (const a of attempts) {
          a.sy = 1;
          this.put('attempts', a);
        }
        if (settings && this.settings.u === settings.updated_at) {
          this.settings.d = 0;
          this.put('meta', this.settings, 'settings');
        }

        for (const incoming of response.states ?? []) {
          const local = this.records.get(incoming.item);
          if (!local || incoming.updated_at > local.u) {
            const record = { item: incoming.item, s: incoming.data, u: incoming.updated_at, d: 0 };
            this.records.set(incoming.item, record);
            this.statesCache = null;
            this.put('states', record);
            changed = true;
          }
        }
        let added = false;
        for (const incoming of response.attempts ?? []) {
          if (this.uids.has(incoming.uid)) continue;
          const attempt = { ...incoming, tags: incoming.tags ? incoming.tags.split(' ') : [], sy: 1 };
          this.attempts.push(attempt);
          this.uids.add(attempt.uid);
          this.put('attempts', attempt);
          added = true;
        }
        if (added) {
          this.attempts.sort((a, b) => a.at - b.at);
          changed = true;
        }
        if (response.settings && response.settings.updated_at > this.settings.u) {
          this.settings = { data: response.settings.data, u: response.settings.updated_at, d: 0 };
          this.put('meta', this.settings, 'settings');
          this.emit('settings');
        }
        this.cursor = response.cursor ?? this.cursor;
        this.put('meta', this.cursor, 'cursor');

        const stillDirty = states.length >= 300 || attempts.length >= 600;
        if (!response.more && !stillDirty) break;
      }
      if (changed) this.emit('progress');
      return changed;
    })().finally(() => {
      this.syncing = null;
    });
    return this.syncing;
  }

  /** Removes this user's data from the device (sign-out). */
  async destroy() {
    const name = this.db?.name;
    this.db?.close();
    this.db = null;
    if (name) await promised(indexedDB.deleteDatabase(name)).catch(() => {});
  }
}
