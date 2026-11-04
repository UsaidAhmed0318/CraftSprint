import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import JsonLd from '@/components/shared/JsonLd';
import { tools, type Category } from '@/data/tools';
import { toolSeo } from '@/data/seo';
import ToolRenderer from '@/lib/toolRegistry';
import { withSeo } from '@/lib/seo';
import { site } from '@/lib/site';

/**
 * One page renders every tool: /tools/<slug>.
 * The tool's text lives in data/tools.ts + data/seo.ts and its UI in lib/toolRegistry.tsx.
 */
export const dynamicParams = false;
export function generateStaticParams() {
  return tools.map(t => ({ slug: t.slug }));
}

const appCategory: Record<Category, string> = {
  'Image Tools': 'DesignApplication',
  'Color Tools': 'DesignApplication',
  'CSS & Web Design': 'DesignApplication',
  'QR & Barcode': 'UtilitiesApplication',
  'PDF Tools': 'BusinessApplication',
  'Documents & Business': 'BusinessApplication',
  'Developer Tools': 'DeveloperApplication',
  'Security & Passwords': 'SecurityApplication',
  'SEO Tools': 'BusinessApplication',
  'Writing & Text': 'BusinessApplication',
  'Video & Audio': 'MultimediaApplication',
  'Finance Calculators': 'FinanceApplication',
  'Everyday Calculators': 'UtilitiesApplication',
  'Math & Engineering': 'EducationalApplication',
  Productivity: 'BusinessApplication',
  Games: 'GameApplication',
};

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const tool = tools.find(t => t.slug === slug);
  if (!tool) return {};
  const seo = toolSeo[slug] ?? { title: `${tool.name} — Free Online Tool`, description: tool.description };
  // Each tool page links its own manifest, so it can be installed as a stand-alone app.
  return {
    ...withSeo(`/tools/${slug}`, { title: seo.title, description: seo.description }),
    manifest: `/tools/${slug}/app.webmanifest`,
  };
}

export default async function ToolPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const tool = tools.find(t => t.slug === slug);
  if (!tool) notFound();
  const seo = toolSeo[slug];
  return (
    <>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': tool.category === 'Games' ? ['VideoGame', 'SoftwareApplication'] : 'SoftwareApplication',
          name: tool.name,
          description: seo?.description ?? tool.description,
          url: `${site.url}/tools/${slug}`,
          applicationCategory: appCategory[tool.category],
          operatingSystem: 'Any (web browser)',
          isAccessibleForFree: true,
          offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
          publisher: { '@type': 'Organization', name: site.name, url: site.url },
        }}
      />
      <ToolRenderer slug={slug} />
    </>
  );
}
