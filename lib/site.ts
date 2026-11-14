export const site = {
  name: 'CraftSprint',
  // Set in next.config.ts from NEXT_PUBLIC_SITE_URL or Vercel's production domain.
  url: (process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000').trim().replace(/\/+$/, ''),
  description:
    'Free online tools for images, text, developers and everyday work — compress, convert, resize, generate passwords and QR codes, format JSON and more, all in your browser.',
  email: 'usaidahmeddon@gmail.com',
  whatsapp: '923181014996',
  founder: 'Usaid Ahmed',
  /**
   * Official profiles (schema.org sameAs). Same brand everywhere helps Google and AI assistants
   * recognise CraftSprint as one entity. Add each profile URL once it exists; remove ones you don't use.
   */
  sameAs: [
    'https://www.pinterest.com/CraftSprintTools/',
    'https://www.instagram.com/craftsprint.io/',
    // 'https://www.youtube.com/@REPLACE',
    // 'https://x.com/REPLACE',
    // 'https://www.linkedin.com/company/REPLACE',
    // 'https://www.facebook.com/REPLACE',
    // 'https://alternativeto.net/software/craftsprint/',
  ] as string[],
};
