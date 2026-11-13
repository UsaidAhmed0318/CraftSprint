/**
 * Longer "About this tool" text shown under a tool (good for Google).
 * Add an entry for any tool slug: each string becomes one paragraph. Aim for 150–300 words.
 */
export const toolContent: Record<string, { heading: string; paragraphs: string[]; steps?: string[] }> = {
  'image-compressor': {
    steps: [
      'Drop a JPEG, PNG or WebP image into the box, or press “Choose file”.',
      'Move the quality slider — 60–80% is usually a good balance — and press “Compress image”.',
      'Compare the size before and after, then press “Download”.',
    ],
    heading: 'Compress images without uploading them',
    paragraphs: [
      'Large photos slow down websites, fill up email attachments and get rejected by upload forms that set a size limit. This free image compressor makes JPG, PNG and WebP files smaller directly in your browser, so your pictures never leave your device.',
      'Choose a file, move the quality slider and compare the original size with the new one before you download. A quality setting between 60% and 80% usually gives a much smaller file with no difference you can see on screen. If a form asks for an image under a certain size, such as 100 KB, lower the quality step by step, or resize the image first with the image resizer — fewer pixels shrink a file faster than anything else.',
      'Because everything runs locally, the tool is fast even on large files, works on phones and keeps private photos private. There is no sign-up, no watermark and no daily limit.',
    ],
  },
  'image-resizer': {
    steps: [
      'Choose an image; its current width and height are filled in for you.',
      'Type the new width or height. Keep “Keep proportions” on to avoid stretching.',
      'Press “Resize image” and download the result.',
    ],
    heading: 'Resize photos to exact pixel sizes',
    paragraphs: [
      'Every platform wants a different size: a website banner, a passport photo form, a social media post or an online application. This free image resizer lets you set the exact width and height in pixels and download the result in seconds.',
      'Enter the new dimensions, preview the image and save it. Keeping the same aspect ratio as the original avoids stretched or squashed pictures; if you need a different shape, crop the photo first with the image cropper. Making an image smaller in pixels is also the quickest way to reduce its file size, which helps when a form has a KB limit.',
      'The resizing happens in your browser with no upload, so it is quick, private and works on mobile. It is free with no account needed.',
    ],
  },
  'image-converter': {
    steps: [
      'Choose the image you want to convert.',
      'Pick the output format: WebP, PNG or JPG.',
      'Convert and download the new file.',
    ],
    heading: 'Convert between JPG, PNG and WebP',
    paragraphs: [
      'Different formats suit different jobs. JPG is best for photographs, PNG keeps sharp edges and transparent backgrounds, and WebP gives smaller files for websites while keeping good quality. This converter changes an image from one format to another in one step.',
      'Pick your image, choose the format you need and download the converted file. Converting a PNG photo to JPG or WebP often cuts its size dramatically. Note that JPG does not support transparency, so transparent areas become a solid background — keep PNG or WebP if you need them.',
      'All conversion happens on your own device. Nothing is uploaded, there is no sign-up and the tool works the same on desktop and mobile browsers.',
    ],
  },
  'pdf-merge': {
    heading: 'Combine several PDFs into one file',
    paragraphs: [
      'Sending one tidy document is easier than attaching five separate files. The PDF merge tool joins PDFs into a single file in the order you choose — useful for job applications, invoices, scanned pages, assignments and reports.',
      'Select all your PDFs at once (or drag them in), check the page count shown for each file, and use the arrows to put them in order. Password-protected files are flagged so you can unlock them first with the PDF Unlocker. To make the merged file smaller for email, run it through the PDF compressor afterwards.',
      'Merging happens entirely in your browser, so confidential documents are never uploaded. It is free, needs no account and adds no watermark.',
    ],
    steps: [
      'Choose or drag in two or more PDF files.',
      'Check the page count of each file and fix the order with the ↑ and ↓ buttons.',
      'Remove any file you do not need with ✕.',
      'Press “Merge” — the combined PDF downloads straight away.',
    ],
  },

  'json-formatter': {
    steps: [
      'Paste your JSON into the input box.',
      'Press “Format” to indent it, or “Minify” to shrink it to one line.',
      'If the JSON is invalid, read the error message, fix the text and try again.',
    ],
    heading: 'Format, validate and beautify JSON',
    paragraphs: [
      'API responses and config files often arrive as one long unreadable line. The JSON formatter turns that into clean, indented JSON you can read at a glance, and tells you when the JSON is invalid so you can find the problem quickly.',
      'Paste your JSON, format it with readable indentation or minify it into a single compact line for production. Common errors include trailing commas, single quotes instead of double quotes and missing brackets; the validator points out that the input cannot be parsed so you know where to look.',
      'Your data is processed locally in the browser and is never sent anywhere, which matters when JSON contains tokens, keys or customer data. Need types? Paste the same JSON into the JSON to TypeScript tool.',
    ],
  },
  'qr-code-generator': {
    heading: 'Create QR codes for links, text and more',
    paragraphs: [
      'QR codes let people open a link, read a message or save details just by pointing a phone camera. This free QR code generator turns any URL or text into a code you can download and print on posters, menus, business cards, packaging or slides.',
      'Type or paste your link, check the preview and download the image. Keep links short where you can — shorter content makes a simpler, easier-to-scan code. Always test the printed code with a phone before printing many copies, and leave a white margin around it so cameras can find it.',
      'Codes are generated in your browser, never expire and carry no tracking or watermark. To read a code instead, use the QR code scanner.',
    ],
  },
  'word-counter': {
    steps: [
      'Type or paste your text into the box.',
      'Words, characters, sentences, paragraphs and reading time update as you type.',
    ],
    heading: 'Count words, characters and reading time',
    paragraphs: [
      'Essays, social posts, meta descriptions and job applications often have strict limits. The word counter shows words, characters, sentences and paragraphs as you type, so you always know where you stand.',
      'Paste or type your text and the counts update instantly. Character counts with and without spaces help with platforms that limit characters, while the word count suits essays and articles. For search results, aim for page titles around 50–60 characters and meta descriptions around 150–160.',
      'Your writing stays on your device — nothing is uploaded or saved by us. It is free to use as often as you like, on any device.',
    ],
  },
  'base64-converter': {
    steps: [
      'Paste plain text to encode, or a Base64 string to decode.',
      'Press “Encode” or “Decode”.',
      'Copy the result.',
    ],
    heading: 'Encode and decode Base64 online',
    paragraphs: [
      'Base64 turns binary data or text into plain characters that can travel safely in JSON, URLs, emails and HTML. Developers use it for data URIs, API payloads, basic authentication headers and debugging encoded strings.',
      'Paste text to encode it into Base64, or paste a Base64 string to decode it back into readable text. Remember that Base64 is an encoding, not encryption: anyone can decode it, so never use it to hide passwords or secrets. To embed an image directly in HTML or CSS, use the image to Base64 tool.',
      'Encoding and decoding run entirely in your browser, so tokens and private data are not sent to any server. Free, fast and no sign-up.',
    ],
  },
  'password-generator': {
    heading: 'Generate strong, random passwords',
    paragraphs: [
      'Reusing simple passwords is one of the most common ways accounts get broken into. This password generator creates long, random passwords using your browser’s secure random number source, so every password is unpredictable.',
      'Choose the length and which characters to include, then copy the result. A length of 16 characters or more with letters, numbers and symbols is a strong choice for most accounts. Use a different password for every site and keep them in a password manager so you do not have to remember them.',
      'Passwords are created on your device and are never sent, stored or logged by us. To test a password you already use, try the password strength checker.',
    ],
  },
  'scientific-calculator': {
    heading: 'A full scientific calculator in your browser',
    paragraphs: [
      'Students, engineers and anyone checking a formula need more than basic arithmetic. This free scientific calculator handles trigonometry, logarithms, powers, roots, factorials, π, e and nested brackets, with a keypad and direct typing.',
      'Type an expression such as 2^10 + sqrt(81) or sin(30) and the answer appears as you type; press = or Enter to keep it in the history. Switch between degrees and radians for trigonometry, and use Ans to reuse your last answer. Errors such as a missing bracket are explained in plain words.',
      'Expressions are worked out by our own math engine rather than run as code, which keeps the calculator safe. It works offline once loaded and fits phone screens comfortably.',
    ],
  },
  'pdf-split': {
    heading: 'Split a PDF into single pages',
    paragraphs: [
      'Sometimes you only need one page of a long PDF: a signed form, one invoice from a batch, or a single chapter to send to a colleague. This PDF splitter turns every page of your file into its own PDF, ready to download.',
      'Choose the PDF and the tool reads it in your browser, then gives you one file per page. Keep the pages you need and ignore the rest. If you want some pages back together afterwards, put them through the PDF merge tool in the order you like.',
      'Your document is never uploaded, so it is a safe choice for contracts, bank statements and ID scans. It works on phones and computers, with no sign-up and no watermark.',
    ],
  },
  'pdf-compressor': {
    heading: 'Make a PDF smaller for email and upload forms',
    paragraphs: [
      'Scanned documents and PDFs full of photos are often too large to email or to upload to a job portal or government form. This PDF compressor rebuilds each page at a lower image quality, which can shrink scan-heavy files a lot.',
      'Pick a quality level, compress, and compare the size before and after. A medium setting is usually still easy to read. Because pages are re-rendered as images, text in the compressed file can no longer be selected or searched, so keep your original as well.',
      'Compression happens on your own device. Nothing is uploaded, there is no file-size paywall and you do not need an account.',
    ],
  },
  'image-to-pdf-converter': {
    heading: 'Turn photos into one PDF',
    paragraphs: [
      'Many forms and offices ask for a single PDF, while your documents are photos on your phone. This converter places your images into one PDF, one image per page, so you can send them as a single file.',
      'Select several images at once — JPG, PNG, WebP and most other formats work, because anything that is not JPG or PNG is converted automatically. Photograph documents in good light and crop them first with the image cropper for the cleanest result.',
      'The PDF is built in your browser, so receipts, certificates and ID cards stay private. Free, with no sign-up and no watermark.',
    ],
    steps: [
      'Choose or drag in your images.',
      'Remove any picture you do not want with ✕.',
      'Press “Create PDF”.',
      'The PDF downloads with one image per page, in the order shown.',
    ],
  },

  'pdf-to-image-converter': {
    heading: 'Save PDF pages as images',
    paragraphs: [
      'A PDF page is hard to share on social media, paste into a slide or attach where only pictures are accepted. This converter renders each page of a PDF as a PNG image that you can download.',
      'Choose a PDF and every page appears as a picture you can save. PNG keeps text sharp, which suits documents, charts and screenshots. If an image is too large for where you need it, run it through the image compressor or the image resizer afterwards.',
      'Pages are drawn in your browser using the open-source PDF.js engine, so the document never leaves your device. No account and no limits set by us.',
    ],
  },
  'background-remover': {
    heading: 'Remove photo backgrounds with AI, privately',
    paragraphs: [
      'Product listings, passport and CV photos, profile pictures and thumbnails all look cleaner without a busy background. This AI background remover separates the person, product or pet from everything behind it and gives you a transparent PNG — or a clean white or coloured background.',
      'Best quality uses an open U²-Net model (about 44 MB) that works on any clear subject; Fast uses a 5 MB version that loads quickly on phones. Both run inside your browser with ONNX Runtime, are downloaded once from CraftSprint and then kept by your browser, so the next photo is processed faster. Logos and graphics are recognised automatically and their background colour is removed exactly. Your photo itself is never uploaded anywhere.',
      'Clear photos give the best edges: good light and a subject that stands out from the background. Fine hair against a similar colour can come out soft. For logos or graphics on one flat colour, the Solid Colour Background Remover gives pixel-exact edges.',
    ],
    steps: [
      'Drop or choose a photo (JPG, PNG or WebP).',
      'Press “Remove background” and wait a few seconds — the first time also downloads the AI model.',
      'Check the result next to the original.',
      'Choose Transparent, White or any colour, then download.',
    ],
  },

  'image-cropper': {
    heading: 'Crop and rotate images online',
    paragraphs: [
      'A good crop removes distractions and fits a picture to the shape a website, profile or form expects. This image cropper lets you cut out exactly the area you want and rotate the image if it was taken sideways.',
      'Load an image, choose the area to keep, rotate if needed and download the result. For an exact pixel size afterwards, use the image resizer; to make the file smaller, use the image compressor.',
      'Your photo is edited on your own device and is never uploaded. The tool is free and works on phones and computers.',
    ],
  },
  'qr-code-scanner': {
    heading: 'Read a QR code from a picture',
    paragraphs: [
      'QR codes often arrive as screenshots or photos: a payment code in a chat, a Wi-Fi code on a poster, or a link on a printed flyer. This scanner reads the code from an image on your device and shows what it contains.',
      'Choose the image and the decoded text or link appears instantly, ready to copy. Check a link before you open it, because QR codes can point anywhere. If no code is found, crop the picture closer to the code or take a sharper photo.',
      'Decoding runs in your browser with the open-source jsQR library, so the image is never uploaded. To make your own codes, use the QR code generator.',
    ],
  },
  'age-calculator': {
    heading: 'Find your exact age in years, months and days',
    paragraphs: [
      'Forms, exams and job applications often ask for your exact age on a particular date. This age calculator works it out in years, months and days, and also shows the total days you have lived and how long it is until your next birthday.',
      'Enter your date of birth and, if you need it, a different date to measure to, such as an application deadline. Leap years and months of different lengths are handled for you.',
      'The calculation runs in your browser and your birth date is not stored or sent anywhere. It is free and works offline once the page has loaded.',
    ],
  },
  'bmi-calculator': {
    heading: 'Check your body mass index',
    paragraphs: [
      'Body mass index (BMI) is a quick screening number that compares weight with height. This calculator works in centimetres and kilograms or feet and pounds, and shows the weight range that counts as healthy for your height.',
      'Enter your height and weight to see your BMI and its category: underweight, healthy, overweight or obese. BMI does not measure body fat directly and can mislead for athletes, older adults and during pregnancy, so treat it as a starting point and talk to a doctor about your own health.',
      'Your numbers stay in your browser and are not saved. The tool is free with no sign-up.',
    ],
  },
  'loan-emi-calculator': {
    heading: 'Work out your monthly loan instalment',
    paragraphs: [
      'Before taking a car loan, home loan or personal loan, it helps to know the monthly payment and how much interest you will pay in total. This EMI calculator shows both, along with a year-by-year repayment schedule.',
      'Enter the loan amount, the yearly interest rate and the number of years. The monthly instalment, total interest and total repayment update instantly, in any currency. Try a shorter term or a larger down payment to see how much interest you can save.',
      'The result is an estimate: banks may add fees, insurance or a different rate type, so confirm the final figures with your lender. All calculations happen in your browser.',
    ],
  },
  'zakat-calculator': {
    heading: 'Calculate the zakat due on your savings',
    paragraphs: [
      'Zakat is 2.5% of zakatable wealth that is above the nisab and has been held for a lunar year. This calculator adds up your cash, gold, silver, investments and business stock, subtracts debts due now, and shows the amount due.',
      "Enter today's gold or silver price for your city to set the nisab, then fill in each type of asset. If your total is below the nisab, no zakat is due. Scholars differ on details such as jewellery and long-term debts, so ask a scholar you trust when unsure.",
      'Your figures are never saved or sent anywhere; the calculation runs entirely in your browser.',
    ],
  },
  'percentage-calculator': {
    heading: 'Three percentage calculations in one place',
    paragraphs: [
      'Percentages come up everywhere: discounts, exam marks, tax, salary increases and price changes. This calculator answers the three common questions: what is X% of a number, what percentage one number is of another, and the percentage change between two values.',
      'Pick the question, type the numbers and the answer appears as you type. A price rising from 200 to 250, for example, is a 25% increase. For shopping discounts and sales tax, the discount and VAT calculators give more detail.',
      'It is free, works on any device and runs entirely in your browser.',
    ],
  },
  'unit-converter': {
    heading: 'Convert length, weight and temperature',
    paragraphs: [
      'Recipes, travel, schoolwork and online shopping often mix metric and imperial units. This unit converter changes length, weight and temperature values instantly, such as centimetres to inches, kilograms to pounds and Celsius to Fahrenheit.',
      'Choose the type of unit, enter a value and pick the units to convert between. The result updates as you type, so you can compare several values quickly.',
      'The converter runs in your browser and works offline once the page has loaded. Free, with no sign-up.',
    ],
  },
  'currency-converter': {
    heading: 'Convert currencies with current rates',
    paragraphs: [
      'Whether you are shopping from an overseas store, sending money home or pricing a freelance job, you need a quick idea of what an amount is worth in another currency. This converter uses exchange rates that are refreshed about once an hour.',
      'Choose the two currencies, enter an amount and see the converted value with the date of the rate. Banks and money-transfer services add their own margin and fees, so the amount you actually receive will usually be a little lower.',
      'Rates come from a public exchange-rate service; your amounts are not stored. Free, with no sign-up.',
    ],
  },
  'case-converter': {
    steps: [
      'Paste your text into the box.',
      'Click the style you need: UPPERCASE, lowercase, Title Case, Sentence case, camelCase or snake_case.',
      'Copy the converted text.',
    ],
    heading: 'Change text to UPPERCASE, Title Case and more',
    paragraphs: [
      'Text pasted from emails, PDFs or old documents is often in the wrong case. This case converter switches any text to UPPERCASE, lowercase, Title Case or Sentence case, and to camelCase or snake_case for code.',
      'Paste your text, click the style you need and copy the result. Title Case suits headings, Sentence case suits normal writing, and camelCase or snake_case suit variable and file names.',
      'Your text is changed in your browser and never uploaded. It is free and works on phones as well as computers.',
    ],
  },
  'text-to-speech': {
    heading: 'Hear any text read aloud',
    paragraphs: [
      'Listening is useful for proofreading, learning pronunciation, resting your eyes or making content easier to access. This tool reads text aloud using the voices built into your device and browser.',
      'Paste the text, choose a voice, speed and pitch, and press play. The voices available depend on your system: phones and newer browsers usually offer more natural voices and more languages, including some for Urdu, Hindi and Arabic.',
      'Speech is produced by your own browser, so your text is not sent to us. The tool is free with no sign-up.',
    ],
  },
  'video-to-gif-converter': {
    heading: 'Turn a short video clip into a GIF',
    paragraphs: [
      'GIFs play automatically almost everywhere, which makes them handy for showing a quick demo, a reaction or a product in motion. This converter turns a short section of a video into an animated GIF.',
      'Choose a video, set the start time, the length and the size, and create the GIF. Keep clips short and small: a few seconds at a modest width gives a file that loads quickly. If the GIF is still too large, run it through the GIF optimizer.',
      'The video is processed in your browser and is never uploaded. Free, with no watermark.',
    ],
  },
  'audio-trimmer': {
    heading: 'Cut the part of an audio file you need',
    paragraphs: [
      'Ringtones, voice notes, podcast clips and sound effects often need only a small part of a longer recording. This audio trimmer lets you listen, choose a start and end point, and download just that section.',
      'Save the clip as MP3 (small, plays everywhere) or WAV (lossless, larger). MP3, WAV, M4A/AAC and OGG files can be opened — anything your browser can play.',
      'The audio is decoded, cut and encoded in your browser, so your recording stays private. Free, with no sign-up.',
    ],
    steps: [
      'Choose an audio file and play it to find the part you want.',
      'Move the Start and End sliders.',
      'Pick MP3 or WAV.',
      'Press “Cut & export”, listen to the result and download.',
    ],
  },

  'resume-builder': {
    heading: 'Make a clean, printable resume',
    paragraphs: [
      'A tidy one-page resume makes it easier for employers to find what matters. This resume builder gives you a clean layout: fill in your contact details, summary, experience, education and skills, and see the result as you type.',
      'When it looks right, print it or choose Save as PDF in the print window. Keep each bullet short and start it with an action word, put your most recent role first, and include results with numbers wherever you can.',
      'Your details are not uploaded; the resume is built in your browser. It is free, with no sign-up and no watermark.',
    ],
  },
  'invoice-generator': {
    heading: 'Create a simple invoice in minutes',
    paragraphs: [
      'Freelancers and small businesses need clear invoices to get paid on time. This generator lets you add your details, your client, line items with quantities and prices, and it totals everything for you.',
      'Fill in the invoice, check the totals and print it or save it as a PDF from the print window. Include an invoice number, a due date and your payment details so the client knows exactly how and when to pay.',
      'Invoices are created in your browser and nothing is stored on our side, so keep a copy of every PDF you send. Free, with no watermark.',
    ],
  },
  'jwt-decoder': {
    heading: 'Read the contents of a JSON Web Token',
    paragraphs: [
      'JSON Web Tokens (JWTs) carry login and permission data between apps. This decoder splits a token into its header and payload and shows them as readable JSON, which helps when debugging authentication.',
      'Paste a token to see the algorithm, the claims and, where present, the expiry time. Decoding is not the same as verifying: this tool does not check the signature, so never trust a token just because it decodes.',
      'Tokens are decoded in your browser and are never sent to a server. Even so, avoid pasting live production tokens into any website.',
    ],
  },
  'regex-tester': {
    heading: 'Test regular expressions with live matches',
    paragraphs: [
      'Regular expressions are powerful but easy to get wrong. This tester runs your pattern against sample text and shows every match and capture group, so you can fix the pattern before it goes into your code.',
      'Type the pattern, choose flags such as global or case-insensitive, and paste sample text. Matches are listed as you type. The tool uses the JavaScript regex engine, which differs slightly from engines in some other languages.',
      'Everything runs in your browser. Free, with no sign-up.',
    ],
  },
  'uuid-generator': {
    heading: 'Generate random UUIDs',
    paragraphs: [
      'UUIDs are 128-bit identifiers used as database keys, file names and request IDs because they are practically unique without any central counter. This generator creates random version 4 UUIDs.',
      "Choose how many you need and copy them one at a time or all together. They come from your browser's secure random number generator, which is suitable for identifiers but should not be used as passwords or secret keys.",
      'Nothing is sent to a server. The tool is free and works offline once loaded.',
    ],
  },
  'hash-generator': {
    heading: 'Create SHA hashes of any text',
    paragraphs: [
      'A hash turns text into a fixed-length fingerprint. Developers use hashes to check that data has not changed and to compare values without storing the original. This tool creates SHA-1, SHA-256, SHA-384 and SHA-512 hashes.',
      'Type or paste your text and pick the algorithm; the hash updates instantly. Use SHA-256 or stronger for new work, since SHA-1 is considered weak. Plain hashes are not suitable for storing passwords; password storage needs a slow algorithm such as bcrypt or Argon2.',
      "Hashing uses your browser's built-in Web Crypto, so your text never leaves your device.",
    ],
  },
  'timestamp-converter': {
    heading: 'Convert Unix timestamps and dates',
    paragraphs: [
      'Logs, databases and APIs often store time as a Unix timestamp: the number of seconds since 1 January 1970 (UTC). This converter turns a timestamp into a readable date and turns a date back into a timestamp.',
      'Paste a timestamp to see the date in UTC and in your local time zone, or pick a date to get its timestamp. A 13-digit number is usually in milliseconds rather than seconds.',
      'Conversion happens in your browser. Free, with no sign-up.',
    ],
  },
  'color-palette-generator': {
    heading: 'Build colour palettes from one colour',
    paragraphs: [
      'A consistent palette makes a website, logo or presentation look planned. This generator starts from one base colour and builds complementary, analogous and triadic palettes based on colour theory.',
      'Pick a base colour and copy the HEX codes you like. Use one main colour, one accent and neutrals for most designs, and check that text has enough contrast with the colour contrast checker.',
      'The palettes are generated in your browser. Free, with no sign-up.',
    ],
  },
  'favicon-generator': {
    heading: 'Make a full favicon set from one image',
    paragraphs: [
      'A favicon is the small icon shown in browser tabs, bookmarks and phone home screens. Different devices need different sizes, and this generator creates them all from a single image and packs them into a ZIP file.',
      "Start with a square image of at least 512 × 512 pixels with a simple shape, since fine detail disappears at small sizes. Upload it, download the ZIP and place the files in your website's public folder.",
      'The icons are drawn in your browser, so your logo is never uploaded. Free, with no watermark.',
    ],
  },
  'gpa-calculator': {
    heading: 'Calculate your GPA on a 4.0 scale',
    paragraphs: [
      'Your grade point average weights each course by its credit hours, so a four-credit course counts more than a one-credit course. This calculator works out your GPA on the common 4.0 scale.',
      "Add each course with its credit hours and letter grade, and the GPA updates instantly. Universities use slightly different grade points (for example for A- or B+), so check your own institution's scale before relying on the result.",
      'Your grades stay in your browser and are not saved. Free, with no sign-up.',
    ],
  },
  'compound-interest-calculator': {
    heading: 'See how savings grow with compound interest',
    paragraphs: [
      'Compound interest means you earn returns on your earlier returns, so money grows faster the longer it is left alone. This calculator shows how a starting amount and regular monthly additions could grow over time.',
      'Enter the starting amount, the monthly contribution, an expected yearly return and the number of years. A year-by-year table shows how much you put in and how much came from growth. Real returns go up and down and are not guaranteed, so test a few different rates.',
      'The calculation runs in your browser. It is an estimate for planning, not financial advice.',
    ],
  },
  'typing-speed-test': {
    heading: 'Measure your typing speed and accuracy',
    paragraphs: [
      'Typing speed matters for office work, exams, programming and data entry. This test measures your words per minute (WPM) and your accuracy over a short timed passage.',
      'Start typing when you are ready and the timer begins with your first key press. Aim for accuracy first: speed comes with practice, and fixing mistakes costs more time than typing steadily. Around 40 WPM is a common average; many office jobs look for 50 or more.',
      'The test runs in your browser and your results are not uploaded. Free, with no sign-up.',
    ],
  },
  'html-minifier': {
    steps: [
      'Paste your HTML code.',
      'Press the minify button to remove comments, extra spaces and line breaks.',
      'Copy the smaller HTML and compare the size saved.',
    ],
    heading: 'Make HTML smaller for faster pages',
    paragraphs: [
      'Minifying HTML removes characters that browsers do not need — comments, indentation and extra line breaks — so pages download a little faster. Paste your code, minify it and see how much smaller it becomes.',
      'Keep the original, readable file for editing and publish the minified version. For styles and scripts, use the CSS and JavaScript minifiers.',
    ],
  },
  'line-break-remover': {
    steps: [
      'Paste text copied from a PDF, email or website.',
      'Choose whether to keep paragraphs and remove extra spaces.',
      'Copy the clean text from the second box.',
    ],
    heading: 'Fix text copied from PDFs and emails',
    paragraphs: [
      'Text copied from a PDF or an email often breaks in the middle of sentences, because each visual line on the page ends with a line break. Pasting that into a document, a form or a chat looks messy.',
      'This tool joins those broken lines back into normal sentences. Keep “Keep paragraphs” on to preserve blank lines between paragraphs, and use “Remove extra spaces” to tidy double spaces. Everything happens in your browser, so nothing you paste is uploaded.',
    ],
  },
  'pdf-to-word': {
    heading: 'Turn a PDF into an editable Word document',
    paragraphs: [
      'When you need to change the text of a PDF — a CV, a letter or a report — copying it by hand loses paragraphs and takes time. This converter reads the text of every page and builds an editable Word (.docx) file with the same paragraphs and page breaks.',
      'It works with PDFs that contain real text, such as files exported from Word or Google Docs. Scanned documents are pictures of text, so the tool tells you when no text is found. Complex layouts, columns and tables are kept as plain paragraphs that you can format again in Word.',
      'Everything happens in your browser, so private documents stay on your device.',
    ],
    steps: [
      'Choose a PDF.',
      'Press “Convert to Word”.',
      'Open the downloaded .docx in Word, Google Docs or LibreOffice and edit.',
    ],
  },
  'heic-to-jpg': {
    heading: 'Open iPhone photos anywhere',
    paragraphs: [
      'iPhones save photos as HEIC to save space, but many Windows apps, websites and forms do not accept that format. This converter turns HEIC and HEIF photos into JPG or PNG so they open everywhere.',
      'JPG is saved at 90% quality, which looks the same to the eye and keeps the file small. Choose PNG when you need a lossless copy for editing.',
      'The conversion runs in your browser — your photos are never uploaded.',
    ],
    steps: [
      'Choose a .heic or .heif photo.',
      'Pick JPG or PNG.',
      'Press “Convert” and download the new file.',
    ],
  },
  'video-compressor': {
    heading: 'Make videos small enough to send',
    paragraphs: [
      'Long videos are often too big for email, WhatsApp or upload forms. This compressor re-encodes a video at a lower resolution and bitrate so the file becomes much smaller while staying clear enough to watch.',
      'Choose 480p for the smallest files, 720p for a good balance or 1080p to keep more detail. The result is a WebM video, which plays in modern browsers and uploads to YouTube and most websites. Because the video is played once while it is re-encoded, a two-minute clip takes about two minutes.',
      'Your video never leaves your device.',
    ],
    steps: [
      'Choose a video file.',
      'Pick a resolution and quality.',
      'Press “Compress video” and keep the tab open until it finishes.',
      'Download the smaller WebM file.',
    ],
  },
  'image-studio': {
    heading: 'Resize, convert and compress many images at once',
    paragraphs: [
      'Preparing photos for Instagram, YouTube, a passport application or an online shop usually means resizing, converting and compressing each one by hand. Image Studio does all three for up to 50 images in one go.',
      'Pick a size preset — Instagram post or story, YouTube thumbnail, LinkedIn, Facebook cover, passport photo (35×45 mm at 300 dpi) or online store — choose Fill (crop to size) or Fit (add a background), then WebP, JPG or PNG and the quality. You see the size of every file before and after.',
      'Images are processed in your browser and the ZIP is created on your device.',
    ],
    steps: [
      'Choose up to 50 images.',
      'Pick a size preset, Fill or Fit, format and quality.',
      'Press “Process”.',
      'Download single files or everything as a ZIP.',
    ],
  },
  'pakistan-salary-tax-calculator': {
    heading: 'Salary income tax in Pakistan for 2026-27',
    paragraphs: [
      'Salaried people in Pakistan pay income tax by slabs set in the yearly Finance Act. This calculator applies the 2026-27 slabs (tax year 2027) to your monthly salary and shows your monthly tax, yearly tax and take-home pay. The 2025-26 slabs are included so you can compare.',
      'For 2026-27, income up to Rs 600,000 a year is tax-free; above that the rates step up through 1%, 11%, 20%, 25%, 29% and 32% to 35% on income above Rs 7,000,000, with the fixed amounts set in the law.',
      'The result is an estimate for salaried individuals. Allowances, exemptions and adjustments can change your final tax — confirm with FBR or a tax adviser before filing.',
    ],
    steps: [
      'Choose the tax year.',
      'Enter your gross monthly salary in rupees.',
      'Read your monthly tax, take-home pay and effective tax rate.',
    ],
  },
};
