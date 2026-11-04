import type { Category } from '@/data/tools';
import {
  Image as ImageIcon,
  Briefcase,
  Calculator,
  Clapperboard,
  Code,
  FileSignature,
  FileText,
  Gamepad2,
  Palette,
  PenLine,
  PenTool,
  QrCode,
  Search,
  ShieldCheck,
  Sigma,
  Wallet,
  type LucideIcon,
} from 'lucide-react';

export const categoryIcon: Record<Category, LucideIcon> = {
  'Image Tools': ImageIcon,
  'Color Tools': Palette,
  'CSS & Web Design': PenTool,
  'QR & Barcode': QrCode,
  'PDF Tools': FileText,
  'Documents & Business': FileSignature,
  'Developer Tools': Code,
  'Security & Passwords': ShieldCheck,
  'SEO Tools': Search,
  'Writing & Text': PenLine,
  'Video & Audio': Clapperboard,
  'Finance Calculators': Wallet,
  'Everyday Calculators': Calculator,
  'Math & Engineering': Sigma,
  Productivity: Briefcase,
  Games: Gamepad2,
};

export const categoryInfo: Record<
  Category,
  { slug: string; short: string; title: string; description: string }
> = {
  'Image Tools': {
    slug: 'image-tools',
    short: 'Images',
    title: 'Free Online Image Tools',
    description:
      'Compress, convert, resize, crop and watermark images, remove plain backgrounds and make favicons — all inside your browser.',
  },
  'Color Tools': {
    slug: 'color-tools',
    short: 'Colors',
    title: 'Free Color Tools',
    description:
      'Convert colour codes, build palettes, pull colours from a photo and check text contrast for accessibility.',
  },
  'CSS & Web Design': {
    slug: 'css-design-tools',
    short: 'CSS & Design',
    title: 'Free CSS & Web Design Generators',
    description:
      'Generate CSS gradients, shadows, rounded corners, grids, flexbox, animations and SVG patterns, and preview font pairings.',
  },
  'QR & Barcode': {
    slug: 'qr-barcode-tools',
    short: 'QR & Barcode',
    title: 'Free QR Code & Barcode Tools',
    description: 'Create QR codes and barcodes and read QR codes from photos and screenshots.',
  },
  'PDF Tools': {
    slug: 'pdf-tools',
    short: 'PDF',
    title: 'Free Online PDF Tools',
    description:
      'Merge, split, compress, protect and unlock PDFs, convert between PDF and images, and extract text — without uploading.',
  },
  'Documents & Business': {
    slug: 'document-tools',
    short: 'Documents',
    title: 'Free Resume, Invoice & Document Makers',
    description:
      'Build a resume, an invoice or a receipt and draw your signature, ready to print or save as PDF.',
  },
  'Developer Tools': {
    slug: 'developer-tools',
    short: 'Developers',
    title: 'Free Online Developer Tools',
    description:
      'Format JSON, test regex, decode JWTs, convert data, minify code, build SQL and test APIs in one place.',
  },
  'Security & Passwords': {
    slug: 'password-security-tools',
    short: 'Passwords',
    title: 'Free Password Tools',
    description:
      'Generate strong passwords and check how strong a password really is — nothing leaves your device.',
  },
  'SEO Tools': {
    slug: 'seo-tools',
    short: 'SEO',
    title: 'Free SEO Tools',
    description:
      'Write meta tags, preview Google results, create robots.txt and sitemaps, build UTM links and check keyword density.',
  },
  'Writing & Text': {
    slug: 'writing-tools',
    short: 'Writing',
    title: 'Free Writing & Text Tools',
    description:
      'Count words, change case, clean text, check readability, write headlines and bios, and listen to text read aloud.',
  },
  'Video & Audio': {
    slug: 'video-audio-tools',
    short: 'Video & Audio',
    title: 'Free Video & Audio Tools',
    description:
      'Turn video clips into GIFs, grab thumbnails, trim audio, change speed and tidy subtitle files in your browser.',
  },
  'Finance Calculators': {
    slug: 'finance-calculators',
    short: 'Finance',
    title: 'Free Finance Calculators',
    description:
      'Loan EMI, compound interest, profit margin, discounts, VAT, bill splitting, zakat and currency conversion.',
  },
  'Everyday Calculators': {
    slug: 'calculators',
    short: 'Calculators',
    title: 'Free Everyday Calculators',
    description:
      'Age, BMI, calories, percentages, dates, units, aspect ratios, fuel cost and Roman numerals.',
  },
  'Math & Engineering': {
    slug: 'math-engineering-tools',
    short: 'Math',
    title: 'Free Math & Engineering Calculators',
    description:
      'Scientific calculator, Ohm’s law, resistor colour codes, equations, statistics, fractions and GPA.',
  },
  Productivity: {
    slug: 'productivity-tools',
    short: 'Productivity',
    title: 'Free Online Productivity Tools',
    description:
      'Timers, a Kanban board, a meeting planner across time zones and random pickers for everyday work.',
  },
  Games: {
    slug: 'online-games',
    short: 'Games',
    title: 'Free Online Games',
    description:
      'Quick games that play in your browser — puzzles, arcade, memory and skill games. No download, no signup.',
  },
};

export const categoryBySlug = (slug: string) =>
  (Object.keys(categoryInfo) as Category[]).find(c => categoryInfo[c].slug === slug);
