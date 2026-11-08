'use client';
import { track, currentToolSlug } from '@/lib/analytics';
/**
 * Small building blocks shared by every tool.
 * Use these instead of writing the same markup again — change the look here once and it updates everywhere.
 */
import { useId, useState, type ReactNode } from 'react';

/** Number with up to `d` decimals, or "—" when it isn't a number. */
export const fmt = (n: number, d = 4) =>
  Number.isFinite(n) ? n.toLocaleString(undefined, { maximumFractionDigits: d }) : '—';
/** Money: always 2 decimals. */
export const money = (n: number) =>
  Number.isFinite(n)
    ? n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    : '—';

/** A labelled result box. Put several inside <Stats>. */
export const Stat = ({ label, value }: { label: string; value: ReactNode }) => (
  <div className="statBox">
    <span>{label}</span>
    <b>{value}</b>
  </div>
);
export const Stats = ({ children, cols }: { children: ReactNode; cols?: number }) => (
  <div className="statGrid" style={cols ? { gridTemplateColumns: `repeat(${cols},1fr)` } : undefined}>
    {children}
  </div>
);

/** A row of inputs that wraps on small screens. */
export const Fields = ({ children, cols }: { children: ReactNode; cols?: number }) => (
  <div className="controls" style={cols ? { gridTemplateColumns: `repeat(${cols},1fr)` } : undefined}>
    {children}
  </div>
);

/** Labelled number input. Empty input gives NaN so results can show "—". */
export function Num({
  label,
  value,
  set,
  step,
}: {
  label: string;
  value: number;
  set: (n: number) => void;
  step?: number;
}) {
  const id = useId();
  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      <input
        id={id}
        type="number"
        inputMode="decimal"
        step={step ?? 'any'}
        value={Number.isFinite(value) ? value : ''}
        onChange={e => set(e.target.value === '' ? NaN : +e.target.value)}
      />
    </div>
  );
}

/** Labelled text input. */
export function Text({
  label,
  value,
  set,
  placeholder,
}: {
  label: string;
  value: string;
  set: (s: string) => void;
  placeholder?: string;
}) {
  const id = useId();
  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      <input id={id} value={value} placeholder={placeholder} onChange={e => set(e.target.value)} />
    </div>
  );
}

/** Pick one option from a few buttons (e.g. Metric / Imperial). */
export function Choice<T extends string | number>({
  options,
  value,
  set,
}: {
  options: { value: T; label: string }[];
  value: T;
  set: (v: T) => void;
}) {
  return (
    <div className="rowBtns" style={{ marginTop: 0 }} role="group">
      {options.map(o => (
        <button
          key={String(o.value)}
          type="button"
          className={`btn ${value === o.value ? 'btnPrimary' : 'btnGhost'}`}
          aria-pressed={value === o.value}
          onClick={() => set(o.value)}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

/** Copy text to the clipboard with "Copied" feedback. */
export function CopyButton({ text, label = 'Copy result' }: { text: string; label?: string }) {
  const [done, setDone] = useState(false);
  return (
    <button
      type="button"
      className="btn btnPrimary"
      disabled={!text}
      onClick={() =>
        navigator.clipboard
          ?.writeText(text)
          .then(() => {
            setDone(true);
            track('copy_result', { tool_slug: currentToolSlug() });
            setTimeout(() => setDone(false), 1400);
          })
          .catch(() => {})
      }
    >
      {done ? 'Copied' : label}
    </button>
  );
}

/** Small message: info (default) or error. */
export const Note = ({ children, error }: { children: ReactNode; error?: boolean }) => (
  <p className={`notice ${error ? 'error' : ''}`}>{children}</p>
);
