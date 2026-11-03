'use client';
import { useState, useMemo, useEffect } from 'react';
import { marked } from 'marked';
import DOMPurify from 'dompurify';
import ToolShell from '@/components/shared/ToolShell';

export function MarkdownPreviewer() {
  const [md, setMd] = useState('# Hello\n\nWrite **Markdown** on the left and see the preview on the right.');
  const [ready, setReady] = useState(false);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- runs once after mount (browser-only values)
    setReady(true);
  }, []);
  const html = useMemo(() => {
    if (!ready) return '';
    const raw = marked.parse(md, { async: false }) as string;
    return DOMPurify.sanitize(raw);
  }, [md, ready]);
  return (
    <ToolShell
      title="Markdown previewer online"
      description="Write Markdown and see a live, rendered preview side by side, useful for READMEs, docs and blog posts."
      faq={[
        { q: 'Is my Markdown uploaded?', a: 'No. Parsing and rendering happen locally in your browser.' },
        {
          q: 'Does it support tables and code blocks?',
          a: 'Yes, standard Markdown syntax including headings, lists, links, code blocks and tables is supported.',
        },
      ]}
    >
      <div className="splitPanes">
        <div className="field">
          <label>Markdown</label>
          <textarea
            aria-label="Markdown"
            className="textArea"
            style={{ minHeight: 360 }}
            value={md}
            onChange={e => setMd(e.target.value)}
          />
        </div>
        <div className="field">
          <label>Preview</label>
          <div
            className="article lightPaper"
            style={{
              minHeight: 360,
              background: '#f7f8fb',
              color: '#10131a',
              borderRadius: 11,
              padding: 16,
              maxWidth: 'none',
            }}
            dangerouslySetInnerHTML={{ __html: html }}
          />
        </div>
      </div>
    </ToolShell>
  );
}

function countSyllables(word: string) {
  word = word.toLowerCase().replace(/[^a-z]/g, '');
  if (!word) return 0;
  const matches = word.match(/[aeiouy]+/g);
  let count = matches ? matches.length : 1;
  if (word.endsWith('e') && count > 1) count--;
  return Math.max(1, count);
}

export function ReadabilityChecker() {
  const [text, setText] = useState('');
  const stats = useMemo(() => {
    const trimmed = text.trim();
    const words = trimmed ? trimmed.split(/\s+/) : [];
    const sentences = trimmed ? (trimmed.match(/[.!?]+(\s|$)/g) || []).length || 1 : 0;
    const syllables = words.reduce((s, w) => s + countSyllables(w), 0);
    const wc = words.length || 1,
      sc = sentences || 1;
    const score = trimmed ? 206.835 - 1.015 * (wc / sc) - 84.6 * (syllables / wc) : 0;
    const grade = trimmed ? 0.39 * (wc / sc) + 11.8 * (syllables / wc) - 15.59 : 0;
    const label =
      score >= 90
        ? 'Very easy'
        : score >= 70
          ? 'Easy'
          : score >= 60
            ? 'Standard'
            : score >= 50
              ? 'Fairly difficult'
              : score >= 30
                ? 'Difficult'
                : 'Very difficult';
    return {
      words: words.length,
      sentences,
      score: Math.round(score),
      grade: Math.max(0, Math.round(grade * 10) / 10),
      label,
    };
  }, [text]);
  return (
    <ToolShell
      title="Readability checker online"
      description="Paste an article or paragraph to see its Flesch reading-ease score and approximate US grade level, helpful for content writers, copywriters and SEO."
      faq={[
        {
          q: 'What is a good reading-ease score?',
          a: 'Scores of 60-70 are considered easily understood by most readers; higher scores mean simpler text.',
        },
        { q: 'Is my text stored anywhere?', a: 'No, this runs entirely in your browser.' },
      ]}
    >
      <textarea
        aria-label="Text input"
        className="textArea"
        value={text}
        onChange={e => setText(e.target.value)}
        placeholder="Paste your article or paragraph here…"
      />
      <div className="colorGrid">
        <div className="colorField">
          <label>Reading ease score</label>
          <b>{stats.score}</b>
        </div>
        <div className="colorField">
          <label>Difficulty</label>
          <b>{stats.label}</b>
        </div>
        <div className="colorField">
          <label>Approx. grade level</label>
          <b>{stats.grade}</b>
        </div>
        <div className="colorField">
          <label>Words</label>
          <b>{stats.words}</b>
        </div>
        <div className="colorField">
          <label>Sentences</label>
          <b>{stats.sentences}</b>
        </div>
      </div>
    </ToolShell>
  );
}

export function SeoMetaPreview() {
  const [title, setTitle] = useState('Your page title goes here');
  const [desc, setDesc] = useState(
    'A short, compelling description that makes people want to click through from Google search results.',
  );
  const [url, setUrl] = useState('https://example.com/page');
  const titleTooLong = title.length > 60;
  const descTooLong = desc.length > 160;
  return (
    <ToolShell
      title="SEO meta tag & Google preview generator"
      description="Preview how your title and meta description will look in Google search results, with character count warnings before you publish."
      faq={[
        {
          q: 'What is the ideal title length?',
          a: 'Keep titles under about 60 characters so they do not get cut off in search results.',
        },
        {
          q: 'What is the ideal description length?',
          a: 'Aim for under about 160 characters so the full description shows in most searches.',
        },
      ]}
    >
      <div className="field">
        <label>
          Page title{' '}
          {titleTooLong && <span style={{ color: 'var(--danger)' }}> — {title.length}/60, too long</span>}
          {!titleTooLong && <span style={{ color: 'var(--muted)' }}> — {title.length}/60</span>}
        </label>
        <input aria-label="Page title" value={title} onChange={e => setTitle(e.target.value)} />
      </div>
      <div className="field" style={{ marginTop: 14 }}>
        <label>
          Meta description{' '}
          {descTooLong && <span style={{ color: 'var(--danger)' }}> — {desc.length}/160, too long</span>}
          {!descTooLong && <span style={{ color: 'var(--muted)' }}> — {desc.length}/160</span>}
        </label>
        <textarea
          aria-label="Text input"
          className="textArea"
          style={{ minHeight: 90 }}
          value={desc}
          onChange={e => setDesc(e.target.value)}
        />
      </div>
      <div className="field" style={{ marginTop: 14 }}>
        <label>URL</label>
        <input aria-label="URL" value={url} onChange={e => setUrl(e.target.value)} />
      </div>
      <div className="result" style={{ display: 'block', marginTop: 22, background: '#fff' }}>
        <div style={{ color: '#1a0dab', fontSize: 20, lineHeight: 1.3, fontFamily: 'arial,sans-serif' }}>
          {title.slice(0, 70) || 'Page title'}
        </div>
        <div style={{ color: '#006621', fontSize: 14, margin: '3px 0' }}>{url}</div>
        <div style={{ color: '#545454', fontSize: 14, lineHeight: 1.5 }}>
          {desc.slice(0, 170) || 'Meta description preview.'}
        </div>
      </div>
    </ToolShell>
  );
}

const DIACRITICS = /[̀-ͯ]/g;
export function SlugGenerator() {
  const [text, setText] = useState('');
  const slug = text
    .toLowerCase()
    .trim()
    .normalize('NFKD')
    .replace(DIACRITICS, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
  const copy = () => navigator.clipboard?.writeText(slug);
  return (
    <ToolShell
      title="URL slug generator"
      description="Turn a title or sentence into a clean, SEO-friendly URL slug, ready to paste into your CMS or blog."
      faq={[
        {
          q: 'What makes a good slug?',
          a: 'Short, lowercase, hyphen-separated and free of special characters — this tool handles all of that automatically.',
        },
      ]}
    >
      <div className="field">
        <label>Title or text</label>
        <input
          aria-label="Title or text"
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="10 Best Free Tools for Content Writers in 2026"
        />
      </div>
      <div className="result">
        <span style={{ fontFamily: "'Sora',monospace" }}>{slug || 'your-slug-appears-here'}</span>
        <button className="btn btnDark" onClick={copy}>
          Copy
        </button>
      </div>
    </ToolShell>
  );
}
