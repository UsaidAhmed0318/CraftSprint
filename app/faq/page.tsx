import Link from 'next/link';
import { withSeo } from '@/lib/seo';
import JsonLd from '@/components/shared/JsonLd';
import { SITE_FAQ } from '@/lib/siteAssistant';
import { tools } from '@/data/tools';
import { site } from '@/lib/site';

export const metadata = withSeo('/faq', {
  title: 'CraftSprint FAQ – Free Online Tools Help',
  description:
    'Answers to common questions about CraftSprint: is it free, are files uploaded, privacy, installing the app, supported devices, file limits and how to get help.',
});

const games = tools.filter(t => t.category === 'Games').length;
const EXTRA = [
  {
    q: 'What is CraftSprint?',
    a: `CraftSprint is a free website with ${tools.length - games} online tools and ${games} quick games for images, PDFs, video and audio, writing, SEO, developers and everyday calculations. Most tools run inside your browser, with no sign-up.`,
  },
  {
    q: 'How does CraftSprint make money if the tools are free?',
    a: 'The site is supported by advertising (Google AdSense) and by the web development services of the team that builds it. Ads are labelled and are never placed inside the tool controls.',
  },
  {
    q: 'Do the tools work offline?',
    a: 'Many do. After you have opened a tool once, or installed CraftSprint as an app, tools that work on your device keep working without internet. Tools that look something up online, such as currency rates, website speed and domain age, need a connection.',
  },
  {
    q: 'Can I use the results for commercial work?',
    a: 'Yes. Files and text you create with CraftSprint are yours and can be used for personal or commercial work. You are responsible for having the right to use the files you process.',
  },
  {
    q: 'A tool is not working. What should I do?',
    a: 'Reload the page and try again in an up-to-date browser such as Chrome, Edge, Safari or Firefox. If it still fails, tell us which tool, your device and what happened through the Contact page, and we will fix it.',
  },
];
const ALL = [...EXTRA, ...SITE_FAQ.map(f => ({ q: f.q, a: f.a }))];

export default function FaqPage() {
  return (
    <main className="section">
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: ALL.map(f => ({
            '@type': 'Question',
            name: f.q,
            acceptedAnswer: { '@type': 'Answer', text: f.a },
          })),
        }}
      />
      <div className="container article">
        <span className="kicker">Help</span>
        <h1>Frequently asked questions</h1>
        <p>
          Quick answers about {site.name}. Each tool page also has its own questions and a step-by-step guide,
          and you can <Link href="/ai">ask CraftSprint AI</Link> to find the right tool.
        </p>
        <div className="faq">
          {ALL.map(f => (
            <details key={f.q}>
              <summary>{f.q}</summary>
              <p>{f.a}</p>
            </details>
          ))}
        </div>
        <p style={{ marginTop: 24 }}>
          Still need help? <Link href="/contact">Contact us</Link> or browse{' '}
          <Link href="/tools">all tools</Link>.
        </p>
      </div>
    </main>
  );
}
