'use client';
/**
 * Arcade games batch 1: Block Stack, Brick Breaker, Space Defender, Sky Hopper, Whack-a-Mole, Sudoku.
 * All run in the browser, support keyboard + touch, remember the best score on this device.
 */
import { useCallback, useEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, ArrowDown, RotateCw, Pause, Play, Delete } from 'lucide-react';
import ToolShell from '@/components/shared/ToolShell';

/* ---------- shared helpers ---------- */
function useBestScore(key: string, lowerIsBetter = false) {
  const [best, setBest] = useState<number | null>(null);
  useEffect(() => {
    try {
      const v = localStorage.getItem(key);
      // eslint-disable-next-line react-hooks/set-state-in-effect -- read saved score once in the browser
      if (v !== null) setBest(Number(v));
    } catch {}
  }, [key]);
  const submit = useCallback(
    (score: number) => {
      setBest(prev => {
        const better = prev === null || (lowerIsBetter ? score < prev : score > prev);
        if (!better) return prev;
        try {
          localStorage.setItem(key, String(score));
        } catch {}
        return score;
      });
    },
    [key, lowerIsBetter],
  );
  return [best, submit] as const;
}
const Stat = ({ label, value }: { label: string; value: string | number }) => (
  <div className="scorePill">
    <span>{label}</span>
    {value}
  </div>
);
function useLoop(running: boolean, step: (dt: number) => void) {
  const stepRef = useRef(step);
  useEffect(() => {
    stepRef.current = step;
  });
  useEffect(() => {
    if (!running) return;
    let raf = 0;
    let last = performance.now();
    const tick = (t: number) => {
      const dt = Math.min(50, t - last);
      last = t;
      stepRef.current(dt);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [running]);
}
const cssVar = (name: string, fallback: string) =>
  typeof window === 'undefined'
    ? fallback
    : getComputedStyle(document.documentElement).getPropertyValue(name).trim() || fallback;

/* ======================= Block Stack (falling blocks) ======================= */
const W = 10;
const H = 20;
const SHAPES: number[][][] = [
  [[1, 1, 1, 1]],
  [
    [1, 1],
    [1, 1],
  ],
  [
    [0, 1, 0],
    [1, 1, 1],
  ],
  [
    [1, 0, 0],
    [1, 1, 1],
  ],
  [
    [0, 0, 1],
    [1, 1, 1],
  ],
  [
    [1, 1, 0],
    [0, 1, 1],
  ],
  [
    [0, 1, 1],
    [1, 1, 0],
  ],
];
const COLORS = ['#22d3ee', '#facc15', '#0ea5e9', '#3b82f6', '#f97316', '#ef4444', '#22c55e'];
type Piece = { s: number[][]; x: number; y: number; c: number };
const rotate = (s: number[][]) => s[0].map((_, i) => s.map(r => r[i]).reverse());
const newPiece = (): Piece => {
  const c = Math.floor(Math.random() * SHAPES.length);
  const s = SHAPES[c];
  return { s, x: Math.floor((W - s[0].length) / 2), y: 0, c };
};
const fits = (b: number[][], p: Piece) =>
  p.s.every((row, dy) =>
    row.every(
      (v, dx) =>
        !v || (p.y + dy >= 0 && p.y + dy < H && p.x + dx >= 0 && p.x + dx < W && !b[p.y + dy][p.x + dx]),
    ),
  );

export function BlockStack() {
  const empty = () => Array.from({ length: H }, () => Array(W).fill(0));
  const [board, setBoard] = useState<number[][]>(empty);
  const [piece, setPiece] = useState<Piece>(() => ({ s: SHAPES[0], x: 3, y: 0, c: 0 }));
  const [score, setScore] = useState(0);
  const [lines, setLines] = useState(0);
  const [state, setState] = useState<'ready' | 'play' | 'pause' | 'over'>('ready');
  const [best, submit] = useBestScore('cs-best-blockstack');
  const acc = useRef(0);
  const level = Math.floor(lines / 10);
  const speed = Math.max(90, 650 - level * 55);

  const lock = useCallback(
    (p: Piece) => {
      const b = board.map(r => [...r]);
      p.s.forEach((row, dy) => row.forEach((v, dx) => v && (b[p.y + dy][p.x + dx] = p.c + 1)));
      const kept = b.filter(r => r.some(v => !v));
      const cleared = H - kept.length;
      while (kept.length < H) kept.unshift(Array(W).fill(0));
      setBoard(kept);
      if (cleared) {
        setLines(l => l + cleared);
        setScore(s => s + [0, 100, 300, 500, 800][cleared] * (level + 1));
      }
      const next = newPiece();
      if (!fits(kept, next)) {
        setState('over');
        submit(score + (cleared ? [0, 100, 300, 500, 800][cleared] * (level + 1) : 0));
      } else setPiece(next);
    },
    [board, level, score, submit],
  );
  const move = useCallback(
    (dx: number, dy: number, rot = false) => {
      if (state !== 'play') return;
      const p = { ...piece, x: piece.x + dx, y: piece.y + dy, s: rot ? rotate(piece.s) : piece.s };
      if (fits(board, p)) setPiece(p);
      else if (rot) {
        for (const k of [-1, 1, -2, 2]) {
          const q = { ...p, x: p.x + k };
          if (fits(board, q)) return setPiece(q);
        }
      } else if (dy > 0) lock(piece);
    },
    [state, piece, board, lock],
  );
  const drop = () => {
    if (state !== 'play') return;
    let p = piece;
    while (fits(board, { ...p, y: p.y + 1 })) p = { ...p, y: p.y + 1 };
    setScore(s => s + 2);
    lock(p);
  };
  useLoop(state === 'play', dt => {
    acc.current += dt;
    if (acc.current >= speed) {
      acc.current = 0;
      move(0, 1);
    }
  });
  useEffect(() => {
    const k = (e: KeyboardEvent) => {
      const map: Record<string, () => void> = {
        ArrowLeft: () => move(-1, 0),
        ArrowRight: () => move(1, 0),
        ArrowDown: () => move(0, 1),
        ArrowUp: () => move(0, 0, true),
        ' ': drop,
        p: () => setState(s => (s === 'play' ? 'pause' : s === 'pause' ? 'play' : s)),
      };
      if (map[e.key] && state !== 'ready') {
        e.preventDefault();
        map[e.key]();
      }
    };
    window.addEventListener('keydown', k);
    return () => window.removeEventListener('keydown', k);
  });
  const start = () => {
    setBoard(empty());
    setPiece(newPiece());
    setScore(0);
    setLines(0);
    acc.current = 0;
    setState('play');
  };
  const cells = board.map(r => [...r]);
  if (state !== 'ready')
    piece.s.forEach((row, dy) =>
      row.forEach((v, dx) => {
        if (v && cells[piece.y + dy]) cells[piece.y + dy][piece.x + dx] = piece.c + 1;
      }),
    );
  return (
    <ToolShell
      title="Block Stack"
      description="Rotate and drop falling blocks to clear full lines. Speeds up every 10 lines."
      faq={[
        {
          q: 'How do I play?',
          a: 'Left/right arrows move, up rotates, down drops faster, space drops instantly, P pauses. On phones use the buttons.',
        },
        {
          q: 'How is the score counted?',
          a: 'Clearing 1, 2, 3 or 4 lines at once gives 100, 300, 500 or 800 points, multiplied by the level.',
        },
      ]}
    >
      <div className="gameWrap">
        <div className="gameBar">
          <Stat label="Score" value={score} />
          <Stat label="Lines" value={lines} />
          <Stat label="Best" value={best ?? 0} />
        </div>
        <div className="bsBoard" role="group" aria-label="Block Stack board">
          {cells.flat().map((v, i) => (
            <span key={i} style={v ? { background: COLORS[v - 1] } : undefined} className={v ? 'on' : ''} />
          ))}
          {state !== 'play' && (
            <div className="gameOverlay">
              <b>{state === 'over' ? 'Game over' : state === 'pause' ? 'Paused' : 'Block Stack'}</b>
              {state === 'over' && <small>Score {score}</small>}
              <button className="btn btnPrimary" onClick={state === 'pause' ? () => setState('play') : start}>
                {state === 'pause' ? 'Resume' : state === 'over' ? 'Play again' : 'Start'}
              </button>
            </div>
          )}
        </div>
        <div className="padRow">
          <button aria-label="Move left" onClick={() => move(-1, 0)}>
            <ArrowLeft />
          </button>
          <button aria-label="Rotate" onClick={() => move(0, 0, true)}>
            <RotateCw />
          </button>
          <button aria-label="Move down" onClick={() => move(0, 1)}>
            <ArrowDown />
          </button>
          <button aria-label="Move right" onClick={() => move(1, 0)}>
            <ArrowRight />
          </button>
          <button aria-label="Drop" onClick={drop}>
            Drop
          </button>
          <button
            aria-label={state === 'pause' ? 'Resume' : 'Pause'}
            onClick={() => setState(s => (s === 'play' ? 'pause' : s === 'pause' ? 'play' : s))}
          >
            {state === 'pause' ? <Play /> : <Pause />}
          </button>
        </div>
      </div>
    </ToolShell>
  );
}

/* ======================= Canvas games base ======================= */
type CanvasGame = {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  w: number;
  h: number;
};
function useCanvas(width: number, height: number) {
  const ref = useRef<HTMLCanvasElement>(null);
  const get = useCallback((): CanvasGame | null => {
    const canvas = ref.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return null;
    return { canvas, ctx, w: width, h: height };
  }, [width, height]);
  return [ref, get] as const;
}
/** Pointer x position (0..width) inside a canvas, for drag/touch control. */
const pointerX = (e: React.PointerEvent<HTMLCanvasElement>, w: number) => {
  const r = e.currentTarget.getBoundingClientRect();
  return ((e.clientX - r.left) / r.width) * w;
};

/* ======================= Brick Breaker ======================= */
export function BrickBreaker() {
  const CW = 480;
  const CH = 560;
  const [ref, get] = useCanvas(CW, CH);
  const [state, setState] = useState<'ready' | 'play' | 'over' | 'won'>('ready');
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [best, submit] = useBestScore('cs-best-brickbreaker');
  const g = useRef({
    px: CW / 2,
    bx: CW / 2,
    by: CH - 60,
    vx: 3,
    vy: -4,
    bricks: [] as { x: number; y: number; alive: boolean; c: string }[],
    keys: { l: false, r: false },
  });

  const reset = () => {
    const bricks = [];
    const colors = ['#f472b6', '#60a5fa', '#60a5fa', '#34d399', '#facc15', '#fb923c'];
    for (let r = 0; r < 6; r++)
      for (let c = 0; c < 8; c++) bricks.push({ x: 12 + c * 57, y: 60 + r * 26, alive: true, c: colors[r] });
    g.current = { px: CW / 2, bx: CW / 2, by: CH - 60, vx: 3, vy: -4, bricks, keys: { l: false, r: false } };
    setScore(0);
    setLives(3);
    setState('play');
  };
  const draw = useCallback(() => {
    const c = get();
    if (!c) return;
    const { ctx } = c;
    const s = g.current;
    ctx.clearRect(0, 0, CW, CH);
    s.bricks.forEach(b => {
      if (!b.alive) return;
      ctx.fillStyle = b.c;
      ctx.beginPath();
      ctx.roundRect(b.x, b.y, 51, 20, 5);
      ctx.fill();
    });
    ctx.fillStyle = cssVar('--brand', '#3b82f6');
    ctx.beginPath();
    ctx.roundRect(s.px - 45, CH - 30, 90, 12, 6);
    ctx.fill();
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.arc(s.bx, s.by, 8, 0, Math.PI * 2);
    ctx.fill();
  }, [get]);
  useEffect(() => {
    if (!g.current.bricks.length) {
      reset();
      setState('ready');
    }
    draw();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useLoop(state === 'play', dt => {
    const s = g.current;
    const f = dt / 16.7;
    if (s.keys.l) s.px -= 7 * f;
    if (s.keys.r) s.px += 7 * f;
    s.px = Math.max(45, Math.min(CW - 45, s.px));
    s.bx += s.vx * f;
    s.by += s.vy * f;
    if (s.bx < 8 || s.bx > CW - 8) s.vx *= -1;
    if (s.by < 8) s.vy = Math.abs(s.vy);
    if (s.by > CH - 38 && s.by < CH - 18 && Math.abs(s.bx - s.px) < 50 && s.vy > 0) {
      s.vy = -Math.abs(s.vy) * 1.02;
      s.vx = ((s.bx - s.px) / 45) * 5;
    }
    for (const b of s.bricks) {
      if (b.alive && s.bx > b.x - 6 && s.bx < b.x + 57 && s.by > b.y - 6 && s.by < b.y + 26) {
        // eslint-disable-next-line react-hooks/immutability -- game state lives in a ref and is updated every animation frame
        b.alive = false;
        s.vy *= -1;
        setScore(v => v + 10);
        break;
      }
    }
    if (s.bricks.every(b => !b.alive)) {
      setState('won');
      setScore(v => {
        submit(v);
        return v;
      });
    }
    if (s.by > CH + 10) {
      setLives(l => {
        if (l <= 1) {
          setState('over');
          setScore(v => {
            submit(v);
            return v;
          });
          return 0;
        }
        s.bx = s.px;
        s.by = CH - 60;
        s.vx = 3;
        s.vy = -4;
        return l - 1;
      });
    }
    draw();
  });
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') g.current.keys.l = e.type === 'keydown';
      if (e.key === 'ArrowRight') g.current.keys.r = e.type === 'keydown';
    };
    window.addEventListener('keydown', down);
    window.addEventListener('keyup', down);
    return () => {
      window.removeEventListener('keydown', down);
      window.removeEventListener('keyup', down);
    };
  }, []);
  return (
    <ToolShell
      title="Brick Breaker"
      description="Bounce the ball off your paddle and break every brick. Three lives, keyboard or touch."
      faq={[
        {
          q: 'How do I control the paddle?',
          a: 'Use the left and right arrow keys, or drag your finger or mouse across the game.',
        },
      ]}
    >
      <div className="gameWrap">
        <div className="gameBar">
          <Stat label="Score" value={score} />
          <Stat label="Lives" value={lives} />
          <Stat label="Best" value={best ?? 0} />
        </div>
        <div className="canvasWrap">
          <canvas
            ref={ref}
            width={CW}
            height={CH}
            className="gameCanvas"
            aria-label="Brick Breaker game"
            onPointerMove={e => (g.current.px = pointerX(e, CW))}
            onPointerDown={e => (g.current.px = pointerX(e, CW))}
          />
          {state !== 'play' && (
            <div className="gameOverlay">
              <b>{state === 'won' ? 'You cleared it!' : state === 'over' ? 'Game over' : 'Brick Breaker'}</b>
              {state !== 'ready' && <small>Score {score}</small>}
              <button className="btn btnPrimary" onClick={reset}>
                {state === 'ready' ? 'Start' : 'Play again'}
              </button>
            </div>
          )}
        </div>
      </div>
    </ToolShell>
  );
}

/* ======================= Space Defender ======================= */
export function SpaceDefender() {
  const CW = 480;
  const CH = 600;
  const [ref, get] = useCanvas(CW, CH);
  const [state, setState] = useState<'ready' | 'play' | 'over'>('ready');
  const [score, setScore] = useState(0);
  const [best, submit] = useBestScore('cs-best-spacedefender');
  const g = useRef({
    x: CW / 2,
    shots: [] as { x: number; y: number }[],
    foes: [] as { x: number; y: number; v: number }[],
    t: 0,
    spawn: 0,
    keys: { l: false, r: false },
    score: 0,
  });
  const reset = () => {
    g.current = { x: CW / 2, shots: [], foes: [], t: 0, spawn: 0, keys: { l: false, r: false }, score: 0 };
    setScore(0);
    setState('play');
  };
  const draw = useCallback(() => {
    const c = get();
    if (!c) return;
    const { ctx } = c;
    const s = g.current;
    ctx.clearRect(0, 0, CW, CH);
    ctx.fillStyle = 'rgba(255,255,255,0.5)';
    for (let i = 0; i < 40; i++) ctx.fillRect((i * 97) % CW, (i * 53 + s.t / 8) % CH, 2, 2);
    ctx.fillStyle = '#22d3ee';
    ctx.beginPath();
    ctx.moveTo(s.x, CH - 60);
    ctx.lineTo(s.x - 20, CH - 24);
    ctx.lineTo(s.x + 20, CH - 24);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = '#fde047';
    s.shots.forEach(b => ctx.fillRect(b.x - 2, b.y - 10, 4, 12));
    ctx.fillStyle = '#f472b6';
    s.foes.forEach(f => {
      ctx.beginPath();
      ctx.roundRect(f.x - 16, f.y - 12, 32, 24, 8);
      ctx.fill();
    });
  }, [get]);
  useEffect(() => {
    draw();
  }, [draw]);
  useLoop(state === 'play', dt => {
    const s = g.current;
    const f = dt / 16.7;
    s.t += dt;
    if (s.keys.l) s.x -= 7 * f;
    if (s.keys.r) s.x += 7 * f;
    s.x = Math.max(20, Math.min(CW - 20, s.x));
    if (Math.floor(s.t / 260) !== Math.floor((s.t - dt) / 260)) s.shots.push({ x: s.x, y: CH - 62 });
    s.spawn -= dt;
    if (s.spawn <= 0) {
      s.foes.push({
        x: 20 + Math.random() * (CW - 40),
        y: -20,
        v: 1.4 + Math.random() * 1.2 + s.score / 400,
      });
      s.spawn = Math.max(260, 900 - s.score * 2);
    }
    s.shots.forEach(b => (b.y -= 9 * f));
    s.foes.forEach(e => (e.y += e.v * f));
    for (const e of s.foes)
      for (const b of s.shots)
        if (Math.abs(b.x - e.x) < 18 && Math.abs(b.y - e.y) < 16) {
          // eslint-disable-next-line react-hooks/immutability -- game state lives in a ref and is updated every animation frame
          e.y = CH + 100;
          b.y = -100;
          s.score += 10;
          setScore(s.score);
        }
    s.shots = s.shots.filter(b => b.y > -20);
    if (s.foes.some(e => e.y > CH - 40 && e.y < CH + 50)) {
      setState('over');
      submit(s.score);
    }
    s.foes = s.foes.filter(e => e.y < CH + 50);
    draw();
  });
  useEffect(() => {
    const k = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') g.current.keys.l = e.type === 'keydown';
      if (e.key === 'ArrowRight') g.current.keys.r = e.type === 'keydown';
    };
    window.addEventListener('keydown', k);
    window.addEventListener('keyup', k);
    return () => {
      window.removeEventListener('keydown', k);
      window.removeEventListener('keyup', k);
    };
  }, []);
  return (
    <ToolShell
      title="Space Defender"
      description="Your ship fires automatically — move left and right to shoot the invaders before they reach you."
      faq={[
        {
          q: 'How do I play?',
          a: 'Move with the arrow keys, or drag across the game on a phone. Your ship shoots on its own. If an invader reaches the bottom, the game ends.',
        },
      ]}
    >
      <div className="gameWrap">
        <div className="gameBar">
          <Stat label="Score" value={score} />
          <Stat label="Best" value={best ?? 0} />
        </div>
        <div className="canvasWrap">
          <canvas
            ref={ref}
            width={CW}
            height={CH}
            className="gameCanvas space"
            aria-label="Space Defender game"
            onPointerMove={e => (g.current.x = pointerX(e, CW))}
            onPointerDown={e => (g.current.x = pointerX(e, CW))}
          />
          {state !== 'play' && (
            <div className="gameOverlay">
              <b>{state === 'over' ? 'Game over' : 'Space Defender'}</b>
              {state === 'over' && <small>Score {score}</small>}
              <button className="btn btnPrimary" onClick={reset}>
                {state === 'ready' ? 'Start' : 'Play again'}
              </button>
            </div>
          )}
        </div>
      </div>
    </ToolShell>
  );
}

/* ======================= Sky Hopper ======================= */
export function SkyHopper() {
  const CW = 420;
  const CH = 600;
  const [ref, get] = useCanvas(CW, CH);
  const [state, setState] = useState<'ready' | 'play' | 'over'>('ready');
  const [score, setScore] = useState(0);
  const [best, submit] = useBestScore('cs-best-skyhopper');
  const g = useRef({ y: CH / 2, v: 0, pipes: [] as { x: number; gap: number; passed: boolean }[], score: 0 });
  const reset = () => {
    g.current = { y: CH / 2, v: 0, pipes: [{ x: CW + 40, gap: 260, passed: false }], score: 0 };
    setScore(0);
    setState('play');
  };
  const flap = () => {
    if (state === 'play') g.current.v = -7.5;
  };
  const draw = useCallback(() => {
    const c = get();
    if (!c) return;
    const { ctx } = c;
    const s = g.current;
    ctx.clearRect(0, 0, CW, CH);
    ctx.fillStyle = '#34d399';
    s.pipes.forEach(p => {
      ctx.beginPath();
      ctx.roundRect(p.x, -10, 60, p.gap - 80, 10);
      ctx.roundRect(p.x, p.gap + 80, 60, CH, 10);
      ctx.fill();
    });
    ctx.fillStyle = '#facc15';
    ctx.beginPath();
    ctx.arc(90, s.y, 15, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#111';
    ctx.beginPath();
    ctx.arc(96, s.y - 4, 3, 0, Math.PI * 2);
    ctx.fill();
  }, [get]);
  useEffect(() => {
    draw();
  }, [draw]);
  useLoop(state === 'play', dt => {
    const s = g.current;
    const f = dt / 16.7;
    s.v += 0.42 * f;
    s.y += s.v * f;
    s.pipes.forEach(p => (p.x -= 2.6 * f));
    const last = s.pipes[s.pipes.length - 1];
    if (last.x < CW - 220) s.pipes.push({ x: CW + 20, gap: 140 + Math.random() * (CH - 280), passed: false });
    s.pipes = s.pipes.filter(p => p.x > -70);
    for (const p of s.pipes) {
      if (!p.passed && p.x + 60 < 75) {
        // eslint-disable-next-line react-hooks/immutability -- game state lives in a ref and is updated every animation frame
        p.passed = true;
        s.score += 1;
        setScore(s.score);
      }
      if (p.x < 105 && p.x + 60 > 75 && (s.y - 15 < p.gap - 80 || s.y + 15 > p.gap + 80)) {
        setState('over');
        submit(s.score);
      }
    }
    if (s.y > CH - 15 || s.y < 15) {
      setState('over');
      submit(s.score);
    }
    draw();
  });
  useEffect(() => {
    const k = (e: KeyboardEvent) => {
      if (e.key === ' ' || e.key === 'ArrowUp') {
        e.preventDefault();
        if (state === 'play') g.current.v = -7.5;
      }
    };
    window.addEventListener('keydown', k);
    return () => window.removeEventListener('keydown', k);
  }, [state]);
  return (
    <ToolShell
      title="Sky Hopper"
      description="Tap or press space to hop through the gaps. One point for every gap you pass."
      faq={[
        {
          q: 'How do I play?',
          a: 'Tap the game (or press space / up arrow) to hop. Do not touch the green columns, the top or the bottom.',
        },
      ]}
    >
      <div className="gameWrap">
        <div className="gameBar">
          <Stat label="Score" value={score} />
          <Stat label="Best" value={best ?? 0} />
        </div>
        <div className="canvasWrap">
          <canvas
            ref={ref}
            width={CW}
            height={CH}
            className="gameCanvas sky"
            aria-label="Sky Hopper game"
            onPointerDown={flap}
          />
          {state !== 'play' && (
            <div className="gameOverlay">
              <b>{state === 'over' ? 'Game over' : 'Sky Hopper'}</b>
              {state === 'over' && <small>Score {score}</small>}
              <button className="btn btnPrimary" onClick={reset}>
                {state === 'ready' ? 'Start' : 'Play again'}
              </button>
            </div>
          )}
        </div>
      </div>
    </ToolShell>
  );
}

/* ======================= Whack-a-Mole ======================= */
export function WhackAMole() {
  const [holes, setHoles] = useState<boolean[]>(Array(9).fill(false));
  const [score, setScore] = useState(0);
  const [time, setTime] = useState(30);
  const [state, setState] = useState<'ready' | 'play' | 'over'>('ready');
  const [best, submit] = useBestScore('cs-best-whackamole');
  const scoreRef = useRef(0);
  useEffect(() => {
    if (state !== 'play') return;
    const pop = setInterval(() => {
      setHoles(() => {
        const next = Array(9).fill(false);
        next[Math.floor(Math.random() * 9)] = true;
        if (Math.random() < 0.35) next[Math.floor(Math.random() * 9)] = true;
        return next;
      });
    }, 750);
    const clock = setInterval(() => {
      setTime(t => {
        if (t <= 1) {
          setState('over');
          setHoles(Array(9).fill(false));
          submit(scoreRef.current);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => {
      clearInterval(pop);
      clearInterval(clock);
    };
  }, [state, submit]);
  const start = () => {
    scoreRef.current = 0;
    setScore(0);
    setTime(30);
    setState('play');
  };
  const hit = (i: number) => {
    if (state !== 'play' || !holes[i]) return;
    scoreRef.current += 1;
    setScore(scoreRef.current);
    setHoles(h => h.map((v, j) => (j === i ? false : v)));
  };
  return (
    <ToolShell
      title="Whack-a-Mole"
      description="Tap the moles as they pop up. You have 30 seconds — how many can you hit?"
      faq={[
        {
          q: 'How do I play?',
          a: 'Tap or click a mole when it appears. Each hit is one point. The round lasts 30 seconds.',
        },
      ]}
    >
      <div className="gameWrap">
        <div className="gameBar">
          <Stat label="Score" value={score} />
          <Stat label="Time" value={`${time}s`} />
          <Stat label="Best" value={best ?? 0} />
        </div>
        <div className="moleGrid" role="group" aria-label="Whack-a-Mole board">
          {holes.map((up, i) => (
            <button
              key={i}
              className={`moleHole ${up ? 'up' : ''}`}
              onClick={() => hit(i)}
              aria-label={up ? 'Mole — hit it' : 'Empty hole'}
            >
              <span className="mole" />
            </button>
          ))}
        </div>
        {state !== 'play' && (
          <button className="btn btnPrimary gameBigBtn" onClick={start}>
            {state === 'over' ? `Score ${score} — play again` : 'Start'}
          </button>
        )}
      </div>
    </ToolShell>
  );
}

/* ======================= Sudoku ======================= */
function solve(b: number[]): boolean {
  const i = b.indexOf(0);
  if (i < 0) return true;
  const r = Math.floor(i / 9);
  const c = i % 9;
  const nums = [1, 2, 3, 4, 5, 6, 7, 8, 9].sort(() => Math.random() - 0.5);
  for (const n of nums) {
    if (canPlace(b, r, c, n)) {
      b[i] = n;
      if (solve(b)) return true;
      b[i] = 0;
    }
  }
  return false;
}
function canPlace(b: number[], r: number, c: number, n: number) {
  for (let k = 0; k < 9; k++) {
    if (b[r * 9 + k] === n || b[k * 9 + c] === n) return false;
    const br = 3 * Math.floor(r / 3) + Math.floor(k / 3);
    const bc = 3 * Math.floor(c / 3) + (k % 3);
    if (b[br * 9 + bc] === n) return false;
  }
  return true;
}
function makePuzzle(holes: number) {
  const full = Array(81).fill(0);
  solve(full);
  const puzzle = [...full];
  const order = [...Array(81).keys()].sort(() => Math.random() - 0.5);
  for (const i of order.slice(0, holes)) puzzle[i] = 0;
  return { puzzle, solution: full };
}
export function Sudoku() {
  const LEVELS = { Easy: 36, Medium: 46, Hard: 54 } as const;
  const [level, setLevel] = useState<keyof typeof LEVELS>('Easy');
  const [game, setGame] = useState<{ puzzle: number[]; solution: number[] } | null>(null);
  const [cells, setCells] = useState<number[]>([]);
  const [sel, setSel] = useState<number | null>(null);
  const [msg, setMsg] = useState('');
  const newGame = useCallback((l: keyof typeof LEVELS) => {
    const g = makePuzzle(LEVELS[l]);
    setGame(g);
    setCells(g.puzzle);
    setSel(null);
    setMsg('');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- the puzzle is random, so it is created in the browser
    newGame('Easy');
  }, [newGame]);
  const put = (n: number) => {
    if (sel === null || !game || game.puzzle[sel]) return;
    setCells(c => {
      const next = c.map((v, i) => (i === sel ? n : v));
      if (next.every((v, i) => v === game.solution[i])) setMsg('Solved — well done!');
      return next;
    });
  };
  useEffect(() => {
    const k = (e: KeyboardEvent) => {
      if (/^[1-9]$/.test(e.key)) put(Number(e.key));
      if (e.key === 'Backspace' || e.key === 'Delete' || e.key === '0') put(0);
    };
    window.addEventListener('keydown', k);
    return () => window.removeEventListener('keydown', k);
  });
  const check = () => {
    if (!game) return;
    const wrong = cells.filter((v, i) => v && v !== game.solution[i]).length;
    const left = cells.filter(v => !v).length;
    setMsg(
      wrong
        ? `${wrong} number${wrong > 1 ? 's are' : ' is'} wrong.`
        : left
          ? `No mistakes so far — ${left} cells left.`
          : 'Solved — well done!',
    );
  };
  return (
    <ToolShell
      title="Sudoku"
      description="Fill the grid so every row, column and 3×3 box has the numbers 1 to 9. Three difficulty levels."
      faq={[
        {
          q: 'How do I enter numbers?',
          a: 'Tap a cell, then tap a number below (or type 1–9 on a keyboard). Use the eraser to clear a cell.',
        },
        {
          q: 'Does every puzzle have a solution?',
          a: 'Yes. Each puzzle is made by first creating a complete, valid grid and then removing numbers.',
        },
      ]}
    >
      <div className="gameWrap">
        <div className="tbChips" role="group" aria-label="Difficulty">
          {(Object.keys(LEVELS) as (keyof typeof LEVELS)[]).map(l => (
            <button
              key={l}
              className={level === l ? 'on' : ''}
              aria-pressed={level === l}
              onClick={() => {
                setLevel(l);
                newGame(l);
              }}
            >
              {l}
            </button>
          ))}
        </div>
        <div className="sudoku" role="group" aria-label="Sudoku board">
          {cells.map((v, i) => {
            const fixed = !!game?.puzzle[i];
            const r = Math.floor(i / 9);
            const c = i % 9;
            const related = sel !== null && (Math.floor(sel / 9) === r || sel % 9 === c);
            return (
              <button
                key={i}
                className={`sdCell ${fixed ? 'fixed' : ''} ${sel === i ? 'sel' : related ? 'rel' : ''} ${c % 3 === 2 && c < 8 ? 'br' : ''} ${r % 3 === 2 && r < 8 ? 'bb' : ''}`}
                onClick={() => setSel(i)}
                aria-label={`Row ${r + 1}, column ${c + 1}${v ? `, ${v}` : ', empty'}`}
              >
                {v || ''}
              </button>
            );
          })}
        </div>
        <div className="numPad">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(n => (
            <button key={n} onClick={() => put(n)}>
              {n}
            </button>
          ))}
          <button onClick={() => put(0)} aria-label="Erase">
            <Delete size={20} />
          </button>
        </div>
        <div className="gameBar">
          <button className="btn btnGhost" onClick={check}>
            Check
          </button>
          <button className="btn btnPrimary" onClick={() => newGame(level)}>
            New puzzle
          </button>
        </div>
        {msg && (
          <p className="notice" role="status">
            {msg}
          </p>
        )}
      </div>
    </ToolShell>
  );
}
