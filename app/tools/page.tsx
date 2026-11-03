import Link from 'next/link';
import ToolCard from '@/components/shared/ToolCard';
import JsonLd from '@/components/shared/JsonLd';
import { tools, categories } from '@/data/tools';
import { categoryInfo, categoryIcon } from '@/lib/categories';
import { withSeo } from '@/lib/seo';
import { site } from '@/lib/site';

export const metadata = withSeo('/tools', {
  title: `All ${tools.length} Free Online Tools`,
  description: `Browse all ${tools.length} free CraftSprint tools by category: images, PDF, developer, writing, media, calculators, math, productivity and games.`,
});

export default function AllToolsPage() {
  return (
    <main className="section">
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: site.url },
            { '@type': 'ListItem', position: 2, name: 'All tools', item: `${site.url}/tools` },
          ],
        }}
      />
      <div className="container">
        <nav className="breadcrumbs" aria-label="Breadcrumb">
          <Link href="/">Home</Link> <span aria-hidden="true">›</span>{' '}
          <span aria-current="page">All tools</span>
        </nav>
        <h1 style={{ marginTop: 10 }}>All {tools.length} free online tools</h1>
        <p className="lead">
          Every CraftSprint tool, grouped by category. All of them run in your browser with no signup.
        </p>
        <nav className="catJump" aria-label="Jump to a category">
          {categories.map(c => (
            <a key={c} href={`#${categoryInfo[c].slug}`}>
              {categoryInfo[c].short}
            </a>
          ))}
        </nav>
        {categories.map(c => {
          const Icon = categoryIcon[c];
          const list = tools.filter(t => t.category === c);
          return (
            <section
              key={c}
              id={categoryInfo[c].slug}
              className="catBlock"
              aria-labelledby={`h-${categoryInfo[c].slug}`}
            >
              <div className="catBlockHead">
                <div>
                  <h2
                    id={`h-${categoryInfo[c].slug}`}
                    style={{ display: 'flex', alignItems: 'center', gap: 10 }}
                  >
                    <Icon size={24} /> {categoryInfo[c].short}
                  </h2>
                  <p>{categoryInfo[c].description}</p>
                </div>
                <Link className="seeAll" href={`/category/${categoryInfo[c].slug}`}>
                  Open {categoryInfo[c].short.toLowerCase()} page
                </Link>
              </div>
              <div className="toolGrid">
                {list.map(t => (
                  <ToolCard key={t.slug} tool={t} />
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </main>
  );
}
