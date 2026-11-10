import { NextResponse } from 'next/server';
import { rateLimitMode } from '@/lib/rateLimit';

/** Health check: the app is up, plus which optional services are configured (never their values). */
export function GET() {
  return NextResponse.json(
    {
      ok: true,
      email: !!(
        process.env.RESEND_API_KEY &&
        process.env.CONTACT_FROM_EMAIL &&
        (process.env.CONTACT_TO_EMAIL || process.env.CONTACT_EMAIL)
      ),
      rateLimit: rateLimitMode(),
    },
    { headers: { 'Cache-Control': 'no-store' } },
  );
}
