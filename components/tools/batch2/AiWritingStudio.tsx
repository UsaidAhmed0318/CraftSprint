'use client';
/**
 * AI Writing Studio: one page for the most-searched AI writing jobs (email, rewrite, summary, captions…).
 * Uses the same CraftSprint AI service as the chat; answers in the language the visitor writes in.
 */
import { useState } from 'react';
import ToolShell from '@/components/shared/ToolShell';
import { CopyButton, Note } from '@/components/shared/ui';

const TASKS = [
  {
    id: 'email',
    label: 'Email writer',
    field: 'What is the email about?',
    ph: 'Ask my manager for leave on Friday for a family event',
    make: (t: string, tone: string) =>
      `Write a ${tone} email: ${t}. Include a subject line. Keep it concise.`,
  },
  {
    id: 'reply',
    label: 'Email reply',
    field: 'Paste the email you received',
    ph: 'Paste the email here',
    make: (t: string, tone: string) =>
      `Write a ${tone} reply to this email. Keep it short and clear.\n\n${t}`,
  },
  {
    id: 'rewrite',
    label: 'Rewrite / paraphrase',
    field: 'Text to rewrite',
    ph: 'Paste your text',
    make: (t: string, tone: string) =>
      `Rewrite this text in a ${tone} tone, keeping the meaning. Return only the rewritten text.\n\n${t}`,
  },
  {
    id: 'grammar',
    label: 'Grammar fix',
    field: 'Text to correct',
    ph: 'Paste your text',
    make: (t: string) =>
      `Correct the grammar, spelling and punctuation of this text. Return the corrected text, then a short list of the main changes.\n\n${t}`,
  },
  {
    id: 'summary',
    label: 'Summarizer',
    field: 'Text to summarise',
    ph: 'Paste an article, notes or a long message',
    make: (t: string) => `Summarise this in 5 clear bullet points and one key takeaway.\n\n${t}`,
  },
  {
    id: 'caption',
    label: 'Social media captions',
    field: 'What is the post about?',
    ph: 'New summer collection of cotton shirts',
    make: (t: string, tone: string) =>
      `Write 5 ${tone} social media captions about: ${t}. Each under 150 characters with 3 relevant hashtags.`,
  },
  {
    id: 'product',
    label: 'Product description',
    field: 'Product and key features',
    ph: 'Stainless steel water bottle, 1 litre, keeps drinks cold 24h',
    make: (t: string, tone: string) =>
      `Write a ${tone} product description with a headline, 5 benefit bullet points and a short paragraph for: ${t}. Do not invent certifications or claims.`,
  },
  {
    id: 'blog',
    label: 'Blog outline',
    field: 'Blog topic',
    ph: 'How to start freelancing as a student',
    make: (t: string) =>
      `Create a detailed blog post outline for: ${t}. Include a title, intro hook, H2/H3 headings with bullet points, FAQs and a conclusion.`,
  },
  {
    id: 'cover',
    label: 'Cover letter',
    field: 'Job title, company and your strengths',
    ph: 'Junior web developer at Acme; React, teamwork, 2 projects',
    make: (t: string, tone: string) =>
      `Write a ${tone} one-page cover letter for: ${t}. Use placeholders like [Your Name] where details are missing.`,
  },
  {
    id: 'linkedin',
    label: 'LinkedIn post',
    field: 'What do you want to share?',
    ph: 'I finished my first freelance project',
    make: (t: string, tone: string) =>
      `Write a ${tone} LinkedIn post about: ${t}. Short paragraphs, a strong first line, and a question at the end.`,
  },
  {
    id: 'names',
    label: 'Business name ideas',
    field: 'What does the business do?',
    ph: 'Online bakery selling custom cakes',
    make: (t: string) =>
      `Suggest 20 short, memorable business names for: ${t}. Add a one-line reason for the best 5. Do not claim any name is available.`,
  },
  {
    id: 'youtube',
    label: 'YouTube script',
    field: 'Video topic',
    ph: '5 tips to save money as a student',
    make: (t: string, tone: string) =>
      `Write a ${tone} 3-minute YouTube script about: ${t}. Hook in the first 10 seconds, simple spoken sentences, and a call to action at the end.`,
  },
  {
    id: 'translate',
    label: 'Translate',
    field: 'Text to translate (say which language)',
    ph: 'Translate to Urdu: Thank you for your order',
    make: (t: string) => `${t}\n\nTranslate naturally and keep the meaning. Return only the translation.`,
  },
  {
    id: 'prompt',
    label: 'Prompt improver',
    field: 'Your AI prompt',
    ph: 'make a logo for my shop',
    make: (t: string) =>
      `Improve this AI prompt so it is specific and gets better results. Return the improved prompt, then 3 short tips.\n\nPrompt: ${t}`,
  },
] as const;
const TONES = ['professional', 'friendly', 'formal', 'casual', 'persuasive', 'simple'];

export function AiWritingStudio() {
  const [task, setTask] = useState<(typeof TASKS)[number]['id']>('email');
  const [input, setInput] = useState('');
  const [tone, setTone] = useState('professional');
  const [out, setOut] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const t = TASKS.find(x => x.id === task)!;
  const run = async () => {
    setBusy(true);
    setError('');
    setOut('');
    try {
      const r = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ messages: [{ role: 'user', content: t.make(input.trim(), tone) }] }),
      });
      const d = await r.json();
      if (d.reply && !d.detail) setOut(d.reply);
      else setError(d.error || d.reply || 'CraftSprint AI could not answer right now. Please try again.');
    } catch {
      setError('Could not reach CraftSprint AI. Check your connection and try again.');
    } finally {
      setBusy(false);
    }
  };
  return (
    <ToolShell
      title="AI Writing Studio"
      description="Write emails and replies, rewrite or fix grammar, summarise, and create captions, product descriptions, cover letters and more — in any language."
      faq={[
        {
          q: 'Which languages work?',
          a: 'Write your request in any language — English, Urdu, Roman Urdu, Hindi, Arabic and more — and the answer comes back in the same language.',
        },
        {
          q: 'Should I check the result?',
          a: 'Yes. AI can make mistakes. Read and edit the text before you send or publish it, especially facts, names and numbers.',
        },
        {
          q: 'Is my text stored?',
          a: 'CraftSprint does not store it. It is sent to the AI provider to create the answer, so please don’t include private information.',
        },
      ]}
    >
      <div className="tbChips" role="group" aria-label="Writing task" style={{ flexWrap: 'wrap' }}>
        {TASKS.map(x => (
          <button
            key={x.id}
            type="button"
            className={task === x.id ? 'on' : ''}
            aria-pressed={task === x.id}
            onClick={() => setTask(x.id)}
          >
            {x.label}
          </button>
        ))}
      </div>
      <div className="field" style={{ marginTop: 14 }}>
        <label htmlFor="aw-in">{t.field}</label>
        <textarea
          id="aw-in"
          className="textArea"
          maxLength={3500}
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder={t.ph}
        />
      </div>
      <div className="field">
        <label htmlFor="aw-tone">Tone</label>
        <select id="aw-tone" value={tone} onChange={e => setTone(e.target.value)}>
          {TONES.map(x => (
            <option key={x} value={x}>
              {x[0].toUpperCase() + x.slice(1)}
            </option>
          ))}
        </select>
      </div>
      <button className="btn btnPrimary" disabled={!input.trim() || busy} onClick={run}>
        {busy ? 'Writing…' : 'Write with AI'}
      </button>
      {error && <Note error>{error}</Note>}
      {out && (
        <>
          <div className="field" style={{ marginTop: 14 }}>
            <label htmlFor="aw-out">Result</label>
            <textarea
              id="aw-out"
              className="textArea"
              style={{ minHeight: 260 }}
              value={out}
              onChange={e => setOut(e.target.value)}
            />
          </div>
          <CopyButton text={out} />
        </>
      )}
    </ToolShell>
  );
}
