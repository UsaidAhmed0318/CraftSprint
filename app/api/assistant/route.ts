import { NextResponse } from 'next/server';
import { tools } from '@/data/tools';
import { matchTools } from '@/lib/toolMatch';
import { isRateLimited, clientIp } from '@/lib/rateLimit';

type Msg = { role: 'user' | 'assistant'; content: string };

const catalog = tools.map(t => `- ${t.name} (/tools/${t.slug}) [${t.category}]: ${t.description}`).join('\n');
const SYSTEM = `You are the CraftSprint Tool Assistant on a website of free browser-based tools.
Your only job: help visitors find the right CraftSprint tool and explain briefly how to use it.
Rules:
- Recommend tools ONLY from the catalog below, and always include their path exactly, like /tools/image-compressor.
- Keep answers short: 1–4 sentences, plain language. Reply in the same language the visitor writes in (English, Urdu, Roman Urdu, Hindi, Arabic, Spanish and so on).
- If no tool fits, say so honestly and suggest the closest one or the contact page (/contact).
- Politely decline anything unrelated to CraftSprint tools (homework answers, medical, legal or financial advice, personal topics, writing long content). Never ask for personal data, passwords or files.
- Never claim a tool can do something its description does not say.
Catalog:
${catalog}`;

export async function POST(req: Request) {
  if (await isRateLimited('assistant', clientIp(req), 30, 10 * 60e3))
    return NextResponse.json(
      { reply: 'You have sent a lot of messages. Please wait a few minutes and try again.', tools: [] },
      { status: 429 },
    );
  let messages: Msg[] = [];
  try {
    const body = await req.json();
    messages = (Array.isArray(body.messages) ? body.messages : [])
      .filter((m: Msg) => (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string')
      .slice(-6)
      .map((m: Msg) => ({ role: m.role, content: m.content.slice(0, 600) }));
  } catch {
    return NextResponse.json({ error: 'Bad request' }, { status: 400 });
  }
  const last = [...messages].reverse().find(m => m.role === 'user');
  if (!last) return NextResponse.json({ error: 'No question' }, { status: 400 });

  const key = process.env.ANTHROPIC_API_KEY;
  if (key) {
    try {
      while (messages.length && messages[0].role !== 'user') messages.shift();
      const r = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'content-type': 'application/json', 'x-api-key': key, 'anthropic-version': '2023-06-01' },
        body: JSON.stringify({
          model: process.env.ANTHROPIC_MODEL || 'claude-haiku-5-5',
          max_tokens: 350,
          system: SYSTEM,
          messages,
        }),
        signal: AbortSignal.timeout(20000),
      });
      if (r.ok) {
        const data = await r.json();
        const text: string = (data.content || [])
          .filter((b: { type: string }) => b.type === 'text')
          .map((b: { text: string }) => b.text)
          .join('\n')
          .trim();
        const found = [...new Set([...text.matchAll(/\/tools\/([a-z0-9-]+)/g)].map(m => m[1]))]
          .filter(s => tools.some(t => t.slug === s))
          .slice(0, 5);
        if (text) return NextResponse.json({ reply: text, tools: found, ai: true });
      }
    } catch {
      /* fall back to local matching */
    }
  }
  const found = matchTools(last.content);
  const reply = found.length
    ? `Here ${found.length === 1 ? 'is the tool' : 'are the tools'} that best match “${last.content.slice(0, 80)}”:`
    : 'I couldn’t find a matching tool. Try different words — for example “compress photo”, “merge pdf”, “loan” or “json” — or tell us what you need on the contact page.';
  return NextResponse.json({ reply, tools: found.map(t => t.slug), ai: false });
}

/** Tells the chat window whether real AI answers are switched on (an API key is set). */
export function GET() {
  return NextResponse.json({ ai: !!process.env.ANTHROPIC_API_KEY });
}
