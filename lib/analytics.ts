'use client';
/**
 * Privacy-friendly usage events for Google Analytics 4 (only on the live site, only when GA is configured).
 * We never send file contents, typed text, chat messages, names or emails — only which tool was used and how.
 */
type Params = Record<string, string | number | boolean | undefined>;

export function track(event: string, params: Params = {}) {
  if (typeof window === 'undefined') return;
  const g = (window as unknown as { gtag?: (...a: unknown[]) => void }).gtag;
  if (typeof g !== 'function') return;
  try {
    g('event', event, params);
  } catch {}
}

/** The tool slug of the current page, if it is a tool page. */
export function currentToolSlug() {
  if (typeof window === 'undefined') return undefined;
  const m = window.location.pathname.match(/^\/tools\/([a-z0-9-]+)/);
  return m?.[1];
}
