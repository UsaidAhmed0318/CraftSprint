# v13 — focused categories, 6 new games, install any single tool, AI-search map

## Categories (each holds only its own kind of tool)
16 categories instead of 9: Image Tools · Color Tools · CSS & Web Design · QR & Barcode · PDF Tools · Documents & Business · Developer Tools · Security & Passwords · SEO Tools · Writing & Text · Video & Audio · Finance Calculators · Everyday Calculators · Math & Engineering · Productivity · Games.
Example: Image Tools now has only the 12 real image tools; QR codes, colours and CSS generators have their own categories.
Tool URLs did not change. Old category URLs redirect permanently: image-design-tools → image-tools, pdf-document-tools → pdf-tools, content-seo-tools → writing-tools.
New tools must be given one of these categories in `data/tools.ts`; the catalogue test fails if a category has no page info.

## New games (10 → 16)
Block Stack, Brick Breaker, Space Defender, Sky Hopper, Whack-a-Mole, Sudoku (Easy/Medium/Hard). Keyboard + touch, start/pause/game-over screens, best score saved on the device. All play-tested in the browser.
Games page: genre filter (Arcade, Puzzle, Strategy, Memory, Skill) + search.

## Install a single tool or game
Every tool page links its own manifest (`/tools/<slug>/app.webmanifest`), so "Install Sudoku app" puts just Sudoku on the home screen. Chrome's installability check reports no errors for a tool page and for the homepage. Other pages still install the full CraftSprint app.

## Design
Header "Install App" button (desktop), homepage headline "Your ultimate online tools hub", 4 real stat cards (tools, games, categories, 100% free).

## AI search (GEO/AEO)
`/llms.txt` lists every category and tool with its description for AI assistants and answer engines.

## Checks
TypeScript 0 · ESLint 0 · 28 tests · build OK (481 files) · 180 pages at 390 px: 0 errors, 0 sideways scroll · 10 key pages at 10 widths: 0 problems · axe-core: 0 issues on all pages (Sudoku ARIA fixed).
