# Security & privacy

| Area | Status | Notes |
|---|---|---|
| Dependencies (`npm audit`) | PASS | 0 vulnerabilities |
| Security headers | PASS | CSP, HSTS, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy |
| CSP `script-src 'unsafe-inline'` | PARTIAL | Needed by Next.js inline scripts and AdSense; nonce-based CSP is the next step |
| CSP `connect-src https:` | PASS (justified) | The API Tester tool sends requests to any HTTPS address the visitor types, from the visitor's own browser. Restricting it would break that tool. No server-side fetching of visitor URLs exists, so there is no SSRF risk. |
| API input limits | PASS | Content type, body size, schema limits, timeouts |
| Rate limiting | PARTIAL | Shared limits need Upstash keys |
| SVG / Markdown preview | PASS | DOMPurify, client only |
| Files | PASS | Processed in the browser; never uploaded; type checked against `accept`; temporary URLs revoked |
| Secrets | PASS | Only server-side env vars; none in client bundles |
| Logging | PASS | Contact messages and chats are not logged |
| Service worker | PASS | Same-origin only, never caches `/api`, deletes only its own old caches |
| Browser storage | PASS | Theme, favourites, recent tools, game scores, Kanban board — described on the privacy page |
Legal pages (Privacy, Terms) should be reviewed by a lawyer before a business launch.
