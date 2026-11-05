# v14 — 14 new tools, CraftSprint AI chat, cleaner mobile hero

## New tools (128 → 142 tools; 16 games; 158 total)
| Tool | Category | Notes |
|---|---|---|
| Open Graph & Twitter Card Generator | SEO Tools | Tags + live share preview |
| Website Speed Checker | SEO Tools | Uses Google PageSpeed Insights from the visitor's browser (the URL is sent to Google) |
| WhatsApp Link Generator | Documents & Business | wa.me link with message |
| Payment Reminder Generator | Documents & Business | Friendly / firm / final |
| Google Review QR Generator | QR & Barcode | Print-ready PNG |
| SIP, ROI, Break-even Calculators | Finance Calculators | Formulas shown in FAQ |
| Remove Duplicate Lines, Text Sorter, Find and Replace | Writing & Text | Regex option, natural sort |
| SQL Formatter, XML Formatter & Validator | Developer Tools | Quoted SQL text kept; browser XML parser |
| Rotate PDF | PDF Tools | No re-compression |

Tested in the browser with real input: XML indentation, wa.me link, QR image, duplicate removal, find & replace (2 matches), natural A–Z sort, shuffle, SIP (5,000/month, 12%, 10 years → 1,161,695.38), break-even (250 units), rotated PDF download. Website Speed Checker: BLOCKED here (no internet in the test machine).

## CraftSprint AI — "Chat with AI" mode
`/ai` now has two modes: **Find a tool** (works without any key) and **Chat with AI** — a general assistant that answers in the visitor's language, writes text and code (with copy buttons) and links to CraftSprint tools.
- API: `POST /api/chat` (JSON ≤ 48 KB, last 12 messages × 4,000 characters, 20 messages per hour per visitor, 45 s timeout). Conversations are not stored or logged.
- Needs `ANTHROPIC_API_KEY` in Vercel. Without it the chat says honestly that it is not switched on (tested). **Every chat message costs API credit** — set a monthly spending limit in the Anthropic console.
- Optional `ANTHROPIC_CHAT_MODEL` to use a stronger model for chat.

## Mobile
The decorative 3D hero art is hidden on phones and small tablets, so the headline, search, buttons and stats are the first thing visitors see.

## Checks
TypeScript 0 · ESLint 0 · 30 tests (new: chat API without key, SQL formatter) · build OK (524 files) · 192 pages at 390 px and 10 key pages at 10 widths: 0 errors, 0 sideways scroll · axe-core: 0 issues on all pages.
