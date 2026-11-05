# v18 — PDF to Word, HEIC, upscaler, video compressor, Pakistan salary tax, 6 interface languages

| Feature | Notes | Tested |
|---|---|---|
| PDF to Word | Text, paragraphs and page breaks into an editable .docx (pdf.js + docx). Scanned PDFs are detected and explained (need OCR). | Sample PDF → sample-document.docx with text |
| HEIC to JPG/PNG | iPhone photos, heic2any loaded only on this page | Page renders; real HEIC to be checked on the live site |
| Image Upscaler 2×/3×/4× | Step-wise high-quality scaling + unsharp mask; not AI (said clearly) | 1600×1000 → 3200×2000 |
| Video Compressor | 480p/720p/1080p, three quality levels, progress + cancel, WebM output | Page renders; real video to be checked on the live site |
| Pakistan Salary Tax 2026-27 | Finance Act 2026 slabs (TY2027) + 2025-26 for comparison incl. the old 9% surcharge | Unit test: 1.8M → 72,000; 3.6M → 416,000 (FY27) / 466,000 (FY26); 15M → 4,224,000 |
| Interface languages | English, Urdu, Arabic, Hindi, Spanish, French for menus, navigation, tab bar and homepage headline; Urdu/Arabic right-to-left. Tool pages stay English for now. | Urdu on desktop and phone: RTL, no sideways scroll, switch back to English |
| File Workspace | HEIC → HEIC to JPG; PDF → PDF to Word; video → Video Compressor; image → Image Studio + Upscaler | ✓ |
| Fix | Skip-link positioned at -999px caused 1,000 px sideways scroll in right-to-left languages | Fixed |

New packages: heic2any, docx (npm audit: 0 vulnerabilities).

Checks: TypeScript 0 · ESLint 0 · 35 tests · build OK (587 files) · 214 pages at 390 px and 10 key pages at 10 widths: 0 errors, 0 sideways scroll · axe-core: 0 issues on all pages.

Still open: OCR, PDF to Excel, gold/electricity/gas calculators (need live official data), full page translations, AI chat confirmation on the live site.
