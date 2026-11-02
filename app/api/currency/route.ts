import { NextResponse } from 'next/server';
import { isRateLimited, clientIp } from '@/lib/rateLimit';

export async function GET(req: Request) {
  if (await isRateLimited('currency', clientIp(req), 60, 60e3))
    return NextResponse.json({ error: 'Too many requests.' }, { status: 429 });
  const { searchParams } = new URL(req.url);
  const from = (searchParams.get('from') || 'USD').toUpperCase();
  const to = (searchParams.get('to') || 'EUR').toUpperCase();
  if (!/^[A-Z]{3}$/.test(from) || !/^[A-Z]{3}$/.test(to))
    return NextResponse.json({ error: 'Use 3-letter currency codes like USD or PKR.' }, { status: 400 });
  try {
    const r = await fetch(`https://open.er-api.com/v6/latest/${from}`, {
      next: { revalidate: 3600 },
      signal: AbortSignal.timeout(8000),
    });
    if (!r.ok) return NextResponse.json({ error: 'Could not fetch exchange rates.' }, { status: 502 });
    const data = await r.json();
    const rate = data.rates?.[to];
    if (data.result !== 'success' || typeof rate !== 'number')
      return NextResponse.json({ error: 'Unsupported currency pair.' }, { status: 400 });
    return NextResponse.json({ from, to, rate, date: data.time_last_update_utc });
  } catch {
    return NextResponse.json({ error: 'Could not fetch exchange rates.' }, { status: 502 });
  }
}
