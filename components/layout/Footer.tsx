import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowUp,
  Facebook,
  Gift,
  Instagram,
  Linkedin,
  LayoutGrid,
  Mail,
  MessageCircle,
  ShieldCheck,
  Twitter,
  UserX,
  Youtube,
} from 'lucide-react';
import { site } from '@/lib/site';
import { categories, tools } from '@/data/tools';
import { categoryInfo } from '@/lib/categories';

const POPULAR = [
  'background-remover',
  'image-compressor',
  'pdf-merge',
  'pdf-to-word',
  'qr-code-generator',
  'video-compressor',
  'audio-trimmer',
  'word-counter',
];
const SOCIAL = [
  { href: 'https://www.youtube.com/@Craft_Sprint', label: 'YouTube', Icon: Youtube },
  { href: 'https://www.facebook.com/CraftSprint.io', label: 'Facebook', Icon: Facebook },
  { href: 'https://www.instagram.com/craftsprint.io/', label: 'Instagram', Icon: Instagram },
  { href: 'https://www.linkedin.com/company/craft-sprint/', label: 'LinkedIn', Icon: Linkedin },
  { href: 'https://x.com/UsaidD43890', label: 'X (Twitter)', Icon: Twitter },
];

export default function Footer() {
  const games = tools.filter(t => t.category === 'Games').length;
  const popular = POPULAR.map(s => tools.find(t => t.slug === s)).filter(Boolean) as typeof tools;
  const trust = [
    { Icon: Gift, title: '100% free', text: 'No plans, no limits, no watermark' },
    { Icon: ShieldCheck, title: 'Private by design', text: 'Files stay on your device' },
    { Icon: UserX, title: 'No sign-up', text: 'Open a tool and start' },
    {
      Icon: LayoutGrid,
      title: `${tools.length - games} tools · ${games} games`,
      text: 'One place for everyday work',
    },
  ];
  return (
    <footer className="siteFooter ft">
      <div className="container">
        <div className="ftCta">
          <div>
            <h2>Need a tool we don’t have yet?</h2>
            <p>
              Tell us what would save you time. We also build custom websites, apps and tools for businesses.
            </p>
          </div>
          <div className="ftCtaBtns">
            <Link href="/contact" className="btn ftBtnLight">
              Request a tool
            </Link>
            <Link href="/services" className="btn ftBtnGhost">
              Our services
            </Link>
          </div>
        </div>

        <ul className="ftTrust">
          {trust.map(({ Icon, title, text }) => (
            <li key={title}>
              <span className="ftTrustIcon" aria-hidden="true">
                <Icon size={20} />
              </span>
              <span>
                <b>{title}</b>
                <small>{text}</small>
              </span>
            </li>
          ))}
        </ul>

        <div className="ftGrid">
          <div className="ftBrand">
            <Link href="/" className="ftLogo">
              <Image
                src="/images/favicon.png"
                alt="CraftSprint logo"
                aria-hidden="true"
                width={38}
                height={38}
              />
              CraftSprint
            </Link>
            <p>
              Free online tools and games for images, PDFs, video, writing and code. Fast, private and built
              for everyday work.
            </p>
            <a
              className="ftContact"
              href={`https://wa.me/${site.whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <MessageCircle size={17} aria-hidden="true" /> WhatsApp: {site.whatsappDisplay}
            </a>
            <a className="ftContact" href={`mailto:${site.email}`}>
              <Mail size={17} aria-hidden="true" /> {site.email}
            </a>
            <div className="ftSocial">
              {SOCIAL.map(({ href, label, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`CraftSprint on ${label}`}
                  title={label}
                >
                  <Icon size={19} aria-hidden="true" />
                </a>
              ))}
            </div>
          </div>

          <nav className="ftCol" aria-label="Popular tools">
            <h3>Popular tools</h3>
            {popular.map(t => (
              <Link key={t.slug} href={`/tools/${t.slug}`}>
                {t.name}
              </Link>
            ))}
            <Link href="/tools" className="ftMore">
              All tools →
            </Link>
          </nav>

          <nav className="ftCol ftCats" aria-label="Categories">
            <h3>Categories</h3>
            <div className="ftCatGrid">
              {categories.map(c => (
                <Link key={c} href={`/category/${categoryInfo[c].slug}`}>
                  {categoryInfo[c].short}
                </Link>
              ))}
            </div>
          </nav>

          <nav className="ftCol" aria-label="Company">
            <h3>Company</h3>
            <Link href="/about">About</Link>
            <Link href="/services">Services</Link>
            <Link href="/blog">Guides</Link>
            <Link href="/ai">CraftSprint AI</Link>
            <Link href="/faq">FAQ</Link>
            <Link href="/contact">Contact</Link>
            <h3 className="ftSub">Legal</h3>
            <Link href="/privacy">Privacy</Link>
            <Link href="/terms">Terms</Link>
            <Link href="/cookies">Cookies</Link>
          </nav>
        </div>

        <div className="ftBottom">
          <span>
            © {new Date().getFullYear()} CraftSprint. Built by{' '}
            <a href="https://www.overthestack.com/" target="_blank" rel="noopener noreferrer">
              Over The Stack Solutions
            </a>
            .
          </span>
          <a href="#" className="ftTop">
            <ArrowUp size={16} aria-hidden="true" /> Back to top
          </a>
        </div>
      </div>
    </footer>
  );
}
