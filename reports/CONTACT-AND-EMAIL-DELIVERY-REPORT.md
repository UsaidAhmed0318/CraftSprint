# Contact form & email delivery

**Delivery status: BLOCKED** until you configure a verified sender in Resend. The code is ready and tested; real delivery needs your Resend account and domain.

## How it works now
1. Rate limit: 5 messages per hour per address (429).
2. Body: JSON only, max 8 KB (415/413/400).
3. Validation: name, email format, message required; max lengths; more than 3 links rejected.
4. Spam: hidden honeypot field + “submitted in under 3 seconds” check — nothing is sent, and the form does not claim success.
5. Email: sent with Resend from `CONTACT_FROM_EMAIL` to `CONTACT_TO_EMAIL`, reply-to = visitor.
6. Success (200, `delivered: true`) **only** when Resend accepts the email. Not configured → 503; rejected → 502; timeout/network → 504.
7. Nothing is logged or stored except the error type.

## Tests (tests/api.test.ts)
| Case | Expected | Result |
|---|---|---|
| Valid message, email configured, Resend accepts | 200 delivered:true | PASS |
| Email not configured | 503, no send | PASS |
| Resend rejects | 502 | PASS |
| Network failure | 504 | PASS |
| Invalid email / empty fields | 400 | PASS |
| Wrong content type / too large / malformed JSON | 415 / 413 / 400 | PASS |
| Honeypot | not sent, delivered:false | PASS |
| 6th message in an hour | 429 | PASS |
| Browser: submit without email config | “temporarily unavailable” shown, no “Thanks” | PASS |
| Real delivery to an inbox | — | **BLOCKED** (needs your Resend key + verified domain) |

## Setup
1. resend.com → add your domain → add the DNS records it shows → wait for “Verified”.
2. Create an API key.
3. Vercel → Environment Variables: `RESEND_API_KEY`, `CONTACT_FROM_EMAIL` = `CraftSprint <hello@yourdomain.com>`, `CONTACT_TO_EMAIL` = your inbox. Redeploy.
4. Open `/api/health` → `"email": true`. Send a test message from `/contact`.
Until you own a domain, Resend only allows sending to your own Resend account email from `onboarding@resend.dev` (testing only).
