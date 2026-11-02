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
                +{site.whatsapp}
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
          </div>
          <div className="footerCol">
            <h4>Legal</h4>
            <Link href="/privacy">Privacy</Link>
            <Link href="/terms">Terms</Link>
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
