# Lerninhalte: Dateiformate

Alle Inhalte liegen als JavaScript-Module in `public/assets/js/data/`. Sie
werden vom Service Worker zwischengespeichert, deshalb funktioniert alles
offline. Nach jeder Änderung prüfen:

```sh
node tools/check-content.mjs
```

## Furigana-Schreibweise

Sätze, Antwortmöglichkeiten und Satzbausteine schreiben Kanji immer mit
Lesung in geschweiften Klammern:

```
{毎朝|まいあさ}6{時|じ}に{起|お}きます。
```

- `{Kanji|Lesung}`: eine zusammenhängende Kanji-Folge mit ihrer Lesung in
  Hiragana. Okurigana (die Hiragana danach) stehen außerhalb: `{食|た}べます`.
- Außerhalb der Klammern dürfen keine Kanji stehen.
- Zahlen schreibt man als arabische Ziffern (`6{時|じ}`), so wie im Buch.
- Keine Leerzeichen zwischen den Wörtern (wie im Buch), japanische
  Satzzeichen (`。`, `、`, `？`).

Wörter in den Wortlisten werden als **Schreibweise + Lesung** gespeichert
(`['食べます', 'たべます', …]`). Die Furigana werden daraus automatisch
berechnet; die Kana in der Schreibweise müssen deshalb genau so in der
Lesung vorkommen.

## Wortschatz: `vocab-1.js`, `vocab-2.js`

```js
export default {
  4: [
    // [Schreibweise, Lesung, Deutsch, Wortart, Hinweis?]
    ['起きます', 'おきます', 'aufstehen', 'v'],
    ['今', 'いま', 'jetzt', 'n'],
    ['〜時', '〜じ', '… Uhr', 'ctr'],
    ['大変ですね', 'たいへんですね', 'Das ist ja anstrengend.', 'expr', 'Mitgefühl zeigen'],
  ],
};
```

- Schreibweise so, wie Minna no Nihongo das Wort schreibt (mit Kanji, wo das
  Buch Kanji benutzt). Verben in der ます-Form.
- Lesung nur in Kana (Katakana bei Lehnwörtern, sonst Hiragana), `〜` erlaubt.
- Wortarten: `n` Nomen, `v` Verb, `i` い-Adjektiv, `na` な-Adjektiv (ohne な),
  `adv` Adverb, `pron` Pronomen/Demonstrativ, `q` Fragewort, `expr` Ausdruck,
  `ctr` Zähleinheit/Suffix, `conj` Konjunktion, `num` Zahl, `part` Partikel.
- Hinweis (optional): kurze Gebrauchsnotiz auf Deutsch („höflich“, „nur für
  andere Familien“).

## Reise-Wortschatz: `vocab-travel.js`

```js
export default [
  { id: 'bahn', title: 'Bahn & Bahnhof', words: [ ['駅', 'えき', 'Bahnhof', 'n'], … ] },
];
```

## Partikel: `particles.js`

```js
export default [
  { s: '{私|わたし}＿{学生|がくせい}です。', a: ['は'], de: 'Ich bin Student.', why: 'は markiert das Thema.', l: 1 },
  { s: '{駅|えき}＿{電車|でんしゃ}＿{乗|の}ります。', a: ['で', 'に'], de: '…', why: '…', l: 16 },
  { s: '…＿…', a: ['へ/に'], … },   // mehrere richtige Antworten mit /
];
```

`＿` (U+FF3F) markiert jede Lücke, `a` hat genau eine Antwort pro Lücke.

## Verben im Satz: `verbcloze.js`

```js
{ s: '{毎朝|まいあさ}6{時|じ}に＿。', v: '起きる', f: 'masu', de: 'Ich stehe jeden Morgen um 6 auf.', l: 4 }
```

`v` ist die Wörterbuchform aus `verbs.js`, `f` die gesuchte Form (siehe
`FORMS` in `lib/conjugate.js`). Die Lücke ersetzt nur die Verbform selbst:
`＿ください` mit `f: 'te'`.

## Adjektive im Satz: `adjcloze.js`

```js
{ s: '{昨日|きのう}はとても＿。', a: '寒い', f: 'p_past', de: 'Gestern war es sehr kalt.', l: 12 }
```

`a` aus `adjectives.js`, `f` siehe `ADJ_FORMS` in `lib/conjugate.js`. Bei
höflichen Formen (`p_…`) gehört です/でした mit in die Lücke.

## Grammatik-Quiz: `grammar.js`

```js
{ s: '{教室|きょうしつ}に{学生|がくせい}が＿。', o: ['います', 'あります', 'いきます', 'です'],
  de: 'Im Klassenzimmer sind Studenten.', why: 'Für Lebewesen: います.', l: 10, t: 'exist' }
```

Die erste Option ist richtig (die App mischt). Die falschen Optionen sollen
plausibel sein, nicht offensichtlich falsch. `t` ist das Thema (Liste in
`areas/grammar.js`), `q` (optional) eine deutsche Frage statt einer Lücke.

## Satzbau: `sentences.js`

```js
{ de: 'Ich stehe jeden Morgen um 7 Uhr auf.', c: ['{私|わたし}は', '{毎朝|まいあさ}', '7{時|じ}に', '{起|お}きます。'], l: 4, alt: [[1, 0, 2, 3]] }
```

`c` in der richtigen Reihenfolge; `alt` (optional) weitere richtige
Reihenfolgen als Indexlisten.

## Kanji: `kanji.js`

```js
['日', 'ニチ、ジツ', 'ひ、か', 'Tag; Sonne', [['毎日', 'まいにち', 'jeden Tag'], ['日曜日', 'にちようび', 'Sonntag']]]
```

## Schilder: `signs.js`

```js
['出口', 'でぐち', 'Ausgang', 'green', 'Am Bahnhof oft mit Himmelsrichtung: 東口 = Ostausgang.']
```

Stil: `green`, `red`, `blue`, `white`, `yellow`, `ink`.

## Reise-Sätze: `phrases.js`

```js
{ jp: 'お{会計|かいけい}お{願|ねが}いします。', de: 'Die Rechnung, bitte.', sit: 'Du möchtest im Restaurant bezahlen.',
  x: ['いただきます。', 'いらっしゃいませ。', 'お{会計|かいけい}ですか。'], cat: 'restaurant', why: 'optional' }
```

`x` sind falsche, aber plausible Antworten für die Situation.
