import { tools } from '@/data/tools';

/**
 * Per-tool web app manifest: lets a visitor install ONE tool or game as its own home-screen app
 * (e.g. "Sudoku" or "Image Compressor"). The main CraftSprint app manifest is app/manifest.ts.
 */
export const dynamic = 'force-static';

export function generateStaticParams() {
  return tools.map(t => ({ slug: t.slug }));
}

export async function GET(_req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const tool = tools.find(t => t.slug === slug);
  if (!tool) return new Response('Not found', { status: 404 });
  const path = `/tools/${slug}`;
  const manifest = {
    id: path,
    name: `${tool.name} — CraftSprint`,
    short_name: tool.name.length > 12 ? tool.name.split(' ').slice(0, 2).join(' ').slice(0, 12) : tool.name,
    description: tool.description,
    start_url: `${path}?source=app`,
    scope: path,
    display: 'standalone',
    orientation: 'any',
    background_color: '#07051a',
    theme_color: '#07051a',
    icons: [
      { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
      { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
      { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
  };
  return new Response(JSON.stringify(manifest), {
    headers: {
      'Content-Type': 'application/manifest+json; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}
