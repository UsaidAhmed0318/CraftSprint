# Performance

Measured with Lighthouse 12 in this sandbox (simulated mid-range phone, 4× CPU slowdown). **Results vary a lot between runs here** (the same page measured 2 s and 10 s of blocking time), so confirm on the live site with PageSpeed Insights.

| Page | Device | Performance | LCP | CLS |
|---|---|---|---|---|
| Home | Desktop | 97 | 0.8 s | 0 |
| Home | Mobile | 50–57 | 3.4–4.6 s | 0 |
| Image Compressor | Mobile | 50–55 | 3.8–4.9 s | 0 (was 0.337) |

Done: page-load layout shift fixed; heavy decorative animations off on phones; intro loader skipped on small phones; fonts self-hosted; each tool's code loads only on its page.
Remaining (PARTIAL): most mobile time is React hydration of the page; moving more of the homepage to server-only components would help.
