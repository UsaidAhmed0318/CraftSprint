# Deployment and SEO launch guide

## 1. Deploy (Vercel)
1. Push the `CraftSprint-main` folder to GitHub (no `node_modules`, no `.env.local`).
2. Vercel → Add New → Project → pick the repo (Next.js, `npm run build`, Node 20.9+).
3. Settings → Environment Variables (names in `.env.example`):
   - **`NEXT_PUBLIC_SITE_URL` = your final domain**, e.g. `https://craftsprint.com`. Set this **before** the first public deploy — canonicals, sitemap and share images use it.
   - `RESEND_API_KEY`, `CONTACT_EMAIL` — contact form.
   - `ANTHROPIC_API_KEY` (optional) — real AI answers.
   - `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN` (optional) — shared rate limits.
4. Add your domain in Vercel → Domains, and choose one version (with or without `www`) — Vercel redirects the other.
5. Local check before pushing: `npm ci && npm run check && npm run build`.

## 2. Search engines (you must do these — they need your accounts)
1. **Google Search Console** → Add property → Domain → add the DNS TXT record at your domain provider → Verify.
2. Sitemaps → submit `https://YOURDOMAIN/sitemap.xml`.
3. URL Inspection → test 3–4 pages (home, image compressor, JSON formatter) → Request indexing.
4. **Bing Webmaster Tools** → Import from Google Search Console (one click) → submit the same sitemap.
5. **PageSpeed Insights** → test home + 3 tool pages on mobile; note LCP, INP, CLS.
6. **Rich Results Test** → test one tool page; it should show Breadcrumbs and FAQ as valid.

## 3. Getting links and first visitors (your Step 6 file)
| When | Action |
|---|---|
| Week 1 | Show HN post: “Show HN: CraftSprint – 138 free tools that run in your browser”. Explain the privacy angle honestly. |
| Week 1–2 | Product Hunt launch with screenshots of the image compressor, JSON formatter and CraftSprint AI. |
| Ongoing | Answer real questions on r/webdev, r/Frontend (JSON, minifiers), r/blogging, r/writers (word counter, line break remover). Help first; link only when it solves the question. |
| Monthly | One problem-solving guide that links to a tool (see the content strategy). |
| Monthly | Search Console → Links: see who links to you. |

No ranking, traffic or indexing time can be promised; these are the steps that give the site a fair chance.
