import { test } from 'node:test';
import assert from 'node:assert/strict';
import { grade, review, level, isLeech, expectedTimes, BASE_MS } from '../../public/assets/js/lib/srs.js';
import { weakSpots, streak, dailyCounts } from '../../public/assets/js/lib/analysis.js';
import { planSession } from '../../public/assets/js/session.js';
import { areaById } from '../../public/assets/js/areas/index.js';
import { normalizeAnswer, romajiToKana } from '../../public/assets/js/lib/kana.js';
import { autoFuri } from '../../public/assets/js/lib/furi.js';

const DAY = 86_400_000;
const now = Date.UTC(2026, 9, 18, 10);

test('grades from correctness and time', () => {
  assert.equal(grade(false, 1000, 5000), 0);
  assert.equal(grade(true, 12000, 5000), 3);
  assert.equal(grade(true, 2000, 5000), 5);
  assert.equal(grade(true, 5000, 5000), 4);
});

test('intervals grow with good answers and reset on mistakes', () => {
  let s = review(undefined, 4, 3000, now, () => 0.5);
  assert.equal(s.ivl, 1);
  s = review(s, 4, 3000, now + DAY, () => 0.5);
  assert.equal(s.ivl, 4);
  s = review(s, 4, 3000, now + 5 * DAY, () => 0.5);
  assert.equal(s.ivl, 10);
  assert.equal(level(s), 3);
  s = review(s, 0, 9000, now + 15 * DAY, () => 0.5);
  assert.equal(s.ivl, 0);
  assert.equal(s.lapses, 1);
  assert.equal(s.due, now + 15 * DAY + 10 * 60_000);
  assert.ok(s.ease < 2.5);
  // Known at first sight and fast: four days.
  assert.equal(review(undefined, 5, 1000, now).ivl, 4);
  // Slow on first sight: back the same day.
  assert.equal(review(undefined, 3, 1000, now).ivl, 0.5);
});

test('leeches and expected times', () => {
  let s;
  for (let i = 0; i < 4; i++) s = review(review(s, 4, 3000, now), 0, 3000, now);
  assert.ok(isLeech(s));
  const attempts = Array.from({ length: 20 }, (_, i) => ({ kind: 'choice', ok: 1, ms: 3000 + i, at: now }));
  assert.ok(expectedTimes(attempts).choice < BASE_MS.choice);
});

test('weak spots find the tag with many mistakes', () => {
  const attempts = [];
  for (let i = 0; i < 20; i++) attempts.push({ at: now - i * 1000, ok: i % 3 === 0 ? 1 : 0, ms: 4000, kind: 'palette', tags: ['area:particles', 'part:に', 'L4'] });
  for (let i = 0; i < 20; i++) attempts.push({ at: now - i * 1000, ok: 1, ms: 4000, kind: 'palette', tags: ['area:particles', 'part:は', 'L4'] });
  attempts.sort((a, b) => a.at - b.at);
  const weak = weakSpots(attempts, { now });
  assert.equal(weak[0].tag, 'part:に');
  assert.ok(!weak.some((w) => w.tag === 'part:は'));
});

test('streak and daily counts', () => {
  const attempts = [0, 1, 2, 4].map((d) => ({ at: now - d * DAY, ok: 1 }));
  assert.equal(streak(attempts, now), 3);
  assert.equal(dailyCounts(attempts, { now, days: 7 }).filter((d) => d.n).length, 4);
});

test('sessions put due items first and respect the new-item limit', () => {
  const area = areaById.vocab;
  const settings = { lesson: 3 };
  const states = new Map();
  const items = area.items({ settings, opts: { dir: 'jd', lessons: '' } });
  states.set(items[5].id, { seen: 2, due: now - 1000, ivl: 1, reps: 1, hist: '44', bad: 0, lapses: 0 });
  states.set(items[6].id, { seen: 2, due: now + DAY, ivl: 3, reps: 2, hist: '44', bad: 0, lapses: 0 });
  const plan = planSession({ sources: [{ area, saved: { dir: 'jd' } }], settings, states, size: 10, newLeft: 4, now });
  assert.ok(plan.some((i) => i.id === items[5].id), 'due item included');
  assert.equal(plan.filter((i) => !states.has(i.id)).length, 4, 'four new items');
  const review = planSession({ sources: [{ area, saved: { dir: 'jd' } }], settings, states, size: 10, focus: 'review', now });
  assert.equal(review[0].id, items[5].id);
});

test('romaji and answers', () => {
  assert.equal(romajiToKana('tabemasu'), 'たべます');
  assert.equal(romajiToKana('kitte'), 'きって');
  assert.equal(romajiToKana('ninjin'), 'にんじん');
  assert.equal(romajiToKana('tabe', { final: false }), 'たべ');
  assert.equal(romajiToKana('tabem', { final: false }), 'たべm');
  assert.equal(normalizeAnswer(' タベマス。'), 'たべます');
  assert.equal(normalizeAnswer('ＴＡＢＥＭＡＳＵ'), 'たべます');
  assert.equal(autoFuri('お母さん', 'おかあさん'), 'お{母|かあ}さん');
  assert.equal(autoFuri('思い出します', 'おもいだします'), '{思|おも}い{出|だ}します');
});

test('both directions of a word are never in the same session', () => {
  const area = areaById.vocab;
  const plan = planSession({ sources: [{ area, saved: { dir: 'mix' } }], settings: { lesson: 2 }, states: new Map(), size: 30, focus: 'new', now });
  const groups = plan.map((i) => i.group);
  assert.equal(plan.length, 30);
  assert.equal(new Set(groups).size, groups.length);
});

test('new items come in random order within a lesson', () => {
  const area = areaById.dates;
  const orders = new Set();
  for (let i = 0; i < 8; i++) {
    const plan = planSession({ sources: [{ area, saved: { mode: 'week' } }], settings: { lesson: 25 }, states: new Map(), size: 7, focus: 'new', now });
    assert.equal(plan.length, 7);
    orders.add(plan.map((item) => item.id).join());
  }
  assert.ok(orders.size > 1, 'weekdays are not always in the same order');
});

test('a counter session mixes counters instead of counting floors 1, 2, 3 …', () => {
  const area = areaById.counters;
  const plan = planSession({ sources: [{ area, saved: { mode: 'count' } }], settings: { lesson: 25 }, states: new Map(), size: 10, focus: 'new', now });
  assert.equal(new Set(plan.map((i) => i.group)).size, 10, 'ten different counters');
});
