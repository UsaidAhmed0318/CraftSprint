'use client';
/** App-style bottom navigation on phones and small tablets. "More" opens the side menu. */
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Wrench, Gamepad2, Sparkles, Menu } from 'lucide-react';
import { tools } from '@/data/tools';

export const OPEN_MENU_EVENT = 'cs-open-menu';

export default function MobileTabBar() {
  const path = usePathname() || '/';
  const slug = path.startsWith('/tools/') ? path.split('/')[2] : '';
  const isGame =
    path === '/category/online-games' || tools.some(t => t.slug === slug && t.category === 'Games');
  const tabs = [
    { href: '/', label: 'Home', icon: Home, on: path === '/' },
    {
      href: '/tools',
      label: 'Tools',
      icon: Wrench,
      on: !isGame && (path.startsWith('/tools') || path.startsWith('/category')),
    },
    { href: '/category/online-games', label: 'Games', icon: Gamepad2, on: isGame },
    { href: '/ai', label: 'AI', icon: Sparkles, on: path === '/ai' },
  ];
  return (
    <nav className="tabBar" aria-label="App navigation">
      {tabs.map(({ href, label, icon: Icon, on }) => (
        <Link key={href} href={href} className={on ? 'on' : ''} aria-current={on ? 'page' : undefined}>
          <Icon size={22} aria-hidden="true" />
          <span>{label}</span>
        </Link>
      ))}
      <button type="button" onClick={() => window.dispatchEvent(new Event(OPEN_MENU_EVENT))}>
        <Menu size={22} aria-hidden="true" />
        <span>More</span>
      </button>
    </nav>
  );
}
