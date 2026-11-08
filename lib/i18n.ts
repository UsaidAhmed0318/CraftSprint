'use client';
/**
 * Interface language (menus, navigation, homepage headline). Tool pages and articles stay in English for now.
 * The first render is always English (same as the server), then the saved language is applied — no hydration errors.
 */
import { useEffect, useState } from 'react';

export const LANGS = [
  { code: 'en', label: 'English', dir: 'ltr' },
  { code: 'ur', label: 'اردو', dir: 'rtl' },
  { code: 'ar', label: 'العربية', dir: 'rtl' },
  { code: 'hi', label: 'हिन्दी', dir: 'ltr' },
  { code: 'es', label: 'Español', dir: 'ltr' },
  { code: 'fr', label: 'Français', dir: 'ltr' },
] as const;
export type Lang = (typeof LANGS)[number]['code'];

const EN = {
  allTools: 'All tools',
  games: 'Games',
  prompts: 'Prompts',
  guides: 'Guides',
  installApp: 'Install App',
  home: 'Home',
  tools: 'Tools',
  ai: 'AI',
  more: 'More',
  aiAssistant: 'AI assistant',
  categories: 'Categories',
  workspace: 'File workspace',
  favourites: 'Favourites & history',
  promptLibrary: 'AI prompt library',
  about: 'About us',
  contact: 'Contact us',
  whatsapp: 'WhatsApp us',
  language: 'Language',
  heroA: 'Your ultimate',
  heroB: 'online tools hub',
  heroSub: 'Work smarter, create better, play more.',
  explore: 'Explore all tools',
  playGames: 'Play games',
};
type Dict = typeof EN;
const T: Record<Lang, Dict> = {
  en: EN,
  ur: {
    allTools: 'تمام ٹولز',
    games: 'گیمز',
    prompts: 'پرامپٹس',
    guides: 'رہنمائی',
    installApp: 'ایپ انسٹال کریں',
    home: 'ہوم',
    tools: 'ٹولز',
    ai: 'اے آئی',
    more: 'مزید',
    aiAssistant: 'اے آئی اسسٹنٹ',
    categories: 'زمرے',
    workspace: 'فائل ورک اسپیس',
    favourites: 'پسندیدہ اور ہسٹری',
    promptLibrary: 'اے آئی پرامپٹ لائبریری',
    about: 'ہمارے بارے میں',
    contact: 'رابطہ کریں',
    whatsapp: 'واٹس ایپ کریں',
    language: 'زبان',
    heroA: 'آپ کا مکمل',
    heroB: 'آن لائن ٹولز مرکز',
    heroSub: 'سمجھداری سے کام کریں، بہتر بنائیں، زیادہ کھیلیں۔',
    explore: 'تمام ٹولز دیکھیں',
    playGames: 'گیمز کھیلیں',
  },
  ar: {
    allTools: 'كل الأدوات',
    games: 'الألعاب',
    prompts: 'الأوامر',
    guides: 'الأدلة',
    installApp: 'ثبّت التطبيق',
    home: 'الرئيسية',
    tools: 'الأدوات',
    ai: 'الذكاء',
    more: 'المزيد',
    aiAssistant: 'المساعد الذكي',
    categories: 'الفئات',
    workspace: 'مساحة الملفات',
    favourites: 'المفضلة والسجل',
    promptLibrary: 'مكتبة أوامر الذكاء الاصطناعي',
    about: 'من نحن',
    contact: 'اتصل بنا',
    whatsapp: 'راسلنا على واتساب',
    language: 'اللغة',
    heroA: 'منصتك الشاملة',
    heroB: 'للأدوات عبر الإنترنت',
    heroSub: 'اعمل بذكاء، وأبدع أكثر، واستمتع باللعب.',
    explore: 'استكشف كل الأدوات',
    playGames: 'العب الآن',
  },
  hi: {
    allTools: 'सभी टूल्स',
    games: 'गेम्स',
    prompts: 'प्रॉम्प्ट्स',
    guides: 'गाइड',
    installApp: 'ऐप इंस्टॉल करें',
    home: 'होम',
    tools: 'टूल्स',
    ai: 'एआई',
    more: 'और',
    aiAssistant: 'एआई असिस्टेंट',
    categories: 'श्रेणियाँ',
    workspace: 'फ़ाइल वर्कस्पेस',
    favourites: 'पसंदीदा और इतिहास',
    promptLibrary: 'एआई प्रॉम्प्ट लाइब्रेरी',
    about: 'हमारे बारे में',
    contact: 'संपर्क करें',
    whatsapp: 'व्हाट्सऐप करें',
    language: 'भाषा',
    heroA: 'आपका संपूर्ण',
    heroB: 'ऑनलाइन टूल्स हब',
    heroSub: 'स्मार्ट काम करें, बेहतर बनाएं, ज़्यादा खेलें।',
    explore: 'सभी टूल्स देखें',
    playGames: 'गेम खेलें',
  },
  es: {
    allTools: 'Todas las herramientas',
    games: 'Juegos',
    prompts: 'Prompts',
    guides: 'Guías',
    installApp: 'Instalar app',
    home: 'Inicio',
    tools: 'Herramientas',
    ai: 'IA',
    more: 'Más',
    aiAssistant: 'Asistente IA',
    categories: 'Categorías',
    workspace: 'Espacio de archivos',
    favourites: 'Favoritos e historial',
    promptLibrary: 'Biblioteca de prompts',
    about: 'Sobre nosotros',
    contact: 'Contacto',
    whatsapp: 'Escríbenos por WhatsApp',
    language: 'Idioma',
    heroA: 'Tu centro definitivo',
    heroB: 'de herramientas online',
    heroSub: 'Trabaja mejor, crea más, juega más.',
    explore: 'Ver todas las herramientas',
    playGames: 'Jugar',
  },
  fr: {
    allTools: 'Tous les outils',
    games: 'Jeux',
    prompts: 'Prompts',
    guides: 'Guides',
    installApp: 'Installer l’app',
    home: 'Accueil',
    tools: 'Outils',
    ai: 'IA',
    more: 'Plus',
    aiAssistant: 'Assistant IA',
    categories: 'Catégories',
    workspace: 'Espace fichiers',
    favourites: 'Favoris et historique',
    promptLibrary: 'Bibliothèque de prompts',
    about: 'À propos',
    contact: 'Contact',
    whatsapp: 'Écrivez-nous sur WhatsApp',
    language: 'Langue',
    heroA: 'Votre plateforme ultime',
    heroB: 'd’outils en ligne',
    heroSub: 'Travaillez mieux, créez plus, jouez davantage.',
    explore: 'Voir tous les outils',
    playGames: 'Jouer',
  },
};

const KEY = 'cs-lang';
const EVT = 'cs-lang-change';
function apply(l: Lang) {
  const meta = LANGS.find(x => x.code === l) || LANGS[0];
  document.documentElement.lang = meta.code;
  document.documentElement.dir = meta.dir;
}
export function setLang(l: Lang) {
  try {
    localStorage.setItem(KEY, l);
  } catch {}
  apply(l);
  window.dispatchEvent(new Event(EVT));
}
/** Returns a translator for interface text. English on the first render, then the visitor's choice. */
export function useT() {
  const [lang, set] = useState<Lang>('en');
  useEffect(() => {
    const read = () => {
      let l: Lang = 'en';
      try {
        const v = localStorage.getItem(KEY) as Lang | null;
        if (v && T[v]) l = v;
      } catch {}
      set(l);
      apply(l);
    };
    read();
    window.addEventListener(EVT, read);
    return () => window.removeEventListener(EVT, read);
  }, []);
  return { lang, t: (k: keyof Dict) => T[lang][k] || EN[k] };
}
