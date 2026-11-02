import { withSeo } from '@/lib/seo';
import Link from 'next/link';
import PromoSlider from '@/components/home/PromoSlider';
import { tools, categories } from '@/data/tools';
export const metadata = withSeo('/about', {
  title: 'About CraftSprint',
  description: 'Learn why CraftSprint was built and how its browser-based utilities work.',
});
export default function About() {
  return (
    <main className="section">
      <div className="container article">
        <span className="kicker">About</span>
        <h1>Useful tools without unnecessary friction.</h1>
        <p>
          CraftSprint is a collection of focused web utilities for common digital tasks. The goal is simple:
          make repetitive work faster while keeping the interface clear and the workflow privacy-friendly.
        </p>

        <div className="statGrid">
          <div className="statCard">
            <b>{tools.length}</b>
            <span>Free tools</span>
          </div>
          <div className="statCard">
            <b>{categories.length}</b>
            <span>Categories</span>
          </div>
          <div className="statCard">
            <b>0</b>
            <span>Signup required</span>
          </div>
        </div>

        <div className="vipCard">
          <h2 style={{ marginTop: 0 }}>Privacy-first processing</h2>
          <p>
            Most of our tools are designed to process files in your browser. That means you can select an
            image, document or file, perform the operation and download the result — without a traditional
            upload workflow that sends your data to a server.
          </p>
        </div>

        <PromoSlider />

        <h2>Built for the web</h2>
        <p>
          Every tool has its own focused page, accessible navigation, descriptive content and search-friendly
          metadata. We publish practical guides instead of relying on thin pages created only for search
          traffic.
        </p>

        <h2>Have a tool in mind?</h2>
        <p>
          If there is a tool you wish existed,{' '}
          <Link href="/contact" style={{ color: 'var(--brand)', fontWeight: 700 }}>
            tell us
          </Link>{' '}
          — new tools are added regularly.
        </p>
      </div>
    </main>
  );
}
