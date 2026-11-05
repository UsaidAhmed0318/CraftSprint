'use client';
/**
 * Full-page CraftSprint AI chat (/ai). Same server API as the floating assistant.
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

type Msg = { role: 'user' | 'assistant'; content: string; tools?: string[]; detail?: string };

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
  const [aiOn, setAiOn] = useState<boolean | null>(null);
  const [mode, setMode] = useState<'tools' | 'chat'>('tools');
  const end = useRef<HTMLDivElement>(null);

  // Opened from the prompt library (/ai?prompt=...): switch to chat and pre-fill the message.
  useEffect(() => {
    const p = new URLSearchParams(window.location.search).get('prompt');
    if (p) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- read the URL once in the browser
      setMode('chat');
      setText(p.slice(0, 4000));
    }
  }, []);
  useEffect(() => {
    fetch('/api/assistant')
      .then(r => r.json())
      .then(d => setAiOn(!!d.ai))
      .catch(() => setAiOn(false));
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
    try {
      const r = await fetch(mode === 'chat' ? '/api/chat' : '/api/assistant', {
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
              <Image src="/icons/icon-192.png" alt="" width={64} height={64} priority />
            </span>
            <h1>
              Hi! Welcome to CraftSprint.
              <br />
              <span>What can I help you with?</span>
            </h1>
            <p>
              Describe what you want to do and CraftSprint AI will point you to the right tool.{' '}
              <span className="aiMode">
                {aiOn === null ? '' : aiOn ? 'AI answers on' : 'Smart search mode'}
              </span>
            </p>
          </div>
        ) : (
          <div className="aiThread" aria-live="polite">
            {msgs.map((m, i) => (
              <div key={i} className={`aiMsg ${m.role}`}>
                {m.role === 'assistant' && <Image src="/images/favicon.png" alt="" width={30} height={30} />}
                <div>
                  {m.role === 'assistant' && mode === 'chat' ? (
                    <div className="aiMd">
                      <Markdown text={m.content} />
                    </div>
                  ) : (
                    <p>
                      {m.content
                        .replace(/\(?\/tools\/[a-z0-9-]+\)?/g, '')
                        .replace(/\s{2,}/g, ' ')
                        .trim()}
                    </p>
                  )}
                  {m.detail && <small className="aiDetail">Details for the site owner: {m.detail}</small>}
                  {!!m.tools?.length && (
                    <div className="assistTools">
                      {m.tools.map(s => {
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
                <Image src="/images/favicon.png" alt="" width={30} height={30} />
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

        <div className="aiModes" role="group" aria-label="Chat mode">
          <button
            type="button"
            className={mode === 'tools' ? 'on' : ''}
            aria-pressed={mode === 'tools'}
            onClick={() => {
              setMode('tools');
              setMsgs([]);
            }}
          >
            Find a tool
          </button>
          <button
            type="button"
            className={mode === 'chat' ? 'on' : ''}
            aria-pressed={mode === 'chat'}
            onClick={() => {
              setMode('chat');
              setMsgs([]);
            }}
          >
            Chat with AI
          </button>
        </div>
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
            placeholder="Ask a question or describe what you need…"
            aria-label="Your question"
          />
          <div className="aiComposerBar">
            {msgs.length > 0 ? (
              <button type="button" className="aiNew" onClick={() => setMsgs([])}>
                <RotateCcw size={14} /> New chat
              </button>
            ) : (
              <span className="aiNote">
                {mode === 'chat'
                  ? 'Messages are sent to an AI service to answer — please don’t share private details'
                  : 'Chats are not saved'}
              </span>
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

/** Small, safe Markdown renderer (no HTML injection): code blocks, lists, headings, bold, inline code, tool links. */
function Inline({ text }: { text: string }) {
  const parts = text.split(/(`[^`]+`|\*\*[^*]+\*\*|\/tools\/[a-z0-9-]+)/g);
  return (
    <>
      {parts.map((p, i) => {
        if (p.startsWith('`') && p.endsWith('`') && p.length > 1)
          return <code key={i}>{p.slice(1, -1)}</code>;
        if (p.startsWith('**') && p.endsWith('**') && p.length > 3) return <b key={i}>{p.slice(2, -2)}</b>;
        const tool = /^\/tools\/[a-z0-9-]+$/.test(p) ? tools.find(t => `/tools/${t.slug}` === p) : undefined;
        if (tool)
          return (
            <Link key={i} href={p}>
              {tool.name}
            </Link>
          );
        return <span key={i}>{p}</span>;
      })}
    </>
  );
}
function Markdown({ text }: { text: string }) {
  const blocks = text.split('```');
  return (
    <>
      {blocks.map((b, i) => {
        if (i % 2 === 1) {
          const nl = b.indexOf('\n');
          const lang = (nl >= 0 ? b.slice(0, nl) : '').trim().toLowerCase();
          const code = (nl >= 0 ? b.slice(nl + 1) : b).replace(/\n$/, '');
          return <CodeBlock key={i} lang={lang} code={code} />;
        }
        return b
          .split(/\n{2,}/)
          .filter(x => x.trim())
          .map((para, j) => {
            const lines = para.split('\n').filter(l => l.trim());
            if (lines.length && lines.every(l => /^\s*([-*]|\d+\.)\s+/.test(l)))
              return (
                <ul key={`${i}-${j}`}>
                  {lines.map((l, k) => (
                    <li key={k}>
                      <Inline text={l.replace(/^\s*([-*]|\d+\.)\s+/, '')} />
                    </li>
                  ))}
                </ul>
              );
            if (/^#{1,4}\s/.test(para))
              return (
                <h3 key={`${i}-${j}`}>
                  <Inline text={para.replace(/^#{1,4}\s/, '')} />
                </h3>
              );
            return (
              <p key={`${i}-${j}`}>
                {lines.map((l, k) => (
                  <span key={k}>
                    <Inline text={l} />
                    {k < lines.length - 1 && <br />}
                  </span>
                ))}
              </p>
            );
          });
      })}
    </>
  );
}

const EXT: Record<string, string> = {
  html: 'html',
  css: 'css',
  javascript: 'js',
  js: 'js',
  typescript: 'ts',
  ts: 'ts',
  tsx: 'tsx',
  jsx: 'jsx',
  python: 'py',
  py: 'py',
  json: 'json',
  sql: 'sql',
  java: 'java',
  php: 'php',
  c: 'c',
  cpp: 'cpp',
  csharp: 'cs',
  go: 'go',
  bash: 'sh',
  sh: 'sh',
};

/** Code from CraftSprint AI: copy, download as a file, and — for HTML — a live, sandboxed preview. */
function CodeBlock({ lang, code }: { lang: string; code: string }) {
  const [preview, setPreview] = useState(false);
  const [copied, setCopied] = useState(false);
  const isHtml = lang === 'html' || /^\s*<!doctype html|^\s*<html/i.test(code);
  const ext = EXT[lang] || (isHtml ? 'html' : 'txt');
  const download = () => {
    const url = URL.createObjectURL(new Blob([code], { type: 'text/plain;charset=utf-8' }));
    const a = document.createElement('a');
    a.href = url;
    a.download = `craftsprint-ai.${ext}`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1500);
  };
  return (
    <div className="aiCode">
      <div className="aiCodeBar">
        <span>{lang || 'code'}</span>
        <div>
          {isHtml && (
            <button type="button" onClick={() => setPreview(p => !p)} aria-pressed={preview}>
              {preview ? 'Code' : 'Preview'}
            </button>
          )}
          <button type="button" onClick={download}>
            Download
          </button>
          <button
            type="button"
            onClick={() =>
              navigator.clipboard
                ?.writeText(code)
                .then(() => {
                  setCopied(true);
                  setTimeout(() => setCopied(false), 1200);
                })
                .catch(() => {})
            }
          >
            {copied ? 'Copied' : 'Copy'}
          </button>
        </div>
      </div>
      {preview && isHtml ? (
        // Sandboxed: scripts may run, but the page cannot touch CraftSprint, cookies or storage.
        <iframe
          className="aiPreview"
          title="Preview of the generated page"
          sandbox="allow-scripts"
          srcDoc={code}
        />
      ) : (
        <pre>
          <code>{code}</code>
        </pre>
      )}
    </div>
  );
}
