// Every area must produce well-formed tasks for every option value.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { AREAS, areaOptions, tagLabel } from '../../public/assets/js/areas/index.js';
import { normalizeAnswer } from '../../public/assets/js/lib/kana.js';

const KINDS = new Set(['flash', 'choice', 'input', 'tiles', 'palette']);
const strip = (htmlText) => String(htmlText).replace(/<rt>.*?<\/rt>/g, '').replace(/<[^>]+>/g, '').trim();

function seeded(seed) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296;
  };
}

function checkTask(area, item, task) {
  const where = `${area.id} ${item.id}`;
  assert.ok(KINDS.has(task.kind), `${where}: kind ${task.kind}`);
  assert.equal(typeof (task.prompt ?? ''), 'string', `${where}: prompt`);
  assert.ok((task.prompt ?? '') !== '' || task.visual || task.label || task.kind === 'palette', `${where}: something to show`);
  if (task.kind === 'flash') assert.ok(task.back, `${where}: back side`);
  if (task.kind === 'choice') {
    assert.ok(task.options.length >= 2, `${where}: options`);
    assert.equal(task.options.filter((o) => o.correct).length, 1, `${where}: exactly one right option`);
    const texts = task.options.map((o) => strip(o.html));
    assert.equal(new Set(texts).size, texts.length, `${where}: options repeat: ${texts.join(' | ')}`);
  }
  if (task.kind === 'input') {
    assert.ok(task.accept.length > 0, `${where}: accepted answers`);
    assert.ok(task.answerHtml, `${where}: answer shown`);
    if (!task.numeric) for (const a of task.accept) assert.equal(a, normalizeAnswer(a), `${where}: accept is normalised (${a})`);
  }
  if (task.kind === 'tiles') {
    const keys = new Set(task.tiles.map((t) => t.key));
    for (const solution of task.solutions) {
      for (const k of solution) assert.ok((Array.isArray(k) ? k : [k]).some((x) => keys.has(x)), `${where}: solution tile ${k} missing`);
    }
  }
  if (task.kind === 'palette') {
    assert.equal(task.parts.length, task.answers.length + 1, `${where}: parts and gaps`);
    for (const answers of task.answers) assert.ok(answers.some((a) => task.palette.includes(a)), `${where}: answer in palette`);
  }
  for (const tag of task.tags ?? []) assert.ok(tagLabel(tag), `${where}: tag ${tag}`);
}

for (const area of AREAS) {
  test(`area ${area.id}`, () => {
    const settings = { lesson: 25 };
    const variants = [{}];
    for (const option of area.options ?? []) for (const value of Object.keys(option.choices)) variants.push({ [option.key]: value });
    const rng = seeded(7);
    let tasks = 0;
    for (const saved of variants) {
      const opts = areaOptions(area, saved);
      const items = area.items({ settings, opts, rng });
      const ids = new Set(items.map((i) => i.id));
      assert.equal(ids.size, items.length, `${area.id} ${JSON.stringify(saved)}: item ids are unique`);
      const step = Math.max(1, Math.floor(items.length / 60));
      for (let i = 0; i < items.length; i += step) {
        for (let round = 0; round < 2; round++) {
          checkTask(area, items[i], area.task(items[i], { settings, opts, rng }));
          tasks++;
        }
      }
    }
    assert.ok(tasks > 0, `${area.id}: no tasks at lesson 25`);
  });
}

test('every tag of every item has a readable label', () => {
  const unlabeled = new Set();
  for (const area of AREAS) {
    for (const item of area.items({ settings: { lesson: 25 }, opts: areaOptions(area), rng: Math.random })) {
      for (const tag of item.tags ?? []) if (tagLabel(tag) === tag) unlabeled.add(tag);
    }
  }
  assert.deepEqual([...unlabeled], []);
});
