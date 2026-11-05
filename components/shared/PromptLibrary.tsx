'use client';
import { useMemo, useState } from 'react';
import Link from 'next/link';
import { Search, Copy, Check, Sparkles } from 'lucide-react';
import { promptGroups } from '@/data/prompts';

export default function PromptLibrary() {
  const [q, setQ] = useState('');
  const [group, setGroup] = useState('all');
  const [copied, setCopied] = useState('');
  const groups = useMemo(
    () =>
      promptGroups
        .filter(g => group === 'all' || g.slug === group)
        .map(g => ({
          ...g,
          prompts: g.prompts.filter(p =>
            `${p.title} ${p.text}`.toLowerCase().includes(q.toLowerCase().trim()),
          ),
        }))
        .filter(g => g.prompts.length),
    [q, group],
  );
  const copy = (key: string, text: string) =>
    navigator.clipboard
      ?.writeText(text)
      .then(() => {
        setCopied(key);
        setTimeout(() => setCopied(''), 1400);
      })
      .catch(() => {});
  return (
    <div className="toolsBrowser">
      <div className="tbSearch">
        <Search size={18} aria-hidden="true" />
        <input
          value={q}
          onChange={e => setQ(e.target.value)}
          placeholder="Search prompts…"
          aria-label="Search prompts"
          inputMode="search"
        />
      </div>
      <div className="tbBar">
        <div className="tbChips" role="group" aria-label="Prompt categories">
          {[{ slug: 'all', name: 'All' }, ...promptGroups].map(g => (
            <button
              key={g.slug}
              type="button"
              className={group === g.slug ? 'on' : ''}
              aria-pressed={group === g.slug}
              onClick={() => setGroup(g.slug)}
            >
              {g.name}
            </button>
          ))}
        </div>
      </div>
      {groups.map(g => (
        <section key={g.slug} className="catBlock" aria-labelledby={`pg-${g.slug}`}>
          <div className="catBlockHead">
            <div>
              <h2 id={`pg-${g.slug}`}>{g.name}</h2>
              <p>{g.description}</p>
            </div>
          </div>
          <div className="promptGrid">
            {g.prompts.map(p => {
              const key = `${g.slug}-${p.title}`;
              return (
                <article key={key} className="promptCard">
                  <h3>{p.title}</h3>
                  <p>{p.text}</p>
                  <div className="promptActions">
                    <button type="button" className="btn btnGhost" onClick={() => copy(key, p.text)}>
                      {copied === key ? <Check size={15} /> : <Copy size={15} />}{' '}
                      {copied === key ? 'Copied' : 'Copy'}
                    </button>
                    <Link className="btn btnPrimary" href={`/ai?prompt=${encodeURIComponent(p.text)}`}>
                      <Sparkles size={15} /> Use in CraftSprint AI
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      ))}
      {!groups.length && <p className="emptyState">No prompt matches that search.</p>}
    </div>
  );
}
