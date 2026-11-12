'use client';
/**
 * Visual polish used across tools (as in the CraftSprint showcase videos):
 * - ScanOverlay: a glowing scan line and progress text over an image while it is being processed.
 * - PrivacyBadge: “100% client-side — no server uploads” shield.
 * - SuccessCard: a celebratory confirmation after a file is ready.
 */
import { ShieldCheck, CheckCircle2 } from 'lucide-react';

export function ScanOverlay({ label }: { label: string }) {
  return (
    <div className="scanOverlay" role="status" aria-live="polite">
      <span className="scanLine" aria-hidden="true" />
      <span className="scanLabel">{label}</span>
    </div>
  );
}

export function PrivacyBadge() {
  return (
    <div className="privacyBadge">
      <span className="pbIcon" aria-hidden="true">
        <ShieldCheck size={26} />
      </span>
      <div>
        <b>100% client-side privacy</b>
        <small>Your files are processed on this device — never uploaded to a server.</small>
      </div>
    </div>
  );
}

export function SuccessCard({ title, detail }: { title: string; detail?: string }) {
  return (
    <div className="successCard" role="status">
      <span className="scIcon" aria-hidden="true">
        <CheckCircle2 size={28} />
      </span>
      <div>
        <b>{title}</b>
        {detail && <small>{detail}</small>}
      </div>
    </div>
  );
}

const COLORS = ['#22d3ee', '#3b82f6', '#a855f7', '#f59e0b', '#10b981', '#f43f5e'];
/** A short burst of confetti (for wins and big moments). Decorative only. */
export function Confetti() {
  return (
    <div className="confetti" aria-hidden="true">
      {Array.from({ length: 36 }, (_, i) => (
        <span
          key={i}
          style={{
            left: `${(i * 37) % 100}%`,
            background: COLORS[i % COLORS.length],
            animationDelay: `${(i % 9) * 0.07}s`,
            animationDuration: `${1.4 + (i % 5) * 0.25}s`,
            transform: `rotate(${i * 23}deg)`,
          }}
        />
      ))}
    </div>
  );
}
