import Link from 'next/link';
import { withSeo } from '@/lib/seo';
import { site } from '@/lib/site';

export const metadata = withSeo('/services', {
  title: 'Website & Tool Development Services',
  description:
    'Need a fast website, a custom online tool or a calculator for your business? The team behind CraftSprint builds them. Get a free quote.',
});

const services = [
  {
    title: 'Business websites',
    text: 'Fast, mobile-friendly sites with clean SEO foundations, built on the same stack that powers CraftSprint.',
  },
  {
    title: 'Custom online tools',
    text: 'Calculators, converters, quote builders and file tools that run in the browser and keep customer data private.',
  },
  {
    title: 'Speed & SEO fixes',
    text: 'Audit and repair of slow pages, layout shifts, missing metadata, sitemaps and structured data on an existing site.',
  },
];

export default function Services() {
  return (
    <main className="section">
      <div className="container article">
        <span className="kicker">Services</span>
        <h1>Need a tool or website like this one?</h1>
        <p>
          CraftSprint&apos;s 137 tools are built and maintained in-house. We take on a small number of client
          projects each month: websites, custom tools and performance work.
        </p>
        <div className="servicesGrid">
          {services.map(s => (
            <section key={s.title} className="serviceItem">
              <h2>{s.title}</h2>
              <p>{s.text}</p>
            </section>
          ))}
        </div>
        <h2>How it works</h2>
        <ol>
          <li>Tell us what you need on the contact page or WhatsApp.</li>
          <li>We reply with a fixed quote and a timeline.</li>
          <li>You review a working preview before anything goes live.</li>
        </ol>
        <div className="heroActions" style={{ justifyContent: 'flex-start' }}>
          <Link className="btn btnPrimary" href="/contact">
            Get a free quote
          </Link>
          <a
            className="btn btnGhost"
            href={`https://wa.me/${site.whatsapp}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            Message on WhatsApp
          </a>
        </div>
      </div>
    </main>
  );
}
