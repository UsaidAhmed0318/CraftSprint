'use client';
/** Word Guess (guess the 5-letter word in 6 tries) and Sliding Puzzle (15-puzzle). */
import { useCallback, useEffect, useState } from 'react';
import { Delete, CornerDownLeft } from 'lucide-react';
import ToolShell from '@/components/shared/ToolShell';

const WORDS =
  'about above actor adapt admit adopt adult after again agent agree ahead alarm album alert alike alive allow alone along alter angel anger angle angry apart apple apply arena argue arise array aside asset audio audit avoid award aware badge basic beach begin being below bench birth black blame blank blind block blood board boost brain brand bread break brick brief bring broad brown brush build buyer cabin cable candy carry catch cause chain chair chalk charm chart chase cheap check chess chest chief child civil claim class clean clear click climb clock close cloud coach coast color count court cover craft crash cream crime cross crowd crown cycle daily dance dealt death delay depth dirty doubt dozen draft drama dream dress drink drive eager early earth eight elite empty enemy enjoy enter entry equal error event every exact exist extra faith false fancy fault favor fence field fifty fight final first flame flash fleet floor fluid focus force forum found frame fresh front fruit funny ghost giant given glass globe glory grace grade grain grand grant grape grass great green group guard guess guest guide habit happy heart heavy honey horse hotel house human humor ideal image index inner input issue joint judge juice knife label large laser laugh layer learn least leave legal lemon level light limit local logic loose lucky lunch magic major maker march match maybe mayor meant medal metal minor model money month moral motor mount mouse mouth movie music nerve never night noble noise north novel nurse ocean offer often olive onion opera orbit order other outer owner paint panel paper party peace pearl phase phone photo piano piece pilot pitch pizza place plain plane plant plate point power press price pride prime print prize proof proud queen quick quiet quote radio raise range rapid ratio reach ready realm relax reply right river robot rough round route royal rural salad scale scene scope score sense serve seven shade shape share sharp sheep shelf shell shift shine shirt shock shore short sight skill sleep slice smart smile smoke solid solve sound south space spare speak speed spend spice spoon sport staff stage stair stand start state steam steel stick still stock stone store storm story study style sugar suite sunny super sweet swing table taste teach thank theme thick thing think third threw throw tiger title toast today topic total touch tower track trade train treat trend trial tribe trick truck trust truth twice uncle under union unity until upper urban usage usual valid value video visit vital voice waste watch water wheel while white whole woman world worry write wrong young youth zebra'.split(
    ' ',
  );

type Mark = 'hit' | 'near' | 'miss';
function score(guess: string, answer: string): Mark[] {
  const res: Mark[] = Array(5).fill('miss');
  const left: Record<string, number> = {};
  for (let i = 0; i < 5; i++) {
    if (guess[i] === answer[i]) res[i] = 'hit';
    else left[answer[i]] = (left[answer[i]] || 0) + 1;
  }
  for (let i = 0; i < 5; i++) {
    if (res[i] !== 'hit' && left[guess[i]]) {
      res[i] = 'near';
      left[guess[i]]--;
    }
  }
  return res;
}
const KEYS = ['qwertyuiop', 'asdfghjkl', 'zxcvbnm'];

export function WordGuess() {
  const [answer, setAnswer] = useState('');
  const [rows, setRows] = useState<string[]>([]);
  const [cur, setCur] = useState('');
  const [msg, setMsg] = useState('');
  const newGame = useCallback(() => {
    setAnswer(WORDS[Math.floor(Math.random() * WORDS.length)]);
    setRows([]);
    setCur('');
    setMsg('');
  }, []);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- the secret word is chosen in the browser
    newGame();
  }, [newGame]);
  const over = rows.includes(answer) || rows.length >= 6;
  const press = useCallback(
    (k: string) => {
      if (over || !answer) return;
      if (k === 'enter') {
        if (cur.length < 5) return setMsg('Type 5 letters');
        const next = [...rows, cur];
        setRows(next);
        setCur('');
        setMsg(
          cur === answer
            ? `Brilliant — solved in ${next.length}!`
            : next.length >= 6
              ? `The word was ${answer.toUpperCase()}`
              : '',
        );
      } else if (k === 'back') setCur(c => c.slice(0, -1));
      else if (/^[a-z]$/.test(k) && cur.length < 5) setCur(c => c + k);
    },
    [over, answer, cur, rows],
  );
  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      const t = e.target as HTMLElement;
      if (t?.tagName === 'INPUT' || t?.tagName === 'TEXTAREA') return;
      if (e.key === 'Enter') press('enter');
      else if (e.key === 'Backspace') press('back');
      else if (/^[a-zA-Z]$/.test(e.key)) press(e.key.toLowerCase());
    };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [press]);
  const keyState: Record<string, Mark> = {};
  rows.forEach(r =>
    score(r, answer).forEach((m, i) => {
      const k = r[i];
      if (keyState[k] !== 'hit') keyState[k] = m === 'hit' ? 'hit' : keyState[k] === 'near' ? 'near' : m;
    }),
  );
  const grid = Array.from({ length: 6 }, (_, i) => rows[i] ?? (i === rows.length ? cur : ''));
  return (
    <ToolShell
      title="Word Guess"
      description="Guess the hidden 5-letter English word in 6 tries. Green = right place, yellow = in the word, grey = not in the word."
      faq={[
        {
          q: 'How do I play?',
          a: 'Type a 5-letter word and press Enter. Tiles turn green for the right letter in the right spot, yellow for a letter in the word but elsewhere, and grey if the letter is not in the word.',
        },
      ]}
    >
      <div className="gameWrap">
        <div className="wgGrid" role="group" aria-label="Guesses">
          {grid.map((w, r) => {
            const marks = r < rows.length ? score(rows[r], answer) : null;
            return (
              <div className="wgRow" key={r}>
                {Array.from({ length: 5 }, (_, c) => (
                  <span key={c} className={`wgTile ${marks ? marks[c] : w[c] ? 'typed' : ''}`}>
                    {w[c]?.toUpperCase() || ''}
                  </span>
                ))}
              </div>
            );
          })}
        </div>
        <p className="wgMsg" role="status" aria-live="polite">
          {msg}
        </p>
        <div className="wgKeys">
          {KEYS.map((row, i) => (
            <div key={row} className="wgKeyRow">
              {i === 2 && (
                <button type="button" className="wide" onClick={() => press('enter')} aria-label="Enter">
                  <CornerDownLeft size={18} />
                </button>
              )}
              {row.split('').map(k => (
                <button type="button" key={k} className={keyState[k] || ''} onClick={() => press(k)}>
                  {k.toUpperCase()}
                </button>
              ))}
              {i === 2 && (
                <button
                  type="button"
                  className="wide"
                  onClick={() => press('back')}
                  aria-label="Delete letter"
                >
                  <Delete size={18} />
                </button>
              )}
            </div>
          ))}
        </div>
        {over && (
          <button className="btn btnPrimary gameBigBtn" onClick={newGame}>
            New word
          </button>
        )}
      </div>
    </ToolShell>
  );
}

/* ---------- Sliding puzzle ---------- */
const solved = (n: number) => [...Array(n * n - 1).keys()].map(i => i + 1).concat(0);
function shuffled(n: number) {
  const t = solved(n);
  let blank = t.length - 1;
  for (let k = 0; k < 400; k++) {
    const r = Math.floor(blank / n);
    const c = blank % n;
    const moves = [
      r > 0 && blank - n,
      r < n - 1 && blank + n,
      c > 0 && blank - 1,
      c < n - 1 && blank + 1,
    ].filter(x => x !== false) as number[];
    const m = moves[Math.floor(Math.random() * moves.length)];
    [t[blank], t[m]] = [t[m], t[blank]];
    blank = m;
  }
  return t;
}
export function SlidingPuzzle() {
  const [n, setN] = useState(4);
  const [tiles, setTiles] = useState<number[]>(() => solved(4));
  const [moves, setMoves] = useState(0);
  const start = useCallback((size: number) => {
    setN(size);
    setTiles(shuffled(size));
    setMoves(0);
  }, []);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- the shuffle is random, so it happens in the browser
    start(4);
  }, [start]);
  const won = moves > 0 && tiles.every((v, i) => v === solved(n)[i]);
  const tap = (i: number) => {
    if (won) return;
    const b = tiles.indexOf(0);
    const near = (Math.abs(i - b) === 1 && Math.floor(i / n) === Math.floor(b / n)) || Math.abs(i - b) === n;
    if (!near) return;
    const t = [...tiles];
    [t[i], t[b]] = [t[b], t[i]];
    setTiles(t);
    setMoves(m => m + 1);
  };
  return (
    <ToolShell
      title="Sliding Puzzle"
      description="Slide the numbered tiles into order, 1 to the last number, with the empty space at the end. Choose 3×3, 4×4 or 5×5."
      faq={[
        {
          q: 'Is every puzzle solvable?',
          a: 'Yes. Puzzles are made by sliding tiles from the solved position, so a solution always exists.',
        },
      ]}
    >
      <div className="gameWrap">
        <div className="tbChips" role="group" aria-label="Size">
          {[3, 4, 5].map(s => (
            <button key={s} className={n === s ? 'on' : ''} aria-pressed={n === s} onClick={() => start(s)}>
              {s}×{s}
            </button>
          ))}
        </div>
        <div className="gameBar">
          <div className="scorePill">
            <span>Moves</span>
            {moves}
          </div>
        </div>
        <div
          className="slideBoard"
          style={{ gridTemplateColumns: `repeat(${n}, 1fr)` }}
          role="group"
          aria-label="Sliding puzzle"
        >
          {tiles.map((v, i) => (
            <button
              key={i}
              className={`slideTile ${v ? '' : 'empty'}`}
              onClick={() => tap(i)}
              disabled={!v}
              aria-label={v ? `Tile ${v}` : 'Empty space'}
            >
              {v || ''}
            </button>
          ))}
        </div>
        {won && (
          <p className="notice" role="status">
            Solved in {moves} moves!
          </p>
        )}
        <button className="btn btnPrimary gameBigBtn" onClick={() => start(n)}>
          Shuffle
        </button>
      </div>
    </ToolShell>
  );
}
