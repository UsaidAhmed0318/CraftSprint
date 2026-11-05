/**
 * Game card (homepage + Games page): dark glass card with a colourful 3D-style icon,
 * the game's name and type, and a Play button. Pure CSS — no image downloads.
 */
import Link from 'next/link';
import type { Tool } from '@/data/tools';
import { Play } from 'lucide-react';

export const GAME_TYPES: Record<string, string> = {
  'game-2048': 'Puzzle game',
  'snake-game': 'Arcade game',
  'memory-match': 'Memory game',
  'tic-tac-toe': 'Classic game',
  'typing-speed-test': 'Skill test',
  minesweeper: 'Logic game',
  'connect-four': 'Strategy game',
  hangman: 'Word game',
  'reaction-time-test': 'Reflex test',
  'simon-says': 'Memory game',
  'block-stack': 'Puzzle game',
  'brick-breaker': 'Arcade game',
  'space-defender': 'Shooter game',
  'sky-hopper': 'Arcade game',
  'whack-a-mole': 'Reflex game',
  sudoku: 'Logic puzzle',
  'word-guess': 'Word game',
  'sliding-puzzle': 'Puzzle game',
};
const THEMES = ['p1', 'p2', 'p3', 'p4', 'p5', 'p6', 'p7', 'p8', 'p9', 'p10'];

export default function GamePoster({ tool, index = 0 }: { tool: Tool; index?: number }) {
  const Icon = tool.icon;
  return (
    <Link href={`/tools/${tool.slug}`} className={`gameCard ${THEMES[index % THEMES.length]}`}>
      <span className="gcIcon" aria-hidden="true">
        <Icon size={40} strokeWidth={1.7} />
      </span>
      <span className="gcName">{tool.name}</span>
      <span className="gcType">{GAME_TYPES[tool.slug] || 'Browser game'}</span>
      <span className="gcPlay">
        <Play size={12} fill="currentColor" aria-hidden="true" /> Play now
      </span>
    </Link>
  );
}
