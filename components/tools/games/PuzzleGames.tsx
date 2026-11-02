'use client';
/**
 * More games: Connect Four, Hangman, Reaction Time and Simon Says.
 * Each game is one small component that uses ToolShell for its page layout.
 */
import { useEffect, useRef, useState } from 'react';
import ToolShell from '@/components/shared/ToolShell';
import { Note } from '@/components/shared/ui';

const Pill = ({ label, value }: { label: string; value: string | number }) => (
  <div className="scorePill">
    <span>{label}</span>
    {value}
  </div>
);

/* ================= Connect Four ================= */
const ROWS = 6;
const COLS = 7;
type Disc = '' | 'R' | 'Y';

function emptyBoard(): Disc[][] {
  return Array.from({ length: ROWS }, () => Array<Disc>(COLS).fill(''));
}

/** Returns the winning cells, or null. */
function findWin(b: Disc[][]): [number, number][] | null {
  const dirs = [
    [0, 1],
    [1, 0],
    [1, 1],
    [1, -1],
  ];
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const p = b[r][c];
      if (!p) continue;
      for (const [dr, dc] of dirs) {
        const cells: [number, number][] = [[r, c]];
        for (let k = 1; k < 4; k++) {
          const nr = r + dr * k,
            nc = c + dc * k;
          if (nr < 0 || nr >= ROWS || nc < 0 || nc >= COLS || b[nr][nc] !== p) break;
          cells.push([nr, nc]);
        }
        if (cells.length === 4) return cells;
      }
    }
  }
  return null;
}

function drop(b: Disc[][], col: number, p: Disc): Disc[][] | null {
  for (let r = ROWS - 1; r >= 0; r--) {
    if (!b[r][col]) {
      const next = b.map(row => [...row]);
      next[r][col] = p;
      return next;
    }
  }
  return null; // column full
}

/** Simple computer: win if it can, block if it must, otherwise prefer the centre. */
function computerMove(b: Disc[][]): number {
  const open = [...Array(COLS).keys()].filter(c => !b[0][c]);
  for (const who of ['Y', 'R'] as Disc[]) {
    for (const c of open) {
      const t = drop(b, c, who);
      if (t && findWin(t)) return c;
    }
  }
  const order = [3, 2, 4, 1, 5, 0, 6].filter(c => open.includes(c));
  const safe = order.filter(c => {
    const t = drop(b, c, 'Y');
    return (
      t &&
      !open.some(c2 => {
        const t2 = drop(t, c2, 'R');
        return t2 && findWin(t2);
      })
    );
  });
  const pool = safe.length ? safe : order;
  return pool[Math.floor(Math.random() * Math.min(pool.length, 3))];
}

export function ConnectFour() {
  const [board, setBoard] = useState<Disc[][]>(emptyBoard);
  const [turn, setTurn] = useState<Disc>('R');
  const [vsAi, setVsAi] = useState(true);
  const win = findWin(board);
  const full = board[0].every(Boolean);
  const finished = !!win || full;

  const play = (col: number) => {
    if (finished || (vsAi && turn === 'Y')) return;
    const next = drop(board, col, turn);
    if (!next) return;
    setBoard(next);
    setTurn(turn === 'R' ? 'Y' : 'R');
  };

  useEffect(() => {
    if (!vsAi || turn !== 'Y' || finished) return;
    const id = setTimeout(() => {
      const next = drop(board, computerMove(board), 'Y');
      if (next) {
        setBoard(next);
        setTurn('R');
      }
    }, 450);
    return () => clearTimeout(id);
  }, [vsAi, turn, finished, board]);

  const reset = () => {
    setBoard(emptyBoard());
    setTurn('R');
  };
  const name = (p: Disc) => (p === 'R' ? (vsAi ? 'You' : 'Red') : vsAi ? 'Computer' : 'Yellow');
  const status = win
    ? `${name(board[win[0][0]][win[0][1]])} wins!`
    : full
      ? 'Draw — the board is full.'
      : `${name(turn)} to play`;
  const isWinCell = (r: number, c: number) => !!win?.some(([wr, wc]) => wr === r && wc === c);

  return (
    <ToolShell
      title="Connect Four"
      description="Drop discs into the grid and line up four in a row — across, down or diagonally — before your opponent does."
      faq={[
        {
          q: 'How do I play?',
          a: 'Tap a column to drop your disc. The first player to connect four discs in a straight line wins.',
        },
        { q: 'Can two people play?', a: 'Yes. Choose “Two players” and take turns on the same device.' },
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
        <p style={{ fontWeight: 800, margin: 0 }} aria-live="polite">
          {status}
        </p>
        <div className="c4Board" role="group" aria-label="Connect Four board">
          {board.map((row, r) =>
            row.map((cell, c) => (
              <button
                key={`${r}-${c}`}
                className={`c4Cell ${cell} ${isWinCell(r, c) ? 'win' : ''}`}
                onClick={() => play(c)}
                aria-label={`Column ${c + 1}${cell ? `, ${cell === 'R' ? 'red' : 'yellow'}` : ''}`}
              />
            )),
          )}
        </div>
        <button className="btn btnGhost" onClick={reset}>
          New game
        </button>
      </div>
    </ToolShell>
  );
}

/* ================= Hangman ================= */
const WORDS = [
  'BROWSER',
  'PICTURE',
  'KEYBOARD',
  'PLANET',
  'COMPUTER',
  'GARDEN',
  'OCEAN',
  'MOUNTAIN',
  'PYTHON',
  'JAVASCRIPT',
  'PENCIL',
  'RAINBOW',
  'BICYCLE',
  'LIBRARY',
  'ELEPHANT',
  'DIAMOND',
  'WEATHER',
  'CAMERA',
  'JOURNEY',
  'MONITOR',
  'TEACHER',
  'CRICKET',
  'BANANA',
  'CASTLE',
];
const MAX_MISSES = 6;
const pickWord = () => WORDS[Math.floor(Math.random() * WORDS.length)];

export function Hangman() {
  const [word, setWord] = useState('');
  const [guessed, setGuessed] = useState<string[]>([]);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- runs once after mount (browser-only values)
    setWord(pickWord());
  }, []);

  const misses = guessed.filter(l => !word.includes(l)).length;
  const won = !!word && [...word].every(l => guessed.includes(l));
  const lost = misses >= MAX_MISSES;

  const guess = (l: string) => {
    if (won || lost || guessed.includes(l)) return;
    setGuessed([...guessed, l]);
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (/^[a-z]$/i.test(e.key)) guess(e.key.toUpperCase());
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  const reset = () => {
    setWord(pickWord());
    setGuessed([]);
  };

  return (
    <ToolShell
      title="Hangman"
      description="Guess the hidden word one letter at a time before you run out of tries. Type on your keyboard or tap the letters."
      faq={[
        { q: 'How many wrong guesses do I get?', a: `Six. Each wrong letter uses one try.` },
        {
          q: 'What words are used?',
          a: 'Common English words about everyday things, technology and nature.',
        },
      ]}
    >
      <div className="gameWrap">
        <div className="gameBar">
          <Pill label="Tries left" value={MAX_MISSES - misses} />
          <button className="btn btnGhost" onClick={reset}>
            New word
          </button>
        </div>
        <div className="hangLives" aria-hidden="true">
          {Array.from({ length: MAX_MISSES }, (_, i) => (
            <span key={i} className={i < misses ? 'lost' : ''} />
          ))}
        </div>
        <div className="hangWord" role="group" aria-label="Hidden word">
          {[...word].map((l, i) => (
            <span key={i}>{guessed.includes(l) || lost ? l : ''}</span>
          ))}
        </div>
        {won && <Note>You got it — the word was {word}.</Note>}
        {lost && <Note error>Out of tries. The word was {word}.</Note>}
        <div className="hangKeys">
          {'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').map(l => (
            <button
              key={l}
              disabled={guessed.includes(l) || won || lost}
              className={guessed.includes(l) ? (word.includes(l) ? 'hit' : 'miss') : ''}
              onClick={() => guess(l)}
            >
              {l}
            </button>
          ))}
        </div>
      </div>
    </ToolShell>
  );
}

/* ================= Reaction time ================= */
type Phase = 'idle' | 'waiting' | 'go' | 'early' | 'done';

export function ReactionTime() {
  const [phase, setPhase] = useState<Phase>('idle');
  const [ms, setMs] = useState(0);
  const [results, setResults] = useState<number[]>([]);
  const timer = useRef<number | null>(null);
  const shownAt = useRef(0);

  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );

  const click = () => {
    if (phase === 'idle' || phase === 'done' || phase === 'early') {
      setPhase('waiting');
      timer.current = window.setTimeout(
        () => {
          shownAt.current = performance.now();
          setPhase('go');
        },
        1200 + Math.random() * 2800,
      );
    } else if (phase === 'waiting') {
      if (timer.current) clearTimeout(timer.current);
      setPhase('early');
    } else if (phase === 'go') {
      const t = Math.round(performance.now() - shownAt.current);
      setMs(t);
      setResults(r => [t, ...r].slice(0, 5));
      setPhase('done');
    }
  };

  const avg = results.length ? Math.round(results.reduce((a, b) => a + b, 0) / results.length) : 0;
  const text: Record<Phase, string> = {
    idle: 'Click or tap to start',
    waiting: 'Wait for green…',
    go: 'Click now!',
    early: 'Too soon! Click to try again',
    done: `${ms} ms — click to go again`,
  };

  return (
    <ToolShell
      title="Reaction time test"
      description="Click the moment the box turns green and see how fast your reactions are in milliseconds."
      faq={[
        {
          q: 'What is a good reaction time?',
          a: 'Most people score between 200 and 300 ms. Under 200 ms is very fast.',
        },
        {
          q: 'Why does my score change?',
          a: 'Reaction time varies with focus, tiredness and your device. Average several tries for a fair result.',
        },
      ]}
    >
      <div className="gameWrap">
        <div className="gameBar">
          <Pill label="Last" value={ms ? `${ms} ms` : '—'} />
          <Pill label="Average of last 5" value={avg ? `${avg} ms` : '—'} />
        </div>
        <button
          className={`reactBox ${phase}`}
          onMouseDown={click}
          onKeyDown={e => {
            if (e.key === ' ' || e.key === 'Enter') {
              e.preventDefault();
              click();
            }
          }}
        >
          {text[phase]}
        </button>
      </div>
    </ToolShell>
  );
}

/* ================= Simon says ================= */
const PADS = ['green', 'red', 'yellow', 'blue'] as const;
const randomPad = () => Math.floor(Math.random() * 4);
const TONES = [329.6, 261.6, 220, 164.8];

function beep(i: number) {
  try {
    const ctx = new AudioContext();
    const o = ctx.createOscillator(),
      g = ctx.createGain();
    o.frequency.value = TONES[i];
    o.connect(g);
    g.connect(ctx.destination);
    g.gain.setValueAtTime(0.15, ctx.currentTime);
    o.start();
    o.stop(ctx.currentTime + 0.3);
  } catch {
    /* sound not available */
  }
}

export function SimonSays() {
  const [seq, setSeq] = useState<number[]>([]);
  const [step, setStep] = useState(0);
  const [lit, setLit] = useState<number | null>(null);
  const [state, setState] = useState<'ready' | 'showing' | 'input' | 'over'>('ready');
  const [best, setBest] = useState(0);

  const show = (s: number[]) => {
    setState('showing');
    s.forEach((pad, i) => {
      setTimeout(
        () => {
          setLit(pad);
          beep(pad);
        },
        600 * i + 400,
      );
      setTimeout(() => setLit(null), 600 * i + 800);
    });
    setTimeout(
      () => {
        setState('input');
        setStep(0);
      },
      600 * s.length + 450,
    );
  };

  const start = () => {
    const s = [randomPad()];
    setSeq(s);
    show(s);
  };

  const press = (pad: number) => {
    if (state !== 'input') return;
    setLit(pad);
    beep(pad);
    setTimeout(() => setLit(null), 200);
    if (pad !== seq[step]) {
      setState('over');
      setBest(b => Math.max(b, seq.length - 1));
      return;
    }
    if (step + 1 === seq.length) {
      const next = [...seq, randomPad()];
      setSeq(next);
      setBest(b => Math.max(b, seq.length));
      setTimeout(() => show(next), 500);
    } else {
      setStep(step + 1);
    }
  };

  const label = {
    ready: 'Press start and watch the pattern',
    showing: 'Watch…',
    input: 'Your turn — repeat the pattern',
    over: `Wrong pad! You reached ${seq.length - 1}.`,
  }[state];

  return (
    <ToolShell
      title="Simon says"
      description="Watch the coloured pads light up, then repeat the pattern. Each round adds one more step."
      faq={[
        {
          q: 'How do I play?',
          a: 'Watch the sequence, then tap the pads in the same order. Get it right and the sequence grows by one.',
        },
        {
          q: 'Is there sound?',
          a: 'Yes, each pad plays its own tone. Turn your volume up for an easier game.',
        },
      ]}
    >
      <div className="gameWrap">
        <div className="gameBar">
          <Pill
            label="Score"
            value={Math.max(
              0,
              seq.length - (state === 'input' || state === 'showing' ? 1 : state === 'over' ? 1 : 0),
            )}
          />
          <Pill label="Best" value={best} />
          <button className="btn btnPrimary" onClick={start} disabled={state === 'showing'}>
            {state === 'ready' ? 'Start' : 'Restart'}
          </button>
        </div>
        <p style={{ fontWeight: 800, margin: 0 }} aria-live="polite">
          {label}
        </p>
        <div className="simonPads">
          {PADS.map((c, i) => (
            <button
              key={c}
              className={`simonPad ${c} ${lit === i ? 'lit' : ''}`}
              onClick={() => press(i)}
              aria-label={`${c} pad`}
            />
          ))}
        </div>
      </div>
    </ToolShell>
  );
}
