'use client';
import { useState, useMemo } from 'react';
import ToolShell from '@/components/shared/ToolShell';

export function ProfitMarginCalculator() {
  const [cost, setCost] = useState('');
  const [price, setPrice] = useState('');
  const c = parseFloat(cost),
    p = parseFloat(price);
  const valid = Number.isFinite(c) && Number.isFinite(p) && p > 0;
  const profit = valid ? p - c : 0;
  const margin = valid ? (profit / p) * 100 : 0;
  const markup = valid && c > 0 ? (profit / c) * 100 : 0;

  const [targetCost, setTargetCost] = useState('');
  const [targetMargin, setTargetMargin] = useState('');
  const tc = parseFloat(targetCost),
    tm = parseFloat(targetMargin);
  const suggestedPrice = Number.isFinite(tc) && Number.isFinite(tm) && tm < 100 ? tc / (1 - tm / 100) : null;

  return (
    <ToolShell
      title="Profit margin & markup calculator"
      description="Work out profit, margin and markup from cost and selling price, or find the price you need to charge for a target margin."
      faq={[
        {
          q: 'What is the difference between margin and markup?',
          a: 'Margin is profit as a percentage of the selling price; markup is profit as a percentage of the cost price.',
        },
      ]}
    >
      <div className="controls">
        <div className="field">
          <label>Cost price</label>
          <input
            aria-label="Cost price"
            type="number"
            value={cost}
            onChange={e => setCost(e.target.value)}
            placeholder="10"
          />
        </div>
        <div className="field">
          <label>Selling price</label>
          <input
            aria-label="Selling price"
            type="number"
            value={price}
            onChange={e => setPrice(e.target.value)}
            placeholder="15"
          />
        </div>
      </div>
      {valid ? (
        <div className="colorGrid">
          <div className="colorField">
            <label>Profit</label>
            <b>{profit.toFixed(2)}</b>
          </div>
          <div className="colorField">
            <label>Margin</label>
            <b>{margin.toFixed(1)}%</b>
          </div>
          <div className="colorField">
            <label>Markup</label>
            <b>{markup.toFixed(1)}%</b>
          </div>
        </div>
      ) : (
        <div className="notice error">Enter a cost and a selling price greater than 0.</div>
      )}

      <div style={{ marginTop: 30, paddingTop: 24, borderTop: '1px solid var(--line)' }}>
        <h3 style={{ margin: '0 0 14px' }}>Find the price for a target margin</h3>
        <div className="controls">
          <div className="field">
            <label>Cost price</label>
            <input
              aria-label="Cost price"
              type="number"
              value={targetCost}
              onChange={e => setTargetCost(e.target.value)}
              placeholder="10"
            />
          </div>
          <div className="field">
            <label>Target margin %</label>
            <input
              aria-label="Target margin %"
              type="number"
              value={targetMargin}
              onChange={e => setTargetMargin(e.target.value)}
              placeholder="40"
            />
          </div>
        </div>
        {suggestedPrice !== null && Number.isFinite(suggestedPrice) && (
          <div className="result">
            <span>Charge</span>
            <b style={{ fontSize: 20 }}>{suggestedPrice.toFixed(2)}</b>
          </div>
        )}
      </div>
    </ToolShell>
  );
}

export function PercentageCalculator() {
  const [a1, setA1] = useState('');
  const [b1, setB1] = useState('');
  const [a2, setA2] = useState('');
  const [b2, setB2] = useState('');
  const [a3, setA3] = useState('');
  const [b3, setB3] = useState('');
  const n = (v: string) => parseFloat(v);
  const r1 = Number.isFinite(n(a1)) && Number.isFinite(n(b1)) ? (n(a1) / 100) * n(b1) : null;
  const r2 = Number.isFinite(n(a2)) && Number.isFinite(n(b2)) && n(b2) !== 0 ? (n(a2) / n(b2)) * 100 : null;
  const r3 =
    Number.isFinite(n(a3)) && Number.isFinite(n(b3)) && n(a3) !== 0 ? ((n(b3) - n(a3)) / n(a3)) * 100 : null;
  return (
    <ToolShell
      title="Percentage calculator"
      description="Three quick percentage calculators: find a percentage of a number, work out what percentage one number is of another, and calculate percentage change."
      faq={[
        {
          q: 'How is percentage change calculated?',
          a: 'Percentage change is (new value − old value) ÷ old value × 100, showing a negative result for a decrease.',
        },
      ]}
    >
      <div className="controls">
        <div className="field">
          <label>What is</label>
          <input
            aria-label="What is"
            type="number"
            value={a1}
            onChange={e => setA1(e.target.value)}
            placeholder="20"
          />
        </div>
        <div className="field">
          <label>% of</label>
          <input
            aria-label="% of"
            type="number"
            value={b1}
            onChange={e => setB1(e.target.value)}
            placeholder="150"
          />
        </div>
      </div>
      {r1 !== null && (
        <div className="result">
          <span>
            {a1}% of {b1} is
          </span>
          <b style={{ fontSize: 20 }}>{r1.toFixed(2)}</b>
        </div>
      )}

      <div style={{ marginTop: 26, paddingTop: 22, borderTop: '1px solid var(--line)' }}>
        <div className="controls">
          <div className="field">
            <label>What percentage is</label>
            <input
              aria-label="What percentage is"
              type="number"
              value={a2}
              onChange={e => setA2(e.target.value)}
              placeholder="30"
            />
          </div>
          <div className="field">
            <label>of</label>
            <input
              aria-label="of"
              type="number"
              value={b2}
              onChange={e => setB2(e.target.value)}
              placeholder="120"
            />
          </div>
        </div>
        {r2 !== null && (
          <div className="result">
            <span>
              {a2} is what % of {b2}
            </span>
            <b style={{ fontSize: 20 }}>{r2.toFixed(2)}%</b>
          </div>
        )}
      </div>

      <div style={{ marginTop: 26, paddingTop: 22, borderTop: '1px solid var(--line)' }}>
        <div className="controls">
          <div className="field">
            <label>From</label>
            <input
              aria-label="From"
              type="number"
              value={a3}
              onChange={e => setA3(e.target.value)}
              placeholder="80"
            />
          </div>
          <div className="field">
            <label>To</label>
            <input
              aria-label="To"
              type="number"
              value={b3}
              onChange={e => setB3(e.target.value)}
              placeholder="100"
            />
          </div>
        </div>
        {r3 !== null && (
          <div className="result">
            <span>Percentage change</span>
            <b style={{ fontSize: 20, color: r3 < 0 ? 'var(--danger)' : 'var(--success)' }}>
              {r3 > 0 ? '+' : ''}
              {r3.toFixed(2)}%
            </b>
          </div>
        )}
      </div>
    </ToolShell>
  );
}

const MS_DAY = 86400000;
export function DateCalculator() {
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');
  const diff = useMemo(() => {
    if (!start || !end) return null;
    const s = new Date(start),
      e = new Date(end);
    if (isNaN(s.getTime()) || isNaN(e.getTime())) return null;
    const days = Math.round((e.getTime() - s.getTime()) / MS_DAY);
    let businessDays = 0;
    const dir = days >= 0 ? 1 : -1;
    const cur = new Date(s);
    for (let i = 0; i < Math.abs(days); i++) {
      cur.setDate(cur.getDate() + dir);
      const day = cur.getDay();
      if (day !== 0 && day !== 6) businessDays += dir;
    }
    return { days, weeks: Math.trunc(days / 7), businessDays };
  }, [start, end]);

  const [base, setBase] = useState('');
  const [amount, setAmount] = useState('30');
  const [op, setOp] = useState<'add' | 'subtract'>('add');
  const shifted = useMemo(() => {
    if (!base) return null;
    const d = new Date(base);
    if (isNaN(d.getTime())) return null;
    const n = parseInt(amount, 10);
    if (!Number.isFinite(n)) return null;
    d.setDate(d.getDate() + (op === 'add' ? n : -n));
    return d;
  }, [base, amount, op]);

  return (
    <ToolShell
      title="Date difference & date calculator"
      description="Find the number of days, weeks and business days between two dates, or add and subtract days from a date."
      faq={[
        {
          q: 'Does this count weekends?',
          a: 'Total days include weekends; business days exclude Saturdays and Sundays.',
        },
      ]}
    >
      <div className="controls">
        <div className="field">
          <label>Start date</label>
          <input aria-label="Start date" type="date" value={start} onChange={e => setStart(e.target.value)} />
        </div>
        <div className="field">
          <label>End date</label>
          <input aria-label="End date" type="date" value={end} onChange={e => setEnd(e.target.value)} />
        </div>
      </div>
      {diff && (
        <div className="colorGrid">
          <div className="colorField">
            <label>Total days</label>
            <b>{diff.days}</b>
          </div>
          <div className="colorField">
            <label>Weeks</label>
            <b>{diff.weeks}</b>
          </div>
          <div className="colorField">
            <label>Business days</label>
            <b>{diff.businessDays}</b>
          </div>
        </div>
      )}

      <div style={{ marginTop: 30, paddingTop: 24, borderTop: '1px solid var(--line)' }}>
        <h3 style={{ margin: '0 0 14px' }}>Add or subtract days</h3>
        <div className="controls">
          <div className="field">
            <label>Date</label>
            <input aria-label="Date" type="date" value={base} onChange={e => setBase(e.target.value)} />
          </div>
          <div className="field">
            <label>Operation</label>
            <select aria-label="Operation" value={op} onChange={e => setOp(e.target.value as typeof op)}>
              <option value="add">Add</option>
              <option value="subtract">Subtract</option>
            </select>
          </div>
          <div className="field">
            <label>Days</label>
            <input aria-label="Days" type="number" value={amount} onChange={e => setAmount(e.target.value)} />
          </div>
        </div>
        {shifted && (
          <div className="result">
            <span>Result</span>
            <b style={{ fontSize: 18 }}>{shifted.toDateString()}</b>
          </div>
        )}
      </div>
    </ToolShell>
  );
}
