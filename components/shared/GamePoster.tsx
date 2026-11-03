/**
 * Colourful poster card for a game (used on the homepage and the Games category page).
 * Artwork is pure CSS + the game's icon, so there are no extra image downloads.
 */
import Link from 'next/link';
import type { Tool } from '@/data/tools';
import { Play } from 'lucide-react';

const THEMES = ['p1', 'p2', 'p3', 'p4', 'p5', 'p6', 'p7', 'p8', 'p9', 'p10'];

export default function GamePoster({ tool, index = 0 }: { tool: Tool; index?: number }) {
  const Icon = tool.icon;
  return (
    <Link href={`/tools/${tool.slug}`} className={`gamePoster ${THEMES[index % THEMES.length]}`}>
      <span className="gpGlow" aria-hidden="true" />
      <span className="gpIcon" aria-hidden="true">
        <Icon size={54} strokeWidth={1.6} />
      </span>
      <span className="gpTitle">{tool.name}</span>
      <span className="gpPlay">
        <Play size={13} fill="currentColor" /> Play free
      </span>
    </Link>
  );
}
