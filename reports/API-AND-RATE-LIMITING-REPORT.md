# APIs & rate limiting

| API | Limits | Body | Upstream | Errors |
|---|---|---|---|---|
| `POST /api/feedback` | 5 / hour / IP | JSON ≤ 8 KB | Resend, 10 s timeout | 400/413/415/429/502/503/504 |
| `POST /api/assistant` | 30 / 10 min / IP | JSON ≤ 16 KB, ≤ 20 messages (last 6 × 600 chars used) | Anthropic, 20 s timeout; without key → keyword matching | 400/413/415/429 |
| `GET /api/assistant` | — | — | — | returns only whether AI is on |
| `GET /api/currency` | 60 / min / IP | 3-letter codes only | open.er-api.com, 8 s timeout, 1 h cache | 400/429/502 |
| `GET /api/health` | — | — | — | shows email / ai / rateLimit mode, never secrets |

## Rate-limit mode
- **shared** (Upstash Redis configured): limits hold across all Vercel instances.
- **memory** (default): per instance only. Visible at `/api/health` and logged once in production.
- If Redis is configured but unreachable, the limiter falls back to memory (fail-open with a local limit) so the site keeps working; this is a deliberate choice for low-risk endpoints.

**Status: PARTIAL** until `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` are set (free at upstash.com).
