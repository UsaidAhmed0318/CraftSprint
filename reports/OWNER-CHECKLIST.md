# CraftSprint — what only the owner can do (not possible from code)

Do these in order. Each one is a few minutes.

## A. Earning
1. **AdSense** (adsense.google.com) → Sites → craftsprint.io → *Request review*. Code, ads.txt and the ownership tag are already live.
2. AdSense → **Privacy & messaging** → create the *European regulations* message (required for EEA/UK visitors).
3. AdSense → **Payments** → add address and payment method. Google posts a PIN letter when earnings reach the verification threshold; enter it when it arrives.
4. After approval: AdSense → Ads → turn on **Auto ads** for craftsprint.io.
5. **Services** (fastest income): reply to every WhatsApp / contact message the same day. The site now sends visitors to /services from every tool.

## B. Google and Bing
1. **Google Analytics 4**: create the property, put the `G-…` ID in Vercel as `NEXT_PUBLIC_GA_ID` (Production), redeploy. Then Admin → Events → mark `file_download`, `copy_result`, `services_cta_click` as key events.
2. **Search Console** (craftsprint.io): Sitemaps → resubmit `https://www.craftsprint.io/sitemap.xml`. Pages → “Crawled – currently not indexed” → *Validate fix*. Request indexing for a few important tools per day.
3. **Bing Webmaster Tools**: add `https://www.craftsprint.io/`, verify (CNAME in Vercel DNS), submit the sitemap.
4. After every deploy: `npm run indexnow` (the GitHub workflow also does this automatically 4 minutes after each push to main).

## C. Contact form (so messages reach your inbox)
Resend.com → add and verify the domain craftsprint.io → Vercel env: `RESEND_API_KEY`, `CONTACT_FROM_EMAIL` (e.g. hello@craftsprint.io), `CONTACT_TO_EMAIL` → redeploy.

## D. Brand profiles (GEO: one brand everywhere)
Create the missing profiles with the same name and logo (YouTube, X, LinkedIn page, Facebook page), then add their links in `lib/site.ts` → `sameAs`.

## E. Traffic (this is what moves earnings)
- Post 1 short video or post per day showing one tool solving one problem (use the CraftSprint CMO content).
- List the site on: Product Hunt, AlternativeTo, SaaSHub, Futurepedia-style directories, relevant Reddit/Facebook groups (follow each group's rules).
- Write 2 guides per week in the blog that answer a real question and link to the tool.
- Use the Tools Tracker: check 4 tools a day and report any problem.

## F. WhatsApp
The site now shows +44 7456 251163. Make sure WhatsApp (ideally WhatsApp Business) is active on that number, with a greeting message and business hours.
