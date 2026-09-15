# CraftSprint

Production-ready Next.js micro-SaaS starter for free image and text utilities.

## Included
- Next.js 16 App Router + TypeScript
- Responsive premium UI
- Image compressor, converter, resizer
- Text cleaner
- Browser-local image/text processing for privacy
- Contact API route + health API
- SEO metadata, canonical URLs, sitemap, robots
- SoftwareApplication/WebSite JSON-LD
- Original guide pages for search intent
- Privacy / Terms / About / Contact
- AdSense-ready ad placeholders
- Separate components, hooks, lib, data, utils and public/images folders

## Run
1. Copy `.env.example` to `.env.local`.
2. Set `NEXT_PUBLIC_SITE_URL` to the real HTTPS domain.
3. `npm install`
4. `npm run dev`
5. `npm run build`

## AdSense
Replace the placeholder ad component with the official AdSense code after your account/site is approved. Do not click your own ads or use misleading placements. Add a real consent-management solution where required by law before serving personalized advertising.

## Contact API
The demo `/api/feedback` validates input and logs it on the server. For production, connect it to your email/CRM/database provider and add rate limiting, bot protection and abuse monitoring.
