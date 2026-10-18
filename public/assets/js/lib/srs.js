/*
 * Spaced repetition: every item (a card, a verb form, an hour of the clock …)
 * has a state that says when it is due again. Correct and fast answers push
 * the next review further away, slow answers less, wrong answers bring the
 * item back within minutes.
 */

const MINUTE = 60_000;
const DAY = 86_400_000;

/** Expected answer time per task kind in ms, before the app knows the learner. */
export const BASE_MS = { flash: 4500, choice: 6000, input: 9000, tiles: 12000, palette: 6000 };

/**
 * Turns a result into a grade: 0 wrong, 3 correct but slow, 4 correct,
 * 5 correct and fast. `expected` is the learner's usual time for this kind.
 */
export function grade(ok, ms, expected) {
  if (!ok) return 0;
  if (ms > expected * 2) return 3;
  if (ms < expected * 0.55) return 5;
  return 4;
}

/** The learner's typical time per kind: median of recent correct answers, kept near the base. */
export function expectedTimes(attempts) {
  const result = { ...BASE_MS };
  for (const kind of Object.keys(BASE_MS)) {
    const times = [];
    for (let i = attempts.length - 1; i >= 0 && times.length < 80; i--) {
      const a = attempts[i];
      if (a.kind === kind && a.ok && a.ms > 0) times.push(a.ms);
    }
    if (times.length >= 10) {
      times.sort((a, b) => a - b);
      const median = times[Math.floor(times.length / 2)];
      result[kind] = Math.min(BASE_MS[kind] * 2, Math.max(BASE_MS[kind] * 0.4, median));
    }
  }
  return result;
}

/** The next state of an item after a review. Pure: returns a new object. */
export function review(state, q, ms, now = Date.now(), random = Math.random) {
  const s = { ease: 2.5, ivl: 0, reps: 0, lapses: 0, seen: 0, ok: 0, bad: 0, ms: 0, hist: '', ...state };
  s.seen += 1;
  if (q === 0) {
    s.bad += 1;
    if (s.reps > 0 || s.ivl >= 1) s.lapses += 1;
    s.reps = 0;
    s.ease = Math.max(1.3, s.ease - 0.2);
    s.ivl = 0;
    s.due = now + 10 * MINUTE;
  } else {
    s.ok += 1;
    let ivl;
    if (s.reps === 0) ivl = s.seen === 1 && q === 5 ? 4 : q === 3 ? 0.5 : 1;
    else if (s.reps === 1) ivl = q === 3 ? 2 : q === 4 ? 4 : 6;
    else ivl = s.ivl * (q === 3 ? 1.2 : q === 4 ? s.ease : s.ease * 1.3);
    if (q === 3) s.ease = Math.max(1.3, s.ease - 0.15);
    if (q === 5) s.ease = Math.min(3.2, s.ease + 0.1);
    s.reps += 1;
    s.ivl = Math.min(365, ivl);
    // A little spread, so items learned together do not all come back on the same day.
    const fuzz = s.ivl >= 2 ? 1 + (random() - 0.5) * 0.1 : 1;
    s.due = now + Math.round(s.ivl * fuzz * DAY);
  }
  s.ms = s.ms ? Math.round(s.ms * 0.7 + ms * 0.3) : Math.round(ms);
  s.first ??= now;
  s.last = now;
  s.hist = (s.hist + String(q)).slice(-12);
  return s;
}

/** 0 neu, 1 lernt, 2 vertraut, 3 sicher, 4 gemeistert */
export function level(state) {
  if (!state || !state.seen) return 0;
  if (state.reps === 0 || state.ivl < 1) return 1;
  if (state.ivl < 7) return 2;
  if (state.ivl < 21) return 3;
  return 4;
}

export const LEVELS = ['neu', 'lernt', 'vertraut', 'sicher', 'gemeistert'];

export const isDue = (state, now = Date.now()) => Boolean(state?.seen) && (state.due ?? 0) <= now;

/** How hard an item is for this learner, 0 (easy) … ~2 (very hard). */
export function difficulty(state) {
  if (!state?.seen) return 0;
  const wrongRate = (state.bad + 0.5) / (state.seen + 1);
  const recent = [...(state.hist ?? '')].slice(-5);
  const recentWrong = recent.filter((q) => q === '0').length / Math.max(1, recent.length);
  const slow = recent.filter((q) => q === '3').length / Math.max(1, recent.length);
  return wrongRate + recentWrong * 0.6 + slow * 0.25 + Math.min(state.lapses, 5) * 0.08;
}

/** Items that keep failing ("Problemwörter"). */
export const isLeech = (state) => Boolean(state?.seen) && (state.lapses >= 3 || (state.bad >= 4 && state.bad / state.seen > 0.4));
