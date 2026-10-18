import { test } from 'node:test';
import assert from 'node:assert/strict';
import { numberKana, numberKanji, numberReadings, priceParts, timeParts, minuteReading, dayReading, monthReading, yearParts, counterById, counterDistractors, COUNTERS, COUNT_OBJECTS } from '../../public/assets/js/lib/numbers.js';

test('numbers', () => {
  assert.equal(numberKana(36800), 'さんまんろくせんはっぴゃく');
  assert.equal(numberKana(1000), 'せん');
  assert.equal(numberKana(10000), 'いちまん');
  assert.equal(numberKana(10000000), 'いっせんまん');
  assert.ok(numberReadings(10000000).includes('せんまん'));
  assert.equal(numberKana(300), 'さんびゃく');
  assert.equal(numberKana(3333), 'さんぜんさんびゃくさんじゅうさん');
  assert.equal(numberKana(8888), 'はっせんはっぴゃくはちじゅうはち');
  assert.equal(numberKana(600), 'ろっぴゃく');
  assert.equal(numberKana(110000000), 'いちおくいっせんまん');
  assert.equal(numberKana(1250000), 'ひゃくにじゅうごまん');
  assert.equal(numberKana(14), 'じゅうよん');
  assert.ok(numberReadings(14).includes('じゅうし'));
  assert.equal(numberKanji(36800), '三万六千八百');
  assert.equal(numberKanji(10000), '一万');
  assert.equal(numberKanji(1111), '千百十一');
});

test('prices', () => {
  assert.equal(priceParts(1280).map((p) => p.kana).join(''), 'せんにひゃくはちじゅうえん');
  assert.equal(priceParts(4).map((p) => p.kana).join(''), 'よえん');
  assert.equal(priceParts(104).map((p) => p.kana).join(''), 'ひゃくよえん');
});

test('time', () => {
  assert.equal(timeParts(16, 45).map((p) => p.kana).join(' '), 'ごご よじ よんじゅうごふん');
  assert.equal(timeParts(9, 30).map((p) => p.kana).join(' '), 'ごぜん くじ はん');
  assert.equal(timeParts(7, 0, { ampm: false }).map((p) => p.kana).join(' '), 'しちじ');
  assert.equal(minuteReading(1).kana, 'いっぷん');
  assert.equal(minuteReading(20).kana, 'にじゅっぷん');
  assert.equal(minuteReading(10).kana, 'じゅっぷん');
  assert.equal(minuteReading(18).kana, 'じゅうはっぷん');
  assert.equal(minuteReading(36).kana, 'さんじゅうろっぷん');
  assert.equal(timeParts(0, 5).map((p) => p.kana).join(' '), 'ごぜん じゅうにじ ごふん');
});

test('dates', () => {
  assert.equal(dayReading(1).kana, 'ついたち');
  assert.equal(dayReading(14).kana, 'じゅうよっか');
  assert.equal(dayReading(20).kana, 'はつか');
  assert.equal(monthReading(4).kana, 'しがつ');
  assert.equal(monthReading(9).kana, 'くがつ');
  assert.equal(yearParts(2024).map((p) => p.kana).join(''), 'にせんにじゅうよねん');
  assert.equal(yearParts(2026).map((p) => p.kana).join(''), 'にせんにじゅうろくねん');
});

test('counters', () => {
  assert.equal(counterById.hon.readings[2], 'さんぼん');
  const wrong = counterDistractors(counterById.hiki, 3);
  assert.ok(wrong.includes('さんひき') && wrong.includes('さんぴき'));
  assert.ok(!wrong.includes('さんびき'));
  for (const c of COUNTERS) {
    assert.equal(c.readings.length, 10, c.id);
    for (let n = 1; n <= 10; n++) {
      const d = counterDistractors(c, n);
      assert.ok(!d.includes(c.readings[n - 1]), `${c.id} ${n}`);
      for (const a of c.alt?.[n] ?? []) assert.ok(!d.includes(a), `${c.id} ${n} alt ${a}`);
    }
  }
  for (const [, , , ids] of COUNT_OBJECTS) for (const id of ids) assert.ok(counterById[id], id);
});
