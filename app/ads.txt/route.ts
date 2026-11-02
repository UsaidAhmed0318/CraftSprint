/** Serves /ads.txt from NEXT_PUBLIC_ADSENSE_CLIENT (e.g. ca-pub-1234567890123456). */
export function GET() {
  const client = process.env.NEXT_PUBLIC_ADSENSE_CLIENT || '';
  const pub = client.replace(/^ca-/, '');
  const body =
    pub && !pub.includes('XXXX')
      ? `google.com, ${pub}, DIRECT, f08c47fec0942fa0\n`
      : '# AdSense not configured yet\n';
  return new Response(body, {
    headers: { 'content-type': 'text/plain; charset=utf-8', 'cache-control': 'public, max-age=3600' },
  });
}
