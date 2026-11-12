'use client';
import {
  Rocket,
  Palette,
  FileText,
  Key,
  Headphones,
  Camera,
  Zap,
  Puzzle,
  Moon,
  Gem,
  Target,
  Clover,
  Bomb,
  Flag,
  type LucideIcon,
} from 'lucide-react';
import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from 'react';
import ToolShell from '@/components/shared/ToolShell';
import { Confetti } from '@/components/shared/ProFx';

const BEST_EVT = 'cs-best';
function useBest(key: string) {
  const subscribe = useCallback((cb: () => void) => {
    window.addEventListener(BEST_EVT, cb);
    window.addEventListener('storage', cb);
    return () => {
      window.removeEventListener(BEST_EVT, cb);
      window.removeEventListener('storage', cb);
    };
  }, []);
  const best = useSyncExternalStore(
    subscribe,
    () => {
      try {
        return Number(localStorage.getItem(key)) || 0;
      } catch {
        return 0;
      }
    },
    () => 0,
  );
  const update = useCallback(
    (v: number, lowerIsBetter = false) => {
      let b = 0;
      try {
        b = Number(localStorage.getItem(key)) || 0;
      } catch {}
      const better = lowerIsBetter ? b === 0 || v < b : v > b;
      if (better) {
        try {
          localStorage.setItem(key, String(v));
        } catch {}
        window.dispatchEvent(new Event(BEST_EVT));
      }
    },
    [key],
  );
  return [best, update] as const;
}
const Pill = ({ label, value }: { label: string; value: string | number }) => (
  <div className="scorePill">
    <span>{label}</span>
    {value}
  </div>
);
function useSwipe(
  ref: React.RefObject<HTMLElement | null>,
  onDir: (d: 'up' | 'down' | 'left' | 'right') => void,
) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let sx = 0,
      sy = 0;
    const s = (e: TouchEvent) => {
      sx = e.touches[0].clientX;
      sy = e.touches[0].clientY;
    };
    const end = (e: TouchEvent) => {
      const dx = e.changedTouches[0].clientX - sx,
        dy = e.changedTouches[0].clientY - sy;
      if (Math.max(Math.abs(dx), Math.abs(dy)) < 24) return;
      onDir(Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? 'right' : 'left') : dy > 0 ? 'down' : 'up');
    };
    el.addEventListener('touchstart', s, { passive: true });
    el.addEventListener('touchend', end);
    return () => {
      el.removeEventListener('touchstart', s);
      el.removeEventListener('touchend', end);
    };
  }, [ref, onDir]);
}
const KEYDIR: Record<string, 'up' | 'down' | 'left' | 'right'> = {
  ArrowUp: 'up',
  ArrowDown: 'down',
  ArrowLeft: 'left',
  ArrowRight: 'right',
  w: 'up',
  s: 'down',
  a: 'left',
  d: 'right',
};

/* ================= 2048 ================= */
type Grid = number[];
const addTile = (g: Grid) => {
  const empty = g.map((v, i) => (v ? -1 : i)).filter(i => i >= 0);
  if (!empty.length) return g;
  const n = [...g];
  n[empty[Math.floor(Math.random() * empty.length)]] = Math.random() < 0.9 ? 2 : 4;
  return n;
};
const fresh = () => addTile(addTile(Array(16).fill(0)));
function slide(g: Grid, dir: 'up' | 'down' | 'left' | 'right') {
  let gained = 0;
  const n = Array(16).fill(0);
  for (let k = 0; k < 4; k++) {
    const idx = [0, 1, 2, 3].map(i =>
      dir === 'left'
        ? k * 4 + i
        : dir === 'right'
          ? k * 4 + 3 - i
          : dir === 'up'
            ? i * 4 + k
            : (3 - i) * 4 + k,
    );
    const vals = idx.map(i => g[i]).filter(Boolean);
    const out: number[] = [];
    for (let i = 0; i < vals.length; i++) {
      if (vals[i] === vals[i + 1]) {
        out.push(vals[i] * 2);
        gained += vals[i] * 2;
        i++;
      } else out.push(vals[i]);
    }
    idx.forEach((p, i) => (n[p] = out[i] || 0));
  }
  return { n, gained, moved: n.some((v, i) => v !== g[i]) };
}
const canMove = (g: Grid) =>
  g.includes(0) || g.some((v, i) => (i % 4 < 3 && v === g[i + 1]) || (i < 12 && v === g[i + 4]));
export function Game2048() {
  const [grid, setGrid] = useState<Grid>(() => Array(16).fill(0));
  const [score, setScore] = useState(0);
  const [best, setBest] = useBest('cs-best-2048');
  const [over, setOver] = useState(false);
  const [won, setWon] = useState(false);
  const board = useRef<HTMLDivElement>(null);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- runs once after mount (browser-only values)
    setGrid(fresh());
  }, []);
  const move = useCallback(
    (d: 'up' | 'down' | 'left' | 'right') => {
      if (over) return;
      const { n, gained, moved } = slide(grid, d);
      if (!moved) return;
      const next = addTile(n);
      const total = score + gained;
      setGrid(next);
      setScore(total);
      setBest(total);
      if (next.includes(2048)) setWon(true);
      if (!canMove(next)) setOver(true);
    },
    [grid, score, over, setBest],
  );
  useEffect(() => {
    const k = (e: KeyboardEvent) => {
      const d = KEYDIR[e.key];
      if (d && e.key.startsWith('Arrow')) {
        e.preventDefault();
        move(d);
      }
    };
    window.addEventListener('keydown', k);
    return () => window.removeEventListener('keydown', k);
  }, [move]);
  useSwipe(board, move);
  const reset = () => {
    setGrid(fresh());
    setScore(0);
    setOver(false);
    setWon(false);
  };
  return (
    <ToolShell
      title="2048"
      description="Slide the tiles with your arrow keys or by swiping. Matching numbers merge — reach the 2048 tile to win."
      faq={[
        {
          q: 'How do I play 2048?',
          a: 'Every move slides all tiles in one direction. Two tiles with the same number merge into one with their sum. A new 2 or 4 appears after each move.',
        },
        { q: 'Is my best score saved?', a: 'Yes, your best score is saved in this browser.' },
      ]}
    >
      <div className="gameWrap">
        <div className="gameBar">
          <Pill label="Score" value={score} />
          <Pill label="Best" value={best} />
        </div>
        <div className="g2048" ref={board} role="group" aria-label="2048 board">
          {grid.map((v, i) => (
            <div key={i} className={v ? `v${Math.min(v, 2048)}` : ''}>
              {v || ''}
            </div>
          ))}
        </div>
        <button className="btn btnPrimary gameBigBtn" onClick={reset}>
          New game
        </button>
        {won && !over && (
          <>
            <Confetti />
            <p className="notice winNotice">You made 2048! Keep going for a higher score.</p>
          </>
        )}
        {over && <p className="notice error">No moves left. Final score {score}.</p>}
      </div>
    </ToolShell>
  );
}

/* ================= Snake ================= */
export function SnakeGame() {
  const N = 20;
  const canvas = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [best, setBest] = useBest('cs-best-snake');
  const [state, setState] = useState<'ready' | 'play' | 'over'>('ready');
  const g = useRef({
    snake: [
      { x: 9, y: 10 },
      { x: 8, y: 10 },
    ],
    dir: { x: 1, y: 0 },
    next: { x: 1, y: 0 },
    food: { x: 14, y: 10 },
  });
  const draw = useCallback(() => {
    const c = canvas.current;
    if (!c) return;
    const x = c.getContext('2d')!;
    const s = c.width / N;
    const css = getComputedStyle(document.documentElement);
    x.clearRect(0, 0, c.width, c.height);
    x.fillStyle = css.getPropertyValue('--gold').trim() || '#e2be6a';
    x.beginPath();
    x.arc((g.current.food.x + 0.5) * s, (g.current.food.y + 0.5) * s, s * 0.38, 0, 7);
    x.fill();
    g.current.snake.forEach((p, i) => {
      x.fillStyle =
        i === 0
          ? css.getPropertyValue('--brand').trim() || '#2f4bd8'
          : css.getPropertyValue('--brand2').trim() || '#5b74f0';
      x.beginPath();
      x.roundRect(p.x * s + 1, p.y * s + 1, s - 2, s - 2, s * 0.28);
      x.fill();
    });
  }, []);
  const placeFood = () => {
    let f;
    do {
      f = { x: Math.floor(Math.random() * N), y: Math.floor(Math.random() * N) };
    } while (g.current.snake.some(p => p.x === f!.x && p.y === f!.y));
    g.current.food = f;
  };
  const turn = useCallback((d: 'up' | 'down' | 'left' | 'right') => {
    const v = { up: { x: 0, y: -1 }, down: { x: 0, y: 1 }, left: { x: -1, y: 0 }, right: { x: 1, y: 0 } }[d];
    const cur = g.current.dir;
    if (v.x === -cur.x && v.y === -cur.y) return;
    g.current.next = v;
    setState(s => (s === 'ready' ? 'play' : s));
  }, []);
  useEffect(() => {
    const c = canvas.current;
    if (c) {
      const r = Math.min(440, c.parentElement?.clientWidth || 440);
      c.width = r * 2;
      c.height = r * 2;
    }
    draw();
  }, [draw]);
  useEffect(() => {
    const k = (e: KeyboardEvent) => {
      const d = KEYDIR[e.key];
      if (d && e.key.startsWith('Arrow')) {
        e.preventDefault();
        turn(d);
      }
    };
    window.addEventListener('keydown', k);
    return () => window.removeEventListener('keydown', k);
  }, [turn]);
  useSwipe(canvas, turn);
  useEffect(() => {
    if (state !== 'play') return;
    const id = setInterval(
      () => {
        const st = g.current;
        st.dir = st.next;
        const h = { x: st.snake[0].x + st.dir.x, y: st.snake[0].y + st.dir.y };
        if (h.x < 0 || h.y < 0 || h.x >= N || h.y >= N || st.snake.some(p => p.x === h.x && p.y === h.y)) {
          setState('over');
          return;
        }
        st.snake.unshift(h);
        if (h.x === st.food.x && h.y === st.food.y) {
          const v = score + 1;
          setScore(v);
          setBest(v);
          placeFood();
        } else st.snake.pop();
        draw();
      },
      Math.max(70, 140 - score * 3),
    );
    return () => clearInterval(id);
  }, [state, score, draw, setBest]);
  const reset = () => {
    g.current = {
      snake: [
        { x: 9, y: 10 },
        { x: 8, y: 10 },
      ],
      dir: { x: 1, y: 0 },
      next: { x: 1, y: 0 },
      food: { x: 14, y: 10 },
    };
    setScore(0);
    setState('ready');
    draw();
  };
  return (
    <ToolShell
      title="Snake"
      description="Guide the snake to the gold dots. Each one makes you longer and faster — don’t hit the walls or yourself."
      faq={[
        {
          q: 'How do I control the snake?',
          a: 'Use the arrow keys, swipe on the board, or tap the on-screen buttons on a phone.',
        },
        { q: 'Does it get harder?', a: 'Yes, the snake speeds up a little every time it eats.' },
      ]}
    >
      <div className="gameWrap">
        <div className="gameBar">
          <Pill label="Score" value={score} />
          <Pill label="Best" value={best} />
          <button className="btn btnGhost" onClick={reset}>
            Restart
          </button>
        </div>
        <canvas ref={canvas} className="snakeCanvas" aria-label="Snake game board" />
        {state === 'ready' && <p className="notice">Press an arrow key or swipe to start.</p>}
        {state === 'over' && <p className="notice error">Game over — you scored {score}.</p>}
        <div className="padGrid">
          <span />
          <button aria-label="Up" onClick={() => turn('up')}>
            ▲
          </button>
          <span />
          <button aria-label="Left" onClick={() => turn('left')}>
            ◀
          </button>
          <button aria-label="Down" onClick={() => turn('down')}>
            ▼
          </button>
          <button aria-label="Right" onClick={() => turn('right')}>
            ▶
          </button>
        </div>
      </div>
    </ToolShell>
  );
}

/* ================= Memory match ================= */
const CARD_ICONS: Record<string, LucideIcon> = {
  Rocket,
  Palette,
  Document: FileText,
  Key,
  Headphones,
  Camera,
  Bolt: Zap,
  Puzzle,
  Moon,
  Gem,
  Target,
  Clover,
};
const EMOJI = Object.keys(CARD_ICONS);
const deal = (pairs: number) => {
  const d = [...EMOJI.slice(0, pairs), ...EMOJI.slice(0, pairs)];
  for (let i = d.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [d[i], d[j]] = [d[j], d[i]];
  }
  return d;
};
export function MemoryMatch() {
  const [cards, setCards] = useState<string[]>([]);
  const [open, setOpen] = useState<number[]>([]);
  const [done, setDone] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [best, setBest] = useBest('cs-best-memory');
  const lock = useRef(false);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- runs once after mount (browser-only values)
    setCards(deal(8));
  }, []);
  const flip = (i: number) => {
    if (lock.current || open.includes(i) || done.includes(i)) return;
    const o = [...open, i];
    setOpen(o);
    if (o.length !== 2) return;
    const newMoves = moves + 1;
    setMoves(newMoves);
    lock.current = true;
    const match = cards[o[0]] === cards[o[1]];
    setTimeout(
      () => {
        if (match) {
          const nd = [...done, ...o];
          setDone(nd);
          if (nd.length === cards.length) setBest(newMoves, true);
        }
        setOpen([]);
        lock.current = false;
      },
      match ? 300 : 800,
    );
  };
  const reset = () => {
    setCards(deal(8));
    setOpen([]);
    setDone([]);
    setMoves(0);
  };
  const finished = cards.length > 0 && done.length === cards.length;
  return (
    <ToolShell
      title="Memory match"
      description="Flip two cards at a time and find all eight pairs in as few moves as you can."
      faq={[
        {
          q: 'How is the best score counted?',
          a: 'Your best score is the fewest moves you have needed to clear the board, saved in this browser.',
        },
      ]}
    >
      <div className="gameWrap">
        <div className="gameBar">
          <Pill label="Moves" value={moves} />
          <Pill label="Best" value={best || '—'} />
          <button className="btn btnGhost" onClick={reset}>
            Shuffle
          </button>
        </div>
        <div className="memGrid">
          {cards.map((c, i) => (
            <button
              key={i}
              className={`memCard ${open.includes(i) ? 'open' : ''} ${done.includes(i) ? 'done' : ''}`}
              onClick={() => flip(i)}
              aria-label={open.includes(i) || done.includes(i) ? c : 'Hidden card'}
            >
              {(() => {
                const CardIcon = CARD_ICONS[c];
                return <CardIcon size={30} strokeWidth={1.8} aria-hidden="true" />;
              })()}
            </button>
          ))}
        </div>
        {finished && <p className="notice">All pairs found in {moves} moves.</p>}
      </div>
    </ToolShell>
  );
}

/* ================= Tic-tac-toe ================= */
const LINES = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];
const winner = (b: string[]) => {
  for (const l of LINES) if (b[l[0]] && b[l[0]] === b[l[1]] && b[l[0]] === b[l[2]]) return l;
  return null;
};
function bestMove(b: string[]): number {
  const minimax = (bd: string[], ai: boolean, depth: number): number => {
    const w = winner(bd);
    if (w) return bd[w[0]] === 'O' ? 10 - depth : depth - 10;
    if (bd.every(Boolean)) return 0;
    const scores = bd
      .map((v, i) => {
        if (v) return null;
        const n = [...bd];
        n[i] = ai ? 'O' : 'X';
        return minimax(n, !ai, depth + 1);
      })
      .filter((s): s is number => s !== null);
    return ai ? Math.max(...scores) : Math.min(...scores);
  };
  let best = -Infinity,
    move = -1;
  b.forEach((v, i) => {
    if (v) return;
    const n = [...b];
    n[i] = 'O';
    const s = minimax(n, false, 0) + Math.random() * 0.5;
    if (s > best) {
      best = s;
      move = i;
    }
  });
  return move;
}
export function TicTacToe() {
  const [board, setBoard] = useState<string[]>(Array(9).fill(''));
  const [xTurn, setXTurn] = useState(true);
  const [vsAi, setVsAi] = useState(true);
  const [tally, setTally] = useState({ X: 0, O: 0, draw: 0 });
  const win = winner(board);
  const full = board.every(Boolean);
  const play = (i: number) => {
    if (board[i] || win || (vsAi && !xTurn)) return;
    const n = [...board];
    n[i] = xTurn ? 'X' : 'O';
    setBoard(n);
    setXTurn(!xTurn);
    finish(n);
  };
  const finish = (n: string[]) => {
    const w = winner(n);
    if (w) setTally(t => ({ ...t, [n[w[0]]]: t[n[w[0]] as 'X' | 'O'] + 1 }));
    else if (n.every(Boolean)) setTally(t => ({ ...t, draw: t.draw + 1 }));
  };
  useEffect(() => {
    if (!vsAi || xTurn || win || full) return;
    const id = setTimeout(() => {
      const m = bestMove(board);
      if (m < 0) return;
      const n = [...board];
      n[m] = 'O';
      setBoard(n);
      setXTurn(true);
      finish(n);
    }, 380);
    return () => clearTimeout(id);
  }, [vsAi, xTurn, board, win, full]);
  const reset = () => {
    setBoard(Array(9).fill(''));
    setXTurn(true);
  };
  const status = win
    ? `${board[win[0]]} wins!`
    : full
      ? 'It’s a draw.'
      : vsAi
        ? xTurn
          ? 'Your turn (X)'
          : 'Computer is thinking…'
        : `${xTurn ? 'X' : 'O'} to play`;
  return (
    <ToolShell
      title="Tic-Tac-Toe"
      description="Get three in a row before your opponent. Play a friend on the same device or try to beat the computer."
      faq={[
        {
          q: 'Can I beat the computer?',
          a: 'The computer plays very well, so the best result against it is usually a draw — but it can slip up.',
        },
        { q: 'Can two people play?', a: 'Yes. Switch to “Two players” and take turns on the same device.' },
      ]}
    >
      <div className="gameWrap">
        <div className="gameBar">
          <button
            className={`btn ${vsAi ? 'btnPrimary' : 'btnGhost'}`}
            onClick={() => {
              setVsAi(true);
              reset();
            }}
          >
            Vs computer
          </button>
          <button
            className={`btn ${!vsAi ? 'btnPrimary' : 'btnGhost'}`}
            onClick={() => {
              setVsAi(false);
              reset();
            }}
          >
            Two players
          </button>
        </div>
        <div className="gameBar">
          <Pill label="X" value={tally.X} />
          <Pill label="O" value={tally.O} />
          <Pill label="Draws" value={tally.draw} />
        </div>
        <p style={{ fontWeight: 800, margin: 0 }} aria-live="polite">
          {status}
        </p>
        <div className="tttGrid">
          {board.map((v, i) => (
            <button
              key={i}
              className={`${v === 'O' ? 'o' : ''} ${win?.includes(i) ? 'win' : ''}`}
              onClick={() => play(i)}
              aria-label={`Square ${i + 1}${v ? ` ${v}` : ''}`}
            >
              {v}
            </button>
          ))}
        </div>
        <button className="btn btnGhost" onClick={reset}>
          New round
        </button>
      </div>
    </ToolShell>
  );
}

/* ================= Typing speed test ================= */
const PASSAGES = [
  'The quick brown fox jumps over the lazy dog while the busy bees hum in the warm summer garden.',
  'Good tools save time because they remove small steps that people repeat every single day at work.',
  'Practice a little every day and your typing speed will grow faster than you expect over a few weeks.',
  'A clear plan, a quiet room and a cup of tea can turn a long list of tasks into a calm afternoon.',
  'Every great website starts with a simple idea, a few honest pages and a lot of careful small fixes.',
];
export function TypingSpeedTest() {
  const [target, setTarget] = useState(PASSAGES[0]);
  const [typed, setTyped] = useState('');
  const [start, setStart] = useState<number | null>(null);
  const [end, setEnd] = useState<number | null>(null);
  const [now, setNow] = useState(0);
  const [best, setBest] = useBest('cs-best-wpm');
  const input = useRef<HTMLTextAreaElement>(null);
  useEffect(() => {
    if (!start || end) return;
    const id = setInterval(() => setNow(Date.now()), 200);
    return () => clearInterval(id);
  }, [start, end]);
  const elapsed = ((end ?? (start ? now : 0)) - (start ?? 0)) / 60000;
  const correct = [...typed].filter((c, i) => c === target[i]).length;
  const wpm = elapsed > 0 ? Math.round(correct / 5 / elapsed) : 0;
  const acc = typed.length ? Math.round((correct / typed.length) * 100) : 100;
  const onType = (v: string) => {
    if (end) return;
    if (!start && v) setStart(Date.now());
    const val = v.slice(0, target.length);
    setTyped(val);
    if (val.length === target.length) {
      const t = Date.now();
      setEnd(t);
      const mins = (t - (start ?? t)) / 60000;
      const c = [...val].filter((ch, i) => ch === target[i]).length;
      if (mins > 0) setBest(Math.round(c / 5 / mins));
    }
  };
  const reset = () => {
    setTarget(PASSAGES[Math.floor(Math.random() * PASSAGES.length)]);
    setTyped('');
    setStart(null);
    setEnd(null);
    setTimeout(() => input.current?.focus(), 0);
  };
  return (
    <ToolShell
      title="Typing speed test"
      description="Type the passage as fast and accurately as you can. See your words per minute and accuracy the moment you finish."
      faq={[
        {
          q: 'How is WPM calculated?',
          a: 'Correct characters are divided by five (a standard word) and then by the minutes taken.',
        },
        {
          q: 'What is a good typing speed?',
          a: 'Around 40 WPM is average; 60+ WPM is fast; 80+ WPM is excellent.',
        },
      ]}
    >
      <div className="gameWrap">
        <div className="gameBar">
          <Pill label="WPM" value={wpm} />
          <Pill label="Accuracy" value={`${acc}%`} />
          <Pill label="Best" value={best ? `${best} WPM` : '—'} />
          <button className="btn btnGhost" onClick={reset}>
            New passage
          </button>
        </div>
        <div className="typeText" aria-hidden="true">
          {[...target].map((c, i) => (
            <span
              key={i}
              className={i < typed.length ? (typed[i] === c ? 'ok' : 'bad') : i === typed.length ? 'cur' : ''}
            >
              {c}
            </span>
          ))}
        </div>
        <textarea
          ref={input}
          className="typeText"
          style={{ minHeight: 110, fontSize: 18 }}
          value={typed}
          onChange={e => onType(e.target.value)}
          placeholder="Start typing here — the timer begins with your first key"
          aria-label="Type the passage here"
          disabled={!!end}
          spellCheck={false}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
        />
        {end && (
          <p className="notice">
            Finished: {wpm} WPM at {acc}% accuracy.
          </p>
        )}
      </div>
    </ToolShell>
  );
}

/* ================= Minesweeper ================= */
type Cell = { mine: boolean; open: boolean; flag: boolean; n: number };
const LEVELS = {
  easy: { w: 9, h: 9, m: 10 },
  medium: { w: 12, h: 12, m: 24 },
  hard: { w: 16, h: 16, m: 40 },
};
const blankBoard = (l: keyof typeof LEVELS): Cell[] =>
  Array.from({ length: LEVELS[l].w * LEVELS[l].h }, () => ({ mine: false, open: false, flag: false, n: 0 }));
function neighbours(i: number, w: number, h: number) {
  const x = i % w,
    y = Math.floor(i / w),
    out: number[] = [];
  for (let dy = -1; dy <= 1; dy++)
    for (let dx = -1; dx <= 1; dx++) {
      if (!dx && !dy) continue;
      const nx = x + dx,
        ny = y + dy;
      if (nx >= 0 && ny >= 0 && nx < w && ny < h) out.push(ny * w + nx);
    }
  return out;
}
function plantMines(b: Cell[], safe: Set<number>, count: number, w: number, h: number) {
  let placed = 0;
  while (placed < count) {
    const r = Math.floor(Math.random() * b.length);
    if (!b[r].mine && !safe.has(r)) {
      b[r].mine = true;
      placed++;
    }
  }
  b.forEach((c, k) => {
    c.n = neighbours(k, w, h).filter(j => b[j].mine).length;
  });
}
export function Minesweeper() {
  const [level, setLevel] = useState<keyof typeof LEVELS>('easy');
  const L = LEVELS[level];
  const [cells, setCells] = useState<Cell[]>(() => blankBoard('easy'));
  const [state, setState] = useState<'ready' | 'play' | 'won' | 'lost'>('ready');
  const [time, setTime] = useState(0);
  const [best, setBest] = useBest(`cs-best-mines-${level}`);
  const newGame = (l: keyof typeof LEVELS) => {
    setLevel(l);
    setCells(blankBoard(l));
    setState('ready');
    setTime(0);
  };
  useEffect(() => {
    if (state !== 'play') return;
    const id = setInterval(() => setTime(t => t + 1), 1000);
    return () => clearInterval(id);
  }, [state]);
  const nb = (i: number) => neighbours(i, L.w, L.h);
  const open = (i: number) => {
    if (state === 'won' || state === 'lost') return;
    let b = cells.map(c => ({ ...c }));
    if (state === 'ready') {
      plantMines(b, new Set([i, ...nb(i)]), L.m, L.w, L.h);
      setState('play');
    }
    if (b[i].flag || b[i].open) return;
    if (b[i].mine) {
      b = b.map(c => (c.mine ? { ...c, open: true } : c));
      setCells(b);
      setState('lost');
      return;
    }
    const stack = [i];
    while (stack.length) {
      const k = stack.pop()!;
      if (b[k].open || b[k].flag) continue;
      b[k].open = true;
      if (b[k].n === 0)
        nb(k).forEach(j => {
          if (!b[j].open && !b[j].mine) stack.push(j);
        });
    }
    setCells(b);
    if (b.every(c => c.mine || c.open)) {
      setState('won');
      setBest(time || 1, true);
    }
  };
  const flag = (e: React.MouseEvent | null, i: number) => {
    e?.preventDefault();
    if (state !== 'play' || cells[i].open) return;
    setCells(cs => cs.map((c, k) => (k === i ? { ...c, flag: !c.flag } : c)));
  };
  const press = useRef<number | null>(null);
  const longPressed = useRef(false);
  const flags = cells.filter(c => c.flag).length;
  return (
    <ToolShell
      title="Minesweeper"
      description="Open every square that isn’t a mine. Numbers show how many mines touch a square. Right-click or long-press to place a flag."
      faq={[
        {
          q: 'How do I flag a mine on a phone?',
          a: 'Press and hold a square for half a second to place or remove a flag.',
        },
        {
          q: 'Can I hit a mine on my first click?',
          a: 'No. Mines are placed after your first click, and never on or next to that square.',
        },
      ]}
    >
      <div className="gameWrap">
        <div className="gameBar">
          {(Object.keys(LEVELS) as (keyof typeof LEVELS)[]).map(l => (
            <button
              key={l}
              className={`btn ${level === l ? 'btnPrimary' : 'btnGhost'}`}
              onClick={() => newGame(l)}
            >
              {l[0].toUpperCase() + l.slice(1)}
            </button>
          ))}
        </div>
        <div className="gameBar">
          <Pill label="Mines" value={L.m - flags} />
          <Pill label="Time" value={`${time}s`} />
          <Pill label="Best" value={best ? `${best}s` : '—'} />
          <button className="btn btnGhost" onClick={() => newGame(level)}>
            New game
          </button>
        </div>
        <div className="mineGrid" style={{ gridTemplateColumns: `repeat(${L.w},1fr)` }}>
          {cells.map((c, i) => (
            <button
              key={i}
              className={`${c.open ? 'open' : ''} ${c.open && c.mine ? 'boom' : ''} ${c.open && c.n ? `n${Math.min(c.n, 5)}` : ''}`}
              onClick={() => {
                if (longPressed.current) {
                  longPressed.current = false;
                  return;
                }
                open(i);
              }}
              onContextMenu={e => flag(e, i)}
              onTouchStart={() => {
                longPressed.current = false;
                press.current = window.setTimeout(() => {
                  longPressed.current = true;
                  flag(null, i);
                }, 450);
              }}
              onTouchEnd={() => {
                if (press.current) clearTimeout(press.current);
              }}
              aria-label={
                c.open ? (c.mine ? 'Mine' : c.n ? `${c.n}` : 'Empty') : c.flag ? 'Flagged' : 'Hidden'
              }
            >
              {c.open ? (
                c.mine ? (
                  <Bomb size={16} aria-label="Mine" />
                ) : (
                  c.n || ''
                )
              ) : c.flag ? (
                <Flag size={15} aria-label="Flag" />
              ) : (
                ''
              )}
            </button>
          ))}
        </div>
        {state === 'won' && <p className="notice">Board cleared in {time} seconds.</p>}
        {state === 'lost' && <p className="notice error">Boom — you hit a mine. Try again.</p>}
      </div>
    </ToolShell>
  );
}
