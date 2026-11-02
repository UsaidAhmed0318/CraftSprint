import Link from 'next/link';
import JsonLd from '@/components/shared/JsonLd';
import ToolCard from '@/components/shared/ToolCard';
import PromoSlider from '@/components/home/PromoSlider';
import SearchBar from '@/components/layout/SearchBar';
import QuickStrip from '@/components/home/QuickStrip';
import Hero3D from '@/components/home/Hero3D';
import { tools, categories, benefits } from '@/data/tools';
import { categoryInfo, categoryIcon } from '@/lib/categories';
import { withSeo } from '@/lib/seo';

export const metadata = withSeo('/', {
  title: 'CraftSprint — Free Online Tools for Images, PDFs, Code & More',
  description: `${tools.length} free online tools for images, PDFs, developers, engineers, students, writing, calculators and quick games. Everything runs in your browser — no signup, no uploads.`,
});

const faqs = [
  {
    q: 'Are CraftSprint tools really free?',
    a: 'Yes. Every tool and game is free to use with no account, no watermark and no daily limit.',
  },
  {
    q: 'Are my files uploaded to a server?',
    a: 'No. Image, PDF, audio, video and text tools run inside your browser, so your files stay on your device.',
  },
  {
    q: 'Do the tools work on my phone?',
    a: 'Yes. Every page is designed for phones, tablets and desktops, and you can install CraftSprint like an app from your browser menu.',
  },
  {
    q: 'What kinds of tools are there?',
    a: 'Image editing and conversion, PDF and document tools, developer utilities, writing and SEO helpers, video and audio tools, everyday and financial calculators, math and engineering tools, productivity tools and quick games.',
  },
  {
    q: 'Can I suggest a new tool?',
    a: 'Yes — send your idea through the contact page. New tools are added regularly.',
  },
];

const popular = [
  'image-compressor',
  'pdf-merge',
  'json-formatter',
  'qr-code-generator',
  'scientific-calculator',
  'background-remover',
  'resume-builder',
  'loan-emi-calculator',
];

export default function Home() {
  const pick = (slugs: string[]) =>
    slugs.map(s => tools.find(t => t.slug === s)).filter((t): t is (typeof tools)[number] => !!t);
  return (
    <main>
      <section className="heroVip">
        <div className="heroAurora" aria-hidden="true">
          <span />
          <span />
          <span />
        </div>
        <div className="container heroVipGrid">
          <div className="heroVipText">
            <span className="eyebrow">{tools.length} free tools · no signup · files stay on your device</span>
            <h1>
              Every tool you need, <span className="goldText">in one place</span> — free
            </h1>
            <p>
              Images, PDFs, code, engineering, study, money and writing. Search, pick a category, or just ask
              the CraftSprint Assistant.
            </p>
            <div className="heroSearch">
              <SearchBar />
            </div>
            <div className="heroStats">
              <span>
                <b>{tools.length}</b> tools
              </span>
              <span>
                <b>{categories.length}</b> categories
              </span>
              <span>
                <b>0</b> uploads
              </span>
            </div>
          </div>
          <Hero3D />
        </div>
      </section>

      <div className="container">
        <QuickStrip />
        <section className="catBlock" aria-labelledby="cats">
          <div className="catBlockHead">
            <div>
              <h2 id="cats">Browse by category</h2>
              <p>Open a category to see every tool in it.</p>
            </div>
          </div>
          <div className="catGrid">
            {categories.map(c => {
              const info = categoryInfo[c];
              const Icon = categoryIcon[c];
              const list = tools.filter(t => t.category === c);
              return (
                <Link
                  key={c}
                  href={`/category/${info.slug}`}
                  className={`catCard ${c === 'Games' ? 'gold' : ''}`}
                >
                  <div className="catCardTop">
                    <span className="catIcon">
                      <Icon size={24} />
                    </span>
                    <span className="catCount">{list.length} tools</span>
                  </div>
                  <h3>{info.short}</h3>
                  <p>{info.description}</p>
                  <div className="catSample">
                    {list.slice(0, 3).map(t => (
                      <span key={t.slug}>{t.name}</span>
                    ))}
                  </div>
                  <span className="catOpen">
                    See all {list.length} {info.short.toLowerCase()} tools
                  </span>
                </Link>
              );
            })}
          </div>
        </section>

        <section className="catBlock">
          <div className="catBlockHead">
            <div>
              <h2>Most used tools</h2>
              <p>The tools people open most often.</p>
            </div>
          </div>
          <div className="toolGrid">
            {pick(popular).map(t => (
              <ToolCard key={t.slug} tool={t} />
            ))}
          </div>
        </section>

        <section className="catBlock">
          <div className="catBlockHead">
            <div>
              <h2>Take a two-minute break</h2>
              <p>Quick games that save your best score.</p>
            </div>
            <Link className="seeAll" href={`/category/${categoryInfo['Games'].slug}`}>
              Play all free games
            </Link>
          </div>
          <div className="toolGrid">
            {tools
              .filter(t => t.category === 'Games')
              .slice(0, 4)
              .map(t => (
                <ToolCard key={t.slug} tool={t} />
              ))}
          </div>
        </section>
      </div>

      <section className="section">
        <div className="container">
          <div className="features">
            {benefits.map(b => {
              const Icon = b.icon;
              return (
                <div className="feature" key={b.title}>
                  <Icon size={24} />
                  <h3>{b.title}</h3>
                  <p>{b.text}</p>
                </div>
              );
            })}
          </div>
          <PromoSlider />
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container article">
          <JsonLd
            data={{
              '@context': 'https://schema.org',
              '@type': 'FAQPage',
              mainEntity: faqs.map(f => ({
                '@type': 'Question',
                name: f.q,
                acceptedAnswer: { '@type': 'Answer', text: f.a },
              })),
            }}
          />
          <h2>Questions people ask</h2>
          <div className="faq">
            {faqs.map(f => (
              <details key={f.q}>
                <summary>{f.q}</summary>
                <p>{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="sectionHead">
            <h2>Guides that answer the next question</h2>
            <p>Plain-language explanations of image formats, compression and resizing.</p>
          </div>
          <div className="heroActions">
            <Link href="/blog" className="btn btnDark">
              Read the guides
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
