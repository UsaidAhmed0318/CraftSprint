# v16 — CraftSprint AI that never dead-ends, 4 popular media tools

## CraftSprint AI (Gemini free tier)
Problem on the live site: “The AI service is busy”. The key was being read (the message changed), but Google refused the request — usually because a model name is not available to the key or has no free quota.
Fix:
- Tries several Flash model names one after another (your `GEMINI_MODEL`, the last one that worked, the models Google lists for your key, then known names) until one answers.
- A model with no free quota (“limit: 0”) is skipped instead of stopping.
- If no model can answer, the visitor still gets matching CraftSprint tools instead of an error, plus a short “Details for the site owner” line with Google’s reason (no key or messages are ever shown or logged).
- A rejected key shows “the AI key was not accepted”.
- Tests (mocked Google API): model discovery, no-quota fallback, server error fallback, rejected key, free-limit message — 34/34 pass.

## New tools (147 → 151; Video & Audio)
Screen Recorder (no watermark, with sound), Voice Recorder, Speech to Text (12 languages incl. Urdu, Hindi, Arabic), Webcam & Mic Test. All run on the device; recordings are never uploaded. Tested with a simulated camera and microphone: recording, playback, download (voice-recording.webm), camera info (640×480 @ 20 fps), speech listening state.
`Permissions-Policy` now allows `display-capture` for the site itself (needed by the screen recorder).

## Checks
TypeScript 0 · ESLint 0 · 34 tests · build OK (547 files) · 200 pages at 390 px and 10 key pages at 10 widths: 0 errors, 0 sideways scroll · axe-core: 0 issues on all pages.
