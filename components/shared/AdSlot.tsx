'use client';
import { useEffect, useRef } from 'react';
const client = process.env.NEXT_PUBLIC_ADSENSE_CLIENT;
const slot = process.env.NEXT_PUBLIC_ADSENSE_SLOT;
const enabled =
  process.env.NEXT_PUBLIC_DEPLOY_ENV === 'production' && !!client && !client.includes('XXXX') && !!slot;
declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}
/** Renders a responsive AdSense unit only when real IDs are configured; otherwise renders nothing. */
export default function AdSlot() {
  const pushed = useRef(false);
  useEffect(() => {
    if (!enabled || pushed.current) return;
    pushed.current = true;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {}
  }, []);
  if (!enabled) return null;
  return (
    <div style={{ margin: '28px 0', minHeight: 100 }}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client={client}
        data-ad-slot={slot}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
}
