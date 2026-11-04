import Link from 'next/link';
import AllToolsBrowser from '@/components/shared/AllToolsBrowser';
import JsonLd from '@/components/shared/JsonLd';
import { tools } from '@/data/tools';
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
        <h1 className="pageHero" style={{ marginTop: 10 }}>
          Explore {tools.length} <span className="violetText">free tools</span>
        </h1>
        <p className="lead">
          Every CraftSprint tool, grouped by category. All of them run in your browser with no signup.
        </p>
        <AllToolsBrowser />
      </div>
    </main>
  );
}
