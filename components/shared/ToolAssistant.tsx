'use client';
/**
 * CraftSprint AI — our own floating tool assistant (bottom-right, above WhatsApp).
 * Opens from this button, from the search bar, from the header, or from the homepage.
 * Answers come from CraftSprint's own data only (lib/siteAssistant.ts); no outside AI service is used.
 * Styles: app/vip.css → "CraftSprint AI chat".
 */
import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  X,
  Send,
  Sparkles,
  Image as ImageIcon,
  FileText,
  Braces,
  Calculator,
  Gamepad2,
  ShieldCheck,
  Hand,
} from 'lucide-react';
import { tools } from '@/data/tools';
import { OPEN_ASSISTANT_EVENT } from '@/lib/utils/assistant';

type Msg = {
  role: 'user' | 'assistant';
  content: string;
  tools?: string[];
  links?: { href: string; label: string }[];
};

const START: Msg = {
  role: 'assistant',
  content: 'Hi! Welcome to CraftSprint. How can I help you today?',
};
const SUGGEST = [
  { text: 'Compress a photo', icon: ImageIcon },
  { text: 'Merge PDF files', icon: FileText },
  { text: 'Format JSON', icon: Braces },
  { text: 'Calculate loan EMI', icon: Calculator },
  { text: 'Play a game', icon: Gamepad2 },
];
const PEEK_KEY = 'cs-ai-peek';

export default function ToolAssistant() {
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>([START]);
  const [text, setText] = useState('');
  const [busy, setBusy] = useState(false);
  const [peek, setPeek] = useState(false);
  const list = useRef<HTMLDivElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const latest = useRef<Msg[]>(msgs);

  useEffect(() => {
    latest.current = msgs;
  }, [msgs]);
  useEffect(() => {
    list.current?.scrollTo({ top: list.current.scrollHeight, behavior: 'smooth' });
  }, [msgs, busy]);
  useEffect(() => {
    if (open) input.current?.focus();
  }, [open]);

  // A small "Need a tool?" bubble, once per visit, a few seconds after the page opens.
  useEffect(() => {
    let seen = false;
    try {
      seen = !!sessionStorage.getItem(PEEK_KEY);
      sessionStorage.setItem(PEEK_KEY, '1');
    } catch {}
    if (seen) return;
    const show = setTimeout(() => setPeek(true), 4500);
    const hide = setTimeout(() => setPeek(false), 12500);
    return () => {
      clearTimeout(show);
      clearTimeout(hide);
    };
  }, []);

  // Escape closes the chat.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  const send = useCallback(async (q: string, history: Msg[]) => {
    const v = q.trim();
    if (!v) return;
    const next = [...history, { role: 'user' as const, content: v }];
    setMsgs(next);
    setText('');
    setBusy(true);
    try {
      const r = await fetch('/api/assistant', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          messages: next.filter(m => m !== START).map(({ role, content }) => ({ role, content })),
        }),
      });
      const d = await r.json();
      setMsgs(m => [
        ...m,
        {
          role: 'assistant',
          content: d.reply || 'Something went wrong. Please try again.',
          tools: d.tools || [],
          links: d.links || [],
        },
      ]);
    } catch {
      setMsgs(m => [
        ...m,
        { role: 'assistant', content: 'I couldn’t connect. Check your internet and try again.' },
      ]);
    } finally {
      setBusy(false);
    }
  }, []);

  // Opened from the search bar, header or homepage: show the window and ask straight away.
  useEffect(() => {
    const onOpen = (e: Event) => {
      const q = (e as CustomEvent<string | undefined>).detail;
      setOpen(true);
      setPeek(false);
      if (q) void send(q, latest.current);
    };
    window.addEventListener(OPEN_ASSISTANT_EVENT, onOpen);
    return () => window.removeEventListener(OPEN_ASSISTANT_EVENT, onOpen);
  }, [send]);

  const ask = (q: string) => {
    if (!busy) void send(q, msgs);
  };
  const toggle = () => {
    setOpen(o => !o);
    setPeek(false);
  };

  return (
    <>
      {peek && !open && (
        <button type="button" className="aiPeek" onClick={toggle}>
          <b>
            <Hand size={15} aria-hidden="true" /> Need a tool?
          </b>{' '}
          Ask CraftSprint AI
        </button>
      )}

      <button
        className={`assistFab ${open ? 'isOpen' : ''}`}
        onClick={toggle}
        aria-expanded={open}
        aria-label={open ? 'Close CraftSprint AI' : 'Open CraftSprint AI'}
      >
        <span className="assistFabLogo">
          {open ? (
            <X size={22} />
          ) : (
            <Image
              src="/images/favicon.png"
              alt="CraftSprint logo"
              aria-hidden="true"
              width={34}
              height={34}
              priority
            />
          )}
        </span>
        {!open && (
          <span className="assistFabBadge" aria-hidden="true">
            <Sparkles size={11} />
          </span>
        )}
        <span className="assistFabText">{open ? 'Close' : 'Ask CraftSprint AI'}</span>
      </button>

      {open && (
        <div className="assistPanel" role="dialog" aria-label="CraftSprint AI">
          <div className="assistHead">
            <span className="assistLogo">
              <Image src="/images/favicon.png" alt="CraftSprint" width={40} height={40} />
            </span>
            <div>
              <b>
                CraftSprint AI{' '}
                <span className="assistBadge">
                  <Sparkles size={11} aria-hidden="true" /> Smart
                </span>
              </b>
              <small>
                <i className="assistOnline" />
                Online · answers only about CraftSprint
              </small>
            </div>
            <button onClick={() => setOpen(false)} aria-label="Close">
              <X size={18} />
            </button>
          </div>

          <div className="assistList" ref={list} aria-live="polite">
            {msgs.length === 1 && (
              <div className="assistWelcome">
                <span className="assistWelcomeLogo">
                  <Image
                    src="/images/favicon.png"
                    alt="CraftSprint logo"
                    aria-hidden="true"
                    width={58}
                    height={58}
                  />
                </span>
                <b>CraftSprint AI</b>
                <small>
                  Ask me to find a tool, how a tool works, or where a page is — like “make my photo under 100
                  KB” or “list PDF tools”.
                </small>
              </div>
            )}
            {msgs.map((m, i) => (
              <div key={i} className={`assistMsg ${m.role}`}>
                {m.role === 'assistant' && (
                  <Image
                    className="assistMini"
                    src="/images/favicon.png"
                    alt="CraftSprint logo"
                    aria-hidden="true"
                    width={26}
                    height={26}
                  />
                )}
                <div>
                  <p>
                    {m.content
                      .replace(/\(?\/tools\/[a-z0-9-]+\)?/g, '')
                      .replace(/\s{2,}/g, ' ')
                      .trim()}
                  </p>
                  {((m.tools && m.tools.length > 0) || (m.links && m.links.length > 0)) && (
                    <div className="assistTools">
                      {(m.links || []).map(l => (
                        <Link key={l.href} href={l.href} onClick={() => setOpen(false)}>
                          {l.label}
                        </Link>
                      ))}
                      {(m.tools || []).map(s => {
                        const t = tools.find(x => x.slug === s);
                        if (!t) return null;
                        const Icon = t.icon;
                        return (
                          <Link key={s} href={`/tools/${s}`} onClick={() => setOpen(false)}>
                            <Icon size={15} />
                            {t.name}
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            ))}
            {busy && (
              <div className="assistMsg assistant">
                <Image
                  className="assistMini"
                  src="/images/favicon.png"
                  alt="CraftSprint logo"
                  aria-hidden="true"
                  width={26}
                  height={26}
                />
                <p className="assistDots">
                  <span />
                  <span />
                  <span />
                </p>
              </div>
            )}
            {msgs.length === 1 && (
              <div className="assistSuggest">
                <small>
                  <Sparkles size={13} /> Try asking
                </small>
                <div className="assistChips">
                  {SUGGEST.map(({ text: s, icon: Icon }) => (
                    <button key={s} onClick={() => ask(s)}>
                      <Icon size={15} />
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <form
            className="assistForm"
            onSubmit={e => {
              e.preventDefault();
              ask(text);
            }}
          >
            <input
              ref={input}
              value={text}
              maxLength={500}
              onChange={e => setText(e.target.value)}
              placeholder="Ask CraftSprint AI…"
              aria-label="Your question"
            />
            <button type="submit" disabled={!text.trim() || busy} aria-label="Send">
              <Send size={17} />
            </button>
          </form>
          <p className="assistFoot">
            <ShieldCheck size={12} /> CraftSprint AI · chats are not saved
          </p>
        </div>
      )}
    </>
  );
}
