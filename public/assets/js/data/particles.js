/* Partikel-Lückentexte. s: Satz mit ＿ pro Lücke, a: Antwort pro Lücke (Alternativen mit /), de, why, l: Lektion */
export default [
  // Lektion 1
  { s: 'シュミットさん＿エンジニアです。', a: ['は'], de: 'Herr Schmidt ist Ingenieur.', why: 'は markiert das Thema: „Was Herrn Schmidt betrifft …“', l: 1 },
  { s: '{私|わたし}は{学生|がくせい}じゃありません。マリアさん＿{学生|がくせい}じゃありません。', a: ['も'], de: 'Ich bin kein Student. Maria ist auch keine Studentin.', why: 'も gilt auch bei Verneinung: „auch nicht“.', l: 1 },
  { s: 'ハンスさんはミュンヘン{大学|だいがく}＿{学生|がくせい}です。', a: ['の'], de: 'Hans ist Student an der Universität München.', why: 'の verbindet zwei Nomen: Zugehörigkeit (Student der Uni München).', l: 1 },
  { s: 'あの{方|かた}＿どなたです＿。', a: ['は', 'か'], de: 'Wer ist die Person dort drüben?', why: 'は: Thema „die Person dort“; か am Ende macht den Satz zur Frage.', l: 1 },
  { s: '{私|わたし}＿{名前|なまえ}はシュミットです。ドイツ＿{来|き}ました。', a: ['の', 'から'], de: 'Mein Name ist Schmidt. Ich komme aus Deutschland.', why: 'の: Besitz (mein Name); から: Herkunft – „aus Deutschland gekommen“.', l: 1 },

  // Lektion 2
  { s: 'これは{私|わたし}＿{傘|かさ}です。それ＿{私|わたし}のです。', a: ['の', 'も'], de: 'Das ist mein Regenschirm. Der da ist auch meiner.', why: 'の: Besitz (mein Schirm); も: „auch“ statt は.', l: 2 },
  { s: 'それはコンピューター＿{本|ほん}です。', a: ['の'], de: 'Das ist ein Buch über Computer.', why: 'の verbindet Nomen, hier den Inhalt: ein Buch über Computer.', l: 2 },
  { s: 'このかばんは{田中|たなか}さん＿です。', a: ['の'], de: 'Diese Tasche gehört Frau Tanaka.', why: 'N＋の allein = „die von N“; かばん wird nicht wiederholt.', l: 2 },
  { s: 'これは「シ」です＿、「ツ」ですか。', a: ['か'], de: 'Ist das ein „shi“ oder ein „tsu“?', why: 'Auswahlfrage: Beide Möglichkeiten enden mit ですか.', l: 2 },
  { s: 'それは{何|なん}＿{雑誌|ざっし}ですか。…カメラ＿{雑誌|ざっし}です。', a: ['の', 'の'], de: 'Was ist das für eine Zeitschrift? – Eine Kamera-Zeitschrift.', why: '何の＋Nomen fragt nach dem Inhalt; die Antwort verbindet ebenfalls mit の.', l: 2 },

  // Lektion 3
  { s: 'お{国|くに}＿どちらですか。…ドイツです。', a: ['は'], de: 'Woher kommen Sie? – Aus Deutschland.', why: 'は: Thema „Ihr Land“; danach folgt die Frage どちら.', l: 3 },
  { s: 'これはどこ＿ワインですか。…ドイツ＿ワインです。', a: ['の', 'の'], de: 'Woher ist dieser Wein? – Er ist aus Deutschland.', why: 'どこの＋Nomen fragt nach Herkunft oder Hersteller.', l: 3 },
  { s: 'この{靴|くつ}＿イタリア＿です。', a: ['は', 'の'], de: 'Diese Schuhe sind aus Italien.', why: 'は: Thema (die Schuhe); の: „die aus Italien“, 靴 fällt weg.', l: 3 },
  { s: '{靴|くつ}{売|う}り{場|ば}は{地下|ちか}です。かばん{売|う}り{場|ば}＿{地下|ちか}です。', a: ['も'], de: 'Die Schuhabteilung ist im Untergeschoss. Die Taschenabteilung ist auch im Untergeschoss.', why: 'も: Dieselbe Aussage gilt noch einmal – „auch“.', l: 3 },

  // Lektion 4
  { s: '{毎晩|まいばん}10{時|じ}＿{寝|ね}ます。', a: ['に'], de: 'Ich gehe jeden Abend um 22 Uhr schlafen.', why: 'に bei Uhrzeiten: der Zeitpunkt einer Handlung.', l: 4 },
  { s: '{銀行|ぎんこう}は9{時|じ}＿3{時|じ}＿です。', a: ['から', 'まで'], de: 'Die Bank hat von 9 bis 15 Uhr geöffnet.', why: 'から = von/ab, まで = bis: Anfang und Ende eines Zeitraums.', l: 4 },
  { s: '{昨日|きのう}の{晩|ばん}、7{時|じ}から10{時|じ}＿{勉強|べんきょう}しました。', a: ['まで'], de: 'Gestern Abend habe ich von 19 bis 22 Uhr gelernt.', why: 'まで markiert das Ende eines Zeitraums: bis 22 Uhr.', l: 4 },
  { s: '{図書館|としょかん}の{休|やす}みは{月曜日|げつようび}＿{火曜日|かようび}です。', a: ['と'], de: 'Die Bibliothek ist montags und dienstags geschlossen.', why: 'と verbindet Nomen zu einer vollständigen Aufzählung: „und“.', l: 4 },
  { s: '{美術館|びじゅつかん}は{何時|なんじ}＿ですか。…5{時|じ}までです。', a: ['まで'], de: 'Bis wann hat das Kunstmuseum geöffnet? – Bis 17 Uhr.', why: 'Die Antwort zeigt: Gefragt ist das Ende – also まで.', l: 4 },
  { s: '{毎日|まいにち}、{夜|よる}11{時|じ}まで{働|はたら}きます。…{大変|たいへん}です＿。', a: ['ね'], de: 'Ich arbeite jeden Tag bis 23 Uhr. – Das ist ja anstrengend.', why: 'ね: Mitgefühl – man teilt das Gefühl des anderen.', l: 4 },

  // Lektion 5
  { s: '{毎日|まいにち}{電車|でんしゃ}＿{会社|かいしゃ}＿{行|い}きます。', a: ['で', 'へ/に'], de: 'Ich fahre jeden Tag mit dem Zug zur Arbeit.', why: 'で: Verkehrsmittel („mit dem Zug“); へ/に: Ziel der Bewegung.', l: 5 },
  { s: '{昨日|きのう}、{友達|ともだち}＿{美術館|びじゅつかん}へ{行|い}きました。', a: ['と'], de: 'Gestern bin ich mit einer Freundin ins Kunstmuseum gegangen.', why: 'と bei Personen: mit wem man etwas zusammen macht.', l: 5 },
  { s: '{一人|ひとり}＿{東京|とうきょう}へ{来|き}ました。', a: ['で'], de: 'Ich bin allein nach Tokio gekommen.', why: '一人で = allein; hier steht immer で, nicht と.', l: 5 },
  { s: '{日曜日|にちようび}はどこへ＿{行|い}きませんでした。', a: ['も'], de: 'Am Sonntag bin ich nirgendwohin gegangen.', why: 'Fragewort＋(へ)も＋Verneinung: どこへも = nirgendwohin.', l: 5 },
  { s: 'この{電車|でんしゃ}は{京都|きょうと}へ{行|い}きますか。…いいえ、{行|い}きません。{次|つぎ}の{急行|きゅうこう}です＿。', a: ['よ'], de: 'Fährt dieser Zug nach Kyoto? – Nein. Der nächste Eilzug fährt dorthin.', why: 'よ: Man teilt dem anderen etwas mit, das er noch nicht weiß.', l: 5 },
  { s: '{何|なん}＿{大阪|おおさか}へ{行|い}きますか。…{新幹線|しんかんせん}で{行|い}きます。', a: ['で'], de: 'Womit fährst du nach Osaka? – Mit dem Shinkansen.', why: '何で fragt nach dem Verkehrsmittel; die Antwort hat ebenfalls で.', l: 5 },
  { s: '{私|わたし}は{去年|きょねん}の3{月|がつ}＿{日本|にほん}へ{来|き}ました。', a: ['に'], de: 'Ich bin im März letzten Jahres nach Japan gekommen.', why: 'に bei Monat oder Datum: der Zeitpunkt der Ankunft.', l: 5 },
  { s: '{会社|かいしゃ}＿うちまで{歩|ある}いて{帰|かえ}ります。', a: ['から'], de: 'Von der Firma nach Hause gehe ich zu Fuß.', why: 'から～まで bei Orten: von … bis …', l: 5 },
  { s: '{先週|せんしゅう}の{日曜日|にちようび}、{家族|かぞく}＿{新幹線|しんかんせん}＿{京都|きょうと}＿{行|い}きました。', a: ['と', 'で', 'へ/に'], de: 'Letzten Sonntag bin ich mit meiner Familie mit dem Shinkansen nach Kyoto gefahren.', why: 'と: mit wem; で: womit (Verkehrsmittel); へ/に: wohin.', l: 5 },

  // Lektion 6
  { s: '{毎朝|まいあさ}パン＿{食|た}べます。', a: ['を'], de: 'Ich esse jeden Morgen Brot.', why: 'を markiert das direkte Objekt: was man isst.', l: 6 },
  { s: '{私|わたし}＿{毎朝|まいあさ}{駅|えき}＿{新聞|しんぶん}＿{買|か}います。', a: ['は', 'で', 'を'], de: 'Ich kaufe jeden Morgen am Bahnhof eine Zeitung.', why: 'は: Thema; で: Ort der Handlung (nicht に); を: Objekt.', l: 6 },
  { s: '{日曜日|にちようび}、{駅|えき}で{友達|ともだち}＿{会|あ}いました。', a: ['に/と'], de: 'Am Sonntag habe ich am Bahnhof eine Freundin getroffen.', why: '会います: die Person mit に (と betont ein gegenseitiges Treffen).', l: 6 },
  { s: '{昨日|きのう}は{何|なに}＿{食|た}べませんでした。', a: ['も'], de: 'Gestern habe ich nichts gegessen.', why: '何も＋Verneinung = „nichts“ – nicht 何を.', l: 6 },
  { s: '{一緒|いっしょ}にお{茶|ちゃ}を{飲|の}みません＿。…ええ、いいですね。', a: ['か'], de: 'Wollen wir nicht zusammen Tee trinken? – Ja, gern.', why: '～ませんか: höfliche Einladung; か macht sie zur Frage.', l: 6 },
  { s: '{京都|きょうと}＿{写真|しゃしん}＿{撮|と}りました。', a: ['で', 'を'], de: 'In Kyoto habe ich Fotos gemacht.', why: 'で: Ort der Handlung; を: Objekt (die Fotos).', l: 6 },
  { s: '{明日|あした}{何|なに}＿しますか。…{友達|ともだち}とテニスをします。', a: ['を'], de: 'Was machst du morgen? – Ich spiele mit Freunden Tennis.', why: 'を markiert das Objekt – auch beim Fragewort: 何をしますか.', l: 6 },
  { s: '{土曜日|どようび}、{木村|きむら}さん＿{一緒|いっしょ}に{映画|えいが}＿{見|み}ました。', a: ['と', 'を'], de: 'Am Samstag habe ich mit Frau Kimura zusammen einen Film gesehen.', why: 'と＋一緒に: mit wem; を: was man sieht.', l: 6 },

  // Lektion 7
  { s: '{私|わたし}ははし＿ご{飯|はん}を{食|た}べます。', a: ['で'], de: 'Ich esse mit Stäbchen.', why: 'で: Werkzeug, Mittel – „mit Stäbchen“.', l: 7 },
  { s: '「ありがとう」はドイツ{語|ご}＿{何|なん}ですか。', a: ['で'], de: 'Was heißt „arigatō“ auf Deutsch?', why: 'Sprache als Mittel mit で: „auf Deutsch“.', l: 7 },
  { s: '{私|わたし}は{友達|ともだち}＿{日本語|にほんご}＿{手紙|てがみ}＿{書|か}きました。', a: ['に', 'で', 'を'], de: 'Ich habe einer Freundin einen Brief auf Japanisch geschrieben.', why: 'に: Empfänger; で: Sprache als Mittel; を: Objekt.', l: 7 },
  { s: '{母|はは}＿{花|はな}＿{送|おく}りました。', a: ['に', 'を'], de: 'Ich habe meiner Mutter Blumen geschickt.', why: 'に: Empfänger (wem); を: was man schickt.', l: 7 },
  { s: '{友達|ともだち}＿{誕生日|たんじょうび}のプレゼントをもらいました。', a: ['に/から'], de: 'Ich habe von einer Freundin ein Geburtstagsgeschenk bekommen.', why: 'もらいます: Der Geber steht mit に oder から.', l: 7 },
  { s: '{私|わたし}は{山田|やまだ}さん＿{日本語|にほんご}を{習|なら}いました。', a: ['に/から'], de: 'Ich habe bei Frau Yamada Japanisch gelernt.', why: '習います: bei wem man lernt – に oder から.', l: 7 },
  { s: '{田中|たなか}さんはシュミットさん＿{日本語|にほんご}を{教|おし}えます。', a: ['に'], de: 'Frau Tanaka bringt Herrn Schmidt Japanisch bei.', why: '教えます: Wer etwas beigebracht bekommt, steht mit に.', l: 7 },
  { s: '{私|わたし}は{友達|ともだち}＿{傘|かさ}を{貸|か}しました。', a: ['に'], de: 'Ich habe einem Freund meinen Regenschirm geliehen.', why: '貸します (verleihen): Empfänger mit に; から passt nur bei 借ります.', l: 7 },
  { s: 'はさみ＿{紙|かみ}＿{切|き}ります。', a: ['で', 'を'], de: 'Ich schneide das Papier mit der Schere.', why: 'で: Werkzeug (Schere); を: Objekt (Papier).', l: 7 },

  // Lektion 8
  { s: 'この{寮|りょう}は{古|ふる}いです＿、きれいです。', a: ['が'], de: 'Dieses Wohnheim ist alt, aber sauber.', why: 'が zwischen zwei Sätzen = „aber“: Es folgt ein Gegensatz.', l: 8 },
  { s: '{仕事|しごと}は{忙|いそが}しいです＿、おもしろいです。', a: ['が'], de: 'Die Arbeit ist stressig, aber interessant.', why: '～が、～ verbindet zwei gegensätzliche Aussagen: „aber“.', l: 8 },
  { s: '{今日|きょう}は{寒|さむ}いです＿。…ええ、{寒|さむ}いですね。', a: ['ね'], de: 'Heute ist es kalt, nicht? – Ja, wirklich kalt.', why: 'ね: Man erwartet Zustimmung – der andere spürt es ja auch.', l: 8 },
  { s: 'わあ、すてきなかばんです＿。…ありがとうございます。', a: ['ね'], de: 'Oh, was für eine schöne Tasche! – Danke schön.', why: 'ね: Bewunderung über etwas, das beide gerade sehen.', l: 8 },

  // Lektion 9
  { s: '{私|わたし}は{日本料理|にほんりょうり}＿{好|す}きです。', a: ['が'], de: 'Ich mag japanisches Essen.', why: '好き: Was man mag, steht mit が – nicht mit を.', l: 9 },
  { s: 'マリアさん＿ダンス＿{上手|じょうず}です。', a: ['は', 'が'], de: 'Maria tanzt gut.', why: 'は: Person als Thema; が: worin sie gut ist (上手).', l: 9 },
  { s: '{私|わたし}は{日本語|にほんご}＿{少|すこ}し{分|わ}かります。', a: ['が'], de: 'Ich verstehe ein bisschen Japanisch.', why: '分かります: Was man versteht, steht mit が – nicht mit を.', l: 9 },
  { s: '{用事|ようじ}＿あります＿、{早|はや}く{帰|かえ}ります。', a: ['が', 'から'], de: 'Ich habe noch etwas zu erledigen, deshalb gehe ich früh nach Hause.', why: 'が: was man hat (用事); から nach einem Satz = „weil“.', l: 9 },
  { s: 'どうして{昨日|きのう}{来|き}ませんでしたか。…{約束|やくそく}がありました＿。', a: ['から'], de: 'Warum bist du gestern nicht gekommen? – Weil ich eine Verabredung hatte.', why: 'Antwort auf どうして: Grund＋から am Satzende.', l: 9 },
  { s: '{私|わたし}はスポーツ＿{好|す}きですが、{野球|やきゅう}＿あまり{好|す}きじゃありません。', a: ['が', 'は'], de: 'Ich mag Sport, aber Baseball mag ich nicht so sehr.', why: 'が beim Gemochten; は hebt im zweiten Teil den Gegensatz hervor.', l: 9 },
  { s: 'どんな{音楽|おんがく}＿{好|す}きですか。…ジャズが{好|す}きです。', a: ['が'], de: 'Was für Musik magst du? – Ich mag Jazz.', why: 'Bei 好き steht das Gemochte mit が – auch in der Frage.', l: 9 },
  { s: 'すみません、ボールペンを{貸|か}してください。…いいです＿。どうぞ。', a: ['よ'], de: 'Entschuldigung, leihen Sie mir bitte einen Kugelschreiber. – Gern, bitte schön.', why: 'いいですよ: よ macht die Zusage freundlich und bestimmt.', l: 9 },

  // Lektion 10
  { s: '{庭|にわ}＿{猫|ねこ}＿います。', a: ['に', 'が'], de: 'Im Garten ist eine Katze.', why: 'に: Ort des Daseins; が: was da ist (neue Information).', l: 10 },
  { s: '{郵便局|ゆうびんきょく}は{駅|えき}の{前|まえ}＿あります。', a: ['に'], de: 'Die Post ist vor dem Bahnhof.', why: 'Xは＋Ort＋にあります: wo sich X befindet – der Ort mit に.', l: 10 },
  { s: '{箱|はこ}の{中|なか}に{何|なに}＿ありますか。…{何|なに}＿ありません。', a: ['が', 'も'], de: 'Was ist in der Kiste? – Nichts.', why: 'Fragewort als Subjekt: 何が; 何も＋Verneinung = „nichts“.', l: 10 },
  { s: '{田中|たなか}さん＿どこにいますか。…{会議室|かいぎしつ}にいます。', a: ['は'], de: 'Wo ist Frau Tanaka? – Im Besprechungsraum.', why: 'Bekannte Person als Thema mit は; gefragt ist nur der Ort.', l: 10 },
  { s: '{冷蔵庫|れいぞうこ}＿{卵|たまご}＿{牛乳|ぎゅうにゅう}などがあります。', a: ['に', 'や'], de: 'Im Kühlschrank sind Eier, Milch und anderes.', why: 'に: Ort; や…など: Beispiele, die Aufzählung ist nicht vollständig.', l: 10 },
  { s: '{部屋|へや}に{机|つくえ}やベッド＿があります。', a: ['など'], de: 'Im Zimmer gibt es einen Schreibtisch, ein Bett und so weiter.', why: 'など am Ende der Aufzählung: „und so weiter“.', l: 10 },
  { s: '{銀行|ぎんこう}はスーパー＿{本屋|ほんや}の{間|あいだ}にあります。', a: ['と'], de: 'Die Bank liegt zwischen dem Supermarkt und der Buchhandlung.', why: 'AとBの間 = zwischen A und B: と verbindet die beiden Nomen.', l: 10 },
  { s: '{駅|えき}＿{近|ちか}くに{公園|こうえん}があります。', a: ['の'], de: 'In der Nähe des Bahnhofs gibt es einen Park.', why: 'Ort＋の＋近く/前/上 …: Das Bezugswort steht mit の.', l: 10 },
  { s: '{公園|こうえん}＿{子|こ}どもがたくさんいます。', a: ['に'], de: 'Im Park sind viele Kinder.', why: 'います (da sein): Ort mit に – nicht で, es ist keine Handlung.', l: 10 },
  { s: 'あそこに{女|おんな}の{人|ひと}＿いますね。あの{人|ひと}＿{田中|たなか}さんの{奥|おく}さんです。', a: ['が', 'は'], de: 'Dort drüben ist eine Frau, nicht wahr? Das ist die Frau von Herrn Tanaka.', why: 'が: Die Person wird neu eingeführt; は: Danach ist sie das Thema.', l: 10 },
  { s: '{駅|えき}の{近|ちか}くに{銀行|ぎんこう}＿コンビニなどがあります。', a: ['や'], de: 'In der Nähe des Bahnhofs gibt es unter anderem eine Bank und einen Konbini.', why: 'や…など: nur Beispiele – es gibt dort noch mehr.', l: 10 },
  { s: '{教室|きょうしつ}にだれ＿いません。', a: ['も'], de: 'Im Klassenzimmer ist niemand.', why: 'だれも＋Verneinung = „niemand“.', l: 10 },

  // Lektion 11
  { s: '{休|やす}みは{日曜日|にちようび}＿です。{土曜日|どようび}も{働|はたら}きます。', a: ['だけ'], de: 'Frei habe ich nur sonntags. Samstags arbeite ich auch.', why: 'だけ = nur: Außer Sonntag gibt es keinen freien Tag.', l: 11 },
  { s: '{朝|あさ}ご{飯|はん}はいつもコーヒー＿です。', a: ['だけ'], de: 'Zum Frühstück gibt es bei mir immer nur Kaffee.', why: 'だけ = nur: nichts anderes als Kaffee.', l: 11 },
  { s: '1{週間|しゅうかん}＿3{回|かい}{日本語|にほんご}＿{勉強|べんきょう}します。', a: ['に', 'を'], de: 'Ich lerne dreimal pro Woche Japanisch.', why: 'Zeitraum＋に＋Anzahl = „pro“; を: was man lernt.', l: 11 },
  { s: 'みかんを5つとりんごを3つ{買|か}いました。{全部|ぜんぶ}＿800{円|えん}でした。', a: ['で'], de: 'Ich habe fünf Mandarinen und drei Äpfel gekauft. Zusammen hat es 800 Yen gekostet.', why: '全部で = insgesamt: で fasst eine Summe zusammen.', l: 11 },
  { s: '{切手|きって}＿3{枚|まい}ください。', a: ['を'], de: 'Drei Briefmarken, bitte.', why: 'を markiert, was man möchte; die Anzahl folgt ohne Partikel.', l: 11 },
  { s: '{今日|きょう}は{会社|かいしゃ}＿{休|やす}みます。', a: ['を'], de: 'Heute nehme ich mir frei (ich gehe nicht zur Arbeit).', why: '休みます: Was man ausfallen lässt (Arbeit, Schule), steht mit を.', l: 11 },
  { s: '{私|わたし}は{子|こ}ども＿3{人|にん}います。', a: ['が'], de: 'Ich habe drei Kinder.', why: 'います (haben, bei Personen): Die Personen stehen mit が, die Zahl danach.', l: 11 },
  { s: '{大阪|おおさか}＿{東京|とうきょう}＿{新幹線|しんかんせん}で2{時間|じかん}{半|はん}＿かかります。', a: ['から', 'まで', 'ぐらい'], de: 'Von Osaka nach Tokio braucht man mit dem Shinkansen etwa zweieinhalb Stunden.', why: 'から～まで: Strecke; ぐらい nach einer Dauer = „ungefähr“.', l: 11 },
  { s: '{駅|えき}から{大学|だいがく}までどのくらいかかりますか。…バスで20{分|ぷん}＿かかります。', a: ['ぐらい'], de: 'Wie lange braucht man vom Bahnhof zur Uni? – Mit dem Bus etwa 20 Minuten.', why: 'ぐらい = ungefähr, bei Mengen und Dauer (nicht ごろ).', l: 11 },
  { s: 'この{手紙|てがみ}を{航空便|こうくうびん}＿お{願|ねが}いします。', a: ['で'], de: 'Diesen Brief bitte per Luftpost.', why: 'で: Art und Weise der Sendung – „per Luftpost“.', l: 11 },

  // Lektion 12
  { s: '{東京|とうきょう}は{大阪|おおさか}＿{大|おお}きいです。', a: ['より'], de: 'Tokio ist größer als Osaka.', why: 'より = „als“: Womit verglichen wird, steht mit より.', l: 12 },
  { s: '{電車|でんしゃ}＿バス＿どちらが{速|はや}いですか。', a: ['と', 'と'], de: 'Was ist schneller, der Zug oder der Bus?', why: 'AとBとどちらが…: Beide Vergleichsgrößen stehen mit と.', l: 12 },
  { s: '{私|わたし}は{肉|にく}＿{魚|さかな}のほう＿{好|す}きです。', a: ['より', 'が'], de: 'Ich mag Fisch lieber als Fleisch.', why: 'より: womit verglichen wird; ～のほうが: das, was man vorzieht.', l: 12 },
  { s: 'コーヒーと{紅茶|こうちゃ}とどちら＿{好|す}きですか。', a: ['が'], de: 'Was magst du lieber, Kaffee oder Tee?', why: 'Fragewort どちら als Subjekt: immer が, nie は.', l: 12 },
  { s: 'サッカーと{野球|やきゅう}とどちらがおもしろいですか。…どちら＿おもしろいです。', a: ['も'], de: 'Was ist spannender, Fußball oder Baseball? – Beides ist spannend.', why: 'Fragewort＋も im bejahten Satz: どちらも = beide.', l: 12 },
  { s: '{世界|せかい}＿いちばん{高|たか}い{山|やま}はエベレストです。', a: ['で'], de: 'Der höchste Berg der Welt ist der Mount Everest.', why: 'で: Bereich des Vergleichs – „auf der Welt“.', l: 12 },
  { s: '{北海道|ほっかいどう}＿{東京|とうきょう}＿{寒|さむ}いです。', a: ['は', 'より'], de: 'Hokkaido ist kälter als Tokio.', why: 'は: Thema des Vergleichs; より: womit verglichen wird.', l: 12 },
  { s: 'ご{家族|かぞく}＿だれ＿いちばん{料理|りょうり}＿{上手|じょうず}ですか。', a: ['で', 'が', 'が'], de: 'Wer kocht in Ihrer Familie am besten?', why: 'で: Bereich; だれが: Fragewort als Subjekt; が bei 上手.', l: 12 },
  { s: '{私|わたし}はすし＿{刺身|さしみ}など、{日本|にほん}の{料理|りょうり}が{好|す}きです。', a: ['や'], de: 'Ich mag japanische Gerichte wie Sushi und Sashimi.', why: 'や…など: Beispiele aus einer längeren Liste.', l: 12 },
  { s: 'この{店|みせ}は{何|なに}がおいしいですか。…てんぷらがおいしいです＿。', a: ['よ'], de: 'Was ist in diesem Restaurant gut? – Tempura ist hier sehr gut!', why: 'よ: Man gibt dem anderen eine Information oder Empfehlung.', l: 12 },

  // Lektion 13
  { s: '{私|わたし}は{新|あたら}しいパソコン＿{欲|ほ}しいです。', a: ['が'], de: 'Ich hätte gern einen neuen Computer.', why: '欲しい: Das Gewünschte steht mit が, nicht mit を.', l: 13 },
  { s: '{神戸|こうべ}＿{買|か}い{物|もの}＿{行|い}きます。', a: ['へ/に', 'に'], de: 'Ich fahre zum Einkaufen nach Kobe.', why: 'へ/に: Ziel; Zweck＋に＋行きます: wozu man hingeht.', l: 13 },
  { s: '{日曜日|にちようび}、{京都|きょうと}＿{友達|ともだち}に{会|あ}いに{行|い}きます。', a: ['へ/に'], de: 'Am Sonntag fahre ich nach Kyoto, um einen Freund zu treffen.', why: 'Ziel der Bewegung: へ oder に; der Zweck (会いに) steht vor 行きます.', l: 13 },
  { s: '{空港|くうこう}へ{友達|ともだち}＿{迎|むか}え＿{行|い}きます。', a: ['を', 'に'], de: 'Ich fahre zum Flughafen, um eine Freundin abzuholen.', why: 'を: wen man abholt; ます-Stamm＋に＋行きます = „um … zu“.', l: 13 },
  { s: '{毎朝|まいあさ}{公園|こうえん}＿{散歩|さんぽ}します。', a: ['を/で'], de: 'Ich gehe jeden Morgen im Park spazieren.', why: '散歩します: を für den Weg durch den Park; で (Ort) geht auch.', l: 13 },
  { s: '{来年|らいねん}、{日本人|にほんじん}の{彼女|かのじょ}＿{結婚|けっこん}します。', a: ['と'], de: 'Nächstes Jahr heirate ich meine japanische Freundin.', why: '結婚します: mit wem man heiratet, steht mit と – nicht mit を.', l: 13 },
  { s: '{昨日|きのう}は{夜|よる}の12{時|じ}＿に{寝|ね}ました。', a: ['ごろ'], de: 'Gestern bin ich gegen Mitternacht schlafen gegangen.', why: 'ごろ = gegen, bei Zeitpunkten; ぐらい steht bei Dauer und Mengen.', l: 13 },
  { s: '{毎晩|まいばん}11{時|じ}＿にうちへ{帰|かえ}ります。', a: ['ごろ'], de: 'Ich komme jeden Abend gegen 23 Uhr nach Hause.', why: 'ごろ = gegen: ungefährer Zeitpunkt (bei Dauer: ぐらい).', l: 13 },
  { s: 'のどが{渇|かわ}きましたね。{何|なに}＿{飲|の}みませんか。', a: ['か'], de: 'Wir haben Durst, oder? Wollen wir etwas trinken?', why: '何か = etwas (何も = nichts): Fragewort＋か.', l: 13 },
  { s: '{週末|しゅうまつ}はどこ＿{行|い}きましたか。…いいえ、どこへも{行|い}きませんでした。', a: ['か'], de: 'Bist du am Wochenende irgendwohin gefahren? – Nein, nirgendwohin.', why: 'Die Antwort いいえ zeigt eine Ja/Nein-Frage: どこか = irgendwohin.', l: 13 },
  { s: '{私|わたし}は{冷|つめ}たいビール＿{飲|の}みたいです。', a: ['を/が'], de: 'Ich möchte ein kaltes Bier trinken.', why: 'Bei ～たい steht das Objekt mit を oder が.', l: 13 },
  { s: 'パーティーは{金曜日|きんようび}＿{土曜日|どようび}です。まだ{分|わ}かりません。', a: ['か'], de: 'Die Party ist am Freitag oder am Samstag – das weiß ich noch nicht.', why: 'か zwischen zwei Nomen = „oder“ (と = „und“).', l: 13 },

  // Lektion 14
  { s: 'どうぞ、こちら＿{座|すわ}ってください。', a: ['に'], de: 'Bitte setzen Sie sich hierher.', why: '座ります: Den Platz, auf den man sich setzt, markiert に.', l: 14 },
  { s: '{雨|あめ}＿{降|ふ}っていますから、タクシー＿{呼|よ}びましょう。', a: ['が', 'を'], de: 'Es regnet, also rufen wir ein Taxi.', why: '雨が降ります: が für das, was fällt; を: Objekt (Taxi).', l: 14 },
  { s: 'ちょっと{疲|つか}れましたね。あの{喫茶店|きっさてん}＿{入|はい}りませんか。', a: ['に'], de: 'Wir sind etwas müde, oder? Wollen wir in das Café dort gehen?', why: '入ります: Den Raum, in den man hineingeht, markiert に – nicht を.', l: 14 },
  { s: 'すみません、{塩|しお}＿{取|と}ってください。', a: ['を'], de: 'Entschuldigung, reichen Sie mir bitte das Salz.', why: 'を: Objekt der Bitte – was man reichen soll.', l: 14 },
  { s: 'あの{信号|しんごう}＿{右|みぎ}＿{曲|ま}がってください。', a: ['を/で', 'へ/に'], de: 'Biegen Sie bitte an der Ampel dort rechts ab.', why: 'Ort des Abbiegens: を oder で; Richtung: へ oder に.', l: 14 },
  { s: '{鈴木|すずき}さんは{今|いま}{会議室|かいぎしつ}＿{電話|でんわ}をかけています。', a: ['で'], de: 'Frau Suzuki telefoniert gerade im Besprechungsraum.', why: 'で: Ort einer Handlung – auch bei ～ています.', l: 14 },
  { s: '{子|こ}どもは{今|いま}{公園|こうえん}＿います。{友達|ともだち}とそこ＿サッカーをしています。', a: ['に', 'で'], de: 'Die Kinder sind gerade im Park. Sie spielen dort mit Freunden Fußball.', why: 'います (sein): Ort mit に; Handlung (Fußball spielen): Ort mit で.', l: 14 },
  { s: '{毎朝|まいあさ}8{時|じ}にうち＿{出|で}ます。', a: ['を'], de: 'Ich gehe jeden Morgen um 8 Uhr aus dem Haus.', why: '出ます: Den Ort, den man verlässt, markiert を.', l: 14 },

  // Lektion 15
  { s: '{兄|あに}は{東京|とうきょう}＿{住|す}んでいます。{銀行|ぎんこう}＿{働|はたら}いています。', a: ['に', 'で'], de: 'Mein älterer Bruder wohnt in Tokio. Er arbeitet bei einer Bank.', why: '住みます: Ort mit に; 働きます ist eine Handlung: Ort mit で.', l: 15 },
  { s: 'すみません、ここ＿{写真|しゃしん}を{撮|と}ってもいいですか。', a: ['で'], de: 'Entschuldigung, darf ich hier fotografieren?', why: 'で: Ort, an dem die Handlung (fotografieren) stattfindet.', l: 15 },
  { s: 'この{箱|はこ}を{机|つくえ}の{上|うえ}＿{置|お}いてください。', a: ['に'], de: 'Stellen Sie diese Kiste bitte auf den Tisch.', why: '置きます: Wohin man etwas legt oder stellt, steht mit に.', l: 15 },
  { s: '{紙|かみ}＿{花|はな}を{作|つく}りました。', a: ['で'], de: 'Ich habe Blumen aus Papier gemacht.', why: 'で: das Material, aus dem etwas gemacht wird.', l: 15 },
  { s: '{田中|たなか}さんの{電話番号|でんわばんごう}＿{知|し}っていますか。', a: ['を'], de: 'Kennst du die Telefonnummer von Herrn Tanaka?', why: '知っています: Was man weiß oder kennt, steht mit を.', l: 15 },

  // Lektion 16
  { s: '{京都|きょうと}から{新幹線|しんかんせん}＿{乗|の}って、{東京|とうきょう}へ{行|い}きました。', a: ['に'], de: 'In Kyoto bin ich in den Shinkansen gestiegen und nach Tokio gefahren.', why: '乗ります: Das Fahrzeug, in das man einsteigt, steht mit に – nicht を.', l: 16 },
  { s: '{名古屋|なごや}＿{新幹線|しんかんせん}＿{降|お}りて、{地下鉄|ちかてつ}＿{乗|の}り{換|か}えます。', a: ['で', 'を/から', 'に'], de: 'In Nagoya steige ich aus dem Shinkansen aus und in die U-Bahn um.', why: 'で: Ort; を (oder から): Fahrzeug, das man verlässt; に: neues Fahrzeug.', l: 16 },
  { s: '{大学|だいがく}＿{出|で}てから、{銀行|ぎんこう}＿{入|はい}りました。', a: ['を', 'に'], de: 'Nach dem Studium habe ich bei einer Bank angefangen.', why: '大学を出ます = das Studium abschließen; Bank/Firma に入ります = eintreten.', l: 16 },
  { s: '{私|わたし}の{父|ちち}＿{背|せ}＿{高|たか}いです。', a: ['は', 'が'], de: 'Mein Vater ist groß.', why: 'XはYが＋Adjektiv: は = Person (Thema), が = Merkmal (Körpergröße).', l: 16 },
  { s: 'ミュンヘンはビール＿おいしいです。', a: ['が'], de: 'In München ist das Bier gut.', why: 'XはYが＋Adjektiv: が markiert, was an München gut ist.', l: 16 },
  { s: '{仕事|しごと}が{終|お}わって＿、{飲|の}みに{行|い}きませんか。', a: ['から'], de: 'Wollen wir nach der Arbeit etwas trinken gehen?', why: '～てから = nachdem: Erst endet die Arbeit, dann geht man trinken.', l: 16 },
  { s: '{毎朝|まいあさ}6{時|じ}＿に{起|お}きて、1{時間|じかん}＿ジョギングをします。', a: ['ごろ', 'ぐらい'], de: 'Ich stehe jeden Morgen gegen 6 Uhr auf und jogge etwa eine Stunde.', why: 'ごろ: ungefährer Zeitpunkt; ぐらい: ungefähre Dauer.', l: 16 },

  // Lektion 17
  { s: 'この{本|ほん}は{来週|らいしゅう}＿{返|かえ}さなければなりません。', a: ['までに'], de: 'Dieses Buch muss ich bis nächste Woche zurückgeben.', why: 'までに: Frist für eine Handlung – spätestens bis dann.', l: 17 },
  { s: '5{時|じ}＿ここで{待|ま}っています。5{時|じ}＿{来|き}てください。', a: ['まで', 'までに'], de: 'Ich warte hier bis 5 Uhr. Komm bitte bis spätestens 5 Uhr.', why: 'まで: Dauer bis zum Zeitpunkt (warten); までに: Frist (kommen).', l: 17 },
  { s: '{会議|かいぎ}は10{時|じ}からですから、9{時|じ}{半|はん}＿{来|き}てください。', a: ['までに'], de: 'Die Besprechung beginnt um 10, kommen Sie bitte bis spätestens halb zehn.', why: 'までに: spätester Zeitpunkt für eine einmalige Handlung.', l: 17 },
  { s: '{熱|ねつ}がありますから、お{風呂|ふろ}＿{入|はい}らないでください。', a: ['に'], de: 'Sie haben Fieber, nehmen Sie also bitte kein Bad.', why: 'お風呂に入ります = baden: に wie bei 部屋に入ります.', l: 17 },
  { s: '{上着|うわぎ}を{脱|ぬ}がなければなりませんか。…いいえ、{上着|うわぎ}＿{脱|ぬ}がなくてもいいです。', a: ['は/を'], de: 'Muss ich die Jacke ausziehen? – Nein, die Jacke brauchen Sie nicht auszuziehen.', why: 'Bekanntes Objekt wird oft zum Thema: は statt を (を geht auch).', l: 17 },
  { s: '{毎日|まいにち}この{薬|くすり}＿{飲|の}まなければなりません。', a: ['を'], de: 'Ich muss jeden Tag diese Medizin nehmen.', why: '薬を飲みます: Medizin wird „getrunken“ – Objekt mit を.', l: 17 },
  { s: 'のど＿{痛|いた}くて、{熱|ねつ}＿あります。', a: ['が', 'が/も'], de: 'Ich habe Halsschmerzen und (auch) Fieber.', why: '痛い: Körperteil mit が; あります: Fieber mit が (oder も = auch).', l: 17 },
  { s: 'あ、{危|あぶ}ない！{車|くるま}が{来|き}ます＿。', a: ['よ'], de: 'Oh, Vorsicht! Da kommt ein Auto!', why: 'よ: Warnung – man teilt dem anderen etwas Wichtiges mit.', l: 17 },

  // Lektion 18
  { s: '{私|わたし}はピアノ＿{弾|ひ}くことができます。', a: ['を'], de: 'Ich kann Klavier spielen.', why: 'Vor ことができます bleibt das Objekt beim Verb: を (nicht が).', l: 18 },
  { s: '{妻|つま}＿{運転|うんてん}＿できますが、{私|わたし}はできません。', a: ['は', 'が'], de: 'Meine Frau kann Auto fahren, aber ich nicht.', why: 'は: Thema im Gegensatz; できます: Was man kann, steht mit が.', l: 18 },
  { s: 'この{店|みせ}ではカード＿{払|はら}うことができます。', a: ['で'], de: 'In diesem Geschäft kann man mit Karte bezahlen.', why: 'で: Mittel – „mit Karte“.', l: 18 },
  { s: '{食事|しょくじ}＿{前|まえ}に、{手|て}を{洗|あら}います。', a: ['の'], de: 'Vor dem Essen wasche ich mir die Hände.', why: 'Nomen＋の＋前に = vor …; nach einem Verb (寝る前に) ohne の.', l: 18 },
  { s: '{私|わたし}の{趣味|しゅみ}は{古|ふる}い{切手|きって}＿{集|あつ}めることです。', a: ['を'], de: 'Mein Hobby ist das Sammeln alter Briefmarken.', why: 'Im Satzteil vor こと bleibt das Objekt mit を.', l: 18 },
  { s: 'この{銀行|ぎんこう}でユーロ＿{円|えん}＿{換|か}えることができますか。', a: ['を', 'に'], de: 'Kann man bei dieser Bank Euro in Yen umtauschen?', why: 'を: was man tauscht (Euro); に: worin man tauscht (Yen).', l: 18 },

  // Lektion 19
  { s: '{富士山|ふじさん}＿1{回|かい}＿{登|のぼ}ったことがあります。', a: ['に', 'だけ'], de: 'Ich bin nur ein einziges Mal auf den Fuji gestiegen.', why: '登ります: Ziel (Berg) mit に; だけ = nur.', l: 19 },
  { s: '{大阪|おおさか}では{駅|えき}の{前|まえ}のホテル＿{泊|と}まりました。', a: ['に'], de: 'In Osaka habe ich in einem Hotel vor dem Bahnhof übernachtet.', why: '泊まります: Die Unterkunft steht mit に – nicht mit で.', l: 19 },
  { s: '{姉|あね}は{去年|きょねん}{医者|いしゃ}＿なりました。', a: ['に'], de: 'Meine ältere Schwester ist letztes Jahr Ärztin geworden.', why: 'Nomen＋に＋なります = werden.', l: 19 },
  { s: '{日本語|にほんご}＿{上手|じょうず}＿なりましたね。', a: ['が', 'に'], de: 'Dein Japanisch ist aber gut geworden!', why: 'が: was sich verändert; な-Adjektiv＋に＋なります = werden.', l: 19 },
  { s: '{私|わたし}はまだ{一度|いちど}＿{日本|にほん}へ{行|い}ったことがありません。', a: ['も'], de: 'Ich war noch nie in Japan.', why: '一度も＋Verneinung = kein einziges Mal, noch nie.', l: 19 },
  { s: '{私|わたし}は{北海道|ほっかいどう}へ{行|い}ったこと＿あります。', a: ['が'], de: 'Ich war schon einmal in Hokkaido.', why: '～たことがあります: こと ist Subjekt von あります und steht mit が.', l: 19 },
  { s: '{休|やす}みの{日|ひ}は{掃除|そうじ}や{洗濯|せんたく}＿をします。', a: ['など'], de: 'An freien Tagen putze ich, wasche Wäsche und so weiter.', why: 'や…など: Beispiele, es gibt noch mehr zu tun.', l: 19 },

  // Lektion 20
  { s: 'ドイツ{人|じん}はビザ＿{要|い}りますか。…いいえ、{要|い}りません。', a: ['が'], de: 'Brauchen Deutsche ein Visum? – Nein.', why: '要ります (brauchen): Das Benötigte steht mit が, nicht mit を.', l: 20 },
  { s: '{今晩|こんばん}、みんな＿{飲|の}みに{行|い}かない？', a: ['で'], de: 'Wollen wir heute Abend alle zusammen etwas trinken gehen?', why: 'みんなで = alle zusammen: で für die Gruppe, die gemeinsam handelt.', l: 20 },
  { s: '{僕|ぼく}は{来月|らいげつ}{国|くに}＿{帰|かえ}る。', a: ['へ/に'], de: 'Ich fahre nächsten Monat in meine Heimat zurück.', why: 'Ziel der Bewegung: へ oder に – auch in der Umgangssprache.', l: 20 },

  // Lektion 21
  { s: '{明日|あした}は{雨|あめ}が{降|ふ}る＿{思|おも}います。', a: ['と'], de: 'Ich glaube, morgen regnet es.', why: 'と markiert den Inhalt von 思います: „dass …“.', l: 21 },
  { s: '{田中|たなか}さんは{来週|らいしゅう}{大阪|おおさか}＿{出張|しゅっちょう}する＿{言|い}いました。', a: ['へ/に', 'と'], de: 'Herr Tanaka hat gesagt, dass er nächste Woche auf Geschäftsreise nach Osaka fährt.', why: 'へ/に: Ziel der Reise; と markiert, was jemand gesagt hat.', l: 21 },
  { s: '{寝|ね}る{前|まえ}に「お{休|やす}みなさい」＿{言|い}います。', a: ['と'], de: 'Vor dem Schlafengehen sagt man „Oyasumi nasai“.', why: 'と nach einem Zitat: was gesagt wird.', l: 21 },
  { s: '{来月|らいげつ}、{東京|とうきょう}＿{日本|にほん}とドイツのサッカーの{試合|しあい}があります。', a: ['で'], de: 'Nächsten Monat findet in Tokio ein Fußballspiel Japan gegen Deutschland statt.', why: 'Veranstaltungen finden „statt“: Ort mit で – nicht に, obwohl あります.', l: 21 },
  { s: '{明日|あした}、{大阪|おおさか}＿お{祭|まつ}り＿あります。', a: ['で', 'が'], de: 'Morgen ist in Osaka ein Fest.', why: 'Ereignis mit あります: Ort mit で, das Ereignis selbst mit が.', l: 21 },
  { s: '{疲|つか}れましたね。コーヒー＿{飲|の}みませんか。', a: ['でも'], de: 'Wir sind müde, oder? Wollen wir einen Kaffee oder so trinken?', why: 'でも = „… oder so“: macht den Vorschlag locker und unverbindlich.', l: 21 },
  { s: 'まだ{時間|じかん}がありますから、{喫茶店|きっさてん}でお{茶|ちゃ}＿{飲|の}みませんか。', a: ['でも'], de: 'Wir haben noch Zeit – wollen wir im Café einen Tee oder so trinken?', why: 'でも statt を: Der Tee ist nur ein Beispiel, man ist offen.', l: 21 },
  { s: '{日本|にほん}の{交通|こうつう}＿ついてどう{思|おも}いますか。', a: ['に'], de: 'Was halten Sie vom Verkehr in Japan?', why: '～について = über, bezüglich: に gehört fest dazu.', l: 21 },
  { s: '{会社|かいしゃ}＿やめて、アメリカへ{留学|りゅうがく}します。', a: ['を'], de: 'Ich kündige bei meiner Firma und gehe zum Studieren in die USA.', why: 'やめます (aufhören, kündigen): Was man aufgibt, steht mit を.', l: 21 },
  { s: '{日本|にほん}は{物価|ぶっか}＿{高|たか}い＿{思|おも}います。', a: ['が', 'と'], de: 'Ich finde, in Japan sind die Preise hoch.', why: 'XはYが＋Adjektiv; と markiert den Inhalt von 思います.', l: 21 },

  // Lektion 22
  { s: '{私|わたし}＿{生|う}まれた{町|まち}はハンブルクです。', a: ['が/の'], de: 'Die Stadt, in der ich geboren bin, ist Hamburg.', why: 'Subjekt im Relativsatz: が (oder の) – nicht は.', l: 22 },
  { s: '{妻|つま}＿ケーキを{買|か}った{店|みせ}はあそこです。', a: ['が'], de: 'Der Laden, in dem meine Frau den Kuchen gekauft hat, ist dort drüben.', why: 'Subjekt im Relativsatz steht mit が, nicht mit は.', l: 22 },
  { s: '{毎日|まいにち}{忙|いそが}しいですから、{本|ほん}を{読|よ}む{時間|じかん}＿ありません。', a: ['が'], de: 'Ich bin jeden Tag beschäftigt, deshalb habe ich keine Zeit zum Lesen.', why: 'ありません: Was fehlt (die Zeit), steht mit が.', l: 22 },
  { s: '{眼鏡|めがね}＿かけている{人|ひと}は{木村|きむら}さんです。', a: ['を'], de: 'Die Person mit der Brille ist Frau Kimura.', why: 'Auch im Relativsatz steht das Objekt mit を (眼鏡をかけます).', l: 22 },
  { s: '{日曜日|にちようび}は{友達|ともだち}＿{会|あ}う{約束|やくそく}＿あります。', a: ['と/に', 'が'], de: 'Am Sonntag bin ich mit einem Freund verabredet.', why: 'と/に: mit wem man sich trifft; があります: was man hat.', l: 22 },
  { s: '{田中|たなか}さん＿{住|す}んでいる{所|ところ}＿{知|し}っていますか。', a: ['が/の', 'を'], de: 'Weißt du, wo Herr Tanaka wohnt?', why: 'Subjekt im Relativsatz: が oder の; を: Objekt von 知っています.', l: 22 },

  // Lektion 23
  { s: 'この{橋|はし}＿{渡|わた}る＿、{右|みぎ}に{郵便局|ゆうびんきょく}があります。', a: ['を', 'と'], de: 'Wenn Sie diese Brücke überqueren, ist rechts die Post.', why: 'を: was man überquert; と: „wenn …, dann“ (feste Folge).', l: 23 },
  { s: '{道|みち}＿{渡|わた}るとき、{車|くるま}に{気|き}をつけてください。', a: ['を'], de: 'Achte auf die Autos, wenn du die Straße überquerst.', why: '渡ります: Die Straße, die man überquert, steht mit を.', l: 23 },
  { s: '{分|わ}からないとき、{先生|せんせい}＿{聞|き}きます。', a: ['に'], de: 'Wenn ich etwas nicht verstehe, frage ich die Lehrerin.', why: '聞きます (fragen): Die gefragte Person steht mit に – nicht mit を.', l: 23 },
  { s: '{子|こ}ども＿とき、よく{川|かわ}で{泳|およ}ぎました。', a: ['の'], de: 'Als Kind bin ich oft im Fluss geschwommen.', why: 'Nomen＋の＋とき = „als …“.', l: 23 },
  { s: '{妻|つま}＿{病気|びょうき}のとき、{私|わたし}が{料理|りょうり}を{作|つく}ります。', a: ['が'], de: 'Wenn meine Frau krank ist, koche ich.', why: 'Im とき-Satz steht das Subjekt mit が; は gehört zum Hauptsatz.', l: 23 },
  { s: 'この{道|みち}をまっすぐ{行|い}く＿、{左|ひだり}に{公園|こうえん}があります。', a: ['と'], de: 'Wenn Sie diese Straße geradeaus gehen, ist links ein Park.', why: 'と nach der Wörterbuchform: „wenn …, dann“ – typisch für Wegbeschreibungen.', l: 23 },
  { s: '{次|つぎ}の{角|かど}を{右|みぎ}＿{曲|ま}がってください。', a: ['へ/に'], de: 'Biegen Sie an der nächsten Ecke bitte rechts ab.', why: 'Richtung: へ oder に; die Ecke selbst steht mit を.', l: 23 },
  { s: '{寂|さび}しいとき、{国|くに}の{家族|かぞく}＿{電話|でんわ}します。', a: ['に'], de: 'Wenn ich mich einsam fühle, rufe ich meine Familie in der Heimat an.', why: '電話します: Wen man anruft, steht mit に – nicht mit を.', l: 23 },
  { s: '{駅|えき}の{近|ちか}くの{駐車場|ちゅうしゃじょう}＿{車|くるま}を{止|と}めました。', a: ['に'], de: 'Ich habe das Auto auf dem Parkplatz beim Bahnhof abgestellt.', why: '止めます (parken): Wo das Auto bleibt, steht mit に.', l: 23 },

  // Lektion 24
  { s: '{佐藤|さとう}さん＿{私|わたし}＿お{菓子|かし}をくれました。', a: ['が/は', 'に'], de: 'Frau Sato hat mir Süßigkeiten geschenkt.', why: 'くれます: Geber als Subjekt (が oder は); Empfänger (ich) mit に.', l: 24 },
  { s: 'きれいな{花|はな}ですね。だれ＿くれましたか。', a: ['が'], de: 'Schöne Blumen! Wer hat sie dir geschenkt?', why: 'Fragewort als Subjekt: だれが – nie だれは.', l: 24 },
  { s: '{山田|やまだ}さん＿{京都|きょうと}を{案内|あんない}してもらいました。', a: ['に'], de: 'Herr Yamada hat mir Kyoto gezeigt.', why: '～てもらいます: Wer einem den Gefallen tut, steht mit に.', l: 24 },
  { s: '{私|わたし}は{木村|きむら}さん＿{本|ほん}を{貸|か}してあげました。', a: ['に'], de: 'Ich habe Frau Kimura ein Buch geliehen.', why: '～てあげます: Der Empfänger des Gefallens steht mit に.', l: 24 },
  { s: '{毎日|まいにち}{自分|じぶん}＿お{弁当|べんとう}＿{作|つく}ります。', a: ['で', 'を'], de: 'Ich mache mir jeden Tag selbst ein Bento.', why: '自分で = selbst; を: Objekt (das Bento).', l: 24 },
  { s: '{友達|ともだち}＿{両親|りょうしん}＿{紹介|しょうかい}しました。', a: ['を', 'に'], de: 'Ich habe meine Freundin meinen Eltern vorgestellt.', why: 'を: wen man vorstellt; に: wem man jemanden vorstellt.', l: 24 },

  // Lektion 25
  { s: '{駅|えき}＿{着|つ}いたら、{私|わたし}＿{電話|でんわ}してください。', a: ['に', 'に'], de: 'Ruf mich bitte an, wenn du am Bahnhof ankommst.', why: '着きます: Ankunftsort mit に; 電話します: wen man anruft, mit に.', l: 25 },
  { s: '{雨|あめ}＿{降|ふ}ったら、{試合|しあい}はありません。', a: ['が'], de: 'Wenn es regnet, findet das Spiel nicht statt.', why: 'Im たら-Satz steht das Subjekt mit が, nicht mit は.', l: 25 },
  { s: '{道|みち}＿{分|わ}からなかったら、{電話|でんわ}してください。', a: ['が'], de: 'Wenn du den Weg nicht findest, ruf bitte an.', why: '分かります: が für das, was man (nicht) weiß – auch im たら-Satz.', l: 25 },
  { s: '{寒|さむ}くて＿、{毎朝|まいあさ}ジョギングをします。', a: ['も'], de: 'Auch wenn es kalt ist, jogge ich jeden Morgen.', why: '～ても = auch wenn: も nach der て-Form.', l: 25 },
  { s: '{年|とし}を{取|と}ったら、{田舎|いなか}＿{住|す}みたいです。', a: ['に'], de: 'Wenn ich alt bin, möchte ich auf dem Land leben.', why: '住みます: Der Wohnort steht mit に.', l: 25 },
  { s: 'いくら{考|かんが}えて＿、{分|わ}かりません。', a: ['も'], de: 'Egal, wie lange ich nachdenke, ich verstehe es nicht.', why: 'いくら～ても = egal wie sehr: も gehört zur ても-Form.', l: 25 },
];
