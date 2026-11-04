'use client';
/** Games hub: search + genre filter over the real games list. */
import { useMemo, useState } from 'react';
import { Search, SearchX } from 'lucide-react';
import { tools } from '@/data/tools';
import GamePoster, { GAME_TYPES } from '@/components/shared/GamePoster';

const GENRES: Record<string, string[]> = {
  Arcade: ['Arcade game', 'Shooter game'],
  Puzzle: ['Puzzle game', 'Logic game', 'Logic puzzle'],
  Strategy: ['Strategy game', 'Classic game'],
  Memory: ['Memory game'],
  Skill: ['Skill test', 'Reflex test', 'Reflex game', 'Word game'],
};

export default function GamesBrowser() {
  const games = tools.filter(t => t.category === 'Games');
  const [g, setG] = useState('All');
  const [q, setQ] = useState('');
  const list = useMemo(
    () =>
      games.filter(
        t =>
          (g === 'All' || GENRES[g].includes(GAME_TYPES[t.slug] || '')) &&
          `${t.name} ${t.description}`.toLowerCase().includes(q.toLowerCase().trim()),
      ),
    [g, q, games],
  );
  return (
    <div className="toolsBrowser" id="games-grid">
      <div className="tbBar" style={{ marginTop: 0 }}>
        <div className="tbChips" role="group" aria-label="Filter games">
          {['All', ...Object.keys(GENRES)].map(x => (
            <button
              key={x}
              type="button"
              className={g === x ? 'on' : ''}
              aria-pressed={g === x}
              onClick={() => setG(x)}
            >
              {x === 'All' ? 'All games' : x}
            </button>
          ))}
        </div>
      </div>
      <div className="tbSearch" style={{ marginTop: 12 }}>
        <Search size={18} aria-hidden="true" />
        <input
          value={q}
          onChange={e => setQ(e.target.value)}
          placeholder={`Search ${games.length} games…`}
          aria-label="Search games"
          inputMode="search"
        />
      </div>
      {list.length ? (
        <div className="posterGrid" style={{ marginTop: 18 }}>
          {list.map((t, i) => (
            <GamePoster key={t.slug} tool={t} index={i} />
          ))}
        </div>
      ) : (
        <div className="emptyState big">
          <SearchX size={36} aria-hidden="true" />
          <p>No game matches that search.</p>
        </div>
      )}
    </div>
  );
}
