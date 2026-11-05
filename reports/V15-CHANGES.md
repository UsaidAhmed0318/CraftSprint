# v15 — professional theme, AI that builds pages, prompt library, new games and tools

## Theme
Professional blue and white (light by default) with a navy dark mode; purple neon and the star background removed. Desktop header kept on one line (About/Contact live in the menu and footer).

## CraftSprint AI
- "Chat with AI" replies in the visitor's language, writes text and code, and when asked to build a page returns **one complete HTML file**.
- Every code block has **Copy**, **Download** (correct file extension) and, for HTML, a **live Preview** in a sandboxed frame (the preview cannot access CraftSprint, cookies or storage).
- Replies up to ~3,500 tokens so full pages fit. Needs `ANTHROPIC_API_KEY`; set a monthly spending limit.

## AI prompt library — /prompts
44 ready-to-use prompts in 8 categories (writing, business, coding, careers, study, AI images, productivity, SEO) with search, filters, copy, and “Use in CraftSprint AI”, which opens the AI with the prompt filled in. In the header, menu and sitemap.

## Games (16 → 18)
Word Guess (guess the 5-letter word in 6 tries, on-screen keyboard) and Sliding Puzzle (3×3, 4×4, 5×5, always solvable).

## Tools (142 → 143)
Domain Age Checker using the official RDAP registry data (server route with a fixed host and a validated domain, 20 lookups/min). BLOCKED in this sandbox (no internet); works on the live site.

## Guides
Every guide has generated cover art (topic colour + icon) on the guide list and the guide page — no stock photos or licences needed.

## Not built on purpose
SERP checker, keyword volume/CPC/competition: need paid data APIs; tools with made-up numbers were not added.
Third-party games: need a publisher account (e.g. GameDistribution or GamePix) — see the final report.

## Checks
TypeScript 0 · ESLint 0 · 30 tests · build OK (535 files) · 196 pages at 390 px and 10 key pages at 10 widths: 0 errors, 0 sideways scroll · axe-core: 0 issues on all pages · new games and prompt → AI hand-off tested in the browser.
