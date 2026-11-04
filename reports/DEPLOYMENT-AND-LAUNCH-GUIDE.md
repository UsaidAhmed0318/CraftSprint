# Deployment & launch guide

1. In the `repo` folder: `git log --oneline -1` must show the v12 commit, then `git push origin main`.
2. Vercel deploys automatically; wait for “Ready”.
3. Set the environment variables in PRODUCTION-ENVIRONMENT-CHECKLIST.md, then Redeploy.
4. Check `/api/health`, `/sitemap.xml`, `/robots.txt`, send a contact message.
5. Phone tests: Android Chrome → Install App; iPhone Safari → Share → Add to Home Screen.
6. Google Search Console: add property → verify (DNS or HTML tag) → submit `/sitemap.xml` → inspect 3 pages. Bing Webmaster Tools: import from Google.
7. PageSpeed Insights on home + 3 tools (mobile). Rich Results Test on one tool page.
8. Monitor Search Console weekly; write tool articles in the priority order.
