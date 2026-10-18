/*
 * Builds a practice session from one or more areas and runs it: due items
 * first, then new ones (limited per day), then the hardest of the rest.
 * Wrong answers come back once later in the same session.
 */
import { areaOptions } from './areas/index.js';
import { difficulty, expectedTimes, grade, isDue } from './lib/srs.js';
import { shuffle } from './areas/common.js';

/** Every item of an area for the learner's settings, with the area attached. */
export function areaItems(area, settings, saved, { ignoreLesson = false } = {}) {
  const ctx = { settings: ignoreLesson ? { ...settings, lesson: 25 } : settings, opts: areaOptions(area, saved), rng: Math.random };
  return area.items(ctx).map((item) => ({ ...item, area, opts: ctx.opts, ignoreLesson }));
}

function roundRobin(lists) {
  const out = [];
  const queues = lists.map((list) => [...list]);
  while (queues.some((q) => q.length)) {
    for (const q of queues) if (q.length) out.push(q.shift());
  }
  return out;
}

/**
 * @param sources  [{ area, saved }] areas with the learner's options
 * @param focus    'mix' | 'review' | 'weak' | 'new'
 * @param weakTags tags to prefer for 'weak'
 */
export function planSession({ sources, settings, states, size = 20, focus = 'mix', newLeft = 15, weakTags = [], explicit = false, ignoreLesson = false, now = Date.now() }) {
  const perSource = sources.map(({ area, saved }) => areaItems(area, settings, saved, { ignoreLesson }));
  const all = perSource.flat();
  const stateOf = (item) => states.get(item.id);

  const due = all.filter((item) => isDue(stateOf(item), now))
    .sort((a, b) => (difficulty(stateOf(b)) - difficulty(stateOf(a))) || ((stateOf(a).due ?? 0) - (stateOf(b).due ?? 0)));
  // New items: lesson by lesson, but in random order within a lesson (sort is stable).
  const fresh = roundRobin(perSource.map((items) => shuffle(items.filter((item) => !stateOf(item)))
    .sort((a, b) => (a.lesson ?? 0) - (b.lesson ?? 0))));
  const seen = all.filter((item) => stateOf(item) && !isDue(stateOf(item), now))
    .sort((a, b) => (difficulty(stateOf(b)) - difficulty(stateOf(a))) || ((stateOf(a).last ?? 0) - (stateOf(b).last ?? 0)));

  // Each step: candidates, how many of them at most.
  const steps = [];
  if (focus === 'weak') {
    const tagSet = new Set(weakTags);
    const tagged = all.filter((item) => item.tags?.some((t) => tagSet.has(t)) && stateOf(item));
    steps.push([shuffle(tagged).sort((a, b) => difficulty(stateOf(b)) - difficulty(stateOf(a))), size]);
    steps.push([[...due, ...seen].filter((item) => difficulty(stateOf(item)) > 0.3), size]);
    steps.push([shuffle(all.filter((item) => item.tags?.some((t) => tagSet.has(t)))), size]);
    steps.push([due, size]);
  } else if (focus === 'new') {
    steps.push([fresh, size]);
  } else if (focus === 'review') {
    steps.push([due, size], [seen, size]);
  } else {
    steps.push([due, size]);
    steps.push([fresh, Math.min(newLeft, Math.ceil(size * 0.6))]);
    steps.push([seen.filter((item) => difficulty(stateOf(item)) > 0.25), size]);
    // Practising one area on purpose: keep going with new items past the daily limit.
    if (explicit) steps.push([fresh, size]);
    // Otherwise fill up with items reviewed ahead of time, never with more new ones.
    steps.push([seen, size]);
  }

  // Related items (the same word in both directions, the same counter …) go into
  // one session only once; a second pass allows them when the session is short.
  const chosen = [];
  const taken = new Set();
  const groups = new Set();
  const left = steps.map(([, limit]) => limit);
  for (const strict of [true, false]) {
    steps.forEach(([items], step) => {
      for (const item of items) {
        if (chosen.length >= size || left[step] <= 0) break;
        if (taken.has(item.id) || (strict && groups.has(groupOf(item)))) continue;
        taken.add(item.id);
        groups.add(groupOf(item));
        chosen.push(item);
        left[step]--;
      }
    });
  }

  // Mix the order but keep new items apart, so there is never a long run of unknown cards.
  const known = shuffle(chosen.filter((item) => stateOf(item)));
  const unknown = chosen.filter((item) => !stateOf(item));
  const ordered = [];
  const gap = unknown.length ? Math.max(1, Math.floor(known.length / unknown.length)) : 0;
  while (known.length || unknown.length) {
    if (unknown.length) ordered.push(unknown.shift());
    for (let i = 0; i < gap && known.length; i++) ordered.push(known.shift());
    if (!unknown.length) ordered.push(...known.splice(0));
  }
  return spreadGroups(ordered);
}

const groupOf = (item) => item.group ?? item.id;

/** Moves items so that two of the same group never follow each other, where possible. */
export function spreadGroups(list) {
  const out = [...list];
  for (let i = 1; i < out.length; i++) {
    if (groupOf(out[i]) !== groupOf(out[i - 1])) continue;
    const j = out.findIndex((item, k) => k > i && groupOf(item) !== groupOf(out[i - 1]) && (k + 1 >= out.length || groupOf(out[k + 1]) !== groupOf(out[i])));
    if (j > 0) [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

export class Session {
  constructor(items, { store, settings, title, onRecord }) {
    this.queue = [...items];
    this.store = store;
    this.settings = settings;
    this.title = title;
    this.onRecord = onRecord;
    this.total = items.length;
    this.results = [];
    this.retried = new Set();
    this.started = Date.now();
    this.expected = expectedTimes(store.attempts);
    this.current = null;
  }

  get position() { return this.results.length; }
  get remaining() { return this.queue.length; }

  /** The next task, or null at the end. */
  next() {
    const item = this.queue.shift();
    if (!item) {
      this.current = null;
      return null;
    }
    const ctx = { settings: item.ignoreLesson ? { ...this.settings, lesson: 25 } : this.settings, opts: item.opts, rng: Math.random };
    let task;
    try {
      task = item.area.task(item, ctx);
    } catch (err) {
      console.error('Task failed', item.id, err);
      return this.next();
    }
    task.tags = [...new Set([`area:${item.area.id}`, ...(item.tags ?? []), ...(task.tags ?? [])])];
    this.current = { item, task };
    return this.current;
  }

  /** Records the answer to the current task. */
  answer({ ok, ms, hinted = false }) {
    const { item, task } = this.current;
    const expected = this.expected[task.kind] ?? 6000;
    let q = grade(ok, ms, expected);
    if (ok && hinted) q = Math.min(q, 3);
    const state = this.store.record({ item: item.id, ok, ms, q, kind: task.kind, tags: task.tags });
    this.results.push({ item, task, ok, ms, q });
    if (!ok && !this.retried.has(item.id)) {
      this.retried.add(item.id);
      this.queue.splice(Math.min(this.queue.length, 3 + Math.floor(Math.random() * 3)), 0, item);
      this.total += 1;
    }
    this.onRecord?.(state);
    return q;
  }

  /** "Als richtig werten" for the last answer. */
  override() {
    const last = this.results.at(-1);
    if (!last || last.ok) return;
    last.ok = true;
    last.q = 3;
    this.store.replaceLast(last.item.id, { q: 3 });
    // It no longer needs to come back in this session.
    const index = this.queue.findIndex((item) => item.id === last.item.id);
    if (index >= 0) {
      this.queue.splice(index, 1);
      this.total -= 1;
    }
  }

  summary() {
    const answered = this.results.length;
    const correct = this.results.filter((r) => r.ok).length;
    const wrongItems = [...new Map(this.results.filter((r) => !r.ok).map((r) => [r.item.id, r])).values()];
    const time = this.results.reduce((sum, r) => sum + r.ms, 0);
    return { answered, correct, wrongItems, time, duration: Date.now() - this.started };
  }
}
