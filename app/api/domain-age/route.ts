import { NextResponse } from 'next/server';
import { isRateLimited, clientIp } from '@/lib/rateLimit';

/**
 * Domain age via RDAP (the official successor of WHOIS) through rdap.org, which routes to the right registry.
 * Only a validated domain name is sent, to a fixed host — no visitor-supplied URLs are fetched (no SSRF).
 */
const DOMAIN = /^(?=.{3,253}$)(?!-)[a-z0-9-]{1,63}(?<!-)(\.(?!-)[a-z0-9-]{1,63}(?<!-))+$/;

export async function GET(req: Request) {
  if (await isRateLimited('domain-age', clientIp(req), 20, 60e3)) {
    return NextResponse.json({ error: 'Too many lookups. Please wait a minute.' }, { status: 429 });
  }
  const raw = new URL(req.url).searchParams.get('domain') || '';
  const domain = raw
    .trim()
    .toLowerCase()
    .replace(/^https?:\/\//, '')
    .replace(/^www\./, '')
    .split(/[/?#]/)[0];
  if (!DOMAIN.test(domain))
    return NextResponse.json({ error: 'Enter a domain like example.com' }, { status: 400 });
  try {
    const r = await fetch(`https://rdap.org/domain/${encodeURIComponent(domain)}`, {
      headers: { accept: 'application/rdap+json' },
      signal: AbortSignal.timeout(10000),
      next: { revalidate: 86400 },
    });
    if (r.status === 404)
      return NextResponse.json(
        { error: 'This domain is not registered (or its registry has no RDAP data).' },
        { status: 404 },
      );
    if (!r.ok)
      return NextResponse.json({ error: 'The registry did not answer. Try again later.' }, { status: 502 });
    const d = await r.json();
    const ev = (name: string) =>
      (d.events || []).find((e: { eventAction: string }) => e.eventAction === name)?.eventDate || null;
    const registrar = (d.entities || []).find((e: { roles?: string[] }) => e.roles?.includes('registrar'));
    const registrarName = registrar?.vcardArray?.[1]?.find((v: unknown[]) => v[0] === 'fn')?.[3] || null;
    return NextResponse.json({
      domain,
      created: ev('registration'),
      updated: ev('last changed'),
      expires: ev('expiration'),
      registrar: registrarName,
      status: d.status || [],
    });
  } catch {
    return NextResponse.json({ error: 'The registry lookup timed out. Try again.' }, { status: 504 });
  }
}
