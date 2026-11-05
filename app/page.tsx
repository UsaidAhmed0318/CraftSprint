import Link from 'next/link';
import JsonLd from '@/components/shared/JsonLd';
import ToolCard from '@/components/shared/ToolCard';
import PromoSlider from '@/components/home/PromoSlider';
import SearchBar from '@/components/layout/SearchBar';
import QuickStrip from '@/components/home/QuickStrip';
import Hero3D from '@/components/home/Hero3D';
import AiShowcase, { AskAiButton } from '@/components/home/AiShowcase';
import {
  ShieldCheck,
  Zap,
  Lock,
  Gift,
  Smartphone,
  Sparkles,
  Wrench,
  LayoutGrid,
  UploadCloud,
  Bot,
  ArrowRight,
  Gamepad2,
  Youtube,
  Briefcase,
  GraduationCap,
  Code2,
  Store,
} from 'lucide-react';
import { HeroHeadline, HeroSub, HeroButtons } from '@/components/home/HeroText';
import GamePoster from '@/components/shared/GamePoster';
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
        <div className="heroGridBg" aria-hidden="true" />
        <div className="heroParticles" aria-hidden="true">
          {Array.from({ length: 18 }, (_, i) => (
            <span key={i} style={{ '--i': i } as React.CSSProperties} />
          ))}
        </div>
        <div className="container heroVipGrid">
          <div className="heroVipText">
            <span className="eyebrow">
              <i className="eyebrowDot" />
              {tools.length} free tools · no signup · files stay on your device
            </span>
            <HeroHeadline />
            <HeroSub />
            <p>
              Image editing, PDF tools, text and SEO helpers, developer utilities, calculators, media tools
              and quick games — plus <b>CraftSprint AI</b> to find the right tool for you.
            </p>
            <div className="heroSearch">
              <SearchBar />
            </div>
            <div className="heroCtas">
              <HeroButtons gamesHref={`/category/${categoryInfo['Games'].slug}`} />
              <AskAiButton />
            </div>
            <div className="heroMini" aria-label="CraftSprint in numbers">
              <div>
                <Wrench size={20} />
                <b>{tools.length}</b>
                <small>Tools</small>
              </div>
              <div>
                <Gamepad2 size={20} />
                <b>{tools.filter(t => t.category === 'Games').length}</b>
                <small>Games</small>
              </div>
              <div>
                <LayoutGrid size={20} />
                <b>{categories.length}</b>
                <small>Categories</small>
              </div>
              <div>
                <Gift size={20} />
                <b>100%</b>
                <small>Free</small>
              </div>
            </div>
            <div className="heroTrust">
              <span>
                <ShieldCheck size={16} /> Files stay on your device
              </span>
              <span>
                <Zap size={16} /> Instant, no waiting
              </span>
              <span>
                <Lock size={16} /> No signup needed
              </span>
            </div>
          </div>
          <Hero3D />
        </div>
      </section>

      <div className="container">
        <QuickStrip />
        <section className="panelBox" aria-labelledby="cats" style={{ marginTop: 26 }}>
          <div className="panelHead">
            <div>
              <span className="sectionKicker">
                <Sparkles size={13} /> Popular categories
              </span>
              <h2 id="cats">Explore our tool categories</h2>
            </div>
            <Link className="pillLink" href="/tools">
              View all tools <ArrowRight size={14} />
            </Link>
          </div>
          <div className="catTiles">
            {categories.map((c, i) => {
              const info = categoryInfo[c];
              const Icon = categoryIcon[c];
              const n = tools.filter(t => t.category === c).length;
              return (
                <Link key={c} href={`/category/${info.slug}`} className="catTile">
                  <span className={`catTileIcon g${(i % 9) + 1}`}>
                    <Icon size={22} />
                  </span>
                  <span>
                    <b>{info.short}</b>
                    <small>
                      {n} {c === 'Games' ? 'games' : 'tools'}
                    </small>
                  </span>
                </Link>
              );
            })}
          </div>
        </section>

        <section className="panelBox" style={{ marginTop: 40 }} aria-labelledby="why">
          <div className="whyGrid">
            <div className="whyArt" aria-hidden="true">
              <div className="whyLaptop">
                <div className="img" />
                <div className="bar m" />
                <div className="bar s" />
                <div className="bar" />
              </div>
              <span className="whyFloat a g6">
                <Zap size={28} />
              </span>
              <span className="whyFloat b g1">
                <UploadCloud size={28} />
              </span>
              <span className="whyFloat c g3">
                <Bot size={28} />
              </span>
            </div>
            <div>
              <span className="sectionKicker">
                <Sparkles size={13} /> Why CraftSprint
              </span>
              <h2 id="why" style={{ margin: '6px 0 0' }}>
                Fast, free and private by design
              </h2>
              <div className="whyItems">
                {[
                  { i: Zap, t: 'Instant results', d: 'Tools run in your browser', g: 'g6' },
                  { i: Gift, t: '100% free', d: 'No account, no watermark', g: 'g3' },
                  { i: ShieldCheck, t: 'Privacy first', d: 'Files are not uploaded', g: 'g4' },
                  { i: Smartphone, t: 'Works anywhere', d: 'Phone, tablet, desktop', g: 'g1' },
                  { i: Bot, t: 'CraftSprint AI', d: 'Finds the right tool', g: 'g9' },
                  { i: Lock, t: 'No signup', d: 'Open a tool and start', g: 'g7' },
                ].map(({ i: Icon, t, d, g }) => (
                  <div className="whyItem" key={t}>
                    <span className={g}>
                      <Icon size={18} />
                    </span>
                    <div>
                      <b>{t}</b>
                      <small>{d}</small>
                    </div>
                  </div>
                ))}
              </div>
              <Link href="#cats" className="btn btnPrimary heroCta">
                Start using CraftSprint free <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </section>

        <div className="statsRow" style={{ marginTop: 30 }}>
          <div>
            <Wrench size={30} />
            <span>
              <b>{tools.length}</b>
              <small>free tools</small>
            </span>
          </div>
          <div>
            <LayoutGrid size={30} />
            <span>
              <b>{categories.length}</b>
              <small>categories</small>
            </span>
          </div>
          <div>
            <UploadCloud size={30} />
            <span>
              <b>0</b>
              <small>file uploads to a server</small>
            </span>
          </div>
          <div>
            <Gift size={30} />
            <span>
              <b>100%</b>
              <small>free, no signup</small>
            </span>
          </div>
        </div>

        <section className="catBlock" aria-labelledby="kits">
          <div className="catBlockHead">
            <div>
              <h2 id="kits">Tool kits for your work</h2>
              <p>Hand-picked tools for what you do every day.</p>
            </div>
            <Link className="seeAll" href="/workspace">
              Open the file workspace
            </Link>
          </div>
          <div className="kitGrid">
            {[
              {
                name: 'YouTube creator kit',
                icon: Youtube,
                slugs: [
                  'image-studio',
                  'video-thumbnail-grabber',
                  'ai-writing-studio',
                  'screen-recorder',
                  'hashtag-generator',
                ],
              },
              {
                name: 'Freelancer kit',
                icon: Briefcase,
                slugs: [
                  'invoice-generator',
                  'freelance-rate-calculator',
                  'payment-reminder-generator',
                  'whatsapp-link-generator',
                  'pdf-merge',
                ],
              },
              {
                name: 'Student kit',
                icon: GraduationCap,
                slugs: [
                  'citation-generator',
                  'gpa-calculator',
                  'word-counter',
                  'pomodoro-timer',
                  'speech-to-text',
                ],
              },
              {
                name: 'Developer kit',
                icon: Code2,
                slugs: ['json-formatter', 'regex-tester', 'sql-formatter', 'jwt-decoder', 'api-tester'],
              },
              {
                name: 'Small business kit',
                icon: Store,
                slugs: [
                  'google-review-qr-generator',
                  'smart-qr-generator',
                  'profit-margin-calculator',
                  'receipt-maker',
                  'open-graph-generator',
                ],
              },
            ].map(k => (
              <div className="kitCard" key={k.name}>
                <h3>
                  <k.icon size={20} aria-hidden="true" /> {k.name}
                </h3>
                <ul>
                  {k.slugs.map(s => {
                    const t = tools.find(x => x.slug === s);
                    return t ? (
                      <li key={s}>
                        <Link href={`/tools/${s}`}>{t.name}</Link>
                      </li>
                    ) : null;
                  })}
                </ul>
              </div>
            ))}
          </div>
        </section>

        <AiShowcase />

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
              <p>Quick games that run in your browser and remember your best score.</p>
            </div>
            <Link className="seeAll" href={`/category/${categoryInfo['Games'].slug}`}>
              Play all free games
            </Link>
          </div>
          <div className="posterRow">
            {tools
              .filter(t => t.category === 'Games')
              .slice(0, 5)
              .map((t, i) => (
                <GamePoster key={t.slug} tool={t} index={i} />
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
