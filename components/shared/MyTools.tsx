'use client';
import Link from 'next/link';
import { Heart, History } from 'lucide-react';
import ToolCard from '@/components/shared/ToolCard';
import { tools } from '@/data/tools';
import { usePrefs } from '@/lib/userPrefs';

export default function MyTools() {
  const { favorites, recent } = usePrefs();
  const fav = favorites.map(s => tools.find(t => t.slug === s)).filter(Boolean) as typeof tools;
  const rec = recent.map(s => tools.find(t => t.slug === s)).filter(Boolean) as typeof tools;
  return (
    <>
      <section className="catBlock" aria-labelledby="fav-h">
        <h2 id="fav-h" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Heart size={22} /> Favourites
        </h2>
        {fav.length ? (
          <div className="toolGrid">
            {fav.map(t => (
              <ToolCard key={t.slug} tool={t} />
            ))}
          </div>
        ) : (
          <p className="emptyState">
            No favourites yet. Open any tool and tap <b>Add to favourites</b>.{' '}
            <Link href="/tools">Browse all tools</Link>
          </p>
        )}
      </section>
      <section className="catBlock" aria-labelledby="rec-h">
        <h2 id="rec-h" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <History size={22} /> Recently used
        </h2>
        {rec.length ? (
          <div className="toolGrid">
            {rec.map(t => (
              <ToolCard key={t.slug} tool={t} />
            ))}
          </div>
        ) : (
          <p className="emptyState">Tools you open will appear here.</p>
        )}
      </section>
    </>
  );
}
