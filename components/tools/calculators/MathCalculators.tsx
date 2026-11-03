'use client';
import { Delete } from 'lucide-react';
import { useMemo, useState } from 'react';
import ToolShell from '@/components/shared/ToolShell';
import { fmt, money, Stat, Num } from '@/components/shared/ui';

/* ---------- Safe expression evaluator (no eval) ---------- */
type Tok =
  { t: 'num'; v: number } | { t: 'op'; v: string } | { t: 'fn'; v: string } | { t: '(' } | { t: ')' };
const FN: Record<string, (x: number, deg: boolean) => number> = {
  sin: (x, d) => Math.sin(d ? (x * Math.PI) / 180 : x),
  cos: (x, d) => Math.cos(d ? (x * Math.PI) / 180 : x),
  tan: (x, d) => Math.tan(d ? (x * Math.PI) / 180 : x),
  asin: (x, d) => {
    const r = Math.asin(x);
    return d ? (r * 180) / Math.PI : r;
  },
  acos: (x, d) => {
    const r = Math.acos(x);
    return d ? (r * 180) / Math.PI : r;
  },
  atan: (x, d) => {
    const r = Math.atan(x);
    return d ? (r * 180) / Math.PI : r;
  },
  sqrt: x => Math.sqrt(x),
  cbrt: x => Math.cbrt(x),
  log: x => Math.log10(x),
  ln: x => Math.log(x),
  abs: x => Math.abs(x),
  exp: x => Math.exp(x),
};
const fact = (n: number) => {
  if (n < 0 || !Number.isInteger(n) || n > 170) return NaN;
  let r = 1;
  for (let i = 2; i <= n; i++) r *= i;
  return r;
};
export function evaluate(src: string, deg: boolean): number {
  const s = src.replace(/\s+/g, '').replace(/×/g, '*').replace(/÷/g, '/').replace(/π/g, 'pi');
  const toks: Tok[] = [];
  let i = 0;
  while (i < s.length) {
    const c = s[i];
    if (/[0-9.]/.test(c)) {
      let j = i;
      while (j < s.length && /[0-9.eE]/.test(s[j]) && !(/[eE]/.test(s[j]) && !/[0-9+-]/.test(s[j + 1] || '')))
        j++;
      const v = parseFloat(s.slice(i, j));
      if (isNaN(v)) throw new Error('Bad number');
      toks.push({ t: 'num', v });
      i = j;
      continue;
    }
    if (/[a-z]/i.test(c)) {
      let j = i;
      while (j < s.length && /[a-z]/i.test(s[j])) j++;
      const w = s.slice(i, j).toLowerCase();
      if (w === 'pi') toks.push({ t: 'num', v: Math.PI });
      else if (w === 'e') toks.push({ t: 'num', v: Math.E });
      else if (FN[w]) toks.push({ t: 'fn', v: w });
      else throw new Error(`Unknown name “${w}”`);
      i = j;
      continue;
    }
    if ('+-*/^%!'.includes(c)) {
      toks.push({ t: 'op', v: c });
      i++;
      continue;
    }
    if (c === '(') {
      toks.push({ t: '(' });
      i++;
      continue;
    }
    if (c === ')') {
      toks.push({ t: ')' });
      i++;
      continue;
    }
    throw new Error(`Unexpected “${c}”`);
  }
  // implicit multiplication: 2pi, 2(3), )(
  const out: Tok[] = [];
  toks.forEach((tk, k) => {
    const prev = toks[k - 1];
    if (
      prev &&
      (prev.t === 'num' || prev.t === ')' || (prev.t === 'op' && prev.v === '!')) &&
      (tk.t === 'num' || tk.t === '(' || tk.t === 'fn')
    )
      out.push({ t: 'op', v: '*' });
    out.push(tk);
  });
  let p = 0;
  const peek = () => out[p];
  const expr = (): number => {
    let v = term();
    while (peek()?.t === 'op' && ['+', '-'].includes((peek() as { v: string }).v)) {
      const o = (out[p++] as { v: string }).v;
      const r = term();
      v = o === '+' ? v + r : v - r;
    }
    return v;
  };
  const term = (): number => {
    let v = unary();
    while (peek()?.t === 'op' && ['*', '/', '%'].includes((peek() as { v: string }).v)) {
      const o = (out[p++] as { v: string }).v;
      const r = unary();
      v = o === '*' ? v * r : o === '/' ? v / r : v % r;
    }
    return v;
  };
  const unary = (): number => {
    if (peek()?.t === 'op' && (peek() as { v: string }).v === '-') {
      p++;
      return -unary();
    }
    if (peek()?.t === 'op' && (peek() as { v: string }).v === '+') {
      p++;
      return unary();
    }
    return power();
  };
  const power = (): number => {
    const b = postfix();
    if (peek()?.t === 'op' && (peek() as { v: string }).v === '^') {
      p++;
      return Math.pow(b, unary());
    }
    return b;
  };
  const postfix = (): number => {
    let v = primary();
    while (peek()?.t === 'op' && (peek() as { v: string }).v === '!') {
      p++;
      v = fact(v);
    }
    return v;
  };
  const primary = (): number => {
    const tk = out[p++];
    if (!tk) throw new Error('Expression ends too early');
    if (tk.t === 'num') return tk.v;
    if (tk.t === 'fn') {
      const a = primary();
      return FN[tk.v](a, deg);
    }
    if (tk.t === '(') {
      const v = expr();
      if (out[p++]?.t !== ')') throw new Error('Missing closing bracket');
      return v;
    }
    throw new Error('Unexpected symbol');
  };
  const v = expr();
  if (p < out.length) throw new Error('Unexpected symbol');
  return v;
}

export function ScientificCalculator() {
  const [exp, setExp] = useState('');
  const [deg, setDeg] = useState(true);
  const [hist, setHist] = useState<string[]>([]);
  let result = '';
  let err = '';
  if (exp.trim()) {
    try {
      const v = evaluate(exp, deg);
      result = Number.isFinite(v) ? String(+v.toPrecision(12)) : 'Undefined';
    } catch (e) {
      err = (e as Error).message;
    }
  }
  const keys = [
    'sin',
    'cos',
    'tan',
    '(',
    ')',
    'asin',
    'acos',
    'atan',
    '^',
    '!',
    'sqrt',
    'log',
    'ln',
    'π',
    'e',
    '7',
    '8',
    '9',
    '÷',
    '%',
    '4',
    '5',
    '6',
    '×',
    'C',
    '1',
    '2',
    '3',
    '-',
    '⌫',
    '0',
    '.',
    '=',
    '+',
    'Ans',
  ];
  const press = (k: string) => {
    if (k === 'C') return setExp('');
    if (k === '⌫') return setExp(x => x.slice(0, -1));
    if (k === '=') {
      if (result && !err) {
        setHist(h => [`${exp} = ${result}`, ...h].slice(0, 8));
        setExp(result);
      }
      return;
    }
    if (k === 'Ans') {
      if (hist[0]) setExp(x => x + hist[0].split(' = ')[1]);
      return;
    }
    setExp(
      x => x + (['sin', 'cos', 'tan', 'asin', 'acos', 'atan', 'sqrt', 'log', 'ln'].includes(k) ? k + '(' : k),
    );
  };
  return (
    <ToolShell
      title="Scientific calculator"
      description="A full scientific calculator with trigonometry, logarithms, powers, roots, factorials and brackets. Type an expression or use the keypad."
      faq={[
        {
          q: 'Can I type expressions directly?',
          a: 'Yes. Type things like 2^10, sqrt(144), sin(30) or (5+3)*2 and the answer appears as you type. Press Enter or = to keep it.',
        },
        {
          q: 'Degrees or radians?',
          a: 'Use the switch above the keypad. Degrees is the default for sin, cos and tan.',
        },
        {
          q: 'Is it safe?',
          a: 'Yes. Expressions are parsed by our own math engine, never executed as code.',
        },
      ]}
    >
      <div className="calcWrap">
        <div className="calcScreen">
          <input
            value={exp}
            onChange={e => setExp(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter') press('=');
            }}
            placeholder="Type or tap, e.g. 2^8 + sqrt(81)"
            aria-label="Expression"
          />
          <div className={`calcResult ${err ? 'err' : ''}`}>{err || result || '0'}</div>
        </div>
        <div className="rowBtns" style={{ marginTop: 10 }}>
          <button className={`btn ${deg ? 'btnPrimary' : 'btnGhost'}`} onClick={() => setDeg(true)}>
            Degrees
          </button>
          <button className={`btn ${!deg ? 'btnPrimary' : 'btnGhost'}`} onClick={() => setDeg(false)}>
            Radians
          </button>
        </div>
        <div className="calcKeys">
          {keys.map(k => (
            <button
              key={k}
              className={/^[0-9.]$/.test(k) ? 'num' : k === '=' ? 'eq' : k === 'C' || k === '⌫' ? 'clr' : ''}
              onClick={() => press(k)}
              aria-label={k === '⌫' ? 'Backspace' : undefined}
            >
              {k === '⌫' ? <Delete size={20} aria-hidden="true" /> : k}
            </button>
          ))}
        </div>
        {hist.length > 0 && <div className="monoOut">{hist.join('\n')}</div>}
      </div>
    </ToolShell>
  );
}

/* ---------- Ohm's law ---------- */
export function OhmsLawCalculator() {
  const [v, setV] = useState(12);
  const [i, setI] = useState(NaN);
  const [r, setR] = useState(100);
  const [pw, setPw] = useState(NaN);
  const known = [v, i, r, pw].filter(Number.isFinite).length;
  const res = useMemo(() => {
    let V = v,
      I = i,
      R = r,
      P = pw;
    const f = Number.isFinite;
    if (f(V) && f(I)) {
      R = V / I;
      P = V * I;
    } else if (f(V) && f(R)) {
      I = V / R;
      P = (V * V) / R;
    } else if (f(V) && f(P)) {
      I = P / V;
      R = (V * V) / P;
    } else if (f(I) && f(R)) {
      V = I * R;
      P = I * I * R;
    } else if (f(I) && f(P)) {
      V = P / I;
      R = P / (I * I);
    } else if (f(R) && f(P)) {
      V = Math.sqrt(P * R);
      I = Math.sqrt(P / R);
    }
    return { V, I, R, P };
  }, [v, i, r, pw]);
  return (
    <ToolShell
      title="Ohm’s law calculator"
      description="Enter any two of voltage, current, resistance and power to calculate the other two instantly."
      faq={[
        {
          q: 'What is Ohm’s law?',
          a: 'Voltage equals current times resistance (V = I × R). Power is P = V × I, which also gives P = I² × R and P = V² ÷ R.',
        },
        { q: 'Which units are used?', a: 'Volts (V), amperes (A), ohms (Ω) and watts (W).' },
      ]}
    >
      <p className="notice">Fill in exactly two values and leave the other two empty.</p>
      <div className="controls" style={{ gridTemplateColumns: 'repeat(4,1fr)' }}>
        <Num label="Voltage (V)" value={v} set={setV} />
        <Num label="Current (A)" value={i} set={setI} />
        <Num label="Resistance (Ω)" value={r} set={setR} />
        <Num label="Power (W)" value={pw} set={setPw} />
      </div>
      {known === 2 ? (
        <div className="statGrid" style={{ gridTemplateColumns: 'repeat(4,1fr)' }}>
          <Stat label="Voltage" value={`${fmt(res.V)} V`} />
          <Stat label="Current" value={`${fmt(res.I)} A`} />
          <Stat label="Resistance" value={`${fmt(res.R)} Ω`} />
          <Stat label="Power" value={`${fmt(res.P)} W`} />
        </div>
      ) : (
        <p className="notice error">
          {known < 2 ? 'Enter two values to calculate.' : 'Too many values — clear all but two.'}
        </p>
      )}
    </ToolShell>
  );
}

/* ---------- Resistor color code ---------- */
const COLORS = [
  ['Black', '#111111'],
  ['Brown', '#7b3f00'],
  ['Red', '#d32f2f'],
  ['Orange', '#f57c00'],
  ['Yellow', '#fbc02d'],
  ['Green', '#2e7d32'],
  ['Blue', '#1565c0'],
  ['Violet', '#7b1fa2'],
  ['Grey', '#757575'],
  ['White', '#f5f5f5'],
];
const MULT: [string, string, number][] = [
  ...COLORS.map(([n, c], k) => [n, c, Math.pow(10, k)] as [string, string, number]),
  ['Gold', '#c9a227', 0.1],
  ['Silver', '#b0b0b0', 0.01],
];
const TOL: [string, string, string][] = [
  ['Brown', '#7b3f00', '±1%'],
  ['Red', '#d32f2f', '±2%'],
  ['Green', '#2e7d32', '±0.5%'],
  ['Blue', '#1565c0', '±0.25%'],
  ['Violet', '#7b1fa2', '±0.1%'],
  ['Gold', '#c9a227', '±5%'],
  ['Silver', '#b0b0b0', '±10%'],
];
const ohm = (x: number) =>
  x >= 1e6 ? `${+(x / 1e6).toFixed(3)} MΩ` : x >= 1e3 ? `${+(x / 1e3).toFixed(3)} kΩ` : `${+x.toFixed(3)} Ω`;
const Pick = ({
  label,
  opts,
  val,
  set,
}: {
  label: string;
  opts: [string, string][];
  val: number;
  set: (n: number) => void;
}) => (
  <div className="field">
    <label>{label}</label>
    <select aria-label={label} value={val} onChange={e => set(+e.target.value)}>
      {opts.map(([n], k) => (
        <option key={n} value={k}>
          {n}
        </option>
      ))}
    </select>
  </div>
);
export function ResistorColorCode() {
  const [bands, setBands] = useState<4 | 5>(4);
  const [d, setD] = useState([4, 7, 0]);
  const [m, setM] = useState(2);
  const [t, setT] = useState(5);
  const digits = bands === 4 ? d.slice(0, 2) : d;
  const value = parseInt(digits.join(''), 10) * MULT[m][2];
  const shown = [...digits.map(x => COLORS[x][1]), MULT[m][1], TOL[t][1]];
  return (
    <ToolShell
      title="Resistor color code calculator"
      description="Pick the colour bands on a 4- or 5-band resistor to read its resistance and tolerance."
      faq={[
        {
          q: 'How do I read a resistor?',
          a: 'Hold the resistor so the tolerance band (often gold or silver) is on the right. Read the digit bands from the left, then multiply by the multiplier band.',
        },
        {
          q: 'What is the difference between 4 and 5 bands?',
          a: 'A 5-band resistor has three digit bands instead of two, which allows more precise values.',
        },
      ]}
    >
      <div className="rowBtns" style={{ marginTop: 0 }}>
        {([4, 5] as const).map(b => (
          <button
            key={b}
            className={`btn ${bands === b ? 'btnPrimary' : 'btnGhost'}`}
            onClick={() => setBands(b)}
          >
            {b} bands
          </button>
        ))}
      </div>
      <div className="resistor" aria-hidden="true">
        <div className="resBody">
          {shown.map((c, k) => (
            <span
              key={k}
              style={{ background: c, marginLeft: k === shown.length - 1 ? 'auto' : undefined }}
            />
          ))}
        </div>
      </div>
      <div className="controls">
        {digits.map((x, k) => (
          <Pick
            key={k}
            label={`Band ${k + 1} (digit)`}
            opts={COLORS as [string, string][]}
            val={x}
            set={n => {
              const nd = [...d];
              nd[k] = n;
              setD(nd);
            }}
          />
        ))}
        <Pick label="Multiplier" opts={MULT.map(([a, b]) => [a, b])} val={m} set={setM} />
        <Pick label="Tolerance" opts={TOL.map(([a, b]) => [a, b])} val={t} set={setT} />
      </div>
      <div className="statGrid">
        <Stat label="Resistance" value={ohm(value)} />
        <Stat label="Tolerance" value={TOL[t][2]} />
        <Stat
          label="Range"
          value={`${ohm(value * (1 - parseFloat(TOL[t][2].slice(1)) / 100))} – ${ohm(value * (1 + parseFloat(TOL[t][2].slice(1)) / 100))}`}
        />
      </div>
    </ToolShell>
  );
}

/* ---------- Subnet / CIDR ---------- */
const ipToInt = (ip: string) => {
  const p = ip.trim().split('.').map(Number);
  if (p.length !== 4 || p.some(x => !Number.isInteger(x) || x < 0 || x > 255)) return null;
  return ((p[0] << 24) >>> 0) + (p[1] << 16) + (p[2] << 8) + p[3];
};
const intToIp = (n: number) => [n >>> 24, (n >>> 16) & 255, (n >>> 8) & 255, n & 255].join('.');
export function SubnetCalculator() {
  const [ip, setIp] = useState('192.168.1.10');
  const [cidr, setCidr] = useState(24);
  const n = ipToInt(ip);
  const mask = cidr === 0 ? 0 : (0xffffffff << (32 - cidr)) >>> 0;
  const net = n === null ? 0 : (n & mask) >>> 0;
  const bc = (net | (~mask >>> 0)) >>> 0;
  const total = Math.pow(2, 32 - cidr);
  const usable = cidr >= 31 ? total : total - 2;
  return (
    <ToolShell
      title="IP subnet calculator (IPv4 / CIDR)"
      description="Enter an IPv4 address and prefix length to get the network address, broadcast, subnet mask, host range and number of usable hosts."
      faq={[
        {
          q: 'What does /24 mean?',
          a: 'It is CIDR notation: the first 24 bits are the network part, giving the mask 255.255.255.0 and 254 usable host addresses.',
        },
        {
          q: 'Why are there two fewer usable hosts?',
          a: 'The first address is the network address and the last is the broadcast address. /31 and /32 are special cases with no reserved addresses.',
        },
      ]}
    >
      <div className="controls" style={{ gridTemplateColumns: '2fr 1fr' }}>
        <div className="field">
          <label>IPv4 address</label>
          <input aria-label="IPv4 address" value={ip} onChange={e => setIp(e.target.value)} />
        </div>
        <div className="field">
          <label>Prefix length: /{cidr}</label>
          <select aria-label="Prefix length /" value={cidr} onChange={e => setCidr(+e.target.value)}>
            {Array.from({ length: 33 }, (_, k) => (
              <option key={k} value={k}>
                /{k} — {intToIp(k === 0 ? 0 : (0xffffffff << (32 - k)) >>> 0)}
              </option>
            ))}
          </select>
        </div>
      </div>
      {n === null ? (
        <p className="notice error">Enter a valid IPv4 address such as 10.0.0.1.</p>
      ) : (
        <div className="statGrid" style={{ gridTemplateColumns: '1fr 1fr' }}>
          <Stat label="Network address" value={`${intToIp(net)}/${cidr}`} />
          <Stat label="Subnet mask" value={intToIp(mask)} />
          <Stat label="Broadcast address" value={intToIp(bc)} />
          <Stat label="Wildcard mask" value={intToIp(~mask >>> 0)} />
          <Stat
            label="Usable host range"
            value={
              cidr >= 31 ? `${intToIp(net)} – ${intToIp(bc)}` : `${intToIp(net + 1)} – ${intToIp(bc - 1)}`
            }
          />
          <Stat label="Usable hosts" value={fmt(usable, 0)} />
        </div>
      )}
    </ToolShell>
  );
}

/* ---------- chmod ---------- */
export function ChmodCalculator() {
  const who = ['Owner', 'Group', 'Others'],
    perm = ['Read', 'Write', 'Execute'];
  const [bits, setBits] = useState([
    [true, true, true],
    [true, false, true],
    [true, false, true],
  ]);
  const oct = bits.map(r => (r[0] ? 4 : 0) + (r[1] ? 2 : 0) + (r[2] ? 1 : 0)).join('');
  const sym = bits.map(r => `${r[0] ? 'r' : '-'}${r[1] ? 'w' : '-'}${r[2] ? 'x' : '-'}`).join('');
  const fromOct = (v: string) => {
    if (/^[0-7]{3}$/.test(v))
      setBits(
        [...v].map(c => {
          const n = +c;
          return [!!(n & 4), !!(n & 2), !!(n & 1)];
        }),
      );
  };
  return (
    <ToolShell
      title="Chmod calculator"
      description="Tick the permissions you want for owner, group and others to get the numeric and symbolic chmod value — or type a number to see what it means."
      faq={[
        {
          q: 'What does chmod 755 mean?',
          a: 'The owner can read, write and execute (7); the group and others can read and execute (5).',
        },
        {
          q: 'How do I use the result?',
          a: 'Run chmod followed by the number and the file name, for example: chmod 644 index.html',
        },
      ]}
    >
      <div style={{ overflowX: 'auto' }}>
        <table className="dataTable">
          <thead>
            <tr>
              <th></th>
              {perm.map(p => (
                <th key={p}>{p}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {who.map((w, r) => (
              <tr key={w}>
                <td>
                  <b>{w}</b>
                </td>
                {perm.map((p, c) => (
                  <td key={p}>
                    <input
                      type="checkbox"
                      aria-label={`${w} ${p}`}
                      checked={bits[r][c]}
                      onChange={() =>
                        setBits(b =>
                          b.map((row, i) => (i === r ? row.map((x, j) => (j === c ? !x : x)) : row)),
                        )
                      }
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="controls" style={{ gridTemplateColumns: '1fr 1fr' }}>
        <div className="field">
          <label>Numeric (type to decode)</label>
          <input
            aria-label="Numeric (type to decode)"
            value={oct}
            maxLength={3}
            onChange={e => fromOct(e.target.value)}
          />
        </div>
        <div className="field">
          <label>Symbolic</label>
          <input aria-label="Symbolic" readOnly value={sym} />
        </div>
      </div>
      <div className="monoOut">chmod {oct} filename</div>
    </ToolShell>
  );
}

/* ---------- Quadratic ---------- */
export function QuadraticSolver() {
  const [a, setA] = useState(1);
  const [b, setB] = useState(-3);
  const [c, setC] = useState(2);
  const D = b * b - 4 * a * c;
  let roots = '';
  if (!a) roots = b ? `Linear: x = ${fmt(-c / b)}` : 'Not an equation';
  else if (D > 0)
    roots = `x₁ = ${fmt((-b + Math.sqrt(D)) / (2 * a))},  x₂ = ${fmt((-b - Math.sqrt(D)) / (2 * a))}`;
  else if (D === 0) roots = `x = ${fmt(-b / (2 * a))} (repeated root)`;
  else roots = `x = ${fmt(-b / (2 * a))} ± ${fmt(Math.sqrt(-D) / (2 * a))}i`;
  return (
    <ToolShell
      title="Quadratic equation solver"
      description="Solve ax² + bx + c = 0 for real or complex roots, with the discriminant and vertex shown."
      faq={[
        { q: 'What formula is used?', a: 'The quadratic formula x = (−b ± √(b² − 4ac)) ÷ 2a.' },
        {
          q: 'What does the discriminant tell me?',
          a: 'Positive means two real roots, zero means one repeated root, and negative means two complex roots.',
        },
      ]}
    >
      <div className="controls">
        <Num label="a" value={a} set={setA} />
        <Num label="b" value={b} set={setB} />
        <Num label="c" value={c} set={setC} />
      </div>
      <div className="monoOut" style={{ fontSize: 18 }}>
        {fmt(a)}x² {b < 0 ? '−' : '+'} {fmt(Math.abs(b))}x {c < 0 ? '−' : '+'} {fmt(Math.abs(c))} = 0
      </div>
      <div className="statGrid">
        <Stat label="Roots" value={roots} />
        <Stat label="Discriminant (b² − 4ac)" value={fmt(D)} />
        <Stat label="Vertex" value={a ? `(${fmt(-b / (2 * a))}, ${fmt(c - (b * b) / (4 * a))})` : '—'} />
      </div>
    </ToolShell>
  );
}

/* ---------- Statistics ---------- */
export function StatisticsCalculator() {
  const [raw, setRaw] = useState('12, 15, 18, 22, 22, 30, 41');
  const xs = raw
    .split(/[\s,;]+/)
    .map(Number)
    .filter(Number.isFinite);
  const s = useMemo(() => {
    if (!xs.length) return null;
    const n = xs.length,
      sorted = [...xs].sort((p, q) => p - q),
      sum = xs.reduce((p, q) => p + q, 0),
      mean = sum / n;
    const med = n % 2 ? sorted[(n - 1) / 2] : (sorted[n / 2 - 1] + sorted[n / 2]) / 2;
    const cnt = new Map<number, number>();
    xs.forEach(x => cnt.set(x, (cnt.get(x) || 0) + 1));
    const mx = Math.max(...cnt.values());
    const mode =
      mx > 1
        ? [...cnt]
            .filter(([, v]) => v === mx)
            .map(([k]) => k)
            .join(', ')
        : 'None';
    const ss = xs.reduce((p, x) => p + (x - mean) ** 2, 0);
    return {
      n,
      sum,
      mean,
      med,
      mode,
      min: sorted[0],
      max: sorted[n - 1],
      range: sorted[n - 1] - sorted[0],
      popSd: Math.sqrt(ss / n),
      sampSd: n > 1 ? Math.sqrt(ss / (n - 1)) : NaN,
      variance: n > 1 ? ss / (n - 1) : NaN,
    };
  }, [raw]); // eslint-disable-line react-hooks/exhaustive-deps
  return (
    <ToolShell
      title="Statistics calculator"
      description="Paste a list of numbers to get the mean, median, mode, range, variance and standard deviation."
      faq={[
        {
          q: 'How should I enter numbers?',
          a: 'Separate them with commas, spaces, semicolons or new lines. Anything that is not a number is ignored.',
        },
        {
          q: 'Sample or population standard deviation?',
          a: 'Both are shown. Use sample (n − 1) when your data is a sample of a larger group, population (n) when it is the whole group.',
        },
      ]}
    >
      <div className="field">
        <label>Numbers</label>
        <textarea
          aria-label="Numbers"
          className="textArea"
          style={{ minHeight: 120 }}
          value={raw}
          onChange={e => setRaw(e.target.value)}
        />
      </div>
      {s ? (
        <div className="statGrid">
          <Stat label="Count" value={fmt(s.n, 0)} />
          <Stat label="Sum" value={fmt(s.sum)} />
          <Stat label="Mean" value={fmt(s.mean)} />
          <Stat label="Median" value={fmt(s.med)} />
          <Stat label="Mode" value={s.mode} />
          <Stat label="Range" value={`${fmt(s.min)} – ${fmt(s.max)} (${fmt(s.range)})`} />
          <Stat label="Sample std. deviation" value={fmt(s.sampSd)} />
          <Stat label="Population std. deviation" value={fmt(s.popSd)} />
          <Stat label="Sample variance" value={fmt(s.variance)} />
        </div>
      ) : (
        <p className="notice error">Enter at least one number.</p>
      )}
    </ToolShell>
  );
}

/* ---------- GPA ---------- */
const GRADES: [string, number][] = [
  ['A+', 4],
  ['A', 4],
  ['A-', 3.7],
  ['B+', 3.3],
  ['B', 3],
  ['B-', 2.7],
  ['C+', 2.3],
  ['C', 2],
  ['C-', 1.7],
  ['D+', 1.3],
  ['D', 1],
  ['F', 0],
];
export function GpaCalculator() {
  const [rows, setRows] = useState([
    { name: 'Mathematics', credits: 3, grade: 'A' },
    { name: 'Physics', credits: 4, grade: 'B+' },
    { name: 'English', credits: 2, grade: 'A-' },
  ]);
  const pts = Object.fromEntries(GRADES);
  const cr = rows.reduce((a, r) => a + (r.credits || 0), 0);
  const gpa = cr ? rows.reduce((a, r) => a + (r.credits || 0) * pts[r.grade], 0) / cr : NaN;
  const upd = (i: number, k: string, v: string | number) =>
    setRows(rs => rs.map((r, j) => (j === i ? { ...r, [k]: v } : r)));
  return (
    <ToolShell
      title="GPA calculator"
      description="Add your courses, credit hours and letter grades to calculate your GPA on the 4.0 scale."
      faq={[
        {
          q: 'How is GPA calculated?',
          a: 'Each grade’s points are multiplied by the course credits, added together and divided by the total credits.',
        },
        {
          q: 'Does my university use the same scale?',
          a: 'Most use a 4.0 scale like this one, but some differ slightly (for example A+ = 4.3). Check your university’s grading policy.',
        },
      ]}
    >
      <div style={{ overflowX: 'auto' }}>
        <table className="dataTable">
          <thead>
            <tr>
              <th>Course</th>
              <th>Credits</th>
              <th>Grade</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={i}>
                <td>
                  <input
                    className="cellInput"
                    value={r.name}
                    onChange={e => upd(i, 'name', e.target.value)}
                    aria-label="Course name"
                  />
                </td>
                <td>
                  <input
                    className="cellInput"
                    type="number"
                    min={0}
                    value={r.credits}
                    onChange={e => upd(i, 'credits', +e.target.value)}
                    aria-label="Credits"
                    style={{ width: 80 }}
                  />
                </td>
                <td>
                  <select
                    className="cellInput"
                    value={r.grade}
                    onChange={e => upd(i, 'grade', e.target.value)}
                    aria-label="Grade"
                  >
                    {GRADES.map(([g, p]) => (
                      <option key={g} value={g}>
                        {g} ({p})
                      </option>
                    ))}
                  </select>
                </td>
                <td>
                  <button
                    className="btn btnGhost"
                    onClick={() => setRows(rs => rs.filter((_, j) => j !== i))}
                    aria-label="Remove course"
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="rowBtns">
        <button
          className="btn btnGhost"
          onClick={() => setRows(rs => [...rs, { name: `Course ${rs.length + 1}`, credits: 3, grade: 'B' }])}
        >
          Add course
        </button>
      </div>
      <div className="statGrid">
        <Stat label="GPA" value={fmt(gpa, 2)} />
        <Stat label="Total credits" value={fmt(cr, 1)} />
        <Stat label="Courses" value={String(rows.length)} />
      </div>
    </ToolShell>
  );
}

/* ---------- Fraction ---------- */
const gcd = (a: number, b: number): number => (b ? gcd(b, a % b) : Math.abs(a));
export function FractionCalculator() {
  const [a, setA] = useState('3/4');
  const [op, setOp] = useState('+');
  const [b, setB] = useState('2/3');
  const parse = (s: string) => {
    const m = s.trim().match(/^(-?\d+)(?:\s+(\d+)\/(\d+)|\/(\d+))?$/);
    if (!m) return null;
    if (m[2]) {
      const w = +m[1],
        n = +m[2],
        d = +m[3];
      return d ? [w * d + (w < 0 ? -n : n), d] : null;
    }
    if (m[4]) return +m[4] ? [+m[1], +m[4]] : null;
    return [+m[1], 1];
  };
  const x = parse(a),
    y = parse(b);
  let res: [number, number] | null = null;
  if (x && y) {
    let n = 0,
      d = 1;
    if (op === '+') {
      n = x[0] * y[1] + y[0] * x[1];
      d = x[1] * y[1];
    } else if (op === '−') {
      n = x[0] * y[1] - y[0] * x[1];
      d = x[1] * y[1];
    } else if (op === '×') {
      n = x[0] * y[0];
      d = x[1] * y[1];
    } else {
      n = x[0] * y[1];
      d = x[1] * y[0];
    }
    if (d) {
      if (d < 0) {
        n = -n;
        d = -d;
      }
      const g = gcd(n, d) || 1;
      res = [n / g, d / g];
    }
  }
  const mixed =
    res && Math.abs(res[0]) >= res[1] && res[1] !== 1
      ? `${Math.trunc(res[0] / res[1])} ${Math.abs(res[0] % res[1])}/${res[1]}`
      : '';
  return (
    <ToolShell
      title="Fraction calculator"
      description="Add, subtract, multiply and divide fractions and mixed numbers, with the answer simplified."
      faq={[
        {
          q: 'How do I type a mixed number?',
          a: 'Put a space between the whole number and the fraction, for example 1 1/2.',
        },
        {
          q: 'Is the answer simplified?',
          a: 'Yes. Results are reduced to lowest terms and also shown as a mixed number and a decimal.',
        },
      ]}
    >
      <div className="controls" style={{ gridTemplateColumns: '2fr 1fr 2fr' }}>
        <div className="field">
          <label>First fraction</label>
          <input aria-label="First fraction" value={a} onChange={e => setA(e.target.value)} />
        </div>
        <div className="field">
          <label>Operation</label>
          <select aria-label="Operation" value={op} onChange={e => setOp(e.target.value)}>
            {['+', '−', '×', '÷'].map(o => (
              <option key={o}>{o}</option>
            ))}
          </select>
        </div>
        <div className="field">
          <label>Second fraction</label>
          <input aria-label="Second fraction" value={b} onChange={e => setB(e.target.value)} />
        </div>
      </div>
      {res ? (
        <div className="statGrid">
          <Stat label="Simplified" value={res[1] === 1 ? String(res[0]) : `${res[0]}/${res[1]}`} />
          <Stat label="Mixed number" value={mixed || '—'} />
          <Stat label="Decimal" value={fmt(res[0] / res[1], 6)} />
        </div>
      ) : (
        <p className="notice error">Enter fractions like 3/4, 5 or 1 1/2 (and don’t divide by zero).</p>
      )}
    </ToolShell>
  );
}

/* ---------- Compound interest ---------- */
export function CompoundInterestCalculator() {
  const [p, setP] = useState(100000);
  const [monthly, setMonthly] = useState(5000);
  const [rate, setRate] = useState(10);
  const [years, setYears] = useState(10);
  const [freq, setFreq] = useState(12);
  const rows = useMemo(() => {
    const out: { y: number; bal: number; dep: number }[] = [];
    let bal = p || 0,
      dep = p || 0;
    const r = (rate || 0) / 100 / freq;
    const perMonth = freq / 12;
    for (let y = 1; y <= Math.min(60, years || 0); y++) {
      for (let mth = 0; mth < 12; mth++) {
        bal += monthly || 0;
        dep += monthly || 0;
        bal *= Math.pow(1 + r, perMonth);
      }
      out.push({ y, bal, dep });
    }
    return out;
  }, [p, monthly, rate, years, freq]);
  const last = rows[rows.length - 1];
  return (
    <ToolShell
      title="Compound interest calculator"
      description="See how savings grow with compound interest and regular monthly deposits, year by year."
      faq={[
        {
          q: 'What is compound interest?',
          a: 'Interest that is added to your balance, so the next period earns interest on the interest too.',
        },
        {
          q: 'Are the results guaranteed?',
          a: 'No. They assume a constant rate. Real investment returns go up and down; this is an estimate, not financial advice.',
        },
      ]}
    >
      <div className="controls">
        <Num label="Starting amount" value={p} set={setP} />
        <Num label="Monthly deposit" value={monthly} set={setMonthly} />
        <Num label="Interest rate (% per year)" value={rate} set={setRate} />
        <Num label="Years" value={years} set={setYears} />
        <div className="field">
          <label>Compounding</label>
          <select aria-label="Compounding" value={freq} onChange={e => setFreq(+e.target.value)}>
            <option value={1}>Yearly</option>
            <option value={4}>Quarterly</option>
            <option value={12}>Monthly</option>
            <option value={365}>Daily</option>
          </select>
        </div>
      </div>
      {last && (
        <div className="statGrid">
          <Stat label="Final balance" value={money(last.bal)} />
          <Stat label="Total deposited" value={money(last.dep)} />
          <Stat label="Interest earned" value={money(last.bal - last.dep)} />
        </div>
      )}
      <div style={{ overflowX: 'auto', marginTop: 18 }}>
        <table className="dataTable">
          <thead>
            <tr>
              <th>Year</th>
              <th>Deposited</th>
              <th>Balance</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(x => (
              <tr key={x.y}>
                <td>{x.y}</td>
                <td>{money(x.dep)}</td>
                <td>{money(x.bal)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </ToolShell>
  );
}

/* ---------- Discount ---------- */
export function DiscountCalculator() {
  const [price, setPrice] = useState(2500);
  const [off, setOff] = useState(20);
  const [extra, setExtra] = useState(0);
  const after1 = price * (1 - off / 100),
    final = after1 * (1 - extra / 100);
  return (
    <ToolShell
      title="Discount calculator"
      description="Find the sale price and how much you save, including a second “extra” discount on top."
      faq={[
        {
          q: 'Is 20% + 10% the same as 30% off?',
          a: 'No. The second discount applies to the already-reduced price, so 20% then 10% equals 28% off in total.',
        },
      ]}
    >
      <div className="controls">
        <Num label="Original price" value={price} set={setPrice} />
        <Num label="Discount (%)" value={off} set={setOff} />
        <Num label="Extra discount (%)" value={extra} set={setExtra} />
      </div>
      <div className="statGrid">
        <Stat label="Final price" value={money(final)} />
        <Stat label="You save" value={money(price - final)} />
        <Stat label="Total discount" value={`${fmt(price ? (1 - final / price) * 100 : 0, 2)}%`} />
      </div>
    </ToolShell>
  );
}

/* ---------- VAT / sales tax ---------- */
export function VatCalculator() {
  const [amount, setAmount] = useState(1000);
  const [rate, setRate] = useState(18);
  const [mode, setMode] = useState<'add' | 'remove'>('add');
  const net = mode === 'add' ? amount : amount / (1 + rate / 100);
  const tax = (net * rate) / 100;
  const gross = net + tax;
  return (
    <ToolShell
      title="VAT & sales tax calculator"
      description="Add tax to a net price or remove it from a gross price, for any VAT, GST or sales-tax rate."
      faq={[
        {
          q: 'How do I remove VAT from a price?',
          a: 'Divide the gross price by 1 plus the rate. For 18%: gross ÷ 1.18 = net price.',
        },
        {
          q: 'Does it work for GST and sales tax?',
          a: 'Yes. Enter the rate that applies in your country or state.',
        },
      ]}
    >
      <div className="rowBtns" style={{ marginTop: 0 }}>
        <button
          className={`btn ${mode === 'add' ? 'btnPrimary' : 'btnGhost'}`}
          onClick={() => setMode('add')}
        >
          Add tax
        </button>
        <button
          className={`btn ${mode === 'remove' ? 'btnPrimary' : 'btnGhost'}`}
          onClick={() => setMode('remove')}
        >
          Remove tax
        </button>
      </div>
      <div className="controls" style={{ gridTemplateColumns: '1fr 1fr' }}>
        <Num
          label={mode === 'add' ? 'Net amount (before tax)' : 'Gross amount (tax included)'}
          value={amount}
          set={setAmount}
        />
        <Num label="Tax rate (%)" value={rate} set={setRate} />
      </div>
      <div className="rowBtns">
        {[5, 10, 15, 17, 18, 20].map(v => (
          <button
            key={v}
            className={`btn ${rate === v ? 'btnPrimary' : 'btnGhost'}`}
            onClick={() => setRate(v)}
          >
            {v}%
          </button>
        ))}
      </div>
      <div className="statGrid">
        <Stat label="Net" value={money(net)} />
        <Stat label="Tax" value={money(tax)} />
        <Stat label="Gross" value={money(gross)} />
      </div>
    </ToolShell>
  );
}

/* ---------- Fuel cost ---------- */
export function FuelCostCalculator() {
  const [dist, setDist] = useState(300);
  const [eff, setEff] = useState(12);
  const [price, setPrice] = useState(270);
  const [people, setPeople] = useState(1);
  const [unit, setUnit] = useState<'km' | 'mi'>('km');
  const fuel = unit === 'km' ? dist / eff : dist / eff;
  const cost = fuel * price;
  return (
    <ToolShell
      title="Fuel cost calculator"
      description="Work out how much fuel a trip needs and what it will cost, and split it between passengers."
      faq={[
        {
          q: 'Which units can I use?',
          a: 'Kilometres with km per litre, or miles with miles per gallon. Enter the fuel price per litre or per gallon to match.',
        },
      ]}
    >
      <div className="rowBtns" style={{ marginTop: 0 }}>
        <button className={`btn ${unit === 'km' ? 'btnPrimary' : 'btnGhost'}`} onClick={() => setUnit('km')}>
          km & litres
        </button>
        <button className={`btn ${unit === 'mi' ? 'btnPrimary' : 'btnGhost'}`} onClick={() => setUnit('mi')}>
          miles & gallons
        </button>
      </div>
      <div className="controls">
        <Num label={`Distance (${unit})`} value={dist} set={setDist} />
        <Num
          label={unit === 'km' ? 'Efficiency (km per litre)' : 'Efficiency (miles per gallon)'}
          value={eff}
          set={setEff}
        />
        <Num label={`Fuel price (per ${unit === 'km' ? 'litre' : 'gallon'})`} value={price} set={setPrice} />
        <Num label="People sharing" value={people} set={v => setPeople(Math.max(1, v || 1))} />
      </div>
      <div className="statGrid">
        <Stat label={`Fuel needed (${unit === 'km' ? 'litres' : 'gallons'})`} value={fmt(fuel, 2)} />
        <Stat label="Trip cost" value={money(cost)} />
        <Stat label="Per person" value={money(cost / people)} />
      </div>
    </ToolShell>
  );
}

/* ---------- Calories (BMR/TDEE) ---------- */
export function CalorieCalculator() {
  const [sex, setSex] = useState<'m' | 'f'>('m');
  const [age, setAge] = useState(30);
  const [h, setH] = useState(175);
  const [w, setW] = useState(72);
  const [act, setAct] = useState(1.375);
  const bmr = 10 * w + 6.25 * h - 5 * age + (sex === 'm' ? 5 : -161);
  const tdee = bmr * act;
  return (
    <ToolShell
      title="Calorie calculator (BMR & TDEE)"
      description="Estimate your basal metabolic rate and the daily calories you burn based on age, size and activity level."
      faq={[
        { q: 'Which formula is used?', a: 'The Mifflin–St Jeor equation, which is widely used for adults.' },
        {
          q: 'Is this medical advice?',
          a: 'No. It is a general estimate for healthy adults. Speak to a doctor or dietitian before changing your diet, especially if you are pregnant, under 18 or have a health condition.',
        },
      ]}
    >
      <div className="rowBtns" style={{ marginTop: 0 }}>
        <button className={`btn ${sex === 'm' ? 'btnPrimary' : 'btnGhost'}`} onClick={() => setSex('m')}>
          Male
        </button>
        <button className={`btn ${sex === 'f' ? 'btnPrimary' : 'btnGhost'}`} onClick={() => setSex('f')}>
          Female
        </button>
      </div>
      <div className="controls">
        <Num label="Age (years)" value={age} set={setAge} />
        <Num label="Height (cm)" value={h} set={setH} />
        <Num label="Weight (kg)" value={w} set={setW} />
        <div className="field">
          <label>Activity</label>
          <select aria-label="Activity" value={act} onChange={e => setAct(+e.target.value)}>
            <option value={1.2}>Little or no exercise</option>
            <option value={1.375}>Light (1–3 days/week)</option>
            <option value={1.55}>Moderate (3–5 days/week)</option>
            <option value={1.725}>Hard (6–7 days/week)</option>
            <option value={1.9}>Very hard or physical job</option>
          </select>
        </div>
      </div>
      <div className="statGrid">
        <Stat label="BMR (at rest)" value={`${fmt(bmr, 0)} kcal/day`} />
        <Stat label="Daily calories (TDEE)" value={`${fmt(tdee, 0)} kcal/day`} />
        <Stat label="Activity factor" value={`×${act}`} />
      </div>
    </ToolShell>
  );
}
