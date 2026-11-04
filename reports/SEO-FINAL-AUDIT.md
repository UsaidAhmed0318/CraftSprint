# SEO final audit

| Item | Status | Evidence |
|---|---|---|
| Unique titles ≤ 60 characters incl. brand | PASS | automated test + crawl |
| Unique descriptions | PASS | crawl: 0 duplicates |
| Canonical / OG / Twitter on every page | PASS | crawl |
| Sitemap: 165 canonical URLs, real `lastModified` only for posts | PASS | `/sitemap.xml` |
| robots.txt allows crawling, blocks `/api/`, points to sitemap | PASS | `/robots.txt` |
| Structured data valid (Organization, WebSite, SoftwareApplication/VideoGame, BreadcrumbList, FAQPage, Article) | PASS | JSON-LD parsed on all pages |
| Domain | PASS on Vercel | uses `NEXT_PUBLIC_SITE_URL` or Vercel's production domain; never an unowned domain |
| hreflang | NOT APPLICABLE | English only |
| Lighthouse SEO | 100 | home, compressor |
| Content depth | PARTIAL | see SEO-CONTENT-COVERAGE-REPORT.md |
| Search Console / Bing | BLOCKED | needs your accounts |
