import Link from "next/link";
import { ArrowRight, CheckCircle2, LockKeyhole, Globe2 } from "lucide-react";
import ToolCard from "@/components/ToolCard";
import PromoSlider from "@/components/PromoSlider";
import { tools, benefits } from "@/data/tools";
import JsonLd from "@/components/JsonLd";
import { site } from "@/lib/site";
export default function Home() {
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: site.name,
          url: site.url,
          description: site.description,
        }}
      />
      <main>
        <section className="hero">
          <div className="container">
            <span className="eyebrow">
              ✦ 93+ free tools · No signup required · Works in your browser
            </span>
            <h1>
              Everyday tools that just <span>work.</span>
            </h1>
            <p>
              Compress images, convert formats, resize photos and clean messy
              text — quickly, privately and without installing software.
            </p>
            <div className="heroActions">
              <Link href="#tools" className="btn btnPrimary">
                Explore tools <ArrowRight size={17} />
              </Link>
              <Link href="/about" className="btn btnGhost">
                How it works
              </Link>
            </div>
          </div>
        </section>
        <div className="container">
          <PromoSlider />
        </div>
        <section className="section" id="tools">
          <div className="container">
            <div className="sectionHead">
              <span className="kicker">Popular tools</span>
              <h2>Small tools. Big time savings.</h2>
              <p>Focused utilities for common tasks people repeat every day.</p>
            </div>
            <div className="toolGrid">
              {tools.map((t) => (
                <ToolCard key={t.slug} tool={t} />
              ))}
            </div>
          </div>
        </section>
        <section className="section">
          <div className="container">
            <div className="features">
              {benefits.map((b) => {
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
          </div>
        </section>
        <section className="section">
          <div className="container">
            <div className="sectionHead">
              <span className="kicker">Learn</span>
              <h2>Guides that answer the next question.</h2>
              <p>
                Useful, original explanations around image formats, compression,
                resizing and clean text workflows.
              </p>
            </div>
            <div className="heroActions">
              <Link href="/blog" className="btn btnDark">
                Read guides <ArrowRight size={17} />
              </Link>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
