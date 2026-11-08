'use client';
/** Counts finished downloads from any tool (every "Download" link or button saves through an <a download>). */
import { useEffect } from 'react';
import { track, currentToolSlug } from '@/lib/analytics';

export default function AnalyticsEvents() {
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const a = (e.target as HTMLElement | null)?.closest?.('a[download]') as HTMLAnchorElement | null;
      if (!a) return;
      const name = a.getAttribute('download') || '';
      track('file_download', {
        tool_slug: currentToolSlug(),
        file_extension: name.split('.').pop()?.toLowerCase() || 'file',
      });
    };
    document.addEventListener('click', onClick, true);
    return () => document.removeEventListener('click', onClick, true);
  }, []);
  return null;
}
