'use client';
/**
 * Decorative 3D scene for the homepage hero: floating glass tool cards
 * that tilt gently with the mouse. Pure CSS 3D — no extra libraries.
 */
import { useRef } from 'react';
import NextImage from 'next/image';
import { Image as ImageIcon, FileText, Code, Calculator, Gamepad2, Sigma } from 'lucide-react';

const CARDS = [
  { icon: ImageIcon, title: 'Image Compressor', note: '2.4 MB → 380 KB', cls: 'c1' },
  { icon: FileText, title: 'PDF Merge', note: '3 files → 1 PDF', cls: 'c2' },
  { icon: Code, title: 'JSON Formatter', note: 'Valid ✓', cls: 'c3' },
  { icon: Calculator, title: 'Loan EMI', note: '22,244 / month', cls: 'c4' },
];
const ORBIT = [Gamepad2, Sigma, ImageIcon, Code];

export default function Hero3D() {
  const scene = useRef<HTMLDivElement>(null);

  const onMove = (e: React.PointerEvent) => {
    const el = scene.current;
    if (!el || e.pointerType !== 'mouse') return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    el.style.setProperty('--ry', `${x * 16}deg`);
    el.style.setProperty('--rx', `${-y * 12}deg`);
  };
  const reset = () => {
    scene.current?.style.setProperty('--ry', '0deg');
    scene.current?.style.setProperty('--rx', '0deg');
  };

  return (
    <div className="hero3d" onPointerMove={onMove} onPointerLeave={reset} aria-hidden="true">
      <div className="hero3dScene" ref={scene}>
        <div className="hero3dCore">
          <NextImage src="/images/favicon.png" alt="" width={96} height={96} priority />
        </div>
        <div className="hero3dRing" />
        {ORBIT.map((Icon, i) => (
          <span key={i} className="hero3dOrbit" style={{ '--i': i } as React.CSSProperties}>
            <Icon size={18} />
          </span>
        ))}
        {CARDS.map(({ icon: Icon, title, note, cls }) => (
          <div key={title} className={`hero3dCard ${cls}`}>
            <span className="hero3dIcon">
              <Icon size={18} />
            </span>
            <div>
              <b>{title}</b>
              <small>{note}</small>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
