/**
 * CraftSprint AI — the site's own assistant. It runs entirely on our server using only CraftSprint's
 * own data (tools, categories, pages). It never calls an outside AI service, never stores or logs
 * what visitors type, never repeats the visitor's text back, and only answers about CraftSprint.
 */
import { tools, categories, type Category } from '@/data/tools';
import { toolContent } from '@/data/toolContent';
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
  const reply = `${t.name} (${categoryInfo[t.category].short}): ${t.description}${how}`;
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

/** The whole answer engine. `messages` is the recent conversation; the last user message is answered. */
export function answerFromSite(messages: Msg[]): Answer {
  const last = [...messages].reverse().find(m => m.role === 'user');
  const raw = (last?.content ?? '').slice(0, 500);
  const q = norm(raw);
  if (!q) return out(SCOPE, [], [{ href: '/tools', label: 'All tools' }]);
  const words = new Set(q.split(' '));
  const has = (...l: string[]) => hasAny(words, l);

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

  // A specific tool by name: describe it (with steps if the visitor asked how).
  if (named) return describeTool(named, howIntent || has('steps', 'step', 'guide'));

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
