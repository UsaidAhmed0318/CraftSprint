import Link from 'next/link';
import Image from 'next/image';
import { site } from '@/lib/site';
import { categories } from '@/data/tools';
import { categoryInfo } from '@/lib/categories';
export default function Footer() {
  return (
    <footer className="siteFooter">
      <div className="container">
        <div className="footerGrid">
          <div className="footerBrand">
            <div className="brand" style={{ color: '#fff', gap: 10 }}>
              <Image src="/images/favicon.png" alt="" width={30} height={30} style={{ borderRadius: 8 }} />
              CraftSprint
            </div>
            <p>
              Simple, fast online tools for images, text and developers. Built for everyday work with privacy
              and performance in mind.
            </p>
            <p style={{ marginTop: 14 }}>
              WhatsApp:{' '}
              <a href={`https://wa.me/${site.whatsapp}`} style={{ color: '#fff', fontWeight: 700 }}>
                {site.whatsappDisplay}
              </a>
            </p>
          </div>
          <div className="footerCol">
            <h4>Categories</h4>
            {categories.map(c => (
              <Link key={c} href={`/category/${categoryInfo[c].slug}`}>
                {categoryInfo[c].short}
              </Link>
            ))}
          </div>
          <div className="footerCol">
            <h4>Company</h4>
            <Link href="/services">Services</Link>
            <Link href="/blog">Guides</Link>
            <Link href="/about">About</Link>
            <Link href="/contact">Contact</Link>
            <Link href="/faq">FAQ</Link>
          </div>
          <div className="footerCol">
            <h4>Follow us</h4>
            <a href="https://www.youtube.com/@Craft_Sprint" target="_blank" rel="noopener noreferrer">
              YouTube
            </a>
            <a href="https://www.facebook.com/CraftSprint.io" target="_blank" rel="noopener noreferrer">
              Facebook
            </a>
            <a href="https://www.instagram.com/craftsprint.io/" target="_blank" rel="noopener noreferrer">
              Instagram
            </a>
            <a
              href="https://www.linkedin.com/company/craft-sprint/"
              target="_blank"
              rel="noopener noreferrer"
            >
              LinkedIn
            </a>
            <a href="https://x.com/UsaidD43890" target="_blank" rel="noopener noreferrer">
              X (Twitter)
            </a>
          </div>
          <div className="footerCol">
            <h4>Legal</h4>
            <Link href="/privacy">Privacy</Link>
            <Link href="/terms">Terms</Link>
            <Link href="/cookies">Cookies</Link>
          </div>
        </div>
        <div className="copyright">
          <span>© {new Date().getFullYear()} CraftSprint</span>
          <span>Made for useful work.</span>
        </div>
      </div>
    </footer>
  );
}
