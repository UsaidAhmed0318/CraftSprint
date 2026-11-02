'use client';
import { useEffect, useMemo, useRef, useState } from 'react';
import ToolShell from '@/components/shared/ToolShell';
import Dropzone from '@/components/shared/Dropzone';
import { money, Stat } from '@/components/shared/ui';
const fmt = (n: number, d = 2) =>
  Number.isFinite(n) ? n.toLocaleString(undefined, { maximumFractionDigits: d }) : '—';

function useCopy() {
  const [done, setDone] = useState(false);
  return {
    done,
    copy: (t: string) => {
      navigator.clipboard
        ?.writeText(t)
        .then(() => {
          setDone(true);
          setTimeout(() => setDone(false), 1400);
        })
        .catch(() => {});
    },
  };
}

/* ---------- Age calculator ---------- */
export function AgeCalculator() {
  const today = new Date().toISOString().slice(0, 10);
  const [dob, setDob] = useState('2000-01-01');
  const [on, setOn] = useState(today);
  const r = useMemo(() => {
    const a = new Date(dob + 'T00:00:00'),
      b = new Date(on + 'T00:00:00');
    if (isNaN(+a) || isNaN(+b) || b < a) return null;
    let y = b.getFullYear() - a.getFullYear(),
      m = b.getMonth() - a.getMonth(),
      d = b.getDate() - a.getDate();
    if (d < 0) {
      m--;
      d += new Date(b.getFullYear(), b.getMonth(), 0).getDate();
    }
    if (m < 0) {
      y--;
      m += 12;
    }
    const days = Math.round((+b - +a) / 864e5);
    let next = new Date(b.getFullYear(), a.getMonth(), a.getDate());
    if (next < b) next = new Date(b.getFullYear() + 1, a.getMonth(), a.getDate());
    const toNext = Math.round((+next - +b) / 864e5);
    return {
      y,
      m,
      d,
      days,
      weeks: Math.floor(days / 7),
      toNext,
      weekday: a.toLocaleDateString(undefined, { weekday: 'long' }),
    };
  }, [dob, on]);
  return (
    <ToolShell
      title="Age calculator"
      description="Enter a date of birth to see the exact age in years, months and days, the total days lived and the countdown to the next birthday."
      faq={[
        {
          q: 'How is the age calculated?',
          a: 'The calculator counts whole years and months between the two dates, then the remaining days, adjusting for the length of each month.',
        },
        {
          q: 'Can I calculate age on a past or future date?',
          a: 'Yes. Change the “Age on” date to any date after the date of birth.',
        },
        {
          q: 'Does it handle leap years?',
          a: 'Yes. Total days use the real calendar, so leap days are included automatically.',
        },
      ]}
    >
      <div className="controls">
        <div className="field">
          <label>Date of birth</label>
          <input
            aria-label="Date of birth"
            type="date"
            value={dob}
            max={on}
            onChange={e => setDob(e.target.value)}
          />
        </div>
        <div className="field">
          <label>Age on</label>
          <input aria-label="Age on" type="date" value={on} onChange={e => setOn(e.target.value)} />
        </div>
      </div>
      {r ? (
        <div className="statGrid">
          <Stat label="Age" value={`${r.y} years, ${r.m} months, ${r.d} days`} />
          <Stat label="Total days lived" value={fmt(r.days, 0)} />
          <Stat label="Total weeks" value={fmt(r.weeks, 0)} />
          <Stat
            label="Next birthday in"
            value={r.toNext === 0 ? 'Today — happy birthday!' : `${r.toNext} days`}
          />
          <Stat label="Born on a" value={r.weekday} />
        </div>
      ) : (
        <p className="notice error">The “Age on” date must be after the date of birth.</p>
      )}
    </ToolShell>
  );
}

/* ---------- BMI ---------- */
export function BmiCalculator() {
  const [unit, setUnit] = useState<'metric' | 'imperial'>('metric');
  const [cm, setCm] = useState(170);
  const [kg, setKg] = useState(65);
  const [ft, setFt] = useState(5);
  const [inch, setInch] = useState(7);
  const [lb, setLb] = useState(145);
  const h = unit === 'metric' ? cm / 100 : ((ft * 12 + inch) * 2.54) / 100;
  const w = unit === 'metric' ? kg : lb * 0.453592;
  const bmi = h > 0 ? w / (h * h) : NaN;
  const band = bmi < 18.5 ? 'Underweight' : bmi < 25 ? 'Healthy weight' : bmi < 30 ? 'Overweight' : 'Obese';
  const lo = 18.5 * h * h,
    hi = 24.9 * h * h;
  return (
    <ToolShell
      title="BMI calculator"
      description="Work out body mass index from your height and weight, in metric or imperial units, and see the healthy weight range for your height."
      faq={[
        {
          q: 'What is BMI?',
          a: 'Body mass index is weight in kilograms divided by height in metres squared. It is a quick screening number, not a diagnosis.',
        },
        {
          q: 'What are the BMI ranges for adults?',
          a: 'Below 18.5 is underweight, 18.5 to 24.9 is a healthy weight, 25 to 29.9 is overweight and 30 or above is obese (WHO adult categories).',
        },
        {
          q: 'Is BMI accurate for everyone?',
          a: 'No. It does not account for muscle, age, sex or ethnicity, and it is not meant for children. Talk to a doctor for personal health advice.',
        },
      ]}
    >
      <div className="rowBtns" style={{ marginTop: 0 }}>
        {(['metric', 'imperial'] as const).map(u => (
          <button
            key={u}
            className={`btn ${unit === u ? 'btnPrimary' : 'btnGhost'}`}
            onClick={() => setUnit(u)}
          >
            {u === 'metric' ? 'Metric (cm, kg)' : 'Imperial (ft, lb)'}
          </button>
        ))}
      </div>
      {unit === 'metric' ? (
        <div className="controls">
          <div className="field">
            <label>Height (cm)</label>
            <input aria-label="Height (cm)" type="number" value={cm} onChange={e => setCm(+e.target.value)} />
          </div>
          <div className="field">
            <label>Weight (kg)</label>
            <input aria-label="Weight (kg)" type="number" value={kg} onChange={e => setKg(+e.target.value)} />
          </div>
        </div>
      ) : (
        <div className="controls">
          <div className="field">
            <label>Height (ft)</label>
            <input aria-label="Height (ft)" type="number" value={ft} onChange={e => setFt(+e.target.value)} />
          </div>
          <div className="field">
            <label>Height (in)</label>
            <input
              aria-label="Height (in)"
              type="number"
              value={inch}
              onChange={e => setInch(+e.target.value)}
            />
          </div>
          <div className="field">
            <label>Weight (lb)</label>
            <input aria-label="Weight (lb)" type="number" value={lb} onChange={e => setLb(+e.target.value)} />
          </div>
        </div>
      )}
      <div className="statGrid">
        <Stat label="Your BMI" value={fmt(bmi, 1)} />
        <Stat label="Category (adults)" value={Number.isFinite(bmi) ? band : '—'} />
        <Stat
          label="Healthy weight for your height"
          value={
            unit === 'metric'
              ? `${fmt(lo, 1)}–${fmt(hi, 1)} kg`
              : `${fmt(lo / 0.453592, 0)}–${fmt(hi / 0.453592, 0)} lb`
          }
        />
      </div>
    </ToolShell>
  );
}

/* ---------- Loan EMI ---------- */
export function LoanEmiCalculator() {
  const [p, setP] = useState(1000000);
  const [rate, setRate] = useState(12);
  const [years, setYears] = useState(5);
  const n = years * 12,
    r = rate / 1200;
  const emi = r === 0 ? p / n : (p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
  const total = emi * n,
    interest = total - p;
  const rows = useMemo(() => {
    const out: { y: number; principal: number; interest: number; balance: number }[] = [];
    let bal = p;
    for (let y = 1; y <= years; y++) {
      let pi = 0,
        ii = 0;
      for (let m = 0; m < 12 && bal > 0.005; m++) {
        const i = bal * r;
        const pr = Math.min(emi - i, bal);
        pi += pr;
        ii += i;
        bal -= pr;
      }
      out.push({ y, principal: pi, interest: ii, balance: Math.max(bal, 0) });
    }
    return out;
  }, [p, r, years, emi]);
  return (
    <ToolShell
      title="Loan EMI calculator"
      description="Calculate the monthly instalment (EMI) for any loan, plus total interest and a year-by-year repayment schedule."
      faq={[
        {
          q: 'What is EMI?',
          a: 'An equated monthly instalment is the fixed amount you pay every month so that the loan and its interest are fully repaid by the end of the term.',
        },
        {
          q: 'Which formula is used?',
          a: 'EMI = P × r × (1 + r)^n ÷ ((1 + r)^n − 1), where P is the loan amount, r the monthly interest rate and n the number of months.',
        },
        {
          q: 'Does it work for any currency?',
          a: 'Yes. Enter amounts in any currency; the results are in the same currency.',
        },
      ]}
    >
      <div className="controls">
        <div className="field">
          <label>Loan amount</label>
          <input aria-label="Loan amount" type="number" value={p} onChange={e => setP(+e.target.value)} />
        </div>
        <div className="field">
          <label>Interest rate (% per year)</label>
          <input
            aria-label="Interest rate (% per year)"
            type="number"
            step="0.1"
            value={rate}
            onChange={e => setRate(+e.target.value)}
          />
        </div>
        <div className="field">
          <label>Term (years)</label>
          <input
            aria-label="Term (years)"
            type="number"
            min={1}
            max={40}
            value={years}
            onChange={e => setYears(Math.max(1, +e.target.value))}
          />
        </div>
      </div>
      <div className="statGrid">
        <Stat label="Monthly EMI" value={money(emi)} />
        <Stat label="Total interest" value={money(interest)} />
        <Stat label="Total repayment" value={money(total)} />
      </div>
      <div style={{ overflowX: 'auto', marginTop: 18 }}>
        <table className="dataTable">
          <thead>
            <tr>
              <th>Year</th>
              <th>Principal paid</th>
              <th>Interest paid</th>
              <th>Balance left</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(x => (
              <tr key={x.y}>
                <td>{x.y}</td>
                <td>{money(x.principal)}</td>
                <td>{money(x.interest)}</td>
                <td>{money(x.balance)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </ToolShell>
  );
}

/* ---------- Tip & bill splitter ---------- */
export function TipBillSplitter() {
  const [bill, setBill] = useState(5000);
  const [tip, setTip] = useState(10);
  const [people, setPeople] = useState(4);
  const t = (bill * tip) / 100,
    total = bill + t,
    each = total / Math.max(1, people);
  return (
    <ToolShell
      title="Tip & bill splitter"
      description="Add a tip to any bill and split the total evenly between everyone at the table."
      faq={[
        {
          q: 'How is the tip calculated?',
          a: 'The tip is a percentage of the bill before tip. It is added to the bill and the total is divided by the number of people.',
        },
        { q: 'Can I use it without a tip?', a: 'Yes. Set the tip to 0% to simply split a bill.' },
      ]}
    >
      <div className="controls">
        <div className="field">
          <label>Bill amount</label>
          <input
            aria-label="Bill amount"
            type="number"
            value={bill}
            onChange={e => setBill(+e.target.value)}
          />
        </div>
        <div className="field">
          <label>Tip (%)</label>
          <input aria-label="Tip (%)" type="number" value={tip} onChange={e => setTip(+e.target.value)} />
        </div>
        <div className="field">
          <label>People</label>
          <input
            aria-label="People"
            type="number"
            min={1}
            value={people}
            onChange={e => setPeople(Math.max(1, +e.target.value))}
          />
        </div>
      </div>
      <div className="rowBtns">
        {[0, 5, 10, 15, 20].map(v => (
          <button
            key={v}
            className={`btn ${tip === v ? 'btnPrimary' : 'btnGhost'}`}
            onClick={() => setTip(v)}
          >
            {v}%
          </button>
        ))}
      </div>
      <div className="statGrid">
        <Stat label="Tip" value={money(t)} />
        <Stat label="Total with tip" value={money(total)} />
        <Stat label="Each person pays" value={money(each)} />
      </div>
    </ToolShell>
  );
}

/* ---------- Zakat ---------- */
export function ZakatCalculator() {
  const fields = [
    'Cash at home and in bank accounts',
    'Gold and silver you own (market value)',
    'Investments, shares and savings schemes',
    'Business stock and money owed to you',
    'Other zakatable assets',
  ];
  const [vals, setVals] = useState<number[]>(fields.map(() => 0));
  const [debts, setDebts] = useState(0);
  const [nisab, setNisab] = useState(0);
  const assets = vals.reduce((a, b) => a + (b || 0), 0),
    net = Math.max(0, assets - debts),
    due = nisab > 0 && net >= nisab ? net * 0.025 : 0;
  return (
    <ToolShell
      title="Zakat calculator"
      description="Add up your zakatable wealth, subtract short-term debts and see the 2.5% zakat due once your wealth reaches the nisab."
      faq={[
        {
          q: 'What is nisab?',
          a: 'Nisab is the minimum wealth a person must hold for a full lunar year before zakat is due. It is commonly set at the value of 87.48 g of gold or 612.36 g of silver; check today’s price with a local scholar or mosque.',
        },
        { q: 'What rate is used?', a: 'Zakat on wealth is 2.5% of net zakatable assets.' },
        {
          q: 'Is this a religious ruling?',
          a: 'No. It is an estimate for convenience. Rules on specific assets differ between schools of thought, so confirm with a qualified scholar.',
        },
      ]}
    >
      <div className="controls" style={{ gridTemplateColumns: 'repeat(2,1fr)' }}>
        {fields.map((f, i) => (
          <div className="field" key={f}>
            <label>{f}</label>
            <input
              aria-label={f}
              type="number"
              min={0}
              value={vals[i] || ''}
              placeholder="0"
              onChange={e => {
                const v = [...vals];
                v[i] = +e.target.value;
                setVals(v);
              }}
            />
          </div>
        ))}
        <div className="field">
          <label>Short-term debts due now</label>
          <input
            aria-label="Short-term debts due now"
            type="number"
            min={0}
            value={debts || ''}
            placeholder="0"
            onChange={e => setDebts(+e.target.value)}
          />
        </div>
        <div className="field">
          <label>Today&apos;s nisab value (same currency)</label>
          <input
            aria-label="Today's nisab value (same currency)"
            type="number"
            min={0}
            value={nisab || ''}
            placeholder="Enter current nisab"
            onChange={e => setNisab(+e.target.value)}
          />
        </div>
      </div>
      <div className="statGrid">
        <Stat label="Total assets" value={money(assets)} />
        <Stat label="Net zakatable wealth" value={money(net)} />
        <Stat label="Zakat due (2.5%)" value={nisab > 0 ? money(due) : 'Enter nisab'} />
      </div>
      {nisab > 0 && net < nisab && (
        <p className="notice">Your net wealth is below the nisab you entered, so no zakat is due on it.</p>
      )}
    </ToolShell>
  );
}

/* ---------- Number base ---------- */
export function NumberBaseConverter() {
  const [input, setInput] = useState('255');
  const [base, setBase] = useState(10);
  const { done, copy } = useCopy();
  let value: bigint | null = null;
  try {
    const clean = input
      .trim()
      .toLowerCase()
      .replace(/^0[xbo]/, '');
    if (clean && [...clean].every(c => parseInt(c, base) < base && !isNaN(parseInt(c, base)))) {
      value = [...clean].reduce((a, c) => a * BigInt(base) + BigInt(parseInt(c, base)), BigInt(0));
    }
  } catch {
    value = null;
  }
  const outs = [
    ['Binary', 2],
    ['Octal', 8],
    ['Decimal', 10],
    ['Hexadecimal', 16],
  ] as const;
  return (
    <ToolShell
      title="Number base converter"
      description="Convert whole numbers between binary, octal, decimal and hexadecimal. Handles very large numbers."
      faq={[
        {
          q: 'Which bases are supported?',
          a: 'Binary (base 2), octal (base 8), decimal (base 10) and hexadecimal (base 16).',
        },
        {
          q: 'Can I paste values with 0x or 0b prefixes?',
          a: 'Yes. Prefixes like 0x, 0b and 0o are ignored automatically.',
        },
      ]}
    >
      <div className="controls">
        <div className="field">
          <label>Number</label>
          <input aria-label="Number" value={input} onChange={e => setInput(e.target.value)} />
        </div>
        <div className="field">
          <label>Input base</label>
          <select aria-label="Input base" value={base} onChange={e => setBase(+e.target.value)}>
            {outs.map(([n, b]) => (
              <option key={b} value={b}>
                {n} (base {b})
              </option>
            ))}
          </select>
        </div>
      </div>
      {value === null ? (
        <p className="notice error">That is not a valid base-{base} number.</p>
      ) : (
        <div className="statGrid" style={{ gridTemplateColumns: '1fr 1fr' }}>
          {outs.map(([n, b]) => (
            <button
              key={b}
              className="statBox"
              style={{ textAlign: 'left', cursor: 'pointer', color: 'inherit' }}
              onClick={() => copy(value!.toString(b).toUpperCase())}
            >
              <span>{n} — click to copy</span>
              <b style={{ fontSize: 18 }}>{value!.toString(b).toUpperCase()}</b>
            </button>
          ))}
        </div>
      )}
      {done && <p className="notice">Copied</p>}
    </ToolShell>
  );
}

/* ---------- Roman numerals ---------- */
const ROMAN: [number, string][] = [
  [1000, 'M'],
  [900, 'CM'],
  [500, 'D'],
  [400, 'CD'],
  [100, 'C'],
  [90, 'XC'],
  [50, 'L'],
  [40, 'XL'],
  [10, 'X'],
  [9, 'IX'],
  [5, 'V'],
  [4, 'IV'],
  [1, 'I'],
];
const toRoman = (n: number) => {
  let s = '';
  for (const [v, r] of ROMAN)
    while (n >= v) {
      s += r;
      n -= v;
    }
  return s;
};
const fromRoman = (s: string) => {
  const m: Record<string, number> = { I: 1, V: 5, X: 10, L: 50, C: 100, D: 500, M: 1000 };
  let t = 0;
  const u = s.toUpperCase();
  for (let i = 0; i < u.length; i++) {
    const a = m[u[i]],
      b = m[u[i + 1]];
    if (!a) return NaN;
    t += b > a ? -a : a;
  }
  return toRoman(t) === u ? t : NaN;
};
export function RomanNumeralConverter() {
  const [num, setNum] = useState(2026);
  const [rom, setRom] = useState('MMXXVI');
  const r = num >= 1 && num <= 3999 ? toRoman(Math.floor(num)) : '';
  const n = fromRoman(rom.trim());
  return (
    <ToolShell
      title="Roman numeral converter"
      description="Convert numbers from 1 to 3999 into Roman numerals, or read any Roman numeral as a number."
      faq={[
        {
          q: 'Why only up to 3999?',
          a: 'Standard Roman numerals have no symbol above M (1000), so 3999 (MMMCMXCIX) is the largest number they can write without special notation.',
        },
        {
          q: 'Does it check invalid numerals?',
          a: 'Yes. Numerals that break the standard rules, such as IIII or VX, are rejected.',
        },
      ]}
    >
      <div className="controls" style={{ gridTemplateColumns: '1fr 1fr' }}>
        <div className="field">
          <label>Number (1–3999)</label>
          <input
            aria-label="Number (1–3999)"
            type="number"
            min={1}
            max={3999}
            value={num}
            onChange={e => setNum(+e.target.value)}
          />
        </div>
        <div className="field">
          <label>Roman numeral</label>
          <input aria-label="Roman numeral" value={rom} onChange={e => setRom(e.target.value)} />
        </div>
      </div>
      <div className="statGrid" style={{ gridTemplateColumns: '1fr 1fr' }}>
        <Stat label="In Roman numerals" value={r || 'Enter 1–3999'} />
        <Stat label="As a number" value={Number.isFinite(n) && n > 0 ? String(n) : 'Not a valid numeral'} />
      </div>
    </ToolShell>
  );
}

/* ---------- Random numbers ---------- */
export function RandomNumberGenerator() {
  const [min, setMin] = useState(1);
  const [max, setMax] = useState(100);
  const [count, setCount] = useState(1);
  const [unique, setUnique] = useState(true);
  const [out, setOut] = useState<number[]>([]);
  const [err, setErr] = useState('');
  const rand = (a: number, b: number) => {
    const range = b - a + 1;
    const buf = new Uint32Array(1);
    crypto.getRandomValues(buf);
    return a + (buf[0] % range);
  };
  const run = () => {
    const a = Math.ceil(Math.min(min, max)),
      b = Math.floor(Math.max(min, max));
    if (unique && count > b - a + 1) {
      setErr(`Only ${b - a + 1} unique numbers exist between ${a} and ${b}.`);
      return;
    }
    setErr('');
    const set = new Set<number>(),
      list: number[] = [];
    while (list.length < count) {
      const v = rand(a, b);
      if (unique) {
        if (set.has(v)) continue;
        set.add(v);
      }
      list.push(v);
    }
    setOut(list);
  };
  return (
    <ToolShell
      title="Random number generator"
      description="Pick one or many random numbers in any range, with or without repeats, using your browser's secure random source."
      faq={[
        {
          q: 'How random are the numbers?',
          a: 'They come from crypto.getRandomValues, the browser’s cryptographically secure random generator.',
        },
        {
          q: 'Can I draw lottery or raffle numbers?',
          a: 'Yes. Turn on “No repeats” and set how many numbers to draw.',
        },
      ]}
    >
      <div className="controls">
        <div className="field">
          <label>Minimum</label>
          <input aria-label="Minimum" type="number" value={min} onChange={e => setMin(+e.target.value)} />
        </div>
        <div className="field">
          <label>Maximum</label>
          <input aria-label="Maximum" type="number" value={max} onChange={e => setMax(+e.target.value)} />
        </div>
        <div className="field">
          <label>How many</label>
          <input
            aria-label="How many"
            type="number"
            min={1}
            max={1000}
            value={count}
            onChange={e => setCount(Math.min(1000, Math.max(1, +e.target.value)))}
          />
        </div>
      </div>
      <label style={{ display: 'flex', gap: 8, alignItems: 'center', marginTop: 14, fontWeight: 700 }}>
        <input type="checkbox" checked={unique} onChange={e => setUnique(e.target.checked)} />
        No repeats
      </label>
      <div className="rowBtns">
        <button className="btn btnPrimary" onClick={run}>
          Generate
        </button>
      </div>
      {err && <p className="notice error">{err}</p>}
      {out.length > 0 && (
        <div
          className="monoOut"
          style={{
            fontSize: count === 1 ? 48 : 18,
            textAlign: count === 1 ? 'center' : 'left',
            fontWeight: 800,
          }}
        >
          {out.join(', ')}
        </div>
      )}
    </ToolShell>
  );
}

/* ---------- Stopwatch & countdown ---------- */
const clock = (ms: number, cs = true) => {
  const t = Math.max(0, ms);
  const h = Math.floor(t / 36e5),
    m = Math.floor((t % 36e5) / 6e4),
    s = Math.floor((t % 6e4) / 1e3),
    c = Math.floor((t % 1e3) / 10);
  return `${h ? String(h).padStart(2, '0') + ':' : ''}${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}${cs ? '.' + String(c).padStart(2, '0') : ''}`;
};
export function StopwatchCountdown() {
  const [mode, setMode] = useState<'stopwatch' | 'countdown'>('stopwatch');
  const [elapsed, setElapsed] = useState(0);
  const [running, setRunning] = useState(false);
  const [laps, setLaps] = useState<number[]>([]);
  const [mins, setMins] = useState(5);
  const [left, setLeft] = useState(5 * 60e3);
  const [cdRun, setCdRun] = useState(false);
  const [ring, setRing] = useState(false);
  const start = useRef(0);
  const end = useRef(0);
  const beep = () => {
    try {
      const ctx = new AudioContext();
      [0, 0.35, 0.7].forEach(t => {
        const o = ctx.createOscillator(),
          g = ctx.createGain();
        o.frequency.value = 880;
        o.connect(g);
        g.connect(ctx.destination);
        g.gain.setValueAtTime(0.2, ctx.currentTime + t);
        o.start(ctx.currentTime + t);
        o.stop(ctx.currentTime + t + 0.25);
      });
    } catch {}
  };
  useEffect(() => {
    if (!running) return;
    start.current = performance.now() - elapsed;
    let id = 0;
    const tick = () => {
      setElapsed(performance.now() - start.current);
      id = requestAnimationFrame(tick);
    };
    id = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(id);
  }, [running]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (!cdRun) return;
    end.current = performance.now() + left;
    const id = setInterval(() => {
      const l = end.current - performance.now();
      if (l <= 0) {
        setLeft(0);
        setCdRun(false);
        setRing(true);
        beep();
      } else setLeft(l);
    }, 100);
    return () => clearInterval(id);
  }, [cdRun]); // eslint-disable-line react-hooks/exhaustive-deps
  return (
    <ToolShell
      title="Stopwatch & countdown timer"
      description="A precise stopwatch with lap times, and a countdown timer that sounds an alarm when it reaches zero."
      faq={[
        {
          q: 'Does the timer keep running in another tab?',
          a: 'Yes. Time is measured from the real clock, so it stays accurate even if the tab is in the background.',
        },
        {
          q: 'Will the countdown make a sound?',
          a: 'Yes, it plays three short beeps when it reaches zero. Keep your device volume on.',
        },
      ]}
    >
      <div className="rowBtns" style={{ marginTop: 0, justifyContent: 'center' }}>
        {(['stopwatch', 'countdown'] as const).map(m => (
          <button
            key={m}
            className={`btn ${mode === m ? 'btnPrimary' : 'btnGhost'}`}
            onClick={() => setMode(m)}
          >
            {m === 'stopwatch' ? 'Stopwatch' : 'Countdown'}
          </button>
        ))}
      </div>
      {mode === 'stopwatch' ? (
        <div className="gameWrap" style={{ marginTop: 20 }}>
          <div className="timerDisplay" style={{ fontVariantNumeric: 'tabular-nums' }}>
            {clock(elapsed)}
          </div>
          <div className="rowBtns">
            <button className="btn btnPrimary" onClick={() => setRunning(r => !r)}>
              {running ? 'Pause' : elapsed ? 'Resume' : 'Start'}
            </button>
            <button
              className="btn btnGhost"
              disabled={!running}
              onClick={() => setLaps(l => [elapsed, ...l])}
            >
              Lap
            </button>
            <button
              className="btn btnGhost"
              onClick={() => {
                setRunning(false);
                setElapsed(0);
                setLaps([]);
              }}
            >
              Reset
            </button>
          </div>
          {laps.length > 0 && (
            <ol style={{ width: '100%', maxWidth: 360 }}>
              {[...laps].reverse().map((l, i, arr) => (
                <li
                  key={i}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    padding: '6px 0',
                    borderBottom: '1px solid var(--line)',
                  }}
                >
                  <span>Lap {i + 1}</span>
                  <b>{clock(l - (i ? arr[i - 1] : 0))}</b>
                </li>
              ))}
            </ol>
          )}
        </div>
      ) : (
        <div className="gameWrap" style={{ marginTop: 20 }}>
          <div className="field" style={{ width: 200 }}>
            <label>Minutes</label>
            <input
              aria-label="Minutes"
              type="number"
              min={1}
              max={600}
              value={mins}
              disabled={cdRun}
              onChange={e => {
                const v = Math.max(1, +e.target.value);
                setMins(v);
                setLeft(v * 60e3);
                setRing(false);
              }}
            />
          </div>
          <div
            className="timerDisplay"
            style={{ fontVariantNumeric: 'tabular-nums', color: ring ? 'var(--gold)' : undefined }}
          >
            {clock(left, false)}
          </div>
          <div className="rowBtns">
            <button
              className="btn btnPrimary"
              disabled={left <= 0}
              onClick={() => {
                setRing(false);
                setCdRun(r => !r);
              }}
            >
              {cdRun ? 'Pause' : 'Start'}
            </button>
            <button
              className="btn btnGhost"
              onClick={() => {
                setCdRun(false);
                setLeft(mins * 60e3);
                setRing(false);
              }}
            >
              Reset
            </button>
          </div>
          {ring && <p className="notice">Time&apos;s up.</p>}
        </div>
      )}
    </ToolShell>
  );
}

/* ---------- Text to speech ---------- */
export function TextToSpeech() {
  const [text, setText] = useState(
    'Welcome to CraftSprint. Paste any text here and press Speak to hear it read aloud.',
  );
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [voice, setVoice] = useState('');
  const [rate, setRate] = useState(1);
  const [pitch, setPitch] = useState(1);
  const [speaking, setSpeaking] = useState(false);
  const [supported, setSupported] = useState(true);
  useEffect(() => {
    if (!('speechSynthesis' in window)) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- runs once after mount (browser-only values)
      setSupported(false);
      return;
    }
    const load = () => {
      const v = speechSynthesis.getVoices();
      setVoices(v);
      if (v.length) setVoice(p => p || v.find(x => x.default)?.name || v[0].name);
    };
    load();
    speechSynthesis.onvoiceschanged = load;
    return () => {
      speechSynthesis.cancel();
    };
  }, []);
  const speak = () => {
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    const v = voices.find(x => x.name === voice);
    if (v) u.voice = v;
    u.rate = rate;
    u.pitch = pitch;
    u.onend = () => setSpeaking(false);
    u.onerror = () => setSpeaking(false);
    setSpeaking(true);
    speechSynthesis.speak(u);
  };
  return (
    <ToolShell
      title="Text to speech"
      description="Have any text read aloud in your browser. Choose a voice, speed and pitch — nothing is uploaded."
      faq={[
        {
          q: 'Which languages are available?',
          a: 'The voices come from your device and browser. Most systems include several English voices plus others such as Urdu, Hindi, Arabic, Spanish or French.',
        },
        {
          q: 'Can I download the audio?',
          a: 'Browsers do not allow downloading speech generated this way, so this tool plays the audio only.',
        },
      ]}
    >
      {!supported ? (
        <p className="notice error">
          Your browser does not support speech synthesis. Try Chrome, Edge or Safari.
        </p>
      ) : (
        <>
          <div className="field">
            <label>Text</label>
            <textarea
              aria-label="Text"
              className="textArea"
              value={text}
              onChange={e => setText(e.target.value)}
            />
          </div>
          <div className="controls">
            <div className="field">
              <label>Voice</label>
              <select aria-label="Voice" value={voice} onChange={e => setVoice(e.target.value)}>
                {voices.map(v => (
                  <option key={v.name} value={v.name}>
                    {v.name} ({v.lang})
                  </option>
                ))}
              </select>
            </div>
            <div className="field">
              <label>Speed: {rate.toFixed(1)}×</label>
              <input
                aria-label="Speed"
                type="range"
                min={0.5}
                max={2}
                step={0.1}
                value={rate}
                onChange={e => setRate(+e.target.value)}
              />
            </div>
            <div className="field">
              <label>Pitch: {pitch.toFixed(1)}</label>
              <input
                aria-label="Pitch"
                type="range"
                min={0.5}
                max={2}
                step={0.1}
                value={pitch}
                onChange={e => setPitch(+e.target.value)}
              />
            </div>
          </div>
          <div className="rowBtns">
            <button className="btn btnPrimary" disabled={!text.trim()} onClick={speak}>
              {speaking ? 'Restart' : 'Speak'}
            </button>
            <button
              className="btn btnGhost"
              onClick={() => {
                speechSynthesis.cancel();
                setSpeaking(false);
              }}
            >
              Stop
            </button>
          </div>
        </>
      )}
    </ToolShell>
  );
}

/* ---------- Morse ---------- */
const MORSE: Record<string, string> = {
  A: '.-',
  B: '-...',
  C: '-.-.',
  D: '-..',
  E: '.',
  F: '..-.',
  G: '--.',
  H: '....',
  I: '..',
  J: '.---',
  K: '-.-',
  L: '.-..',
  M: '--',
  N: '-.',
  O: '---',
  P: '.--.',
  Q: '--.-',
  R: '.-.',
  S: '...',
  T: '-',
  U: '..-',
  V: '...-',
  W: '.--',
  X: '-..-',
  Y: '-.--',
  Z: '--..',
  '0': '-----',
  '1': '.----',
  '2': '..---',
  '3': '...--',
  '4': '....-',
  '5': '.....',
  '6': '-....',
  '7': '--...',
  '8': '---..',
  '9': '----.',
  '.': '.-.-.-',
  ',': '--..--',
  '?': '..--..',
  '!': '-.-.--',
  '/': '-..-.',
  '@': '.--.-.',
  '&': '.-...',
  ':': '---...',
  '=': '-...-',
  '+': '.-.-.',
  '-': '-....-',
  '"': '.-..-.',
  "'": '.----.',
  '(': '-.--.',
  ')': '-.--.-',
};
const REV = Object.fromEntries(Object.entries(MORSE).map(([k, v]) => [v, k]));
export function MorseCodeTranslator() {
  const [text, setText] = useState('SOS HELP');
  const { done, copy } = useCopy();
  const isMorse = /^[\s.\-/]+$/.test(text.trim());
  const out = isMorse
    ? text
        .trim()
        .split(/\s*\/\s*|\s{3,}/)
        .map(w =>
          w
            .split(/\s+/)
            .map(c => REV[c] ?? '?')
            .join(''),
        )
        .join(' ')
    : text
        .toUpperCase()
        .split(/\s+/)
        .filter(Boolean)
        .map(w =>
          [...w]
            .map(c => MORSE[c] ?? '')
            .filter(Boolean)
            .join(' '),
        )
        .join(' / ');
  const play = () => {
    const code = isMorse ? text.trim() : out;
    try {
      const ctx = new AudioContext();
      let t = ctx.currentTime + 0.1;
      const u = 0.08;
      for (const ch of code) {
        if (ch === '.' || ch === '-') {
          const o = ctx.createOscillator(),
            g = ctx.createGain();
          o.frequency.value = 650;
          o.connect(g);
          g.connect(ctx.destination);
          g.gain.setValueAtTime(0.15, t);
          o.start(t);
          const d = ch === '.' ? u : u * 3;
          o.stop(t + d);
          t += d + u;
        } else if (ch === ' ') t += u * 2;
        else if (ch === '/') t += u * 4;
      }
    } catch {}
  };
  return (
    <ToolShell
      title="Morse code translator"
      description="Type text to get Morse code, or paste dots and dashes to read them back as text. Play the code as sound."
      faq={[
        {
          q: 'How do I separate letters and words?',
          a: 'Put a space between letters and a slash (/) between words, for example “... --- ... / .... . .-.. .--.”.',
        },
        {
          q: 'Which characters are supported?',
          a: 'Letters A–Z, digits 0–9 and common punctuation from the International Morse Code standard.',
        },
      ]}
    >
      <div className="field">
        <label>Text or Morse code (detected automatically)</label>
        <textarea
          aria-label="Text or Morse code (detected automatically)"
          className="textArea"
          style={{ minHeight: 140 }}
          value={text}
          onChange={e => setText(e.target.value)}
        />
      </div>
      <div className="monoOut" style={{ fontSize: 18 }}>
        {out || '—'}
      </div>
      <div className="rowBtns">
        <button className="btn btnPrimary" onClick={() => copy(out)}>
          {done ? 'Copied' : 'Copy result'}
        </button>
        <button className="btn btnGhost" onClick={play}>
          Play sound
        </button>
      </div>
    </ToolShell>
  );
}

/* ---------- Contrast checker ---------- */
const lum = (hex: string) => {
  const m = hex.replace('#', '').match(/^([0-9a-f]{6}|[0-9a-f]{3})$/i);
  if (!m) return NaN;
  let h = m[1];
  if (h.length === 3) h = [...h].map(c => c + c).join('');
  const c = [0, 2, 4]
    .map(i => parseInt(h.slice(i, i + 2), 16) / 255)
    .map(v => (v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4)));
  return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
};
export function ColorContrastChecker() {
  const [fg, setFg] = useState('#1F2A55');
  const [bg, setBg] = useState('#F4F6FB');
  const a = lum(fg),
    b = lum(bg);
  const ratio =
    Number.isFinite(a) && Number.isFinite(b) ? (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05) : NaN;
  const pass = (n: number) => (Number.isFinite(ratio) && ratio >= n ? 'Pass' : 'Fail');
  return (
    <ToolShell
      title="Color contrast checker"
      description="Check whether text and background colors meet WCAG 2.1 contrast requirements for AA and AAA accessibility."
      faq={[
        {
          q: 'What contrast ratio do I need?',
          a: 'WCAG AA needs at least 4.5:1 for normal text and 3:1 for large text (18pt, or 14pt bold). AAA needs 7:1 and 4.5:1.',
        },
        {
          q: 'How is the ratio calculated?',
          a: 'It compares the relative luminance of the two colors using the WCAG formula (L1 + 0.05) / (L2 + 0.05).',
        },
      ]}
    >
      <div className="controls" style={{ gridTemplateColumns: '1fr 1fr' }}>
        {(
          [
            ['Text color', fg, setFg],
            ['Background color', bg, setBg],
          ] as const
        ).map(([l, v, set]) => (
          <div className="field" key={l}>
            <label>{l}</label>
            <div style={{ display: 'flex', gap: 8 }}>
              <input
                aria-label={`${l} colour picker`}
                type="color"
                value={/^#[0-9a-f]{6}$/i.test(v) ? v : '#000000'}
                onChange={e => set(e.target.value)}
                style={{ width: 52, padding: 4 }}
              />
              <input aria-label={`${l} HEX code`} value={v} onChange={e => set(e.target.value)} />
            </div>
          </div>
        ))}
      </div>
      <div
        style={{
          marginTop: 18,
          padding: 28,
          borderRadius: 16,
          background: bg,
          color: fg,
          border: '1px solid var(--line)',
        }}
      >
        <div style={{ fontSize: 28, fontWeight: 800 }}>Large heading text</div>
        <p style={{ margin: '8px 0 0', fontSize: 16 }}>
          Normal body text looks like this. Make sure it is easy to read.
        </p>
      </div>
      <div className="statGrid">
        <Stat
          label="Contrast ratio"
          value={Number.isFinite(ratio) ? `${ratio.toFixed(2)} : 1` : 'Invalid color'}
        />
        <Stat label="AA normal / large" value={`${pass(4.5)} / ${pass(3)}`} />
        <Stat label="AAA normal / large" value={`${pass(7)} / ${pass(4.5)}`} />
      </div>
    </ToolShell>
  );
}

/* ---------- Image watermark ---------- */
export function ImageWatermark() {
  const [file, setFile] = useState<File | null>(null);
  const [text, setText] = useState('© CraftSprint');
  const [size, setSize] = useState(5);
  const [opacity, setOpacity] = useState(0.5);
  const [pos, setPos] = useState('bottom-right');
  const [color, setColor] = useState('#ffffff');
  const [out, setOut] = useState('');
  useEffect(() => {
    if (!file) return;
    let cancelled = false;
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      if (cancelled) return;
      const c = document.createElement('canvas');
      c.width = img.naturalWidth;
      c.height = img.naturalHeight;
      const x = c.getContext('2d')!;
      x.drawImage(img, 0, 0);
      const fs = Math.max(12, Math.round((c.width * size) / 100));
      x.font = `700 ${fs}px Manrope, system-ui, sans-serif`;
      x.globalAlpha = opacity;
      x.fillStyle = color;
      x.shadowColor = 'rgba(0,0,0,.35)';
      x.shadowBlur = fs / 6;
      const m = fs * 0.8;
      const w = x.measureText(text).width;
      if (pos === 'tile') {
        x.save();
        x.translate(c.width / 2, c.height / 2);
        x.rotate(-Math.PI / 6);
        for (let yy = -c.height; yy < c.height; yy += fs * 4)
          for (let xx = -c.width; xx < c.width; xx += w + fs * 3) x.fillText(text, xx, yy);
        x.restore();
      } else {
        const px = pos.includes('left') ? m : pos.includes('right') ? c.width - w - m : (c.width - w) / 2;
        const py = pos.includes('top') ? m + fs : pos.includes('bottom') ? c.height - m : (c.height + fs) / 2;
        x.fillText(text, px, py);
      }
      c.toBlob(
        b => {
          if (b && !cancelled)
            setOut(o => {
              if (o) URL.revokeObjectURL(o);
              return URL.createObjectURL(b);
            });
        },
        file.type === 'image/png' ? 'image/png' : 'image/jpeg',
        0.92,
      );
      URL.revokeObjectURL(url);
    };
    img.src = url;
    return () => {
      cancelled = true;
    };
  }, [file, text, size, opacity, pos, color]);
  return (
    <ToolShell
      title="Add a watermark to an image"
      description="Place a text watermark on any photo — in a corner, the centre or tiled across it — and download the result. Your image never leaves your device."
      faq={[
        { q: 'Is my image uploaded?', a: 'No. The watermark is drawn in your browser with the canvas API.' },
        {
          q: 'Which formats work?',
          a: 'JPG, PNG and WebP images. PNG files stay PNG; others are saved as high-quality JPG.',
        },
      ]}
    >
      {!file ? (
        <Dropzone onFile={setFile} />
      ) : (
        <>
          <div className="controls">
            <div className="field">
              <label>Watermark text</label>
              <input aria-label="Watermark text" value={text} onChange={e => setText(e.target.value)} />
            </div>
            <div className="field">
              <label>Position</label>
              <select aria-label="Position" value={pos} onChange={e => setPos(e.target.value)}>
                <option value="bottom-right">Bottom right</option>
                <option value="bottom-left">Bottom left</option>
                <option value="top-right">Top right</option>
                <option value="top-left">Top left</option>
                <option value="center">Centre</option>
                <option value="tile">Tiled diagonal</option>
              </select>
            </div>
            <div className="field">
              <label>Color</label>
              <input
                aria-label="Color"
                type="color"
                value={color}
                onChange={e => setColor(e.target.value)}
                style={{ height: 44, padding: 4 }}
              />
            </div>
            <div className="field">
              <label>Size: {size}% of width</label>
              <input
                aria-label="Size"
                type="range"
                min={2}
                max={15}
                value={size}
                onChange={e => setSize(+e.target.value)}
              />
            </div>
            <div className="field">
              <label>Opacity: {Math.round(opacity * 100)}%</label>
              <input
                aria-label="Opacity"
                type="range"
                min={0.1}
                max={1}
                step={0.05}
                value={opacity}
                onChange={e => setOpacity(+e.target.value)}
              />
            </div>
          </div>
          {out && <img className="previewImg" src={out} alt="Watermarked preview" />}
          <div className="rowBtns" style={{ justifyContent: 'center' }}>
            {out && (
              <a
                className="btn btnPrimary"
                href={out}
                download={`watermarked-${file.name.replace(/\.[^.]+$/, '')}.${file.type === 'image/png' ? 'png' : 'jpg'}`}
              >
                Download image
              </a>
            )}
            <button
              className="btn btnGhost"
              onClick={() => {
                setFile(null);
                setOut('');
              }}
            >
              Choose another image
            </button>
          </div>
        </>
      )}
    </ToolShell>
  );
}
