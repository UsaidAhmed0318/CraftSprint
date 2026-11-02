import type { MetadataRoute } from 'next';
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'CraftSprint — Free Online Tools',
    short_name: 'CraftSprint',
    description: 'Free browser-based tools for images, PDFs, code, writing, calculators and games.',
    start_url: '/',
    display: 'standalone',
    background_color: '#080c1b',
    theme_color: '#080c1b',
    icons: [
      { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
      { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' },
      { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
  };
}
