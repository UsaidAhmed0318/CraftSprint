import { NextResponse } from 'next/server';
import { tools } from '@/data/tools';
import { isRateLimited, clientIp } from '@/lib/rateLimit';
import { readJsonBody, BodyError } from '@/lib/http';
import { matchTools } from '@/lib/toolMatch';

/**
 * CraftSprint AI — general chat (answers questions, writes, explains, writes code) in the visitor's language.
 * Uses GEMINI_API_KEY (Google, free tier) if set, otherwise ANTHROPIC_API_KEY (paid). Limits are strict either way.
 * Conversations are not stored or logged.
 */
type Msg = { role: 'user' | 'assistant'; content: string };

const SYSTEM = `You are CraftSprint AI, the helpful assistant of CraftSprint (free online tools and games).
- Reply in the same language and script the user writes in (for example Roman Urdu, Urdu, Hindi, Arabic, English).
- Be friendly, clear and globally neutral; do not assume the user's religion, country or gender.
- You can explain, write and rewrite text, translate, brainstorm, plan, and write or debug code. Use Markdown: short paragraphs, lists, and fenced code blocks with the language name.
- When asked to build a web page, website, landing page or small app, reply with ONE complete, self-contained HTML file (inline CSS and JavaScript, no external files) in a single \`\`\`html block, so the user can preview and download it. Make it modern, responsive and accessible. Keep the explanation before it short.
- When one of CraftSprint's tools would help, mention it with its link (/tools/<slug>). Only use links from this list:
${tools.map(t => `/tools/${t.slug} — ${t.name}`).join('\n')}
- Be honest: you cannot browse the internet, open files, or remember past chats. Do not invent facts, prices or statistics.
- Refuse harmful, illegal or adult requests politely.`;

/** Google Gemini (has a free tier). */
const GEMINI = 'https://generativelanguage.googleapis.com/v1beta';
let discoveredModel: string | null = null; // from Google's model list
let workingModel: string | null = null; // last model that answered

/** Finds a Flash model this key may use (model names change over time), preferring stable over preview. */
async function findGeminiModel(key: string): Promise<string | null> {
  if (discoveredModel) return discoveredModel;
  try {
    const r = await fetch(`${GEMINI}/models?pageSize=200`, {
      headers: { 'x-goog-api-key': key },
      signal: AbortSignal.timeout(10000),
    });
    if (!r.ok) return null;
    const d = await r.json();
    const names: string[] = (d.models || [])
      .filter((m: { supportedGenerationMethods?: string[] }) =>
        m.supportedGenerationMethods?.includes('generateContent'),
      )
      .map((m: { name: string }) => m.name.replace(/^models\//, ''))
      .filter((n: string) => /flash/i.test(n) && !/image|tts|live|audio|embedding|thinking|exp/i.test(n));
    const score = (n: string) =>
      (/preview/i.test(n) ? 0 : 10) +
      (/lite/i.test(n) ? 0 : 5) +
      (parseFloat(n.replace(/^gemini-/, '')) || 0);
    names.sort((x, y) => score(y) - score(x));
    discoveredModel = names[0] || null;
    return discoveredModel;
  } catch {
    return null;
  }
}

async function callGemini(key: string, model: string, messages: Msg[]) {
  return fetch(`${GEMINI}/models/${encodeURIComponent(model)}:generateContent`, {
    method: 'POST',
    headers: { 'content-type': 'application/json', 'x-goog-api-key': key },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: SYSTEM }] },
      contents: messages.map(m => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.content }],
      })),
      generationConfig: { maxOutputTokens: 4096, temperature: 0.7 },
    }),
    signal: AbortSignal.timeout(45000),
  });
}

/** Model names to try, newest-style aliases first. GEMINI_MODEL (if set) and the discovered model go first. */
const FALLBACK_MODELS = [
  'gemini-flash-latest',
  'gemini-2.5-flash',
  'gemini-2.0-flash',
  'gemini-flash-lite-latest',
  'gemini-2.5-flash-lite',
];

type GeminiResult = { status: 200; text: string } | { status: 403 | 429 | 502; detail: string };

async function askGemini(key: string, messages: Msg[]): Promise<GeminiResult> {
  const tried = new Set<string>();
  const queue = [process.env.GEMINI_MODEL, workingModel, discoveredModel, ...FALLBACK_MODELS].filter(
    Boolean,
  ) as string[];
  let lastDetail = '';
  let looked = false;
  while (queue.length) {
    const model = queue.shift()!;
    if (tried.has(model)) continue;
    tried.add(model);
    const r = await callGemini(key, model, messages);
    if (r.ok) {
      const data = await r.json();
      const text: string = (data.candidates?.[0]?.content?.parts || [])
        .filter((p: { thought?: boolean }) => !p.thought)
        .map((p: { text?: string }) => p.text || '')
        .join('')
        .trim();
      workingModel = model;
      if (!text && data.promptFeedback?.blockReason)
        return { status: 200, text: 'Sorry, I can’t help with that request.' };
      if (!text) {
        lastDetail = `empty answer from ${model} (${data.candidates?.[0]?.finishReason || 'no reason'})`;
        continue;
      }
      return { status: 200, text };
    }
    let detail = '';
    try {
      detail = (await r.json())?.error?.message?.slice(0, 180) || '';
    } catch {}
    lastDetail = `${r.status} ${model}: ${detail}`;
    // Visible in Vercel → Logs. Never includes the key or the visitor's messages.
    console.error('[chat] Gemini error', lastDetail);
    if (r.status === 401 || r.status === 403 || /api key/i.test(detail))
      return { status: 403, detail: lastDetail };
    if (r.status === 429 && !/limit: 0|free_tier.*0/i.test(detail))
      return { status: 429, detail: lastDetail };
    // Unknown model, model without free quota, or a temporary server error: try the next model.
    if (!looked) {
      looked = true;
      const found = await findGeminiModel(key);
      if (found && !tried.has(found)) queue.unshift(found);
    }
  }
  return { status: 502, detail: lastDetail };
}

export async function POST(req: Request) {
  const gemini = process.env.GEMINI_API_KEY;
  const key = process.env.ANTHROPIC_API_KEY;
  if (!gemini && !key) {
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
  if (gemini) {
    try {
      const g = await askGemini(gemini, messages);
      if (g.status === 200) return NextResponse.json({ reply: g.text });
      if (g.status === 429)
        return NextResponse.json(
          { error: 'The free AI limit has been reached for now. Please try again a little later.' },
          { status: 429 },
        );
      // Still useful when the AI is unavailable: suggest matching tools, and show the reason for the site owner.
      const found = matchTools(messages[messages.length - 1].content);
      return NextResponse.json(
        {
          reply:
            g.status === 403
              ? 'CraftSprint AI is not set up correctly yet (the AI key was not accepted).'
              : 'CraftSprint AI could not answer right now.' +
                (found.length ? ' These tools may help meanwhile:' : ''),
          tools: found.map(t => t.slug),
          detail: g.detail,
        },
        { status: 200 },
      );
    } catch {
      return NextResponse.json(
        { error: 'The AI service did not respond in time. Please try again.' },
        { status: 504 },
      );
    }
  }
  try {
    const r = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'x-api-key': key!, 'anthropic-version': '2023-06-01' },
      body: JSON.stringify({
        model: process.env.ANTHROPIC_CHAT_MODEL || process.env.ANTHROPIC_MODEL || 'claude-haiku-5-5',
        max_tokens: 3500,
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
