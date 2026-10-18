/* Adjektive im Satz: a aus adjectives.js, f aus ADJ_FORMS */
export default [
  // höflich, Gegenwart (L8)
  { s: 'この{料理|りょうり}はとても＿。', a: '辛い', f: 'p_pres', de: 'Dieses Gericht ist sehr scharf.', l: 12 },
  { s: '{富士山|ふじさん}は{日本|にほん}でいちばん＿。', a: '高い', f: 'p_pres', de: 'Der Fuji ist der höchste Berg Japans.', l: 12 },
  { s: 'この{部屋|へや}は{窓|まど}が{大|おお}きくて＿。', a: '明るい', f: 'p_pres', de: 'Dieses Zimmer hat große Fenster und ist hell.', l: 16 },
  { s: 'すみません、この{部屋|へや}はちょっと＿。', a: '狭い', f: 'p_pres', de: 'Entschuldigung, dieses Zimmer ist etwas eng.', l: 13 },
  { s: 'ミラーさんの{部屋|へや}はいつも＿ね。', a: 'きれい', f: 'p_pres', de: 'Herrn Millers Zimmer ist immer sauber, nicht wahr?', l: 8 },
  { s: 'この{店|みせ}のケーキはとても＿よ。', a: '有名', f: 'p_pres', de: 'Die Kuchen aus diesem Laden sind sehr berühmt.', l: 8 },
  { s: '{私|わたし}は{肉|にく}が＿。{魚|さかな}は{好|す}きです。', a: '嫌い', f: 'p_pres', de: 'Ich mag kein Fleisch. Fisch mag ich.', l: 9 },

  // höflich, verneint (L8)
  { s: 'この{本|ほん}はあまり＿。', a: 'おもしろい', f: 'p_neg', de: 'Dieses Buch ist nicht besonders interessant.', l: 8 },
  { s: '{今日|きょう}はあまり＿ね。', a: '寒い', f: 'p_neg', de: 'Heute ist es nicht so kalt, oder?', l: 8 },
  { s: '{今日|きょう}は{天気|てんき}があまり＿ね。', a: 'いい', f: 'p_neg', de: 'Das Wetter ist heute nicht so gut, oder?', l: 12 },
  { s: 'この{漢字|かんじ}はあまり＿よ。', a: '難しい', f: 'p_neg', de: 'Dieses Kanji ist nicht so schwierig.', l: 8 },
  { s: '{駅|えき}は{私|わたし}の{家|うち}からあまり＿。', a: '遠い', f: 'p_neg', de: 'Der Bahnhof ist nicht weit von meinem Haus entfernt.', l: 12 },
  { s: 'この{町|まち}はあまり＿。', a: 'にぎやか', f: 'p_neg', de: 'In dieser Stadt ist nicht viel los.', l: 8 },
  { s: 'この{公園|こうえん}はあまり＿。', a: 'きれい', f: 'p_neg', de: 'Dieser Park ist nicht besonders sauber.', l: 8 },

  // vor einem Nomen (L8)
  { s: '{奈良|なら}は＿{町|まち}です。', a: '古い', f: 'attr', de: 'Nara ist eine alte Stadt.', l: 8 },
  { s: '{私|わたし}は＿{車|くるま}が{欲|ほ}しいです。', a: '新しい', f: 'attr', de: 'Ich möchte ein neues Auto.', l: 13 },
  { s: '{今日|きょう}はとても＿{日|ひ}でした。', a: 'いい', f: 'attr', de: 'Heute war ein sehr schöner Tag.', l: 12 },
  { s: '{私|わたし}は＿ものが{大好|だいす}きです。', a: '甘い', f: 'attr', de: 'Ich liebe Süßes.', l: 12 },
  { s: '{富士山|ふじさん}は＿{山|やま}です。', a: '有名', f: 'attr', de: 'Der Fuji ist ein berühmter Berg.', l: 8 },
  { s: '{日本|にほん}で＿{着物|きもの}を{買|か}いました。', a: 'きれい', f: 'attr', de: 'In Japan habe ich einen schönen Kimono gekauft.', l: 8 },
  { s: '＿{人|ひと}は{嫌|きら}いです。', a: '失礼', f: 'attr', de: 'Unhöfliche Menschen mag ich nicht.', l: 9 },
  { s: '＿{食|た}べ{物|もの}は{何|なん}ですか。', a: '嫌い', f: 'attr', de: 'Welches Essen mögen Sie nicht?', l: 9 },
  { s: '{山田|やまだ}さんはいつも＿{字|じ}を{書|か}きます。', a: '丁寧', f: 'attr', de: 'Herr Yamada schreibt immer sehr sorgfältig.', l: 8 },

  // höflich, Vergangenheit (L12)
  { s: '{昨日|きのう}のパーティーはとても＿。', a: '楽しい', f: 'p_past', de: 'Die Party gestern hat viel Spaß gemacht.', l: 12 },
  { s: '{旅行|りょこう}はどうでしたか。……とても＿。', a: 'いい', f: 'p_past', de: 'Wie war die Reise? – Sehr schön.', l: 12 },
  { s: '{昨日|きのう}は{本当|ほんとう}に＿ね。', a: '暑い', f: 'p_past', de: 'Gestern war es wirklich heiß, nicht wahr?', l: 12 },
  { s: '{昨日|きのう}の{晩|ばん}ご{飯|はん}は＿か。', a: 'おいしい', f: 'p_past', de: 'Hat das Abendessen gestern geschmeckt?', l: 12 },
  { s: '{先月|せんげつ}は{仕事|しごと}がとても＿。', a: '忙しい', f: 'p_past', de: 'Letzten Monat hatte ich bei der Arbeit sehr viel zu tun.', l: 12 },
  { s: '{先週|せんしゅう}の{試験|しけん}はとても＿。', a: '簡単', f: 'p_past', de: 'Die Prüfung letzte Woche war sehr leicht.', l: 12 },
  { s: '{子|こ}どものとき、{私|わたし}は{牛乳|ぎゅうにゅう}が＿。', a: '嫌い', f: 'p_past', de: 'Als Kind mochte ich keine Milch.', l: 23 },
  { s: '{昨日|きのう}{泊|と}まったホテルの{人|ひと}はとても＿。', a: '丁寧', f: 'p_past', de: 'Das Personal im Hotel, in dem ich gestern übernachtet habe, war sehr höflich.', l: 22 },

  // höflich, Vergangenheit verneint (L12)
  { s: '{昨日|きのう}の{映画|えいが}はあまり＿。', a: 'おもしろい', f: 'p_pastneg', de: 'Der Film gestern war nicht besonders interessant.', l: 12 },
  { s: '{旅行|りょこう}はどうでしたか。……{天気|てんき}があまり＿。', a: 'いい', f: 'p_pastneg', de: 'Wie war die Reise? – Das Wetter war nicht so gut.', l: 12 },
  { s: '{昨日|きのう}の{宿題|しゅくだい}はあまり＿。', a: '難しい', f: 'p_pastneg', de: 'Die Hausaufgaben gestern waren nicht so schwierig.', l: 12 },
  { s: '{去年|きょねん}の{冬|ふゆ}はあまり＿。', a: '寒い', f: 'p_pastneg', de: 'Letzten Winter war es nicht so kalt.', l: 12 },
  { s: '{昨日|きのう}{食|た}べたカレーはあまり＿。', a: '辛い', f: 'p_pastneg', de: 'Das Curry, das ich gestern gegessen habe, war nicht besonders scharf.', l: 22 },
  { s: '10{年前|ねんまえ}、この{店|みせ}はあまり＿。', a: '有名', f: 'p_pastneg', de: 'Vor 10 Jahren war dieser Laden noch nicht sehr bekannt.', l: 12 },
  { s: '{去年|きょねん}{泊|と}まったホテルは{駅|えき}の{前|まえ}でしたから、あまり＿。', a: '静か', f: 'p_pastneg', de: 'Das Hotel, in dem ich letztes Jahr übernachtet habe, lag direkt am Bahnhof und war deshalb nicht sehr ruhig.', l: 22 },

  // て-Form (L16)
  { s: '{東京|とうきょう}は＿にぎやかです。', a: '大きい', f: 'te', de: 'Tokio ist groß und belebt.', l: 16 },
  { s: 'このパソコンは＿{便利|べんり}です。', a: '軽い', f: 'te', de: 'Dieser Laptop ist leicht und praktisch.', l: 16 },
  { s: 'あのレストランは＿おいしいです。', a: '安い', f: 'te', de: 'Das Restaurant dort ist günstig und lecker.', l: 16 },
  { s: '{昨日|きのう}は{天気|てんき}が＿、{暖|あたた}かかったです。', a: 'いい', f: 'te', de: 'Gestern war das Wetter schön und es war warm.', l: 16 },
  { s: 'マリアさんは{髪|かみ}が＿、{目|め}が{大|おお}きいです。', a: '長い', f: 'te', de: 'Maria hat lange Haare und große Augen.', l: 16 },
  { s: 'この{町|まち}は＿きれいです。', a: '静か', f: 'te', de: 'Diese Stadt ist ruhig und schön.', l: 16 },
  { s: '{田中|たなか}さんは＿{親切|しんせつ}です。', a: 'ハンサム', f: 'te', de: 'Herr Tanaka sieht gut aus und ist freundlich.', l: 16 },
  { s: '{私|わたし}の{先生|せんせい}は＿おもしろいです。', a: '元気', f: 'te', de: 'Meine Lehrerin ist munter und lustig.', l: 16 },

  // als Adverb (L19)
  { s: '{明日|あした}は{試験|しけん}ですから、{今晩|こんばん}は＿{寝|ね}ます。', a: '早い', f: 'adv', de: 'Morgen habe ich eine Prüfung, deshalb gehe ich heute früh ins Bett.', l: 19 },
  { s: '{字|じ}をもう{少|すこ}し＿{書|か}いてください。', a: '大きい', f: 'adv', de: 'Schreiben Sie bitte etwas größer.', l: 19 },
  { s: 'すみません、もう{少|すこ}し＿してください。', a: '安い', f: 'adv', de: 'Entschuldigung, können Sie es bitte etwas billiger machen?', l: 19 },
  { s: 'テレビの{音|おと}を＿してください。', a: '小さい', f: 'adv', de: 'Machen Sie den Fernseher bitte leiser.', l: 19 },
  { s: '{髪|かみ}を＿{切|き}ってください。', a: '短い', f: 'adv', de: 'Schneiden Sie mir die Haare bitte kurz.', l: 19 },
  { s: '{毎朝|まいあさ}、{部屋|へや}を＿{掃除|そうじ}します。', a: 'きれい', f: 'adv', de: 'Jeden Morgen mache ich mein Zimmer gründlich sauber.', l: 19 },
  { s: '{図書館|としょかん}では＿してください。', a: '静か', f: 'adv', de: 'Seien Sie in der Bibliothek bitte leise.', l: 19 },
  { s: '{先生|せんせい}は{文法|ぶんぽう}を＿{説明|せつめい}してくれました。', a: '丁寧', f: 'adv', de: 'Die Lehrerin hat uns die Grammatik sorgfältig erklärt.', l: 24 },

  // 〜なります (L19)
  { s: '{明日|あした}から＿よ。', a: '暖かい', f: 'naru', de: 'Ab morgen wird es warm.', l: 19 },
  { s: '{日本|にほん}は7{月|がつ}から{本当|ほんとう}に＿。', a: '暑い', f: 'naru', de: 'In Japan wird es ab Juli richtig heiß.', l: 19 },
  { s: '{秋|あき}になると、{山|やま}の{木|き}が＿。', a: '赤い', f: 'naru', de: 'Im Herbst werden die Bäume in den Bergen rot.', l: 23 },
  { s: 'このボタンを{押|お}すと、{部屋|へや}が＿。', a: '明るい', f: 'naru', de: 'Wenn man diesen Knopf drückt, wird das Zimmer hell.', l: 23 },
  { s: '{少|すこ}し{休|やす}んだら、すぐ＿よ。', a: 'いい', f: 'naru', de: 'Wenn Sie sich ein bisschen ausruhen, wird es bald besser.', l: 25 },
  { s: 'この{薬|くすり}を{飲|の}むと、すぐ＿よ。', a: '元気', f: 'naru', de: 'Wenn Sie diese Medizin nehmen, sind Sie bald wieder fit.', l: 23 },
  { s: '{毎日|まいにち}{練習|れんしゅう}すると、{日本語|にほんご}が＿。', a: '上手', f: 'naru', de: 'Wenn man jeden Tag übt, wird man im Japanischen besser.', l: 23 },
  { s: '{来週|らいしゅう}から{仕事|しごと}が{少|すこ}し＿。', a: '暇', f: 'naru', de: 'Ab nächster Woche wird es bei der Arbeit etwas ruhiger.', l: 19 },

  // einfach, Gegenwart (L20)
  { s: 'この{本|ほん}、{貸|か}してあげるよ。とても＿よ。', a: 'おもしろい', f: 'pl_pres', de: 'Ich leihe dir dieses Buch. Es ist sehr interessant.', l: 24 },
  { s: '{今日|きょう}は＿から、{窓|まど}を{開|あ}けて。', a: '暑い', f: 'pl_pres', de: 'Heute ist es heiß, mach bitte das Fenster auf.', l: 20 },
  { s: 'この{店|みせ}のラーメン、{安|やす}くて＿よ。{一緒|いっしょ}に{行|い}かない？', a: 'おいしい', f: 'pl_pres', de: 'Die Ramen in diesem Laden sind günstig und lecker. Wollen wir nicht zusammen hingehen?', l: 20 },
  { s: '{東京|とうきょう}のホテルは＿と{思|おも}います。', a: '高い', f: 'pl_pres', de: 'Ich glaube, Hotels in Tokio sind teuer.', l: 21 },
  { s: '{日曜日|にちようび}、{暇|ひま}？……うん、＿よ。', a: '暇', f: 'pl_pres', de: 'Hast du am Sonntag Zeit? – Ja, habe ich.', l: 20 },
  { s: 'この{町|まち}は{車|くるま}が{少|すく}ないですから、＿と{思|おも}います。', a: '静か', f: 'pl_pres', de: 'In dieser Stadt gibt es wenige Autos, deshalb ist es hier wohl ruhig.', l: 21 },
  { s: 'この{歌手|かしゅ}はドイツでも＿と{思|おも}います。', a: '有名', f: 'pl_pres', de: 'Ich glaube, dieser Sänger ist auch in Deutschland berühmt.', l: 21 },
  { s: '{電車|でんしゃ}の{中|なか}で{大|おお}きい{声|こえ}で{話|はな}す{人|ひと}は＿と{思|おも}います。', a: '失礼', f: 'pl_pres', de: 'Ich finde Leute unhöflich, die im Zug laut reden.', l: 22 },

  // einfach, verneint (L20)
  { s: '{明日|あした}のテスト、{難|むずか}しい？……ううん、あまり＿よ。', a: '難しい', f: 'pl_neg', de: 'Ist der Test morgen schwer? – Nein, nicht besonders.', l: 20 },
  { s: '{今日|きょう}はあまり＿から、{窓|まど}を{開|あ}けてもいいよ。', a: '寒い', f: 'pl_neg', de: 'Heute ist es nicht so kalt, du kannst das Fenster ruhig aufmachen.', l: 20 },
  { s: 'このパソコンは{古|ふる}いけど、{全然|ぜんぜん}＿よ。', a: '悪い', f: 'pl_neg', de: 'Dieser Computer ist alt, aber überhaupt nicht schlecht.', l: 20 },
  { s: 'この{町|まち}は{安全|あんぜん}ですから、{夜|よる}も＿と{思|おも}います。', a: '危ない', f: 'pl_neg', de: 'Diese Stadt ist sicher, deshalb ist es wohl auch nachts nicht gefährlich.', l: 21 },
  { s: 'この{店|みせ}は{有名|ゆうめい}ですが、{料理|りょうり}はあまり＿と{思|おも}います。', a: 'おいしい', f: 'pl_neg', de: 'Dieses Restaurant ist berühmt, aber ich finde das Essen nicht besonders lecker.', l: 21 },
  { s: 'あの{映画|えいが}はあまり＿と{思|おも}います。', a: 'いい', f: 'pl_neg', de: 'Ich finde diesen Film nicht so gut.', l: 21 },
  { s: '{明日|あした}は{仕事|しごと}があるから、＿よ。', a: '暇', f: 'pl_neg', de: 'Morgen muss ich arbeiten, da habe ich keine Zeit.', l: 20 },
  { s: '{弟|おとうと}の{部屋|へや}はあまり＿よ。{全然|ぜんぜん}{掃除|そうじ}しないから。', a: 'きれい', f: 'pl_neg', de: 'Das Zimmer meines jüngeren Bruders ist nicht besonders sauber. Er putzt nie.', l: 20 },
  { s: '{田中|たなか}さんはお{酒|さけ}があまり＿と{思|おも}います。', a: '好き', f: 'pl_neg', de: 'Ich glaube, Herr Tanaka mag Alkohol nicht besonders.', l: 21 },

  // einfach, Vergangenheit (L20)
  { s: '{旅行|りょこう}、どうだった？……とても＿よ。', a: '楽しい', f: 'pl_past', de: 'Wie war die Reise? – Es hat sehr viel Spaß gemacht.', l: 20 },
  { s: '{昨日|きのう}は＿から、{一日中|いちにちじゅう}{家|うち}にいたよ。', a: '寒い', f: 'pl_past', de: 'Gestern war es kalt, deshalb war ich den ganzen Tag zu Hause.', l: 20 },
  { s: '{昨日|きのう}の{夜|よる}、{公園|こうえん}は{暗|くら}くて＿よ。', a: '怖い', f: 'pl_past', de: 'Gestern Abend war der Park dunkel und unheimlich.', l: 20 },
  { s: '{昨日|きのう}は{天気|てんき}が＿から、{洗濯|せんたく}したよ。', a: 'いい', f: 'pl_past', de: 'Gestern war das Wetter schön, deshalb habe ich Wäsche gewaschen.', l: 20 },
  { s: 'あのレストラン、{高|たか}かったけど、とても＿よ。', a: 'おいしい', f: 'pl_past', de: 'Das Restaurant war teuer, aber sehr lecker.', l: 20 },
  { s: '{昨日|きのう}の{試験|しけん}、どうだった？……＿よ。', a: '簡単', f: 'pl_past', de: 'Wie war die Prüfung gestern? – Sie war leicht.', l: 20 },
  { s: '{昨日|きのう}{見|み}た{桜|さくら}、とても＿よ。', a: 'きれい', f: 'pl_past', de: 'Die Kirschblüten, die ich gestern gesehen habe, waren wunderschön.', l: 22 },
  { s: 'ミラーさんは{若|わか}いとき、とても＿と{思|おも}います。', a: 'ハンサム', f: 'pl_past', de: 'Ich glaube, Herr Miller sah in jungen Jahren sehr gut aus.', l: 23 },
  { s: '{子|こ}どものとき、{犬|いぬ}が＿けど、{今|いま}は{大好|だいす}きだよ。', a: '嫌い', f: 'pl_past', de: 'Als Kind mochte ich keine Hunde, aber jetzt liebe ich sie.', l: 23 },

  // einfach, Vergangenheit verneint (L20)
  { s: '{昨日|きのう}の{映画|えいが}、どうだった？……あまり＿よ。', a: 'おもしろい', f: 'pl_pastneg', de: 'Wie war der Film gestern? – Nicht besonders interessant.', l: 20 },
  { s: '{旅行|りょこう}は{天気|てんき}が＿けど、{楽|たの}しかったよ。', a: 'いい', f: 'pl_pastneg', de: 'Auf der Reise war das Wetter nicht gut, aber es hat Spaß gemacht.', l: 20 },
  { s: '{昨日|きのう}は{仕事|しごと}があまり＿から、{早|はや}く{帰|かえ}ったよ。', a: '忙しい', f: 'pl_pastneg', de: 'Gestern war bei der Arbeit nicht viel los, deshalb bin ich früh nach Hause gegangen.', l: 20 },
  { s: 'パーティーに{行|い}った？……うん、でも{全然|ぜんぜん}＿よ。', a: '楽しい', f: 'pl_pastneg', de: 'Warst du auf der Party? – Ja, aber es hat überhaupt keinen Spaß gemacht.', l: 20 },
  { s: '20{年前|ねんまえ}、この{町|まち}はあまり＿と{思|おも}います。', a: 'にぎやか', f: 'pl_pastneg', de: 'Ich glaube, vor 20 Jahren war in dieser Stadt nicht viel los.', l: 21 },
  { s: '{田中|たなか}さんは{昨日|きのう}あまり＿と{思|おも}います。{会社|かいしゃ}を{休|やす}みましたから。', a: '元気', f: 'pl_pastneg', de: 'Ich glaube, Herrn Tanaka ging es gestern nicht so gut. Er hat in der Firma gefehlt.', l: 21 },
  { s: '{先週|せんしゅう}{泊|と}まったホテル、{部屋|へや}があまり＿よ。', a: 'きれい', f: 'pl_pastneg', de: 'In dem Hotel, in dem ich letzte Woche übernachtet habe, waren die Zimmer nicht besonders sauber.', l: 22 },
  { s: '{子|こ}どものとき、{勉強|べんきょう}があまり＿けど、{今|いま}は{日本語|にほんご}の{勉強|べんきょう}が{楽|たの}しいよ。', a: '好き', f: 'pl_pastneg', de: 'Als Kind habe ich nicht gern gelernt, aber jetzt macht mir das Japanischlernen Spaß.', l: 23 },
];
