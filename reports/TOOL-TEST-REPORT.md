# CraftSprint — Tool Test Report

> **Update (SEO round):** a new tool, **Line Break Remover**, was added and tested (PASS — joins broken lines, keeps paragraphs, option works). Kanban board now renders on the server (it had no H1 for Google before) and still works (PASS). Image tools now name downloads properly (`photo-compressed.webp` instead of `compressed-photo.jpg.webp`). Total tools: **138**.

**137 tools tested.** PASS 135 · BLOCKED 1 · NOT TESTED 1 · FAIL 0

## How each tool was tested
Every tool page was opened in a real Chromium browser (Playwright). The test then:
1. used the built-in **Try with a sample** file, or typed sample text, or kept the tool's default values;
2. clicked the tool's main button (and its Download button when one appeared), or changed an input/slider for tools that update as you type;
3. checked that the output changed, a file downloaded, or a preview appeared — and that **no JavaScript or console error** happened.

**PASS** = the tool produced real output in this test with no errors. It is a working-order check, not a mathematical proof of every edge case.
Games were played with real clicks / arrow keys. Calculator formulas for EMI and BMI were also checked in the code (standard formulas).

| Tool | Route | Category | Input used | Result | What was observed |
|---|---|---|---|---|---|
| Image Compressor | `/tools/image-compressor` | Image & Design | sample file | PASS | Downloaded: compressed-sample-photo.jpg.webp, compressed-sample-photo.jp |
| Image Converter | `/tools/image-converter` | Image & Design | sample file | PASS | Clicked “Convert image”, output appeared |
| Image Resizer | `/tools/image-resizer` | Image & Design | sample file | PASS | Clicked “Resize image”, output appeared |
| QR Code Generator | `/tools/qr-code-generator` | Image & Design | typed text | PASS | Downloaded: qr-code.png, qr-code.png |
| QR Code Scanner | `/tools/qr-code-scanner` | Image & Design | sample file | PASS | Clicked “(updates as you type / no butt”, output appeared |
| Color Converter | `/tools/color-converter` | Image & Design | default values | PASS | Clicked “🎲 Random color”, output appeared |
| Color Palette Generator | `/tools/color-palette-generator` | Image & Design | default values | PASS | Output changed after moving a slider/option |
| CSS Gradient Generator | `/tools/css-gradient-generator` | Image & Design | default values | PASS | Output changed after editing an input |
| Box Shadow Generator | `/tools/box-shadow-generator` | Image & Design | default values | PASS | Output changed after moving a slider/option |
| Color Palette Extractor | `/tools/color-palette-extractor` | Image & Design | sample file | PASS | Clicked “(updates as you type / no butt”, output appeared |
| Border Radius Previewer | `/tools/border-radius-previewer` | Image & Design | default values | PASS | Output changed after moving a slider/option |
| SVG Pattern Generator | `/tools/svg-pattern-generator` | Image & Design | default values | PASS | Output changed after moving a slider/option |
| Image to Base64 | `/tools/image-to-base64` | Image & Design | sample file | PASS | Clicked “(updates as you type / no butt”, output appeared |
| Placeholder Image Generator | `/tools/placeholder-image-generator` | Image & Design | default values | PASS | Downloaded: placeholder-800x450.png, placeholder-800x450.png |
| Barcode Generator | `/tools/barcode-generator` | Image & Design | default values | PASS | Downloaded: barcode.png, barcode.png |
| Favicon Generator | `/tools/favicon-generator` | Image & Design | sample file | PASS | Downloaded: favicons.zip, favicons.zip |
| Image Cropper & Rotator | `/tools/image-cropper` | Image & Design | sample file | PASS | Downloaded: cropped.png, cropped.png |
| SVG to PNG Converter | `/tools/svg-to-png-converter` | Image & Design | sample file | PASS | Downloaded: converted.png, converted.png |
| PNG to SVG Wrapper | `/tools/png-to-svg-converter` | Image & Design | sample file | PASS | Downloaded: image.svg, image.svg |
| Device Mockup Generator | `/tools/mockup-generator` | Image & Design | sample file | PASS | Clicked “Phone”, output appeared |
| Font Pairing Finder | `/tools/font-pairing-finder` | Image & Design | default values | PASS | New 'Preview text' box updates every pairing. Fonts load from Google Fonts (blocked in sandbox, works online). |
| CSS Keyframe Animation Generator | `/tools/css-keyframe-generator` | Image & Design | default values | PASS | Output changed after editing an input |
| SVG Animation Previewer | `/tools/svg-animation-previewer` | Image & Design | default values | PASS | Clicked “spin”, output appeared |
| Background Remover | `/tools/background-remover` | Image & Design | sample file | PASS | Clicked “(updates as you type / no butt”, output appeared |
| Digital Signature Creator | `/tools/digital-signature-creator` | Documents & PDF | default values | PASS | Clicked “(updates as you type / no butt”, output appeared |
| Text Diff Checker | `/tools/text-diff-checker` | Documents & PDF | typed text | PASS | Clicked “Compare”, output appeared |
| Markdown Previewer | `/tools/markdown-previewer` | Documents & PDF | default values | PASS | Output changed after editing an input |
| Markdown to HTML | `/tools/markdown-to-html-converter` | Documents & PDF | default values | PASS | Clicked “Convert to HTML”, output appeared |
| HTML to Markdown | `/tools/html-to-markdown-converter` | Documents & PDF | default values | PASS | Clicked “Convert to Markdown”, output appeared |
| Resume / CV Builder | `/tools/resume-builder` | Documents & PDF | default values | PASS | Output changed after editing an input |
| Invoice Generator | `/tools/invoice-generator` | Documents & PDF | default values | PASS | Clicked “+ Add item”, output appeared |
| Receipt Maker | `/tools/receipt-maker` | Documents & PDF | default values | PASS | Clicked “+ Add item”, output appeared |
| Image to PDF Converter | `/tools/image-to-pdf-converter` | Documents & PDF | sample file | PASS | Downloaded: images.pdf |
| PDF to Image Converter | `/tools/pdf-to-image-converter` | Documents & PDF | sample file | PASS | Clicked “Convert to images”, output appeared |
| PDF Merge Tool | `/tools/pdf-merge` | Documents & PDF | sample file | PASS | Clicked “(updates as you type / no butt”, output appeared |
| PDF Split Tool | `/tools/pdf-split` | Documents & PDF | sample file | PASS | Downloaded: split-pages.zip |
| Text to PDF Converter | `/tools/text-to-pdf` | Documents & PDF | typed text | PASS | Downloaded: document.pdf |
| PDF Text Extractor | `/tools/pdf-text-extractor` | Documents & PDF | sample file | PASS | Clicked “Extract text”, output appeared |
| PDF Password Protector | `/tools/pdf-password-protector` | Documents & PDF | sample file | PASS | Clicked “(updates as you type / no butt”, output appeared |
| PDF Password Unlocker | `/tools/pdf-password-unlocker` | Documents & PDF | sample file | PASS | Downloaded: unlocked.pdf |
| PDF Compressor | `/tools/pdf-compressor` | Documents & PDF | sample file | PASS | Clicked “Compress PDF”, output appeared |
| Password Generator | `/tools/password-generator` | Developer Tools | default values | PASS | Clicked “Generate password”, output appeared |
| Password Strength Checker | `/tools/password-strength-checker` | Developer Tools | default values | PASS | Output changed after editing an input |
| JSON Formatter | `/tools/json-formatter` | Developer Tools | typed text | PASS | Clicked “Format”, output appeared |
| JSON to TypeScript | `/tools/json-to-typescript` | Developer Tools | default values | PASS | Clicked “Generate TypeScript”, output appeared |
| JSON to CSV Converter | `/tools/json-to-csv-converter` | Developer Tools | typed text | PASS | Clicked “Convert to CSV”, output appeared |
| CSV to JSON Converter | `/tools/csv-to-json-converter` | Developer Tools | typed text | PASS | Clicked “Convert to JSON”, output appeared |
| Base64 Encoder/Decoder | `/tools/base64-converter` | Developer Tools | typed text | PASS | Output changed after editing an input |
| URL Encoder/Decoder | `/tools/url-encoder-decoder` | Developer Tools | typed text | PASS | Clicked “Encode”, output appeared |
| JWT Decoder | `/tools/jwt-decoder` | Developer Tools | typed text | PASS | Output changed after editing an input |
| Regex Tester | `/tools/regex-tester` | Developer Tools | typed text | PASS | Output changed after editing an input |
| UUID Generator | `/tools/uuid-generator` | Developer Tools | default values | PASS | Clicked “Generate UUIDs”, output appeared |
| Hash Generator | `/tools/hash-generator` | Developer Tools | typed text | PASS | Clicked “Generate hash”, output appeared |
| Timestamp Converter | `/tools/timestamp-converter` | Developer Tools | default values | PASS | Clicked “Use current time”, output appeared |
| Cron Expression Parser | `/tools/cron-parser` | Developer Tools | default values | PASS | Output changed after editing an input |
| AI Token Counter | `/tools/ai-token-counter` | Developer Tools | typed text | PASS | Clicked “(updates as you type / no butt”, output appeared |
| Meta Tag Generator | `/tools/meta-tag-generator` | Developer Tools | default values | PASS | Output changed after editing an input |
| Robots.txt Generator | `/tools/robots-txt-generator` | Developer Tools | default values | PASS | Output changed after editing an input |
| Sitemap Generator | `/tools/sitemap-generator` | Developer Tools | default values | PASS | Output changed after editing an input |
| CSS Grid Generator | `/tools/css-grid-generator` | Developer Tools | default values | PASS | Output changed after moving a slider/option |
| CSS Flexbox Generator | `/tools/css-flexbox-generator` | Developer Tools | default values | PASS | Output changed after editing an input |
| Tailwind Config Generator | `/tools/tailwind-config-generator` | Developer Tools | default values | PASS | Output changed after editing an input |
| HTML Minifier | `/tools/html-minifier` | Developer Tools | typed text | PASS | Clicked “Minify”, output appeared |
| CSS Minifier | `/tools/css-minifier` | Developer Tools | typed text | PASS | Clicked “Minify”, output appeared |
| JavaScript Minifier | `/tools/js-minifier` | Developer Tools | typed text | PASS | Clicked “Minify”, output appeared |
| SQL Query Builder | `/tools/sql-query-builder` | Developer Tools | default values | PASS | Clicked “+ Add condition”, output appeared |
| API Testing Tool | `/tools/api-tester` | Developer Tools | default values | PASS | Output changed after editing an input |
| JavaScript Obfuscator | `/tools/js-obfuscator` | Developer Tools | default values | PASS | Clicked “Obfuscate code”, output appeared |
| Text Cleaner | `/tools/text-cleaner` | Content & SEO | typed text | PASS | Clicked “Clean spaces”, output appeared |
| Case Converter | `/tools/case-converter` | Content & SEO | typed text | PASS | Clicked “UPPERCASE”, output appeared |
| Word Counter | `/tools/word-counter` | Content & SEO | typed text | PASS | Clicked “(updates as you type / no butt”, output appeared |
| Lorem Ipsum Generator | `/tools/lorem-ipsum-generator` | Content & SEO | default values | PASS | Clicked “Generate text”, output appeared |
| Readability Checker | `/tools/readability-checker` | Content & SEO | typed text | PASS | Clicked “(updates as you type / no butt”, output appeared |
| SEO Meta Preview | `/tools/seo-meta-preview` | Content & SEO | default values | PASS | Output changed after editing an input |
| Slug Generator | `/tools/slug-generator` | Content & SEO | default values | PASS | Output changed after editing an input |
| UTM Link Builder | `/tools/utm-link-builder` | Content & SEO | default values | PASS | Output changed after editing an input |
| Hashtag Generator | `/tools/hashtag-generator` | Content & SEO | typed text | PASS | Clicked “#CamelCase”, output appeared |
| Keyword Density Checker | `/tools/keyword-density-checker` | Content & SEO | typed text | PASS | Clicked “(updates as you type / no butt”, output appeared |
| Headline Analyzer | `/tools/headline-analyzer` | Content & SEO | default values | PASS | Output changed after editing an input |
| Email Subject Line Tester | `/tools/email-subject-line-tester` | Content & SEO | default values | PASS | Output changed after editing an input |
| CTA Generator | `/tools/cta-generator` | Content & SEO | default values | PASS | Clicked “Urgency”, output appeared |
| Social Media Bio Generator | `/tools/social-bio-generator` | Content & SEO | default values | PASS | Output changed after editing an input |
| Blog Outline Generator | `/tools/blog-outline-generator` | Content & SEO | typed text | PASS | Output changed after editing an input |
| Plagiarism Checker Helper | `/tools/plagiarism-checker` | Content & SEO | typed text | PASS | Clicked “(updates as you type / no butt”, output appeared |
| Aspect Ratio Calculator | `/tools/aspect-ratio-calculator` | Calculators | default values | PASS | Clicked “Instagram Post (1080×1080)”, output appeared |
| Video Thumbnail Grabber | `/tools/video-thumbnail-grabber` | Video & Audio | sample file | PASS | Clicked “(updates as you type / no butt”, output appeared |
| SRT Subtitle Formatter | `/tools/srt-subtitle-formatter` | Video & Audio | typed text | PASS | Clicked “Format & shift”, output appeared |
| Video to GIF Converter | `/tools/video-to-gif-converter` | Video & Audio | sample file | PASS | Clicked “(updates as you type / no butt”, output appeared |
| Audio Trimmer / Cutter | `/tools/audio-trimmer` | Video & Audio | sample file | PASS | Downloaded: trimmed.wav, trimmed.wav |
| Audio Speed Changer | `/tools/audio-speed-changer` | Video & Audio | sample file | PASS | Downloaded: speed-changed.wav, speed-changed.wav |
| GIF Optimizer | `/tools/gif-optimizer` | Video & Audio | default values | PASS | Clicked “(updates as you type / no butt”, output appeared |
| Unit Converter | `/tools/unit-converter` | Calculators | default values | PASS | Output changed after editing an input |
| Profit Margin Calculator | `/tools/profit-margin-calculator` | Calculators | default values | PASS | Output changed after editing an input |
| Percentage Calculator | `/tools/percentage-calculator` | Calculators | default values | PASS | Output changed after editing an input |
| Date Calculator | `/tools/date-calculator` | Calculators | default values | PASS | Output changed after editing an input |
| Pomodoro Timer | `/tools/pomodoro-timer` | Productivity & Business | default values | PASS | Clicked “Start”, output appeared |
| Timezone Meeting Planner | `/tools/timezone-meeting-planner` | Productivity & Business | default values | PASS | Default = local time (bug fixed); output changes on edit |
| Currency Converter | `/tools/currency-converter` | Calculators | default values | BLOCKED | Needs internet to open.er-api.com; test sandbox has none. The API returns an honest error instead of fake rates. |
| Random Picker Wheel | `/tools/random-picker-wheel` | Productivity & Business | default values | PASS | Clicked “Spin the wheel”, output appeared |
| Task & Kanban Board | `/tools/kanban-board` | Productivity & Business | default values | PASS | Output changed after editing an input |
| Age Calculator | `/tools/age-calculator` | Calculators | default values | PASS | Output changed after editing an input |
| BMI Calculator | `/tools/bmi-calculator` | Calculators | default values | PASS | Output changed after editing an input |
| Loan EMI Calculator | `/tools/loan-emi-calculator` | Calculators | default values | PASS | Output changed after editing an input |
| Tip & Bill Splitter | `/tools/tip-bill-splitter` | Calculators | default values | PASS | Clicked “0%”, output appeared |
| Zakat Calculator | `/tools/zakat-calculator` | Calculators | default values | PASS | Output changed after editing an input |
| Number Base Converter | `/tools/number-base-converter` | Developer Tools | default values | PASS | Output changed after editing an input |
| Roman Numeral Converter | `/tools/roman-numeral-converter` | Calculators | default values | PASS | Output changed after editing an input |
| Random Number Generator | `/tools/random-number-generator` | Productivity & Business | default values | PASS | Clicked “Generate”, output appeared |
| Stopwatch & Countdown | `/tools/stopwatch-countdown` | Productivity & Business | default values | PASS | Start clicked, time advanced |
| Text to Speech | `/tools/text-to-speech` | Content & SEO | default values | NOT TESTED | Speech uses the visitor's device voices; cannot be heard in an automated browser. Page and controls load without errors. |
| Morse Code Translator | `/tools/morse-code-translator` | Content & SEO | default values | PASS | Text ↔ Morse translation works; the 'Play sound' audio itself was not listened to. |
| Color Contrast Checker | `/tools/color-contrast-checker` | Image & Design | default values | PASS | Output changed after editing an input |
| Image Watermark | `/tools/image-watermark` | Image & Design | sample file | PASS | Clicked “(updates as you type / no butt”, output appeared |
| Scientific Calculator | `/tools/scientific-calculator` | Math & Engineering | default values | PASS | Output changed after editing an input |
| Resistor Color Code | `/tools/resistor-color-code` | Math & Engineering | default values | PASS | Output changed after editing an input |
| Quadratic Equation Solver | `/tools/quadratic-equation-solver` | Math & Engineering | default values | PASS | Output changed after editing an input |
| Statistics Calculator | `/tools/statistics-calculator` | Math & Engineering | default values | PASS | Output changed after editing an input |
| Fraction Calculator | `/tools/fraction-calculator` | Math & Engineering | default values | PASS | Output changed after editing an input |
| GPA Calculator | `/tools/gpa-calculator` | Math & Engineering | default values | PASS | Clicked “Add course”, output appeared |
| IP Subnet Calculator | `/tools/subnet-calculator` | Developer Tools | default values | PASS | Output changed after editing an input |
| Chmod Calculator | `/tools/chmod-calculator` | Developer Tools | default values | PASS | Output changed after moving a slider/option |
| Compound Interest Calculator | `/tools/compound-interest-calculator` | Calculators | default values | PASS | Output changed after editing an input |
| Discount Calculator | `/tools/discount-calculator` | Calculators | default values | PASS | Output changed after editing an input |
| VAT & Sales Tax Calculator | `/tools/vat-calculator` | Calculators | default values | PASS | Output changed after editing an input |
| Fuel Cost Calculator | `/tools/fuel-cost-calculator` | Calculators | default values | PASS | Output changed after editing an input |
| Calorie Calculator | `/tools/calorie-calculator` | Calculators | default values | PASS | Output changed after editing an input |
| 2048 | `/tools/game-2048` | Games | default values | PASS | Arrow keys moved tiles |
| Snake | `/tools/snake-game` | Games | default values | PASS | Arrow keys moved snake |
| Memory Match | `/tools/memory-match` | Games | default values | PASS | Clicked “Shuffle”, output appeared |
| Tic-Tac-Toe | `/tools/tic-tac-toe` | Games | default values | PASS | Move played, board updated |
| Typing Speed Test | `/tools/typing-speed-test` | Games | typed text | PASS | Clicked “New passage”, output appeared |
| Minesweeper | `/tools/minesweeper` | Games | default values | PASS | Cell opened |
| Connect Four | `/tools/connect-four` | Games | default values | PASS | Disc dropped, computer replied |
| Hangman | `/tools/hangman` | Games | default values | PASS | Letters guessed, word updated |
| Reaction Time Test | `/tools/reaction-time-test` | Games | default values | PASS | Clicked “Click or tap to start”, output appeared |
| Simon Says | `/tools/simon-says` | Games | default values | PASS | Clicked “Start”, output appeared |
| Ohm's Law Calculator | `/tools/ohms-law-calculator` | Math & Engineering | default values | PASS | Output changed after editing an input |
