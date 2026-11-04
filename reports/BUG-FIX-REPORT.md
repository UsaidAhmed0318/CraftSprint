# Bug-fix report (v12)

| # | Problem | Fix | Files | Verified by |
|---|---|---|---|---|
| 1 | Contact form showed “Thanks — your message was sent” when email was not configured (API returned `{ok:true, delivered:false}` and logged the message) | API now returns **503** when `RESEND_API_KEY` / `CONTACT_FROM_EMAIL` / `CONTACT_TO_EMAIL` are missing; messages are never logged; the form shows success **only** when `delivered === true` | `app/api/feedback/route.ts`, `components/shared/ContactForm.tsx` | Unit tests + browser test (form shows “temporarily unavailable”) |
| 2 | Sender was `onboarding@resend.dev` (Resend test sender) | Sender now comes from `CONTACT_FROM_EMAIL` (must be a domain verified in Resend) | `app/api/feedback/route.ts` | Unit test |
| 3 | Resend timeout/network failure not handled | 10 s timeout → 504; Resend rejection → 502 | same | Unit tests |
| 4 | No body-size or content-type checks on APIs | `readJsonBody`: JSON only (415), size limit (413), malformed JSON (400). Contact 8 KB, assistant 16 KB / max 20 messages | `lib/http.ts`, both routes | Unit tests |
| 5 | Silent in-memory rate limiting in production | Mode is visible: `/api/health` shows `rateLimit: memory|shared`; a warning is logged once in production without Upstash | `lib/rateLimit.ts`, `app/api/health/route.ts` | Health endpoint |
| 6 | Service worker deleted **all** caches of the origin | Deletes only old `cs-*` caches; version bumped to `cs-v2` so installed apps update | `public/sw.js` | Code review + offline test |
| 7 | Install prompt error could leave the button stuck “Opening…” | `try/catch/finally` always resets; error shows manual steps | `components/pwa/PwaManager.tsx` | Code review |
| 8 | Sitemap used today's date as `lastModified` for every URL | Real dates for blog posts; other URLs omit `lastModified` | `app/sitemap.ts` | Sitemap: 165 URLs, 9 with real dates |
| 9 | `lib/site.ts` fell back to `craftsprint.com` (domain not owned) | Falls back to localhost only; build prints a clear warning when no domain is configured outside Vercel | `lib/site.ts`, `next.config.ts` | Build log |
| 10 | Health check only said “ok” | Reports whether email, AI and shared rate limiting are configured (never values) | `app/api/health/route.ts` | curl |
