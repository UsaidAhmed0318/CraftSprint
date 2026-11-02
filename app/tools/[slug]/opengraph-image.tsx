import { ImageResponse } from 'next/og';
import { tools } from '@/data/tools';
import { categoryInfo } from '@/lib/categories';

export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';
export function generateStaticParams() {
  return tools.map(t => ({ slug: t.slug }));
}

/** Share image for every tool (WhatsApp, Facebook, X, LinkedIn). */
export default async function OgImage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const tool = tools.find(t => t.slug === slug);
  const name = tool?.name ?? 'CraftSprint';
  const cat = tool ? categoryInfo[tool.category].short : 'Free online tools';
  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: 72,
        background: 'linear-gradient(135deg,#080c1b 0%,#141d4a 100%)',
        color: '#eceff9',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, fontSize: 34, fontWeight: 700 }}>
        <div style={{ width: 18, height: 18, borderRadius: 9, background: '#e2be6a' }} />
        CraftSprint
      </div>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <div style={{ fontSize: 30, color: '#e2be6a', marginBottom: 16 }}>{cat}</div>
        <div
          style={{
            fontSize: name.length > 24 ? 72 : 92,
            fontWeight: 800,
            lineHeight: 1.05,
            letterSpacing: -2,
          }}
        >
          {name}
        </div>
      </div>
      <div style={{ display: 'flex', fontSize: 28, color: '#aab4d8' }}>
        Free · Runs in your browser · No signup
      </div>
    </div>,
    size,
  );
}
