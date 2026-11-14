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

  // ---- Added for SEO/AEO: tools that had no long-form content ----
  'text-diff-checker': {
    steps: [
      'Paste the original text into the left box.',
      'Paste the new version into the right box.',
      'Read the result: added lines, removed lines and unchanged lines are marked clearly.',
    ],
    heading: 'Compare two texts and spot every change',
    paragraphs: [
      'When a contract, an essay, a config file or a piece of code changes, it is easy to miss what actually moved. This free text diff checker compares two versions line by line and highlights exactly which lines were added, removed or left the same.',
      'It works well for documents, code, lists and paragraphs: paste the old text on one side, the new text on the other, and read the differences at a glance instead of scanning both copies by eye. Because the comparison is line by line, putting each sentence or item on its own line gives the clearest result.',
      'Everything runs in your browser, so private drafts and source code are never uploaded. There is no sign-up and no limit on how often you compare.',
    ],
  },
  'html-to-markdown-converter': {
    steps: [
      'Paste your HTML into the input box.',
      'Press “Convert to Markdown”.',
      'Copy the Markdown and paste it into your editor, docs or CMS.',
    ],
    heading: 'Turn HTML into clean Markdown',
    paragraphs: [
      'Moving content from a website, an email or a CMS into a Markdown-based tool — a README, a static site, Notion-style docs or a new blog platform — usually means rewriting the formatting by hand. This converter turns HTML markup into clean Markdown source in one click.',
      'Headings, lists, links, images, tables and code blocks are converted to their Markdown equivalents, so the structure of the page survives the move. Paste the HTML, convert, then copy the result. If you need to go the other way, use the Markdown to HTML converter.',
      'The conversion happens on your device, so unpublished pages and internal documents are not uploaded anywhere. It is free and needs no account.',
    ],
  },
  'markdown-to-html-converter': {
    steps: [
      'Write or paste Markdown into the input box.',
      'Press convert to generate the HTML.',
      'Copy the HTML source into your CMS, template or email.',
    ],
    heading: 'Convert Markdown to raw HTML',
    paragraphs: [
      'Markdown is quick to write, but many website builders, email templates and CMS fields only accept HTML. This tool converts Markdown source into raw HTML markup that you can copy anywhere.',
      'Headings, emphasis, lists, links, code and tables become the matching HTML tags. The output is the HTML source itself, not a rendered page — if you want to see how the Markdown looks while you write, use the Markdown Previewer instead.',
      'Conversion runs locally in your browser with no upload, no sign-up and no limits.',
    ],
  },
  'markdown-previewer': {
    steps: [
      'Type or paste Markdown in the editor.',
      'Watch the rendered preview update next to it as you write.',
      'Copy the Markdown when it looks right.',
    ],
    heading: 'Write Markdown with a live preview',
    paragraphs: [
      'Writing a README, documentation page or blog post in Markdown is faster when you can see the result as you type. This previewer shows your Markdown and the rendered page side by side.',
      'Standard Markdown is supported, including headings, lists, links, code blocks and tables, so you can check formatting mistakes — a missing blank line, a broken table or an unclosed code block — before you publish.',
      'Parsing and rendering happen entirely in your browser, so drafts are never uploaded. It is free, needs no account and works on phones as well as computers.',
    ],
  },
  'json-to-csv-converter': {
    steps: [
      'Paste a JSON array of objects, for example an API response.',
      'Press convert to build the CSV table.',
      'Download the CSV and open it in Excel or Google Sheets.',
    ],
    heading: 'Convert JSON arrays into CSV spreadsheets',
    paragraphs: [
      'API responses and exports often arrive as JSON, but spreadsheets and reports need rows and columns. This converter turns a JSON array of objects into a CSV file you can open in Excel, Google Sheets or any database tool.',
      'Each object becomes one row and each field becomes a column. If your objects have different fields, the header includes every field found across all of them and missing values are left blank, so no data is dropped.',
      'The conversion happens in your browser, so customer records and internal data are not sent to a server. It is free, with no sign-up.',
    ],
  },
  'csv-to-json-converter': {
    steps: ['Paste CSV text that has a header row.', 'Press convert.', 'Copy or download the JSON.'],
    heading: 'Convert CSV data into clean JSON',
    paragraphs: [
      'Spreadsheets and exports are usually CSV, while apps, APIs and config files expect JSON. This converter reads CSV with a header row and turns every row into a JSON object, using the header names as keys.',
      'Quoted fields are handled properly, including values that contain commas or escaped quotes, which is where many quick scripts break. Paste the data, convert, and copy clean JSON ready for code or a mock API.',
      'Everything is processed in your browser with no upload, so it is safe for internal data. Free and no account needed.',
    ],
  },
  'json-to-typescript': {
    steps: [
      'Paste a JSON object, such as a sample API response.',
      'Generate the TypeScript interfaces.',
      'Copy them into your project and adjust names if needed.',
    ],
    heading: 'Generate TypeScript interfaces from JSON',
    paragraphs: [
      'Writing TypeScript types by hand for a large API response is slow and easy to get wrong. Paste a sample JSON object and this tool generates matching TypeScript interfaces in seconds.',
      'Nested objects become their own named interfaces and arrays are typed from their first item, so the result mirrors the shape of your data. Review optional fields and union types afterwards, because a single sample cannot show every possible value.',
      'The JSON is processed locally in your browser and never sent to a server, which matters when samples contain real tokens or customer data. Free, no sign-up.',
    ],
  },
  'url-encoder-decoder': {
    steps: ['Paste the text or URL you want to convert.', 'Choose Encode or Decode.', 'Copy the result.'],
    heading: 'Encode and decode URL text',
    paragraphs: [
      'Spaces, ampersands, slashes and non-English characters can break a link when they are placed inside a URL. URL encoding (percent-encoding) replaces them with safe codes like %20, and decoding turns them back into readable text.',
      'Use it for query parameters, form values, redirect links, UTM tags or any text with special characters that needs to go into a URL. Decoding is handy when you receive a long encoded link and want to read what it actually contains.',
      'Encoding and decoding happen instantly in your browser, with no upload and no account.',
    ],
  },
  'svg-to-png-converter': {
    steps: ['Choose an SVG file.', 'Set the width you want for the PNG.', 'Convert and download the PNG.'],
    heading: 'Convert SVG files to PNG images',
    paragraphs: [
      'SVG is perfect for logos and icons on the web, but many apps, social networks, documents and email clients only accept PNG or JPG. This converter turns an SVG file into a PNG at the width you choose.',
      'Because SVG is a vector format, you can pick a large width and still get a sharp PNG — useful for app icons, presentations or print-ready graphics. Most standard SVG files work; SVGs that reference external images or fonts may not render exactly as expected.',
      'The conversion happens on your device with no upload. It is free and needs no sign-up.',
    ],
  },
  'png-to-svg-converter': {
    steps: ['Choose a PNG or JPG image.', 'Generate the SVG wrapper.', 'Download the SVG file.'],
    heading: 'Wrap a PNG or JPG inside an SVG file',
    paragraphs: [
      'Some tools, uploaders and design systems only accept SVG files. This tool places your raster image inside an SVG container so it can be used wherever an .svg file is required.',
      'Important: this does not trace your picture into true vector shapes, so it will not become infinitely scalable. It embeds the original image inside the SVG. For real vector tracing, a design tool such as Inkscape or Illustrator is needed.',
      'The file is processed in your browser, never uploaded, and the tool is free with no account.',
    ],
  },
  'image-to-base64': {
    steps: [
      'Choose an image file.',
      'The Base64 data URI is generated instantly.',
      'Copy it into your HTML, CSS or JSON.',
    ],
    heading: 'Convert images to Base64 data URIs',
    paragraphs: [
      'A Base64 data URI lets you embed an image directly inside HTML, CSS or JSON instead of loading it as a separate file. This tool converts any image into a ready-to-paste data URI.',
      'Data URIs are best for small icons, email templates and inline images where an extra network request is not worth it. Base64 makes files about one third larger, so for big photos a normal image file is usually faster.',
      'The image is read locally in your browser with the FileReader API and never uploaded. Free and no sign-up.',
    ],
  },
  'barcode-generator': {
    steps: [
      'Type the text or number to encode.',
      'Choose a format such as CODE128, EAN-13, EAN-8 or UPC.',
      'Download the barcode image and print or use it.',
    ],
    heading: 'Generate scannable barcodes',
    paragraphs: [
      'Barcodes are used on product labels, inventory, shipping and libraries. This generator creates scannable barcodes in common formats, including CODE128, EAN-13, EAN-8 and UPC.',
      'CODE128 accepts letters and numbers and suits internal labels and logistics. EAN and UPC are retail formats with fixed lengths and a check digit, so enter the right number of digits. Always test-scan a printed barcode before printing a large batch.',
      'Barcodes are generated in your browser with no upload, no watermark and no account.',
    ],
  },
  'receipt-maker': {
    steps: [
      'Fill in your business name, the customer and the items sold.',
      'Check the totals in the preview.',
      'Press Print receipt and choose “Save as PDF” to keep a copy.',
    ],
    heading: 'Make a simple sales receipt',
    paragraphs: [
      'Small shops, freelancers and home businesses often need a quick receipt without buying accounting software. This receipt maker creates a clean sales receipt you can print or save as a PDF.',
      'Add your business details, the items and prices, and the receipt totals itself. To save it, press Print receipt and pick “Save as PDF” in your browser’s print window — then you can email or WhatsApp it to the customer.',
      'Nothing is uploaded or stored on a server, it is free, and there is no watermark or account.',
    ],
  },
  'digital-signature-creator': {
    steps: [
      'Draw your signature with a mouse, trackpad or finger.',
      'Clear and redraw until you are happy.',
      'Download it as a transparent PNG.',
    ],
    heading: 'Draw your signature as a transparent PNG',
    paragraphs: [
      'Signing a PDF, a letter or a form often means printing, signing and scanning. This tool lets you draw your signature once and download it as a transparent PNG you can place on documents.',
      'Because the background is transparent, the signature sits cleanly on top of any document. A phone or tablet with a finger or stylus usually gives the most natural result.',
      'Your signature is drawn and saved entirely on your device and never uploaded. Note that an image of a signature is not the same as a certified digital signature; for legally binding e-signatures, check what your organisation requires.',
    ],
  },
  'text-to-pdf': {
    steps: ['Type or paste your text.', 'Generate the PDF.', 'Download the document.'],
    heading: 'Turn plain text into a PDF',
    paragraphs: [
      'Sometimes you just need a PDF from plain text — notes, a letter, a list or a log — without opening a word processor. This tool converts text into a downloadable PDF document.',
      'Long text is wrapped and split across pages automatically. It creates a simple plain-text PDF: bold text, images and complex layouts are not included. For documents with formatting, write them in a word processor and export to PDF there.',
      'The PDF is created in your browser with no upload, free and without an account.',
    ],
  },
  'pdf-text-extractor': {
    steps: [
      'Choose a PDF file.',
      'Wait a moment while the text is read.',
      'Copy or download the extracted text.',
    ],
    heading: 'Extract text from a PDF',
    paragraphs: [
      'Copying text out of a PDF page by page is slow and often messes up line breaks. This tool pulls the plain text out of a PDF so you can search it, quote it or reuse it.',
      'It extracts text that is already selectable in the PDF. Scanned PDFs are pictures of pages and have no text layer, so they need OCR instead. Formatting, images and layout are not kept — use PDF to Word if you need an editable document.',
      'The PDF is read locally in your browser and never uploaded, so it is safe for contracts and reports. Free, no sign-up.',
    ],
  },
  'pdf-password-protector': {
    steps: [
      'Choose the PDF you want to protect.',
      'Enter a strong password.',
      'Download the encrypted PDF and keep the password safe.',
    ],
    heading: 'Password-protect a PDF',
    paragraphs: [
      'Sending a salary slip, contract, ID scan or report by email or WhatsApp? Adding a password means only people who know it can open the file. This tool encrypts a PDF with a password of your choice.',
      'It uses AES-256 encryption, the strongest option in the current PDF standard. Share the password through a different channel than the file, and keep a copy of it — a lost password cannot be recovered.',
      'Encryption happens entirely in your browser, so the document never leaves your device. Free and no account needed.',
    ],
  },
  'pdf-password-unlocker': {
    steps: ['Choose the protected PDF.', 'Enter its current password.', 'Download an unlocked copy.'],
    heading: 'Remove a known password from a PDF',
    paragraphs: [
      'Bank statements and official documents often arrive password-protected, which is annoying when you need to open them repeatedly or combine them with other files. If you know the password, this tool saves an unlocked copy.',
      'It does not crack or guess passwords: you must enter the correct one. Use it only on documents you own or have permission to access.',
      'Decryption happens locally in your browser and the file is never uploaded. Free, with no sign-up.',
    ],
  },
  'password-strength-checker': {
    steps: [
      'Type a password to test.',
      'Read the strength rating.',
      'Follow the suggestions to make it stronger.',
    ],
    heading: 'Check how strong your password is',
    paragraphs: [
      'Weak and reused passwords are one of the most common ways accounts get taken over. This checker rates a password’s strength and gives specific tips to improve it.',
      'Length matters most: a long passphrase of several random words is both strong and easy to remember. Mix in numbers or symbols, avoid names and dates, and never reuse the same password on important accounts. A password manager makes this easy.',
      'The check runs entirely in your browser and the password is never sent anywhere. Free, no account.',
    ],
  },
  'lorem-ipsum-generator': {
    steps: [
      'Choose paragraphs, sentences or words.',
      'Set how many you need.',
      'Copy the placeholder text into your design.',
    ],
    heading: 'Generate placeholder text',
    paragraphs: [
      'Designers and developers need neutral filler text to see how a layout looks before the real content is ready. This generator creates Lorem Ipsum paragraphs, sentences or words in any amount.',
      'Lorem Ipsum is scrambled Latin-like text, so readers focus on spacing, fonts and layout instead of the words. Replace it with real copy before publishing — placeholder text left on a live page looks unfinished and can hurt SEO.',
      'Free, instant and generated in your browser with no sign-up.',
    ],
  },
  'meta-tag-generator': {
    steps: [
      'Enter your page title, description and URL.',
      'Add a share image for Open Graph and Twitter Cards.',
      'Copy the tags into the <head> of your page.',
    ],
    heading: 'Create SEO and social meta tags',
    paragraphs: [
      'Meta tags decide how a page appears in Google results and when it is shared on WhatsApp, Facebook, LinkedIn or X. This generator creates the title, description, Open Graph and Twitter Card tags for you.',
      'Keep titles around 50–60 characters and descriptions around 150–160 so they are not cut off. Use a 1200×630 image for social previews. Paste the generated tags inside the <head> section of your HTML.',
      'Free, no sign-up, and nothing you type leaves your browser.',
    ],
  },
  'robots-txt-generator': {
    steps: [
      'Choose which crawlers and paths to allow or block.',
      'Add your sitemap URL.',
      'Download the file and place it at the root of your domain.',
    ],
    heading: 'Generate a robots.txt file',
    paragraphs: [
      'A robots.txt file tells search engine crawlers which parts of your site they may crawl. This generator builds a correct file without memorising the syntax.',
      'Save it as robots.txt at the root of your domain, for example https://example.com/robots.txt, and include your sitemap address so search engines find every page. Be careful: blocking a path stops crawling but does not guarantee a page is removed from search results — use a noindex tag for that.',
      'Free, created in your browser, no account needed.',
    ],
  },
  'utm-link-builder': {
    steps: [
      'Enter the destination URL.',
      'Fill in source, medium and campaign name.',
      'Copy the finished link into your ad, email or post.',
    ],
    heading: 'Build UTM campaign links',
    paragraphs: [
      'Without tracking, it is hard to know which post, ad or email actually brought visitors to your site. UTM links add small utm_ parameters to a normal URL so Google Analytics and other tools can attribute each visit to the right campaign.',
      'At minimum set the source (for example instagram), the medium (social or email) and a campaign name. Keep naming consistent — always lowercase — so reports group traffic correctly.',
      'Links are built instantly in your browser. Free, no sign-up.',
    ],
  },
  'slug-generator': {
    steps: [
      'Type or paste a title.',
      'The slug is generated instantly.',
      'Copy it into your CMS or blog URL field.',
    ],
    heading: 'Create clean URL slugs',
    paragraphs: [
      'A clean URL slug makes pages easier to read, share and understand for both people and search engines. This tool turns any title into a short, lowercase, hyphen-separated slug.',
      'Special characters, extra spaces and punctuation are removed automatically. Keep slugs short and descriptive, include the main keyword, and avoid changing them after publishing — if you must, set up a redirect from the old address.',
      'Free, instant and private in your browser.',
    ],
  },
  'hashtag-generator': {
    steps: [
      'Type keywords or phrases, separated by commas or new lines.',
      'Generate the hashtags.',
      'Copy them into your caption.',
    ],
    heading: 'Turn keywords into clean hashtags',
    paragraphs: [
      'Formatting hashtags by hand — removing spaces, symbols and duplicates — is tedious. This tool turns a list of keywords into clean, ready-to-paste hashtags for Instagram, TikTok, X and LinkedIn.',
      'Duplicates are removed automatically, regardless of capital letters. Instagram allows up to 30 hashtags, but 5–15 relevant ones usually work better than the maximum; LinkedIn and X posts work best with just a few.',
      'Free, no sign-up, and everything runs in your browser.',
    ],
  },
  'aspect-ratio-calculator': {
    steps: [
      'Enter a width and height.',
      'See the simplified ratio, such as 16:9.',
      'Or pick a preset for Instagram, YouTube, TikTok, X or LinkedIn.',
    ],
    heading: 'Calculate aspect ratios and social sizes',
    paragraphs: [
      'Using the wrong shape for an image or video leads to automatic cropping or black bars. This calculator simplifies any resolution into its aspect ratio and lists the standard sizes for popular platforms.',
      'Common ratios: 16:9 for YouTube and landscape video, 9:16 for Reels, Shorts and TikTok, 4:5 for Instagram feed posts and 1:1 for square posts. Pick a preset to get exact pixel dimensions.',
      'Free, instant and works on any device without an account.',
    ],
  },
  'video-thumbnail-grabber': {
    steps: [
      'Choose a video file from your device.',
      'Scrub to the exact frame you want.',
      'Grab the frame and download it as an image.',
    ],
    heading: 'Grab any frame from a video as an image',
    paragraphs: [
      'Need a still from your own video for a thumbnail, a blog post or a presentation? This tool lets you scrub through a video and save any frame as an image.',
      'Pause on a clear, sharp moment — a frame with a visible face or the key action usually makes the best thumbnail. Then add text in a design tool if you need a YouTube-style thumbnail.',
      'The video is played and captured locally with your browser’s video and canvas features, so it is never uploaded. Free, no sign-up.',
    ],
  },
  'css-gradient-generator': {
    steps: [
      'Pick linear or radial.',
      'Choose colours and the angle or position.',
      'Copy the CSS background value.',
    ],
    heading: 'Design CSS gradients visually',
    paragraphs: [
      'Gradients add depth to buttons, backgrounds and hero sections, but writing the CSS by hand takes trial and error. This generator lets you design linear and radial gradients visually with a live preview.',
      'Choose your colours, adjust the direction, and copy the generated background value into any stylesheet, inline style or utility class. Subtle gradients between two related colours usually look more professional than strong rainbow blends.',
      'Free and runs entirely in your browser.',
    ],
  },
  'box-shadow-generator': {
    steps: [
      'Adjust offset, blur, spread and colour.',
      'Turn on inset for an inner shadow if you need one.',
      'Copy the CSS box-shadow value.',
    ],
    heading: 'Create CSS box shadows',
    paragraphs: [
      'Soft shadows make cards, buttons and modals look lifted and modern. This generator lets you fine-tune a box-shadow with a live preview and copy the CSS.',
      'Low opacity and a larger blur look more natural than dark, hard shadows. The tool creates one shadow layer; for layered shadows, copy several values and separate them with commas in your CSS.',
      'Free, instant and private in your browser.',
    ],
  },
  'color-converter': {
    steps: [
      'Enter a colour in HEX, RGB or HSL.',
      'See the other formats and a live swatch.',
      'Copy the format you need.',
    ],
    heading: 'Convert colours between HEX, RGB and HSL',
    paragraphs: [
      'Design tools, CSS and apps describe colours in different formats. This converter switches any colour between HEX, RGB and HSL and shows a preview swatch.',
      'HEX is common in web design, RGB in code and graphics apps, and HSL is the easiest to adjust because hue, saturation and lightness are separate. Use the Random colour button to explore new ideas.',
      'Conversion happens instantly in your browser with nothing stored. Free, no sign-up.',
    ],
  },
  'cron-parser': {
    steps: [
      'Paste a cron expression, for example */15 * * * *.',
      'Read the plain-English description.',
      'Adjust the expression until the schedule is right.',
    ],
    heading: 'Understand cron schedules in plain English',
    paragraphs: [
      'Cron expressions control scheduled jobs on servers, CI pipelines and cloud platforms, but five cryptic fields are easy to misread. This parser explains any standard cron expression in plain English.',
      'The five fields are minute, hour, day of month, month and day of week. For example, */15 * * * * means every 15 minutes. Check the time zone your server uses, because cron runs on server time.',
      'Free and runs in your browser.',
    ],
  },
  'plagiarism-checker': {
    steps: [
      'Paste your text.',
      'The tool creates an exact-match Google search link for each longer sentence.',
      'Open the links to see whether the same wording appears elsewhere.',
    ],
    heading: 'Check your text for copied sentences',
    paragraphs: [
      'Before you submit an essay or publish an article, it helps to know whether any sentence matches text already online. This helper prepares exact-match Google search links for each sentence so you can check them one click at a time.',
      'It does not scan a plagiarism database automatically — there is no free way to search the whole web programmatically. Sentences under six words are skipped because they are too generic to search meaningfully.',
      'Your text stays in your browser until you choose to open a search link. Free, no sign-up.',
    ],
  },
  'readability-checker': {
    steps: [
      'Paste your article or paragraph.',
      'See the Flesch reading-ease score and grade level.',
      'Shorten long sentences and simplify words, then check again.',
    ],
    heading: 'Measure how easy your text is to read',
    paragraphs: [
      'Clear writing keeps readers on the page. This checker calculates the Flesch reading-ease score and an approximate US grade level for any text.',
      'A score of 60–70 is easy for most readers; higher scores mean simpler text. Short sentences, common words and one idea per paragraph raise the score quickly.',
      'Your text is analysed in your browser and not stored anywhere. Free, no sign-up.',
    ],
  },
  'keyword-density-checker': {
    steps: [
      'Paste your text.',
      'Enter the keyword or phrase.',
      'See how often it appears and its percentage of all words.',
    ],
    heading: 'Check keyword density in your content',
    paragraphs: [
      'Using a keyword naturally helps search engines understand a page, but repeating it too often reads badly and can look like keyword stuffing. This checker shows how many times a keyword appears and what percentage of your text it makes up.',
      'Most SEO guidance suggests about 1–2% as a healthy range. Use related words and synonyms instead of repeating the exact phrase, and write for readers first.',
      'Free, instant and private in your browser.',
    ],
  },
  'color-palette-extractor': {
    heading: 'Pull a colour palette out of any image',
    paragraphs: [
      'A photo, logo or screenshot often already contains the colours you want for a design. The Color Palette Extractor reads an image and lists its dominant colours as HEX codes, so you can reuse them in a website, presentation, brand kit or social post without guessing.',
      'The image is analysed inside your browser and is not uploaded. Use the extracted colours as a starting point, then check text and background pairs with the Color Contrast Checker so the result stays readable.',
    ],
    steps: [
      'Choose or drop an image.',
      'Look at the dominant colours the tool finds.',
      'Copy the HEX codes you want to use.',
    ],
  },
  'border-radius-previewer': {
    heading: 'Design rounded corners and copy the CSS',
    paragraphs: [
      'Rounded corners change how a button, card or image feels, and each corner can have its own value. The Border Radius Previewer gives you a slider for every corner and shows the shape live, so you can find the look you want without editing and refreshing code.',
      'When the shape is right, copy the generated border-radius rule and paste it into your stylesheet. Equal values give a soft card; a very large value on a square makes a circle or a pill-shaped button.',
    ],
    steps: [
      'Move the Top left, Top right, Bottom right and Bottom left sliders.',
      'Watch the preview update as you go.',
      'Press “Copy CSS” and paste the rule into your project.',
    ],
  },
  'svg-pattern-generator': {
    heading: 'Make a repeating background pattern',
    paragraphs: [
      'Subtle patterns add texture to hero sections, cards and slides without heavy image files. The SVG Pattern Generator creates tiling dots, stripes, grids and cross-hatch patterns in the colour and tile size you choose.',
      'The result is CSS with the pattern built in as SVG, so it stays sharp on every screen and needs no extra file. Keep the pattern colour close to the background colour when text will sit on top of it.',
    ],
    steps: [
      'Pick a pattern style.',
      'Choose the colour and tile size.',
      'Press “Copy CSS” and paste it into your stylesheet.',
    ],
  },
  'placeholder-image-generator': {
    heading: 'Create placeholder images at any size',
    paragraphs: [
      'While a design is being built, real photos are often not ready. A placeholder with the exact pixel size keeps the layout honest, so nothing jumps when the final image arrives. This tool makes a solid-colour image with its dimensions printed on it.',
      'Choose the width, height, background colour and text colour, then download the image. It is handy for mockups, wireframes, theme demos and testing how a page behaves with different image shapes.',
    ],
    steps: [
      'Enter the width and height in pixels.',
      'Pick the background and text colours.',
      'Press “Generate placeholder” and download the image.',
    ],
  },
  'mockup-generator': {
    heading: 'Show a screenshot inside a phone or laptop',
    paragraphs: [
      'A plain screenshot looks unfinished in a portfolio, pitch or social post. The Device Mockup Generator places your screenshot inside a simple phone or laptop frame, so people can see at a glance what your app or website looks like on a device.',
      'Your screenshot is processed in your browser and is not uploaded. For the cleanest result, use a screenshot with the same shape as the device: tall for a phone, wide for a laptop.',
    ],
    steps: [
      'Choose or drop a screenshot.',
      'Pick the phone or laptop frame.',
      'Download the finished mockup.',
    ],
  },
  'font-pairing-finder': {
    heading: 'Find heading and body fonts that work together',
    paragraphs: [
      'Choosing two fonts that look good together is one of the hardest parts of a design. The Font Pairing Finder shows curated Google Font combinations for headings and body text, with a live preview of each pair.',
      'Type your own preview text to see how real headlines and paragraphs will look. Once you find a pair that fits your brand, note the two font names and load them from Google Fonts in your project.',
    ],
    steps: [
      'Type your own preview text if you like.',
      'Browse the font pairings.',
      'Note the heading and body font names you prefer.',
    ],
  },
  'css-keyframe-generator': {
    heading: 'Build a CSS animation without writing it by hand',
    paragraphs: [
      'A small animation such as a fade, slide or pop makes an interface feel alive, but @keyframes syntax is easy to get wrong. This generator lets you describe the start and end state and shows the animation running straight away.',
      'Set the animation name, the duration and the CSS for the From (0%) and To (100%) states, then copy the generated code. Animating opacity and transform gives the smoothest result on phones.',
    ],
    steps: [
      'Enter an animation name and duration.',
      'Write the CSS for the From (0%) and To (100%) states.',
      'Watch the preview, then press “Copy CSS”.',
    ],
  },
  'svg-animation-previewer': {
    heading: 'Preview spin, pulse and bounce on an SVG',
    paragraphs: [
      'Icons and logos often need a small motion effect such as a loading spinner or a pulsing badge. The SVG Animation Previewer lets you paste SVG markup and instantly see it with a spin, pulse or bounce animation applied.',
      'It is a quick way to check whether an icon is centred and rotates cleanly before you add the animation to a real project. Paste only SVG code that you trust and understand.',
    ],
    steps: [
      'Paste your SVG markup.',
      'Choose spin, pulse or bounce.',
      'Watch the preview and adjust your SVG if needed.',
    ],
  },
  'solid-background-remover': {
    heading: 'Remove a plain background from a logo or graphic',
    paragraphs: [
      'Logos, icons, signatures and product shots on one flat colour do not need an AI model. This tool removes the colour you point at and exports a transparent PNG with clean edges, which is ideal for placing a logo on a website or slide.',
      'Click the background in the picture to sample its colour, or let the tool read it from the corners, then adjust Sensitivity until the background is gone and the subject is intact. For photos of people, products or cars, use the AI Background Remover instead.',
    ],
    steps: [
      'Choose or drop your image.',
      'Click the background to sample its colour and adjust Sensitivity.',
      'Press “Remove background” and download the transparent PNG.',
    ],
  },
  'ai-token-counter': {
    heading: 'Estimate how many tokens your prompt uses',
    paragraphs: [
      'AI models measure text in tokens, not words, and both limits and prices are based on them. The AI Token Counter gives a quick estimate using the common rule of thumb that one token is about four characters of English text.',
      'Use it to check whether a prompt or document is likely to fit a model’s limit before you send it. The figure is an estimate: each model has its own tokenizer, so the real count can be somewhat higher or lower, especially for code or other languages.',
    ],
    steps: [
      'Paste or type your prompt.',
      'Read the estimated tokens, characters and words.',
      'Shorten the text if it is close to your model’s limit.',
    ],
  },
  'sitemap-generator': {
    heading: 'Create a sitemap.xml from a list of URLs',
    paragraphs: [
      'A sitemap tells search engines which pages exist on your site, which helps new pages get discovered. The Sitemap Generator turns a plain list of page addresses into a valid sitemap.xml file.',
      'Paste one full URL per line, generate the file and upload it to the root of your website. Then submit its address in Google Search Console and Bing Webmaster Tools. Only list pages that you want to appear in search results.',
    ],
    steps: [
      'Paste your page URLs, one per line.',
      'Generate the sitemap.',
      'Save it as sitemap.xml, upload it to your site and submit it in Search Console.',
    ],
  },
  'css-grid-generator': {
    heading: 'Set up a CSS Grid layout visually',
    paragraphs: [
      'CSS Grid is the easiest way to build galleries, dashboards and page layouts, but the syntax takes time to remember. The CSS Grid Generator lets you choose the number of columns and rows and the gap between them, with a live preview.',
      'When the grid looks right, copy the code and paste it onto your container element. Start with equal columns; you can change individual column widths in your own stylesheet later.',
    ],
    steps: [
      'Set the number of columns and rows.',
      'Adjust the gap.',
      'Press “Copy CSS” and add it to your container.',
    ],
  },
  'css-flexbox-generator': {
    heading: 'Get Flexbox alignment right the first time',
    paragraphs: [
      'Flexbox is perfect for navigation bars, button rows and centring things, yet justify-content and align-items are easy to mix up. This generator lets you switch each option and see the items move instantly.',
      'Choose the direction, how items are spread along the main axis, how they align on the cross axis and the gap between them, then copy the CSS. To centre something both ways, set justify-content and align-items to center.',
    ],
    steps: [
      'Choose the direction, justify-content and align-items.',
      'Set the gap and the number of items.',
      'Press “Copy CSS”.',
    ],
  },
  'tailwind-config-generator': {
    heading: 'Add your brand colours and fonts to Tailwind',
    paragraphs: [
      'Using your own colours and fonts in Tailwind CSS means extending the theme in tailwind.config.js. This generator writes that snippet for you from a primary colour, a secondary colour, a heading font and a body font.',
      'Copy the result into the theme.extend section of your config file, then use the new names in your classes. Remember to load the fonts themselves, for example from Google Fonts, or the browser will fall back to a default.',
    ],
    steps: [
      'Pick your primary and secondary colours.',
      'Enter the heading and body font names.',
      'Press “Copy config” and paste it into tailwind.config.js.',
    ],
  },
  'css-minifier': {
    heading: 'Make CSS files smaller',
    paragraphs: [
      'Comments, line breaks and extra spaces make CSS easy to read but add weight that every visitor has to download. The CSS Minifier strips them out so your stylesheet loads faster, while the styles keep working exactly the same.',
      'Keep your original, readable file for editing and publish the minified copy. The minifier runs in your browser, so private code is never uploaded. For large projects, a build tool can do this step automatically.',
    ],
    steps: ['Paste your CSS.', 'Minify it.', 'Copy the result into your production stylesheet.'],
  },
  'js-minifier': {
    heading: 'Shrink JavaScript by removing comments and spaces',
    paragraphs: [
      'Readable JavaScript contains comments, indentation and blank lines that browsers do not need. The JavaScript Minifier removes them to make a smaller file that downloads faster.',
      'Always keep the original source and test the minified version before you publish it. This tool strips comments and whitespace only; it does not rename variables or bundle files, which is a job for a build tool. Your code is processed in your browser and is not uploaded.',
    ],
    steps: ['Paste your JavaScript.', 'Minify it.', 'Copy the result and test it on your page.'],
  },
  'sql-query-builder': {
    heading: 'Build a SELECT query without typing it',
    paragraphs: [
      'Writing SQL by hand is slow when you only need a quick query. The SQL Query Builder lets you fill in the table, the columns, WHERE conditions, sorting and a limit, and writes the SELECT statement for you.',
      'It is useful for beginners learning how a query is put together and for anyone who wants a correct starting point. The tool only writes the text of the query; it never connects to a database. Check table and column names before you run it.',
    ],
    steps: [
      'Enter the table name and the columns.',
      'Add conditions, sorting and a limit if you need them.',
      'Press “Copy SQL” and run it in your database tool.',
    ],
  },
  'api-tester': {
    heading: 'Send a test request to any REST API',
    paragraphs: [
      'When you build or debug an API you need to see exactly what it returns. The API Testing Tool sends a request with the method, headers and body you choose, then shows the response status, headers and body.',
      'Requests go directly from your browser to the address you enter, so the API must allow browser requests (CORS); otherwise the browser blocks the response. Avoid pasting production secrets on a shared computer.',
    ],
    steps: [
      'Choose the method and enter the URL.',
      'Add headers and a body if the request needs them.',
      'Send the request and read the status and response.',
    ],
  },
  'js-obfuscator': {
    heading: 'Make JavaScript hard to read',
    paragraphs: [
      'Code that runs in a browser can be viewed by anyone. Obfuscation rewrites JavaScript into a version that behaves the same but is very hard for a person to follow, which discourages casual copying.',
      'This tool uses the widely used javascript-obfuscator engine and runs entirely in your browser. Obfuscation is not encryption: a determined person can still study the code, so never put passwords or secret keys in front-end code. Keep your original source, and test the result.',
    ],
    steps: ['Paste your JavaScript.', 'Obfuscate it.', 'Press “Copy result” and test it before publishing.'],
  },
  'text-cleaner': {
    heading: 'Clean up messy copied text',
    paragraphs: [
      'Text copied from PDFs, emails and websites often arrives with double spaces, broken spacing and empty lines. The Text Cleaner fixes these in one click so you can paste clean text into a document, post or form.',
      'Use “Clean spaces” to remove extra spaces and “Remove blank lines” to close up empty lines. Your text stays in your browser. To join lines that were broken in the wrong place, use the Line Break Remover.',
    ],
    steps: ['Paste your text.', 'Press “Clean spaces” or “Remove blank lines”.', 'Copy the cleaned text.'],
  },
  'seo-meta-preview': {
    heading: 'See your page as Google would show it',
    paragraphs: [
      'The title and meta description are your advert in the search results. If they are too long they get cut off; if they are vague, people scroll past. The SEO Meta Preview shows how your page is likely to appear and warns you about length.',
      'As a guide, keep titles to about 60 characters and descriptions to about 155. Put the main keyword near the start of the title and give a clear reason to click. Google sometimes rewrites snippets, so treat the preview as a close estimate.',
    ],
    steps: [
      'Enter your page title, URL and meta description.',
      'Check the preview and the character counts.',
      'Edit until nothing is cut off, then use the text on your page.',
    ],
  },
  'headline-analyzer': {
    heading: 'Check a headline before you publish',
    paragraphs: [
      'Most people decide whether to read something from the headline alone. The Headline Analyzer scores yours against simple copywriting practices: length, whether it contains a number, a power word or a question.',
      'Use the score as a guide, not a rule. Write several versions, compare them and choose the one that is clear and honest about what the reader will get. A specific promise usually beats a clever phrase.',
    ],
    steps: [
      'Type your headline.',
      'Read the score and the checks.',
      'Rewrite and compare different versions.',
    ],
  },
  'email-subject-line-tester': {
    heading: 'Test an email subject line before sending',
    paragraphs: [
      'The subject line decides whether an email gets opened. This tester checks its length, spam-trigger words, emoji and personalisation so you can fix problems before you press send.',
      'Shorter subject lines are less likely to be cut off on phones. Avoid all capitals and too many exclamation marks, and make sure the email delivers what the subject promises. Nothing you type is sent anywhere.',
    ],
    steps: [
      'Type your subject line.',
      'Check the length, spam words, emoji and personalisation results.',
      'Adjust the wording and test again.',
    ],
  },
  'cta-generator': {
    heading: 'Find the right call-to-action phrase',
    paragraphs: [
      'A button that says “Submit” wastes a chance to tell people what they get. The CTA Generator gives you a curated bank of call-to-action phrases, grouped by category, to use on buttons, banners, emails and ads.',
      'Pick a phrase that describes the result for the visitor, such as starting a free trial or downloading a guide, and keep it short. Test two versions on your page when you can.',
    ],
    steps: ['Choose a category.', 'Browse the phrases.', 'Copy the one that fits your campaign.'],
  },
  'social-bio-generator': {
    heading: 'Write a social media bio in seconds',
    paragraphs: [
      'A bio has to say who you are and why someone should follow you in very few characters. Fill in your role, niche and a personality trait, and the Social Media Bio Generator gives you several ready-to-use templates for Instagram, X, LinkedIn and TikTok.',
      'Use a template as a first draft, then add something specific, such as a result, a place or a link. These are templates filled with your words, so the text is yours to edit freely.',
    ],
    steps: [
      'Enter your role, niche and a personality trait.',
      'Read the generated bios.',
      'Copy your favourite and personalise it.',
    ],
  },
  'blog-outline-generator': {
    heading: 'Plan a blog post before you write it',
    paragraphs: [
      'A clear outline makes writing faster and keeps an article on topic. Enter a title and your subtopics, and the Blog Outline Generator arranges them into a structured outline with an introduction and a conclusion.',
      'Use the outline as headings in your editor, then fill in each section. It is a template tool, not an AI writer, so the ideas and the words stay yours.',
    ],
    steps: [
      'Enter the article title.',
      'Add your subtopics, one per line.',
      'Press “Copy outline” and paste it into your editor.',
    ],
  },
  'srt-subtitle-formatter': {
    heading: 'Fix subtitle timing and numbering',
    paragraphs: [
      'Subtitles that appear too early or too late make a video hard to watch. The SRT Subtitle Formatter shifts every timestamp in an .srt file by the same amount and renumbers the blocks in order.',
      'Enter a positive offset in milliseconds to delay the subtitles, or a negative one to show them earlier; 1000 milliseconds is one second. The file is processed in your browser.',
    ],
    steps: [
      'Paste the contents of your .srt file.',
      'Enter the time offset in milliseconds.',
      'Press “Format & shift”, then “Copy SRT” and save the text as a .srt file.',
    ],
  },
  'audio-speed-changer': {
    heading: 'Change audio speed without changing the voice',
    paragraphs: [
      'Lectures and podcasts are quicker to get through at a faster speed, and music or language practice is easier when slowed down. The Audio Speed Changer changes speed from 0.5× to 2× while keeping the voice at its natural pitch.',
      '“Keep the voice natural” is on by default; turn it off if you want the classic higher or deeper effect. Save the result as MP3 or WAV. Everything is processed on your device.',
    ],
    steps: [
      'Choose an audio file.',
      'Pick a speed with the slider or a quick-speed button.',
      'Press “Change speed & export”, listen and download.',
    ],
  },
  'gif-optimizer': {
    heading: 'Make an animated GIF smaller',
    paragraphs: [
      'GIFs are often too large to send or to load quickly on a web page. The GIF Optimizer shrinks an animated GIF by reducing its resolution, its quality or the number of frames.',
      'Start by lowering the scale, which saves the most; then lower the quality or keep every second frame if you need a smaller file. The GIF is decoded and rebuilt in your browser and is not uploaded.',
    ],
    steps: [
      'Choose your GIF.',
      'Adjust Scale, Quality and “Keep every Nth frame”.',
      'Optimise and download the smaller GIF.',
    ],
  },
  'profit-margin-calculator': {
    heading: 'Work out profit, margin and markup',
    paragraphs: [
      'Margin and markup are often confused, and the difference affects your prices. Margin is profit as a share of the selling price; markup is profit as a share of the cost. This calculator shows both from a cost price and a selling price.',
      'You can also enter a target margin to find the price you need to charge. For example, a product that costs 60 and sells for 100 has a 40% margin and a 66.7% markup.',
    ],
    steps: [
      'Enter the cost price and the selling price.',
      'Read the profit, margin and markup.',
      'Or enter a target margin to see the price to charge.',
    ],
  },
  'date-calculator': {
    heading: 'Count the days between two dates',
    paragraphs: [
      'Deadlines, notice periods, visas and project plans all depend on exact day counts. The Date Calculator shows the total days, weeks and business days between two dates.',
      'It can also add or subtract a number of days from a date to find a due date. Business days count Monday to Friday; public holidays differ by country and are not removed.',
    ],
    steps: [
      'Choose a start date and an end date.',
      'Read the total days, weeks and business days.',
      'Or pick a date and add or subtract days.',
    ],
  },
  'pomodoro-timer': {
    heading: 'Focus in short, timed sessions',
    paragraphs: [
      'The Pomodoro technique breaks work into focused sessions, traditionally 25 minutes, followed by a short break. It makes large tasks less daunting and helps you notice how long things really take.',
      'Set the focus length that suits you, start the timer and work on one task until it ends. Then take a few minutes away from the screen before the next session.',
    ],
    steps: [
      'Set the focus length in minutes.',
      'Start the timer and work on a single task.',
      'Take a short break when the timer ends, then repeat.',
    ],
  },
  'timezone-meeting-planner': {
    heading: 'Find a meeting time across time zones',
    paragraphs: [
      'Scheduling a call between cities in different time zones is where mistakes happen. Pick a date and time in your own local time and the Timezone Meeting Planner shows the equivalent time in major time zones around the world.',
      'Look for a slot inside working hours for everyone, and include the time zone when you send the invitation. Daylight saving time changes the difference between some cities during the year, so always check the actual date of the meeting.',
    ],
    steps: [
      'Pick the date and time in your local time.',
      'Compare the local times shown for other time zones.',
      'Choose a slot that suits everyone.',
    ],
  },
  'random-picker-wheel': {
    heading: 'Let a wheel choose for you',
    paragraphs: [
      'For giveaways, classroom turns, team tasks or simply choosing where to eat, a wheel makes a random choice quick and visible. Enter your names or options, spin, and the wheel lands on one of them.',
      'Every option has the same chance. The list stays in your browser. Remove the winner and spin again when you need a second pick.',
    ],
    steps: [
      'Type your options, one per line.',
      'Spin the wheel.',
      'Read the selected option and spin again if you need another.',
    ],
  },
  'kanban-board': {
    heading: 'Track small tasks on a simple board',
    paragraphs: [
      'A Kanban board shows work as cards moving through three columns: To Do, In Progress and Done. Seeing everything in one place makes it clear what to do next and how much is already on your plate.',
      'This board is deliberately simple and needs no account. Your tasks are saved in this browser on this device, so they are private, but they will not appear on your other devices and are removed if you clear your browser data.',
    ],
    steps: [
      'Type a task and press “Add”.',
      'Move a card forward as the work progresses.',
      'Delete tasks you no longer need.',
    ],
  },
  'tip-bill-splitter': {
    heading: 'Add a tip and split the bill fairly',
    paragraphs: [
      'Working out a tip and each person’s share at the table is awkward. Enter the bill, the tip percentage and the number of people, and the Tip & Bill Splitter shows the tip, the total and what each person pays.',
      'Tipping customs differ between countries, so choose the percentage that is normal where you are. The split is equal; if people ordered very different amounts, settle those differences separately.',
    ],
    steps: [
      'Enter the bill amount.',
      'Set the tip percentage and the number of people.',
      'Read the tip, the total and each person’s share.',
    ],
  },
  'number-base-converter': {
    heading: 'Convert between binary, octal, decimal and hex',
    paragraphs: [
      'Programmers and electronics students constantly move between number systems: binary for bits, hexadecimal for colours and memory addresses, octal for file permissions. This converter shows the same whole number in all four bases.',
      'Type a number, choose which base it is written in and read the others. It handles very large whole numbers. For example, decimal 255 is 11111111 in binary, 377 in octal and FF in hexadecimal.',
    ],
    steps: [
      'Type a whole number.',
      'Choose the base it is written in.',
      'Read the value in binary, octal, decimal and hexadecimal.',
    ],
  },
  'roman-numeral-converter': {
    heading: 'Convert numbers to Roman numerals and back',
    paragraphs: [
      'Roman numerals still appear on clocks, in book chapters, film credits, outlines and event names. This converter turns any number from 1 to 3999 into Roman numerals, and reads a Roman numeral back as a number.',
      'The system uses seven letters: I (1), V (5), X (10), L (50), C (100), D (500) and M (1000). A smaller letter before a larger one is subtracted, so IV is 4 and CM is 900. For example, 2026 is MMXXVI.',
    ],
    steps: [
      'Type a number between 1 and 3999 to see it in Roman numerals.',
      'Or type a Roman numeral to see it as a number.',
      'Copy the result.',
    ],
  },
  'random-number-generator': {
    heading: 'Pick fair random numbers in any range',
    paragraphs: [
      'Raffles, sampling, games, classroom activities and test data all need numbers that nobody can predict. The Random Number Generator picks one or many numbers between a minimum and a maximum that you set.',
      'Choose whether repeats are allowed: turn them off for a draw where each number can win only once. The numbers come from your browser’s secure random source, which is suitable for fair draws.',
    ],
    steps: [
      'Enter the minimum and maximum.',
      'Choose how many numbers you want and whether repeats are allowed.',
      'Press “Generate”.',
    ],
  },
  'stopwatch-countdown': {
    heading: 'Time anything with a stopwatch or countdown',
    paragraphs: [
      'Workouts, cooking, presentations, exams and games all need accurate timing. This tool gives you a stopwatch with lap times and a countdown timer that sounds an alarm when it reaches zero.',
      'Use laps to time each round or section without stopping the clock. Keep the tab open while a timer is running, and turn your device volume up so you hear the countdown alarm.',
    ],
    steps: [
      'Choose the stopwatch or the countdown.',
      'For a countdown, enter the minutes and start it.',
      'Use lap to record split times on the stopwatch.',
    ],
  },
  'morse-code-translator': {
    heading: 'Translate text to Morse code and back',
    paragraphs: [
      'Morse code represents letters and numbers as short and long signals, written as dots and dashes. It is still used by radio amateurs and is a popular thing to learn for fun, scouting and puzzles.',
      'Type ordinary text to see it in Morse code, or paste dots and dashes to read them as text; the tool detects which one you entered. Press “Play sound” to hear the rhythm, which is the best way to learn it. SOS is three dots, three dashes, three dots.',
    ],
    steps: ['Type text or paste Morse code.', 'Read the translation.', 'Press “Play sound” to hear it.'],
  },
  'color-contrast-checker': {
    heading: 'Check that your text is readable',
    paragraphs: [
      'Light grey text on a white background may look elegant, but many people cannot read it. The Color Contrast Checker measures the contrast ratio between a text colour and a background colour and tells you whether it passes the WCAG 2.1 accessibility guidelines.',
      'Level AA needs a ratio of at least 4.5:1 for normal text and 3:1 for large text. Level AAA needs 7:1 and 4.5:1. Passing AA is a sensible minimum for websites, apps and slides, and helps every reader in bright light.',
    ],
    steps: [
      'Choose the text colour and the background colour.',
      'Read the contrast ratio.',
      'Adjust the colours until AA (or AAA) shows a pass.',
    ],
  },
  'image-watermark': {
    heading: 'Add a text watermark to a photo',
    paragraphs: [
      'A watermark shows who owns a picture and discourages people from reusing it without credit. This tool places text such as your name, brand or website on a photo, in a corner, in the centre or tiled across the whole image.',
      'Choose the colour, size and opacity so the mark is visible without spoiling the picture. Your image is processed in your browser and never leaves your device. Keep an unmarked original for your own records.',
    ],
    steps: [
      'Choose your image.',
      'Type the watermark text and choose position, colour, size and opacity.',
      'Download the watermarked image.',
    ],
  },
  'ohms-law-calculator': {
    heading: 'Calculate voltage, current, resistance and power',
    paragraphs: [
      'Ohm’s law links the three basic quantities of a circuit: voltage equals current multiplied by resistance (V = I × R). Power is voltage multiplied by current (P = V × I). Knowing any two values lets you find the others.',
      'Enter any two of voltage, current, resistance and power, and the calculator works out the rest. For example, 12 volts across a 6 ohm resistor gives a current of 2 amps and a power of 24 watts. Use it to size resistors and check power ratings.',
    ],
    steps: [
      'Enter any two values.',
      'Read the other two.',
      'Check that your components are rated for the calculated power.',
    ],
  },
  'resistor-color-code': {
    heading: 'Read a resistor from its colour bands',
    paragraphs: [
      'Resistors are too small for printed numbers, so their value is shown with coloured bands. On a 4-band resistor the first two bands are digits, the third is a multiplier and the fourth is the tolerance. A 5-band resistor adds a third digit for more precision.',
      'Pick the colours in the order they appear and the tool shows the resistance, the tolerance and the range the real value can fall in. For example, brown, black, red and gold is 1,000 ohms (1 kΩ) with 5% tolerance.',
    ],
    steps: [
      'Choose a 4-band or 5-band resistor.',
      'Pick the colour of each band in order.',
      'Read the resistance, tolerance and range.',
    ],
  },
  'quadratic-equation-solver': {
    heading: 'Solve any quadratic equation',
    paragraphs: [
      'A quadratic equation has the form ax² + bx + c = 0. Its solutions, called roots, come from the quadratic formula. The value b² − 4ac, the discriminant, tells you what kind of roots to expect: two real roots if it is positive, one if it is zero and two complex roots if it is negative.',
      'Enter a, b and c to see the roots, the discriminant and the vertex of the parabola. For example, x² − 5x + 6 = 0 has roots 2 and 3. It is useful for checking homework and for physics and engineering problems.',
    ],
    steps: ['Enter the values of a, b and c.', 'Read the roots.', 'Check the discriminant and the vertex.'],
  },
  'statistics-calculator': {
    heading: 'Summarise a list of numbers',
    paragraphs: [
      'Before drawing conclusions from data you need its basic shape. Paste a list of numbers and this calculator gives the count, sum, mean, median, mode, range, variance and standard deviation.',
      'The mean is the average; the median is the middle value and is less affected by extreme numbers. Use the sample standard deviation when your numbers are a sample from a larger group, and the population version when you have every value.',
    ],
    steps: [
      'Paste or type your numbers.',
      'Read the mean, median, mode and range.',
      'Use the sample or population standard deviation as appropriate.',
    ],
  },
  'fraction-calculator': {
    heading: 'Add, subtract, multiply and divide fractions',
    paragraphs: [
      'Fraction arithmetic is easy to get wrong by hand because of common denominators. This calculator adds, subtracts, multiplies and divides fractions and mixed numbers and gives the answer in its simplest form.',
      'The result is shown as a simplified fraction, as a mixed number and as a decimal. For example, 1/2 + 1/3 = 5/6. It is useful for homework, recipes and measurements in woodworking and sewing.',
    ],
    steps: [
      'Enter the first fraction.',
      'Choose the operation and enter the second fraction.',
      'Read the simplified answer, mixed number and decimal.',
    ],
  },
  'subnet-calculator': {
    heading: 'Work out an IPv4 subnet',
    paragraphs: [
      'Subnetting divides a network into smaller parts. From an IPv4 address and a prefix length, this calculator shows the network address, subnet mask, broadcast address, wildcard mask, the range of usable host addresses and how many hosts fit.',
      'The prefix length is the number after the slash. A /24 network has the mask 255.255.255.0 and 254 usable hosts. It is a handy check for network students, home labs and anyone configuring routers or firewalls.',
    ],
    steps: [
      'Enter an IPv4 address.',
      'Set the prefix length.',
      'Read the network, mask, broadcast and usable host range.',
    ],
  },
  'chmod-calculator': {
    heading: 'Get the right chmod number for file permissions',
    paragraphs: [
      'On Linux and macOS every file has read, write and execute permissions for three groups: the owner, the group and everyone else. The chmod command sets them with a three-digit number, where read is 4, write is 2 and execute is 1.',
      'Tick the permissions you want to see the numeric and symbolic value, or type a number to see what it means. For example, 755 means the owner can read, write and execute while others can read and execute; 644 is common for ordinary files.',
    ],
    steps: [
      'Tick the permissions for owner, group and others.',
      'Read the numeric and symbolic value.',
      'Or type a number to decode it.',
    ],
  },
  'discount-calculator': {
    heading: 'See the sale price and what you save',
    paragraphs: [
      'Sales often stack an extra discount on top of the first one, which makes the real price hard to judge. Enter the original price and the discount, and this calculator shows the final price and how much you save.',
      'A second discount applies to the already reduced price, so 20% off followed by an extra 10% is 28% off in total, not 30%. Use it to compare offers while shopping or to set promotions in your own shop.',
    ],
    steps: [
      'Enter the original price.',
      'Enter the discount, and an extra discount if there is one.',
      'Read the final price, the saving and the total discount.',
    ],
  },
  'vat-calculator': {
    heading: 'Add or remove VAT, GST or sales tax',
    paragraphs: [
      'Prices are quoted either without tax (net) or including tax (gross), and moving between them is a common source of mistakes. This calculator adds tax to a net price or takes it out of a gross price at any rate you enter.',
      'Removing tax is not the same as subtracting the percentage: at a 20% rate, a gross price of 120 contains 20 of tax, not 24. Tax rates and rules differ by country and product, so check the rate that applies to you.',
    ],
    steps: [
      'Enter the tax rate.',
      'Enter a net price to add tax, or a gross price to remove it.',
      'Read the net amount, the tax and the gross amount.',
    ],
  },
  'fuel-cost-calculator': {
    heading: 'Estimate the fuel cost of a trip',
    paragraphs: [
      'Knowing what a journey will cost in fuel helps you budget, compare driving with other transport and share costs fairly. Enter the distance, your vehicle’s fuel consumption and the fuel price to see how much fuel you need and what it will cost.',
      'Add the number of people sharing to see the cost per person. Real consumption changes with speed, load, traffic and air conditioning, so treat the result as an estimate and allow a little extra.',
    ],
    steps: [
      'Enter the distance, fuel consumption and fuel price.',
      'Enter how many people are sharing.',
      'Read the trip cost and the cost per person.',
    ],
  },
  'calorie-calculator': {
    heading: 'Estimate the calories you burn each day',
    paragraphs: [
      'Your body uses energy even at rest; this is your basal metabolic rate (BMR). Adding your daily activity gives your total daily energy expenditure (TDEE), an estimate of the calories you burn in a day.',
      'Enter your age, height, weight and activity level to see both figures. The result is an estimate from a standard formula and real needs vary from person to person. It is general information, not medical advice; speak to a doctor or dietitian before making significant changes to your diet.',
    ],
    steps: [
      'Enter your age, height and weight.',
      'Choose your activity level.',
      'Read your BMR and estimated daily calories.',
    ],
  },
  'open-graph-generator': {
    heading: 'Control how your page looks when it is shared',
    paragraphs: [
      'When someone shares a link on Facebook, LinkedIn, WhatsApp or X, the preview card is built from Open Graph and Twitter Card meta tags. Without them, platforms guess, often with the wrong image or no image at all.',
      'Enter the page title, description, URL and an image address, check the share preview and copy the tags into the head section of your page. Use an image of 1200 × 630 pixels for the best result on most platforms.',
    ],
    steps: [
      'Enter the page title, description, site name, page URL and image URL.',
      'Check the share preview.',
      'Press “Copy meta tags” and paste them into your page’s head section.',
    ],
  },
  'website-speed-checker': {
    heading: 'Test how fast a web page loads',
    paragraphs: [
      'Slow pages lose visitors and can rank lower in search. The Website Speed Checker runs Google PageSpeed Insights on any public page and shows its performance score and Core Web Vitals, the measurements Google uses for loading, responsiveness and visual stability.',
      'Test both mobile and desktop, because phones are usually slower. This tool needs an internet connection: the address you enter is sent to Google’s PageSpeed service to run the test. Scores vary a little between runs, so test two or three times.',
    ],
    steps: [
      'Enter the website address.',
      'Choose mobile or desktop.',
      'Run the test and read the score and Core Web Vitals.',
    ],
  },
  'whatsapp-link-generator': {
    heading: 'Create a click-to-chat WhatsApp link',
    paragraphs: [
      'A WhatsApp link lets customers start a chat with you in one tap, without saving your number first. It works in website buttons, Instagram bios, emails, ads and QR codes.',
      'Enter your phone number with its country code and, if you like, a message that will be typed in for the customer. The link uses WhatsApp’s official wa.me format. Only share a number that you are happy for the public to contact.',
    ],
    steps: [
      'Enter your phone number with the country code.',
      'Add an optional pre-filled message.',
      'Press “Copy link” and use it on your website, bio or ads.',
    ],
  },
  'payment-reminder-generator': {
    heading: 'Write a payment reminder that gets results',
    paragraphs: [
      'Chasing an unpaid invoice is uncomfortable, and finding the right tone takes time. The Payment Reminder Generator writes a clear message from your client’s name, the invoice number, the amount and the due date.',
      'Choose a polite reminder for a first nudge, a firm one when payment is late and a final notice when earlier messages were ignored. Read the message before sending and adjust it to fit your relationship with the client.',
    ],
    steps: [
      'Enter the client name, invoice number, amount and due date.',
      'Choose a polite, firm or final tone.',
      'Press “Copy message” and send it by email or chat.',
    ],
  },
  'google-review-qr-generator': {
    heading: 'Get more Google reviews with a QR code',
    paragraphs: [
      'Happy customers rarely leave a review because finding the right page takes effort. A QR code that opens your Google review page removes that step: they scan it with their phone camera and can write a review straight away.',
      'Paste your Google review link, generate the code and print it on receipts, table cards, packaging or flyers. Ask for honest reviews only; offering rewards for reviews is against Google’s rules.',
    ],
    steps: [
      'Copy your review link from your Google Business Profile.',
      'Paste it into the tool to create the QR code.',
      'Download the code and print it where customers will see it.',
    ],
  },
  'sip-calculator': {
    heading: 'See how a monthly investment could grow',
    paragraphs: [
      'A systematic investment plan (SIP) means investing a fixed amount every month. Over time, returns are earned on earlier returns as well as on the money you put in, which is the effect of compounding.',
      'Enter the monthly amount, an expected yearly return and the number of years to see the total invested, the estimated gains and the estimated final value. The result is an illustration, not a prediction: real returns change from year to year and investments can lose value. This is not financial advice.',
    ],
    steps: [
      'Enter the monthly investment.',
      'Enter the expected yearly return and the number of years.',
      'Read the total invested, estimated gains and estimated value.',
    ],
  },
  'roi-calculator': {
    heading: 'Measure the return on an investment',
    paragraphs: [
      'Return on investment (ROI) shows how much you gained compared with what you put in: profit divided by the amount invested. It lets you compare a marketing campaign, a piece of equipment or a financial investment on the same scale.',
      'Because a 50% return over one year is very different from 50% over five, the calculator also shows the annualised ROI. For example, 1,000 that becomes 1,500 is a 50% ROI. Remember to include every cost in the amount invested.',
    ],
    steps: [
      'Enter the amount invested and the final value.',
      'Enter the period in years.',
      'Read the profit, ROI and annualised ROI.',
    ],
  },
  'break-even-calculator': {
    heading: 'Find the sales you need to break even',
    paragraphs: [
      'The break-even point is where income exactly covers costs, with no profit and no loss. It depends on your fixed costs, such as rent and salaries, and on the profit each unit makes after its own variable cost.',
      'Enter your fixed costs, the price per unit and the variable cost per unit to see how many units you must sell and the revenue that represents. For example, fixed costs of 50,000, a price of 500 and a variable cost of 300 mean you break even at 250 units.',
    ],
    steps: [
      'Enter your fixed costs for the period.',
      'Enter the price per unit and the variable cost per unit.',
      'Read the break-even units and revenue.',
    ],
  },
  'remove-duplicate-lines': {
    heading: 'Remove repeated lines from a list',
    paragraphs: [
      'Email lists, keyword lists and exported data often contain the same line more than once. This tool removes the repeats and keeps the first time each line appears, so the order of your list is preserved.',
      'It is useful for cleaning mailing lists, tags, product codes and log files. Your text is processed in your browser and is not uploaded.',
    ],
    steps: ['Paste your list, one item per line.', 'Remove the duplicates.', 'Copy the cleaned list.'],
  },
  'text-sorter': {
    heading: 'Sort lines of text any way you need',
    paragraphs: [
      'Putting a list in order by hand is slow and error-prone. The Text Sorter arranges lines from A to Z or Z to A, by number or by length, and can also reverse or shuffle them.',
      'Use it for names, glossaries, keyword lists and reading lists, or shuffle a list to put it in random order. Your text stays in your browser.',
    ],
    steps: ['Paste your lines.', 'Choose how to sort them.', 'Copy the sorted result.'],
  },
  'find-and-replace': {
    heading: 'Replace words across a whole text at once',
    paragraphs: [
      'Changing a name, a product code or a repeated mistake one by one invites errors. Find and Replace changes every match in your text in a single step and shows how many matches there are.',
      'You can also search by pattern for more advanced changes. Check the result before you use it, because replacing a short word can also change longer words that contain it. Your text is not uploaded.',
    ],
    steps: [
      'Paste your text.',
      'Type what to find and what to replace it with.',
      'Replace all matches and copy the result.',
    ],
  },
  'sql-formatter': {
    heading: 'Make SQL queries easy to read',
    paragraphs: [
      'A long query written on one line is hard to understand and harder to debug. The SQL Formatter rewrites it with one clause per line, indented columns and consistent keyword case.',
      'Formatting changes only the layout, not what the query does. It is useful before a code review, when reading queries copied from logs and when learning how a complex query is built. Your SQL is formatted in your browser.',
    ],
    steps: ['Paste your SQL query.', 'Format it.', 'Copy the formatted query.'],
  },
  'xml-formatter': {
    heading: 'Indent XML and check that it is valid',
    paragraphs: [
      'XML from feeds, sitemaps, configuration files and APIs often arrives as one long line. The XML Formatter indents it so the structure is easy to follow.',
      'If the XML is not well formed, for example because a tag is not closed, the tool shows an error message to help you find the problem. Your XML is processed in your browser and is not uploaded.',
    ],
    steps: ['Paste your XML.', 'Format it and read any error message.', 'Copy the indented XML.'],
  },
  'rotate-pdf': {
    heading: 'Turn the pages of a PDF the right way up',
    paragraphs: [
      'Scanned documents and phone photos saved as PDF are often sideways or upside down. Rotate PDF turns every page by 90°, 180° or 270° and gives you a corrected file that opens the right way round for everyone.',
      'The rotation is saved in the file itself, not just in your viewer. Your PDF is processed in your browser and is not uploaded, so contracts and personal documents stay private.',
    ],
    steps: ['Choose your PDF.', 'Pick 90°, 180° or 270°.', 'Rotate and download the fixed PDF.'],
  },
  'domain-age-checker': {
    heading: 'Find out how old a domain is',
    paragraphs: [
      'The age of a domain is a useful clue when you judge a website, research a competitor or think about buying a domain. The Domain Age Checker shows when a domain was first registered, when it expires, when it was last updated and which registrar manages it.',
      'The information comes from RDAP, the official registry data service that replaced WHOIS. This tool needs an internet connection, and the domain name you enter is sent to look up the record. Some country-code domains do not publish RDAP data, so results are not available for every domain.',
    ],
    steps: [
      'Enter a domain name, such as example.com.',
      'Run the check.',
      'Read the domain age, registration date, expiry date and registrar.',
    ],
  },
  'screen-recorder': {
    heading: 'Record your screen without installing anything',
    paragraphs: [
      'Tutorials, bug reports, presentations and quick demos are easier to show than to describe. The Screen Recorder captures your whole screen, one window or a single browser tab, with sound, and saves it as a video file.',
      'There is no watermark and no time limit set by us, and the recording is created on your computer rather than uploaded. Screen recording in a browser works on computers using Chrome, Edge or Firefox; phones normally do not allow websites to record the screen.',
    ],
    steps: [
      'Choose whether to include sound and press “Start recording”.',
      'Pick the screen, window or tab in the browser prompt.',
      'Press “Stop”, preview the video and download it.',
    ],
  },
  'voice-recorder': {
    heading: 'Record your voice in the browser',
    paragraphs: [
      'Voice notes, interview practice, song ideas and spoken reminders need nothing more than a microphone. The Voice Recorder records from your microphone, lets you play the recording back and saves it as an audio file.',
      'Your browser asks for permission to use the microphone the first time. The recording stays in the browser tab until you download it and is not uploaded. To cut silence from the start or end afterwards, use the Audio Trimmer.',
    ],
    steps: [
      'Press “Start recording” and allow the microphone.',
      'Speak, then press “Stop”.',
      'Listen to the recording and download it.',
    ],
  },
  'speech-to-text': {
    heading: 'Type with your voice',
    paragraphs: [
      'Speaking is faster than typing for notes, messages, essays and captions. Speech to Text turns what you say into written text in 12 languages, including English, Urdu, Hindi and Arabic, and lets you copy or download the result.',
      'It uses the speech recognition built into your browser and works best in Chrome and Edge. The browser’s speech service may send audio to its provider in order to recognise it; CraftSprint does not receive or store your voice. Speak clearly and check the text afterwards.',
    ],
    steps: [
      'Choose your language.',
      'Press “Start listening”, allow the microphone and speak.',
      'Edit the text if needed, then copy or download it.',
    ],
  },
  'webcam-mic-test': {
    heading: 'Check your camera and microphone before a call',
    paragraphs: [
      'Finding out that your camera or microphone does not work as an interview or meeting begins is stressful. This test shows your live video, its resolution and a sound level meter, so you can confirm everything works first.',
      'Nothing is recorded or uploaded; the preview appears only on your own screen. If the meter does not move, check that the correct microphone is selected in your browser and that it is not muted.',
    ],
    steps: [
      'Press “Start test” and allow the camera and microphone.',
      'Check the picture and the resolution.',
      'Speak and watch the microphone level move.',
    ],
  },
  'smart-qr-generator': {
    heading: 'Make QR codes that do something useful',
    paragraphs: [
      'A QR code can do more than open a web page. The Smart QR Generator makes codes that join a Wi-Fi network, save a contact to a phone, start an email, open a WhatsApp chat or prepare an SMS.',
      'A Wi-Fi code lets guests connect without typing a long password; a contact code works as a digital business card. The codes are created on your device. A Wi-Fi code contains your password, so share it only with people you would give the password to.',
    ],
    steps: [
      'Choose Wi-Fi, Contact, Email, WhatsApp or SMS.',
      'Fill in the details.',
      'Download the QR code as a PNG.',
    ],
  },
  'coin-flip-dice-roller': {
    heading: 'Flip a coin or roll dice fairly',
    paragraphs: [
      'When you need a quick, fair decision or have lost the dice from a board game, this tool flips a coin or rolls from one to six dice.',
      'Results come from your browser’s secure random number generator, so each side of the coin and each face of a die has an equal chance. Your recent results are listed below so everyone can see them.',
    ],
    steps: [
      'Choose coin or dice.',
      'For dice, choose how many to roll.',
      'Press the button and read the result.',
    ],
  },
  'citation-generator': {
    heading: 'Create APA, MLA and Chicago references',
    paragraphs: [
      'Essays, assignments and research papers must credit their sources in a set style. The Citation Generator formats references for websites and books in APA 7, MLA 9 and Chicago style from the details you enter.',
      'Enter each author with the first name first, one per line. In your document, put book titles in italics, because plain text cannot show them. Always check the reference against your institution’s guide, since requirements vary.',
    ],
    steps: [
      'Choose the style and whether the source is a website or a book.',
      'Enter the authors, title, year and other details.',
      'Press “Copy citation” and paste it into your reference list.',
    ],
  },
  'hijri-date-converter': {
    heading: 'Convert a date to the Islamic (Hijri) calendar',
    paragraphs: [
      'The Hijri calendar is a lunar calendar of twelve months, so its dates move about eleven days earlier each solar year. This converter shows any Gregorian date in the Hijri calendar using both the Umm al-Qura and the civil calculation, and also in Arabic.',
      'In many countries the start of an Islamic month is confirmed by sighting the moon, which can differ by a day from calculated calendars. For religious dates such as the start of Ramadan or Eid, follow your local announcement.',
    ],
    steps: [
      'Choose a Gregorian date.',
      'Read the Hijri date in the Umm al-Qura and civil calendars.',
      'See the date in Arabic and the day of the week.',
    ],
  },
  'freelance-rate-calculator': {
    heading: 'Work out what to charge as a freelancer',
    paragraphs: [
      'Many freelancers set their rate by guessing and then earn less than they expected. This calculator starts from the yearly income you want to take home and adds your business expenses, platform fees and tax to find the hourly and daily rate you need.',
      'Be realistic about billable hours: time spent on admin, marketing and finding clients cannot be charged, so 20 to 30 billable hours a week is common. Allow for holidays and sick days in your working weeks.',
    ],
    steps: [
      'Enter your yearly take-home goal and business expenses.',
      'Enter working weeks, billable hours per week, platform fee and tax.',
      'Read your hourly rate and day rate.',
    ],
  },
  'reading-time-calculator': {
    heading: 'See how long a text takes to read or say',
    paragraphs: [
      'Knowing the reading time helps you plan blog posts, newsletters, speeches and video scripts. Paste your text to see the word count, the time it takes to read silently and the time it takes to speak aloud.',
      'The tool uses about 230 words per minute for reading, which you can change, and 150 words per minute for speaking. A five-minute speech is therefore roughly 750 words.',
    ],
    steps: [
      'Paste your text.',
      'Adjust the reading speed if you like.',
      'Read the word count, reading time and speaking time.',
    ],
  },
  'image-upscaler': {
    heading: 'Make a small image bigger',
    paragraphs: [
      'Small images look blurry when stretched for printing, thumbnails or presentations. The Image Upscaler enlarges a picture 2×, 3× or 4× using high-quality step-by-step scaling and optional light sharpening.',
      'This is not AI upscaling: it makes an image larger and crisper, but it cannot invent detail that was never in the photo. The result is saved as a PNG, and the image is processed on your device.',
    ],
    steps: [
      'Choose your image.',
      'Pick 2×, 3× or 4× and whether to sharpen.',
      'Press “Upscale image” and download the PNG.',
    ],
  },
  'game-2048': {
    heading: 'How to play 2048',
    paragraphs: [
      '2048 is a number puzzle played on a 4×4 grid. Every move slides all the tiles in one direction, and two tiles with the same number merge into one tile with their sum. A new tile appears after each move, and the aim is to build a tile worth 2048.',
      'A reliable strategy is to keep your largest tile in one corner and build a descending chain of tiles beside it, avoiding moves that pull it away. The game runs in your browser and remembers your best score on this device.',
    ],
    steps: [
      'Use the arrow keys, or swipe on a phone, to slide the tiles.',
      'Merge matching numbers to make larger ones.',
      'Reach 2048, then keep going for a higher score.',
    ],
  },
  'snake-game': {
    heading: 'How to play Snake',
    paragraphs: [
      'Snake is a classic arcade game. You steer a snake around the board to eat the gold dots; each one makes the snake longer and the game faster. The game ends if you hit a wall or your own body.',
      'Plan a few moves ahead and leave yourself room to turn, because a long snake fills the board quickly. Moving along the edges in a steady pattern helps in the later stages. Your best score is saved on this device.',
    ],
    steps: [
      'Steer with the arrow keys or the on-screen buttons.',
      'Eat the gold dots to grow and score.',
      'Avoid the walls and your own tail.',
    ],
  },
  'memory-match': {
    heading: 'How to play Memory Match',
    paragraphs: [
      'Memory Match is a card game that trains concentration and short-term memory. Sixteen cards lie face down, hiding eight pairs. You turn over two at a time: a matching pair stays open, otherwise both cards turn back.',
      'The aim is to find all eight pairs in as few moves as possible. Try to remember where each picture was, and work through the board in a regular order rather than at random. Your best result is saved on this device.',
    ],
    steps: [
      'Tap two cards to turn them over.',
      'Remember where each picture is.',
      'Match all eight pairs in as few moves as you can.',
    ],
  },
  'tic-tac-toe': {
    heading: 'How to play Tic-Tac-Toe',
    paragraphs: [
      'Tic-Tac-Toe is a two-player game on a 3×3 grid. Players take turns placing X and O, and the first to line up three in a row, across, down or diagonally, wins. If the grid fills first, the game is a draw.',
      'You can play a friend on the same device or play against the computer. Taking the centre or a corner first gives you the most ways to win. With perfect play from both sides, every game ends in a draw.',
    ],
    steps: [
      'Choose to play a friend or the computer.',
      'Take turns placing your mark.',
      'Get three in a row to win the round.',
    ],
  },
  minesweeper: {
    heading: 'How to play Minesweeper',
    paragraphs: [
      'Minesweeper is a logic puzzle. Hidden mines are scattered under a grid of squares. Opening a square shows a number that tells you how many mines touch it, and you use those numbers to work out which squares are safe.',
      'Mark squares that you are sure contain a mine with a flag: right-click on a computer, or long-press on a phone. You win by opening every safe square, and lose if you open a mine. Start anywhere, then reason from the numbers instead of guessing.',
    ],
    steps: [
      'Click or tap a square to open it.',
      'Use the numbers to work out where the mines are.',
      'Right-click or long-press to flag a mine, and open every safe square to win.',
    ],
  },
  'connect-four': {
    heading: 'How to play Connect Four',
    paragraphs: [
      'Connect Four is a strategy game for two. Players take turns dropping coloured discs into a vertical grid, and each disc falls to the lowest free space in its column. The first to line up four discs across, down or diagonally wins.',
      'Controlling the centre column gives you more ways to connect four. Watch for places where your opponent already has three in a row and block them, and try to create two threats at once.',
    ],
    steps: [
      'Choose a column to drop your disc.',
      'Block your opponent’s lines of three.',
      'Line up four discs in any direction to win.',
    ],
  },
  hangman: {
    heading: 'How to play Hangman',
    paragraphs: [
      'Hangman is a word-guessing game. A hidden word is shown as blank spaces and you guess it one letter at a time. A correct letter appears in every place it occurs; a wrong letter costs you one of your limited tries.',
      'Begin with common letters. In English, E, A, R, I, O and T appear most often, and vowels quickly reveal the shape of the word. You win by completing the word before your tries run out.',
    ],
    steps: [
      'Pick a letter.',
      'Correct letters fill the blanks; wrong ones use up a try.',
      'Complete the word before you run out of tries.',
    ],
  },
  'reaction-time-test': {
    heading: 'Test your reaction time',
    paragraphs: [
      'Reaction time is how quickly you respond to something you see. In this test you wait for the box to turn green and click or tap as fast as you can; the result is shown in milliseconds, with the average of your last five tries.',
      'Most people score roughly between 200 and 300 milliseconds on a simple visual test. Tiredness, distraction and the screen or mouse you use all affect the result, so compare your own scores on the same device. Clicking before the box turns green does not count.',
    ],
    steps: [
      'Start the test and wait for the box to turn green.',
      'Click or tap as quickly as you can.',
      'Read your time and the average of your last five tries.',
    ],
  },
  'simon-says': {
    heading: 'How to play Simon Says',
    paragraphs: [
      'Simon Says is a memory game. Coloured pads light up in a sequence and you repeat the sequence by pressing the pads in the same order. Each round adds one more step, so the pattern grows longer and harder to remember.',
      'Saying the colours quietly to yourself, or grouping them into short chunks, makes long sequences easier to hold in mind. One mistake ends the game. Your best score is saved on this device.',
    ],
    steps: [
      'Watch the pads light up.',
      'Repeat the pattern in the same order.',
      'Keep going as the sequence gets longer.',
    ],
  },
  'block-stack': {
    heading: 'How to play Block Stack',
    paragraphs: [
      'Block Stack is a falling-blocks puzzle. Shapes made of four squares drop from the top of the board, and you move and rotate them so they fit together. A complete horizontal line disappears and scores points.',
      'The blocks fall faster every ten lines. Keep the stack low and flat, avoid leaving holes under blocks, and leave a column free for long pieces. The game ends when the stack reaches the top.',
    ],
    steps: [
      'Move the falling block left or right and rotate it.',
      'Drop it into place to complete horizontal lines.',
      'Clear lines to score before the stack reaches the top.',
    ],
  },
  'brick-breaker': {
    heading: 'How to play Brick Breaker',
    paragraphs: [
      'Brick Breaker is an arcade game in which you move a paddle to bounce a ball into a wall of bricks. Each brick the ball hits disappears, and you clear the level by breaking them all.',
      'You have three lives and lose one each time the ball gets past the paddle. Where the ball lands on the paddle changes the angle of the bounce, so use the edges to aim at the bricks that are left. It works with a keyboard or by touch.',
    ],
    steps: [
      'Move the paddle with the keyboard or by touch.',
      'Keep the ball in play.',
      'Break every brick before you lose your three lives.',
    ],
  },
  'space-defender': {
    heading: 'How to play Space Defender',
    paragraphs: [
      'Space Defender is an arcade shooter. Rows of invaders move down the screen towards you. Your ship fires automatically, so your job is to move left and right to line up the shots and clear the invaders before they reach you.',
      'Deal with the lowest invaders first, because they are closest to ending the game, and keep moving rather than waiting in one place. Your best score is saved on this device.',
    ],
    steps: [
      'Move your ship left and right.',
      'Line up with the invaders while the ship fires automatically.',
      'Clear them before they reach the bottom.',
    ],
  },
  'sky-hopper': {
    heading: 'How to play Sky Hopper',
    paragraphs: [
      'Sky Hopper is a one-button game. Your character keeps falling, and each tap or press of the space bar makes it hop upward. You steer it through the gaps between obstacles and score one point for every gap you pass.',
      'Short, regular taps keep the height steady better than long bursts. Look at the next gap rather than at the character. Touching an obstacle ends the run, and your best score is saved on this device.',
    ],
    steps: [
      'Tap the screen or press space to hop.',
      'Time your hops to pass through each gap.',
      'Score a point for every gap you clear.',
    ],
  },
  'whack-a-mole': {
    heading: 'How to play Whack-a-Mole',
    paragraphs: [
      'Whack-a-Mole is a quick reaction game. Moles pop up from their holes at random and you tap or click each one before it disappears. You have 30 seconds to hit as many as you can.',
      'Keep your eyes on the centre of the board so you can reach any hole quickly, and stay relaxed; tense hands are slower. Your best score is saved on this device, so you can try to beat it.',
    ],
    steps: [
      'Start the game.',
      'Tap or click each mole as it appears.',
      'Hit as many as you can in 30 seconds.',
    ],
  },
  sudoku: {
    heading: 'How to play Sudoku',
    paragraphs: [
      'Sudoku is a logic puzzle on a 9×9 grid divided into nine 3×3 boxes. Some numbers are given at the start, and you fill the empty cells so that every row, every column and every box contains each number from 1 to 9 exactly once.',
      'No arithmetic is needed, only logic. Look for a row, column or box that is nearly full, or for a number that can go in only one cell. Choose Easy, Medium or Hard; harder puzzles give you fewer starting numbers.',
    ],
    steps: [
      'Choose Easy, Medium or Hard.',
      'Select an empty cell and enter a number from 1 to 9.',
      'Fill the grid so that no number repeats in any row, column or box.',
    ],
  },
  'word-guess': {
    heading: 'How to play Word Guess',
    paragraphs: [
      'In Word Guess you have six tries to find a hidden five-letter English word. After each guess the letters change colour: green means the letter is in the right place, yellow means it is in the word but in a different place, and grey means it is not in the word.',
      'Start with a word that has several common letters and different vowels. Then use the colours: keep green letters where they are, move yellow letters, and avoid grey ones. You can play again with a new word as often as you like.',
    ],
    steps: [
      'Type a five-letter word and press Enter.',
      'Read the colours: green, yellow and grey.',
      'Use the clues to find the word within six tries.',
    ],
  },
  'sliding-puzzle': {
    heading: 'How to play the Sliding Puzzle',
    paragraphs: [
      'The sliding puzzle is a classic brain teaser. Numbered tiles are mixed up on a grid with one empty space, and you slide tiles into that space until they are in order from 1 to the last number, with the gap at the end.',
      'Choose a 3×3, 4×4 or 5×5 board; larger boards are harder. A good method is to solve the top row first, then the left column, and repeat on the smaller area that remains.',
    ],
    steps: [
      'Choose the board size.',
      'Tap a tile next to the empty space to slide it.',
      'Arrange the tiles in order with the empty space last.',
    ],
  },
};
