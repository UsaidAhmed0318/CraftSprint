'use client';
/**
 * Full-page CraftSprint AI (/ai). Same server API as the floating assistant (/api/assistant).
 * It helps visitors with everything on CraftSprint: finding the right tool, how to use it, games, contact.
 * Shows "AI" only when the server reports a real API key; otherwise it is smart search.
 */
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowUp,
  Image as ImageIcon,
  FileText,
  Braces,
  Calculator,
  QrCode,
  Gamepad2,
  Scissors,
  Type,
  RotateCcw,
} from 'lucide-react';
import { tools } from '@/data/tools';
import { track } from '@/lib/analytics';

type Msg = {
  role: 'user' | 'assistant';
  content: string;
  tools?: string[];
  links?: { href: string; label: string }[];
};

const SUGGEST = [
  { t: 'Make my photo under 100 KB', i: ImageIcon },
  { t: 'Combine two PDF files into one', i: FileText },
  { t: 'Format and check my JSON', i: Braces },
  { t: 'Calculate my monthly loan payment', i: Calculator },
  { t: 'Create a QR code for my website', i: QrCode },
  { t: 'Remove line breaks from copied text', i: Type },
  { t: 'Cut a part of an audio file', i: Scissors },
  { t: 'I want to play a quick game', i: Gamepad2 },
];

export default function AiChat() {
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [text, setText] = useState('');
  const [busy, setBusy] = useState(false);
  const end = useRef<HTMLDivElement>(null);

  // Opened from a link with ?prompt=...: pre-fill the message (trimmed to the input limit).
  useEffect(() => {
    const p = new URLSearchParams(window.location.search).get('prompt');
    // eslint-disable-next-line react-hooks/set-state-in-effect -- read the URL once in the browser
    if (p) setText(p.slice(0, 500));
  }, []);
  useEffect(() => {
    end.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [msgs, busy]);

  const send = async (q: string) => {
    const v = q.trim();
    if (!v || busy) return;
    const next = [...msgs, { role: 'user' as const, content: v }];
    setMsgs(next);
    setText('');
    setBusy(true);
    track('ai_message', { ai_mode: 'tools' });
    try {
      const r = await fetch('/api/assistant', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ messages: next.map(({ role, content }) => ({ role, content })) }),
      });
      const d = await r.json();
      setMsgs(m => [
        ...m,
        {
          role: 'assistant',
          content: d.reply || d.error || 'Something went wrong. Please try again.',
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
  };

  return (
    <div className="aiPage">
      <div className="aiPageInner">
        {msgs.length === 0 ? (
          <div className="aiHello">
            <span className="aiHelloLogo">
              <Image
                src="/icons/icon-192.png"
                alt="CraftSprint logo"
                aria-hidden="true"
                width={64}
                height={64}
                priority
              />
            </span>
            <h1>
              Hi! Welcome to CraftSprint.
              <br />
              <span>What can I help you with?</span>
            </h1>
            <p>
              Describe what you want to do and CraftSprint AI will point you to the right tool, explain how it
              works, or list tools and pages. <span className="aiMode">Answers only about CraftSprint</span>
            </p>
          </div>
        ) : (
          <div className="aiThread" aria-live="polite">
            {msgs.map((m, i) => (
              <div key={i} className={`aiMsg ${m.role}`}>
                {m.role === 'assistant' && (
                  <Image
                    src="/images/favicon.png"
                    alt="CraftSprint logo"
                    aria-hidden="true"
                    width={30}
                    height={30}
                  />
                )}
                <div>
                  <p>
                    {m.content
                      .replace(/\(?\/tools\/[a-z0-9-]+\)?/g, '')
                      .replace(/\s{2,}/g, ' ')
                      .trim()}
                  </p>
                  {(!!m.tools?.length || !!m.links?.length) && (
                    <div className="assistTools">
                      {(m.links || []).map(l => (
                        <Link key={l.href} href={l.href}>
                          {l.label}
                        </Link>
                      ))}
                      {(m.tools || []).map(s => {
                        const t = tools.find(x => x.slug === s);
                        if (!t) return null;
                        const Icon = t.icon;
                        return (
                          <Link key={s} href={`/tools/${s}`}>
                            <Icon size={15} /> {t.name}
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            ))}
            {busy && (
              <div className="aiMsg assistant">
                <Image
                  src="/images/favicon.png"
                  alt="CraftSprint logo"
                  aria-hidden="true"
                  width={30}
                  height={30}
                />
                <p className="assistDots">
                  <span />
                  <span />
                  <span />
                </p>
              </div>
            )}
            <div ref={end} />
          </div>
        )}

        <form
          className="aiComposer"
          onSubmit={e => {
            e.preventDefault();
            void send(text);
          }}
        >
          <textarea
            value={text}
            maxLength={500}
            rows={2}
            onChange={e => setText(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                void send(text);
              }
            }}
            placeholder="Ask which tool you need, or how to use one…"
            aria-label="Your question"
          />
          <div className="aiComposerBar">
            {msgs.length > 0 ? (
              <button type="button" className="aiNew" onClick={() => setMsgs([])}>
                <RotateCcw size={14} /> New chat
              </button>
            ) : (
              <span className="aiNote">Chats are not saved</span>
            )}
            <button type="submit" className="aiSend" disabled={!text.trim() || busy} aria-label="Send">
              <ArrowUp size={18} />
            </button>
          </div>
        </form>

        {msgs.length === 0 && (
          <div className="aiCards">
            {SUGGEST.map(({ t, i: Icon }) => (
              <button key={t} type="button" onClick={() => void send(t)}>
                <span>
                  <Icon size={16} />
                </span>
                {t}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
