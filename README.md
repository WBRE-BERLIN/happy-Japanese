# Happy Japanese

Ein Lernbegleiter für den Japanischkurs mit **Minna no Nihongo I** (Lektion 1–25),
als Web-App für das iPhone. Keine Lektionen zum Durcharbeiten, sondern Übungen
zu allem, was man im Unterricht braucht und gern vergisst: Vokabeln,
Verbformen, Partikel, Zahlen, Zählwörter, Uhrzeit, Datum, Kanji – und
Japanisch für die nächste Reise. Mit Katze Mochi. 🐈

- PHP 8.5 und SQLite. Kein Framework, kein Composer, kein Build-Schritt.
- Auf dem iPhone zum Home-Bildschirm hinzufügen (PWA): läuft komplett
  **offline**, der Fortschritt wird später synchronisiert.
- Mehrere Benutzer mit Konto (Name + Passwort, ohne E-Mail, ohne MFA).
- **Erinnerungen per Push-Mitteilung** (iOS 16.4 oder neuer, installierte App).
- Hell- und Dunkelmodus, drei Schriftgrößen, Furigana über allen Kanji,
  Romaji werden beim Tippen automatisch zu Kana, Japanisch vorlesen mit der
  iPhone-Stimme.

## Was es zu üben gibt

| Bereich | Übungen |
|---|---|
| **Vokabeln** | rund 1000 Wörter aus Lektion 1–25 als Karteikarte, Auswahl oder zum Eintippen, Deutsch ↔ Japanisch |
| **Hiragana & Katakana** | lesen (Romaji tippen) und erkennen, mit ähnlich aussehenden Zeichen als Falle |
| **Kanji** | 175 Kanji (N5, N4, Reise): Bedeutung, Lesung von Wörtern, Kanji erkennen |
| **Partikel** | 183 Lückensätze, Partikel aus einer Palette einsetzen, mit Erklärung |
| **Verbformen** | ます, ません, ました, て, ない, た, なかった, たら, ても … selbst bilden (140 Verben) |
| **Verbgruppen** | Gruppe I, II oder III – mit den Fallen (帰る, 入る, 見ます, 起きます …) |
| **Verben im Satz** | 177 Sätze: das fehlende Verb in der richtigen Form einsetzen |
| **Adjektivformen** | い- und な-Adjektive (120 Wörter) in allen Formen, auch いい → よくない |
| **い oder な?** | Adjektivart erkennen (きれい, 有名, 嫌い …) |
| **Adjektive im Satz** | 96 Sätze: das Adjektiv passend einsetzen |
| **Grammatik-Quiz** | 207 Multiple-Choice-Fragen mit kniffligen Antworten, nach Thema wählbar |
| **Satzbau** | 96 Sätze aus Bausteinen in die richtige Reihenfolge bringen |
| **Fragewörter** | 何, だれ, どこ, いつ, いくら, どうして … |
| **Höflich ↔ Einfach** | ます-Form und einfache Form (Lektion 20) |
| **Zahlen** | große Zahlen mit 万 und 億 aus Bausteinen bilden, aus Kana oder Kanji lesen, hören |
| **Preise & Geld** | Preise sagen und verstehen (よえん!) |
| **Uhrzeit** | analoge und digitale Uhr, よじ, しちじ, くじ, いっぷん … |
| **Datum & Wochentage** | ついたち, ふつか …, Monate, Wochentage, Jahreszahlen |
| **Zeitangaben** | gestern, nächste Woche, letztes Jahr, jeden Morgen |
| **Zählwörter** | 31 Zählwörter (まい, だい, ほん, ひき, こ, はい, さつ …): welches passt zum Bild, wie liest man „3 Katzen“ – zur Auswahl oder zum Eintippen (さんびき) |
| **Reise-Sätze** | 136 Situationen: Restaurant, Bahn, Hotel, Einkaufen, Notfall, Onsen … |
| **Reise-Wortschatz** | 8 Themen mit rund 300 Wörtern für unterwegs |
| **Schilder lesen** | 96 echte Schilder: 出口, 営業中, 禁煙, 指定席 … |
| **Orte & Richtungen** | うえ/した/なか im Bild, Himmelsrichtungen, こ・そ・あ・ど, Wegbeschreibung |
| **Familie** | eigene Familie (ちち) und die der anderen (おとうさん) |

Unter **Nachschlagen** stehen alle Verben und Adjektive in allen Formen, alle
Zählwörter von 1 bis 10, Zahlen mit Lautwandel, Uhrzeiten, Tage des Monats,
die Kana-Tabellen, alle Kanji, Schilder, Reise-Sätze und eine Partikel-Übersicht.

## Wie die App merkt, wo es hakt

- Jede Aufgabe hat einen eigenen Lernstand (Wiederholung mit wachsenden
  Abständen): richtig und schnell → kommt viel später wieder, richtig aber
  langsam → bald wieder, falsch → noch in derselben Übung und in 10 Minuten.
- Gemessen wird die **Antwortzeit**. Was für dich „langsam“ ist, lernt die App
  aus deinen eigenen Zeiten.
- Jede Antwort trägt Merkmale: Lektion, Partikel, Verbform, die Regel der
  て-Form (く → いて …), Lautwandel bei Zahlen (300 = さんびゃく), Zählwort,
  Monat … Wo die Trefferquote niedrig ist oder du oft zögerst, zeigt die
  Startseite **„Hier hakt es noch“** mit einem Knopf zum gezielten Üben.
- Aufgaben, die immer wieder danebengehen, stehen unter **Fortschritt →
  Problemfälle**.
- **„Ich bin bei Lektion …“** auf der Startseite begrenzt alle Übungen auf den
  Stoff bis zu deiner Lektion.
- Neue Aufgaben kommen Lektion für Lektion, innerhalb einer Lektion aber in
  zufälliger Reihenfolge. Zusammengehöriges (dasselbe Wort in beide Richtungen,
  mehrere Formen desselben Verbs, dasselbe Zählwort) kommt nicht in derselben
  Übung, damit man sich keine Reihenfolge merken kann.
- Bei Vokabeln fragt die App beim Start, was du sehen möchtest: Japanisch,
  Deutsch oder gemischt.

## Installation auf all-inkl

Beispiel: Subdomain `japan.kumogrid.de`, Ordner `/japan.kumogrid.de/`.

1. Im KAS die **Webspace**-Adresse der Subdomain auf `/japan.kumogrid.de/public/`
   setzen, PHP-Version **8.5**, **SSL** einschalten. Damit ist nur `public/` aus
   dem Netz erreichbar; die Datenbank in `data/` nicht.
2. Den Inhalt dieses Repositories nach `/japan.kumogrid.de/` hochladen (FTP)
   oder per SSH klonen:
   ```sh
   cd ~/japan.kumogrid.de && git clone https://github.com/WBRE-BERLIN/happy-Japanese.git .
   ```
   Danach gibt es `/japan.kumogrid.de/public/index.html`, `/japan.kumogrid.de/src/`,
   `/japan.kumogrid.de/data/` usw.
3. `config.example.php` nach `config.php` kopieren und einen `cron_token`
   eintragen (für die Erinnerungen), z. B. erzeugt mit
   `php -r "echo bin2hex(random_bytes(16));"`. Wer nicht möchte, dass sich
   jeder ein Konto anlegen kann, setzt einen `registration_code`.
4. **Cronjob für die Erinnerungen:** KAS → Tools → Cronjobs → neuer Cronjob,
   Adresse `https://japan.kumogrid.de/cron.php?token=DEIN_TOKEN`, alle 15
   Minuten (öfter geht auch). Erinnerungen kommen dann zur eingestellten
   Uhrzeit oder bis 15 Minuten danach.
5. `https://japan.kumogrid.de` öffnen und ein Konto anlegen.

Voraussetzungen: PHP 8.3 oder neuer (8.5 empfohlen) mit `pdo_sqlite`, `openssl`,
`curl` und `mbstring` – bei all-inkl Standard. `data/` muss für PHP schreibbar sein.

## Auf dem iPhone

1. `https://japan.kumogrid.de` in **Safari** öffnen.
2. **Teilen** → **Zum Home-Bildschirm**.
3. Happy Japanese vom Home-Bildschirm öffnen und anmelden. (Die installierte
   App hat ihre eigene Anmeldung, getrennt von Safari.)
4. Erinnerungen: **Einstellungen → Erinnerungen an**, Mitteilungen erlauben,
   Uhrzeit und Tage wählen. „Nur wenn ich noch nicht geübt habe“ hält Mochi
   still, wenn du an dem Tag schon geübt hast. **Test-Mitteilung senden**
   prüft, ob alles klappt.

Push-Mitteilungen gibt es auf dem iPhone ab iOS 16.4 und nur für Web-Apps, die
über „Zum Home-Bildschirm“ installiert sind – nicht in Safari selbst.

## Offline

Die App und alle Inhalte liegen nach dem ersten Öffnen auf dem Gerät. Üben
geht ohne Netz; Antworten und Lernstand werden in der App gespeichert und
synchronisiert, sobald wieder eine Verbindung besteht (beim Öffnen, nach jeder
Übung und unter Einstellungen → Jetzt synchronisieren). Mit mehreren Geräten
gilt pro Aufgabe der neueste Stand.

## Konten

- Anmeldung mit Benutzername und Passwort (mindestens 8 Zeichen). Nach fünf
  falschen Passwörtern ist der Name fünf Minuten gesperrt.
- Kein E-Mail-Versand, deshalb kein „Passwort vergessen“. Passwort neu setzen
  per SSH: `php tools/user.php password <name>`. Alle Konten:
  `php tools/user.php list`.
- Einstellungen → Konto: Passwort ändern (meldet andere Geräte ab), Daten als
  JSON exportieren, Konto löschen.
- Registrierung: `'registration' => 'open'` (Standard), `'code'` (nur mit
  `registration_code`) oder `'closed'` in `config.php`.

## Aktualisieren

Alles außer `data/` und `config.php` ersetzen (bzw. `git pull`). Die Datenbank
passt sich beim nächsten Aufruf selbst an. Installierte Apps laden die neue
Version beim nächsten Start.

## Sicherung

Der Ordner `data/` enthält alles (`happyjapanese.sqlite` und ggf. `-wal`/`-shm`).
Jeder kann außerdem seine Daten unter Einstellungen → Konto exportieren.

## Entwicklung

```sh
php -S 127.0.0.1:8080 -t public       # lokal starten
php tests/run.php                     # Server-Tests (API, Sync, Push, Erinnerungen), offline
npm test                              # JS-Tests: Konjugation, Zahlen, alle Übungsbereiche
node tools/check-content.mjs          # Lerninhalte prüfen (Furigana, Formate)
node tools/build-sw.mjs               # Dateiliste + Version im Service Worker aktualisieren
cd tools && npm install && npm run e2e    # Browser-Test auf einem emulierten iPhone
cd tools && npm run icons             # App-Icons aus favicon.svg rendern
```

Nach jeder Änderung an Dateien in `public/` einmal `node tools/build-sw.mjs`
ausführen – sonst bekommen installierte Apps die Änderung nicht (der Test
`npm test` prüft das).

Die Inhalte (Wortschatz, Sätze, Kanji, …) liegen als JavaScript-Module in
`public/assets/js/data/`. Das Format steht in [`docs/content.md`](docs/content.md).

### Aufbau

| Pfad | Was |
|---|---|
| `public/` | Web-Root: `index.html`, `api.php`, `cron.php`, Service Worker, Manifest |
| `public/assets/js/lib/` | Furigana, Kana/Romaji, Konjugation, Zahlen, Lernplanung, Speicher, Oberfläche |
| `public/assets/js/areas/` | die Übungsbereiche |
| `public/assets/js/views/` | die Seiten der App |
| `public/assets/js/data/` | die Lerninhalte |
| `src/` | PHP: API, Konten, Synchronisierung, Web Push, Erinnerungen |
| `data/` | SQLite-Datenbank (wird angelegt; bleibt privat) |
| `tests/` | Server-Tests (`run.php`) und JS-Tests (`js/`) |
| `tools/` | Inhaltsprüfung, Service-Worker-Liste, Icons, Browser-Test, Cron und Benutzer per Kommandozeile |

### API

Alles läuft über `public/api.php?r=<route>`. Schreibende Anfragen brauchen den
Header `X-Happy: 1` (Schutz gegen Cross-Site-Requests).

| Methode und Route | Was |
|---|---|
| `GET session` | angemeldet? Registrierungsmodus, VAPID-Schlüssel |
| `POST register` `{username, password, display_name?, code?}` / `POST login` / `POST logout` | Konto |
| `POST sync` `{cursor, states, attempts, settings}` | Änderungen austauschen; Antwort: was das Gerät noch nicht kennt |
| `GET export` | alle eigenen Daten als JSON |
| `POST password` `{current, new}` / `POST account/delete` `{password}` | Konto ändern / löschen |
| `GET reminders` / `POST reminders` `{enabled, time, days, tz, only_idle}` | Erinnerungen |
| `POST push/subscribe` `{subscription}` / `POST push/unsubscribe` / `POST push/test` | Geräte für Mitteilungen |

`cron.php?token=…` verschickt die fälligen Erinnerungen (Web Push nach RFC 8291
und VAPID, ohne Bibliotheken; Nachrichten gehen nur an die bekannten
Push-Dienste von Apple, Google, Mozilla und Microsoft).

## Hinweis

Happy Japanese ist ein privates Lernprojekt. Es folgt dem Aufbau von
„Minna no Nihongo“, ist aber nicht mit dem Verlag (3A Corporation) verbunden;
alle Sätze, Erklärungen und Übersetzungen sind eigene Texte. Kein Ersatz für
den Unterricht – aber ein guter Grund, jeden Tag fünf Minuten zu üben. がんばって！
