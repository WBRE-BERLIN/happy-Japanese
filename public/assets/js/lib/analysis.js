/*
 * What the learner finds hard: every attempt carries tags (the lesson, the
 * particle, the verb form, the sound change …). Tags with many mistakes or
 * slow answers are the weak spots.
 */
import { difficulty, isLeech, level } from './srs.js';

const DAY = 86_400_000;

export const dayKey = (time) => {
  const d = new Date(time);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

/**
 * Weak spots: tags whose recent attempts went badly. Accuracy is smoothed
 * (one right and one wrong answer are assumed up front), so a single slip
 * does not make a tag look weak.
 */
export function weakSpots(attempts, { now = Date.now(), days = 45, min = 4, limit = 8, expected = {} } = {}) {
  const since = now - days * DAY;
  const byTag = new Map();
  for (let i = attempts.length - 1; i >= 0; i--) {
    const a = attempts[i];
    if (a.at < since) break;
    for (const tag of a.tags ?? []) {
      if (tag.startsWith('area:')) continue;
      let entry = byTag.get(tag);
      if (!entry) byTag.set(tag, entry = { tag, n: 0, ok: 0, slow: 0 });
      if (entry.n >= 30) continue; // only the last 30 attempts count
      entry.n += 1;
      if (a.ok) entry.ok += 1;
      if (a.ok && expected[a.kind] && a.ms > expected[a.kind] * 2) entry.slow += 1;
    }
  }
  return [...byTag.values()]
    .filter((e) => e.n >= min)
    .map((e) => {
      const acc = (e.ok + 1) / (e.n + 2);
      const slowShare = e.slow / e.n;
      const score = ((1 - acc) + slowShare * 0.3) * Math.log2(e.n + 1);
      return { ...e, acc: e.ok / e.n, score, slowShare };
    })
    .filter((e) => e.acc < 0.8 || e.slowShare > 0.4)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}

/** Answers per day for the last `days` days (oldest first). */
export function dailyCounts(attempts, { now = Date.now(), days = 14 } = {}) {
  const result = [];
  const index = new Map();
  for (let i = days - 1; i >= 0; i--) {
    const key = dayKey(now - i * DAY);
    index.set(key, result.length);
    result.push({ day: key, n: 0, ok: 0 });
  }
  for (const a of attempts) {
    const slot = index.get(dayKey(a.at));
    if (slot === undefined) continue;
    result[slot].n += 1;
    if (a.ok) result[slot].ok += 1;
  }
  return result;
}

/** Days in a row with practice, counting today or (if nothing yet today) up to yesterday. */
export function streak(attempts, now = Date.now()) {
  const days = new Set(attempts.map((a) => dayKey(a.at)));
  let count = 0;
  let cursor = days.has(dayKey(now)) ? now : now - DAY;
  while (days.has(dayKey(cursor))) {
    count += 1;
    cursor -= DAY;
  }
  return count;
}

export const todayCount = (attempts, now = Date.now()) => {
  const key = dayKey(now);
  let n = 0;
  for (let i = attempts.length - 1; i >= 0 && dayKey(attempts[i].at) === key; i--) n++;
  return n;
};

/** Items first seen today (for the daily limit of new items). */
export function newToday(states, now = Date.now()) {
  const start = new Date(now);
  start.setHours(0, 0, 0, 0);
  let n = 0;
  for (const s of states.values()) if (s.first >= start.getTime()) n++;
  return n;
}

/** Level distribution of a list of item ids: [neu, lernt, vertraut, sicher, gemeistert]. */
export function levels(itemIds, states) {
  const counts = [0, 0, 0, 0, 0];
  for (const id of itemIds) counts[level(states.get(id))] += 1;
  return counts;
}

/** Items that keep failing, hardest first. */
export function leeches(states, limit = 20) {
  return [...states.entries()]
    .filter(([, s]) => isLeech(s))
    .sort(([, a], [, b]) => difficulty(b) - difficulty(a))
    .slice(0, limit)
    .map(([item, s]) => ({ item, state: s }));
}

export function accuracy(attempts, { now = Date.now(), days = 7 } = {}) {
  const since = now - days * DAY;
  let n = 0;
  let ok = 0;
  for (const a of attempts) {
    if (a.at < since) continue;
    n++;
    if (a.ok) ok++;
  }
  return n ? ok / n : null;
}
