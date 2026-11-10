import { Gamepad2, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import ToolCard from '@/components/shared/ToolCard';
import GamesBrowser from '@/components/shared/GamesBrowser';
import AdSlot from '@/components/shared/AdSlot';
import JsonLd from '@/components/shared/JsonLd';
import { tools, categories } from '@/data/tools';
import { categoryInfo, categoryBySlug } from '@/lib/categories';
import { withSeo, fitTitle } from '@/lib/seo';
import { site } from '@/lib/site';

export function generateStaticParams() {
  return categories.map(c => ({ slug: categoryInfo[c].slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const cat = categoryBySlug(slug);
  if (!cat) return {};
  const info = categoryInfo[cat];
  const n = tools.filter(t => t.category === cat).length;
  return withSeo(`/category/${slug}`, {
    title: fitTitle(`${info.title} — ${n} ${info.short === 'Games' ? 'Games' : 'Tools'}`),
    description: info.description,
  });
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const cat = categoryBySlug(slug);
  if (!cat) notFound();
  const info = categoryInfo[cat];
  const list = tools.filter(t => t.category === cat);
  return (
    <main className="container" style={{ paddingBottom: 70 }}>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'CollectionPage',
          name: info.title,
          description: info.description,
          url: `${site.url}/category/${slug}`,
          mainEntity: {
            '@type': 'ItemList',
            itemListElement: list.map((t, i) => ({
              '@type': 'ListItem',
              position: i + 1,
              url: `${site.url}/tools/${t.slug}`,
              name: t.name,
            })),
          },
        }}
      />
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: site.url },
            { '@type': 'ListItem', position: 2, name: info.short, item: `${site.url}/category/${slug}` },
          ],
        }}
      />
      <section className="catHero">
        <nav className="breadcrumbs" aria-label="Breadcrumb">
          <Link href="/">Home</Link>
          <span>/</span>
          <span aria-current="page">{info.short}</span>
        </nav>
        <h1>{info.title}</h1>
        <p>
          {info.description} {list.length} {cat === 'Games' ? 'games' : 'tools'}, all free and private.
        </p>
        {cat === 'Games' && (
          <section className="gamesHero" aria-label="Games">
            <div className="gamesHeroArt" aria-hidden="true">
              <span className="ghPad">
                <Gamepad2 size={92} strokeWidth={1.4} />
              </span>
              <span className="ghRing" />
            </div>
            <div>
              <h2>
                Play amazing <span className="violetText">online games</span>
              </h2>
              <p>
                Relax, have fun and challenge yourself — no download, no signup. Your best scores are saved on
                this device.
              </p>
              <a href="#games-grid" className="btn btnPrimary">
                Browse all games <ArrowRight size={16} />
              </a>
            </div>
          </section>
        )}
        {cat !== 'Games' && (
          <nav
            className="catChips"
            style={{ justifyContent: 'flex-start', marginLeft: 0 }}
            aria-label="Other categories"
          >
            {categories
              .filter(c => c !== cat)
              .map(c => (
                <Link key={c} className="catChip" href={`/category/${categoryInfo[c].slug}`}>
                  {categoryInfo[c].short}
                </Link>
              ))}
          </nav>
        )}
      </section>
      {cat === 'Games' ? (
        <GamesBrowser />
      ) : (
        <>
          <div className="toolGrid" style={{ marginTop: 36 }}>
            {list.map(t => (
              <ToolCard key={t.slug} tool={t} />
            ))}
          </div>
          <AdSlot />
        </>
      )}
    </main>
  );
}
