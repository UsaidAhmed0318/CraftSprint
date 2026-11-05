import { describe, expect, it, vi, beforeEach } from 'vitest';

const send = vi.fn();
vi.mock('resend', () => ({
  Resend: class {
    emails = { send };
  },
}));

import { POST as feedback } from '@/app/api/feedback/route';
import { POST as assistant } from '@/app/api/assistant/route';

let ip = 0;
const req = (url: string, body: unknown, headers: Record<string, string> = {}) =>
  new Request(`http://localhost${url}`, {
    method: 'POST',
    headers: { 'content-type': 'application/json', 'x-real-ip': `10.0.0.${++ip}`, ...headers },
    body: typeof body === 'string' ? body : JSON.stringify(body),
  });
const good = { name: 'Ali', email: 'ali@example.com', message: 'Hello there', startedAt: 0 };

describe('contact form API', () => {
  beforeEach(() => {
    send.mockReset();
    delete process.env.RESEND_API_KEY;
    delete process.env.CONTACT_FROM_EMAIL;
    delete process.env.CONTACT_TO_EMAIL;
  });
  const configure = () => {
    process.env.RESEND_API_KEY = 're_test';
    process.env.CONTACT_FROM_EMAIL = 'CraftSprint <hello@example.com>';
    process.env.CONTACT_TO_EMAIL = 'owner@example.com';
  };

  it('never reports success when email is not configured (503)', async () => {
    const r = await feedback(req('/api/feedback', good));
    expect(r.status).toBe(503);
    expect((await r.json()).delivered).toBeUndefined();
    expect(send).not.toHaveBeenCalled();
  });
  it('reports delivered only when the email service accepts it', async () => {
    configure();
    send.mockResolvedValue({ data: { id: '1' }, error: null });
    const r = await feedback(req('/api/feedback', good));
    expect(r.status).toBe(200);
    expect(await r.json()).toEqual({ ok: true, delivered: true });
  });
  it('returns 502 when the email service rejects the email', async () => {
    configure();
    send.mockResolvedValue({ data: null, error: { name: 'validation_error', message: 'bad from' } });
    expect((await feedback(req('/api/feedback', good))).status).toBe(502);
  });
  it('returns 504 when the email service fails', async () => {
    configure();
    send.mockRejectedValue(new Error('network'));
    expect((await feedback(req('/api/feedback', good))).status).toBe(504);
  });
  it('rejects a bad email, empty fields, wrong content type, oversized and malformed bodies', async () => {
    expect((await feedback(req('/api/feedback', { ...good, email: 'nope' }))).status).toBe(400);
    expect((await feedback(req('/api/feedback', { ...good, name: '', message: '' }))).status).toBe(400);
    expect((await feedback(req('/api/feedback', good, { 'content-type': 'text/plain' }))).status).toBe(415);
    expect((await feedback(req('/api/feedback', { ...good, message: 'x'.repeat(9000) }))).status).toBe(413);
    expect((await feedback(req('/api/feedback', '{not json'))).status).toBe(400);
  });
  it('does not send spam (honeypot) and does not claim delivery', async () => {
    configure();
    const r = await feedback(req('/api/feedback', { ...good, website: 'spam' }));
    expect((await r.json()).delivered).toBe(false);
    expect(send).not.toHaveBeenCalled();
  });
  it('rate limits after 5 messages from one address', async () => {
    const h = { 'x-real-ip': '192.0.2.77' };
    const codes = [];
    for (let i = 0; i < 6; i++) codes.push((await feedback(req('/api/feedback', good, h))).status);
    expect(codes.slice(-1)[0]).toBe(429);
  });
});

describe('assistant API', () => {
  it('answers with tool suggestions without an AI key', async () => {
    delete process.env.ANTHROPIC_API_KEY;
    const r = await assistant(
      req('/api/assistant', { messages: [{ role: 'user', content: 'compress image' }] }),
    );
    expect(r.status).toBe(200);
    expect((await r.json()).tools).toContain('image-compressor');
  });
  it('rejects malformed, oversized, wrong-type and too-long conversations', async () => {
    expect((await assistant(req('/api/assistant', '{bad'))).status).toBe(400);
    expect(
      (await assistant(req('/api/assistant', { messages: [] }, { 'content-type': 'text/plain' }))).status,
    ).toBe(415);
    expect(
      (await assistant(req('/api/assistant', { messages: [{ role: 'user', content: 'x'.repeat(20000) }] })))
        .status,
    ).toBe(413);
    const many = Array.from({ length: 21 }, () => ({ role: 'user', content: 'hi' }));
    expect((await assistant(req('/api/assistant', { messages: many }))).status).toBe(400);
  });
});

import { POST as chat } from '@/app/api/chat/route';
import { formatSql } from '@/components/tools/batch2/NewTools3';

describe('AI chat API', () => {
  it('is honest when the AI key is missing (503)', async () => {
    delete process.env.ANTHROPIC_API_KEY;
    const r = await chat(req('/api/chat', { messages: [{ role: 'user', content: 'Hello' }] }));
    expect(r.status).toBe(503);
  });
});

describe('SQL formatter', () => {
  it('puts clauses on their own lines and keeps quoted text', () => {
    const out = formatSql("select id, name from users where name = 'select from' and age > 3 order by id");
    expect(out).toContain('SELECT\n  id,\n  name\nFROM\n  users\nWHERE');
    expect(out).toContain("'select from'");
    expect(out).toContain('ORDER BY');
  });
});

describe('AI chat with Gemini (free tier)', () => {
  it('returns the Gemini answer and a friendly message when the free limit is reached', async () => {
    process.env.GEMINI_API_KEY = 'test';
    const real = global.fetch;
    global.fetch = vi
      .fn()
      .mockResolvedValueOnce(
        new Response(
          JSON.stringify({
            candidates: [{ content: { parts: [{ text: 'Salaam! Main madad kar sakta hoon.' }] } }],
          }),
          { status: 200 },
        ),
      ) as unknown as typeof fetch;
    const ok = await chat(req('/api/chat', { messages: [{ role: 'user', content: 'Salaam' }] }));
    expect((await ok.json()).reply).toContain('madad');
    global.fetch = vi
      .fn()
      .mockResolvedValueOnce(new Response('{}', { status: 429 })) as unknown as typeof fetch;
    const limited = await chat(req('/api/chat', { messages: [{ role: 'user', content: 'Hi' }] }));
    expect(limited.status).toBe(429);
    global.fetch = real;
    delete process.env.GEMINI_API_KEY;
  });
});
