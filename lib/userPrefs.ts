'use client';
import { useEffect, useState, useCallback } from 'react';

const FAV = 'cs-favorites',
  RECENT = 'cs-recent',
  EVT = 'cs-prefs';
function read(key: string): string[] {
  try {
    const v = JSON.parse(localStorage.getItem(key) || '[]');
    return Array.isArray(v) ? v : [];
  } catch {
    return [];
  }
}
function write(key: string, list: string[]) {
  try {
    localStorage.setItem(key, JSON.stringify(list));
    window.dispatchEvent(new Event(EVT));
  } catch {
    /* storage unavailable */
  }
}

export function recordRecent(slug: string) {
  const list = read(RECENT).filter(s => s !== slug);
  list.unshift(slug);
  write(RECENT, list.slice(0, 8));
}

export function usePrefs() {
  const [favorites, setFav] = useState<string[]>([]);
  const [recent, setRecent] = useState<string[]>([]);
  useEffect(() => {
    const sync = () => {
      setFav(read(FAV));
      setRecent(read(RECENT));
    };
    sync();
    window.addEventListener(EVT, sync);
    window.addEventListener('storage', sync);
    return () => {
      window.removeEventListener(EVT, sync);
      window.removeEventListener('storage', sync);
    };
  }, []);
  const toggleFavorite = useCallback((slug: string) => {
    const list = read(FAV);
    write(FAV, list.includes(slug) ? list.filter(s => s !== slug) : [slug, ...list].slice(0, 12));
  }, []);
  return { favorites, recent, toggleFavorite };
}
