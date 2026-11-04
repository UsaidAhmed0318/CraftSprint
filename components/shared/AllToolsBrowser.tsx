'use client';
/** Search + category filter for the All tools page. Every tool is in the HTML for Google; filtering happens in the browser. */
import { useMemo, useState } from 'react';
import Link from 'next/link';
import { Search, X, ArrowRight, SearchX } from 'lucide-react';
import { tools, categories } from '@/data/tools';
import { categoryInfo } from '@/lib/categories';

type Sort = 'popular' | 'az';

export default function AllToolsBrowser() {
  const [q, setQ] = useState('');
  const [cat, setCat] = useState<string>('All');
  const [sort, setSort] = useState<Sort>('popular');

  const list = useMemo(() => {
    const words = q.toLowerCase().split(/\s+/).filter(Boolean);
    const out = tools.filter(
      t =>
        (cat === 'All' || t.category === cat) &&
        words.every(w => `${t.name} ${t.description} ${t.category}`.toLowerCase().includes(w)),
    );
    return sort === 'az' ? [...out].sort((a, b) => a.name.localeCompare(b.name)) : out;
  }, [q, cat, sort]);

  return (
    <div className="toolsBrowser">
      <div className="tbSearch">
        <Search size={18} aria-hidden="true" />
        <input
          value={q}
          onChange={e => setQ(e.target.value)}
          placeholder={`Search ${tools.length} tools…`}
          aria-label="Search tools"
          type="text"
          inputMode="search"
          enterKeyHint="search"
        />
        {q && (
          <button type="button" onClick={() => setQ('')} aria-label="Clear search">
            <X size={16} />
          </button>
        )}
      </div>
      <div className="tbBar">
        <div className="tbChips" role="group" aria-label="Filter by category">
          {['All', ...categories].map(c => (
            <button
              key={c}
              type="button"
              className={cat === c ? 'on' : ''}
              aria-pressed={cat === c}
              onClick={() => setCat(c)}
            >
              {c === 'All' ? 'All' : categoryInfo[c as (typeof categories)[number]].short}
            </button>
          ))}
        </div>
        <label className="tbSort">
          <span>Sort</span>
          <select value={sort} onChange={e => setSort(e.target.value as Sort)} aria-label="Sort tools">
            <option value="popular">Popular</option>
            <option value="az">A–Z</option>
          </select>
        </label>
      </div>
      <p className="tbCount" aria-live="polite">
        {list.length} {list.length === 1 ? 'tool' : 'tools'}
        {cat !== 'All' || q ? (
          <button
            type="button"
            onClick={() => {
              setQ('');
              setCat('All');
            }}
          >
            Clear filters
          </button>
        ) : null}
      </p>
      {list.length ? (
        <div className="tbGrid">
          {list.map(t => {
            const Icon = t.icon;
            const i = categories.indexOf(t.category);
            return (
              <Link key={t.slug} href={`/tools/${t.slug}`} className="tbCard">
                <span className={`tbIcon g${(i % 9) + 1}`} aria-hidden="true">
                  <Icon size={26} strokeWidth={1.8} />
                </span>
                <b>{t.name}</b>
                <small>{t.description}</small>
                <span className="tbOpen">
                  {t.category === 'Games' ? 'Play' : 'Open tool'} <ArrowRight size={14} />
                </span>
              </Link>
            );
          })}
        </div>
      ) : (
        <div className="emptyState big">
          <SearchX size={36} aria-hidden="true" />
          <p>
            No tool matches “{q}”. Try a shorter word, or <Link href="/ai">ask CraftSprint AI</Link>.
          </p>
        </div>
      )}
    </div>
  );
}
