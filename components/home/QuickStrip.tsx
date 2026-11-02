'use client';
import Link from 'next/link';
import { Star, History } from 'lucide-react';
import { tools } from '@/data/tools';
import { usePrefs } from '@/lib/userPrefs';

export default function QuickStrip() {
  const { favorites, recent } = usePrefs();
  const fav = favorites.map(s => tools.find(t => t.slug === s)).filter(Boolean) as typeof tools;
  const rec = recent
    .filter(s => !favorites.includes(s))
    .map(s => tools.find(t => t.slug === s))
    .filter(Boolean)
    .slice(0, 6) as typeof tools;
  if (!fav.length && !rec.length) return null;
  return (
    <div className="quickStrip">
      {fav.length > 0 && (
        <div style={{ marginBottom: rec.length ? 16 : 0 }}>
          <h3>
            <Star size={16} />
            Your favourites
          </h3>
          <div className="quickLinks">
            {fav.map(t => (
              <Link key={t.slug} href={`/tools/${t.slug}`}>
                {t.name}
              </Link>
            ))}
          </div>
        </div>
      )}
      {rec.length > 0 && (
        <div>
          <h3>
            <History size={16} />
            Recently used
          </h3>
          <div className="quickLinks">
            {rec.map(t => (
              <Link key={t.slug} href={`/tools/${t.slug}`}>
                {t.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
