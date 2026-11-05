'use client';
import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Menu,
  X,
  ChevronDown,
  Home,
  LayoutGrid,
  Gamepad2,
  Sparkles,
  Shapes,
  Heart,
  Download,
  BookOpen,
  Info,
  Mail,
  MessageCircle,
  FolderOpen,
} from 'lucide-react';
import ThemeToggle from '@/components/layout/ThemeToggle';
import { categoryInfo } from '@/lib/categories';
import SearchBar from '@/components/layout/SearchBar';
import { openInstall } from '@/lib/utils/pwa';
import { site } from '@/lib/site';
import { OPEN_MENU_EVENT } from '@/components/layout/MobileTabBar';
import { usePathname } from 'next/navigation';
import { tools, categories } from '@/data/tools';

export default function Header() {
  const [open, setOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileCat, setMobileCat] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  // "More" in the bottom tab bar opens this menu.
  useEffect(() => {
    const onOpen = () => setOpen(true);
    window.addEventListener(OPEN_MENU_EVENT, onOpen);
    return () => window.removeEventListener(OPEN_MENU_EVENT, onOpen);
  }, []);
  // Close the menu after navigating.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- close the drawer when the page changes
    setOpen(false);
  }, [pathname]);
  // Stop the page behind the open menu from scrolling.
  useEffect(() => {
    document.documentElement.classList.toggle('menuOpen', open);
  }, [open]);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(prev => (prev ? y > 4 : y > 24));
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header className={`siteHeader ${scrolled ? 'scrolled' : ''}`}>
      <div className="container nav">
        <Link href="/" className="brand" aria-label="CraftSprint home" onClick={() => setOpen(false)}>
          <Image src="/images/favicon.png" alt="" width={36} height={36} priority className="brandMark" />
          <span className="brandName">CraftSprint</span>
        </Link>
        <nav className="navLinks">
          <div className="megaWrap" ref={menuRef}>
            <button className="megaTrigger" onClick={() => setMenuOpen(v => !v)}>
              All tools <ChevronDown size={15} />
            </button>
            {menuOpen && (
              <div className="megaPanel">
                {categories.map(cat => (
                  <div className="megaCol" key={cat}>
                    <h4>{categoryInfo[cat].short}</h4>
                    {tools
                      .filter(t => t.category === cat)
                      .slice(0, 6)
                      .map(t => (
                        <Link key={t.slug} href={`/tools/${t.slug}`} onClick={() => setMenuOpen(false)}>
                          {t.name}
                        </Link>
                      ))}
                    <Link
                      className="megaAll"
                      href={`/category/${categoryInfo[cat].slug}`}
                      onClick={() => setMenuOpen(false)}
                    >
                      All {tools.filter(t => t.category === cat).length}{' '}
                      {categoryInfo[cat].short.toLowerCase()}
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
          <Link href="/category/online-games">Games</Link>
          <Link href="/prompts">Prompts</Link>
          <Link href="/blog">Guides</Link>
          <Link href="/about">About</Link>
          <Link href="/contact">Contact</Link>
          <Link href="/ai" className="navAi">
            <Image src="/images/favicon.png" alt="" width={18} height={18} />
            CraftSprint AI
          </Link>
        </nav>
        <div className="navRight">
          <SearchBar compact />
          <ThemeToggle />
          <button type="button" className="navInstall" onClick={() => openInstall()}>
            <Download size={16} aria-hidden="true" /> Install App
          </button>
        </div>
        <div className="mobileOnly">
          <ThemeToggle />
          <button className="mobileNav" aria-label="Toggle menu" onClick={() => setOpen(v => !v)}>
            {open ? <X /> : <Menu />}
          </button>
        </div>
      </div>
      <div className={`mobileMenu ${open ? 'open' : ''}`} aria-hidden={!open}>
        <div className="drawerInner">
          <div className="drawerSearch">
            <SearchBar />
          </div>
          <nav className="drawerList" aria-label="Menu">
            <Link href="/" onClick={() => setOpen(false)}>
              <Home size={19} /> Home
            </Link>
            <Link href="/tools" onClick={() => setOpen(false)}>
              <LayoutGrid size={19} /> All tools
            </Link>
            <Link href="/category/online-games" onClick={() => setOpen(false)}>
              <Gamepad2 size={19} /> Games
            </Link>
            <Link href="/ai" onClick={() => setOpen(false)}>
              <Sparkles size={19} /> AI assistant
            </Link>
            <button
              type="button"
              className="drawerToggle"
              onClick={() => setMobileCat(c => (c ? null : 'all'))}
              aria-expanded={!!mobileCat}
            >
              <Shapes size={19} /> Categories{' '}
              <ChevronDown
                size={15}
                style={{ marginLeft: 'auto', transform: mobileCat ? 'rotate(180deg)' : 'none' }}
              />
            </button>
            {mobileCat && (
              <div className="drawerSub">
                {categories.map(cat => (
                  <Link key={cat} href={`/category/${categoryInfo[cat].slug}`} onClick={() => setOpen(false)}>
                    {categoryInfo[cat].short}
                    <small>{tools.filter(t => t.category === cat).length}</small>
                  </Link>
                ))}
              </div>
            )}
            <Link href="/workspace" onClick={() => setOpen(false)}>
              <FolderOpen size={19} /> File workspace
            </Link>
            <Link href="/my-tools" onClick={() => setOpen(false)}>
              <Heart size={19} /> Favourites &amp; history
            </Link>
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                openInstall();
              }}
            >
              <Download size={19} /> Install app <span className="drawerNew">New</span>
            </button>
            <Link href="/prompts" onClick={() => setOpen(false)}>
              <Sparkles size={19} /> AI prompt library
            </Link>
            <Link href="/blog" onClick={() => setOpen(false)}>
              <BookOpen size={19} /> Guides
            </Link>
            <Link href="/about" onClick={() => setOpen(false)}>
              <Info size={19} /> About us
            </Link>
            <Link href="/contact" onClick={() => setOpen(false)}>
              <Mail size={19} /> Contact us
            </Link>
            <a href={`https://wa.me/${site.whatsapp}`} target="_blank" rel="noopener noreferrer">
              <MessageCircle size={19} /> WhatsApp us
            </a>
          </nav>
          <div className="drawerBrand">
            <Image src="/icons/icon-192.png" alt="" width={44} height={44} />
            <div>
              <b>CraftSprint</b>
              <small>Work smarter, not harder.</small>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
