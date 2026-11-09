import { NextResponse } from 'next/server';
import { tools } from '@/data/tools';
import { isRateLimited, clientIp } from '@/lib/rateLimit';
import { readJsonBody, BodyError } from '@/lib/http';
import { matchTools } from '@/lib/toolMatch';
import { askAi, anyAiConfigured, type Msg } from '@/lib/aiProviders';

/** Several AI calls (answer + merge) can take a while; give the function room on Vercel. */
export const maxDuration = 60;

/**
 * CraftSprint AI — general chat (answers questions, writes, explains, writes code) in the visitor's language.
 * Uses every configured provider (Gemini, Groq, OpenRouter, Mistral, Cerebras, OpenAI, Claude — see lib/aiProviders.ts).
 * With 2+ providers they answer together and the best parts are merged. Limits are strict.
 * Conversations are not stored or logged.
 */
const SYSTEM = `You are CraftSprint AI, the helpful assistant of CraftSprint (free online tools and games).
- Reply in the same language and script the user writes in (for example Roman Urdu, Urdu, Hindi, Arabic, English).
- Be friendly, clear and globally neutral; do not assume the user's religion, country or gender.
- You can explain, write and rewrite text, translate, brainstorm, plan, and write or debug code. Use Markdown: short paragraphs, lists, and fenced code blocks with the language name.
- When asked to build a web page, website, landing page or small app, reply with ONE complete, self-contained HTML file (inline CSS and JavaScript, no external files) in a single \`\`\`html block, so the user can preview and download it. Make it modern, responsive and accessible. Keep the explanation before it short.
- When one of CraftSprint's tools would help, mention it with its link (/tools/<slug>). Only use links from this list:
${tools.map(t => `/tools/${t.slug} — ${t.name}`).join('\n')}
- Be honest: you cannot browse the internet, open files, or remember past chats. Do not invent facts, prices or statistics.
- Refuse harmful, illegal or adult requests politely.`;

export async function POST(req: Request) {
  if (!anyAiConfigured()) {
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

  const res = await askAi(SYSTEM, messages, { maxTokens: 3500, timeoutMs: 28000 });
  if (res.ok) return NextResponse.json({ reply: res.text });

  if (res.status === 429)
    return NextResponse.json(
      { error: 'The free AI limit has been reached for now. Please try again a little later.' },
      { status: 429 },
    );
  // Still useful when the AI is unavailable: suggest matching tools, and show the reason for the site owner.
  const found = matchTools(messages[messages.length - 1].content);
  return NextResponse.json(
    {
      reply:
        res.status === 403
          ? 'CraftSprint AI is not set up correctly yet (the AI key was not accepted).'
          : 'CraftSprint AI could not answer right now.' + (found.length ? ' These tools may help meanwhile:' : ''),
      tools: found.map(t => t.slug),
      detail: res.detail,
    },
    { status: 200 },
  );
}
