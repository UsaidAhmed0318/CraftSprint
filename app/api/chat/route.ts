import { NextResponse } from 'next/server';
import { tools } from '@/data/tools';
import { isRateLimited, clientIp } from '@/lib/rateLimit';
import { readJsonBody, BodyError } from '@/lib/http';

/**
 * CraftSprint AI — general chat (answers questions, writes, explains, writes code) in the visitor's language.
 * Needs ANTHROPIC_API_KEY. Every message costs API credit, so limits are strict.
 * Conversations are not stored or logged.
 */
type Msg = { role: 'user' | 'assistant'; content: string };

const SYSTEM = `You are CraftSprint AI, the helpful assistant of CraftSprint (free online tools and games).
- Reply in the same language and script the user writes in (for example Roman Urdu, Urdu, Hindi, Arabic, English).
- Be friendly, clear and globally neutral; do not assume the user's religion, country or gender.
- You can explain, write and rewrite text, translate, brainstorm, plan, and write or debug code. Use Markdown: short paragraphs, lists, and fenced code blocks with the language name.
- When one of CraftSprint's tools would help, mention it with its link (/tools/<slug>). Only use links from this list:
${tools.map(t => `/tools/${t.slug} — ${t.name}`).join('\n')}
- Be honest: you cannot browse the internet, open files, or remember past chats. Do not invent facts, prices or statistics.
- Refuse harmful, illegal or adult requests politely.`;

export async function POST(req: Request) {
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) {
    return NextResponse.json(
      { error: 'CraftSprint AI chat is not switched on yet. You can still use “Find a tool”.' },
      { status: 503 },
    );
  }
  if (await isRateLimited('chat', clientIp(req), 20, 60 * 60e3)) {
    return NextResponse.json(
      { error: 'You have reached the hourly chat limit. Please try again later.' },
      { status: 429 },
    );
  }
  let messages: Msg[] = [];
  try {
    const body = (await readJsonBody(req, 48 * 1024)) as { messages?: unknown };
    if (!Array.isArray(body?.messages) || body.messages.length > 30)
      throw new BodyError(400, 'Invalid request.');
    messages = (body.messages as Msg[])
      .filter(
        m =>
          m &&
          (m.role === 'user' || m.role === 'assistant') &&
          typeof m.content === 'string' &&
          m.content.trim(),
      )
      .slice(-12)
      .map(m => ({ role: m.role, content: m.content.slice(0, 4000) }));
    while (messages.length && messages[0].role !== 'user') messages.shift();
    if (!messages.length || messages[messages.length - 1].role !== 'user')
      throw new BodyError(400, 'No question.');
  } catch (e) {
    const err = e instanceof BodyError ? e : new BodyError(400, 'Invalid request.');
    return NextResponse.json({ error: err.message }, { status: err.status });
  }
  try {
    const r = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'x-api-key': key, 'anthropic-version': '2023-06-01' },
      body: JSON.stringify({
        model: process.env.ANTHROPIC_CHAT_MODEL || process.env.ANTHROPIC_MODEL || 'claude-haiku-5-5',
        max_tokens: 1500,
        system: SYSTEM,
        messages,
      }),
      signal: AbortSignal.timeout(45000),
    });
    if (!r.ok) {
      console.error('[chat] AI service error', r.status);
      return NextResponse.json(
        { error: 'The AI service is busy. Please try again in a moment.' },
        { status: 502 },
      );
    }
    const data = await r.json();
    const reply: string = (data.content || [])
      .filter((b: { type: string }) => b.type === 'text')
      .map((b: { text: string }) => b.text)
      .join('\n')
      .trim();
    return NextResponse.json({ reply: reply || 'Sorry, I could not answer that. Please rephrase.' });
  } catch {
    return NextResponse.json(
      { error: 'The AI service did not respond in time. Please try again.' },
      { status: 504 },
    );
  }
}
