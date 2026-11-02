'use client';
import { useState, useRef, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Search, X, Sparkles } from 'lucide-react';
import { tools } from '@/data/tools';
import { openAssistant } from '@/lib/utils/assistant';

export default function SearchBar({ compact = false }: { compact?: boolean }) {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState('');
  const [active, setActive] = useState(0);
  const boxRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const results = useMemo(() => {
    const query = q.trim().toLowerCase();
    if (!query) return [];
    const words = query.split(/\s+/);
    const score = (t: (typeof tools)[number]) => {
      const n = t.name.toLowerCase(),
        hay = `${n} ${t.description.toLowerCase()} ${t.category.toLowerCase()}`;
      if (!words.every(w => hay.includes(w))) return 0;
      return (n.startsWith(query) ? 3 : 0) + (n.includes(query) ? 2 : 0) + 1;
    };
    return tools
      .map(t => ({ t, s: score(t) }))
      .filter(x => x.s > 0)
      .sort((a, b) => b.s - a.s)
      .slice(0, 8)
      .map(x => x.t);
  }, [q]);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  const [prevQ, setPrevQ] = useState(q);
  if (q !== prevQ) {
    setPrevQ(q);
    setActive(0);
  }

  const go = (slug: string) => {
    router.push(`/tools/${slug}`);
    setOpen(false);
    setQ('');
  };
  const askAssistant = () => {
    openAssistant(q.trim());
    setOpen(false);
    setQ('');
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActive(a => Math.min(a + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActive(a => Math.max(a - 1, 0));
    } else if (e.key === 'Enter') {
      if (results[active]) go(results[active].slug);
      else if (q.trim()) askAssistant();
    } else if (e.key === 'Escape') {
      setOpen(false);
      inputRef.current?.blur();
    }
  };

  return (
    <div className={`searchBox ${compact ? 'compact' : ''}`} ref={boxRef}>
      <Search size={16} />
      <input
        ref={inputRef}
        type="text"
        placeholder={
          compact
            ? `Search ${tools.length} tools…`
            : `Search ${tools.length} free tools — try "compress", "pdf" or "json"`
        }
        aria-label="Search tools"
        value={q}
        onFocus={() => setOpen(true)}
        onChange={e => {
          setQ(e.target.value);
          setOpen(true);
        }}
        onKeyDown={onKeyDown}
      />
      {q && (
        <button
          className="searchClear"
          aria-label="Clear search"
          onClick={() => {
            setQ('');
            inputRef.current?.focus();
          }}
        >
          <X size={14} />
        </button>
      )}
      {!compact && (
        <button
          className="searchAiBtn"
          type="button"
          onClick={() => {
            if (q.trim()) askAssistant();
            else {
              openAssistant();
              setOpen(false);
            }
          }}
          aria-label="Ask CraftSprint Assistant"
        >
          <Sparkles size={15} />
          <span>Ask</span>
        </button>
      )}
      {open && q && (
        <div className="searchResults">
          {results.length === 0 && (
            <div className="searchEmpty">
              No tool name matches &ldquo;{q}&rdquo; — ask the assistant instead.
            </div>
          )}
          {results.map((t, i) => {
            const Icon = t.icon;
            return (
              <button
                key={t.slug}
                className={`searchResult ${i === active ? 'active' : ''}`}
                onMouseEnter={() => setActive(i)}
                onClick={() => go(t.slug)}
              >
                <span className="searchResultIcon">
                  <Icon size={16} />
                </span>
                <span>
                  <b>{t.name}</b>
                  <span className="searchResultCat">{t.category}</span>
                </span>
              </button>
            );
          })}
          <button className="searchAsk" onClick={askAssistant}>
            <span className="searchAskIcon">
              <Sparkles size={15} />
            </span>
            <span>
              Ask CraftSprint Assistant: <b>&ldquo;{q.trim()}&rdquo;</b>
            </span>
          </button>
        </div>
      )}
    </div>
  );
}
