# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

All commands run from `generator/`:

- `npm install` — install deps (`art-template`, `world-english-bible`).
- `npm run build` — runs `node index.js`; writes the static site to `../_site/` (which is wiped first).
- `npm test` — runs both test scripts. There is no test framework; each test is a plain Node script that sets `process.exitCode = 1` on failure and prints `ok` on success.
- Run a single test: `node test/test-bookmarks.js` or `node test/test-text-indentation-parser.js`.

CI (`.github/workflows/build-and-deploy.yml`) runs `node generator/index.js` from the repo root and deploys `_site/` to GitHub Pages on push to `master`. Note CI invokes `index.js` directly, not `npm run build`.

## Architecture

Static site generator that builds a year-round daily Bible-reading site. The whole thing is one pass at build time — the deployed site is plain HTML + a tiny `util.js` for client-side state.

**Build pipeline** (`generator/index.js` is the entry point):

1. `resetSiteDir()` deletes and recreates `_site/`.
2. `style.css` and `util.js` are content-hashed (md5, first 10 chars inserted before the extension via `hash-file.js`) and copied to `_site/` so URLs bust caches across deploys. The hashed filenames are passed into every template render.
3. `static/` (icons, manifest) is copied verbatim.
4. Common pages are rendered: `index.html` (the home page — Today button + completed/behind stats from `localStorage`), `calendar.html` (the year-grid calendar), `today.html` (JS redirect to the current day), `prayer-for-filling-of-spirit.html`, and `bulk-edit.html`.
5. For each of 12 months × `expectedMonthLength[month]` days, `generateDayHtml()` writes `_site/<MonthName>/<day>.html`.

**Reading-plan data flow:**

- `generator/constant/bookmarks.txt` is the source of truth: an indentation-based file with 4 top-level "Bookmark N" sections, each containing 12 months, each containing N day lines like `Genesis 1-2`. Comments use `--`.
- `text-indentation-parser.js` turns the tab-indented text into a tree of `{ text, children }`.
- `bookmarks-parser.js` reshapes that tree into `dtpm[bookmarkIndex][month][day]` (the variable name is "day-to-passage map"). Months and days are **1-indexed** — the parser unshifts `null` at index 0 of every array. `constant/months.json` follows the same convention.
- `parse-reference.js` parses a string like `"Genesis 1-2"` or `"1 Chronicles 5:1-7:40"` into `{ original, book, bookSlug, startChapter, startVerse, endChapter, endVerse }`. `bookSlug` is what `world-english-bible/json/<slug>.json` is keyed by.
- `get-bible-html.js` requires the per-book JSON from the `world-english-bible` package, filters chunks within the reference range (with a small dance to keep matching `paragraph start`/`paragraph end` and `stanza start`/`stanza end` tags), and emits HTML with `chapter`/`verse` markers and a journal `<textarea>` per passage.

**Templates** are art-template files in `generator/template/` (`master.art` is the layout; `calendar.art`, `day.art`, `bulk-edit.art`, `prayer-for-filling-of-spirit.art` are the subtemplates). All rendering goes through `writeSubtemplate()` which always renders `master.art` and uses the `subtemplate` key to pick the body via `{{include subtemplate}}`.

**Client-side** (`generator/util.js`, runs in the browser): keeps per-day completion state and journal text in `localStorage` keyed by month name (e.g. `January`) → `[null, day1, day2, ...]` (also 1-indexed) for completion, and `journal-<slug>` for journals. `initDayPage()` polls every second so the "today/yesterday/tomorrow" CSS classes update across midnight without a reload.

**Test invariants:**

- `test-bookmarks.js` walks the 4 bookmark plans and asserts every day's reference continues exactly where the previous day's ended (next verse, next chapter, or `1:1` of a new book). If you edit `bookmarks.txt`, this is the guard.
- `test-text-indentation-parser.js` covers the parser directly.

**Cross-cutting conventions:**

- Months and days are 1-indexed everywhere — both server (`dtpm`, `expectedMonthLength`) and client (`localStorage` arrays). Don't drop the leading `null`.
- The site is hosted at the repo root on GitHub Pages, but day pages live one directory deep. URLs in templates use relative paths (`../<file>`, `./<day>`) so the site works opened from disk too.
- `_site/`, `node_modules/`, and `package-lock.json` are gitignored; do not commit generated output.
