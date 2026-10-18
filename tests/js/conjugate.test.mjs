import { test } from 'node:test';
import assert from 'node:assert/strict';
import { verbForm, adjForm, FORMS, ADJ_FORMS, teRule, looksIchidan } from '../../public/assets/js/lib/conjugate.js';
import verbs from '../../public/assets/js/data/verbs.js';
import adjectives from '../../public/assets/js/data/adjectives.js';

const verb = (dict) => verbs.find(([d]) => d === dict) ?? assert.fail(`${dict} missing`);
const adj = (word) => adjectives.find(([w]) => w === word) ?? assert.fail(`${word} missing`);
const forms = (dict, keys) => keys.map((key) => verbForm(verb(dict), key).written);

test('godan verbs', () => {
  assert.deepEqual(forms('書く', ['masu', 'te', 'ta', 'nai', 'nakatta', 'tara', 'temo']), ['書きます', '書いて', '書いた', '書かない', '書かなかった', '書いたら', '書いても']);
  assert.deepEqual(forms('泳ぐ', ['te', 'ta']), ['泳いで', '泳いだ']);
  assert.deepEqual(forms('話す', ['masu', 'te', 'nai']), ['話します', '話して', '話さない']);
  assert.deepEqual(forms('待つ', ['masu', 'te', 'nai']), ['待ちます', '待って', '待たない']);
  assert.deepEqual(forms('買う', ['te', 'nai', 'ta']), ['買って', '買わない', '買った']);
  assert.deepEqual(forms('飲む', ['te', 'ta']), ['飲んで', '飲んだ']);
  assert.deepEqual(forms('遊ぶ', ['te', 'nai']), ['遊んで', '遊ばない']);
  assert.deepEqual(forms('帰る', ['masu', 'te', 'nai']), ['帰ります', '帰って', '帰らない']);
});

test('exceptions', () => {
  assert.deepEqual(forms('行く', ['masu', 'te', 'ta', 'tara']), ['行きます', '行って', '行った', '行ったら']);
  assert.deepEqual(forms('持って行く', ['te', 'masu']), ['持って行って', '持って行きます']);
  assert.deepEqual(forms('ある', ['nai', 'nakatta', 'masu']), ['ない', 'なかった', 'あります']);
  assert.equal(verbForm(verb('来る'), 'nai').reading, 'こない');
  assert.equal(verbForm(verb('来る'), 'nai').furi, '{来|こ}ない');
  assert.equal(verbForm(verb('来る'), 'masu').furi, '{来|き}ます');
  assert.equal(verbForm(verb('来る'), 'te').reading, 'きて');
  assert.equal(verbForm(verb('持って来る'), 'nai').reading, 'もってこない');
  assert.deepEqual(forms('する', ['masu', 'te', 'nai', 'ta']), ['します', 'して', 'しない', 'した']);
  assert.deepEqual(forms('勉強する', ['masu', 'tai', 'te']), ['勉強します', '勉強したい', '勉強して']);
});

test('ichidan verbs', () => {
  assert.deepEqual(forms('食べる', ['masu', 'te', 'nai', 'ta', 'stem']), ['食べます', '食べて', '食べない', '食べた', '食べ']);
  assert.deepEqual(forms('見る', ['masu', 'te']), ['見ます', '見て']);
  assert.equal(verbForm(verb('見る'), 'te').furi, '{見|み}て');
});

test('every verb has every form with a furigana that lines up', () => {
  for (const v of verbs) {
    for (const key of Object.keys(FORMS)) {
      const form = verbForm(v, key);
      assert.ok(form.written && form.reading, `${v[0]} ${key}`);
      assert.ok(!form.furi.startsWith('{') || form.furi.includes('|'), `${v[0]} ${key}`);
    }
  }
});

test('te rules and traps', () => {
  assert.equal(teRule(verb('書く')), 'く → いて');
  assert.equal(teRule(verb('行く')), '行く (Ausnahme)');
  assert.equal(teRule(verb('食べる')), 'Gruppe II');
  assert.ok(looksIchidan(verb('帰る')));
  assert.ok(looksIchidan(verb('入る')));
  assert.ok(!looksIchidan(verb('食べる')));
});

test('adjectives', () => {
  assert.equal(adjForm(adj('大きい'), 'p_neg').written, '大きくないです');
  assert.deepEqual(adjForm(adj('大きい'), 'p_neg').accept.map((a) => a.written), ['大きくありません']);
  assert.equal(adjForm(adj('大きい'), 'p_past').written, '大きかったです');
  assert.equal(adjForm(adj('大きい'), 'te').furi, '{大|おお}きくて');
  assert.equal(adjForm(adj('いい'), 'p_neg').written, 'よくないです');
  assert.equal(adjForm(adj('いい'), 'pl_past').written, 'よかった');
  assert.equal(adjForm(adj('かっこいい'), 'pl_neg').written, 'かっこよくない');
  assert.equal(adjForm(adj('かわいい'), 'pl_neg').written, 'かわいくない');
  assert.equal(adjForm(adj('静か'), 'p_neg').written, '静かじゃありません');
  assert.equal(adjForm(adj('静か'), 'attr').written, '静かな');
  assert.equal(adjForm(adj('静か'), 'adv').furi, '{静|しず}かに');
  assert.equal(adjForm(adj('きれい'), 'p_past').written, 'きれいでした');
  for (const a of adjectives) for (const key of Object.keys(ADJ_FORMS)) assert.ok(adjForm(a, key).reading, `${a[0]} ${key}`);
});
