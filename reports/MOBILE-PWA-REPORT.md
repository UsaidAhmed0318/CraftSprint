# Mobile app experience & install (v10)

## What was added
| Feature | Where |
|---|---|
| Bottom tab bar on phones/tablets (Home, Tools, Games, AI, More) with active state and safe-area padding | `components/layout/MobileTabBar.tsx` |
| New side menu: Home, All tools, Games, AI assistant, Categories, Favourites & history, Install app, Guides, About, Contact | `components/layout/Header.tsx` |
| All tools page: search, category chips, sort, 2-column cards with “Open tool”, empty state | `components/shared/AllToolsBrowser.tsx`, `app/tools/page.tsx` |
| Favourites & history page (saved only in the browser, not indexed) | `app/my-tools/page.tsx` |
| Games landing hero + restyled 2048 | `app/category/[slug]/page.tsx`, `app/vip.css` |
| Install App button on every tool and game page (phones/tablets only) | `components/pwa/InstallButton.tsx` |
| Install sheet: Android/Chrome native prompt, iPhone Safari steps, “open in Safari” note for other iOS browsers, manual steps, “already installed” state | `components/pwa/PwaManager.tsx`, `lib/utils/pwa.ts` |
| Service worker: pages network-first, app files cache-first, never caches `/api`; offline page | `public/sw.js`, `app/offline/page.tsx` |
| Manifest: id, scope, theme colours, icons, shortcuts (All tools, Games, AI, Image Compressor) | `app/manifest.ts` |
| After installing from a tool page, the installed app opens that tool once | `PwaManager.tsx` |

One app is installed (CraftSprint) — not one per tool. The button text never claims a single tool was installed.

## Verified (Chromium, emulated phone)
- Tab bar visible on mobile, hidden on desktop; Tools/Games tabs highlight correctly (2048 → Games).
- “More” opens the menu; menu closes on navigation; page behind does not scroll.
- Install sheet opens; iPhone Safari user agent shows Share → Add to Home Screen steps.
- Install button hidden on desktop.
- Service worker activates; with the server switched off, a visited page still opens and a new page shows “You are offline”.
- All 167 pages at 390 px: 0 errors, 0 sideways scrolling. 10 key pages at 320–1920 px: 0 problems.
- Accessibility (axe-core): 0 issues on all pages; mobile pages incl. open menu and install sheet, dark and light: 0 issues.

## Not verifiable here
- The real Android install prompt (Chrome only fires it on a real, installable HTTPS site).
- Real iPhone “Add to Home Screen”.
