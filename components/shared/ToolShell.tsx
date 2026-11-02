'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { Star } from 'lucide-react';
import ToolCard from '@/components/shared/ToolCard';
import AdSlot from '@/components/shared/AdSlot';
import ResultBanner from '@/components/shared/ResultBanner';
import { tools } from '@/data/tools';
import { categoryInfo } from '@/lib/categories';
import { recordRecent, usePrefs } from '@/lib/userPrefs';
import { site } from '@/lib/site';
import { toolContent } from '@/data/toolContent';

export default function ToolShell({
  title,
  description,
  children,
  faq,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
  faq?: { q: string; a: string }[];
}) {
  const path = usePathname() || '';
  const slug = path.split('/').filter(Boolean)[1] || '';
  const tool = tools.find(t => t.slug === slug);
  const cat = tool ? categoryInfo[tool.category] : undefined;
  const { favorites, toggleFavorite } = usePrefs();
  const isFav = !!tool && favorites.includes(tool.slug);
  useEffect(() => {
    if (tool) recordRecent(tool.slug);
  }, [tool]);
  const related = tool
    ? tools.filter(t => t.category === tool.category && t.slug !== tool.slug).slice(0, 4)
    : [];

  const ld: Record<string, unknown>[] = [];
  if (tool && cat)
    ld.push({
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: site.url },
        { '@type': 'ListItem', position: 2, name: cat.short, item: `${site.url}/category/${cat.slug}` },
        { '@type': 'ListItem', position: 3, name: tool.name, item: `${site.url}/tools/${tool.slug}` },
      ],
    });
  if (faq && faq.length)
    ld.push({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faq.map(x => ({
        '@type': 'Question',
        name: x.q,
        acceptedAnswer: { '@type': 'Answer', text: x.a },
      })),
    });

  return (
    <main className="toolPage">
      <div className="container">
        {ld.map((d, i) => (
          <script
            key={i}
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(d) }}
          />
        ))}
        {tool && cat && (
          <nav className="breadcrumbs" aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            <span>/</span>
            <Link href={`/category/${cat.slug}`}>{cat.short}</Link>
            <span>/</span>
            <span aria-current="page">{tool.name}</span>
          </nav>
        )}
        <div className="toolTitleRow">
          <div className="toolHeader">
            <h1>{title}</h1>
            <p>{description}</p>
          </div>
          {tool && (
            <button
              className={`favBtn ${isFav ? 'on' : ''}`}
              onClick={() => toggleFavorite(tool.slug)}
              aria-pressed={isFav}
            >
              <Star size={16} />
              {isFav ? 'Saved to favourites' : 'Add to favourites'}
            </button>
          )}
        </div>
        <div className="toolPanel">
          {children}
          <ResultBanner />
        </div>
        <AdSlot />
        {tool && toolContent[tool.slug] && (
          <section className="section" style={{ paddingBottom: 0, paddingTop: 40 }}>
            <div className="article">
              <h2>{toolContent[tool.slug].heading}</h2>
              {toolContent[tool.slug].paragraphs.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          </section>
        )}
        {faq && faq.length > 0 && (
          <section className="section" style={{ paddingBottom: 0, paddingTop: 40 }}>
            <div className="article">
              <h2>Frequently asked questions</h2>
              <div className="faq">
                {faq.map(x => (
                  <details key={x.q}>
                    <summary>{x.q}</summary>
                    <p>{x.a}</p>
                  </details>
                ))}
              </div>
            </div>
          </section>
        )}
        {related.length > 0 && (
          <section className="relatedSection">
            <div className="catBlockHead">
              <h2>Related tools</h2>
              {cat && (
                <Link className="seeAll" href={`/category/${cat.slug}`}>
                  See all {tools.filter(t => t.category === tool?.category).length} free{' '}
                  {cat.short.toLowerCase()} tools
                </Link>
              )}
            </div>
            <div className="toolGrid">
              {related.map(t => (
                <ToolCard key={t.slug} tool={t} />
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
