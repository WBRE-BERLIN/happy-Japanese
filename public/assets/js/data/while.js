/* Während: ながら, 間, 間に, 〜中. choice: Auswahl, form: Verbform bilden */
export default {
  choice: [
    // ながら: dieselbe Person, zwei Handlungen gleichzeitig; Haupthandlung am Ende
    { s: '{音楽|おんがく}を＿{勉強|べんきょう}します。', o: ['{聞|き}きながら', '{聞|き}くながら', '{聞|き}いてながら', '{聞|き}く{間|あいだ}に'], de: 'Ich lerne, während ich Musik höre.', why: 'ながら steht nach dem ます-Stamm: ききます → ききながら.', l: 28, t: 'nagara' },
    { s: '{歌|うた}を＿シャワーを{浴|あ}びます。', o: ['{歌|うた}いながら', '{歌|うた}うながら', '{歌|うた}ってながら', '{歌|うた}いますながら'], de: 'Ich dusche und singe dabei.', why: 'ます-Stamm + ながら: うたいます → うたいながら. Nicht die Wörterbuch-, て- oder ganze ます-Form.', l: 28, t: 'nagara' },
    { s: '{料理|りょうり}の{本|ほん}を＿ケーキを{作|つく}りました。', o: ['{見|み}ながら', '{見|み}るながら', '{見|み}てながら', '{見|み}たながら'], de: 'Ich habe einen Kuchen gebacken und dabei ins Kochbuch geschaut.', why: 'Gruppe II: みます → みながら. ながら ändert sich nie, die Zeit zeigt das letzte Verb.', l: 28, t: 'nagara' },
    { s: '{電話|でんわ}を＿{歩|ある}いている{人|ひと}が{多|おお}いです。', o: ['しながら', 'するながら', 'してながら', 'しているながら'], de: 'Viele Leute laufen herum und telefonieren dabei.', why: 'します → ます-Stamm し → しながら. Nie nach der て-Form oder 〜ている.', l: 28, t: 'nagara' },
    { q: 'Du spülst ab – das ist die Haupthandlung. Nebenbei hörst du Radio.', s: '{私|わたし}はいつも＿。', o: ['ラジオを{聞|き}きながら{皿|さら}を{洗|あら}います', '{皿|さら}を{洗|あら}いながらラジオを{聞|き}きます', 'ラジオを{聞|き}くながら{皿|さら}を{洗|あら}います', '{皿|さら}を{洗|あら}ってながらラジオを{聞|き}きます'], de: 'Ich spüle immer ab und höre dabei Radio.', why: 'Die Haupthandlung steht am Satzende, die Nebenhandlung mit ながら davor.', l: 28, t: 'nagara' },
    { q: 'Ihr unterhaltet euch (Haupthandlung) und trinkt dabei Tee.', s: 'トモヒロ{先生|せんせい}と＿。', o: ['お{茶|ちゃ}を{飲|の}みながら{話|はな}しました', '{話|はな}しながらお{茶|ちゃ}を{飲|の}みました', 'お{茶|ちゃ}を{飲|の}むながら{話|はな}しました', '{話|はな}してながらお{茶|ちゃ}を{飲|の}みました'], de: 'Ich habe mich mit Tomohiro-sensei bei einer Tasse Tee unterhalten.', why: 'Die Haupthandlung (はなしました) steht am Ende, die Nebenhandlung (Tee trinken) mit ながら davor.', l: 28, t: 'nagara' },
    { s: '{子|こ}どもが＿お{母|かあ}さんを{呼|よ}んでいました。', o: ['{泣|な}きながら', '{泣|な}くながら', '{泣|な}いてながら', '{泣|な}く{間|あいだ}に'], de: 'Das Kind rief weinend nach seiner Mutter.', why: 'なきます → なきながら. ながら steht immer nach dem ます-Stamm.', l: 28, t: 'nagara' },
    { s: '＿{仕事|しごと}の{話|はなし}をしましょう。', o: ['{食事|しょくじ}をしながら', '{食事|しょくじ}ながら', '{食事|しょくじ}をするながら', '{食事|しょくじ}をしてながら'], de: 'Lassen Sie uns beim Essen über die Arbeit sprechen.', why: 'ながら braucht ein Verb im ます-Stamm: しょくじをします → しょくじをしながら. Nicht direkt nach einem Nomen.', l: 28, t: 'nagara' },
    { s: 'アルバイトを＿{大学|だいがく}に{通|かよ}っています。', o: ['しながら', 'しますながら', 'する{間|あいだ}に', 'してながら'], de: 'Ich gehe zur Uni und jobbe nebenbei.', why: 'ながら geht auch für längere Zeit: zwei Tätigkeiten parallel, dieselbe Person. します → しながら.', l: 28, t: 'nagara' },
    { s: '{私|わたし}はガイドブックを{読|よ}みながら＿。', o: ['{旅行|りょこう}の{計画|けいかく}を{立|た}てました', '{夫|おっと}が{料理|りょうり}を{作|つく}りました', '{雨|あめ}が{降|ふ}りました', '{電話|でんわ}が{鳴|な}りました'], de: 'Ich habe die Reise geplant und dabei im Reiseführer gelesen.', why: 'Bei ながら macht dieselbe Person beide Handlungen. Ein anderes Subjekt (おっとが, あめが) passt nicht.', l: 28, t: 'nagara' },
    { s: '{昨日|きのう}の{晩|ばん}、ワインを＿{友達|ともだち}といろいろな{話|はなし}をしました。', o: ['{飲|の}みながら', '{飲|の}んだながら', '{飲|の}みましたながら', '{飲|の}むながら'], de: 'Gestern Abend habe ich mich bei einem Glas Wein mit einer Freundin über vieles unterhalten.', why: 'ながら bleibt immer gleich (のみながら). Die Vergangenheit zeigt nur das letzte Verb.', l: 28, t: 'nagara' },
    { s: '{弟|おとうと}はいつもお{菓子|かし}を＿{宿題|しゅくだい}をしています。', o: ['{食|た}べながら', '{食|た}べているながら', '{食|た}べてながら', '{食|た}べるながら'], de: 'Mein kleiner Bruder macht immer Hausaufgaben und nascht dabei.', why: 'ながら direkt nach dem ます-Stamm: たべながら. Nie nach 〜ている; die Dauer zeigt しています am Ende.', l: 28, t: 'nagara' },
    { s: '{写真|しゃしん}を＿{京都|きょうと}の{町|まち}を{散歩|さんぽ}しました。', o: ['{撮|と}りながら', '{撮|と}るながら', '{撮|と}ってながら', '{撮|と}りますながら'], de: 'Ich bin durch Kyoto spaziert und habe dabei Fotos gemacht.', why: 'とります → とりながら: ます-Stamm + ながら.', l: 28, t: 'nagara' },
    { s: 'ガイドさんの{説明|せつめい}を＿お{寺|てら}を{見学|けんがく}しました。', o: ['{聞|き}きながら', '{聞|き}いているながら', '{聞|き}きましたながら', '{聞|き}くながら'], de: 'Ich habe den Tempel besichtigt und dabei den Erklärungen des Guides zugehört.', why: 'ききます → ききながら. ながら bleibt in der Vergangenheit gleich, 〜ている passt nicht davor.', l: 28, t: 'nagara' },
    { s: '{大切|たいせつ}な{話|はなし}ですから、テレビを＿{聞|き}かないでください。', o: ['{見|み}ながら', '{見|み}るながら', '{見|み}ているながら', '{見|み}て{間|あいだ}'], de: 'Es geht um etwas Wichtiges, also hör bitte nicht zu, während du fernsiehst.', why: 'みます → みながら. Auch vor einem Verbot (〜ないでください) steht ながら nach dem ます-Stamm.', l: 28, t: 'nagara' },

    // 間: die ganze Zeit (Haupthandlung dauert an)
    { s: '{父|ちち}が{散歩|さんぽ}している＿、{母|はは}はずっと{家|うち}でテレビを{見|み}ていました。', o: ['{間|あいだ}', '{間|あいだ}に', 'ながら', 'の{間|あいだ}'], de: 'Während mein Vater spazieren ging, hat meine Mutter die ganze Zeit zu Hause ferngesehen.', why: 'ずっと + 〜ていました: die ganze Zeit → あいだ. Zwei Personen, also nicht ながら.', l: 28, t: 'aida' },
    { s: '{母|はは}が{電話|でんわ}で＿、{私|わたし}は{一人|ひとり}でご{飯|はん}を{食|た}べていました。', o: ['{話|はな}している{間|あいだ}', '{話|はな}しながら', '{話|はな}している{間|あいだ}に', '{話|はな}すの{間|あいだ}'], de: 'Während meine Mutter telefonierte, habe ich allein gegessen.', why: 'Zwei Personen: nicht ながら. Die Handlung dauert (〜ていました) → あいだ ohne に.', l: 28, t: 'aida' },
    { s: '{冬休|ふゆやす}みの＿、ずっと{国|くに}に{帰|かえ}っていました。', o: ['{間|あいだ}', '{間|あいだ}に', '{中|ちゅう}', '{間|あいだ}で'], de: 'Während der Winterferien war ich die ganze Zeit in meiner Heimat.', why: 'Die ganze Zeit (ずっと) → のあいだ. ちゅう stünde direkt nach dem Nomen (ふゆやすみちゅう).', l: 28, t: 'aida' },
    { s: '{授業|じゅぎょう}の＿、{日本語|にほんご}だけで{話|はな}してください。', o: ['{間|あいだ}', '{間|あいだ}に', '{中|ちゅう}', '{間|あいだ}で'], de: 'Sprechen Sie während des Unterrichts bitte nur Japanisch.', why: 'Die ganze Unterrichtszeit lang → あいだ. あいだに hieße: irgendwann im Unterricht.', l: 28, t: 'aida' },
    { s: '{子|こ}どもたちが{外|そと}で＿、{私|わたし}は{窓|まど}から{見|み}ていました。', o: ['{遊|あそ}んでいる{間|あいだ}', '{遊|あそ}んで{間|あいだ}', '{遊|あそ}びながら', '{遊|あそ}んだ{間|あいだ}'], de: 'Während die Kinder draußen spielten, habe ich ihnen vom Fenster aus zugesehen.', why: 'Vor あいだ steht 〜ている: あそんでいるあいだ. ながら nur bei derselben Person.', l: 28, t: 'aida' },
    { s: '{日本|にほん}にいる＿、ずっと{友達|ともだち}の{家|うち}に{泊|と}まります。', o: ['{間|あいだ}', '{間|あいだ}に', 'ながら', '{中|ちゅう}'], de: 'Während ich in Japan bin, wohne ich die ganze Zeit bei einem Freund.', why: 'ずっと: die ganze Zeit → あいだ. いる steht in der Wörterbuchform direkt vor あいだ.', l: 28, t: 'aida' },
    { s: '{会議|かいぎ}＿、{部長|ぶちょう}は{一言|ひとこと}も{話|はな}しませんでした。', o: ['の{間|あいだ}', 'の{間|あいだ}に', 'ながら', 'の{中|なか}に'], de: 'Während der ganzen Besprechung hat der Abteilungsleiter kein einziges Wort gesagt.', why: 'Über die ganze Dauer → のあいだ. のあいだに steht nur für ein einzelnes Ereignis.', l: 28, t: 'aida' },
    { q: 'Dein Mann fährt, und du schläfst die ganze Fahrt über.', s: '{夫|おっと}が{運転|うんてん}＿、{私|わたし}はずっと{寝|ね}ていました。', o: ['している{間|あいだ}', 'しながら', 'している{間|あいだ}に', 'するの{間|あいだ}'], de: 'Während mein Mann Auto fuhr, habe ich die ganze Zeit geschlafen.', why: 'Zwei Personen → nicht ながら. ずっと (die ganze Zeit) → あいだ, nicht あいだに.', l: 28, t: 'aida' },
    { q: 'Der Film dauerte zwei Stunden – du hast alles verschlafen.', s: '{映画|えいが}＿、ずっと{寝|ね}ていました。', o: ['の{間|あいだ}', 'の{間|あいだ}に', 'を{見|み}ながら', '{中|ちゅう}に'], de: 'Während des Films habe ich die ganze Zeit geschlafen.', why: 'Die ganze Filmlänge → のあいだ. Gleichzeitig schauen und schlafen (みながら) geht nicht.', l: 28, t: 'aida' },

    // 間に: irgendwann innerhalb der Zeit (ein Ereignis, eine Erledigung)
    { s: '{私|わたし}が{旅行|りょこう}に{行|い}っている＿、{庭|にわ}の{花|はな}が{咲|さ}きました。', o: ['{間|あいだ}に', '{間|あいだ}', 'ながら', 'の{間|あいだ}に'], de: 'Während ich verreist war, sind die Blumen im Garten aufgeblüht.', why: 'Etwas passiert irgendwann innerhalb der Zeit → あいだに. あいだ allein heißt „die ganze Zeit“.', l: 28, t: 'aidani' },
    { s: '{夏休|なつやす}みの＿、{運転免許|うんてんめんきょ}を{取|と}りたいです。', o: ['{間|あいだ}に', '{間|あいだ}', '{中|ちゅう}', '{間|あいだ}で'], de: 'Während der Sommerferien möchte ich den Führerschein machen.', why: 'Etwas innerhalb der Zeit erledigen → のあいだに. ちゅう stünde ohne の (なつやすみちゅう).', l: 28, t: 'aidani' },
    { s: '{夕|ゆう}ご{飯|はん}を{食|た}べている＿、{地震|じしん}がありました。', o: ['{間|あいだ}に', '{間|あいだ}', 'ながら', '{間|あいだ}で'], de: 'Während wir zu Abend aßen, gab es ein Erdbeben.', why: 'Ein kurzes Ereignis innerhalb der Zeit → あいだに. あいだ allein passt nur zu einer Dauer.', l: 28, t: 'aidani' },
    { s: '{私|わたし}がシャワーを{浴|あ}びている＿、{妻|つま}が{朝|あさ}ご{飯|はん}を{作|つく}ってくれました。', o: ['{間|あいだ}に', 'ながら', '{中|ちゅう}に', 'の{間|あいだ}に'], de: 'Während ich duschte, hat meine Frau mir Frühstück gemacht.', why: 'Zwei Personen → nicht ながら. Sie erledigt etwas innerhalb der Zeit → 〜ているあいだに.', l: 28, t: 'aidani' },
    { s: '{子|こ}どもが＿、{急|いそ}いで{洗濯|せんたく}をしました。', o: ['{寝|ね}ている{間|あいだ}に', '{寝|ね}ながら', '{寝|ね}て{間|あいだ}に', '{寝|ね}るの{間|あいだ}に'], de: 'Während das Kind schlief, habe ich schnell die Wäsche gewaschen.', why: 'Andere Person → nicht ながら. Vor あいだに steht 〜ている: ねているあいだに.', l: 28, t: 'aidani' },
    { s: '{日本|にほん}にいる＿、{一度|いちど}{富士山|ふじさん}に{登|のぼ}りたいです。', o: ['{間|あいだ}に', '{間|あいだ}', 'ながら', '{中|ちゅう}'], de: 'Während ich in Japan bin, möchte ich einmal den Fuji besteigen.', why: 'Einmal etwas tun, irgendwann in der Zeit → あいだに. あいだ hieße „die ganze Zeit lang“.', l: 28, t: 'aidani' },
    { s: '{会議|かいぎ}＿、{社長|しゃちょう}が{部屋|へや}に{入|はい}ってきました。', o: ['の{間|あいだ}に', 'の{間|あいだ}', 'しながら', 'の{中|なか}に'], de: 'Während der Besprechung kam der Firmenchef ins Zimmer.', why: 'Ein Ereignis im Lauf der Besprechung → のあいだに. しながら geht nicht: anderes Subjekt (しゃちょう).', l: 28, t: 'aidani' },
    { s: '{昼休|ひるやす}み＿、{銀行|ぎんこう}へ{行|い}ってきます。', o: ['の{間|あいだ}に', 'の{間|あいだ}', 'ながら', 'の{中|なか}に'], de: 'Während der Mittagspause gehe ich kurz zur Bank.', why: 'Eine Erledigung innerhalb der Pause → のあいだに. のあいだ hieße „die ganze Pause lang“.', l: 28, t: 'aidani' },
    { s: '{妹|いもうと}が{見|み}ていない＿、チョコレートを{全部|ぜんぶ}{食|た}べてしまいました。', o: ['{間|あいだ}に', '{間|あいだ}', 'ながら', '{中|ちゅう}'], de: 'Während meine Schwester nicht hinsah, habe ich die ganze Schokolade aufgegessen.', why: 'In einem Moment innerhalb der Zeit → あいだに. Auch nach 〜ていない steht あいだに.', l: 28, t: 'aidani' },

    // Nomen + 中（ちゅう）: mitten in, gerade dabei
    { s: 'すみません、{田中|たなか}は{今|いま}＿です。', o: ['{会議中|かいぎちゅう}', '{会議|かいぎ}の{中|なか}', '{会議|かいぎ}ながら', '{会議|かいぎ}している{間|あいだ}'], de: 'Entschuldigung, Herr Tanaka ist gerade in einer Besprechung.', why: 'Nomen + ちゅう = gerade dabei. Ohne の; ながら braucht ein Verb.', l: 28, t: 'chuu' },
    { s: '＿は{携帯電話|けいたいでんわ}を{使|つか}わないでください。', o: ['{運転中|うんてんちゅう}', '{運転|うんてん}ながら', '{運転|うんてん}する{中|ちゅう}', '{運転|うんてん}の{中|なか}'], de: 'Bitte benutzen Sie während der Fahrt kein Handy.', why: 'ちゅう steht nur nach Nomen (うんてんちゅう), ながら nur nach Verben (うんてんしながら).', l: 28, t: 'chuu' },
    { s: 'この{道|みち}は{今|いま}＿ですから、{通|とお}れません。', o: ['{工事中|こうじちゅう}', '{工事|こうじ}の{中|なか}', '{工事|こうじ}の{間|あいだ}', '{工事|こうじ}ながら'], de: 'Diese Straße ist gerade eine Baustelle, man kommt nicht durch.', why: 'こうじちゅう = es wird gerade gebaut (oft auf Schildern). Vor です steht 〜ちゅう.', l: 28, t: 'chuu' },
    { s: '＿に{電話|でんわ}が{鳴|な}りました。', o: ['{食事中|しょくじちゅう}', '{食事|しょくじ}しながら', '{食事|しょくじ}の{中|なか}', '{食事|しょくじ}する{中|ちゅう}'], de: 'Während des Essens hat das Telefon geklingelt.', why: 'ちゅう direkt nach dem Nomen, nie nach einem Verb. Bei ながら müsste dieselbe Person handeln.', l: 28, t: 'chuu' },
    { s: '{両親|りょうしん}は{今|いま}ヨーロッパを＿です。', o: ['{旅行中|りょこうちゅう}', '{旅行|りょこう}ながら', '{旅行|りょこう}の{間|あいだ}', '{旅行|りょこう}する{中|ちゅう}'], de: 'Meine Eltern reisen gerade durch Europa.', why: 'りょこうちゅう = gerade auf Reisen. Vor です steht 〜ちゅう, nicht 〜のあいだ.', l: 28, t: 'chuu' },
    { s: 'トモヒロ{先生|せんせい}の＿に{寝|ね}てはいけませんよ。', o: ['{授業中|じゅぎょうちゅう}', '{授業|じゅぎょう}ながら', '{授業|じゅぎょう}の{中|なか}', '{授業|じゅぎょう}する{中|ちゅう}'], de: 'Während des Unterrichts von Tomohiro-sensei darf man nicht schlafen!', why: 'じゅぎょうちゅう = während des Unterrichts. ちゅう direkt nach dem Nomen, ohne の.', l: 28, t: 'chuu' },

    // とき: „während“ für einen Zeitabschnitt oder Zustand
    { s: '＿、{大阪|おおさか}に{住|す}んでいました。', o: ['{子|こ}どものとき', '{子|こ}どもとき', '{子|こ}どもなとき', '{子|こ}ども{中|ちゅう}'], de: 'Während meiner Kindheit habe ich in Osaka gewohnt.', why: 'Lebensabschnitt: Nomen + の + とき. 〜ちゅう nur bei Tätigkeiten wie かいぎちゅう.', l: 28, t: 'toki' },
    { s: 'バスに＿、{財布|さいふ}を{落|お}としました。', o: ['{乗|の}っているとき', '{乗|の}りながら', '{乗|の}っている{間|あいだ}', '{乗|の}るの{間|あいだ}'], de: 'Während ich im Bus saß, habe ich meinen Geldbeutel verloren.', why: 'Ein Ereignis: 〜ているとき (oder 〜ているあいだに). あいだ allein heißt „die ganze Zeit“, ながら braucht zwei Tätigkeiten.', l: 28, t: 'toki' },
    { s: '{若|わか}い＿、いろいろな{国|くに}を{旅行|りょこう}しました。', o: ['とき', 'のとき', 'なとき', '{中|ちゅう}'], de: 'Während meiner Jugend bin ich durch viele Länder gereist.', why: 'い-Adjektiv + とき, ohne の oder な. Für einen Lebensabschnitt passt とき.', l: 28, t: 'toki' },
  ],
  form: [
    // ながら: ます-Stamm
    { s: 'テレビを＿ながら{晩|ばん}ご{飯|はん}を{食|た}べます。', v: '見る', f: 'stem', de: 'Ich esse zu Abend, während ich fernsehe.', l: 28, t: 'nagara' },
    { s: 'スマホを＿ながら{歩|ある}かないでください。', v: '使う', f: 'stem', de: 'Bitte laufen Sie nicht herum, während Sie Ihr Smartphone benutzen.', l: 28, t: 'nagara' },
    { s: '{毎朝|まいあさ}コーヒーを＿ながら{新聞|しんぶん}を{読|よ}みます。', v: '飲む', f: 'stem', de: 'Jeden Morgen lese ich Zeitung, während ich Kaffee trinke.', l: 28, t: 'nagara' },
    { s: '{母|はは}は＿ながら3{人|にん}の{子|こ}どもを{育|そだ}てました。', v: '働く', f: 'stem', de: 'Meine Mutter hat drei Kinder großgezogen und dabei gearbeitet.', l: 28, t: 'nagara' },
    { s: '{辞書|じしょ}を＿ながら{日本語|にほんご}の{本|ほん}を{読|よ}みました。', v: '引く', f: 'stem', de: 'Ich habe ein japanisches Buch gelesen und dabei im Wörterbuch nachgeschlagen.', l: 28, t: 'nagara' },
    { s: '{友達|ともだち}と＿ながら{駅|えき}まで{歩|ある}きました。', v: '話す', f: 'stem', de: 'Ich bin zum Bahnhof gelaufen und habe mich dabei mit einer Freundin unterhalten.', l: 28, t: 'nagara' },
    { s: '{車|くるま}を＿ながら{電話|でんわ}をしてはいけません。', v: '運転する', f: 'stem', de: 'Man darf nicht telefonieren, während man Auto fährt.', l: 28, t: 'nagara' },
    { s: '{日本語|にほんご}のポッドキャストを＿ながら{散歩|さんぽ}します。', v: '聞く', f: 'stem', de: 'Ich gehe spazieren und höre dabei einen japanischen Podcast.', l: 28, t: 'nagara' },
    { s: '{妹|いもうと}はピアノを＿ながら{歌|うた}いました。', v: '弾く', f: 'stem', de: 'Meine jüngere Schwester hat gesungen und dabei Klavier gespielt.', l: 28, t: 'nagara' },
    { s: 'メモを＿ながらトモヒロ{先生|せんせい}の{話|はなし}を{聞|き}きました。', v: '取る', f: 'stem', de: 'Ich habe Tomohiro-sensei zugehört und mir dabei Notizen gemacht.', l: 28, t: 'nagara' },
    { s: 'ポップコーンを＿ながら{映画|えいが}を{見|み}ました。', v: '食べる', f: 'stem', de: 'Ich habe einen Film gesehen und dabei Popcorn gegessen.', l: 28, t: 'nagara' },
    { s: '{田中|たなか}さんは{写真|しゃしん}を＿ながら{旅行|りょこう}の{話|はなし}をしてくれました。', v: '見せる', f: 'stem', de: 'Herr Tanaka hat uns von seiner Reise erzählt und dabei Fotos gezeigt.', l: 28, t: 'nagara' },
    { s: '{海|うみ}のそばを＿ながら、いろいろなことを{考|かんが}えました。', v: '歩く', f: 'stem', de: 'Ich bin am Meer entlanggelaufen und habe dabei über vieles nachgedacht.', l: 28, t: 'nagara' },
    { s: '{喫茶店|きっさてん}で{友達|ともだち}を＿ながら、{手紙|てがみ}を{書|か}きました。', v: '待つ', f: 'stem', de: 'Im Café habe ich einen Brief geschrieben, während ich auf meinen Freund wartete.', l: 28, t: 'nagara' },
    { s: '{近所|きんじょ}の{子|こ}どもたちと＿ながら{日本語|にほんご}を{覚|おぼ}えました。', v: '遊ぶ', f: 'stem', de: 'Ich habe Japanisch gelernt, während ich mit den Kindern aus der Nachbarschaft spielte.', l: 28, t: 'nagara' },

    // 〜ている間: die ganze Zeit
    { s: '{赤|あか}ちゃんが＿いる{間|あいだ}、{静|しず}かに{音楽|おんがく}を{聞|き}いていました。', v: '寝る', f: 'te', de: 'Während das Baby schlief, habe ich leise Musik gehört.', l: 28, t: 'aida' },
    { s: '{妻|つま}が{買|か}い{物|もの}を＿いる{間|あいだ}、{私|わたし}は{車|くるま}の{中|なか}で{待|ま}っていました。', v: 'する', f: 'te', de: 'Während meine Frau einkaufte, habe ich im Auto gewartet.', l: 28, t: 'aida' },
    { s: '{飛行機|ひこうき}に＿いる{間|あいだ}、ずっと{映画|えいが}を{見|み}ていました。', v: '乗る', f: 'te', de: 'Während ich im Flugzeug saß, habe ich die ganze Zeit Filme geschaut.', l: 28, t: 'aida' },
    { s: 'トモヒロ{先生|せんせい}が＿いる{間|あいだ}、みんな{静|しず}かに{聞|き}いていました。', v: '話す', f: 'te', de: 'Während Tomohiro-sensei sprach, haben alle still zugehört.', l: 28, t: 'aida' },
    { s: '{雨|あめ}が＿いる{間|あいだ}、ずっと{家|うち}にいました。', v: '降る', f: 'te', de: 'Während es regnete, war ich die ganze Zeit zu Hause.', l: 28, t: 'aida' },
    { s: '{母|はは}が{料理|りょうり}を＿いる{間|あいだ}、{私|わたし}は{弟|おとうと}と{遊|あそ}んでいました。', v: '作る', f: 'te', de: 'Während meine Mutter kochte, habe ich mit meinem kleinen Bruder gespielt.', l: 28, t: 'aida' },
    { s: '{子|こ}どもが{家|うち}に＿{間|あいだ}は、たばこを{吸|す}いません。', v: 'いる', f: 'dict', de: 'Während die Kinder zu Hause sind, rauche ich nicht.', l: 28, t: 'aida' },

    // 〜ている間に: irgendwann in der Zeit
    { s: '{私|わたし}が＿いる{間|あいだ}に、{友達|ともだち}から{電話|でんわ}がありました。', v: '寝る', f: 'te', de: 'Während ich schlief, hat mich ein Freund angerufen.', l: 28, t: 'aidani' },
    { s: '{母|はは}が{買|か}い{物|もの}に＿いる{間|あいだ}に、{部屋|へや}を{掃除|そうじ}しました。', v: '行く', f: 'te', de: 'Während meine Mutter einkaufen war, habe ich das Zimmer geputzt.', l: 28, t: 'aidani' },
    { s: '{夫|おっと}がお{風呂|ふろ}に＿いる{間|あいだ}に、{誕生日|たんじょうび}のプレゼントを{隠|かく}しました。', v: '入る', f: 'te', de: 'Während mein Mann in der Badewanne saß, habe ich das Geburtstagsgeschenk versteckt.', l: 28, t: 'aidani' },
    { s: '{私|わたし}が{電話|でんわ}を＿いる{間|あいだ}に、{犬|いぬ}がケーキを{食|た}べてしまいました。', v: 'する', f: 'te', de: 'Während ich telefonierte, hat der Hund den Kuchen gefressen.', l: 28, t: 'aidani' },
    { s: 'バスを＿いる{間|あいだ}に、{雨|あめ}が{降|ふ}り{始|はじ}めました。', v: '待つ', f: 'te', de: 'Während ich auf den Bus wartete, fing es an zu regnen.', l: 28, t: 'aidani' },
    { s: '{子|こ}どもが{学校|がっこう}に＿{間|あいだ}に、{買|か}い{物|もの}に{行|い}きます。', v: 'いる', f: 'dict', de: 'Während die Kinder in der Schule sind, gehe ich einkaufen.', l: 28, t: 'aidani' },
    { s: '{両親|りょうしん}が＿{間|あいだ}に、{友達|ともだち}を{家|うち}に{呼|よ}びました。', v: 'いる', f: 'nai', de: 'Während meine Eltern nicht da waren, habe ich Freunde zu mir eingeladen.', l: 28, t: 'aidani' },

    // 〜ているとき
    { s: '{夜|よる}、{本|ほん}を＿いるとき、{急|きゅう}に{電気|でんき}が{消|き}えました。', v: '読む', f: 'te', de: 'Während ich abends las, ging plötzlich das Licht aus.', l: 28, t: 'toki' },
    { s: '{道|みち}を＿いるとき、{昔|むかし}の{友達|ともだち}に{会|あ}いました。', v: '歩く', f: 'te', de: 'Während ich die Straße entlangging, habe ich einen alten Freund getroffen.', l: 28, t: 'toki' },
    { s: '{包丁|ほうちょう}を＿いるとき、{指|ゆび}を{切|き}ってしまいました。', v: '使う', f: 'te', de: 'Während ich das Küchenmesser benutzte, habe ich mich in den Finger geschnitten.', l: 28, t: 'toki' },
  ],
};
