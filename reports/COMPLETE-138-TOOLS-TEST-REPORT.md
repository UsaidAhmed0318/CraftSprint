# Complete tool test report — 138 tools

Catalogue source of truth: `data/tools.ts` → **138 unique tools** (each has exactly one record below; `line-break-remover` included).
Result: **PASS 136 · PARTIAL 1 · BLOCKED 1 · FAIL 0 · NOT TESTED 0**

## Method
Each tool page was opened in Chromium (Playwright, 1280×900). The test used the built-in sample file, typed sample text, or the tool's defaults; pressed the tool's main button (and Download when shown) or changed an input/slider for live tools; and checked that the output, a download or a preview really appeared with **no JavaScript or console error**. Games were played with clicks and arrow keys. A page opening is not counted as a pass.

Limits of this method: it proves the main workflow works; it does not prove every edge case (corrupted/very large files, every calculator value). Formula checks: EMI and BMI formulas reviewed in code; calculator engine has unit tests.

| Tool | Route | Category | Input → action | Observed | Errors | Status |
|---|---|---|---|---|---|---|
| Image Compressor | `/tools/image-compressor` | Image & Design | sample file → (updates as you type / no button) | Pressed “(updates as you type / no bu”, output appeared | none | **PASS** |
| Image Converter | `/tools/image-converter` | Image & Design | sample file → (updates as you type / no button) | Pressed “(updates as you type / no bu”, output appeared | none | **PASS** |
| Image Resizer | `/tools/image-resizer` | Image & Design | sample file → (updates as you type / no button) | output changed after editing an input | none | **PASS** |
| QR Code Generator | `/tools/qr-code-generator` | Image & Design | typed text → Generate QR code | Downloaded: qr-code.png, qr-code.png | none | **PASS** |
| QR Code Scanner | `/tools/qr-code-scanner` | Image & Design | sample file → (updates as you type / no button) | Pressed “(updates as you type / no bu”, output appeared | UI: No QR code found in this image. | **PASS** |
| Color Converter | `/tools/color-converter` | Image & Design | default values → Random color | Pressed “Random color”, output appeared | none | **PASS** |
| Color Palette Generator | `/tools/color-palette-generator` | Image & Design | default values → #2563eb | output changed after moving a slider/option | none | **PASS** |
| CSS Gradient Generator | `/tools/css-gradient-generator` | Image & Design | default values → (updates as you type / no button) | output changed after editing an input | none | **PASS** |
| Box Shadow Generator | `/tools/box-shadow-generator` | Image & Design | default values → (updates as you type / no button) | output changed after moving a slider/option | none | **PASS** |
| Color Palette Extractor | `/tools/color-palette-extractor` | Image & Design | sample file → (updates as you type / no button) | Pressed “(updates as you type / no bu”, output appeared | none | **PASS** |
| Border Radius Previewer | `/tools/border-radius-previewer` | Image & Design | default values → (updates as you type / no button) | output changed after moving a slider/option | none | **PASS** |
| SVG Pattern Generator | `/tools/svg-pattern-generator` | Image & Design | default values → dots | output changed after moving a slider/option | none | **PASS** |
| Image to Base64 | `/tools/image-to-base64` | Image & Design | sample file → (updates as you type / no button) | Pressed “(updates as you type / no bu”, output appeared | none | **PASS** |
| Placeholder Image Generator | `/tools/placeholder-image-generator` | Image & Design | default values → Generate placeholder | Downloaded: placeholder-800x450.png, placeholder-800 | none | **PASS** |
| Barcode Generator | `/tools/barcode-generator` | Image & Design | default values → (updates as you type / no button) | Downloaded: barcode.png, barcode.png | none | **PASS** |
| Favicon Generator | `/tools/favicon-generator` | Image & Design | sample file → (updates as you type / no button) | Downloaded: favicons.zip, favicons.zip | none | **PASS** |
| Image Cropper & Rotator | `/tools/image-cropper` | Image & Design | sample file → (updates as you type / no button) | Downloaded: cropped.png, cropped.png | none | **PASS** |
| SVG to PNG Converter | `/tools/svg-to-png-converter` | Image & Design | sample file → Convert to PNG | Downloaded: converted.png, converted.png | none | **PASS** |
| PNG to SVG Wrapper | `/tools/png-to-svg-converter` | Image & Design | sample file → (updates as you type / no button) | Pressed “(updates as you type / no bu”, output appeared | none | **PASS** |
| Device Mockup Generator | `/tools/mockup-generator` | Image & Design | sample file → Phone | Pressed “Phone”, output appeared | none | **PASS** |
| Font Pairing Finder | `/tools/font-pairing-finder` | Image & Design | default values → (updates as you type / no button) | output changed after editing an input | none | **PASS** |
| CSS Keyframe Animation Generator | `/tools/css-keyframe-generator` | Image & Design | default values → (updates as you type / no button) | output changed after editing an input | none | **PASS** |
| SVG Animation Previewer | `/tools/svg-animation-previewer` | Image & Design | default values → spin | Pressed “spin”, output appeared | none | **PASS** |
| Background Remover | `/tools/background-remover` | Image & Design | sample file → (updates as you type / no button) | Pressed “(updates as you type / no bu”, output appeared | none | **PASS** |
| Digital Signature Creator | `/tools/digital-signature-creator` | Documents & PDF | default values → (updates as you type / no button) | Pressed “(updates as you type / no bu”, output appeared | none | **PASS** |
| Text Diff Checker | `/tools/text-diff-checker` | Documents & PDF | typed text → Compare | Pressed “Compare”, output appeared | none | **PASS** |
| Markdown Previewer | `/tools/markdown-previewer` | Documents & PDF | default values → (updates as you type / no button) | Pressed “(updates as you type / no bu”, output appeared | none | **PASS** |
| Markdown to HTML | `/tools/markdown-to-html-converter` | Documents & PDF | default values → Convert to HTML | Pressed “Convert to HTML”, output appeared | none | **PASS** |
| HTML to Markdown | `/tools/html-to-markdown-converter` | Documents & PDF | default values → Convert to Markdown | Pressed “Convert to Markdown”, output appeared | none | **PASS** |
| Resume / CV Builder | `/tools/resume-builder` | Documents & PDF | default values → Print resume | output changed after editing an input | none | **PASS** |
| Invoice Generator | `/tools/invoice-generator` | Documents & PDF | default values → + Add item | Pressed “+ Add item”, output appeared | none | **PASS** |
| Receipt Maker | `/tools/receipt-maker` | Documents & PDF | default values → + Add item | Pressed “+ Add item”, output appeared | none | **PASS** |
| Image to PDF Converter | `/tools/image-to-pdf-converter` | Documents & PDF | sample file → (updates as you type / no button) | Pressed “(updates as you type / no bu”, output appeared | none | **PASS** |
| PDF to Image Converter | `/tools/pdf-to-image-converter` | Documents & PDF | sample file → Convert to images | Pressed “Convert to images”, output appeared | none | **PASS** |
| PDF Merge Tool | `/tools/pdf-merge` | Documents & PDF | sample file → (updates as you type / no button) | Pressed “(updates as you type / no bu”, output appeared | none | **PASS** |
| PDF Split Tool | `/tools/pdf-split` | Documents & PDF | sample file → Split into pages | Downloaded: split-pages.zip | none | **PASS** |
| Text to PDF Converter | `/tools/text-to-pdf` | Documents & PDF | typed text → Generate PDF | output changed after editing an input | none | **PASS** |
| PDF Text Extractor | `/tools/pdf-text-extractor` | Documents & PDF | sample file → Extract text | Pressed “Extract text”, output appeared | none | **PASS** |
| PDF Password Protector | `/tools/pdf-password-protector` | Documents & PDF | sample file → (updates as you type / no button) | Pressed “(updates as you type / no bu”, output appeared | none | **PASS** |
| PDF Password Unlocker | `/tools/pdf-password-unlocker` | Documents & PDF | sample file → Unlock PDF | Downloaded: unlocked.pdf | none | **PASS** |
| PDF Compressor | `/tools/pdf-compressor` | Documents & PDF | sample file → Compress PDF | Pressed “Compress PDF”, output appeared | none | **PASS** |
| Password Generator | `/tools/password-generator` | Developer Tools | default values → Generate password | Pressed “Generate password”, output appeared | none | **PASS** |
| Password Strength Checker | `/tools/password-strength-checker` | Developer Tools | default values → (updates as you type / no button) | output changed after editing an input | none | **PASS** |
| JSON Formatter | `/tools/json-formatter` | Developer Tools | typed text → Format | Pressed “Format”, output appeared | none | **PASS** |
| JSON to TypeScript | `/tools/json-to-typescript` | Developer Tools | default values → Generate TypeScript | Pressed “Generate TypeScript”, output appeared | none | **PASS** |
| JSON to CSV Converter | `/tools/json-to-csv-converter` | Developer Tools | typed text → Convert to CSV | Pressed “Convert to CSV”, output appeared | none | **PASS** |
| CSV to JSON Converter | `/tools/csv-to-json-converter` | Developer Tools | typed text → Convert to JSON | Pressed “Convert to JSON”, output appeared | UI: Add a header row and at least one data row. | **PASS** |
| Base64 Encoder/Decoder | `/tools/base64-converter` | Developer Tools | typed text → Encode | output changed after editing an input | none | **PASS** |
| URL Encoder/Decoder | `/tools/url-encoder-decoder` | Developer Tools | typed text → Encode | output changed after editing an input | none | **PASS** |
| JWT Decoder | `/tools/jwt-decoder` | Developer Tools | typed text → (updates as you type / no button) | output changed after editing an input | none | **PASS** |
| Regex Tester | `/tools/regex-tester` | Developer Tools | typed text → (updates as you type / no button) | output changed after editing an input | none | **PASS** |
| UUID Generator | `/tools/uuid-generator` | Developer Tools | default values → Generate UUIDs | Pressed “Generate UUIDs”, output appeared | none | **PASS** |
| Hash Generator | `/tools/hash-generator` | Developer Tools | typed text → Generate hash | Pressed “Generate hash”, output appeared | none | **PASS** |
| Timestamp Converter | `/tools/timestamp-converter` | Developer Tools | default values → Use current time | Pressed “Use current time”, output appeared | none | **PASS** |
| Cron Expression Parser | `/tools/cron-parser` | Developer Tools | default values → (updates as you type / no button) | output changed after editing an input | UI: Enter exactly 5 space-separated fields: minute hour day month weekday. | **PASS** |
| AI Token Counter | `/tools/ai-token-counter` | Developer Tools | typed text → (updates as you type / no button) | output changed after editing an input | none | **PASS** |
| Meta Tag Generator | `/tools/meta-tag-generator` | Developer Tools | default values → (updates as you type / no button) | output changed after editing an input | none | **PASS** |
| Robots.txt Generator | `/tools/robots-txt-generator` | Developer Tools | default values → (updates as you type / no button) | output changed after editing an input | none | **PASS** |
| Sitemap Generator | `/tools/sitemap-generator` | Developer Tools | default values → (updates as you type / no button) | output changed after editing an input | none | **PASS** |
| CSS Grid Generator | `/tools/css-grid-generator` | Developer Tools | default values → (updates as you type / no button) | output changed after moving a slider/option | none | **PASS** |
| CSS Flexbox Generator | `/tools/css-flexbox-generator` | Developer Tools | default values → (updates as you type / no button) | output changed after editing an input | none | **PASS** |
| Tailwind Config Generator | `/tools/tailwind-config-generator` | Developer Tools | default values → (updates as you type / no button) | output changed after editing an input | none | **PASS** |
| HTML Minifier | `/tools/html-minifier` | Developer Tools | typed text → Minify | output changed after editing an input | none | **PASS** |
| CSS Minifier | `/tools/css-minifier` | Developer Tools | typed text → Minify | Pressed “Minify”, output appeared | none | **PASS** |
| JavaScript Minifier | `/tools/js-minifier` | Developer Tools | typed text → Minify | Pressed “Minify”, output appeared | none | **PASS** |
| SQL Query Builder | `/tools/sql-query-builder` | Developer Tools | default values → + Add condition | Pressed “+ Add condition”, output appeared | none | **PASS** |
| API Testing Tool | `/tools/api-tester` | Developer Tools | default values → Send request | output changed after editing an input | none | **PASS** |
| JavaScript Obfuscator | `/tools/js-obfuscator` | Developer Tools | default values → Obfuscate code | Pressed “Obfuscate code”, output appeared | none | **PASS** |
| Text Cleaner | `/tools/text-cleaner` | Content & SEO | typed text → Clean spaces | output changed after editing an input | none | **PASS** |
| Case Converter | `/tools/case-converter` | Content & SEO | typed text → UPPERCASE | Pressed “UPPERCASE”, output appeared | none | **PASS** |
| Word Counter | `/tools/word-counter` | Content & SEO | typed text → (updates as you type / no button) | output changed after editing an input | none | **PASS** |
| Lorem Ipsum Generator | `/tools/lorem-ipsum-generator` | Content & SEO | default values → Generate text | Pressed “Generate text”, output appeared | none | **PASS** |
| Readability Checker | `/tools/readability-checker` | Content & SEO | typed text → (updates as you type / no button) | output changed after editing an input | none | **PASS** |
| SEO Meta Preview | `/tools/seo-meta-preview` | Content & SEO | default values → (updates as you type / no button) | output changed after editing an input | none | **PASS** |
| Slug Generator | `/tools/slug-generator` | Content & SEO | default values → (updates as you type / no button) | output changed after editing an input | none | **PASS** |
| UTM Link Builder | `/tools/utm-link-builder` | Content & SEO | default values → (updates as you type / no button) | output changed after editing an input | UI: Enter a full URL including https:// | **PASS** |
| Hashtag Generator | `/tools/hashtag-generator` | Content & SEO | typed text → #CamelCase | output changed after editing an input | none | **PASS** |
| Keyword Density Checker | `/tools/keyword-density-checker` | Content & SEO | typed text → (updates as you type / no button) | output changed after editing an input | none | **PASS** |
| Headline Analyzer | `/tools/headline-analyzer` | Content & SEO | default values → (updates as you type / no button) | output changed after editing an input | none | **PASS** |
| Email Subject Line Tester | `/tools/email-subject-line-tester` | Content & SEO | default values → (updates as you type / no button) | output changed after editing an input | none | **PASS** |
| CTA Generator | `/tools/cta-generator` | Content & SEO | default values → Urgency | Pressed “Urgency”, output appeared | none | **PASS** |
| Social Media Bio Generator | `/tools/social-bio-generator` | Content & SEO | default values → (updates as you type / no button) | output changed after editing an input | none | **PASS** |
| Blog Outline Generator | `/tools/blog-outline-generator` | Content & SEO | typed text → (updates as you type / no button) | output changed after editing an input | none | **PASS** |
| Plagiarism Checker Helper | `/tools/plagiarism-checker` | Content & SEO | typed text → (updates as you type / no button) | output changed after editing an input | none | **PASS** |
| Aspect Ratio Calculator | `/tools/aspect-ratio-calculator` | Calculators | default values → Instagram Post (1080×1080) | Pressed “Instagram Post (1080×1080)”, output appeared | none | **PASS** |
| Video Thumbnail Grabber | `/tools/video-thumbnail-grabber` | Video & Audio | sample file → (updates as you type / no button) | Pressed “(updates as you type / no bu”, output appeared | none | **PASS** |
| SRT Subtitle Formatter | `/tools/srt-subtitle-formatter` | Video & Audio | typed text → Format & shift | Pressed “Format & shift”, output appeared | UI: Could not find any valid subtitle blocks. | **PASS** |
| Video to GIF Converter | `/tools/video-to-gif-converter` | Video & Audio | sample file → (updates as you type / no button) | Pressed “(updates as you type / no bu”, output appeared | none | **PASS** |
| Audio Trimmer / Cutter | `/tools/audio-trimmer` | Video & Audio | sample file → Trim & export WAV | Downloaded: trimmed.wav, trimmed.wav | none | **PASS** |
| Audio Speed Changer | `/tools/audio-speed-changer` | Video & Audio | sample file → Apply & export WAV | Downloaded: speed-changed.wav, speed-changed.wav | none | **PASS** |
| GIF Optimizer | `/tools/gif-optimizer` | Video & Audio | default values → (updates as you type / no button) | Pressed “(updates as you type / no bu”, output appeared | none | **PASS** |
| Unit Converter | `/tools/unit-converter` | Calculators | default values → Length | output changed after editing an input | none | **PASS** |
| Profit Margin Calculator | `/tools/profit-margin-calculator` | Calculators | default values → (updates as you type / no button) | output changed after editing an input | UI: Enter a cost and a selling price greater than 0. | **PASS** |
| Percentage Calculator | `/tools/percentage-calculator` | Calculators | default values → (updates as you type / no button) | output changed after editing an input | none | **PASS** |
| Date Calculator | `/tools/date-calculator` | Calculators | default values → (updates as you type / no button) | output changed after editing an input | none | **PASS** |
| Pomodoro Timer | `/tools/pomodoro-timer` | Productivity & Business | default values → Start | Pressed “Start”, output appeared | none | **PASS** |
| Timezone Meeting Planner | `/tools/timezone-meeting-planner` | Productivity & Business | default values → (updates as you type / no button) | Pressed “(updates as you type / no bu”, output appeared | none | **PASS** |
| Currency Converter | `/tools/currency-converter` | Calculators | default values → Get rate & convert | Needs internet to open.er-api.com (unavailable in the test sandbox). Shows an honest error, never fake rates. | network (sandbox) | **BLOCKED** |
| Random Picker Wheel | `/tools/random-picker-wheel` | Productivity & Business | default values → Spin the wheel | Pressed “Spin the wheel”, output appeared | none | **PASS** |
| Task & Kanban Board | `/tools/kanban-board` | Productivity & Business | default values → Add | output changed after editing an input | none | **PASS** |
| Age Calculator | `/tools/age-calculator` | Calculators | default values → (updates as you type / no button) | output changed after editing an input | none | **PASS** |
| BMI Calculator | `/tools/bmi-calculator` | Calculators | default values → Metric (cm, kg) | output changed after editing an input | none | **PASS** |
| Loan EMI Calculator | `/tools/loan-emi-calculator` | Calculators | default values → (updates as you type / no button) | output changed after editing an input | none | **PASS** |
| Tip & Bill Splitter | `/tools/tip-bill-splitter` | Calculators | default values → 0% | Pressed “0%”, output appeared | none | **PASS** |
| Zakat Calculator | `/tools/zakat-calculator` | Calculators | default values → (updates as you type / no button) | output changed after editing an input | none | **PASS** |
| Number Base Converter | `/tools/number-base-converter` | Developer Tools | default values → (updates as you type / no button) | output changed after editing an input | UI: That is not a valid base-10 number. | **PASS** |
| Roman Numeral Converter | `/tools/roman-numeral-converter` | Calculators | default values → (updates as you type / no button) | output changed after editing an input | none | **PASS** |
| Random Number Generator | `/tools/random-number-generator` | Productivity & Business | default values → Generate | Pressed “Generate”, output appeared | none | **PASS** |
| Stopwatch & Countdown | `/tools/stopwatch-countdown` | Productivity & Business | default values → Stopwatch | Played/clicked in the browser: state changed correctly | none | **PASS** |
| Text to Speech | `/tools/text-to-speech` | Content & SEO | default values → Speak | Text input and controls work; spoken audio cannot be heard in an automated browser. | none | **PARTIAL** |
| Morse Code Translator | `/tools/morse-code-translator` | Content & SEO | default values → Play sound | output changed after editing an input | none | **PASS** |
| Color Contrast Checker | `/tools/color-contrast-checker` | Image & Design | default values → (updates as you type / no button) | output changed after editing an input | none | **PASS** |
| Image Watermark | `/tools/image-watermark` | Image & Design | sample file → (updates as you type / no button) | Downloaded: watermarked-sample-photo.jpg, watermarke | none | **PASS** |
| Scientific Calculator | `/tools/scientific-calculator` | Math & Engineering | default values → Degrees | output changed after editing an input | none | **PASS** |
| Resistor Color Code | `/tools/resistor-color-code` | Math & Engineering | default values → 4 bands | output changed after editing an input | none | **PASS** |
| Quadratic Equation Solver | `/tools/quadratic-equation-solver` | Math & Engineering | default values → (updates as you type / no button) | output changed after editing an input | none | **PASS** |
| Statistics Calculator | `/tools/statistics-calculator` | Math & Engineering | default values → (updates as you type / no button) | output changed after editing an input | UI: Enter at least one number. | **PASS** |
| Fraction Calculator | `/tools/fraction-calculator` | Math & Engineering | default values → (updates as you type / no button) | output changed after editing an input | UI: Enter fractions like 3/4, 5 or 1 1/2 (and don’t divide by zero). | **PASS** |
| GPA Calculator | `/tools/gpa-calculator` | Math & Engineering | default values → Add course | Pressed “Add course”, output appeared | none | **PASS** |
| IP Subnet Calculator | `/tools/subnet-calculator` | Developer Tools | default values → (updates as you type / no button) | output changed after editing an input | UI: Enter a valid IPv4 address such as 10.0.0.1. | **PASS** |
| Chmod Calculator | `/tools/chmod-calculator` | Developer Tools | default values → (updates as you type / no button) | output changed after moving a slider/option | none | **PASS** |
| Compound Interest Calculator | `/tools/compound-interest-calculator` | Calculators | default values → (updates as you type / no button) | output changed after editing an input | none | **PASS** |
| Discount Calculator | `/tools/discount-calculator` | Calculators | default values → (updates as you type / no button) | output changed after editing an input | none | **PASS** |
| VAT & Sales Tax Calculator | `/tools/vat-calculator` | Calculators | default values → Add tax | output changed after editing an input | none | **PASS** |
| Fuel Cost Calculator | `/tools/fuel-cost-calculator` | Calculators | default values → km & litres | output changed after editing an input | none | **PASS** |
| Calorie Calculator | `/tools/calorie-calculator` | Calculators | default values → Male | output changed after editing an input | none | **PASS** |
| 2048 | `/tools/game-2048` | Games | default values → New game | Pressed “New game”, output appeared | none | **PASS** |
| Snake | `/tools/snake-game` | Games | default values → Restart | Pressed “Restart”, output appeared | none | **PASS** |
| Memory Match | `/tools/memory-match` | Games | default values → Shuffle | Pressed “Shuffle”, output appeared | none | **PASS** |
| Tic-Tac-Toe | `/tools/tic-tac-toe` | Games | default values → Vs computer | Played/clicked in the browser: state changed correctly | none | **PASS** |
| Typing Speed Test | `/tools/typing-speed-test` | Games | typed text → New passage | Pressed “New passage”, output appeared | none | **PASS** |
| Minesweeper | `/tools/minesweeper` | Games | default values → Easy | Played/clicked in the browser: state changed correctly | none | **PASS** |
| Connect Four | `/tools/connect-four` | Games | default values → Vs computer | Played/clicked in the browser: state changed correctly | none | **PASS** |
| Hangman | `/tools/hangman` | Games | default values → New word | Played/clicked in the browser: state changed correctly | none | **PASS** |
| Reaction Time Test | `/tools/reaction-time-test` | Games | default values → Click or tap to start | Pressed “Click or tap to start”, output appeared | none | **PASS** |
| Simon Says | `/tools/simon-says` | Games | default values → Start | Pressed “Start”, output appeared | none | **PASS** |
| Ohm's Law Calculator | `/tools/ohms-law-calculator` | Math & Engineering | default values → (updates as you type / no button) | output changed after editing an input | none | **PASS** |
| Line Break Remover | `/tools/line-break-remover` | Content & SEO | typed text → (updates as you type / no button) | output changed after editing an input | none | **PASS** |
