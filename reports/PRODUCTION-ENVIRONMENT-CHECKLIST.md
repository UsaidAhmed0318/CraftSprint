# Production environment checklist

| Variable | Needed for | Status |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | Canonicals, sitemap, share links | Optional on Vercel (production domain used automatically); **required** elsewhere or once you have your own domain |
| `RESEND_API_KEY` | Contact emails | Required for the contact form |
| `CONTACT_FROM_EMAIL` | Sender on a Resend-verified domain | Required |
| `CONTACT_TO_EMAIL` | Your inbox | Required |
| `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN` | Shared rate limits | Recommended |
| `ANTHROPIC_API_KEY`, `ANTHROPIC_MODEL` | Real AI answers | Optional |
| `NEXT_PUBLIC_GA_ID`, `NEXT_PUBLIC_ADSENSE_CLIENT`, `NEXT_PUBLIC_ADSENSE_SLOT` | Analytics / ads | When approved |

Check after deploy: `/api/health` → `email: true`, `rateLimit: "shared"`; `/sitemap.xml` and `/robots.txt` show your domain.
