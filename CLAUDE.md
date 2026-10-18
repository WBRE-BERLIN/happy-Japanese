# Happy Japanese

Learning companion PWA for Minna no Nihongo I (German UI). Read `README.md` first; content formats are in `docs/content.md`.

- PHP 8.5 target (code runs on 8.3+), SQLite, no Composer, no framework, no JS build step. Keep it that way; ask before adding dependencies.
- `declare(strict_types=1);` in every PHP file. Namespace `HappyJapanese\`, autoloaded from `src/`.
- Frontend: plain ES modules in `public/assets/js/`; HTML via the escaping `html` template tag in `lib/ui.js`. UI text is German, code and comments English.
- Japanese text with kanji always uses the furigana notation `{漢字|かんじ}` (or written form + reading in word lists). Never show kanji without furigana, except where reading the kanji is the exercise (kanji, signs, date/number reading).
- After changing anything in `public/`: `node tools/build-sw.mjs` (service worker file list and version).
- Before committing: `node tools/check-content.mjs`, `npm test`, `php tests/run.php`; for UI changes also `cd tools && npm run e2e` (set `CHROMIUM_PATH`).
- Never commit `config.php` or anything in `data/`.
