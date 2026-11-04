import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { isRateLimited, clientIp } from '@/lib/rateLimit';
import { validateContact } from '@/lib/validateContact';
import { readJsonBody, BodyError } from '@/lib/http';

/**
 * Contact form → email (Resend).
 * Success is returned ONLY when Resend accepts the email. Missing configuration returns 503;
 * messages are never logged or stored instead of being sent.
 *
 * Environment:
 *   RESEND_API_KEY      — from resend.com
 *   CONTACT_FROM_EMAIL  — a sender on a domain verified in Resend, e.g. "CraftSprint <hello@yourdomain.com>"
 *   CONTACT_TO_EMAIL    — where messages are delivered (CONTACT_EMAIL is still accepted)
 */
const MAX_BYTES = 8 * 1024;

export async function POST(req: Request) {
  if (await isRateLimited('feedback', clientIp(req), 5, 60 * 60e3)) {
    return NextResponse.json({ error: 'Too many messages. Please try again in an hour.' }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await readJsonBody(req, MAX_BYTES);
  } catch (e) {
    const err = e instanceof BodyError ? e : new BodyError(400, 'Invalid request.');
    return NextResponse.json({ error: err.message }, { status: err.status });
  }

  const problem = validateContact(body);
  // Bots get a normal-looking reply so they don't retry; nothing is sent and the form shows no success.
  if (problem === 'spam') return NextResponse.json({ ok: true, delivered: false });
  if (problem) return NextResponse.json({ error: problem }, { status: 400 });
  const { name, email, message } = body as { name: string; email: string; message: string };

  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.CONTACT_FROM_EMAIL;
  const to = process.env.CONTACT_TO_EMAIL || process.env.CONTACT_EMAIL;
  if (!apiKey || !from || !to) {
    console.error(
      '[contact] Email is not configured (RESEND_API_KEY, CONTACT_FROM_EMAIL, CONTACT_TO_EMAIL).',
    );
    return NextResponse.json(
      { error: 'Sorry — the contact form is temporarily unavailable. Please reach us on WhatsApp instead.' },
      { status: 503 },
    );
  }

  try {
    const resend = new Resend(apiKey);
    const result = await Promise.race([
      resend.emails.send({
        from,
        to,
        replyTo: email,
        subject: `CraftSprint contact: ${name.slice(0, 60)}`,
        text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
      }),
      new Promise<never>((_, reject) => setTimeout(() => reject(new Error('timeout')), 10_000)),
    ]);
    if (result.error) {
      // Log only the provider's error type — never the visitor's message.
      console.error('[contact] Resend rejected the email:', result.error.name);
      return NextResponse.json(
        { error: 'Your message could not be sent. Please try again later.' },
        { status: 502 },
      );
    }
    return NextResponse.json({ ok: true, delivered: true });
  } catch (e) {
    console.error('[contact] Email service unreachable:', e instanceof Error ? e.message : 'unknown');
    return NextResponse.json(
      { error: 'The email service did not respond. Please try again.' },
      { status: 504 },
    );
  }
}
