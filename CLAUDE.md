# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A static, no-build, no-dependency "Guess Who"-style web game for Harry Potter characters. It's three files (`index.html`, `styles.css`, `script.js`) plus an `images/` directory of SVG character portraits. There is no package.json, no build step, and no test suite.

## Running it locally

There's no dev server built in. Serve the directory with any static file server, e.g.:

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000/index.html`. Opening `index.html` directly via `file://` mostly works too, but some browser extensions/tools (and any future fetch-based features) will need `http://`.

There is no lint, build, or test command in this repo — verify changes by loading the page in a browser and clicking around.

## Deployment

- Live site: https://gauthamk97.github.io/harry-potter-guess-who/
- Served via GitHub Pages from the `main` branch root (no `gh-pages` branch, no Actions workflow — Pages rebuilds automatically a few minutes after every push to `main`).
- Pushing to `main` is equivalent to deploying. There's no staging environment.

## Architecture

**`script.js` is the source of truth for character data and all behavior.** `index.html` and `styles.css` just provide the static shell (header, empty `<main id="board">`, the "Your Character" reveal panel, and the footer buttons) — the entire card grid is generated client-side.

Key pieces in `script.js`:

- `CATEGORIES` — an ordered array of `{ title, characters }` groups, where each character is a `[slug, displayName]` tuple. The `title` strings are no longer rendered anywhere in the UI (headings were removed by request), but the array is still grouped this way for readability/maintainability. **Card order in the grid is exactly the flattened order of this array** — there's no separate sorting step, so reordering characters means editing their position in `CATEGORIES`.
- `slug` must match an image filename in `images/<slug>.svg` exactly (kebab-case, e.g. `mad-eye-moody`).
- `ALL_CHARACTERS` = flattened `CATEGORIES`. `ALL_CARDS` = the live `<button class="card">` DOM elements in the same original order — this array is the permanent record of "default order" used to restore the grid after reorganizing.
- The grid is **8 columns on desktop, 6 at ≤900px, 4 at ≤640px** (`styles.css` media queries) — the character count (currently 64) was deliberately chosen to divide evenly into an 8×8 grid.

Each card is a `<button class="card">` with a 3D-flip structure (`.card-inner` > `.card-face.card-front` / `.card-face.card-back`), flipped via a `.flipped` class that triggers a CSS `rotateY(180deg)` transform (see `.card.flipped .card-inner` in `styles.css`). The front shows the portrait + name; the back is a deliberately low-contrast/muted color so that flipped-down ("eliminated") cards recede visually and still-open cards stay the visual focus — don't increase the back face's contrast without reason, that's intentional game-design, not an oversight.

State/behavior in `script.js`:
- `updateOpenCount()` — recomputes the "Open Cards: X / N" counter in the header by counting cards without `.flipped`. Called after every card click and after any reset.
- `resetCards()` — clears all `.flipped` classes (used by New Game).
- `resetCardOrder()` / `reorganizeCards()` — these re-append DOM nodes from `ALL_CARDS` into `grid` in a new order (CSS Grid follows DOM order). `reorganizeCards()` partitions into open-then-closed while preserving each group's relative order; `resetCardOrder()` restores the original `ALL_CARDS` order. Both just reorder the *existing* button elements — they don't rebuild or recreate cards.
- `startNewGame()` — picks a random character from `ALL_CHARACTERS`, populates the fixed "Your Character" reveal panel (`#reveal`, top-right, `position: fixed`), and calls both `resetCards()` and `resetCardOrder()`. New Game is the only action that resets grid order back to the default.

## Adding or editing a character

1. Add an `images/<slug>.svg` portrait (keep the same flat illustration style/proportions as the existing portraits — same head/robe/line-weight conventions — so new characters don't visually clash).
2. Add `["slug", "Display Name"]` to the appropriate group in `CATEGORIES` in `script.js`, at the position where it should appear in the grid.
3. No other file needs to change — the character count in the footer and the "Open Cards: X / N" counter both derive from `ALL_CHARACTERS.length` / `ALL_CARDS.length` at runtime.

## Social sharing metadata

`index.html` has Open Graph / Twitter Card meta tags pointing at `images/preview-social.jpg` with hardcoded absolute URLs (`https://gauthamk97.github.io/harry-potter-guess-who/...`). If the Pages URL or repo name ever changes, these tags need manual updates — they are not derived from anything dynamic. `preview-social.jpg` is a compressed (~250KB, 1200px-wide) JPEG derived from `images/preview-image.png`; prefer editing/regenerating the JPEG over swapping in a large PNG, since link-unfurling crawlers need a fast fetch.
