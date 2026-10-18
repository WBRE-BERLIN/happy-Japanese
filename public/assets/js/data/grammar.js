/* Grammatik-Quiz. Erste Option ist richtig. t: Thema, l: Lektion */
export default [
  // desu
  { q: 'Du stellst klar: Herr Santos ist kein Student.', s: 'サントスさんは{学生|がくせい}＿。', o: ['じゃありません', 'です', 'ですか', 'がありません'], de: 'Herr Santos ist kein Student.', why: 'Verneinung von です: じゃありません. 〜がありません heißt „es gibt nicht“.', l: 1, t: 'desu' },
  { q: 'Du weißt es nicht und fragst: Ist Frau Wang Ärztin?', s: 'ワンさんは{医者|いしゃ}＿。', o: ['ですか', 'ですね', 'ですよ', 'じゃありません'], de: 'Ist Frau Wang Ärztin?', why: 'Eine Frage endet mit か. ですね erwartet Zustimmung, ですよ teilt etwas mit.', l: 1, t: 'desu' },
  { q: 'Du stellst dich vor: Du bist kein Japaner, sondern Deutscher.', s: '{私|わたし}は{日本人|にほんじん}じゃありません。ドイツ{人|じん}＿。', o: ['です', 'ですか', 'じゃありません', 'でした'], de: 'Ich bin kein Japaner. Ich bin Deutscher.', why: 'Aussage in der Gegenwart: です. Nach dir selbst fragst du nicht mit ですか.', l: 1, t: 'desu' },
  { s: '{昨日|きのう}は{雨|あめ}＿。', o: ['でした', 'です', 'かったです', 'じゃありません'], de: 'Gestern hat es geregnet.', why: 'Nomen in der Vergangenheit: でした. かったです gibt es nur bei い-Adjektiven.', l: 12, t: 'desu' },
  { q: 'Gestern war kein freier Tag.', s: '{昨日|きのう}は{休|やす}み＿。', o: ['じゃありませんでした', 'じゃありません', 'くなかったです', 'でした'], de: 'Gestern war kein freier Tag.', why: 'Verneinte Vergangenheit beim Nomen: じゃありませんでした. くなかった nur bei い-Adjektiven.', l: 12, t: 'desu' },

  // kosoado
  { q: 'Du zeigst auf das Buch in deiner Hand.', s: '＿は{私|わたし}の{本|ほん}です。', o: ['これ', 'それ', 'あれ', 'この'], de: 'Das ist mein Buch.', why: 'これ: nah bei dir. この braucht immer ein Nomen danach (この本).', l: 2, t: 'kosoado' },
  { q: 'Du zeigst auf einen Schirm, der neben deinem Gesprächspartner steht.', s: '＿{傘|かさ}はだれのですか。', o: ['その', 'それ', 'この', 'あの'], de: 'Wem gehört der Schirm da?', why: 'Nah beim anderen: その. Vor einem Nomen steht その, nicht それ.', l: 2, t: 'kosoado' },
  { s: 'A：あれは{何|なん}ですか。B：＿は{銀行|ぎんこう}です。', o: ['あれ', 'これ', 'それ', 'あの'], de: 'A: Was ist das dort drüben? B: Das ist eine Bank.', why: 'Ist etwas von beiden weit weg, antworten beide mit あれ.', l: 2, t: 'kosoado' },
  { q: 'Du fragst nach der Toilette. Die Verkäuferin zeigt auf eine Stelle, die weit weg von euch beiden ist.', s: 'トイレは＿です。', o: ['あそこ', 'そこ', 'ここ', 'あの'], de: 'Die Toilette ist dort drüben.', why: 'Ein Ort weit weg von beiden: あそこ. あの braucht ein Nomen danach.', l: 3, t: 'kosoado' },
  { q: 'Du stellst deinem Kollegen höflich Herrn Tanaka vor.', s: '＿は{田中|たなか}さんです。', o: ['こちら', 'これ', 'ここ', 'この'], de: 'Das ist Herr Tanaka.', why: 'Menschen stellt man höflich mit こちら vor. これ ist für Dinge.', l: 1, t: 'kosoado' },

  // no
  { s: 'これは{私|わたし}＿{本|ほん}です。', o: ['の', 'は', 'が', 'な'], de: 'Das ist mein Buch.', why: 'Nomen + の + Nomen: Besitz. な steht nur nach な-Adjektiven.', l: 1, t: 'no' },
  { s: '{私|わたし}の{友達|ともだち}はさくら{大学|だいがく}＿{先生|せんせい}です。', o: ['の', 'な', 'に', 'で'], de: 'Mein Freund ist Dozent an der Sakura-Universität.', why: 'Zugehörigkeit zu Uni oder Firma: の. に und で passen nicht vor ein Nomen.', l: 1, t: 'no' },
  { s: 'この{傘|かさ}は{私|わたし}＿。', o: ['のです', 'です', 'なです', 'のもです'], de: 'Dieser Schirm gehört mir.', why: 'わたしの = meiner; das Nomen (かさ) fällt weg. わたしです hieße „Der Schirm bin ich“.', l: 2, t: 'no' },
  { q: 'Du fragst, wem die Uhr gehört.', s: 'この{時計|とけい}は＿ですか。', o: ['だれの', 'だれ', 'どれの', 'どこ'], de: 'Wem gehört diese Uhr?', why: 'だれの = wessen. だれですか fragt nach einer Person, nicht nach dem Besitzer.', l: 2, t: 'no' },

  // mo
  { q: 'Herr Gupta ist auch Angestellter.', s: 'ミラーさんは{会社員|かいしゃいん}です。グプタさん＿{会社員|かいしゃいん}です。', o: ['も', 'は', 'や', 'と'], de: 'Herr Miller ist Angestellter. Herr Gupta ist auch Angestellter.', why: 'も = auch; es ersetzt は.', l: 1, t: 'mo' },
  { q: 'Du hast heute Morgen gar nichts gegessen.', s: '{今朝|けさ}{何|なに}＿{食|た}べませんでした。', o: ['も', 'を', 'か', 'が'], de: 'Heute Morgen habe ich nichts gegessen.', why: 'なにも + Verneinung = gar nichts. なにか heißt „etwas“.', l: 6, t: 'mo' },
  { s: '{部屋|へや}にだれ＿いません。', o: ['も', 'が', 'か', 'は'], de: 'Im Zimmer ist niemand.', why: 'だれも + Verneinung = niemand.', l: 10, t: 'mo' },
  { s: 'ワインもビール＿{好|す}きです。', o: ['も', 'が', 'と', 'や'], de: 'Ich mag sowohl Wein als auch Bier.', why: 'AもBも = sowohl A als auch B. Das zweite も ersetzt が.', l: 9, t: 'mo' },

  // question
  { q: 'Du möchtest wissen, wer die Person dort ist.', s: 'あの{人|ひと}は＿ですか。', o: ['だれ', 'なん', 'どこ', 'どれ'], de: 'Wer ist die Person dort?', why: 'Nach Personen fragt man mit だれ (höflich: どなた).', l: 1, t: 'question' },
  { q: 'Du fragst nach dem Preis.', s: 'この{本|ほん}は＿ですか。', o: ['いくら', 'いくつ', 'どのくらい', 'なん'], de: 'Wie viel kostet dieses Buch?', why: 'Preis: いくら. いくつ fragt nach der Anzahl oder dem Alter.', l: 3, t: 'question' },
  { q: 'Du fragst, wann sie nach Japan gekommen ist.', s: '＿{日本|にほん}へ{来|き}ましたか。', o: ['いつ', 'いつも', 'どこ', '{何|なん}で'], de: 'Wann sind Sie nach Japan gekommen?', why: 'いつ = wann. いつも heißt „immer“.', l: 5, t: 'question' },
  { q: 'Du fragst, mit welchem Verkehrsmittel er zur Uni fährt.', s: '＿{大学|だいがく}へ{行|い}きますか。', o: ['{何|なん}で', 'どこで', 'だれと', 'いつ'], de: 'Womit fahren Sie zur Uni?', why: 'Nach dem Verkehrsmittel fragt man mit なんで (で = mit, mittels).', l: 5, t: 'question' },
  { s: 'A：＿{昨日|きのう}{休|やす}みましたか。B：{用事|ようじ}がありましたから。', o: ['どうして', 'どう', 'どこで', 'いつ'], de: 'A: Warum haben Sie gestern gefehlt? B: Weil ich etwas zu erledigen hatte.', why: 'Die Antwort mit から nennt einen Grund, also fragt A mit どうして (warum).', l: 9, t: 'question' },
  { s: '{日本|にほん}の{生活|せいかつ}は＿ですか。', o: ['どう', 'どんな', 'どれ', 'どの'], de: 'Wie ist das Leben in Japan?', why: 'どうですか = Wie ist es? どんな braucht ein Nomen danach.', l: 8, t: 'question' },
  { s: 'ミラーさんは＿{人|ひと}ですか。', o: ['どんな', 'どう', 'どれ', 'どこ'], de: 'Was für ein Mensch ist Herr Miller?', why: 'Vor einem Nomen: どんな (was für ein). どう steht ohne Nomen.', l: 8, t: 'question' },
  { q: 'Da stehen viele Schirme. Du fragst, welcher Herrn Lee gehört.', s: 'イーさんの{傘|かさ}は＿ですか。', o: ['どれ', 'どの', 'どう', 'だれ'], de: 'Welcher ist der Schirm von Herrn Lee?', why: 'Welcher von mehreren: どれ. どの braucht ein Nomen danach (どのかさ).', l: 16, t: 'question' },
  { q: 'Du fragst, wie viele Äpfel sie gekauft hat.', s: 'りんごを＿{買|か}いましたか。', o: ['いくつ', 'いくら', '{何|なん}{枚|まい}', '{何|なん}{人|にん}'], de: 'Wie viele Äpfel haben Sie gekauft?', why: 'Gezählt mit 〜つ, also fragt man いくつ. 〜まい ist für flache Dinge.', l: 11, t: 'question' },
  { s: '{東京|とうきょう}から{大阪|おおさか}まで{新幹線|しんかんせん}で＿かかりますか。', o: ['どのくらい', 'いくつ', 'いつ', 'どう'], de: 'Wie lange braucht man mit dem Shinkansen von Tokyo nach Osaka?', why: 'Nach Dauer oder Menge fragt man mit どのくらい.', l: 11, t: 'question' },
  { q: 'Du fragst dein Gegenüber höflich nach dem Alter.', s: '{失礼|しつれい}ですが、＿ですか。', o: ['おいくつ', 'おいくら', '{何|なん}{人|にん}', 'いつ'], de: 'Entschuldigung, wie alt sind Sie?', why: 'Höflich nach dem Alter: おいくつ (oder なんさい). いくら fragt nach dem Preis.', l: 1, t: 'question' },

  // time
  { s: '{毎晩|まいばん}11{時|じ}＿{寝|ね}ます。', o: ['に', 'で', 'を', 'が'], de: 'Ich gehe jeden Abend um 11 Uhr schlafen.', why: 'Uhrzeit + に: Zeitpunkt einer Handlung.', l: 4, t: 'time' },
  { s: '＿{図書館|としょかん}へ{行|い}きます。', o: ['{明日|あした}', '{明日|あした}に', '{毎週|まいしゅう}に', '{日曜日|にちようび}で'], de: 'Morgen gehe ich in die Bibliothek.', why: 'あした, まいにち, まいしゅう stehen ohne に. Mit Uhrzeit oder Wochentag steht に.', l: 4, t: 'time' },
  { s: '{銀行|ぎんこう}は9{時|じ}から3{時|じ}＿です。', o: ['まで', 'に', 'へ', 'までに'], de: 'Die Bank ist von 9 bis 3 Uhr geöffnet.', why: '〜から〜まで = von … bis. までに heißt „bis spätestens“.', l: 4, t: 'time' },
  { q: 'Du fragst, wie spät es ist.', s: '{今|いま}＿ですか。', o: ['{何時|なんじ}', '{何時間|なんじかん}', 'いつ', 'いくつ'], de: 'Wie spät ist es jetzt?', why: 'Uhrzeit: なんじ. なんじかん fragt nach der Dauer (wie viele Stunden).', l: 4, t: 'time' },
  { s: '{毎日|まいにち}2{時間|じかん}＿{日本語|にほんご}を{勉強|べんきょう}します。', o: ['ぐらい', 'ごろ', 'に', 'ごろに'], de: 'Ich lerne jeden Tag etwa zwei Stunden Japanisch.', why: 'Ungefähre Dauer oder Menge: ぐらい. ごろ nur bei Zeitpunkten (3じごろ).', l: 11, t: 'time' },

  // motion
  { s: '{来週|らいしゅう}{京都|きょうと}＿{行|い}きます。', o: ['へ', 'を', 'で', 'が'], de: 'Nächste Woche fahre ich nach Kyoto.', why: 'Ziel bei いきます, きます, かえります: へ (auch に). で markiert den Ort einer Handlung.', l: 5, t: 'motion' },
  { s: '{毎日|まいにち}{電車|でんしゃ}＿{会社|かいしゃ}へ{行|い}きます。', o: ['で', 'に', 'を', 'と'], de: 'Ich fahre jeden Tag mit dem Zug zur Firma.', why: 'Verkehrsmittel + で (mit, mittels).', l: 5, t: 'motion' },
  { s: '{駅|えき}から{家|うち}まで＿{帰|かえ}りました。', o: ['{歩|ある}いて', '{歩|ある}きで', '{足|あし}で', '{歩|ある}くで'], de: 'Ich bin vom Bahnhof nach Hause zu Fuß gegangen.', why: '„Zu Fuß“ heißt あるいて – ohne で.', l: 5, t: 'motion' },
  { s: '{私|わたし}は{先週|せんしゅう}{友達|ともだち}＿{北海道|ほっかいどう}へ{行|い}きました。', o: ['と', 'で', 'が', 'に'], de: 'Ich bin letzte Woche mit einem Freund nach Hokkaido gefahren.', why: 'Mit jemandem zusammen: と.', l: 5, t: 'motion' },
  { s: '{私|わたし}は＿{日本|にほん}へ{来|き}ました。', o: ['{一人|ひとり}で', '{一人|ひとり}と', '{一人|ひとり}に', '{一人|ひとり}が'], de: 'Ich bin allein nach Japan gekommen.', why: '„Allein“ heißt ひとりで.', l: 5, t: 'motion' },
  { q: 'Herr Miller hat dich gestern zu Hause besucht.', s: '{昨日|きのう}ミラーさんが{私|わたし}の{家|うち}へ＿。', o: ['{来|き}ました', '{行|い}きました', '{帰|かえ}りました', '{来|き}ます'], de: 'Gestern ist Herr Miller zu mir nach Hause gekommen.', why: 'Bewegung zum Sprecher hin: きます. かえります nur für das eigene Zuhause.', l: 5, t: 'motion' },

  // object
  { s: '{毎朝|まいあさ}パン＿{食|た}べます。', o: ['を', 'が', 'に', 'で'], de: 'Ich esse jeden Morgen Brot.', why: 'Das direkte Objekt steht mit を.', l: 6, t: 'object' },
  { s: '{駅|えき}＿{新聞|しんぶん}を{買|か}いました。', o: ['で', 'に', 'へ', 'を'], de: 'Ich habe am Bahnhof eine Zeitung gekauft.', why: 'Ort einer Handlung: で. に steht beim Ort, wo etwas ist.', l: 6, t: 'object' },
  { s: '{日曜日|にちようび}{何|なに}＿しますか。', o: ['を', 'が', 'で', 'に'], de: 'Was machen Sie am Sonntag?', why: 'なにを します = was machen; なに ist das Objekt.', l: 6, t: 'object' },
  { s: 'はし＿ご{飯|はん}を{食|た}べます。', o: ['で', 'を', 'に', 'と'], de: 'Ich esse Reis mit Stäbchen.', why: 'Werkzeug oder Mittel: で.', l: 7, t: 'object' },
  { s: '{日本語|にほんご}＿{手紙|てがみ}を{書|か}きます。', o: ['で', 'を', 'に', 'へ'], de: 'Ich schreibe einen Brief auf Japanisch.', why: 'Sprache als Mittel: で (にほんごで = auf Japanisch).', l: 7, t: 'object' },

  // invite
  { q: 'Du lädst einen Freund höflich ein, am Samstag zusammen Tennis zu spielen.', s: '{土曜日|どようび}、いっしょにテニスを＿。', o: ['しませんか', 'しましたか', 'したいですか', 'してください'], de: 'Wollen wir am Samstag zusammen Tennis spielen?', why: 'Höfliche Einladung: 〜ませんか. したいですか fragt direkt nach dem Wunsch – unhöflich.', l: 6, t: 'invite' },
  { s: 'A：いっしょに{昼|ひる}ご{飯|はん}を{食|た}べませんか。B：ええ、＿。', o: ['{食|た}べましょう', '{食|た}べません', '{食|た}べませんか', '{食|た}べました'], de: 'A: Wollen wir zusammen zu Mittag essen? B: Ja, gern!', why: 'Eine Einladung nimmt man mit 〜ましょう an (Lass uns …).', l: 6, t: 'invite' },
  { q: 'Du schlägst vor: Lasst uns eine kurze Pause machen!', s: 'ちょっと＿。', o: ['{休|やす}みましょう', '{休|やす}みませんでした', '{休|やす}みましたか', '{休|やす}みたいです'], de: 'Lasst uns kurz Pause machen!', why: '〜ましょう = Lass(t) uns … やすみたいです heißt nur „ich möchte“.', l: 6, t: 'invite' },
  { s: 'A：どこで{会|あ}いましょうか。B：{駅|えき}の{前|まえ}で＿。', o: ['{会|あ}いましょう', '{会|あ}いました', '{会|あ}いません', '{会|あ}いたいですか'], de: 'A: Wo wollen wir uns treffen? B: Treffen wir uns vor dem Bahnhof!', why: 'Auf 〜ましょうか (Vorschlag gesucht) antwortet man mit 〜ましょう.', l: 6, t: 'invite' },
  { q: 'Du bietest an, das Gepäck zu tragen.', s: '{荷物|にもつ}を＿。', o: ['{持|も}ちましょうか', '{持|も}ちませんか', '{持|も}ってください', '{持|も}ちたいですか'], de: 'Soll ich das Gepäck tragen?', why: 'Hilfe anbieten: 〜ましょうか (Soll ich …?). もちませんか lädt den anderen ein.', l: 14, t: 'invite' },

  // giving
  { q: 'Du hast Herrn Kimura zum Geburtstag Blumen geschenkt.', s: '{私|わたし}は{木村|きむら}さんに{花|はな}を＿。', o: ['あげました', 'もらいました', 'くれました', '{貸|か}しました'], de: 'Ich habe Herrn Kimura Blumen geschenkt.', why: 'Ich gebe jemandem etwas: あげます. くれます nur, wenn ich etwas bekomme.', l: 7, t: 'giving' },
  { q: 'Dein Vater hat dir eine Uhr geschenkt.', s: '{私|わたし}は{父|ちち}に{時計|とけい}を＿。', o: ['もらいました', 'あげました', 'くれました', 'もらいます'], de: 'Ich habe von meinem Vater eine Uhr bekommen.', why: 'わたしは + Person に + もらいます = von jemandem bekommen.', l: 7, t: 'giving' },
  { s: '{私|わたし}は{先生|せんせい}＿{辞書|じしょ}をもらいました。', o: ['に', 'が', 'へ', 'を'], de: 'Ich habe von der Lehrerin ein Wörterbuch bekommen.', why: 'Bei もらいます steht der Geber mit に (auch から).', l: 7, t: 'giving' },
  { q: 'Du fragst Frau Lee, was sie zum Geburtstag bekommen hat.', s: 'イーさんは{誕生日|たんじょうび}に{何|なに}を＿か。', o: ['もらいました', 'あげました', 'くれました', 'もらいます'], de: 'Was haben Sie zum Geburtstag bekommen, Frau Lee?', why: 'Frau Lee ist die Empfängerin, also もらいました.', l: 7, t: 'giving' },
  { q: 'Herr Yamada war dein Japanischlehrer.', s: '{私|わたし}は{山田|やまだ}さんに{日本語|にほんご}を＿。', o: ['{習|なら}いました', '{教|おし}えました', 'もらいました', 'くれました'], de: 'Ich habe bei Herrn Yamada Japanisch gelernt.', why: 'Von jemandem lernen: Person に ならいます. おしえます = unterrichten.', l: 7, t: 'giving' },
  { s: '{私|わたし}は{図書館|としょかん}で{本|ほん}を＿。', o: ['{借|か}りました', '{貸|か}しました', 'あげました', 'くれました'], de: 'Ich habe in der Bibliothek ein Buch ausgeliehen.', why: 'かります = (sich) ausleihen, かします = verleihen.', l: 7, t: 'giving' },
  { q: 'Frau Sato hat dir Schokolade geschenkt.', s: '{佐藤|さとう}さんが{私|わたし}にチョコレートを＿。', o: ['くれました', 'あげました', 'もらいました', 'くれます'], de: 'Frau Sato hat mir Schokolade geschenkt.', why: 'Jemand gibt mir etwas: くれます. あげます geht immer vom Sprecher weg.', l: 24, t: 'giving' },
  { s: 'A：すてきなネクタイですね。B：ありがとうございます。{誕生日|たんじょうび}に{妻|つま}が＿。', o: ['くれました', 'あげました', 'もらいました', 'くれます'], de: 'A: Schöne Krawatte! B: Danke. Meine Frau hat sie mir zum Geburtstag geschenkt.', why: 'つまが (Geberin) + mir: くれました. Mit もらいます wäre der Geber mit に.', l: 24, t: 'giving' },

  // adj
  { s: 'この{料理|りょうり}はあまり＿。', o: ['おいしくないです', 'おいしいです', 'おいしいじゃありません', 'おいしいではないです'], de: 'Dieses Essen schmeckt nicht besonders gut.', why: 'あまり braucht die Verneinung. い-Adjektiv: い → くないです.', l: 8, t: 'adj' },
  { s: 'この{町|まち}はあまり＿。', o: ['{静|しず}かじゃありません', '{静|しず}かくないです', '{静|しず}かです', '{静|しず}かないです'], de: 'Diese Stadt ist nicht sehr ruhig.', why: 'な-Adjektive verneint man wie Nomen: じゃありません.', l: 8, t: 'adj' },
  { s: '{奈良|なら}は＿{町|まち}です。', o: ['きれいな', 'きれい', 'きれいの', 'きれいく'], de: 'Nara ist eine schöne Stadt.', why: 'きれい ist ein な-Adjektiv (trotz い am Ende): vor dem Nomen きれいな.', l: 8, t: 'adj' },
  { s: 'これは＿{車|くるま}です。', o: ['{新|あたら}しい', '{新|あたら}しいな', '{新|あたら}しの', '{新|あたら}しく'], de: 'Das ist ein neues Auto.', why: 'い-Adjektive stehen direkt vor dem Nomen, ohne な.', l: 8, t: 'adj' },
  { s: '{富士山|ふじさん}は＿{高|たか}い{山|やま}です。', o: ['とても', 'あまり', '{全然|ぜんぜん}', 'よく'], de: 'Der Fuji ist ein sehr hoher Berg.', why: 'とても = sehr. あまり und ぜんぜん brauchen eine Verneinung.', l: 8, t: 'adj' },
  { s: '{昨日|きのう}は＿。', o: ['{暑|あつ}かったです', '{暑|あつ}いでした', '{暑|あつ}いです', '{暑|あつ}かったでした'], de: 'Gestern war es heiß.', why: 'い-Adjektiv in der Vergangenheit: い → かったです, nicht いでした.', l: 12, t: 'adj' },
  { s: '{先週|せんしゅう}のパーティーはとても＿。', o: ['にぎやかでした', 'にぎやかかったです', 'にぎやかです', 'にぎやかだでした'], de: 'Die Party letzte Woche war sehr lebhaft.', why: 'な-Adjektiv in der Vergangenheit: でした.', l: 12, t: 'adj' },
  { s: '{昨日|きのう}は{天気|てんき}が＿。', o: ['よかったです', 'いかったです', 'いいでした', 'よくないです'], de: 'Gestern war das Wetter gut.', why: 'いい hat die Formen よかった, よくない – nie いかった.', l: 12, t: 'adj' },

  // suki
  { s: '{私|わたし}は{音楽|おんがく}＿{好|す}きです。', o: ['が', 'を', 'に', 'で'], de: 'Ich mag Musik.', why: 'Bei すき, きらい, じょうず, わかります steht が, nicht を.', l: 9, t: 'suki' },
  { q: 'Du sagst: Herr Miller ist ein guter Koch.', s: 'ミラーさんは{料理|りょうり}が＿。', o: ['{上手|じょうず}です', '{下手|へた}です', '{好|す}きです', '{嫌|きら}いです'], de: 'Herr Miller kann gut kochen.', why: 'じょうず = gut in etwas. すき heißt nur „mögen“.', l: 9, t: 'suki' },
  { s: '{私|わたし}は{漢字|かんじ}が{全然|ぜんぜん}＿。', o: ['{分|わ}かりません', '{分|わ}かります', '{分|わ}かりました', '{分|わ}かって'], de: 'Ich verstehe überhaupt keine Kanji.', why: 'ぜんぜん (überhaupt) steht mit Verneinung.', l: 9, t: 'suki' },
  { s: '{私|わたし}の＿スポーツはサッカーです。', o: ['{好|す}きな', '{好|す}き', '{好|す}きの', '{好|す}きい'], de: 'Mein Lieblingssport ist Fußball.', why: 'すき ist ein な-Adjektiv: vor dem Nomen すきな.', l: 9, t: 'suki' },
  { s: '{今日|きょう}は{時間|じかん}＿ありません。', o: ['が', 'を', 'に', 'で'], de: 'Heute habe ich keine Zeit.', why: 'Haben (besitzen) mit あります: das, was man hat, steht mit が.', l: 9, t: 'suki' },

  // reason
  { s: '{時間|じかん}がありません＿、タクシーで{行|い}きます。', o: ['から', 'が', 'まで', 'でも'], de: 'Weil ich keine Zeit habe, nehme ich ein Taxi.', why: '〜から = weil. 〜が = aber passt hier nicht.', l: 9, t: 'reason' },
  { s: 'A：どうして{日本語|にほんご}を{勉強|べんきょう}しますか。B：{日本|にほん}の{映画|えいが}が{好|す}きです＿。', o: ['から', 'まで', 'より', 'でも'], de: 'A: Warum lernen Sie Japanisch? B: Weil ich japanische Filme mag.', why: 'Auf どうして antwortet man mit 〜から.', l: 9, t: 'reason' },
  { s: '＿、{今日|きょう}は{早|はや}く{帰|かえ}ります。', o: ['{用事|ようじ}がありますから', '{用事|ようじ}がありますが', '{用事|ようじ}から', 'から{用事|ようじ}があります'], de: 'Weil ich etwas zu erledigen habe, gehe ich heute früh nach Hause.', why: 'Der Grund steht vorn, から hängt am Ende des Grundes.', l: 9, t: 'reason' },
  { s: '{寒|さむ}いです＿、{窓|まど}を{閉|し}めてください。', o: ['から', 'が', 'けど', 'まで'], de: 'Weil es kalt ist, schließen Sie bitte das Fenster.', why: 'Kälte ist der Grund: から. が und けど heißen „aber“.', l: 14, t: 'reason' },
  { s: '{熱|ねつ}があります＿、{明日|あした}は{休|やす}みます。', o: ['から', 'が', 'て', 'まで'], de: 'Weil ich Fieber habe, bleibe ich morgen zu Hause.', why: '〜から gibt den Grund an. て kann nicht nach あります stehen.', l: 17, t: 'reason' },

  // exist
  { s: '{机|つくえ}の{上|うえ}に{猫|ねこ}が＿。', o: ['います', 'あります', 'です', 'ありません'], de: 'Auf dem Tisch ist eine Katze.', why: 'Für Menschen und Tiere: います, für Dinge: あります.', l: 10, t: 'exist' },
  { s: '{冷蔵庫|れいぞうこ}の{中|なか}に{卵|たまご}が＿。', o: ['あります', 'います', 'です', 'いません'], de: 'Im Kühlschrank sind Eier.', why: 'Eier sind Dinge: あります.', l: 10, t: 'exist' },
  { s: 'ミラーさんは{会議室|かいぎしつ}＿います。', o: ['に', 'で', 'が', 'へ'], de: 'Herr Miller ist im Besprechungsraum.', why: 'Wo jemand oder etwas ist: Ort + に います/あります. で nur bei Handlungen.', l: 10, t: 'exist' },
  { q: 'Du fragst nach dem Weg zum Bahnhof.', s: 'すみません、{駅|えき}は＿ありますか。', o: ['どこに', 'どこで', '{何|なに}が', 'どこが'], de: 'Entschuldigung, wo ist der Bahnhof?', why: 'Nach dem Ort fragt man mit どこに あります か.', l: 10, t: 'exist' },
  { s: '{箱|はこ}の{中|なか}に＿がありますか。', o: ['{何|なに}', 'だれ', 'どこ', 'どれ'], de: 'Was ist in der Schachtel?', why: 'Dinge mit あります: なにが. だれが passt zu います.', l: 10, t: 'exist' },
  { s: '{教室|きょうしつ}にだれも＿。', o: ['いません', 'ありません', 'います', 'あります'], de: 'Im Klassenzimmer ist niemand.', why: 'だれも + Verneinung; für Menschen います → いません.', l: 10, t: 'exist' },
  { s: '{私|わたし}は{子|こ}どもが3{人|にん}＿。', o: ['います', 'あります', 'です', 'がいます'], de: 'Ich habe drei Kinder.', why: 'Kinder oder Geschwister haben: 〜が います (Menschen).', l: 11, t: 'exist' },
  { s: '{明日|あした}{大阪|おおさか}＿{会議|かいぎ}があります。', o: ['で', 'に', 'へ', 'を'], de: 'Morgen findet in Osaka eine Besprechung statt.', why: 'Ereignisse (かいぎ, パーティー) „finden statt“: Ort + で あります.', l: 21, t: 'exist' },

  // location
  { q: 'Die Buchhandlung liegt zwischen der Bank und der Post.', s: '{本屋|ほんや}は{銀行|ぎんこう}と{郵便局|ゆうびんきょく}の＿にあります。', o: ['{間|あいだ}', '{上|うえ}', '{中|なか}', '{前|まえ}'], de: 'Die Buchhandlung liegt zwischen der Bank und der Post.', why: 'AとBの あいだ = zwischen A und B.', l: 10, t: 'location' },
  { q: 'Jemand fragt dich, wo Herr Miller ist.', s: 'ミラーさん＿{事務所|じむしょ}にいます。', o: ['は', 'が', 'を', 'で'], de: 'Herr Miller ist im Büro.', why: 'Antwort auf „Wo ist …?“: Person + は + Ort + に. が antwortet auf „Wer ist da?“.', l: 10, t: 'location' },
  { q: 'Jemand fragt, was in der Schachtel ist.', s: '{箱|はこ}の{中|なか}に{手紙|てがみ}＿あります。', o: ['が', 'は', 'を', 'で'], de: 'In der Schachtel ist ein Brief.', why: 'Ort に + Ding が あります: das Neue (hier der Brief) steht mit が.', l: 10, t: 'location' },
  { q: 'Die Katze ist unter dem Tisch.', s: '{猫|ねこ}はテーブルの＿にいます。', o: ['{下|した}', '{上|うえ}', '{後|うし}ろ', '{中|なか}'], de: 'Die Katze ist unter dem Tisch.', why: 'した = unter, うえ = auf, うしろ = hinter.', l: 10, t: 'location' },
  { s: '{駅|えき}の＿にスーパーがあります。', o: ['{近|ちか}く', '{近|ちか}い', '{近|ちか}くに', '{近|ちか}'], de: 'In der Nähe des Bahnhofs gibt es einen Supermarkt.', why: 'ちかく ist ein Nomen (Nähe): 〜の ちかくに.', l: 10, t: 'location' },

  // counter
  { s: 'りんごを＿{買|か}いました。', o: ['3つ', '3{枚|まい}', '3{台|だい}', '3{人|にん}'], de: 'Ich habe drei Äpfel gekauft.', why: 'Allgemeine Dinge zählt man mit 〜つ. Die Zahl steht nach を, direkt vor dem Verb.', l: 11, t: 'counter' },
  { s: '{切手|きって}を5＿ください。', o: ['{枚|まい}', 'つ', '{台|だい}', '{回|かい}'], de: 'Fünf Briefmarken, bitte.', why: 'Flache, dünne Dinge (Papier, Briefmarken, Hemden): 〜まい.', l: 11, t: 'counter' },
  { s: '{教室|きょうしつ}に{学生|がくせい}が＿います。', o: ['5{人|にん}', '5つ', '5{枚|まい}', '5{台|だい}'], de: 'Im Klassenzimmer sind fünf Studenten.', why: 'Personen zählt man mit 〜にん (Ausnahmen: ひとり, ふたり).', l: 11, t: 'counter' },
  { s: '{家|うち}に{車|くるま}が＿あります。', o: ['2{台|だい}', '2{枚|まい}', '2{回|かい}', '2{本|ほん}'], de: 'Wir haben zu Hause zwei Autos.', why: 'Maschinen und Fahrzeuge zählt man mit 〜だい.', l: 11, t: 'counter' },
  { s: '1{週間|しゅうかん}に＿テニスをします。', o: ['2{回|かい}', '2{台|だい}', '2{枚|まい}', '2つ'], de: 'Ich spiele zweimal pro Woche Tennis.', why: 'Wie oft: 〜かい. Zeitraum に + 〜かい = … mal pro ….', l: 11, t: 'counter' },
  { s: '{日本|にほん}で3＿{日本語|にほんご}を{勉強|べんきょう}しました。', o: ['か{月|げつ}', '{月|がつ}', '{週|しゅう}', 'つ'], de: 'Ich habe drei Monate in Japan Japanisch gelernt.', why: 'Dauer in Monaten: 〜かげつ. 〜がつ ist der Monatsname (3がつ = März).', l: 11, t: 'counter' },
  { s: 'A：ご{家族|かぞく}は＿ですか。B：4{人|にん}です。', o: ['{何人|なんにん}', 'いくつ', '{何歳|なんさい}', 'いくら'], de: 'A: Wie viele Personen sind in Ihrer Familie? B: Vier.', why: 'Personen zählt man mit 〜にん, also fragt man なんにん. なんさい fragt nach dem Alter.', l: 11, t: 'counter' },

  // compare
  { s: '{東京|とうきょう}は{大阪|おおさか}＿{大|おお}きいです。', o: ['より', 'ほう', 'から', 'まで'], de: 'Tokyo ist größer als Osaka.', why: 'A は B より … = A ist …er als B.', l: 12, t: 'compare' },
  { s: 'コーヒーと{紅茶|こうちゃ}と＿が{好|す}きですか。', o: ['どちら', 'どれ', 'どこ', 'なに'], de: 'Was mögen Sie lieber, Kaffee oder Tee?', why: 'Auswahl aus zwei: どちら. どれ bei drei und mehr.', l: 12, t: 'compare' },
  { s: 'A：{肉|にく}と{魚|さかな}とどちらが{好|す}きですか。B：{魚|さかな}の＿が{好|す}きです。', o: ['ほう', 'より', 'どちら', 'いちばん'], de: 'A: Mögen Sie lieber Fleisch oder Fisch? B: Ich mag lieber Fisch.', why: 'Antwort auf どちら: 〜の ほうが ….', l: 12, t: 'compare' },
  { s: '{日本|にほん}で＿{高|たか}い{山|やま}は{富士山|ふじさん}です。', o: ['いちばん', 'もっと', 'より', 'ほう'], de: 'Der höchste Berg Japans ist der Fuji.', why: 'Superlativ: いちばん (am meisten).', l: 12, t: 'compare' },
  { s: '{季節|きせつ}＿いつがいちばん{好|す}きですか。', o: ['で', 'に', 'を', 'の'], de: 'Welche Jahreszeit mögen Sie am liebsten?', why: 'Bereich beim Superlativ: 〜で … いちばん (unter den Jahreszeiten).', l: 12, t: 'compare' },
  { s: 'A：{北海道|ほっかいどう}と{沖縄|おきなわ}とどちらが{好|す}きですか。B：＿{好|す}きです。', o: ['どちらも', 'どちら', 'どれも', 'どちらが'], de: 'A: Mögen Sie lieber Hokkaido oder Okinawa? B: Ich mag beide.', why: 'Beide von zweien: どちらも. どれも gilt für drei und mehr.', l: 12, t: 'compare' },

  // want
  { s: '{私|わたし}は{新|あたら}しい{車|くるま}＿{欲|ほ}しいです。', o: ['が', 'を', 'に', 'で'], de: 'Ich möchte ein neues Auto.', why: 'Bei ほしい steht das Gewünschte mit が.', l: 13, t: 'want' },
  { s: '{来年|らいねん}{日本|にほん}へ＿です。', o: ['{行|い}きたい', '{行|い}きます', '{行|い}きたく', '{行|い}って'], de: 'Nächstes Jahr möchte ich nach Japan fahren.', why: 'Etwas tun wollen: ます-Stamm + たいです.', l: 13, t: 'want' },
  { s: '{疲|つか}れましたから、{何|なに}も＿。', o: ['{食|た}べたくないです', '{食|た}べたいです', '{食|た}べたいじゃありません', '{食|た}べないたいです'], de: 'Ich bin müde, deshalb möchte ich nichts essen.', why: '〜たい verhält sich wie ein い-Adjektiv: たい → たくないです.', l: 13, t: 'want' },
  { q: 'Du fragst eine Freundin, was sie sich zum Geburtstag wünscht.', s: '{誕生日|たんじょうび}に{何|なに}が＿か。', o: ['{欲|ほ}しいです', '{欲|ほ}しくないです', '{欲|ほ}しいでした', '{欲|ほ}しくです'], de: 'Was wünschst du dir zum Geburtstag?', why: 'ほしい ist ein い-Adjektiv: ほしいです. ほしいでした gibt es nicht.', l: 13, t: 'want' },
  { q: 'Du möchtest eine Kamera kaufen.', s: 'カメラを＿。', o: ['{買|か}いたいです', '{欲|ほ}しいです', '{買|か}いたいます', '{買|か}いほしいです'], de: 'Ich möchte eine Kamera kaufen.', why: 'Mit を und einem Verb: 〜たいです. ほしい steht mit が.', l: 13, t: 'want' },

  // purpose
  { s: 'デパートへ{靴|くつ}を＿に{行|い}きます。', o: ['{買|か}い', '{買|か}う', '{買|か}って', '{買|か}いた'], de: 'Ich gehe ins Kaufhaus, um Schuhe zu kaufen.', why: 'Zweck: ます-Stamm + に + いきます/きます.', l: 13, t: 'purpose' },
  { s: 'スーパーへ{買|か}い{物|もの}＿{行|い}きます。', o: ['に', 'を', 'で', 'へ'], de: 'Ich gehe in den Supermarkt einkaufen.', why: 'Handlungsnomen (かいもの, さんぽ) + に + いきます.', l: 13, t: 'purpose' },
  { s: '{日曜日|にちようび}{東京|とうきょう}へ{友達|ともだち}に＿{行|い}きます。', o: ['{会|あ}い', '{会|あ}う', '{会|あ}って', '{会|あ}いたい'], de: 'Am Sonntag fahre ich nach Tokyo, um einen Freund zu treffen.', why: 'ます-Stamm + に いきます: あいます → あいに.', l: 13, t: 'purpose' },
  { q: 'Du gehst ins Restaurant, um zu Mittag zu essen.', s: 'レストランへ{昼|ひる}ご{飯|はん}を＿。', o: ['{食|た}べに{行|い}きます', '{食|た}べを{行|い}きます', '{食|た}べるに{行|い}きます', '{食|た}べたいに{行|い}きます'], de: 'Ich gehe ins Restaurant, um zu Mittag zu essen.', why: 'Zweck mit Verb: ます-Stamm (たべ) + に.', l: 13, t: 'purpose' },

  // te-request
  { s: 'すみませんが、ちょっと＿ください。', o: ['{待|ま}って', '{待|ま}ち', '{待|ま}た', '{待|ま}つ'], de: 'Entschuldigung, warten Sie bitte einen Moment.', why: 'Bitte: て-Form + ください. まちます → まって.', l: 14, t: 'te-request' },
  { s: 'もう{少|すこ}しゆっくり＿ください。', o: ['{話|はな}して', '{話|はな}って', '{話|はな}いて', '{話|はな}し'], de: 'Sprechen Sie bitte etwas langsamer.', why: 'Verben auf 〜します: し → して (はなします → はなして).', l: 14, t: 'te-request' },
  { s: 'ここに{名前|なまえ}を＿ください。', o: ['{書|か}いて', '{書|か}って', '{書|か}きて', '{書|か}して'], de: 'Schreiben Sie bitte hier Ihren Namen.', why: 'Verben auf 〜きます: き → いて (かきます → かいて).', l: 14, t: 'te-request' },
  { s: 'まっすぐ＿ください。', o: ['{行|い}って', '{行|い}いて', '{行|い}きて', '{行|い}た'], de: 'Fahren Sie bitte geradeaus.', why: 'Ausnahme: いきます → いって (nicht いいて).', l: 14, t: 'te-request' },
  { s: '{明日|あした}9{時|じ}に{会社|かいしゃ}へ＿ください。', o: ['{来|き}て', '{来|き}って', '{来|き}た', '{来|く}るて'], de: 'Kommen Sie bitte morgen um 9 Uhr in die Firma.', why: 'きます → きて (ohne っ). Vor ください steht immer die て-Form.', l: 14, t: 'te-request' },
  { s: 'たくさん{水|みず}を＿ください。', o: ['{飲|の}んで', '{飲|の}みて', '{飲|の}って', '{飲|の}いて'], de: 'Trinken Sie bitte viel Wasser.', why: 'Verben auf 〜みます, 〜びます, 〜にます: → んで (のみます → のんで).', l: 14, t: 'te-request' },

  // te-iru
  { q: 'Es regnet gerade.', s: '{雨|あめ}が＿。', o: ['{降|ふ}っています', '{降|ふ}ります', '{降|ふ}りています', '{降|ふ}ってください'], de: 'Es regnet.', why: 'Was gerade geschieht: て-Form + います. ふります → ふって.', l: 14, t: 'te-iru' },
  { q: 'Herr Miller telefoniert gerade.', s: 'ミラーさんは{今|いま}{電話|でんわ}を＿。', o: ['かけています', 'かけます', 'かけてください', 'かけましょう'], de: 'Herr Miller telefoniert gerade.', why: 'Handlung im Verlauf: 〜ています. かけます hieße „wird anrufen“.', l: 14, t: 'te-iru' },
  { q: 'Du wohnst in Osaka.', s: '{私|わたし}は{大阪|おおさか}に＿。', o: ['{住|す}んでいます', '{住|す}みます', '{住|す}んでいました', '{住|す}みています'], de: 'Ich wohne in Osaka.', why: 'Wohnen ist ein Zustand: すんでいます.', l: 15, t: 'te-iru' },
  { s: 'A：{田中|たなか}さんの{電話番号|でんわばんごう}を＿か。B：いいえ、{知|し}りません。', o: ['{知|し}っています', '{知|し}ります', '{知|し}りました', '{知|し}っていません'], de: 'A: Kennen Sie die Telefonnummer von Herrn Tanaka? B: Nein, kenne ich nicht.', why: 'Wissen: しっています. Die Verneinung ist aber しりません.', l: 15, t: 'te-iru' },
  { q: 'Frau Kimura ist verheiratet.', s: '{木村|きむら}さんは＿。', o: ['{結婚|けっこん}しています', '{結婚|けっこん}します', '{結婚|けっこん}しましたか', '{結婚|けっこん}しませんでした'], de: 'Frau Kimura ist verheiratet.', why: 'Verheiratet sein ist ein Zustand: けっこんしています.', l: 15, t: 'te-iru' },
  { q: 'Dein älterer Bruder arbeitet bei einer Bank.', s: '{兄|あに}は{銀行|ぎんこう}で＿。', o: ['{働|はたら}いています', '{働|はたら}きます', '{働|はたら}きています', '{働|はたら}いてください'], de: 'Mein älterer Bruder arbeitet bei einer Bank.', why: 'Beruf und Arbeitsstelle: 〜ています. はたらきます → はたらいて.', l: 15, t: 'te-iru' },
  { q: 'Du fragst, ob er ein Auto hat.', s: '{車|くるま}を＿か。', o: ['{持|も}っています', '{持|も}ちます', '{持|も}ちました', '{持|も}ちています'], de: 'Haben Sie ein Auto?', why: 'Besitzen: もっています. もちます heißt „tragen, nehmen“.', l: 15, t: 'te-iru' },

  // permission
  { s: 'ここで{写真|しゃしん}を＿もいいですか。', o: ['{撮|と}って', '{撮|と}り', '{撮|と}る', '{撮|と}った'], de: 'Darf ich hier fotografieren?', why: 'Erlaubnis: て-Form + も いいですか.', l: 15, t: 'permission' },
  { s: '{美術館|びじゅつかん}の{中|なか}でたばこを＿はいけません。', o: ['{吸|す}って', '{吸|す}い', '{吸|す}う', '{吸|す}わないで'], de: 'Im Museum darf man nicht rauchen.', why: 'Verbot: て-Form + は いけません.', l: 15, t: 'permission' },
  { s: 'A：この{辞書|じしょ}を{借|か}りてもいいですか。B：ええ、＿。', o: ['いいですよ', 'いけません', 'ください', 'いいですか'], de: 'A: Darf ich mir dieses Wörterbuch leihen? B: Ja, gern.', why: 'Erlaubnis geben: ええ、いいですよ (oder どうぞ).', l: 15, t: 'permission' },
  { s: '{試験|しけん}で{辞書|じしょ}を{使|つか}っては＿。', o: ['いけません', 'いいです', 'いけます', 'だめません'], de: 'In der Prüfung darf man kein Wörterbuch benutzen.', why: '〜ては いけません = darf nicht. 〜ては いいです gibt es nicht.', l: 15, t: 'permission' },
  { s: 'ここに{座|すわ}っても＿か。', o: ['いいです', 'いけません', 'ください', 'います'], de: 'Darf ich mich hierhin setzen?', why: '〜ても いいですか = Darf ich …?', l: 15, t: 'permission' },

  // te-sequence
  { s: '{朝|あさ}{起|お}きて、シャワーを＿、{会社|かいしゃ}へ{行|い}きます。', o: ['{浴|あ}びて', '{浴|あ}びます', '{浴|あ}びた', '{浴|あ}びって'], de: 'Morgens stehe ich auf, dusche und gehe zur Arbeit.', why: 'Mehrere Handlungen nacheinander: て、て、… Erst das letzte Verb zeigt die Zeit.', l: 16, t: 'te-sequence' },
  { s: '{昨日|きのう}は{図書館|としょかん}へ＿、{本|ほん}を{借|か}りました。', o: ['{行|い}って', '{行|い}きて', '{行|い}いて', '{行|い}った'], de: 'Gestern bin ich in die Bibliothek gegangen und habe ein Buch ausgeliehen.', why: 'Auch in der Vergangenheit bleibt das erste Verb in der て-Form: いって.', l: 16, t: 'te-sequence' },
  { s: '{仕事|しごと}が{終|お}わって＿、{飲|の}みに{行|い}きましょう。', o: ['から', 'まで', 'に', 'で'], de: 'Lass uns nach der Arbeit etwas trinken gehen.', why: '〜てから = nachdem, erst … dann.', l: 16, t: 'te-sequence' },
  { s: 'この{部屋|へや}は＿{明|あか}るいです。', o: ['{広|ひろ}くて', '{広|ひろ}いて', '{広|ひろ}いで', '{広|ひろ}くで'], de: 'Dieses Zimmer ist groß und hell.', why: 'い-Adjektive verbindet man mit い → くて.', l: 16, t: 'te-sequence' },
  { s: 'ミラーさんは＿、{親切|しんせつ}です。', o: ['ハンサムで', 'ハンサムくて', 'ハンサムなて', 'ハンサムだ'], de: 'Herr Miller sieht gut aus und ist freundlich.', why: 'な-Adjektive und Nomen verbindet man mit で.', l: 16, t: 'te-sequence' },
  { s: 'ワンさんは{中国人|ちゅうごくじん}＿、{医者|いしゃ}です。', o: ['で', 'て', 'くて', 'と'], de: 'Herr Wang ist Chinese und Arzt.', why: 'Nomen + で verbindet zwei Aussagen (und).', l: 16, t: 'te-sequence' },
  { s: '{銀行|ぎんこう}でお{金|かね}を＿、{買|か}い{物|もの}をします。', o: ['{下|お}ろして', '{下|お}ろしって', '{下|お}ろした', '{下|お}ろします'], de: 'Ich hebe bei der Bank Geld ab und gehe dann einkaufen.', why: 'Verben auf 〜します: し → して.', l: 16, t: 'te-sequence' },

  // nai
  { q: 'Hier darf man nicht parken – du bittest jemanden höflich darum.', s: 'ここに{車|くるま}を＿ください。', o: ['{止|と}めないで', '{止|と}めて', '{止|と}めなくて', '{止|と}めません'], de: 'Bitte parken Sie hier nicht.', why: 'Bitte, etwas nicht zu tun: ない-Form + で ください.', l: 17, t: 'nai' },
  { s: 'この{部屋|へや}では{写真|しゃしん}を＿ください。', o: ['{撮|と}らないで', '{撮|と}りないで', '{撮|と}るないで', '{撮|と}らなくて'], de: 'Bitte fotografieren Sie in diesem Raum nicht.', why: 'Gruppe 1: り → らない (とります → とらない).', l: 17, t: 'nai' },
  { s: 'このことはだれにも＿ください。', o: ['{話|はな}さないで', '{話|はな}しないで', '{話|はな}すないで', '{話|はな}さなくて'], de: 'Erzählen Sie das bitte niemandem.', why: 'はなします gehört zu Gruppe 1: し → さない.', l: 17, t: 'nai' },
  { s: '{大丈夫|だいじょうぶ}ですから、＿ください。', o: ['{心配|しんぱい}しないで', '{心配|しんぱい}しなくて', '{心配|しんぱい}さないで', '{心配|しんぱい}して'], de: 'Es ist alles in Ordnung, machen Sie sich keine Sorgen.', why: 'します → しない; mit で ください: しないでください.', l: 17, t: 'nai' },
  { s: '{明日|あした}までにレポートを＿なりません。', o: ['{出|だ}さなければ', '{出|だ}しなければ', '{出|だ}さないで', '{出|だ}さなくても'], de: 'Ich muss den Bericht bis morgen abgeben.', why: 'Müssen: ない-Form ohne い + ければ なりません. だします → ださない.', l: 17, t: 'nai' },
  { s: '{明日|あした}は{休|やす}みですから、{早|はや}く＿もいいです。', o: ['{起|お}きなくて', '{起|お}きなければ', '{起|お}きなく', '{起|お}きないくて'], de: 'Morgen ist frei, du musst also nicht früh aufstehen.', why: 'Nicht müssen: ない → なくても いいです.', l: 17, t: 'nai' },
  { s: '{明日|あした}は＿もいいです。', o: ['{来|こ}なくて', '{来|く}らなくて', '{来|こ}なければ', '{来|こ}なく'], de: 'Morgen müssen Sie nicht kommen.', why: 'Die ない-Form von きます ist こない (nicht くらない) → こなくても いいです.', l: 17, t: 'nai' },

  // dict
  { s: '{私|わたし}はピアノを＿ことができます。', o: ['{弾|ひ}く', '{弾|ひ}き', '{弾|ひ}いて', '{弾|ひ}きます'], de: 'Ich kann Klavier spielen.', why: 'Können: Wörterbuchform + ことが できます.', l: 18, t: 'dict' },
  { s: '{私|わたし}の{趣味|しゅみ}は{写真|しゃしん}を＿ことです。', o: ['{撮|と}る', '{撮|と}ります', '{撮|と}り', '{撮|と}って'], de: 'Mein Hobby ist Fotografieren.', why: 'Vor こと steht die Wörterbuchform: とります → とる.', l: 18, t: 'dict' },
  { s: '{寝|ね}る＿、{日記|にっき}を{書|か}きます。', o: ['{前|まえ}に', '{前|まえ}の', 'あとで', 'てから'], de: 'Vor dem Schlafen schreibe ich Tagebuch.', why: 'Wörterbuchform + まえに = bevor. あとで braucht die た-Form.', l: 18, t: 'dict' },
  { s: '{食事|しょくじ}＿{前|まえ}に、{手|て}を{洗|あら}います。', o: ['の', 'な', 'を', 'が'], de: 'Vor dem Essen wasche ich mir die Hände.', why: 'Nomen + の まえに.', l: 18, t: 'dict' },
  { s: 'ミラーさんは{日本語|にほんご}＿できます。', o: ['が', 'を', 'に', 'へ'], de: 'Herr Miller kann Japanisch.', why: 'Nomen + が できます. Nicht を!', l: 18, t: 'dict' },
  { s: '{私|わたし}は{車|くるま}を＿ことができません。', o: ['{運転|うんてん}する', '{運転|うんてん}します', '{運転|うんてん}して', '{運転|うんてん}すり'], de: 'Ich kann nicht Auto fahren.', why: 'Wörterbuchform von 〜します ist 〜する.', l: 18, t: 'dict' },

  // ta
  { q: 'Du warst schon einmal auf dem Fuji.', s: '{私|わたし}は{富士山|ふじさん}に＿ことがあります。', o: ['{登|のぼ}った', '{登|のぼ}る', '{登|のぼ}って', '{登|のぼ}りた'], de: 'Ich habe schon einmal den Fuji bestiegen.', why: 'Erfahrung: た-Form + ことが あります. のぼります → のぼった.', l: 19, t: 'ta' },
  { q: 'Du fragst, ob er schon einmal Sumo gesehen hat.', s: '{相撲|すもう}を＿ことがありますか。', o: ['{見|み}た', '{見|み}て', '{見|み}る', '{見|み}った'], de: 'Haben Sie schon einmal Sumo gesehen?', why: 'Gruppe 2: ます weg, た dazu: みます → みた.', l: 19, t: 'ta' },
  { s: 'すしは{一度|いちど}も＿。', o: ['{食|た}べたことがありません', '{食|た}べたことがあります', '{食|た}べてことがありません', '{食|た}べたがありません'], de: 'Ich habe noch nie Sushi gegessen.', why: 'いちども + Verneinung = noch nie: 〜たことが ありません.', l: 19, t: 'ta' },
  { s: '{日曜日|にちようび}はテニスをしたり、{映画|えいが}を＿します。', o: ['{見|み}たり', '{見|み}て', '{見|み}た', '{見|み}たら'], de: 'Am Sonntag spiele ich zum Beispiel Tennis oder sehe Filme.', why: 'Beispiele aufzählen: 〜たり、〜たり します – beide Verben mit たり.', l: 19, t: 'ta' },
  { s: '{休|やす}みの{日|ひ}は{本|ほん}を{読|よ}んだり、{音楽|おんがく}を＿します。', o: ['{聞|き}いたり', '{聞|き}きたり', '{聞|き}いだり', '{聞|き}ったり'], de: 'An freien Tagen lese ich zum Beispiel Bücher oder höre Musik.', why: 'た-Form wie て-Form: ききます → きいて → きいた(り).', l: 19, t: 'ta' },

  // naru
  { q: 'Es ist allmählich kalt geworden.', s: 'だんだん{寒|さむ}く＿ね。', o: ['なりました', 'しました', 'ありました', 'でした'], de: 'Es ist allmählich kalt geworden, nicht?', why: 'Werden: い-Adjektiv mit く + なります.', l: 19, t: 'naru' },
  { s: '{部屋|へや}が＿なりました。', o: ['きれいに', 'きれいく', 'きれいな', 'きれい'], de: 'Das Zimmer ist sauber geworden.', why: 'な-Adjektive und Nomen: + に なります. きれい ist ein な-Adjektiv.', l: 19, t: 'naru' },
  { s: '{弟|おとうと}は{来年|らいねん}18{歳|さい}＿なります。', o: ['に', 'く', 'が', 'を'], de: 'Mein jüngerer Bruder wird nächstes Jahr 18.', why: 'Nomen + に なります.', l: 19, t: 'naru' },
  { s: '{天気|てんき}が＿なりました。', o: ['よく', 'いく', 'いいに', 'よい'], de: 'Das Wetter ist besser geworden.', why: 'いい → よく なります (nicht いく).', l: 19, t: 'naru' },
  { q: 'Du möchtest Ärztin werden.', s: '{医者|いしゃ}に＿たいです。', o: ['なり', 'し', 'なる', 'なって'], de: 'Ich möchte Ärztin werden.', why: 'なります → ます-Stamm なり + たいです.', l: 19, t: 'naru' },

  // plain
  { q: 'Ein Freund fragt dich ganz locker: Gehst du morgen zur Uni?', s: '{明日|あした}{大学|だいがく}へ＿？', o: ['{行|い}く', '{行|い}きます', '{行|い}った', '{行|い}って'], de: 'Gehst du morgen zur Uni?', why: 'Unter Freunden: einfache Form (Wörterbuchform) statt いきます.', l: 20, t: 'plain' },
  { s: 'A：{今|いま}、{時間|じかん}ある？B：ごめん、＿。', o: ['ない', 'あらない', 'ありない', 'ないだ'], de: 'A: Hast du gerade Zeit? B: Sorry, hab ich nicht.', why: 'Die einfache Verneinung von ある ist ない (Ausnahme).', l: 20, t: 'plain' },
  { s: 'A：{明日|あした}、{休|やす}み？B：ううん、{休|やす}み＿。', o: ['じゃない', 'くない', 'だない', 'じゃなかった'], de: 'A: Hast du morgen frei? B: Nein, hab ich nicht.', why: 'Nomen verneint in einfacher Form: じゃない. くない nur bei い-Adjektiven.', l: 20, t: 'plain' },
  { s: 'A：{昨日|きのう}のパーティー、どうだった？B：とても＿よ。', o: ['{楽|たの}しかった', '{楽|たの}しいだった', '{楽|たの}しかっただ', '{楽|たの}しい'], de: 'A: Wie war die Party gestern? B: Sehr lustig!', why: 'い-Adjektiv, einfache Vergangenheit: たのしかった – ohne だ.', l: 20, t: 'plain' },
  { s: 'A：{昨日|きのう}、テレビ{見|み}た？B：ううん、＿。', o: ['{見|み}なかった', '{見|み}ない', '{見|み}ないだった', '{見|み}たない'], de: 'A: Hast du gestern ferngesehen? B: Nein.', why: 'Einfache verneinte Vergangenheit: ない → なかった.', l: 20, t: 'plain' },
  { s: 'A：{休|やす}みはどこか{行|い}った？B：うん、{北海道|ほっかいどう}へ＿よ。', o: ['{行|い}った', '{行|い}きた', '{行|い}いた', '{行|い}くた'], de: 'A: Warst du in den Ferien irgendwo? B: Ja, in Hokkaido.', why: 'いく ist eine Ausnahme: いった (wie いって).', l: 20, t: 'plain' },
  { s: 'A：この{辞書|じしょ}、{便利|べんり}？B：うん、とても＿よ。', o: ['{便利|べんり}だ', '{便利|べんり}な', '{便利|べんり}い', '{便利|べんり}く'], de: 'A: Ist dieses Wörterbuch praktisch? B: Ja, sehr.', why: 'な-Adjektiv in einfacher Form: べんりだ. べんりな nur vor einem Nomen.', l: 20, t: 'plain' },

  // omou
  { s: '{明日|あした}は{雨|あめ}が＿と{思|おも}います。', o: ['{降|ふ}る', '{降|ふ}ります', '{降|ふ}って', '{降|ふ}った'], de: 'Ich glaube, dass es morgen regnet.', why: 'Vor と おもいます steht die einfache Form: ふります → ふる.', l: 21, t: 'omou' },
  { s: 'あの{人|ひと}は{先生|せんせい}＿と{思|おも}います。', o: ['だ', 'です', 'な', 'の'], de: 'Ich glaube, die Person dort ist Lehrerin.', why: 'Nomen + だ + と おもいます. です steht nicht vor と.', l: 21, t: 'omou' },
  { s: '{日本|にほん}の{物価|ぶっか}は＿と{思|おも}います。', o: ['{高|たか}い', '{高|たか}いだ', '{高|たか}いです', '{高|たか}く'], de: 'Ich finde, die Preise in Japan sind hoch.', why: 'い-Adjektive stehen ohne だ vor と おもいます.', l: 21, t: 'omou' },
  { s: 'ミラーさんは{明日|あした}{休|やす}む＿{言|い}いました。', o: ['と', 'を', 'に', 'が'], de: 'Herr Miller hat gesagt, dass er sich morgen freinimmt.', why: 'Was jemand sagt: einfache Form + と いいました.', l: 21, t: 'omou' },
  { s: 'A：{明日|あした}のパーティーに{木村|きむら}さんも{来|き}ますか。B：たぶん＿でしょう。', o: ['{来|く}る', '{来|き}ます', '{来|き}て', '{来|き}た'], de: 'A: Kommt Frau Kimura auch zur Party morgen? B: Wahrscheinlich.', why: 'Vor でしょう steht die einfache Form: きます → くる.', l: 21, t: 'omou' },
  { s: '{新|あたら}しい{空港|くうこう}について＿{思|おも}いますか。', o: ['どう', 'どんな', 'どうして', 'どれ'], de: 'Was halten Sie vom neuen Flughafen?', why: 'Nach der Meinung fragt man: 〜について どう おもいますか.', l: 21, t: 'omou' },

  // modify
  { q: 'Das ist das Foto, das du gemacht hast.', s: 'これは{私|わたし}が＿{写真|しゃしん}です。', o: ['{撮|と}った', '{撮|と}りました', '{撮|と}って', '{撮|と}る'], de: 'Das ist das Foto, das ich gemacht habe.', why: 'Vor einem Nomen steht die einfache Form, hier Vergangenheit: とった.', l: 22, t: 'modify' },
  { s: 'ミラーさん＿{作|つく}ったケーキはとてもおいしいです。', o: ['が', 'は', 'を', 'で'], de: 'Der Kuchen, den Herr Miller gebacken hat, ist sehr lecker.', why: 'Im Relativsatz steht das Subjekt mit が, nicht は.', l: 22, t: 'modify' },
  { s: '{私|わたし}が{生|う}まれた＿は{大阪|おおさか}です。', o: ['{所|ところ}', 'どこ', 'ここ', 'そこ'], de: 'Der Ort, an dem ich geboren wurde, ist Osaka.', why: 'Relativsatz + Nomen: うまれた ところ (der Ort, wo …).', l: 22, t: 'modify' },
  { s: '{眼鏡|めがね}を＿{人|ひと}は{田中|たなか}さんです。', o: ['かけている', 'かけています', 'かけての', 'かけるの'], de: 'Die Person mit der Brille ist Herr Tanaka.', why: 'Vor dem Nomen: einfache Form かけている, nicht ます-Form, ohne の.', l: 22, t: 'modify' },
  { s: '{忙|いそが}しいですから、{朝|あさ}ご{飯|はん}を＿{時間|じかん}がありません。', o: ['{食|た}べる', '{食|た}べます', '{食|た}べての', '{食|た}べるの'], de: 'Ich bin so beschäftigt, dass ich keine Zeit zum Frühstücken habe.', why: 'Wörterbuchform + Nomen: たべる じかん = Zeit zum Essen.', l: 22, t: 'modify' },
  { s: 'パーティーに＿{人|ひと}は{教|おし}えてください。', o: ['{来|こ}ない', '{来|き}ません', '{来|こ}ないの', '{来|こ}なくて'], de: 'Wer nicht zur Party kommt, sagt mir bitte Bescheid.', why: 'Verneinter Relativsatz: ない-Form direkt vor dem Nomen (こない ひと).', l: 22, t: 'modify' },

  // toki
  { s: '{図書館|としょかん}で{本|ほん}を＿とき、カードが{要|い}ります。', o: ['{借|か}りる', '{借|か}ります', '{借|か}りて', '{借|か}りの'], de: 'Wenn man in der Bibliothek Bücher ausleiht, braucht man eine Karte.', why: 'Vor とき steht die einfache Form (hier Wörterbuchform), nie die ます-Form.', l: 23, t: 'toki' },
  { s: '＿とき、{遊|あそ}びに{来|き}てください。', o: ['{暇|ひま}な', '{暇|ひま}', '{暇|ひま}だ', '{暇|ひま}の'], de: 'Wenn Sie Zeit haben, besuchen Sie mich doch.', why: 'な-Adjektiv vor とき: ひまな とき.', l: 23, t: 'toki' },
  { s: '{子|こ}ども＿とき、よく{川|かわ}で{泳|およ}ぎました。', o: ['の', 'な', 'だ', 'で'], de: 'Als ich ein Kind war, bin ich oft im Fluss geschwommen.', why: 'Nomen + の とき.', l: 23, t: 'toki' },
  { s: '＿とき、コーヒーを{飲|の}みます。', o: ['{眠|ねむ}い', '{眠|ねむ}いな', '{眠|ねむ}くて', '{眠|ねむ}いの'], de: 'Wenn ich müde bin, trinke ich Kaffee.', why: 'い-Adjektive stehen direkt vor とき, ohne な oder の.', l: 23, t: 'toki' },
  { q: 'Du hast die Tasche in Deutschland gekauft, bevor du nach Japan geflogen bist.', s: '{日本|にほん}へ＿とき、ドイツでかばんを{買|か}いました。', o: ['{行|い}く', '{行|い}った', '{行|い}きます', '{行|い}って'], de: 'Als ich nach Japan gefahren bin, habe ich (vorher) in Deutschland eine Tasche gekauft.', why: 'いく とき: vor der Reise. いった とき: nach der Ankunft.', l: 23, t: 'toki' },
  { q: 'Als du in Kyoto warst, hast du dir Tempel angesehen.', s: '{京都|きょうと}へ＿とき、お{寺|てら}を{見|み}ました。', o: ['{行|い}った', '{行|い}く', '{行|い}きました', '{行|い}って'], de: 'Als ich in Kyoto war, habe ich mir Tempel angesehen.', why: 'Am Ziel angekommen: いった とき. いく とき wäre unterwegs, vor der Ankunft.', l: 23, t: 'toki' },

  // to-cond
  { s: 'このボタンを＿と、お{釣|つ}りが{出|で}ます。', o: ['{押|お}す', '{押|お}して', '{押|お}した', '{押|お}します'], de: 'Wenn man diesen Knopf drückt, kommt das Wechselgeld heraus.', why: 'Wörterbuchform + と: immer wenn …, dann (automatisch) ….', l: 23, t: 'to-cond' },
  { s: 'このつまみを{右|みぎ}へ{回|まわ}す＿、{音|おと}が{大|おお}きくなります。', o: ['と', 'て', 'まで', 'たら'], de: 'Wenn man diesen Regler nach rechts dreht, wird der Ton lauter.', why: 'Feste Folge (Maschine, Natur): Wörterbuchform + と.', l: 23, t: 'to-cond' },
  { s: 'まっすぐ{行|い}く＿、{右|みぎ}に{銀行|ぎんこう}があります。', o: ['と', 'で', 'に', 'まで'], de: 'Wenn Sie geradeaus gehen, ist rechts eine Bank.', why: 'Wegbeschreibung: 〜と、… が あります.', l: 23, t: 'to-cond' },
  { s: 'あの{橋|はし}を＿と、{駅|えき}があります。', o: ['{渡|わた}る', '{渡|わた}って', '{渡|わた}ります', '{渡|わた}った'], de: 'Wenn Sie über die Brücke dort gehen, kommt der Bahnhof.', why: 'Vor と steht die Wörterbuchform, auch bei Wegbeschreibungen.', l: 23, t: 'to-cond' },

  // tara
  { q: 'Bei Regen bleibst du zu Hause.', s: '{雨|あめ}が＿、{行|い}きません。', o: ['{降|ふ}ったら', '{降|ふ}っても', '{降|ふ}りたら', '{降|ふ}るたら'], de: 'Wenn es regnet, gehe ich nicht.', why: 'Bedingung: た-Form + ら. ふります → ふった → ふったら.', l: 25, t: 'tara' },
  { s: '{駅|えき}に＿、{電話|でんわ}してください。', o: ['{着|つ}いたら', '{着|つ}くと', '{着|つ}いても', '{着|つ}きたら'], de: 'Wenn Sie am Bahnhof ankommen, rufen Sie mich bitte an.', why: 'Vor einer Bitte steht 〜たら, nicht 〜と.', l: 25, t: 'tara' },
  { s: 'もしお{金|かね}が＿、{世界|せかい}を{旅行|りょこう}したいです。', o: ['あったら', 'あると', 'あっても', 'ありたら'], de: 'Wenn ich Geld hätte, würde ich gern um die Welt reisen.', why: 'Vor einem Wunsch (〜たい) passt nur 〜たら, nicht 〜と.', l: 25, t: 'tara' },
  { s: '＿、{手伝|てつだ}ってください。', o: ['{暇|ひま}だったら', '{暇|ひま}かったら', '{暇|ひま}なったら', '{暇|ひま}でたら'], de: 'Wenn Sie Zeit haben, helfen Sie mir bitte.', why: 'な-Adjektive und Nomen: 〜だったら.', l: 25, t: 'tara' },
  { s: '＿、{窓|まど}を{開|あ}けてもいいですよ。', o: ['{暑|あつ}かったら', '{暑|あつ}いだったら', '{暑|あつ}くたら', '{暑|あつ}いたら'], de: 'Wenn Ihnen heiß ist, können Sie gern das Fenster öffnen.', why: 'い-Adjektive: い → かったら.', l: 25, t: 'tara' },
  { s: '{仕事|しごと}が＿、{飲|の}みに{行|い}きませんか。', o: ['{終|お}わったら', '{終|お}わると', '{終|お}わっても', '{終|お}わりたら'], de: 'Wollen wir nach der Arbeit etwas trinken gehen?', why: '〜たら kann auch „sobald“ heißen. Vor einer Einladung geht 〜と nicht.', l: 25, t: 'tara' },

  // temo
  { q: 'Ihr spielt auf jeden Fall Fußball – auch bei Regen.', s: '{雨|あめ}が＿、サッカーをします。', o: ['{降|ふ}っても', '{降|ふ}ったら', '{降|ふ}ると', '{降|ふ}りても'], de: 'Auch wenn es regnet, spielen wir Fußball.', why: 'Auch wenn: て-Form + も. ふります → ふって → ふっても.', l: 25, t: 'temo' },
  { s: 'いくら＿、この{車|くるま}を{買|か}います。', o: ['{高|たか}くても', '{高|たか}いても', '{高|たか}かったら', '{高|たか}くて'], de: 'Egal wie teuer es ist, ich kaufe dieses Auto.', why: 'いくら 〜ても = egal wie …. い-Adjektiv: い → くても.', l: 25, t: 'temo' },
  { s: '{日曜日|にちようび}＿、{仕事|しごと}をします。', o: ['でも', 'ても', 'だても', 'くても'], de: 'Ich arbeite auch am Sonntag.', why: 'Nomen und な-Adjektive: 〜でも (auch wenn es … ist).', l: 25, t: 'temo' },
  { s: '＿、{漢字|かんじ}を{覚|おぼ}えなければなりません。', o: ['{大変|たいへん}でも', '{大変|たいへん}くても', '{大変|たいへん}なでも', '{大変|たいへん}だても'], de: 'Auch wenn es mühsam ist, muss man Kanji lernen.', why: 'たいへん ist ein な-Adjektiv: たいへんでも.', l: 25, t: 'temo' },
  { s: 'いくら{考|かんが}えても、＿。', o: ['{分|わ}かりません', '{分|わ}かります', '{分|わ}かりましょう', '{分|わ}かってください'], de: 'So sehr ich auch nachdenke, ich verstehe es nicht.', why: 'Nach 〜ても folgt ein unerwartetes Ergebnis.', l: 25, t: 'temo' },
  { q: 'Obwohl du den Knopf drückst, läuft die Maschine nicht.', s: 'ボタンを＿、{機械|きかい}が{動|うご}きません。', o: ['{押|お}しても', '{押|お}したら', '{押|お}すと', '{押|お}して'], de: 'Auch wenn ich den Knopf drücke, läuft die Maschine nicht.', why: 'Gegen die Erwartung: 〜ても. 〜たら/〜と wären normale Bedingungen.', l: 25, t: 'temo' },

  // kureru
  { q: 'Herr Kimura hat dir die Stadt gezeigt.', s: '{木村|きむら}さんが{町|まち}を{案内|あんない}して＿。', o: ['くれました', 'あげました', 'もらいました', 'ください'], de: 'Herr Kimura hat mir die Stadt gezeigt.', why: 'Jemand (が) tut etwas für mich: 〜てくれます.', l: 24, t: 'kureru' },
  { s: '{私|わたし}は{佐藤|さとう}さんに{引|ひ}っ{越|こ}しを{手伝|てつだ}って＿。', o: ['もらいました', 'くれました', 'あげました', 'ください'], de: 'Frau Sato hat mir beim Umzug geholfen.', why: 'わたしは + Person に 〜てもらいます: ich bekomme Hilfe von jemandem.', l: 24, t: 'kureru' },
  { q: 'Du hast einer älteren Frau das Gepäck getragen.', s: '{私|わたし}はおばあさんの{荷物|にもつ}を{持|も}って＿。', o: ['あげました', 'くれました', 'もらいました', 'ください'], de: 'Ich habe der älteren Dame das Gepäck getragen.', why: 'Ich tue etwas für andere: 〜てあげます.', l: 24, t: 'kureru' },
  { s: '{母|はは}＿セーターを{送|おく}ってくれました。', o: ['が', 'に', 'を', 'で'], de: 'Meine Mutter hat mir einen Pullover geschickt.', why: 'Bei 〜てくれます steht der Gebende mit が.', l: 24, t: 'kureru' },
  { s: '{私|わたし}は{友達|ともだち}＿{駅|えき}まで{送|おく}ってもらいました。', o: ['に', 'が', 'を', 'へ'], de: 'Ein Freund hat mich zum Bahnhof gebracht.', why: 'Bei 〜てもらいます steht der Helfende mit に.', l: 24, t: 'kureru' },
  { q: 'Du fragst einen Freund, wer ihm Japanisch beigebracht hat.', s: 'だれが{日本語|にほんご}を{教|おし}えて＿か。', o: ['くれました', 'もらいました', 'あげました', 'くれます'], de: 'Wer hat dir Japanisch beigebracht?', why: 'Wer (が) hat für dich etwas getan: 〜てくれましたか.', l: 24, t: 'kureru' },
  { s: '{田中|たなか}さんが{傘|かさ}を＿くれました。', o: ['{貸|か}して', '{貸|か}って', '{貸|か}し', '{貸|か}す'], de: 'Herr Tanaka hat mir einen Schirm geliehen.', why: 'Vor くれます steht die て-Form: かします → かして.', l: 24, t: 'kureru' },
];
