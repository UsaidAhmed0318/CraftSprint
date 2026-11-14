/**
 * CraftSprint AI — the site's own assistant. It runs entirely on our server using only CraftSprint's
 * own data (tools, categories, pages). It never calls an outside AI service, never stores or logs
 * what visitors type, never repeats the visitor's text back, and only answers about CraftSprint.
 */
import { tools, categories, type Category } from '@/data/tools';
import { toolContent } from '@/data/toolContent';
import { toolFaqs } from '@/data/toolFaqs.generated';
import { categoryInfo } from '@/lib/categories';
import { matchTools, matchToolsScored } from '@/lib/toolMatch';
import { site } from '@/lib/site';

export type Msg = { role: 'user' | 'assistant'; content: string };
export type Link = { href: string; label: string };
export type Answer = { reply: string; tools: string[]; links: Link[] };

const norm = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

const hasAny = (words: Set<string>, list: string[]) => list.some(w => words.has(w));

const STOP = new Set(
  (
    'a an the to of for in on at is are am be do does did how what which who where when why can could would should ' +
    'i me my you your it its this that these those and or with without from by as tell show give please pls plz ' +
    'use using used work works working kaise kese kaisay kya hai hain ho hun mujhe mera meri mere ko ki ka ke se ' +
    'mein me par pe chahiye chahie karna kare karo kar batao bataye bata dikhao tool tools website web site ' +
    'step steps guide tutorial istemal istamal'
  ).split(' '),
);

const HOW = [
  'how',
  'kaise',
  'kese',
  'kaisay',
  'steps',
  'step',
  'guide',
  'tutorial',
  'works',
  'work',
  'istemal',
  'istamal',
  'use',
];
const LIST = [
  'list',
  'all',
  'every',
  'which',
  'kon',
  'konsa',
  'konse',
  'kaun',
  'kitne',
  'kitni',
  'sab',
  'sare',
  'saare',
  'saari',
  'available',
  'categories',
  'category',
  'types',
  'show',
  'dikhao',
  'dikhaye',
  'batao',
  'bataen',
  'options',
];

/** Words (and Roman Urdu words) that point to a category. */
const CAT_WORDS: Record<Category, string[]> = {
  'Image Tools': [
    'image',
    'images',
    'photo',
    'photos',
    'picture',
    'pictures',
    'tasveer',
    'jpg',
    'png',
    'webp',
  ],
  'Color Tools': ['color', 'colors', 'colour', 'colours', 'palette', 'rang'],
  'CSS & Web Design': ['css', 'design', 'gradient', 'flexbox'],
  'QR & Barcode': ['qr', 'barcode', 'barcodes'],
  'PDF Tools': ['pdf', 'pdfs'],
  'Documents & Business': ['document', 'documents', 'resume', 'invoice', 'receipt', 'business', 'cv'],
  'Developer Tools': ['developer', 'developers', 'dev', 'coding', 'programmer', 'json', 'regex', 'code'],
  'Security & Passwords': ['security', 'password', 'passwords', 'secure'],
  'SEO Tools': ['seo', 'meta', 'sitemap'],
  'Writing & Text': ['writing', 'text', 'word', 'words', 'case'],
  'Video & Audio': ['video', 'videos', 'audio', 'music', 'mp3', 'gif'],
  'Finance Calculators': ['finance', 'financial', 'loan', 'money', 'tax', 'zakat', 'currency'],
  'Everyday Calculators': ['calculator', 'calculators', 'bmi', 'age', 'calories', 'percentage'],
  'Math & Engineering': ['math', 'maths', 'engineering', 'gpa', 'ohm'],
  Productivity: ['productivity', 'timer', 'kanban', 'planner'],
  Games: ['game', 'games', 'play', 'khel', 'puzzle', 'arcade'],
};

type Page = { keys: string[]; href: string; label: string; text: string };
const PAGES: Page[] = [
  {
    keys: [
      'contact',
      'support',
      'bug',
      'bugs',
      'problem',
      'issue',
      'feedback',
      'suggest',
      'suggestion',
      'request',
      'complaint',
      'rabta',
      'email',
      'whatsapp',
    ],
    href: '/contact',
    label: 'Contact',
    text: `You can reach us from the Contact page: report a problem, ask a question or request a new tool. You can also email ${site.email}, or use the green WhatsApp button on the site.`,
  },
  {
    keys: [
      'privacy',
      'safe',
      'safety',
      'secure',
      'security',
      'private',
      'upload',
      'uploaded',
      'data',
      'cookies',
      'tracking',
      'mehfooz',
      'mehfuz',
    ],
    href: '/privacy',
    label: 'Privacy Policy',
    text: 'Most CraftSprint tools run inside your own browser, so your files and text stay on your device and are not uploaded. CraftSprint does not need an account from you and does not store your chats with this assistant. The full details are on the Privacy page.',
  },
  {
    keys: ['cookie', 'cookies'],
    href: '/cookies',
    label: 'Cookie policy',
    text: 'CraftSprint keeps your preferences (theme, language, favourites, high scores) in your own browser. Google Analytics and Google AdSense use cookies to measure visits and show ads; where the law requires it, you are asked first. The Cookie policy explains how to control or delete them.',
  },
  {
    keys: ['faq', 'faqs', 'questions'],
    href: '/faq',
    label: 'FAQ',
    text: 'The FAQ page answers the most common questions about CraftSprint: price, privacy, installing the app, supported devices, file limits and getting help. Each tool page also has its own questions.',
  },
  {
    keys: ['terms', 'conditions', 'rules', 'legal', 'licence', 'license'],
    href: '/terms',
    label: 'Terms',
    text: 'The rules for using CraftSprint are on the Terms page.',
  },
  {
    keys: ['about', 'team', 'owner', 'founder', 'company', 'mission'],
    href: '/about',
    label: 'About',
    text: 'You can read about CraftSprint and who builds it on the About page.',
  },
  {
    keys: ['blog', 'article', 'articles', 'post', 'posts', 'guides', 'learn'],
    href: '/blog',
    label: 'Blog',
    text: 'Our Blog has step-by-step guides, for example how to compress images, merge PDFs or choose between JPG, PNG and WebP.',
  },
  {
    keys: ['prompt', 'prompts'],
    href: '/prompts',
    label: 'Prompt library',
    text: 'The Prompt library has ready-to-use prompts for writing, business, coding, careers, study, images and SEO. Open one and press Copy.',
  },
  {
    keys: ['workspace'],
    href: '/workspace',
    label: 'File workspace',
    text: 'The File workspace is a place to work with your files using several tools together.',
  },
  {
    keys: ['favourite', 'favourites', 'favorite', 'favorites', 'saved', 'bookmark', 'bookmarks', 'mytools'],
    href: '/my-tools',
    label: 'My tools',
    text: 'The My tools page shows the tools you saved as favourites on this device.',
  },
  {
    keys: ['service', 'services', 'hire', 'development', 'freelance'],
    href: '/services',
    label: 'Services',
    text: 'If you need a website or a custom online tool built, see the Services page.',
  },
  {
    keys: ['offline', 'install', 'app', 'pwa', 'homescreen'],
    href: '/offline',
    label: 'Offline page',
    text: 'CraftSprint can be added to your phone or computer like an app (use “Add to Home Screen” or “Install” in your browser menu). Many tools keep working without a connection after the first visit.',
  },
];

const FREE_KEYS = [
  'free',
  'price',
  'paid',
  'cheap',
  'signup',
  'register',
  'account',
  'login',
  'mufat',
  'muft',
];
/** Requests CraftSprint AI must never help with. */
const HARMFUL =
  /\b(hack(ing)?|crack(ing)?|phishing|malware|ransomware|keylogger|ddos|steal(ing)? (password|account|data)|carding|bomb|explosive|weapon|gun|drugs?|porn|nude|nudes|sex(ual)?|deepfake|fake (id|passport|document|currency)|forge|counterfeit)\b/i;
/** Signs that someone may be in crisis — answer with care and point to real help. */
const CRISIS =
  /\b(suicide|suicidal|kill myself|end my life|self harm|self-harm|hurt myself|khudkushi|khud kushi|marna chahta|marna chahti|jeena nahi)\b/i;
const SAFE_GUARD =
  /(ignore (all |any |the )?(previous|prior|above) |system prompt|jailbreak|api key|secret key|your instructions|developer mode)/i;

/** Finds a tool the visitor named (full name or address words), preferring the longest match. */
function findNamedTool(q: string) {
  const padded = ` ${q} `;
  let best: (typeof tools)[number] | undefined;
  let bestLen = 0;
  for (const t of tools) {
    for (const cand of [norm(t.name), norm(t.slug.replace(/-/g, ' '))]) {
      if (cand.length >= 4 && padded.includes(` ${cand} `) && cand.length > bestLen) {
        best = t;
        bestLen = cand.length;
      }
    }
  }
  return best;
}

const out = (reply: string, toolSlugs: string[] = [], links: Link[] = []): Answer => ({
  reply,
  tools: [...new Set(toolSlugs)].slice(0, 12),
  links: links.slice(0, 8),
});

const catLink = (c: Category): Link => ({
  href: `/category/${categoryInfo[c].slug}`,
  label: categoryInfo[c].short,
});

const SCOPE =
  'I can only help with CraftSprint. Ask me to find a tool (for example “compress a photo”), how a tool works, which tools are in a category, or where to find a page like Contact, Privacy or Blog.';

function stepsFor(slug: string) {
  const s = toolContent[slug]?.steps;
  return s?.length ? s.map((x, i) => `${i + 1}) ${x}`).join('\n') : '';
}

function describeTool(t: (typeof tools)[number], withSteps: boolean): Answer {
  const steps = withSteps ? stepsFor(t.slug) : '';
  const how = withSteps
    ? steps
      ? `\n\nHow to use it:\n${steps}`
      : '\n\nHow to use it:\n1) Open the tool.\n2) Add your file or type your values.\n3) Press the main button and use or download the result.'
    : '';
  const about = toolContent[t.slug]?.paragraphs?.[0];
  const reply = `${t.name} (${categoryInfo[t.category].short}): ${t.description}${about ? `\n\n${about}` : ''}${how}`;
  const more = matchTools(`${t.name} ${t.category}`, 6)
    .filter(x => x.slug !== t.slug && x.category === t.category)
    .slice(0, 3)
    .map(x => x.slug);
  return out(reply, [t.slug, ...more], [catLink(t.category)]);
}

function listCategory(c: Category): Answer {
  const list = tools.filter(t => t.category === c);
  const names = list.map(t => t.name).join(', ');
  return out(
    `${categoryInfo[c].short} has ${list.length} ${c === 'Games' ? 'games' : 'tools'}: ${names}.`,
    list.slice(0, 12).map(t => t.slug),
    [{ href: `/category/${categoryInfo[c].slug}`, label: `All ${categoryInfo[c].short}` }],
  );
}

function overview(): Answer {
  const games = tools.filter(t => t.category === 'Games').length;
  const lines = categories.map(
    c => `• ${categoryInfo[c].short}: ${tools.filter(t => t.category === c).length}`,
  );
  return out(
    `CraftSprint has ${tools.length - games} free tools and ${games} games in ${categories.length} categories:\n${lines.join('\n')}\n\nTell me a category (like “PDF tools”) and I will list them all, or describe what you want to do.`,
    [],
    [{ href: '/tools', label: 'All tools' }, ...categories.map(catLink)],
  );
}

/** Only confident matches count: a single word found in a description is not enough. */
const solid = (text: string, limit: number) =>
  matchToolsScored(text, limit)
    .filter(x => x.s >= 2)
    .map(x => x.t);

const INTENTS: { re: RegExp; slug: string; say: string; more?: string[] }[] = [
  {
    re: /\b(\d+\s?kb|under \d+|size kam|kam size|chota|chhota|smaller|reduce (the )?size|make (it|my).*(small|smaller|lighter))\b.*\b(photo|image|picture|pic|jpg|png)|\b(photo|image|picture|pic|jpg|png)\b.*\b(\d+\s?kb|under \d+|size kam|kam|chota|chhota|smaller|reduce)\b/,
    slug: 'image-compressor',
    say: 'Use the Image Compressor: lower the quality slider until the size is under your limit, and watch the new size update.',
    more: ['image-resizer', 'image-studio'],
  },
  {
    re: /\b(remove|hata|hatao|erase|delete)\b.*\b(background|bg)\b|\b(background|bg)\b.*\b(remove|hata|hatao|erase|delete|transparent)\b/,
    slug: 'background-remover',
    say: 'Use the AI Background Remover: choose “Best quality — any subject”, add your photo and press Remove background.',
    more: ['solid-background-remover'],
  },
  {
    re: /\b(merge|combine|join|jor|jod)\b.*\bpdfs?\b|\bpdfs?\b.*\b(merge|combine|join|jor|jod)\b/,
    slug: 'pdf-merge',
    say: 'Use PDF Merge: select all your PDFs at once, put them in order with the arrows, then press Merge.',
  },
  {
    re: /\bpdfs?\b.*\b(compress|smaller|size|chota|chhota|kam)\b|\b(compress|reduce)\b.*\bpdfs?\b/,
    slug: 'pdf-compressor',
    say: 'Use the PDF Compressor to make the file smaller for email or upload forms.',
  },
  {
    re: /\b(youtube|yt)\b.*\bthumbnail\b|\bthumbnail\b.*\b(make|bana|size|resize)\b/,
    slug: 'image-studio',
    say: 'Use Image Studio and pick the “YouTube thumbnail 1280×720” preset. To take a frame from a video, use the Video Thumbnail Grabber.',
    more: ['video-thumbnail-grabber'],
  },
  {
    re: /\b(slow|speed|fast|tez|ahista)\b.*\b(audio|song|voice|mp3|awaz|aawaz)\b|\b(audio|song|voice|mp3|awaz|aawaz)\b.*\b(slow|speed|fast|tez|ahista)\b/,
    slug: 'audio-speed-changer',
    say: 'Use the Audio Speed Changer. Keep “Keep the voice natural” on so the voice does not change.',
  },
  {
    re: /^(?!.*\b(kya|kia|what)\b).*(\biphone\b.*\b(photo|pic|heic)\b|\bheic\b)/,
    slug: 'heic-to-jpg',
    say: 'Use HEIC to JPG to open iPhone photos anywhere.',
  },
];

/** Questions about CraftSprint as a whole (privacy, safety, install, languages…). */
export const SITE_FAQ: { q: string; a: string; link?: Link }[] = [
  {
    q: 'Are my files uploaded to a server? Is it safe and private?',
    a: 'No. Almost every CraftSprint tool runs inside your own browser, so your images, PDFs, audio and video stay on your device. Nothing you type in a tool is stored. Only a few tools that need the internet (live currency rates, website speed, domain age) send the small piece of information they need, and they say so on the page.',
    link: { href: '/privacy', label: 'Privacy policy' },
  },
  {
    q: 'Is CraftSprint free? Do I need an account or sign up?',
    a: 'Yes, every tool and game is free, with no sign-up, no watermark and no daily limit. The site is supported by advertising.',
    link: { href: '/tools', label: 'All tools' },
  },
  {
    q: 'Can I install CraftSprint as an app on my phone or use it offline?',
    a: 'Yes. Tap “Install App” (or “Add to Home Screen” in your browser menu). You can install the whole site or a single tool, and pages you have opened also work without internet.',
    link: { href: '/tools', label: 'All tools' },
  },
  {
    q: 'Which languages does CraftSprint support?',
    a: 'Menus are available in English, Urdu, Arabic, Hindi, Spanish and French (use the language button in the header). Tools work with text in any language.',
  },
  {
    q: 'Does it work on mobile phones, iPhone and Android?',
    a: 'Yes. Every tool works on phones, tablets and computers in modern browsers such as Chrome, Safari, Edge and Firefox.',
  },
  {
    q: 'How do I report a problem or contact you?',
    a: 'Use the Contact page or the WhatsApp button. Tell us which tool, what you did and what went wrong, and we will fix it.',
    link: { href: '/contact', label: 'Contact' },
  },
  {
    q: 'Is there a file size limit?',
    a: 'CraftSprint sets no fixed limit. Because files are processed on your device, very large files depend on your phone or computer’s memory — big videos and PDFs are fastest on a computer.',
  },
  {
    q: 'Who made CraftSprint?',
    a: 'CraftSprint is built and maintained by the team behind Over The Stack Solutions, a software development company. Every tool is tested with real files before it goes live.',
    link: { href: '/about', label: 'About' },
  },
];

const contentWords = (text: string) =>
  norm(text)
    .split(' ')
    .filter(w => w.length > 2 && !STOP.has(w));

/** Best FAQ for a question (from one tool, or from all tools and the site), only when clearly related. */
function bestFaq(q: string, slug?: string): { q: string; a: string; slug?: string; link?: Link } | null {
  const qw = new Set(contentWords(q));
  if (!qw.size) return null;
  const pool: { q: string; a: string; slug?: string; link?: Link }[] = slug
    ? (toolFaqs[slug] || []).map(f => ({ ...f, slug }))
    : [...SITE_FAQ, ...Object.entries(toolFaqs).flatMap(([sl, list]) => list.map(f => ({ ...f, slug: sl })))];
  let best: (typeof pool)[number] | null = null;
  let bestScore = 0;
  for (const f of pool) {
    const fq = new Set(contentWords(f.q));
    const fa = new Set(contentWords(f.a));
    let score = 0;
    for (const w of qw) {
      if (fq.has(w)) score += 2;
      else if (fa.has(w)) score += 0.5;
    }
    const cover = score / (2 * qw.size);
    const ok = slug
      ? score >= 2 && cover >= 0.3
      : (score >= 4 && cover >= 0.45) || (score >= 2 && cover >= 0.99 && qw.size <= 2);
    if (score > bestScore && ok) {
      best = f;
      bestScore = score;
    }
  }
  return best;
}

function faqAnswer(f: { q: string; a: string; slug?: string; link?: Link }): Answer {
  const t = f.slug ? tools.find(x => x.slug === f.slug) : undefined;
  return out(f.a, t ? [t.slug] : [], f.link ? [f.link] : t ? [catLink(t.category)] : []);
}

/** The whole answer engine. `messages` is the recent conversation; the last user message is answered. */
export function answerFromSite(messages: Msg[]): Answer {
  const last = [...messages].reverse().find(m => m.role === 'user');
  const raw = (last?.content ?? '').slice(0, 500);
  const q = norm(raw);
  if (!q) return out(SCOPE, [], [{ href: '/tools', label: 'All tools' }]);
  const words = new Set(q.split(' '));
  const has = (...l: string[]) => hasAny(words, l);

  if (CRISIS.test(raw))
    return out(
      'I’m really sorry you’re feeling this way. You don’t have to go through it alone — please talk to someone you trust right now, or contact your local emergency number or a crisis helpline in your country. If you are in immediate danger, call emergency services.',
    );
  if (HARMFUL.test(raw))
    return out(
      'I can’t help with that. I’m here to help you use CraftSprint’s tools safely — for example compressing images, merging PDFs or making a QR code.',
      ['image-compressor', 'pdf-merge', 'qr-code-generator'],
    );
  if (SAFE_GUARD.test(raw))
    return out(
      'I can’t help with that. I never ask for or share private data, keys or passwords. I can help you find and use CraftSprint tools.',
      [],
      [{ href: '/tools', label: 'All tools' }],
    );

  // Greeting / thanks / goodbye (short messages only, so real questions are never swallowed).
  if (words.size <= 4) {
    if (has('hi', 'hello', 'hey', 'salam', 'salaam', 'assalam', 'assalamualaikum', 'aoa', 'hola', 'namaste'))
      return out(
        'Hi! Welcome to CraftSprint. Tell me what you want to do, like “make my photo smaller” or “combine two PDFs”, and I will show you the right tool.',
        ['image-compressor', 'pdf-merge', 'qr-code-generator'],
      );
    if (has('thanks', 'thank', 'thx', 'shukriya', 'shukria', 'jazakallah'))
      return out('You’re welcome! Ask me anything else about CraftSprint.');
    if (has('bye', 'goodbye', 'hafiz')) return out('Goodbye! Come back any time.');
  }

  // Who are you / what is CraftSprint.
  if (
    /\b(who are you|what are you|what is craftsprint|what is this (site|website)|tum kon|aap kon|ye kya hai|yeh kya hai)\b/.test(
      q,
    )
  )
    return out(
      `I’m CraftSprint AI, the assistant of this website. CraftSprint offers ${tools.length} free online tools and games for images, PDFs, text, code, finance and more. Most of them run in your browser with no sign-up. I answer only about this website.`,
      [],
      [
        { href: '/tools', label: 'All tools' },
        { href: '/about', label: 'About' },
      ],
    );

  // How many tools.
  if (/\b(how many|kitne|kitni|count|total|number of)\b/.test(q) && has('tools', 'tool', 'games', 'game')) {
    const games = tools.filter(t => t.category === 'Games').length;
    return out(
      `CraftSprint has ${tools.length - games} tools and ${games} games (${tools.length} in total) in ${categories.length} categories.`,
      [],
      [{ href: '/tools', label: 'All tools' }],
    );
  }

  // Is it free / do I need an account.
  if ((has(...FREE_KEYS) || (has('cost') && !solid(q, 1).length)) && !findNamedTool(q))
    return out(
      'Yes. Every CraftSprint tool is free to use, with no sign-up or account needed. There is no watermark and no daily limit on the tools.',
      [],
      [{ href: '/tools', label: 'All tools' }],
    );

  const named = findNamedTool(q);
  const howIntent = has(...HOW) || /\b(kaise kare|kese kare|kaise karte)\b/.test(q);
  const listIntent = has(...LIST);

  // A specific tool by name: answer from its own FAQ when the question matches one,
  // otherwise describe it (with steps if the visitor asked how).
  if (named) {
    const rest = q.replace(norm(named.name), ' ').replace(norm(named.slug.replace(/-/g, ' ')), ' ');
    const f = !howIntent ? bestFaq(rest, named.slug) : null;
    if (f) return faqAnswer(f);
    return describeTool(named, howIntent || has('steps', 'step', 'guide'));
  }
  // Common wishes that should always open the right tool.
  const intent = INTENTS.find(x => x.re.test(q));
  if (intent) {
    const t = tools.find(x => x.slug === intent.slug)!;
    if (howIntent) return describeTool(t, true);
    return out(
      `${intent.say}\n\n${t.name}: ${t.description}`,
      [t.slug, ...(intent.more || [])],
      [catLink(t.category)],
    );
  }
  // A general question that one of the site or tool FAQs answers.
  const faq = bestFaq(q);
  const clear = solid(q, 3);
  if (faq && !howIntent && (!faq.slug || !clear.length || clear.some(t => t.slug === faq.slug)))
    return faqAnswer(faq);

  // "tools of a category" / "list of all tools".
  const cat = categories.find(c => hasAny(words, CAT_WORDS[c]));
  if (listIntent && cat && !has('compress', 'convert', 'merge', 'resize')) return listCategory(cat);
  if (
    listIntent &&
    has(
      'tools',
      'tool',
      'categories',
      'category',
      'types',
      'options',
      'available',
      'website',
      'site',
      'sab',
      'sare',
      'saari',
      'saare',
    )
  )
    return overview();
  if (listIntent && cat) return listCategory(cat);

  // Pages of the site (only when the visitor is not clearly asking for a tool action).
  const toolish = solid(
    q
      .split(' ')
      .filter(w => !STOP.has(w))
      .join(' '),
    3,
  );
  const page = PAGES.find(p => hasAny(words, p.keys));
  if (
    page &&
    (!toolish.length || has('page', 'where', 'kahan', 'kidhar', 'link', 'open', ...page.keys.slice(0, 3)))
  )
    return out(page.text, [], [{ href: page.href, label: page.label }]);
  if (has('where', 'kahan', 'kidhar', 'page', 'pages', 'menu', 'navigate', 'navigation') && !toolish.length)
    return out(
      'Main pages: Tools (everything in one place), Blog (guides), Prompts (ready-made prompts), My tools (your favourites), About, Contact, Privacy and Terms.',
      [],
      [
        { href: '/tools', label: 'All tools' },
        { href: '/blog', label: 'Blog' },
        { href: '/prompts', label: 'Prompts' },
        { href: '/my-tools', label: 'My tools' },
        { href: '/contact', label: 'Contact' },
        { href: '/privacy', label: 'Privacy' },
      ],
    );

  // Find the best tool for what the visitor wants.
  let found = toolish;
  if (!found.length) {
    // Follow-up like “how does it work?”: use the last tool mentioned earlier in the chat.
    const prior = [...messages]
      .reverse()
      .map(m => findNamedTool(norm(m.content)))
      .find(Boolean);
    if (prior && (howIntent || has('it', 'this', 'that'))) return describeTool(prior, true);
    if (cat) return listCategory(cat);
    return out(
      SCOPE,
      ['image-compressor', 'pdf-merge', 'qr-code-generator'],
      [
        { href: '/tools', label: 'All tools' },
        { href: '/contact', label: 'Contact' },
      ],
    );
  }
  found = solid(
    q
      .split(' ')
      .filter(w => !STOP.has(w))
      .join(' '),
    5,
  );
  const best = found[0];
  if (howIntent) return { ...describeTool(best, true), tools: found.map(t => t.slug) };
  const rest = found.slice(1).map(t => t.name);
  return out(
    `Best match: ${best.name}. ${best.description}${rest.length ? `\n\nAlso useful: ${rest.join(', ')}.` : ''}\n\nAsk “how to use ${best.name}” for step-by-step help.`,
    found.map(t => t.slug),
    [catLink(best.category)],
  );
}
