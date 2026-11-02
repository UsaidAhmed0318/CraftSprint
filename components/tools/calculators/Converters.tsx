'use client';
import { useState } from 'react';
import ToolShell from '@/components/shared/ToolShell';

const UPPER = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  LOWER = 'abcdefghijklmnopqrstuvwxyz',
  NUMBERS = '0123456789',
  SYMBOLS = '!@#$%^&*()_+-=[]{}|;:,.<>?';

export function PasswordGenerator() {
  const [length, setLength] = useState(16);
  const [upper, setUpper] = useState(true);
  const [lower, setLower] = useState(true);
  const [numbers, setNumbers] = useState(true);
  const [symbols, setSymbols] = useState(true);
  const [password, setPassword] = useState('');
  const [copied, setCopied] = useState(false);
  const charset =
    (upper ? UPPER : '') + (lower ? LOWER : '') + (numbers ? NUMBERS : '') + (symbols ? SYMBOLS : '');
  const generate = () => {
    if (!charset) {
      setPassword('');
      return;
    }
    const bytes = new Uint32Array(length);
    crypto.getRandomValues(bytes);
    setPassword(Array.from(bytes, b => charset[b % charset.length]).join(''));
    setCopied(false);
  };
  const strength = length >= 16 && charset.length > 60 ? 'Strong' : length >= 10 ? 'Good' : 'Weak';
  const copy = () => {
    if (!password) return;
    navigator.clipboard?.writeText(password);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  return (
    <ToolShell
      title="Generate strong random passwords"
      description="Create secure, random passwords with a custom length and character set. Everything is generated locally in your browser using the Web Crypto API."
      faq={[
        {
          q: 'Are passwords sent anywhere?',
          a: "No. Passwords are generated using your browser's built-in crypto API and never leave your device.",
        },
        {
          q: 'How long should a password be?',
          a: 'For most accounts, 16 characters or more with mixed character types gives strong protection.',
        },
      ]}
    >
      <div className="controls">
        <div className="field">
          <label>Length: {length}</label>
          <input
            aria-label="Length"
            type="range"
            min="6"
            max="64"
            value={length}
            onChange={e => setLength(Number(e.target.value))}
          />
        </div>
      </div>
      <div className="checkGrid">
        <label className="checkRow">
          <input type="checkbox" checked={upper} onChange={e => setUpper(e.target.checked)} />
          Uppercase (A-Z)
        </label>
        <label className="checkRow">
          <input type="checkbox" checked={lower} onChange={e => setLower(e.target.checked)} />
          Lowercase (a-z)
        </label>
        <label className="checkRow">
          <input type="checkbox" checked={numbers} onChange={e => setNumbers(e.target.checked)} />
          Numbers (0-9)
        </label>
        <label className="checkRow">
          <input type="checkbox" checked={symbols} onChange={e => setSymbols(e.target.checked)} />
          Symbols (!@#$…)
        </label>
      </div>
      <div style={{ marginTop: 18 }}>
        <button className="btn btnPrimary" onClick={generate}>
          Generate password
        </button>
      </div>
      {password && (
        <div className="result">
          <div>
            <b style={{ fontFamily: "'Sora',monospace", fontSize: 17, wordBreak: 'break-all' }}>{password}</b>
            <div className="stats">
              <span>Length: {password.length}</span>
              <span>Strength: {strength}</span>
            </div>
          </div>
          <button className="btn btnDark" onClick={copy}>
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>
      )}
    </ToolShell>
  );
}

function hexToRgb(hex: string) {
  const h = hex.replace('#', '');
  const n = parseInt(
    h.length === 3
      ? h
          .split('')
          .map(c => c + c)
          .join('')
      : h,
    16,
  );
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
}
function rgbToHsl(r: number, g: number, b: number) {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b),
    min = Math.min(r, g, b);
  let h = 0,
    s = 0;
  const l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    if (max === r) h = (g - b) / d + (g < b ? 6 : 0);
    else if (max === g) h = (b - r) / d + 2;
    else h = (r - g) / d + 4;
    h *= 60;
  }
  return { h: Math.round(h), s: Math.round(s * 100), l: Math.round(l * 100) };
}

export function ColorConverter() {
  const [hex, setHex] = useState('#6d4aff');
  const valid = /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(hex);
  const rgb = valid ? hexToRgb(hex) : { r: 0, g: 0, b: 0 };
  const hsl = valid ? rgbToHsl(rgb.r, rgb.g, rgb.b) : { h: 0, s: 0, l: 0 };
  const rgbStr = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
  const hslStr = `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`;
  const copy = (v: string) => navigator.clipboard?.writeText(v);
  const randomColor = () =>
    setHex(
      '#' +
        Math.floor(Math.random() * 16777215)
          .toString(16)
          .padStart(6, '0'),
    );
  return (
    <ToolShell
      title="Convert colors between HEX, RGB and HSL"
      description="Pick or type a color and instantly get its HEX, RGB and HSL values, ready to copy into your CSS or design tool."
      faq={[
        {
          q: 'Does this store my colors?',
          a: 'No. Conversion happens instantly in your browser with no server involved.',
        },
        { q: 'Can I generate a random color?', a: 'Yes, use the Random color button to explore new values.' },
      ]}
    >
      <div className="controls">
        <div className="field">
          <label>Pick a color</label>
          <input
            aria-label="Pick a color"
            type="color"
            value={valid ? hex : '#000000'}
            onChange={e => setHex(e.target.value)}
            style={{ height: 46, padding: 4 }}
          />
        </div>
        <div className="field">
          <label>HEX value</label>
          <input
            aria-label="HEX value"
            type="text"
            value={hex}
            onChange={e => setHex(e.target.value)}
            placeholder="#6d4aff"
          />
        </div>
      </div>
      <div style={{ marginTop: 14 }}>
        <button className="btn btnGhost" onClick={randomColor}>
          🎲 Random color
        </button>
      </div>
      {valid ? (
        <div className="colorGrid">
          <div className="colorField">
            <label>HEX</label>
            <b>{hex.toUpperCase()}</b>
            <div style={{ marginTop: 8 }}>
              <button className="btn btnGhost" onClick={() => copy(hex)}>
                Copy
              </button>
            </div>
          </div>
          <div className="colorField">
            <label>RGB</label>
            <b>{rgbStr}</b>
            <div style={{ marginTop: 8 }}>
              <button className="btn btnGhost" onClick={() => copy(rgbStr)}>
                Copy
              </button>
            </div>
          </div>
          <div className="colorField">
            <label>HSL</label>
            <b>{hslStr}</b>
            <div style={{ marginTop: 8 }}>
              <button className="btn btnGhost" onClick={() => copy(hslStr)}>
                Copy
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="notice error">Enter a valid HEX color like #6d4aff.</div>
      )}
      <div className="swatchRow">
        <div className="swatch" style={{ background: valid ? hex : '#ccc' }}>
          {valid ? hex.toUpperCase() : ''}
        </div>
      </div>
    </ToolShell>
  );
}

const UNITS = {
  length: {
    base: 'm',
    units: {
      Millimeters: 0.001,
      Centimeters: 0.01,
      Meters: 1,
      Kilometers: 1000,
      Inches: 0.0254,
      Feet: 0.3048,
      Yards: 0.9144,
      Miles: 1609.344,
    },
  },
  weight: {
    base: 'kg',
    units: {
      Milligrams: 0.000001,
      Grams: 0.001,
      Kilograms: 1,
      Ounces: 0.0283495,
      Pounds: 0.453592,
      Tonnes: 1000,
    },
  },
};

export function UnitConverter() {
  const [category, setCategory] = useState<'length' | 'weight' | 'temperature'>('length');
  const unitNames =
    category === 'temperature' ? ['Celsius', 'Fahrenheit', 'Kelvin'] : Object.keys(UNITS[category].units);
  const [from, setFrom] = useState(unitNames[0]);
  const [to, setTo] = useState(unitNames[1]);
  const [value, setValue] = useState('1');
  const changeCategory = (c: 'length' | 'weight' | 'temperature') => {
    setCategory(c);
    const names = c === 'temperature' ? ['Celsius', 'Fahrenheit', 'Kelvin'] : Object.keys(UNITS[c].units);
    setFrom(names[0]);
    setTo(names[1]);
  };
  const convert = (): number => {
    const v = parseFloat(value);
    if (isNaN(v)) return 0;
    if (category === 'temperature') {
      let celsius = v;
      if (from === 'Fahrenheit') celsius = ((v - 32) * 5) / 9;
      else if (from === 'Kelvin') celsius = v - 273.15;
      if (to === 'Fahrenheit') return (celsius * 9) / 5 + 32;
      if (to === 'Kelvin') return celsius + 273.15;
      return celsius;
    }
    const u = UNITS[category].units as Record<string, number>;
    return (v * u[from]) / u[to];
  };
  const result = convert();
  return (
    <ToolShell
      title="Convert length, weight and temperature units"
      description="A quick, accurate unit converter for length, weight and temperature that works instantly in your browser."
      faq={[
        {
          q: 'How accurate is this converter?',
          a: 'Conversions use standard factors and full floating point precision, then round the display for readability.',
        },
      ]}
    >
      <div className="toggleGroup">
        {(['length', 'weight', 'temperature'] as const).map(c => (
          <button
            key={c}
            className={`toggleBtn ${category === c ? 'active' : ''}`}
            onClick={() => changeCategory(c)}
          >
            {c[0].toUpperCase() + c.slice(1)}
          </button>
        ))}
      </div>
      <div className="controls">
        <div className="field">
          <label>Value</label>
          <input aria-label="Value" type="number" value={value} onChange={e => setValue(e.target.value)} />
        </div>
        <div className="field">
          <label>From</label>
          <select aria-label="From" value={from} onChange={e => setFrom(e.target.value)}>
            {unitNames.map(u => (
              <option key={u} value={u}>
                {u}
              </option>
            ))}
          </select>
        </div>
        <div className="field">
          <label>To</label>
          <select aria-label="To" value={to} onChange={e => setTo(e.target.value)}>
            {unitNames.map(u => (
              <option key={u} value={u}>
                {u}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="result">
        <span>
          {value || 0} {from} equals
        </span>
        <b style={{ fontSize: 20 }}>
          {Number.isFinite(result) ? parseFloat(result.toFixed(6)) : 0} {to}
        </b>
      </div>
    </ToolShell>
  );
}
