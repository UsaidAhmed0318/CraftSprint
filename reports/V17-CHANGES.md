# v17 — File Workspace, multi-tool workflows, AI Writing Studio, tool kits, 8 new tools

Built from the growth plan (universal file workspace, workflows, batch processing, presets, AI content studio, tool collections, keyboard shortcuts, student/freelancer/Pakistan-relevant tools).

## New
| Feature | What it does | Tested |
|---|---|---|
| **File Workspace** `/workspace` | Drop any file → it detects the type → shows every tool that can use it → the file opens in that tool automatically (kept in the tab's memory, never uploaded). Several images → one click to batch-process them. | image → Image Compressor received the file; 3 images → Image Studio |
| **Image Studio (Batch)** | Up to 50 images: size presets (Instagram, Story, YouTube, LinkedIn, Facebook cover, passport 35×45 mm, online store, web), Fill/Fit, WebP/JPG/PNG, quality, background → results list with sizes → **ZIP download** | 3 images → 1080×1080, ZIP downloaded |
| **AI Writing Studio** | 14 jobs: email, reply, rewrite, grammar, summary, captions, product description, blog outline, cover letter, LinkedIn post, business names, YouTube script, translate, prompt improver; 6 tones; any language | Uses CraftSprint AI; without a working key it says so honestly |
| **Smart QR Generator** | Wi-Fi, contact (vCard), email, WhatsApp, SMS QR codes | Wi-Fi QR generated |
| **Citation Generator** | APA 7, MLA 9, Chicago for websites and books | “Khan, A., & Smith, J. (2026)…” |
| **Hijri Date Converter** | Umm al-Qura + civil + Arabic | 20 Mar 2026 → 1 Shawwal 1447 AH |
| **Coin Flip & Dice Roller** | Cryptographic randomness, up to 6 dice, history | ✓ |
| **Freelance Rate Calculator** | Hourly/day rate after expenses, platform fee, tax | 30,000 + 3,000, 46×25 h, 10 % fee → 31.88/h |
| **Reading Time Calculator** | Reading + speaking time | ✓ |
| **Tool kits** on the homepage | YouTube creator, Freelancer, Student, Developer, Small business | 5 kits |
| **Search shortcut** | Press `/` or Ctrl/⌘+K anywhere to jump to search | ✓ |

Catalogue: 151 → 159 tools (+18 games = 177 pages of tools and games).

## Not done (honest)
- Interface translations into many languages (the AI already answers in any language; translating every page needs reviewed translations).
- Trending tools from real usage needs analytics data first (Google Analytics or similar).
- PDF↔Word/Excel, HEIC, upscaling, OCR, video compression: need large libraries or servers; planned per batch.
- Pakistan tax/electricity/gold calculators need current official rates — will add with sources.

## Checks
TypeScript 0 · ESLint 0 · 34 tests · build OK (572 files) · 209 pages at 390 px and 10 key pages at 10 widths: 0 errors, 0 sideways scroll · axe-core: 0 issues on all pages.
