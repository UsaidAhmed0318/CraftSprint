import { withSeo } from '@/lib/seo';
import { site } from '@/lib/site';
export const metadata = withSeo('/privacy', {
  title: 'Privacy Policy',
  description:
    'How CraftSprint handles your files, cookies, analytics, advertising and the preferences saved in your browser.',
});
export default function Privacy() {
  return (
    <main className="section">
      <article className="container article">
        <h1>Privacy Policy</h1>
        <p>Last updated: 27 October 2026</p>
        <p>
          CraftSprint (“we”, “us”) runs free online tools at this website. This policy explains what
          information is processed when you use the site and the choices you have.
        </p>
        <h2>Files and text you use in tools</h2>
        <p>
          Almost every tool runs entirely in your browser. Images, PDFs, audio, video and text you open in
          these tools are processed on your own device and are not uploaded to our servers. The exceptions are
          the currency converter, which requests exchange rates from a third-party rate service, and the API
          testing tool, which sends the request you build to the address you enter.
        </p>
        <h2>Information saved in your browser</h2>
        <p>
          We use your browser&apos;s local storage to remember your favourite tools, recently used tools, your
          light or dark theme choice your best scores in games and data you create in tools such as the task
          board. Files and text you put into a tool are never saved: they are processed in your browser and
          cleared when you leave the page. This information stays on your device; we cannot see it. You can
          clear it at any time by clearing this site&apos;s data in your browser settings.
        </p>
        <h2>Contact form</h2>
        <p>
          If you send a message through the contact form, we receive your name, email address and message so
          we can reply. We do not sell this information.
        </p>
        <h2>Analytics</h2>
        <p>
          We may use Google Analytics to understand how many people visit and which tools are useful. Google
          Analytics uses cookies and collects information such as pages viewed, approximate location, device
          and browser type. It does not receive the files or text you use in tools. You can opt out with
          Google&apos;s browser add-on at tools.google.com/dlpage/gaoptout.
        </p>
        <h2>Advertising</h2>
        <p>
          We may show ads served by Google AdSense. Google and its partners use cookies to serve ads based on
          your prior visits to this and other websites. Google&apos;s use of advertising cookies enables it
          and its partners to serve ads based on those visits. You can opt out of personalised advertising at
          adssettings.google.com, and learn more at policies.google.com/technologies/ads. Where the law
          requires it (for example in the EEA, the UK and Switzerland), we ask for your consent before
          personalised ads or analytics cookies are used.
        </p>
        <h2>Third-party links</h2>
        <p>
          Some pages link to other websites, including sponsored links. Those sites have their own privacy
          policies.
        </p>
        <h2>Children</h2>
        <p>
          This site is intended for a general audience and is not directed at children under 13. We do not
          knowingly collect personal information from children.
        </p>
        <h2>Your rights</h2>
        <p>
          Depending on where you live, you may have the right to access, correct or delete personal
          information we hold about you. To make a request, email us at {site.email}.
        </p>
        <h2>Changes</h2>
        <p>We may update this policy. The date at the top shows when it last changed.</p>
        <h2>CraftSprint AI</h2>
        <p>
          When you use “Chat with AI”, your messages are sent to an AI provider (Google Gemini, or Anthropic
          Claude) to create the answer. Google’s free Gemini service may use these messages to improve its
          products. CraftSprint does not store or log your chats. Please don’t share private or sensitive
          information in the chat.
        </p>
        <h2>Contact</h2>
        <p>Questions about this policy: {site.email}</p>
      </article>
    </main>
  );
}
