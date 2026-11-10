'use client';
/**
 * Advertisement slot (Google AdSense).
 *  - Live site only, and only when real IDs are set in Vercel (NEXT_PUBLIC_ADSENSE_CLIENT + _SLOT).
 *    Staging, previews and sites without IDs show nothing: no empty boxes, no fake ads.
 *  - Space is reserved before the ad loads (no page jump → good Core Web Vitals for SEO).
 *  - The ad is requested only when the visitor scrolls near it (faster pages).
 *  - Clearly labelled “Advertisement”, as Google’s policy requires. If Google has no ad to show,
 *    the whole box hides itself.
 *  - On your own computer (npm run dev) a dashed preview box shows where the ad will appear.
 * Place it below a tool’s result, at the end of an article, or under a list: never inside a result,
 * on pages with little content (contact, privacy, terms) or near buttons that people press often.
 * Styles: app/globals.css → “Advertisement slot”.
 */
import { useEffect, useRef } from 'react';

const client = process.env.NEXT_PUBLIC_ADSENSE_CLIENT;
const defaultSlot = process.env.NEXT_PUBLIC_ADSENSE_SLOT;
const live = process.env.NEXT_PUBLIC_DEPLOY_ENV === 'production' && !!client && !client.includes('XXXX');
const preview = process.env.NODE_ENV === 'development';

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

type Props = {
  /** A different AdSense ad unit ID for this spot (defaults to NEXT_PUBLIC_ADSENSE_SLOT). */
  slot?: string;
  /** Where it sits; only changes the spacing. */
  placement?: 'content' | 'compact';
  className?: string;
};

export default function AdSlot({ slot, placement = 'content', className = '' }: Props) {
  const slotId = slot || defaultSlot;
  const enabled = live && !!slotId;
  const box = useRef<HTMLDivElement>(null);
  const pushed = useRef(false);

  useEffect(() => {
    const el = box.current;
    if (!enabled || !el) return;
    const request = () => {
      if (pushed.current) return;
      pushed.current = true;
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch {}
    };
    if (!('IntersectionObserver' in window)) {
      request();
      return;
    }
    const io = new IntersectionObserver(
      entries => {
        if (entries.some(e => e.isIntersecting)) {
          request();
          io.disconnect();
        }
      },
      { rootMargin: '400px 0px' },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [enabled]);

  if (!enabled && !preview) return null;
  return (
    <aside
      className={`adSlot ${placement === 'compact' ? 'adSlotCompact' : ''} ${className}`.trim()}
      aria-label="Advertisement"
      data-nosnippet
    >
      <span className="adSlotLabel">Advertisement</span>
      <div className="adSlotFrame" ref={box}>
        {enabled ? (
          <ins
            className="adsbygoogle"
            style={{ display: 'block' }}
            data-ad-client={client}
            data-ad-slot={slotId}
            data-ad-format="auto"
            data-full-width-responsive="true"
          />
        ) : (
          <span className="adSlotPreview">
            Ad space — shows only on the live site once AdSense IDs are set
          </span>
        )}
      </div>
    </aside>
  );
}
