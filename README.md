# CraftSprint

Free online tools (images, PDF, developer, writing, calculators, media, games) built with
Next.js 16 (App Router), React 19 and TypeScript. Every tool runs **inside the visitor's browser**:
files and text are never uploaded or stored on a server.

## Run locally
```bash
npm install
cp .env.example .env.local     # then fill in the values
npm run dev                    # http://localhost:3000
npm run build && npm start     # production check
```
Node.js 20.9 or newer is required.

## Folder structure
```
app/                     Routes (URLs). One page renders all tools: /tools/<slug>
  tools/[slug]/          Tool page + share image
  category/[slug]/       Category pages
  blog/                  Guides
  api/                   feedback (contact form), currency, assistant, health
components/
  layout/                Header, Footer, SearchBar, ThemeToggle, WhatsAppButton, SplashLoader
  home/                  Homepage sections (Hero3D, QuickStrip, PromoSlider)
  shared/                ToolShell, ToolCard, Dropzone, ResultBanner, ui, JsonLd, AdSlot, ToolAssistant, ContactForm
  tools/
    images/              Compressor, converter, resizer, background remover …
    design/              CSS generators, QR, colour, mockups …
    pdf/                 PDF merge/split/compress, documents
    developer/           JSON, Base64, JWT, minifiers, API tester …
    writing/             Word counter, case converter, SEO/content helpers
    media/               Video → GIF, audio trimmer/speed, GIF optimiser
    calculators/         Everyday, math, business calculators, converters
    productivity/        Kanban board, timers
    games/               Arcade and puzzle games
data/                    tools.ts (catalogue), seo.ts, toolContent.ts, posts.ts
lib/                     toolRegistry.tsx (slug → component), categories, seo, site, utils/
hooks/                   useObjectUrl (frees file memory), useFileTool
public/                  Images, icons, pdf/gif workers
```
See **HOW-TO-EDIT.md** for step-by-step editing (Roman Urdu).

## What the browser stores
Only small preferences in localStorage: theme, favourite/recent tools, game best scores and the
Kanban board. Tool inputs and outputs are kept in memory only and cleared when the page closes.
sessionStorage holds one flag (`cs-splash`) so the intro loader shows only once per visit.
