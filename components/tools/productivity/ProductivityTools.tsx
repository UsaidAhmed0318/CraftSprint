'use client';
import { useState, useEffect, useRef, useMemo } from 'react';
import ToolShell from '@/components/shared/ToolShell';

export function PomodoroTimer() {
  const [minutes, setMinutes] = useState(25);
  const [seconds, setSeconds] = useState(minutes * 60);
  const [running, setRunning] = useState(false);
  const [mode, setMode] = useState<'focus' | 'break'>('focus');
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setSeconds(s => {
          if (s <= 1) {
            const next = mode === 'focus' ? 'break' : 'focus';
            setMode(next);
            return (next === 'focus' ? minutes : 5) * 60;
          }
          return s - 1;
        });
      }, 1000);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [running, mode, minutes]);

  const mm = String(Math.floor(seconds / 60)).padStart(2, '0');
  const ss = String(seconds % 60).padStart(2, '0');
  const reset = () => {
    setRunning(false);
    setMode('focus');
    setSeconds(minutes * 60);
  };

  return (
    <ToolShell
      title="Pomodoro timer & focus clock"
      description="A simple focus timer using the Pomodoro technique — 25 minutes of focused work followed by a short break."
      faq={[
        {
          q: 'Can I change the focus duration?',
          a: 'Yes, set your preferred focus length in minutes before starting; breaks default to 5 minutes.',
        },
      ]}
    >
      <div className="toggleGroup" style={{ justifyContent: 'center' }}>
        <span className="toggleBtn active" style={{ cursor: 'default' }}>
          {mode === 'focus' ? 'Focus session' : 'Break time'}
        </span>
      </div>
      <div className="timerDisplay">
        {mm}:{ss}
      </div>
      <div className="controls">
        <div className="field">
          <label>Focus length (minutes)</label>
          <input
            aria-label="Focus length (minutes)"
            type="number"
            min="1"
            max="120"
            value={minutes}
            onChange={e => {
              const v = Number(e.target.value);
              setMinutes(v);
              if (!running && mode === 'focus') setSeconds(v * 60);
            }}
          />
        </div>
      </div>
      <div className="heroActions" style={{ marginTop: 18 }}>
        <button className="btn btnPrimary" onClick={() => setRunning(r => !r)}>
          {running ? 'Pause' : 'Start'}
        </button>
        <button className="btn btnGhost" onClick={reset}>
          Reset
        </button>
      </div>
    </ToolShell>
  );
}

const CITIES = [
  'UTC',
  'America/New_York',
  'America/Los_Angeles',
  'Europe/London',
  'Europe/Paris',
  'Asia/Karachi',
  'Asia/Dubai',
  'Asia/Kolkata',
  'Asia/Singapore',
  'Asia/Tokyo',
  'Australia/Sydney',
];
export function TimezoneMeetingPlanner() {
  const [dateTime, setDateTime] = useState('');
  useEffect(() => {
    const now = new Date();
    // datetime-local expects local time, not UTC
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    // eslint-disable-next-line react-hooks/set-state-in-effect -- runs once after mount (browser-only values)
    setDateTime(now.toISOString().slice(0, 16));
  }, []);
  const results = useMemo(() => {
    const d = new Date(dateTime);
    if (isNaN(d.getTime())) return [];
    return CITIES.map(tz => ({
      tz,
      label: new Intl.DateTimeFormat('en-US', {
        timeZone: tz,
        weekday: 'short',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
        month: 'short',
        day: 'numeric',
      }).format(d),
    }));
  }, [dateTime]);
  return (
    <ToolShell
      title="Timezone meeting planner"
      description="Pick a date and time and instantly see the equivalent local time across major timezones around the world."
      faq={[
        {
          q: 'Does this account for daylight saving time?',
          a: "Yes, conversions use your browser's built-in timezone database, which accounts for daylight saving automatically.",
        },
      ]}
    >
      <div className="field">
        <label>Date & time (your local time)</label>
        <input
          aria-label="Date & time (your local time)"
          type="datetime-local"
          value={dateTime}
          onChange={e => setDateTime(e.target.value)}
        />
      </div>
      <div className="colorGrid">
        {results.map(r => (
          <div className="colorField" key={r.tz}>
            <label>{r.tz.replace('_', ' ')}</label>
            <b>{r.label}</b>
          </div>
        ))}
      </div>
    </ToolShell>
  );
}

const CURRENCIES = ['USD', 'EUR', 'GBP', 'PKR', 'INR', 'AED', 'JPY', 'AUD', 'CAD', 'SGD'];
export function CurrencyConverter() {
  const [amount, setAmount] = useState('100');
  const [from, setFrom] = useState('USD');
  const [to, setTo] = useState('PKR');
  const [rate, setRate] = useState<number | null>(null);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const fetchRate = async () => {
    setBusy(true);
    setError('');
    try {
      const r = await fetch(`/api/currency?from=${from}&to=${to}`);
      const data = await r.json();
      if (!r.ok) {
        setError(data.error || 'Could not fetch rate.');
        setRate(null);
        return;
      }
      setRate(data.rate);
    } catch {
      setError('Network error — could not fetch exchange rate.');
    } finally {
      setBusy(false);
    }
  };

  const n = parseFloat(amount);
  const result = rate !== null && Number.isFinite(n) ? n * rate : null;

  return (
    <ToolShell
      title="Currency converter"
      description="Convert between major world currencies using up-to-date exchange rates."
      faq={[
        {
          q: 'How current are these rates?',
          a: 'Rates come from a free public exchange rate API and typically refresh once every 24 hours.',
        },
      ]}
    >
      <div className="controls">
        <div className="field">
          <label>Amount</label>
          <input aria-label="Amount" type="number" value={amount} onChange={e => setAmount(e.target.value)} />
        </div>
        <div className="field">
          <label>From</label>
          <select aria-label="From" value={from} onChange={e => setFrom(e.target.value)}>
            {CURRENCIES.map(c => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </div>
        <div className="field">
          <label>To</label>
          <select aria-label="To" value={to} onChange={e => setTo(e.target.value)}>
            {CURRENCIES.map(c => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </div>
      </div>
      <div style={{ marginTop: 16 }}>
        <button className="btn btnPrimary" disabled={busy} onClick={fetchRate}>
          {busy ? 'Fetching…' : 'Get rate & convert'}
        </button>
      </div>
      {error && <div className="notice error">{error}</div>}
      {result !== null && (
        <div className="result">
          <span>
            {amount} {from} equals
          </span>
          <b style={{ fontSize: 20 }}>
            {result.toFixed(2)} {to}
          </b>
        </div>
      )}
    </ToolShell>
  );
}

export function RandomPickerWheel() {
  const [input, setInput] = useState('Option A\nOption B\nOption C\nOption D');
  const [winner, setWinner] = useState('');
  const [rotation, setRotation] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const items = input
    .split('\n')
    .map(s => s.trim())
    .filter(Boolean);
  const spin = () => {
    if (items.length < 2 || spinning) return;
    setSpinning(true);
    setWinner('');
    const idx = Math.floor(Math.random() * items.length);
    const extraSpins = 360 * 5;
    const target = extraSpins + (360 - idx * (360 / items.length));
    setRotation(r => r + target);
    setTimeout(() => {
      setWinner(items[idx]);
      setSpinning(false);
    }, 3600);
  };
  return (
    <ToolShell
      title="Random name / picker wheel"
      description="Enter a list of names or options, spin the wheel, and let it randomly pick one for you — fair and fun for giveaways or decisions."
      faq={[
        {
          q: 'Is the pick truly random?',
          a: "Yes, it uses your browser's random number generator to select an item before spinning to that result.",
        },
      ]}
    >
      <div className="field">
        <label>Options (one per line)</label>
        <textarea
          aria-label="Options (one per line)"
          className="textArea"
          style={{ minHeight: 120 }}
          value={input}
          onChange={e => setInput(e.target.value)}
        />
      </div>
      <div className="wheelWrap">
        <div className="wheel" style={{ transform: `rotate(${rotation}deg)` }}>
          {items.length} options
        </div>
      </div>
      <div style={{ textAlign: 'center' }}>
        <button className="btn btnPrimary" disabled={items.length < 2 || spinning} onClick={spin}>
          {spinning ? 'Spinning…' : 'Spin the wheel'}
        </button>
      </div>
      {winner && (
        <div className="result" style={{ justifyContent: 'center' }}>
          <span>Winner: </span>
          <b style={{ fontSize: 20 }}>{winner}</b>
        </div>
      )}
    </ToolShell>
  );
}

export function PasswordStrengthChecker() {
  const [pw, setPw] = useState('');
  const analysis = useMemo(() => {
    let score = 0;
    const tips: string[] = [];
    if (pw.length >= 12) score += 30;
    else tips.push('Use at least 12 characters');
    if (/[a-z]/.test(pw) && /[A-Z]/.test(pw)) score += 20;
    else tips.push('Mix uppercase and lowercase letters');
    if (/\d/.test(pw)) score += 20;
    else tips.push('Add at least one number');
    if (/[^a-zA-Z0-9]/.test(pw)) score += 20;
    else tips.push('Add a symbol like ! @ # $');
    if (pw.length >= 16) score += 10;
    score = Math.min(100, score);
    const label = score >= 80 ? 'Strong' : score >= 50 ? 'Medium' : pw ? 'Weak' : '—';
    return { score, label, tips };
  }, [pw]);
  return (
    <ToolShell
      title="Password strength checker"
      description="Paste a password to see a strength score and specific suggestions to make it stronger."
      faq={[
        {
          q: 'Is my password sent anywhere?',
          a: 'No, the check runs entirely in your browser and the password is never transmitted.',
        },
      ]}
    >
      <div className="field">
        <label>Password</label>
        <input
          aria-label="Password"
          type="text"
          value={pw}
          onChange={e => setPw(e.target.value)}
          placeholder="Type a password to check"
        />
      </div>
      <div className="result">
        <span>Strength</span>
        <b
          style={{
            fontSize: 20,
            color:
              analysis.score >= 80 ? 'var(--success)' : analysis.score >= 50 ? '#d97706' : 'var(--danger)',
          }}
        >
          {analysis.label}
          {pw && ` (${analysis.score}/100)`}
        </b>
      </div>
      {analysis.tips.length > 0 && pw && <div className="notice">{analysis.tips.join(' · ')}</div>}
    </ToolShell>
  );
}
