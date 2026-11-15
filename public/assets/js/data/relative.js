/* Relativsätze (Lektion 22). choice: Auswahl, form: Verb vor dem Nomen bilden, build: Satzbau */
export default {
  choice: [
    // Verb vor dem Nomen: einfache Form statt ます-Form
    { s: 'あそこで＿{人|ひと}はミラーさんです。', o: ['{本|ほん}を{読|よ}んでいる', '{本|ほん}を{読|よ}んでいます', '{本|ほん}を{読|よ}むの', '{本|ほん}が{読|よ}みます'], de: 'Die Person, die dort ein Buch liest, ist Herr Miller.', why: 'Vor einem Nomen steht die einfache Form: よんでいる ひと, nicht よんでいます.', l: 22, t: 'modify' },
    { s: '{昨日|きのう}＿{映画|えいが}はとてもおもしろかったです。', o: ['{見|み}た', '{見|み}ました', '{見|み}る', '{見|み}たの'], de: 'Der Film, den ich gestern gesehen habe, war sehr interessant.', why: 'きのう verlangt die Vergangenheit: みた. Vor dem Nomen keine ます-Form und kein の.', l: 22, t: 'modify' },
    { s: '{来週|らいしゅう}の{旅行|りょこう}に＿かばんを{買|か}いました。', o: ['{持|も}って{行|い}く', '{持|も}って{行|い}きます', '{持|も}って{行|い}った', '{持|も}って{行|い}くの'], de: 'Ich habe eine Tasche gekauft, die ich nächste Woche auf die Reise mitnehme.', why: 'Die Reise kommt erst noch: Wörterbuchform もっていく direkt vor かばん.', l: 22, t: 'modify' },
    { s: '{毎朝|まいあさ}{駅|えき}で＿{人|ひと}はワンさんです。', o: ['{会|あ}う', '{会|あ}います', '{会|あ}うの', '{会|あ}ったの'], de: 'Die Person, die ich jeden Morgen am Bahnhof treffe, ist Herr Wang.', why: 'まいあさ = Gewohnheit: Wörterbuchform あう direkt vor ひと, ohne の.', l: 22, t: 'modify' },
    { s: '{日本|にほん}でいちばん＿{所|ところ}はどこですか。', o: ['{行|い}きたい', '{行|い}きたいです', '{行|い}きたいの', '{行|い}きます'], de: 'Wohin in Japan möchtest du am liebsten fahren?', why: 'Auch die たい-Form steht direkt vor dem Nomen: いきたい ところ, ohne です oder の.', l: 22, t: 'modify' },
    { s: 'これは{大阪|おおさか}に{住|す}んでいる{妹|いもうと}に＿{荷物|にもつ}です。', o: ['{送|おく}る', '{送|おく}ります', '{送|おく}るの', '{送|おく}って'], de: 'Das ist das Paket, das ich meiner jüngeren Schwester schicke, die in Osaka wohnt.', why: 'Zwei Relativsätze: すんでいる いもうと und おくる にもつ – beide in der einfachen Form.', l: 22, t: 'modify' },

    // Zeitform im Relativsatz
    { s: '{去年|きょねん}＿ホテルにまた{行|い}きたいです。', o: ['{泊|と}まった', '{泊|と}まる', '{泊|と}まりました', '{泊|と}まったの'], de: 'Ich möchte wieder in das Hotel, in dem ich letztes Jahr übernachtet habe.', why: 'きょねん → Vergangenheit: とまった. Vor dem Nomen steht die einfache Form.', l: 22, t: 'modify' },
    { s: '{神戸|こうべ}は{母|はは}が＿{町|まち}です。', o: ['{生|う}まれた', '{生|う}まれる', '{生|う}まれました', '{生|う}まれたの'], de: 'Kobe ist die Stadt, in der meine Mutter geboren wurde.', why: 'Die Geburt liegt in der Vergangenheit: うまれた, direkt vor まち.', l: 22, t: 'modify' },
    { s: '{日本|にほん}へ＿{日|ひ}は{雨|あめ}でした。', o: ['{来|き}た', '{来|く}る', '{来|き}ました', '{来|き}たの'], de: 'An dem Tag, an dem ich nach Japan kam, hat es geregnet.', why: 'Das ist schon geschehen: きた ひ. Einfache Form direkt vor dem Nomen.', l: 22, t: 'modify' },
    { s: '{私|わたし}たちが{初|はじ}めて＿{所|ところ}はこの{喫茶店|きっさてん}です。', o: ['{会|あ}った', '{会|あ}う', '{会|あ}いました', '{会|あ}ったの'], de: 'Der Ort, an dem wir uns zum ersten Mal getroffen haben, ist dieses Café.', why: 'Schon geschehen: あった. Die einfache Vergangenheit steht direkt vor ところ.', l: 22, t: 'modify' },
    { s: '{先月|せんげつ}{駅|えき}の{前|まえ}に＿{店|みせ}はパンがおいしいです。', o: ['できた', 'できる', 'できました', 'できたの'], de: 'Der Laden, der letzten Monat vor dem Bahnhof aufgemacht hat, hat leckeres Brot.', why: 'せんげつ → schon geschehen: できた. Vor dem Nomen ohne ます und ohne の.', l: 22, t: 'modify' },
    { s: '{明日|あした}のパーティーに＿{服|ふく}がありません。', o: ['{着|き}て{行|い}く', '{着|き}て{行|い}った', '{着|き}て{行|い}きます', '{着|き}て{行|い}くの'], de: 'Ich habe nichts, was ich morgen zur Party anziehen kann.', why: 'Die Party ist morgen: きていく (Wörterbuchform). Vor dem Nomen keine ます-Form.', l: 22, t: 'modify' },
    { s: '{今日|きょう}は{友達|ともだち}と{映画|えいが}を＿{約束|やくそく}があります。', o: ['{見|み}る', '{見|み}ます', '{見|み}た', '{見|み}るの'], de: 'Ich bin heute mit einem Freund verabredet, um einen Film zu sehen.', why: 'Was man vorhat: Wörterbuchform + やくそく. Vor dem Nomen keine ます-Form.', l: 22, t: 'modify' },
    { s: '{銀行|ぎんこう}へ＿{用事|ようじ}がありますから、{早|はや}く{帰|かえ}ります。', o: ['{行|い}く', '{行|い}きます', '{行|い}った', '{行|い}って'], de: 'Ich muss noch etwas auf der Bank erledigen, deshalb gehe ich früher.', why: 'Das kommt erst noch: Wörterbuchform いく + ようじ.', l: 22, t: 'modify' },
    { s: '{試験|しけん}で＿{問題|もんだい}を{先生|せんせい}に{聞|き}きました。', o: ['{分|わ}からなかった', '{分|わ}かりませんでした', '{分|わ}からなかったの', '{分|わ}からなくて'], de: 'Ich habe die Lehrerin nach den Aufgaben gefragt, die ich in der Prüfung nicht verstanden habe.', why: 'Verneinte Vergangenheit vor dem Nomen: わからなかった, nicht ませんでした.', l: 22, t: 'modify' },
    { s: 'これは{何|なん}に＿{物|もの}ですか。', o: ['{使|つか}う', '{使|つか}います', '{使|つか}うの', '{使|つか}って'], de: 'Wofür benutzt man das?', why: 'Vor もの steht die Wörterbuchform: なんに つかう もの.', l: 22, t: 'modify' },

    // Verneinte Relativsätze
    { s: '{私|わたし}のクラスには{肉|にく}を＿{人|ひと}が3{人|にん}います。', o: ['{食|た}べない', '{食|た}べません', '{食|た}べないの', '{食|た}べないで'], de: 'In meiner Klasse gibt es drei Leute, die kein Fleisch essen.', why: 'Verneinung vor dem Nomen: ない-Form たべない. ません steht nie vor einem Nomen.', l: 22, t: 'modify' },
    { s: '{昨日|きのう}の{会議|かいぎ}に＿{人|ひと}は、この{資料|しりょう}を{読|よ}んでください。', o: ['{来|こ}なかった', '{来|こ}ない', '{来|き}ませんでした', '{来|こ}なかったの'], de: 'Wer gestern nicht bei der Besprechung war, liest bitte diese Unterlagen.', why: 'Gestern → verneinte Vergangenheit: こなかった. ませんでした steht nicht vor einem Nomen.', l: 22, t: 'modify' },
    { s: '{宿題|しゅくだい}をまだ＿{人|ひと}は、{明日|あした}{出|だ}してください。', o: ['{出|だ}していない', '{出|だ}していません', '{出|だ}さなかった', '{出|だ}していないの'], de: 'Wer die Hausaufgaben noch nicht abgegeben hat, gibt sie bitte morgen ab.', why: 'まだ + noch nicht: 〜ていない. Vor dem Nomen nicht ません und kein の.', l: 31, t: 'modify' },

    // ている-Formen: Kleidung, Wohnort, laufende Handlung
    { s: '{赤|あか}いセーターを＿{人|ひと}が{佐藤|さとう}さんです。', o: ['{着|き}ている', '{着|き}ています', 'はいている', '{着|き}ているの'], de: 'Die Frau im roten Pullover ist Frau Sato.', why: 'Pullover: きる (はく nur für Hose, Rock, Schuhe). Vor dem Nomen: きている.', l: 22, t: 'modify' },
    { s: '{帽子|ぼうし}を＿{男|おとこ}の{子|こ}はだれですか。', o: ['かぶっている', 'かぶっています', 'かけている', 'はいている'], de: 'Wer ist der Junge mit der Mütze?', why: 'Hut und Mütze: かぶる. Vor dem Nomen die einfache Form かぶっている.', l: 22, t: 'modify' },
    { s: '{昨日|きのう}のパーティーでマリアさんが＿{服|ふく}はとてもすてきでした。', o: ['{着|き}ていた', '{着|き}ています', '{着|き}る', '{着|き}ていたの'], de: 'Die Kleidung, die Maria gestern auf der Party trug, war sehr schick.', why: 'Gestern: Vergangenheit von きている → きていた. Keine ます-Form vor dem Nomen.', l: 22, t: 'modify' },
    { s: '{友達|ともだち}が＿{店|みせ}で{晩|ばん}ご{飯|はん}を{食|た}べました。', o: ['アルバイトをしている', 'アルバイトをしています', 'アルバイトをするの', 'アルバイトがしている'], de: 'Ich habe in dem Lokal zu Abend gegessen, in dem mein Freund jobbt.', why: 'Relativsatz vor みせで: einfache Form している, das Objekt mit を.', l: 22, t: 'modify' },
    { s: 'トモヒロ{先生|せんせい}が＿{辞書|じしょ}を{買|か}いました。', o: ['{使|つか}っている', '{使|つか}っています', '{使|つか}っての', '{使|つか}うの'], de: 'Ich habe das Wörterbuch gekauft, das Tomohiro-sensei benutzt.', why: 'Vor dem Nomen nur die einfache Form: つかっている じしょ, ohne の.', l: 22, t: 'modify' },

    // Subjekt im Relativsatz: が oder の, nie は
    { s: 'これは{父|ちち}＿{撮|と}った{写真|しゃしん}です。', o: ['が', 'は', 'を', 'で'], de: 'Das ist ein Foto, das mein Vater gemacht hat.', why: 'Das Subjekt im Relativsatz steht mit が. は gehört zum Hauptsatz (これは).', l: 22, t: 'modify' },
    { s: '{友達|ともだち}＿{住|す}んでいる{町|まち}は{海|うみ}の{近|ちか}くです。', o: ['の', 'は', 'を', 'に'], de: 'Die Stadt, in der mein Freund wohnt, liegt nah am Meer.', why: 'Im Relativsatz darf das Subjekt statt が auch の haben: ともだちの すんでいる まち.', l: 22, t: 'modify' },
    { s: '＿お{弁当|べんとう}はとてもおいしかったです。', o: ['{妻|つま}が{作|つく}った', '{妻|つま}は{作|つく}った', '{妻|つま}が{作|つく}りました', '{妻|つま}が{作|つく}ったの'], de: 'Das Bentō, das meine Frau gemacht hat, war sehr lecker.', why: 'Relativsatz: Subjekt mit が, einfache Form, kein の: つまが つくった おべんとう.', l: 22, t: 'modify' },
    { s: '＿{絵|え}はどれですか。', o: ['カリナさんがかいた', 'カリナさんはかいた', 'カリナさんがかきました', 'カリナさんがかいたの'], de: 'Welches ist das Bild, das Karina gemalt hat?', why: 'Subjekt im Relativsatz mit が, einfache Form direkt vor dem Nomen.', l: 22, t: 'modify' },
    { s: '{日本語|にほんご}＿{分|わ}かる{人|ひと}を{知|し}っていますか。', o: ['が', 'を', 'は', 'で'], de: 'Kennst du jemanden, der Japanisch versteht?', why: 'わかる nimmt が – auch im Relativsatz: にほんごが わかる ひと.', l: 22, t: 'modify' },
    { s: '{雪|ゆき}＿たくさん{降|ふ}る{所|ところ}へ{行|い}きたいです。', o: ['が', 'を', 'は', 'で'], de: 'Ich möchte an einen Ort fahren, an dem viel Schnee fällt.', why: 'Der Schnee ist das Subjekt von ふる: が. Im Relativsatz nicht は.', l: 22, t: 'modify' },
    { s: 'ワット{先生|せんせい}はユーモアが＿{人|ひと}です。', o: ['ある', 'あります', 'いる', 'あるの'], de: 'Herr Watt ist ein Mensch mit Humor.', why: 'ユーモアが ある (nicht いる). Vor dem Nomen die einfache Form ある.', l: 22, t: 'modify' },
    { s: '{日本|にほん}へ{行|い}った＿{人|ひと}はいますか。', o: ['ことがある', 'ことがあります', 'ことがあるの', 'ことがいる'], de: 'Gibt es jemanden, der schon einmal in Japan war?', why: 'Auch 〜ことがある steht in der einfachen Form vor dem Nomen: いった ことが ある ひと.', l: 22, t: 'modify' },

    // Adjektive im Relativsatz
    { s: 'あの＿{人|ひと}はだれですか。', o: ['{背|せ}が{高|たか}い', '{背|せ}が{高|たか}いの', '{背|せ}が{高|たか}いです', '{背|せ}は{高|たか}い'], de: 'Wer ist die große Person dort?', why: 'い-Adjektiv direkt vor dem Nomen; im Relativsatz が statt は: せが たかい ひと.', l: 22, t: 'modify' },
    { s: '{髪|かみ}が＿{女|おんな}の{人|ひと}が{木村|きむら}さんです。', o: ['{長|なが}い', '{長|なが}いな', '{長|なが}くて', '{長|なが}いです'], de: 'Die Frau mit den langen Haaren ist Frau Kimura.', why: 'い-Adjektive stehen ohne な direkt vor dem Nomen: かみが ながい おんなの ひと.', l: 22, t: 'modify' },
    { s: 'ここは＿{公園|こうえん}ですね。', o: ['{静|しず}かな', '{静|しず}かの', '{静|しず}かだ', '{静|しず}かです'], de: 'Das ist aber ein ruhiger Park!', why: 'な-Adjektiv vor einem Nomen: しずかな こうえん. Nicht の, だ oder です.', l: 22, t: 'modify' },
    { s: '{私|わたし}がいちばん＿{食|た}べ{物|もの}はお{寿司|すし}です。', o: ['{好|す}きな', '{好|す}きの', '{好|す}きだ', '{好|す}きです'], de: 'Mein Lieblingsessen ist Sushi.', why: 'すき ist ein な-Adjektiv: vor dem Nomen すきな, nicht すきの.', l: 22, t: 'modify' },
    { s: '＿{町|まち}に{住|す}みたいです。', o: ['{交通|こうつう}が{便利|べんり}な', '{交通|こうつう}が{便利|べんり}の', '{交通|こうつう}は{便利|べんり}な', '{交通|こうつう}が{便利|べんり}だ'], de: 'Ich möchte in einer Stadt mit guter Verkehrsanbindung wohnen.', why: 'な-Adjektiv vor dem Nomen: べんりな. Im Relativsatz が, nicht は.', l: 22, t: 'modify' },
    { s: '{駅|えき}から{近|ちか}くて、＿アパートがいいです。', o: ['{家賃|やちん}が{安|やす}い', '{家賃|やちん}は{安|やす}い', '{家賃|やちん}が{安|やす}いの', '{家賃|やちん}が{安|やす}いです'], de: 'Ich hätte gern eine Wohnung nah am Bahnhof, deren Miete günstig ist.', why: 'Im Relativsatz が statt は; das い-Adjektiv steht ohne の oder です vor dem Nomen.', l: 22, t: 'modify' },
    { s: '{安|やす}くて＿レストランを{知|し}っていますか。', o: ['おいしい', 'おいしいな', 'おいしいの', 'おいしくて'], de: 'Kennst du ein günstiges und leckeres Restaurant?', why: 'Das letzte Adjektiv vor dem Nomen steht in der Grundform: やすくて おいしい レストラン.', l: 22, t: 'modify' },
    { s: '{会議|かいぎ}は{皆|みな}さんの{都合|つごう}が＿{日|ひ}にしましょう。', o: ['いい', 'いいの', 'よくて', 'いいです'], de: 'Legen wir die Besprechung auf einen Tag, der allen passt.', why: 'い-Adjektiv direkt vor dem Nomen: つごうが いい ひ.', l: 22, t: 'modify' },

    // Reihenfolge: der Relativsatz steht vor dem Nomen
    { s: '＿を{見|み}せてください。', o: ['{京都|きょうと}で{撮|と}った{写真|しゃしん}', '{写真|しゃしん}を{京都|きょうと}で{撮|と}った', '{京都|きょうと}で{撮|と}りました{写真|しゃしん}', '{写真|しゃしん}が{京都|きょうと}で{撮|と}った'], de: 'Zeig mir bitte die Fotos, die du in Kyoto gemacht hast.', why: 'Der Relativsatz steht immer vor dem Nomen: きょうとで とった しゃしん.', l: 22, t: 'modify' },
    { s: '{私|わたし}は＿が{好|す}きです。', o: ['{母|はは}が{作|つく}る{料理|りょうり}', '{料理|りょうり}は{母|はは}が{作|つく}る', '{母|はは}は{作|つく}る{料理|りょうり}', '{母|はは}が{作|つく}ります{料理|りょうり}'], de: 'Ich mag das Essen, das meine Mutter kocht.', why: 'Relativsatz vor dem Nomen, das Subjekt darin mit が: ははが つくる りょうり.', l: 22, t: 'modify' },
    { s: '＿は{何|なん}ですか。', o: ['トモヒロ{先生|せんせい}が{好|す}きな{日本|にほん}の{歌|うた}', '{日本|にほん}の{歌|うた}はトモヒロ{先生|せんせい}が{好|す}きな', 'トモヒロ{先生|せんせい}は{好|す}きな{日本|にほん}の{歌|うた}', 'トモヒロ{先生|せんせい}が{好|す}きの{日本|にほん}の{歌|うた}'], de: 'Welches japanische Lied mag Tomohiro-sensei?', why: 'Erst der Relativsatz, dann das Nomen; Subjekt mit が, すき + な.', l: 22, t: 'modify' },
  ],

  form: [
    // Wörterbuchform
    { s: 'めがねをかけて＿{人|ひと}が{田中|たなか}さんです。', v: 'いる', f: 'dict', de: 'Die Person mit Brille ist Frau Tanaka.', l: 22 },
    { s: '{毎朝|まいあさ}＿{電車|でんしゃ}はいつも{人|ひと}が{多|おお}いです。', v: '乗る', f: 'dict', de: 'In dem Zug, mit dem ich jeden Morgen fahre, sind immer viele Leute.', l: 22 },
    { s: '{来月|らいげつ}{日本|にほん}で＿ホテルをインターネットで{予約|よやく}しました。', v: '泊まる', f: 'dict', de: 'Ich habe das Hotel, in dem ich nächsten Monat in Japan übernachte, im Internet reserviert.', l: 22 },
    { s: '{母|はは}の{誕生日|たんじょうび}に＿プレゼントはもう{買|か}いました。', v: 'あげる', f: 'dict', de: 'Das Geschenk, das ich meiner Mutter zum Geburtstag schenke, habe ich schon gekauft.', l: 22 },
    { s: 'これは{日本|にほん}の{子|こ}どもがよく＿{歌|うた}です。', v: '歌う', f: 'dict', de: 'Das ist ein Lied, das japanische Kinder oft singen.', l: 22 },
    { s: '{車|くるま}を＿{人|ひと}はお{酒|さけ}を{飲|の}まないでください。', v: '運転する', f: 'dict', de: 'Wer Auto fährt, trinkt bitte keinen Alkohol.', l: 22 },
    { s: '{雨|あめ}が＿{日|ひ}は、バスで{会社|かいしゃ}へ{行|い}きます。', v: '降る', f: 'dict', de: 'An Tagen, an denen es regnet, fahre ich mit dem Bus zur Arbeit.', l: 22 },
    { s: 'いつも＿スーパーは{駅|えき}の{前|まえ}にあります。', v: '買い物する', f: 'dict', de: 'Der Supermarkt, in dem ich immer einkaufe, ist vor dem Bahnhof.', l: 22 },
    { s: '{今朝|けさ}は{忙|いそが}しくて、シャワーを＿{時間|じかん}がありませんでした。', v: '浴びる', f: 'dict', de: 'Heute Morgen war ich so beschäftigt, dass ich keine Zeit zum Duschen hatte.', l: 22 },
    { s: '{部屋|へや}を＿ロボットがほしいです。', v: '掃除する', f: 'dict', de: 'Ich hätte gern einen Roboter, der das Zimmer putzt.', l: 22 },
    { s: '{明日|あした}{東京|とうきょう}で＿{会議|かいぎ}は{何時|なんじ}からですか。', v: 'ある', f: 'dict', de: 'Um wie viel Uhr beginnt die Besprechung, die morgen in Tokio stattfindet?', l: 22 },

    // た-Form
    { s: 'これは{昨日|きのう}デパートで＿かばんです。', v: '買う', f: 'ta', de: 'Das ist die Tasche, die ich gestern im Kaufhaus gekauft habe.', l: 22 },
    { s: '{昨日|きのう}{図書館|としょかん}で＿{本|ほん}はとてもおもしろいです。', v: '借りる', f: 'ta', de: 'Das Buch, das ich gestern in der Bibliothek ausgeliehen habe, ist sehr interessant.', l: 22 },
    { s: 'ここは{私|わたし}が＿{病院|びょういん}です。', v: '生まれる', f: 'ta', de: 'Das ist das Krankenhaus, in dem ich geboren wurde.', l: 22 },
    { s: '{友達|ともだち}に＿チョコレートはとてもおいしかったです。', v: 'もらう', f: 'ta', de: 'Die Schokolade, die ich von einer Freundin bekommen habe, war sehr lecker.', l: 22 },
    { s: '{昨日|きのう}＿{傘|かさ}は{駅|えき}にありました。', v: 'なくす', f: 'ta', de: 'Der Schirm, den ich gestern verloren habe, war am Bahnhof.', l: 22 },
    { s: '{昨日|きのう}の{晩|ばん}みんなで＿ワインは{高|たか}かったです。', v: '飲む', f: 'ta', de: 'Der Wein, den wir gestern Abend zusammen getrunken haben, war teuer.', l: 22 },
    { s: '{海|うみ}で＿ことがない{人|ひと}は{少|すく}ないと{思|おも}います。', v: '泳ぐ', f: 'ta', de: 'Ich glaube, es gibt nur wenige, die noch nie im Meer geschwommen sind.', l: 22 },
    { s: '{先月|せんげつ}{日本|にほん}から＿{友達|ともだち}といろいろな{所|ところ}へ{行|い}きました。', v: '来る', f: 'ta', de: 'Mit einem Freund, der letzten Monat aus Japan gekommen ist, war ich an vielen Orten.', l: 22 },
    { s: '{日本語|にほんご}で＿{手紙|てがみ}をトモヒロ{先生|せんせい}に{見|み}せました。', v: '書く', f: 'ta', de: 'Den Brief, den ich auf Japanisch geschrieben habe, habe ich Tomohiro-sensei gezeigt.', l: 22 },
    { s: '{今朝|けさ}＿シャツはもうかわきました。', v: '洗う', f: 'ta', de: 'Das Hemd, das ich heute Morgen gewaschen habe, ist schon trocken.', l: 22 },
    { s: '{先週|せんしゅう}＿パソコンがまた{動|うご}きません。', v: '修理する', f: 'ta', de: 'Der Computer, den ich letzte Woche repariert habe, funktioniert schon wieder nicht.', l: 22 },
    { s: '{日本|にほん}で{使|つか}って＿パソコンはもう{古|ふる}いです。', v: 'いる', f: 'ta', de: 'Der Computer, den ich in Japan benutzt habe, ist inzwischen alt.', l: 22 },

    // ない-Form und なかった-Form
    { s: 'たばこを＿{人|ひと}はこちらの{部屋|へや}を{使|つか}ってください。', v: '吸う', f: 'nai', de: 'Wer nicht raucht, benutzt bitte diesen Raum hier.', l: 22 },
    { s: '＿ことばは{辞書|じしょ}で{調|しら}べてください。', v: '分かる', f: 'nai', de: 'Schlagen Sie Wörter, die Sie nicht verstehen, bitte im Wörterbuch nach.', l: 22 },
    { s: '＿{雑誌|ざっし}は{友達|ともだち}にあげます。', v: '要る', f: 'nai', de: 'Die Zeitschriften, die ich nicht brauche, gebe ich einem Freund.', l: 22 },
    { s: 'どこへも＿{日|ひ}は、うちで{料理|りょうり}を{作|つく}ります。', v: '出かける', f: 'nai', de: 'An Tagen, an denen ich nirgendwohin gehe, koche ich zu Hause.', l: 22 },
    { s: '{昨日|きのう}＿{仕事|しごと}を{今日|きょう}します。', v: '終わる', f: 'nakatta', de: 'Die Arbeit, die gestern nicht fertig geworden ist, mache ich heute.', l: 22 },
    { s: '{旅行|りょこう}に＿{人|ひと}にお{土産|みやげ}を{買|か}いました。', v: '行く', f: 'nakatta', de: 'Für die, die nicht mit auf die Reise gefahren sind, habe ich Mitbringsel gekauft.', l: 22 },
    { s: '{去年|きょねん}＿{服|ふく}は{捨|す}てます。', v: '着る', f: 'nakatta', de: 'Kleidung, die ich letztes Jahr nicht getragen habe, werfe ich weg.', l: 22 },

    // て-Form + いる/いた/いない
    { s: '{北海道|ほっかいどう}に＿いる{姉|あね}から{手紙|てがみ}が{来|き}ました。', v: '住む', f: 'te', de: 'Von meiner älteren Schwester, die in Hokkaido wohnt, ist ein Brief gekommen.', l: 22 },
    { s: 'あそこでピアノを＿いる{人|ひと}は{山田|やまだ}さんの{奥|おく}さんです。', v: '弾く', f: 'te', de: 'Die Frau, die dort Klavier spielt, ist die Frau von Herrn Yamada.', l: 22 },
    { s: '{黒|くろ}い{靴|くつ}を＿いる{人|ひと}が{松本|まつもと}さんです。', v: 'はく', f: 'te', de: 'Der Mann mit den schwarzen Schuhen ist Herr Matsumoto.', l: 22 },
    { s: '{今|いま}{日本語|にほんご}を＿いる{友達|ともだち}と{一緒|いっしょ}に{日本|にほん}へ{行|い}きます。', v: '習う', f: 'te', de: 'Ich fahre mit einer Freundin, die gerade Japanisch lernt, nach Japan.', l: 22 },
    { s: '{私|わたし}の{会社|かいしゃ}には＿いない{人|ひと}が{多|おお}いです。', v: '結婚する', f: 'te', de: 'In meiner Firma sind viele nicht verheiratet.', l: 22 },
    { s: '{傘|かさ}を＿いない{人|ひと}は、{受付|うけつけ}で{借|か}りてください。', v: '持つ', f: 'te', de: 'Wer keinen Schirm dabeihat, leiht sich bitte an der Rezeption einen.', l: 22 },
    { s: '{去年|きょねん}まで＿いた{会社|かいしゃ}は{大阪|おおさか}にあります。', v: '働く', f: 'te', de: 'Die Firma, bei der ich bis letztes Jahr gearbeitet habe, ist in Osaka.', l: 22 },
    { s: '{駅|えき}の{前|まえ}で＿いる{人|ひと}がイーさんです。', v: '待つ', f: 'te', de: 'Die Frau, die vor dem Bahnhof wartet, ist Frau Lee.', l: 22 },
    { s: 'カリナさんの{住所|じゅうしょ}を＿いる{人|ひと}はいませんか。', v: '知る', f: 'te', de: 'Kennt jemand Karinas Adresse?', l: 22 },
    { s: '＿いる{人|ひと}は{早|はや}く{寝|ね}てください。', v: '疲れる', f: 'te', de: 'Wer müde ist, geht bitte früh schlafen.', l: 22 },
  ],

  build: [
    { de: 'Das ist der Kuchen, den meine Mutter gebacken hat.', c: ['これは', '{母|はは}が', '{作|つく}った', 'ケーキです。'], l: 22 },
    { de: 'Die Person, die am Fenster sitzt, ist unsere neue Lehrerin.', c: ['{窓|まど}の{近|ちか}くに', '{座|すわ}っている', '{人|ひと}が', '{新|あたら}しい{先生|せんせい}です。'], l: 22 },
    { de: 'Ich habe meinem jüngeren Bruder das Buch geliehen, das ich letzte Woche gekauft habe.', c: ['{先週|せんしゅう}', '{買|か}った', '{本|ほん}を', '{弟|おとうと}に', '{貸|か}しました。'], l: 22, alt: [[3, 0, 1, 2, 4]] },
    { de: 'Die Wohnung, in der Herr Miller wohnt, ist nah am Bahnhof.', c: ['ミラーさんが', '{住|す}んでいる', 'アパートは', '{駅|えき}から', '{近|ちか}いです。'], l: 22 },
    { de: 'Ich möchte jemanden heiraten, der gut kochen kann.', c: ['{私|わたし}は', '{料理|りょうり}が', '{上手|じょうず}な', '{人|ひと}と', '{結婚|けっこん}したいです。'], l: 22 },
    { de: 'Heute Abend bin ich mit einem Freund verabredet.', c: ['{今晩|こんばん}は', '{友達|ともだち}と', '{会|あ}う', '{約束|やくそく}が', 'あります。'], l: 22 },
    { de: 'Der Mann im weißen Hemd ist Herr Gupta.', c: ['{白|しろ}いシャツを', '{着|き}ている', '{人|ひと}が', 'グプタさんです。'], l: 22 },
    { de: 'Das ist ein Foto, das ich letztes Jahr in Japan gemacht habe.', c: ['これは', '{私|わたし}が', '{去年|きょねん}', '{日本|にほん}で', '{撮|と}った', '{写真|しゃしん}です。'], l: 22, alt: [[0, 2, 1, 3, 4, 5]] },
    { de: 'Maria ist eine Frau mit langen Haaren und großen Augen.', c: ['マリアさんは', '{髪|かみ}が', '{長|なが}くて', '{目|め}が', '{大|おお}きい', '{人|ひと}です。'], l: 22 },
    { de: 'Wir haben alle zusammen das Lied gesungen, das wir bei Tomohiro-sensei gelernt haben.', c: ['トモヒロ{先生|せんせい}に', '{習|なら}った', '{歌|うた}を', 'みんなで', '{歌|うた}いました。'], l: 22, alt: [[3, 0, 1, 2, 4]] },
    { de: 'Ich möchte in einer Wohnung mit einem Tatami-Zimmer wohnen.', c: ['{和室|わしつ}が', 'ある', 'アパートに', '{住|す}みたいです。'], l: 22 },
    { de: 'Nächste Woche kommt mich ein Freund besuchen, der in Osaka arbeitet.', c: ['{来週|らいしゅう}', '{大阪|おおさか}で', '{働|はたら}いている', '{友達|ともだち}が', '{遊|あそ}びに', '{来|き}ます。'], l: 22, alt: [[1, 2, 3, 0, 4, 5]] },
    { de: 'Wer gestern gefehlt hat, fragt bitte die Lehrerin nach den Hausaufgaben.', c: ['{昨日|きのう}', '{休|やす}んだ', '{人|ひと}は', '{先生|せんせい}に', '{宿題|しゅくだい}を', '{聞|き}いてください。'], l: 22, alt: [[0, 1, 2, 4, 3, 5]] },
    { de: 'Ich bin so beschäftigt, dass ich keine Zeit zum Zeitunglesen habe.', c: ['{忙|いそが}しくて', '{新聞|しんぶん}を', '{読|よ}む', '{時間|じかん}が', 'ありません。'], l: 22 },
    { de: 'Ich habe ein Foto mit einer Frau im Kimono gemacht.', c: ['{着物|きもの}を', '{着|き}た', '{女|おんな}の{人|ひと}と', '{写真|しゃしん}を', '{撮|と}りました。'], l: 22 },
    { de: 'Das erste Gericht, das ich in Japan gegessen habe, war Tempura.', c: ['{私|わたし}が', '{初|はじ}めて', '{日本|にほん}で', '{食|た}べた', '{料理|りょうり}は', 'てんぷらでした。'], l: 22, alt: [[0, 2, 1, 3, 4, 5]] },
    { de: 'Ich habe den Namen des Films vergessen, den ich letzte Woche gesehen habe.', c: ['{先週|せんしゅう}', '{見|み}た', '{映画|えいが}の', '{名前|なまえ}を', '{忘|わす}れました。'], l: 22 },
    { de: 'Die Person, die vor dem Bahnhof Blumen verkauft, ist sehr freundlich.', c: ['{駅|えき}の{前|まえ}で', '{花|はな}を', '{売|う}っている', '{人|ひと}は', 'とても{親切|しんせつ}です。'], l: 22 },
    { de: 'Ich habe in einem Hotel mit großen, hellen Zimmern übernachtet.', c: ['{部屋|へや}が', '{広|ひろ}くて', '{明|あか}るい', 'ホテルに', '{泊|と}まりました。'], l: 22 },
    { de: 'Das ist eine Süßigkeit, die in Japan berühmt ist.', c: ['これは', '{日本|にほん}で', '{有名|ゆうめい}な', 'お{菓子|かし}です。'], l: 22 },
    { de: 'Heute tragen nur wenige eine Krawatte, oder?', c: ['{今日|きょう}は', 'ネクタイを', 'している', '{人|ひと}が', '{少|すく}ないですね。'], l: 22 },
    { de: 'Ich habe die Uhr verloren, die ich zum Geburtstag von meinem Vater bekommen habe.', c: ['{誕生日|たんじょうび}に', '{父|ちち}に', 'もらった', '{時計|とけい}を', 'なくしました。'], l: 22 },
    { de: 'Herr Wang, ist das Buch interessant, das Sie gerade lesen?', c: ['ワンさんが', '{今|いま}', '{読|よ}んでいる', '{本|ほん}は', 'おもしろいですか。'], l: 22, alt: [[1, 0, 2, 3, 4]] },
    { de: 'Der höchste Berg Japans ist der Fuji.', c: ['{日本|にほん}で', 'いちばん', '{高|たか}い', '{山|やま}は', '{富士山|ふじさん}です。'], l: 22 },
    { de: 'Der Park, in dem ich sonntags mit meiner Familie spazieren gehe, liegt bei uns in der Nähe.', c: ['{日曜日|にちようび}に', '{家族|かぞく}と', '{散歩|さんぽ}する', '{公園|こうえん}は', 'うちの{近|ちか}くに', 'あります。'], l: 22, alt: [[1, 0, 2, 3, 4, 5]] },
  ],
};
