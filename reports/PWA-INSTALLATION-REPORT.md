# PWA installation

| Check | Status |
|---|---|
| Manifest (id, name, icons 192/512 + maskable, start_url, scope, standalone, theme, shortcuts) | PASS |
| Service worker registers and activates | PASS (Chromium) |
| Offline: visited page opens with server stopped; new page shows offline page | PASS |
| Old caches: only `cs-*` caches removed on update | PASS (code) |
| Install sheet: prompt / iPhone Safari steps / other iOS browsers / manual / installed | PASS (Chromium + iPhone user agent) |
| Busy state always resets after the prompt | PASS (try/finally) |
| Install button only on phones/tablets | PASS |
| One app is installed (CraftSprint), opening the page it was installed from | PASS (code) |
| Real Android Chrome install prompt | BLOCKED — needs a real device on the live HTTPS site |
| Real iPhone Add to Home Screen | BLOCKED — needs a real iPhone |
