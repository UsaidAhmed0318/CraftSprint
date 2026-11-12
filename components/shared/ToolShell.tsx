'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { Star, ShieldCheck, Zap, Gift, Smartphone, ArrowRight } from 'lucide-react';
import ToolCard from '@/components/shared/ToolCard';
import AdSlot from '@/components/shared/AdSlot';
import ResultBanner from '@/components/shared/ResultBanner';
import InstallButton from '@/components/pwa/InstallButton';
import { track } from '@/lib/analytics';
import { PrivacyBadge } from '@/components/shared/ProFx';
import { tools } from '@/data/tools';
import { categoryInfo } from '@/lib/categories';
import { categories } from '@/data/tools';
import { recordRecent, usePrefs } from '@/lib/userPrefs';
import { site } from '@/lib/site';
import { toolContent } from '@/data/toolContent';

export default function ToolShell({
  title,
  description,
  children,
  faq,
  wide,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
  faq?: { q: string; a: string }[];
  /** Full-width workspace without the info sidebar (for tools with their own two-column layout). */
  wide?: boolean;
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

  const catIndex = tool ? categories.indexOf(tool.category) : 0;
  const Icon = tool?.icon;
  const isGame = tool?.category === 'Games';
  const features = [
    {
      i: ShieldCheck,
      t: isGame ? 'Plays in your browser' : 'Private',
      d: isGame ? 'No download or install' : 'Runs on your device — nothing is uploaded',
      g: 'g4',
    },
    { i: Zap, t: 'Fast', d: 'Works instantly, no waiting in a queue', g: 'g6' },
    { i: Gift, t: 'Free', d: 'No signup, no watermark, no limits', g: 'g3' },
    { i: Smartphone, t: 'Any device', d: 'Phone, tablet or computer', g: 'g1' },
  ];
  const steps = tool ? toolContent[tool.slug]?.steps : undefined;
  const showSide = !wide && !!tool;

  useEffect(() => {
    if (tool) track('tool_view', { tool_slug: tool.slug, tool_category: tool.category });
  }, [tool]);
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
          <div className="toolHeader proHead">
            {Icon && (
              <span className={`proAppIcon g${(catIndex % 9) + 1}`} aria-hidden="true">
                <Icon size={30} strokeWidth={1.8} />
              </span>
            )}
            <div>
              <h1 className="proTitle">
                {title.split(' ').slice(0, -1).join(' ')}{' '}
                <span className={isGame ? 'goldGrad' : 'violetText'}>{title.split(' ').slice(-1)}</span>
              </h1>
              <p>{description}</p>
            </div>
          </div>
          {Icon && (
            <div className={`toolArt g${(catIndex % 9) + 1}`} aria-hidden="true">
              <span className="toolArtDisc" />
              <span className="toolArtTile">
                <Icon size={64} strokeWidth={1.5} />
              </span>
              <span className="toolArtSpark s1" />
              <span className="toolArtSpark s2" />
              <span className="toolArtSpark s3" />
            </div>
          )}
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
        <div className={`proWorkspace ${showSide ? '' : 'noSide'}`}>
          <div className="toolPanel">
            {children}
            <ResultBanner />
            {tool &&
              ['Image Tools', 'PDF Tools', 'Video & Audio', 'Documents & Business'].includes(
                tool.category,
              ) && <PrivacyBadge />}
          </div>
          {tool && (
            <div className="mobileInstall">
              <InstallButton label={`Install ${tool.name} app`} appName={tool.name} />
            </div>
          )}
          {showSide && (
            <aside className="toolSide" aria-label="About this tool">
              <div className="toolSideCard">
                <h2>Why use this tool</h2>
                <ul className="proFeatures">
                  {features.map(({ i: FIcon, t, d, g }) => (
                    <li key={t}>
                      <span className={g}>
                        <FIcon size={17} />
                      </span>
                      <div>
                        <b>{t}</b>
                        <small>{d}</small>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
              {steps && (
                <div className="toolSideCard">
                  <h2>Quick steps</h2>
                  <ol className="sideSteps">
                    {steps.map((st, n) => (
                      <li key={st}>
                        <span>{n + 1}</span>
                        {st}
                      </li>
                    ))}
                  </ol>
                </div>
              )}
              {related.length > 0 && (
                <div className="toolSideCard">
                  <h2>Try next</h2>
                  <div className="sideLinks">
                    {related.slice(0, 4).map(t => {
                      const RIcon = t.icon;
                      return (
                        <Link key={t.slug} href={`/tools/${t.slug}`}>
                          <RIcon size={16} />
                          <span>{t.name}</span>
                          <ArrowRight size={14} />
                        </Link>
                      );
                    })}
                  </div>
                </div>
              )}
            </aside>
          )}
        </div>
        <AdSlot />
        {tool && toolContent[tool.slug]?.steps && (
          <section className="toolHowTo" aria-labelledby="howto-title">
            <h2 id="howto-title">How to use the {tool.name}</h2>
            <ol>
              {toolContent[tool.slug].steps!.map(st => (
                <li key={st}>{st}</li>
              ))}
            </ol>
          </section>
        )}
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
