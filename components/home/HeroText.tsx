'use client';
import Link from 'next/link';
import { LayoutGrid, Gamepad2 } from 'lucide-react';
import { useT } from '@/lib/i18n';

/** Homepage headline and buttons in the visitor's interface language (English on the server for SEO). */
export function HeroHeadline() {
  const { t } = useT();
  return (
    <h1>
      {t('heroA')} <span className="violetText">{t('heroB')}</span>
    </h1>
  );
}
export function HeroSub() {
  const { t } = useT();
  return <p className="heroSub">{t('heroSub')}</p>;
}
export function HeroButtons({ gamesHref }: { gamesHref: string }) {
  const { t } = useT();
  return (
    <>
      <Link href="#cats" className="btn btnPrimary heroCta">
        <LayoutGrid size={18} /> {t('explore')}
      </Link>
      <Link href={gamesHref} className="btn btnGhost heroCta">
        <Gamepad2 size={18} /> {t('playGames')}
      </Link>
    </>
  );
}
