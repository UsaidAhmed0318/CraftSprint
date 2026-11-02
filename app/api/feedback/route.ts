import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { isRateLimited, clientIp } from '@/lib/rateLimit';
import { validateContact } from '@/lib/validateContact';
import { site } from '@/lib/site';
const CONTACT_EMAIL = process.env.CONTACT_EMAIL || site.email;
export async function POST(req: Request) {
  try {
    if (await isRateLimited('feedback', clientIp(req), 5, 60 * 60e3))
      return NextResponse.json({ error: 'Too many messages. Please try again later.' }, { status: 429 });
    const body = await req.json();
    const problem = validateContact(body);
    // Bots get a normal-looking success so they don't retry; nothing is sent.
    if (problem === 'spam') return NextResponse.json({ ok: true, delivered: false });
    if (problem) return NextResponse.json({ error: problem }, { status: 400 });

    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      console.log('RESEND_API_KEY not set — logging message instead of emailing.', {
        name: body.name,
        email: body.email,
        message: body.message,
      });
      return NextResponse.json({ ok: true, delivered: false });
    }

    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from: 'CraftSprint <onboarding@resend.dev>',
      to: CONTACT_EMAIL,
      replyTo: body.email,
      subject: `New contact form message from ${body.name}`,
      text: `Name: ${body.name}\nEmail: ${body.email}\n\nMessage:\n${body.message}`,
    });
    if (error) {
      console.error('Resend error', error);
      return NextResponse.json({ error: 'Could not send email' }, { status: 502 });
    }
    return NextResponse.json({ ok: true, delivered: true });
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }
}
