import Link from 'next/link';
import PromptLibrary from '@/components/shared/PromptLibrary';
import JsonLd from '@/components/shared/JsonLd';
import { promptGroups } from '@/data/prompts';
import { withSeo } from '@/lib/seo';
import { site } from '@/lib/site';

const total = promptGroups.reduce((n, g) => n + g.prompts.length, 0);

export const metadata = withSeo('/prompts', {
  title: 'Free AI Prompt Library – Copy & Use',
  description: `${total} free, ready-to-use AI prompts for writing, business, coding, careers, study, images and SEO. Copy one or open it in CraftSprint AI.`,
});

export default function PromptsPage() {
  return (
    <main className="section">
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: site.url },
            { '@type': 'ListItem', position: 2, name: 'AI prompt library', item: `${site.url}/prompts` },
          ],
        }}
      />
      <div className="container">
        <nav className="breadcrumbs" aria-label="Breadcrumb">
          <Link href="/">Home</Link> <span aria-hidden="true">›</span>{' '}
          <span aria-current="page">AI prompt library</span>
        </nav>
        <h1 className="pageHero" style={{ marginTop: 10 }}>
          AI <span className="violetText">prompt library</span>
        </h1>
        <p className="lead">
          {total} ready-to-use prompts in {promptGroups.length} categories. Replace the [BRACKETS] with your
          details, then copy the prompt or open it straight in CraftSprint AI.
        </p>
        <PromptLibrary />
        <section className="catBlock" aria-labelledby="tips">
          <h2 id="tips">How to get better results</h2>
          <ol className="tipList">
            <li>
              <b>Replace every placeholder</b> — [TOPIC], [AUDIENCE] and similar — with real details.
            </li>
            <li>
              <b>Be specific</b> about length, tone and who the result is for.
            </li>
            <li>
              <b>Give an example</b> of what you like when you have one.
            </li>
            <li>
              <b>Ask for changes</b> instead of starting again: “shorter”, “more formal”, “add a table”.
            </li>
          </ol>
        </section>
      </div>
    </main>
  );
}
