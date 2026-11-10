import { NextResponse } from 'next/server';
import { isRateLimited, clientIp } from '@/lib/rateLimit';
import { readJsonBody, BodyError } from '@/lib/http';
import { answerFromSite, type Msg } from '@/lib/siteAssistant';

/**
 * CraftSprint AI — answers only about this website, using only CraftSprint's own data.
 * No outside AI service is called, nothing is stored or logged, and the visitor's text is never repeated back.
 */
export async function POST(req: Request) {
  if (await isRateLimited('assistant', clientIp(req), 60, 10 * 60e3))
    return NextResponse.json(
      {
        reply: 'You have sent a lot of messages. Please wait a few minutes and try again.',
        tools: [],
        links: [],
      },
      { status: 429 },
    );
  let messages: Msg[] = [];
  try {
    // At most 16 KB, JSON only, at most 20 messages; only the last 8 (500 characters each) are used.
    const body = (await readJsonBody(req, 16 * 1024)) as { messages?: unknown };
    if (!Array.isArray(body?.messages) || body.messages.length > 20)
      throw new BodyError(400, 'Invalid request.');
    messages = (body.messages as Msg[])
      .filter(m => m && (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string')
      .slice(-8)
      .map(m => ({ role: m.role, content: m.content.slice(0, 500) }));
  } catch (e) {
    const err = e instanceof BodyError ? e : new BodyError(400, 'Invalid request.');
    return NextResponse.json({ error: err.message }, { status: err.status });
  }
  if (!messages.some(m => m.role === 'user'))
    return NextResponse.json({ error: 'No question' }, { status: 400 });

  return NextResponse.json(answerFromSite(messages), { headers: { 'Cache-Control': 'no-store' } });
}
