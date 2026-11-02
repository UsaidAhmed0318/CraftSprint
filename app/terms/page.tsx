import { withSeo } from '@/lib/seo';
import { site } from '@/lib/site';
export const metadata = withSeo('/terms', {
  title: 'Terms of Use',
  description: 'The terms that apply when you use CraftSprint’s free online tools and games.',
});
export default function Terms() {
  return (
    <main className="section">
      <article className="container article">
        <h1>Terms of Use</h1>
        <p>Last updated: 27 October 2026</p>
        <p>By using CraftSprint you agree to these terms. If you do not agree, please do not use the site.</p>
        <h2>Using the tools</h2>
        <p>
          CraftSprint provides free, general-purpose tools and games. You may use them for personal and
          commercial work. You are responsible for checking every result — converted files, calculations,
          generated code or text — before relying on it for important decisions.
        </p>
        <h2>Your content</h2>
        <p>
          You keep all rights to the files and text you use with our tools. Only process content you have the
          right to use. Most processing happens on your device and we do not receive your files.
        </p>
        <h2>Acceptable use</h2>
        <p>
          Do not use the site to break the law, to infringe anyone&apos;s rights, to attack or overload our
          servers, or to remove protections from documents you are not authorised to unlock.
        </p>
        <h2>Calculators and health or financial tools</h2>
        <p>
          Calculators such as BMI, loan EMI and zakat give estimates for information only. They are not
          medical, financial, legal or religious advice. Consult a qualified professional or scholar for
          decisions that matter.
        </p>
        <h2>No warranty</h2>
        <p>
          The tools are provided “as is” without warranties of any kind. We do not guarantee that the site
          will always be available, error-free or suitable for a particular purpose.
        </p>
        <h2>Limitation of liability</h2>
        <p>
          To the extent allowed by law, CraftSprint is not liable for any loss arising from your use of the
          site or its results.
        </p>
        <h2>Changes</h2>
        <p>
          We may change these terms or the tools at any time. Continued use after a change means you accept
          the new terms.
        </p>
        <h2>Contact</h2>
        <p>Questions about these terms: {site.email}</p>
      </article>
    </main>
  );
}
