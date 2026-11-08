# Git branches & Vercel environments — CraftSprint

| Branch | Vercel environment | Address | Indexed by Google | Ads / Analytics |
|---|---|---|---|---|
| `main` | Production | **www.craftsprint.io** (craftsprint.io and craft-sprint-six.vercel.app redirect here, 308) | Yes | Yes (when IDs are set) |
| `staging` | Preview | **staging.craftsprint.io** (after you add the domain) and Vercel preview links | **No** | **No** |

## What the code does (verified with production and preview builds)
| | Production build | Staging / preview build |
|---|---|---|
| `robots.txt` | Allow `/`, block `/api/`, sitemap listed | `Disallow: /` |
| `X-Robots-Tag` header | — | `noindex, nofollow` on every page |
| `<meta name="robots">` | `index, follow` | `noindex, nofollow` |
| Canonical URL | https://www.craftsprint.io/... | https://www.craftsprint.io/... (points to the live page) |
| AdSense / Google Analytics | On (if configured) | Off |
| Orange “Staging — not the live site” label | — | Shown |
| Old-address redirects | vercel.app and bare domain → www | staging address is not redirected |

Detection uses Vercel's `VERCEL_ENV` (exposed to the app as `NEXT_PUBLIC_DEPLOY_ENV`). Local/self-hosted production builds count as production.

## One-time setup
1. Push both branches: `git push origin main` and `git push -u origin staging`.
2. Vercel → Settings → Domains → **Add** `staging.craftsprint.io` → **Git Branch: staging** → Save. If DNS is on Vercel the record is created automatically; otherwise add `CNAME staging → cname.vercel-dns.com`.
3. Vercel → Settings → Environments → **Preview**: add the same secret keys you want to test on staging (e.g. `GEMINI_API_KEY`). Do **not** add AdSense/Analytics IDs to Preview (they are switched off there anyway).
4. Optional: Settings → Deployment Protection → keep **Vercel Authentication** on for previews so only you can open staging.

## Daily cycle
```bash
git checkout staging
# …make changes…
git add .
git commit -m "feat: …"
git push origin staging          # → staging.craftsprint.io (not indexed)

# when everything works on staging:
git checkout main
git pull origin main
git merge staging
git push origin main             # → www.craftsprint.io
```
Never edit `main` directly; never force-push.

Note: the SOP mentions TanStack Query — CraftSprint does not use it; nothing to configure.
