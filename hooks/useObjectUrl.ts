'use client';
import { useEffect } from 'react';

/**
 * Frees a blob: URL when it is replaced or when the tool closes.
 * Without this, every processed file stays in browser memory until the tab is closed.
 */
export function useRevokeObjectUrl(url: string | null | undefined) {
  useEffect(
    () => () => {
      if (url && url.startsWith('blob:')) URL.revokeObjectURL(url);
    },
    [url],
  );
}
