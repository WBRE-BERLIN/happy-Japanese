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

## Grammatik-Themen: `relative.js`, `conditional.js`, `while.js`

Jedes Thema hat einen eigenen Bereich (`areas/topics.js`) und eine eigene
Nachschlage-Seite. Eine Datei enthält bis zu drei Listen:

```js
export default {
  // wie im Grammatik-Quiz: erste Option richtig, t = Thema
  choice: [{ s: '{日本|にほん}へ＿とき、カメラを{買|か}いました。', o: ['{行|い}く', '{行|い}った', '{行|い}きます'],
    de: 'Als (bevor) ich nach Japan fuhr, kaufte ich eine Kamera.', why: 'Kauf vor der Reise: Wörterbuchform.', l: 23, t: 'toki' }],
  // wie bei „Verben im Satz“: v = Wörterbuchform aus verbs.js, f = Form aus FORMS (lib/conjugate.js)
  form: [{ s: '{音楽|おんがく}を＿{勉強|べんきょう}します。', v: '聞く', f: 'nagara', de: 'Ich lerne beim Musikhören.', l: 28, t: 'nagara' }],
  // wie beim Satzbau
  build: [{ de: 'Das ist der Kuchen, den ich gebacken habe.', c: ['これは', '{私|わたし}が', '{作|つく}った', 'ケーキです。'], l: 22 }],
};
```

Erlaubte Themen: `relative.js` → `modify`; `conditional.js` → `toki`, `to-cond`,
`tara`, `ba`, `nara`, `temo`; `while.js` → `nagara`, `aida`, `aidani`, `chuu`,
`toki`. Die Lektion darf bis 50 gehen (Minna no Nihongo II); diese Bereiche
richten sich nicht nach der eingestellten Lektion.

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
