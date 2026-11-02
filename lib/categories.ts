import type { Category } from '@/data/tools';
import {
  Image as ImageIcon,
  FileText,
  Code,
  PenLine,
  Clapperboard,
  Calculator,
  Sigma,
  Briefcase,
  Gamepad2,
  type LucideIcon,
} from 'lucide-react';

export const categoryIcon: Record<Category, LucideIcon> = {
  'Image & Design': ImageIcon,
  'Documents & PDF': FileText,
  'Developer Tools': Code,
  'Content & SEO': PenLine,
  'Video & Audio': Clapperboard,
  Calculators: Calculator,
  'Math & Engineering': Sigma,
  'Productivity & Business': Briefcase,
  Games: Gamepad2,
};

export const categoryInfo: Record<
  Category,
  { slug: string; short: string; title: string; description: string }
> = {
  'Image & Design': {
    slug: 'image-design-tools',
    short: 'Images',
    title: 'Free Image & Design Tools',
    description:
      'Compress, convert, resize, crop and style images, build CSS effects and generate graphics — all inside your browser.',
  },
  'Documents & PDF': {
    slug: 'pdf-document-tools',
    short: 'PDF & Docs',
    title: 'Free PDF & Document Tools',
    description:
      'Merge, split, compress and protect PDFs, build resumes and invoices, and convert documents without uploading them.',
  },
  'Developer Tools': {
    slug: 'developer-tools',
    short: 'Developers',
    title: 'Free Online Developer Tools',
    description:
      'Format JSON, test regex, decode JWTs, generate hashes and UUIDs, minify code and test APIs in one place.',
  },
  'Content & SEO': {
    slug: 'content-seo-tools',
    short: 'Writing & SEO',
    title: 'Free Writing & SEO Tools',
    description:
      'Count words, change case, check readability, preview search results and build campaign links.',
  },
  'Video & Audio': {
    slug: 'video-audio-tools',
    short: 'Video & Audio',
    title: 'Free Video & Audio Tools',
    description: 'Trim audio, change speed, make GIFs from video, grab thumbnails and fix subtitle files.',
  },
  Calculators: {
    slug: 'calculators',
    short: 'Calculators',
    title: 'Free Online Calculators',
    description:
      'Age, BMI, loan EMI, zakat, percentage, profit and date calculators that give instant answers.',
  },
  'Math & Engineering': {
    slug: 'math-engineering-tools',
    short: 'Math & Engineering',
    title: 'Free Math, Science & Engineering Tools',
    description:
      'Scientific calculator, Ohm’s law, resistor codes, equation solvers, statistics, fractions and GPA — for students and engineers.',
  },
  'Productivity & Business': {
    slug: 'productivity-tools',
    short: 'Productivity',
    title: 'Free Productivity & Business Tools',
    description: 'Timers, converters, planners and boards that keep everyday work moving.',
  },
  Games: {
    slug: 'online-games',
    short: 'Games',
    title: 'Free Online Games',
    description:
      'Quick brain games to play in your browser — 2048, Snake, Memory Match, Tic-Tac-Toe and a typing speed test.',
  },
};

export const categoryBySlug = (slug: string) =>
  (Object.keys(categoryInfo) as Category[]).find(c => categoryInfo[c].slug === slug);
