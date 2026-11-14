'use client';
/**
 * "Today's picks": one tool and one game chosen by the date (the same for every visitor that day),
 * plus a "Surprise me" button. Picked after the page loads so the server and browser always agree.
 */
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowRight, Shuffle, Sparkles } from 'lucide-react';
import { tools } from '@/data/tools';

const work = tools.filter(t => t.category !== 'Games');
const games = tools.filter(t => t.category === 'Games');

export default function ToolOfDay() {
  const router = useRouter();
  const [day, setDay] = useState<number | null>(null);
  useEffect(() => {
    const now = new Date();
    // eslint-disable-next-line react-hooks/set-state-in-effect -- the date is only known in the browser
    setDay(Math.floor(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()) / 86400000));
  }, []);
  const picks = day === null ? [] : [work[(day * 7) % work.length], games[day % games.length]];
  const surprise = () => router.push(`/tools/${tools[Math.floor(Math.random() * tools.length)].slug}`);
  return (
    <section className="todBox" aria-labelledby="tod-h">
      <div className="todHead">
        <h2 id="tod-h">
          <Sparkles size={20} aria-hidden="true" /> Today’s picks
        </h2>
        <button type="button" className="btn btnGhost todSurprise" onClick={surprise}>
          <Shuffle size={16} aria-hidden="true" /> Surprise me
        </button>
      </div>
      <div className="todGrid">
        {picks.length === 0
          ? [0, 1].map(i => <div key={i} className="todCard todSkeleton" aria-hidden="true" />)
          : picks.map((t, i) => {
              const Icon = t.icon;
              return (
                <Link key={t.slug} href={`/tools/${t.slug}`} className="todCard">
                  <span className="todIcon" aria-hidden="true">
                    <Icon size={26} />
                  </span>
                  <span className="todText">
                    <small>{i === 0 ? 'Tool of the day' : 'Game of the day'}</small>
                    <b>{t.name}</b>
                    <span>{t.description}</span>
                  </span>
                  <ArrowRight size={18} aria-hidden="true" className="todGo" />
                </Link>
              );
            })}
      </div>
    </section>
  );
}
