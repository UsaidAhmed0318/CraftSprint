'use client';
/**
 * CraftSprint Assistant — floating chat (bottom-right, above WhatsApp).
 * It can also be opened from the search bar with a ready question.
 */
import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { X, Send, Sparkles } from 'lucide-react';
import { tools } from '@/data/tools';
import { OPEN_ASSISTANT_EVENT } from '@/lib/utils/assistant';

type Msg = { role: 'user' | 'assistant'; content: string; tools?: string[] };

const START: Msg = {
  role: 'assistant',
  content:
    'Assalam-o-Alaikum! I’m the CraftSprint Assistant. Tell me what you want to do — like “make my photo under 100 KB” or “combine two PDFs” — and I’ll take you to the right tool.',
};
const SUGGEST = ['Compress a photo', 'Merge PDF files', 'Format JSON', 'Calculate loan EMI', 'Play a game'];

export default function ToolAssistant() {
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>([START]);
  const [text, setText] = useState('');
  const [busy, setBusy] = useState(false);
  const [aiOn, setAiOn] = useState(false);
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

  // Ask the server once whether real AI is switched on, so the badge is always honest.
  useEffect(() => {
    if (!open) return;
    fetch('/api/assistant')
      .then(r => r.json())
      .then(d => setAiOn(!!d.ai))
      .catch(() => {});
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

  // Opened from the search bar: show the window and ask the question straight away.
  useEffect(() => {
    const onOpen = (e: Event) => {
      const q = (e as CustomEvent<string | undefined>).detail;
      setOpen(true);
      if (q) void send(q, latest.current);
    };
    window.addEventListener(OPEN_ASSISTANT_EVENT, onOpen);
    return () => window.removeEventListener(OPEN_ASSISTANT_EVENT, onOpen);
  }, [send]);

  const ask = (q: string) => {
    if (!busy) void send(q, msgs);
  };

  return (
    <>
      <button
        className={`assistFab ${open ? 'isOpen' : ''}`}
        onClick={() => setOpen(o => !o)}
        aria-expanded={open}
        aria-label={open ? 'Close CraftSprint Assistant' : 'Open CraftSprint Assistant'}
      >
        <span className="assistFabLogo">
          {open ? <X size={20} /> : <Image src="/images/favicon.png" alt="" width={30} height={30} />}
        </span>
        <span className="assistFabText">{open ? 'Close' : 'Ask CraftSprint'}</span>
      </button>

      {open && (
        <div className="assistPanel" role="dialog" aria-label="CraftSprint Assistant">
          <div className="assistHead">
            <span className="assistLogo">
              <Image src="/images/favicon.png" alt="CraftSprint" width={40} height={40} />
            </span>
            <div>
              <b>
                CraftSprint Assistant <span className="assistBadge">{aiOn ? 'AI' : 'Smart'}</span>
              </b>
              <small>
                <i className="assistOnline" />
                Online · finds the right tool in seconds
              </small>
            </div>
            <button onClick={() => setOpen(false)} aria-label="Close">
              <X size={18} />
            </button>
          </div>

          <div className="assistList" ref={list} aria-live="polite">
            {msgs.map((m, i) => (
              <div key={i} className={`assistMsg ${m.role}`}>
                {m.role === 'assistant' && (
                  <Image className="assistMini" src="/images/favicon.png" alt="" width={26} height={26} />
                )}
                <div>
                  <p>
                    {m.content
                      .replace(/\(?\/tools\/[a-z0-9-]+\)?/g, '')
                      .replace(/\s{2,}/g, ' ')
                      .trim()}
                  </p>
                  {m.tools && m.tools.length > 0 && (
                    <div className="assistTools">
                      {m.tools.map(s => {
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
                <Image className="assistMini" src="/images/favicon.png" alt="" width={26} height={26} />
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
                {SUGGEST.map(s => (
                  <button key={s} onClick={() => ask(s)}>
                    {s}
                  </button>
                ))}
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
              placeholder="Ask CraftSprint anything about tools…"
              aria-label="Your question"
            />
            <button type="submit" disabled={!text.trim() || busy} aria-label="Send">
              <Send size={17} />
            </button>
          </form>
          <p className="assistFoot">CraftSprint Assistant · only helps with CraftSprint tools</p>
        </div>
      )}
    </>
  );
}
