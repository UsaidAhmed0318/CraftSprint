import Link from 'next/link';
import { withSeo } from '@/lib/seo';

export const metadata = withSeo('/cookies', {
  title: 'Cookie Policy',
  description:
    'Which cookies and browser storage CraftSprint uses, what they are for (preferences, analytics, advertising) and how to control or delete them.',
});

export default function CookiesPage() {
  return (
    <main className="section">
      <div className="container article">
        <span className="kicker">Legal</span>
        <h1>Cookie policy</h1>
        <p>
          This page explains what CraftSprint stores in your browser and why. It should be read together with
          our <Link href="/privacy">privacy policy</Link>.
        </p>

        <h2>What cookies are</h2>
        <p>
          Cookies are small text files that a website saves in your browser. Similar technologies, such as
          local storage, do the same job. They let a site remember choices, measure visits and show
          advertising.
        </p>

        <h2>What CraftSprint stores</h2>
        <h3>1. Preferences (stored only on your device)</h3>
        <p>
          Your theme (light or dark), language, favourite tools, recently used tools, game high scores, tasks
          on the Kanban board and downloaded AI models are kept in your browser’s storage so the site works
          the way you left it. This information is not sent to us.
        </p>
        <h3>2. Analytics (Google Analytics 4)</h3>
        <p>
          We use Google Analytics to count visits and see which tools are used, so we can improve them. It
          sets cookies such as <code>_ga</code>. It never receives your files or the text you type into tools.
        </p>
        <h3>3. Advertising (Google AdSense)</h3>
        <p>
          CraftSprint is free because it shows ads. Google and its partners use cookies to show and measure
          ads, and — where you allow it — to personalise them based on your visits to this and other websites.
        </p>

        <h2>Your choices</h2>
        <ul>
          <li>
            In the EEA, the UK and Switzerland, a consent message asks before analytics or personalised
            advertising cookies are used, and you can change your choice at any time from that message.
          </li>
          <li>
            Turn off personalised ads in{' '}
            <a href="https://adssettings.google.com" target="_blank" rel="noopener noreferrer">
              Google Ads Settings
            </a>{' '}
            or at{' '}
            <a href="https://www.aboutads.info" target="_blank" rel="noopener noreferrer">
              www.aboutads.info
            </a>
            .
          </li>
          <li>
            Block Google Analytics with the{' '}
            <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer">
              Google Analytics opt-out add-on
            </a>
            .
          </li>
          <li>
            Delete or block cookies in your browser settings. The tools keep working, but saved preferences
            such as favourites and high scores will be lost.
          </li>
        </ul>

        <h2>Changes and contact</h2>
        <p>
          We update this page when the cookies we use change. Questions?{' '}
          <Link href="/contact">Contact us</Link>.
        </p>
      </div>
    </main>
  );
}
