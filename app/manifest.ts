import type { MetadataRoute } from 'next';

/** Web app manifest — lets visitors install CraftSprint as one app (Android, desktop, iOS home screen). */
export default function manifest(): MetadataRoute.Manifest {
  return {
    id: '/',
    name: 'CraftSprint — Free Online Tools',
    short_name: 'CraftSprint',
    description: 'Free browser-based tools for images, PDFs, code, writing, calculators and games.',
    start_url: '/',
    scope: '/',
    display: 'standalone',
    orientation: 'portrait',
    background_color: '#050a18',
    theme_color: '#050a18',
    categories: ['utilities', 'productivity', 'developer', 'games'],
    icons: [
      { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
      { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
      { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
    shortcuts: [
      { name: 'All tools', url: '/tools', icons: [{ src: '/icons/icon-192.png', sizes: '192x192' }] },
      {
        name: 'Games',
        url: '/category/online-games',
        icons: [{ src: '/icons/icon-192.png', sizes: '192x192' }],
      },
      { name: 'CraftSprint AI', url: '/ai', icons: [{ src: '/icons/icon-192.png', sizes: '192x192' }] },
      {
        name: 'Image Compressor',
        url: '/tools/image-compressor',
        icons: [{ src: '/icons/icon-192.png', sizes: '192x192' }],
      },
    ],
  };
}
