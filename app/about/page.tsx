import { withSeo } from '@/lib/seo';
import Link from 'next/link';
import PromoSlider from '@/components/home/PromoSlider';
import { tools, categories } from '@/data/tools';
export const metadata = withSeo('/about', {
  title: 'About CraftSprint',
  description:
    'Who builds CraftSprint, how the free browser-based tools work and are tested, and how the site is funded.',
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

        <h2>Who builds CraftSprint</h2>
        <p>
          CraftSprint is built and maintained by the team behind{' '}
          <a href="https://www.overthestack.com/" target="_blank" rel="noopener noreferrer">
            Over The Stack Solutions
          </a>
          , a software development company. We design, code and test every tool ourselves, and we use them in
          our own daily work — compressing images for websites, merging PDFs for clients, formatting JSON
          while coding.
        </p>
        <h2>How the tools work</h2>
        <p>
          Almost every tool runs entirely in your web browser. Your images, PDFs, audio and video are
          processed on your own device and are not uploaded to our servers. That makes the tools fast, private
          and usable without an account. The few features that need the internet — such as live currency
          rates, website speed tests or domain age — say so on the tool page.
        </p>
        <h2>How we test</h2>
        <p>
          Before a tool goes live we run it with real files in a real browser: we check that the result is
          correct, that downloads open, that it works on a phone, and that it is accessible with a keyboard
          and screen reader. When a visitor reports a problem, we fix it and test again. If something does not
          work for you, please <Link href="/contact">tell us</Link> — we read every message.
        </p>
        <h2>How CraftSprint is funded</h2>
        <p>
          The tools are free. CraftSprint is supported by advertising (Google AdSense) and by the web
          development services of Over The Stack Solutions. Ads are labelled and never placed inside the tool
          controls. See the <Link href="/privacy">privacy policy</Link> for how advertising cookies work and
          how to opt out.
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
