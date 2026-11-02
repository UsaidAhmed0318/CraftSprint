/**
 * Every blog post lives here.
 * To publish a new post, copy one entry, change the text and save — the page, blog list and sitemap update by themselves.
 * `tools` lists tool slugs to recommend at the end of the post.
 * Posts without `sections` are older posts that have their own page folder under app/blog/.
 */
export type Post = {
  slug: string;
  title: string;
  description: string;
  topic: string;
  date: string; // YYYY-MM-DD
  tools: string[];
  sections?: { heading: string; paragraphs: string[] }[];
};

export const posts: Post[] = [
  {
    slug: 'merge-pdf-files-free',
    title: 'How to Merge PDF Files for Free (Without Uploading Them)',
    description:
      'Combine several PDFs into one document in your browser, keep the right page order and make the final file small enough to email.',
    topic: 'PDF',
    date: '2026-10-28',
    tools: ['pdf-merge', 'pdf-split', 'pdf-compressor', 'image-to-pdf-converter'],
    sections: [
      {
        heading: 'Why merge PDFs at all?',
        paragraphs: [
          'Job applications, visa forms, university admissions and client reports often ask for a single file. Sending one tidy PDF instead of five attachments looks more professional and makes sure nothing gets lost or read in the wrong order.',
        ],
      },
      {
        heading: 'Merge PDFs in three steps',
        paragraphs: [
          'Open the PDF merge tool and add the files you want to combine. Drag them into the order they should appear — for example cover letter first, then CV, then certificates. Download the merged file and open it once to check every page is there.',
          'Because the tool runs in your browser, your documents are never uploaded to a server. That matters for passports, bank statements and contracts.',
        ],
      },
      {
        heading: 'Only need some pages?',
        paragraphs: [
          'Split the original file first and keep just the pages you need, then merge those parts. This is handy when a long report has an appendix the reader does not need.',
        ],
      },
      {
        heading: 'Got photos or scans instead of PDFs?',
        paragraphs: [
          'Turn JPG or PNG scans into a PDF with the image to PDF converter, then merge them with your other documents.',
        ],
      },
      {
        heading: 'Make the final file smaller',
        paragraphs: [
          'Many email services and upload forms limit attachments to around 10–25 MB. If your merged file is too big, run it through the PDF compressor. Scanned pages are usually the biggest, so scanning at 150–200 DPI instead of 600 DPI also helps a lot.',
        ],
      },
    ],
  },
  {
    slug: 'how-to-create-a-strong-password',
    title: 'How to Create a Strong Password You Don’t Have to Remember',
    description:
      'What makes a password strong, why length beats complexity, and a simple routine for keeping every account safe.',
    topic: 'Security',
    date: '2026-10-28',
    tools: ['password-generator', 'password-strength-checker', 'hash-generator'],
    sections: [
      {
        heading: 'What actually makes a password strong',
        paragraphs: [
          'Attackers guess passwords with software that tries billions of combinations and lists of leaked passwords. A password is strong when it is long, random and used nowhere else. Length matters most: every extra character multiplies the number of guesses needed.',
          'Names, birthdays, keyboard patterns like “qwerty123” and words with a number on the end are the first things guessing software tries.',
        ],
      },
      {
        heading: 'A simple rule that works',
        paragraphs: [
          'Use at least 16 characters with a mix of upper- and lowercase letters, numbers and symbols, and never reuse a password on two sites. If one site is breached, reused passwords let attackers into your other accounts too.',
        ],
      },
      {
        heading: 'Let a generator do the work',
        paragraphs: [
          'People are bad at being random. The password generator uses your browser’s secure random source to create passwords no one can predict, and it never sends them anywhere. Copy the result straight into the sign-up form.',
        ],
      },
      {
        heading: 'Store them, don’t memorise them',
        paragraphs: [
          'A password manager remembers every password for you, so you only need one strong master password. Turn on two-factor authentication for email and banking — even a stolen password is then not enough to get in.',
          'Want to check an existing password? The password strength checker rates how strong it is and shows what would make it stronger.',
        ],
      },
    ],
  },
  {
    slug: 'what-is-json-and-how-to-format-it',
    title: 'What Is JSON? A Plain-English Guide to Reading and Formatting It',
    description:
      'Understand JSON objects, arrays and common syntax errors, and learn how to format, validate and convert JSON quickly.',
    topic: 'Developers',
    date: '2026-10-28',
    tools: ['json-formatter', 'json-to-typescript', 'json-to-csv-converter', 'csv-to-json-converter'],
    sections: [
      {
        heading: 'JSON in one minute',
        paragraphs: [
          'JSON (JavaScript Object Notation) is the most common way apps and websites send data to each other. It is plain text made of objects in curly braces {} with "key": value pairs, and arrays in square brackets [] holding lists of values.',
          'Values can be text in double quotes, numbers, true, false, null, or other objects and arrays.',
        ],
      },
      {
        heading: 'The errors that break JSON',
        paragraphs: [
          'Most invalid JSON comes from a handful of mistakes: a trailing comma after the last item, single quotes instead of double quotes, keys without quotes, comments (JSON does not allow them) and a missing closing bracket.',
          'Paste the text into the JSON formatter: valid JSON becomes neatly indented, and invalid JSON is flagged so you know to look for one of these mistakes.',
        ],
      },
      {
        heading: 'Format for reading, minify for shipping',
        paragraphs: [
          'Indented JSON is easier for people to read and review. Minified JSON removes every unnecessary space, which makes files and API responses smaller. The formatter does both.',
        ],
      },
      {
        heading: 'Turning JSON into something else',
        paragraphs: [
          'Working in TypeScript? Paste a sample response into JSON to TypeScript to get matching interfaces. Need the data in a spreadsheet? JSON to CSV turns an array of objects into rows and columns, and CSV to JSON goes the other way.',
        ],
      },
    ],
  },
  {
    slug: 'how-to-calculate-loan-emi',
    title: 'How to Calculate Loan EMI (With Formula and Example)',
    description:
      'Learn how monthly loan instalments are worked out, how interest rate and term change the total you pay, and how to compare offers.',
    topic: 'Money',
    date: '2026-10-28',
    tools: [
      'loan-emi-calculator',
      'compound-interest-calculator',
      'percentage-calculator',
      'currency-converter',
    ],
    sections: [
      {
        heading: 'What EMI means',
        paragraphs: [
          'An equated monthly instalment (EMI) is the fixed amount you pay each month on a loan. Early payments are mostly interest; later payments are mostly principal, but the total stays the same every month.',
        ],
      },
      {
        heading: 'The formula',
        paragraphs: [
          'EMI = P × r × (1 + r)^n ÷ ((1 + r)^n − 1). P is the loan amount, r is the monthly interest rate (annual rate ÷ 12 ÷ 100) and n is the number of monthly payments.',
          'Example: a loan of 1,000,000 at 12% a year for 5 years gives r = 0.01 and n = 60, so the EMI is about 22,244. Over five years you repay about 1,334,667 — roughly 334,667 in interest.',
        ],
      },
      {
        heading: 'What changes the total most',
        paragraphs: [
          'A longer term lowers the monthly payment but raises the total interest, often by a lot. A small change in the interest rate also adds up over many years. Put two offers side by side in the loan EMI calculator and compare the “total interest” line, not just the monthly figure.',
        ],
      },
      {
        heading: 'Before you sign',
        paragraphs: [
          'Ask about processing fees, insurance and early-repayment charges, since these are not part of the EMI formula. This guide is general information, not financial advice — check the final terms with your lender.',
        ],
      },
    ],
  },
  {
    slug: 'qr-code-for-business',
    title: 'How to Make a QR Code for Your Business (That Actually Scans)',
    description:
      'Practical tips for QR codes on menus, flyers, shop counters and business cards — size, contrast, testing and what to link to.',
    topic: 'Marketing',
    date: '2026-10-28',
    tools: ['qr-code-generator', 'qr-code-scanner', 'utm-link-builder', 'barcode-generator'],
    sections: [
      {
        heading: 'Decide what the code should open',
        paragraphs: [
          'Good choices are your menu, a WhatsApp chat link, your Google review page, a booking form or a product page. Link to a page that works well on a phone, because that is where every scan happens.',
        ],
      },
      {
        heading: 'Track who scans it',
        paragraphs: [
          'Add campaign tags to your link with the UTM link builder before creating the code. Your analytics will then show how many visitors came from the flyer or the shop counter.',
        ],
      },
      {
        heading: 'Create and download',
        paragraphs: [
          'Paste the link into the QR code generator and download the image. Shorter links produce simpler codes that scan faster and survive small print sizes.',
        ],
      },
      {
        heading: 'Print it so it scans',
        paragraphs: [
          'Print the code at least 2 × 2 cm, larger for posters read from a distance. Keep strong contrast — dark code on a light background — and leave a clear margin around it. Avoid glossy surfaces that reflect light.',
          'Always test the printed proof with two or three different phones before printing hundreds of copies. You can also check it with the QR code scanner.',
        ],
      },
    ],
  },
  {
    slug: 'ohms-law-explained',
    title: 'Ohm’s Law Explained Simply (Voltage, Current, Resistance and Power)',
    description:
      'A beginner-friendly explanation of Ohm’s law and electrical power with worked examples for students and hobbyists.',
    topic: 'Engineering',
    date: '2026-10-28',
    tools: ['ohms-law-calculator', 'resistor-color-code', 'scientific-calculator', 'unit-converter'],
    sections: [
      {
        heading: 'The three quantities',
        paragraphs: [
          'Voltage (V, in volts) is the electrical “push”. Current (I, in amperes) is how much charge flows. Resistance (R, in ohms, Ω) is how strongly a component resists that flow.',
        ],
      },
      {
        heading: 'Ohm’s law',
        paragraphs: [
          'V = I × R. Rearranged, I = V ÷ R and R = V ÷ I. Example: a 12 V supply across a 100 Ω resistor drives a current of 12 ÷ 100 = 0.12 A (120 mA).',
        ],
      },
      {
        heading: 'Adding power',
        paragraphs: [
          'Power (P, in watts) is P = V × I, which also gives P = I² × R and P = V² ÷ R. In the example above the resistor turns 12 × 0.12 = 1.44 W into heat, so a small ¼ W resistor would overheat — you would need one rated for at least 2 W.',
          'The Ohm’s law calculator finds the other two values from any two you know.',
        ],
      },
      {
        heading: 'Reading real resistors',
        paragraphs: [
          'Through-hole resistors show their value with coloured bands. Use the resistor colour code tool to turn the bands into ohms and tolerance before you build your circuit.',
          'Always work safely: mains electricity is dangerous and should only be handled by qualified people.',
        ],
      },
    ],
  },
  {
    slug: 'compress-images',
    title: 'How to Compress Images Without Losing Too Much Quality',
    description:
      'A practical guide to choosing dimensions, formats and quality settings for smaller image files.',
    topic: 'Images',
    date: '2026-05-01',
    tools: ['image-compressor'],
  },
  {
    slug: 'jpg-png-webp',
    title: 'JPG vs PNG vs WebP: Which Should You Use?',
    description:
      'Understand the trade-offs between common image formats for websites, documents and sharing.',
    topic: 'Images',
    date: '2026-05-01',
    tools: ['image-converter'],
  },
  {
    slug: 'resize-images',
    title: 'How to Resize an Image for a Website',
    description: 'Learn how pixel dimensions, aspect ratio and image size affect website images.',
    topic: 'Images',
    date: '2026-05-01',
    tools: ['image-resizer'],
  },
];
