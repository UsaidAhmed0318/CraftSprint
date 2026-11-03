'use client';
/**
 * Homepage 3D scene: a floating holographic tool screen, the CraftSprint logo cube,
 * a ringed planet, orbiting icons and live tool cards. Tilts with the mouse.
 * Pure CSS 3D (no libraries) — styles in app/vip.css → "3D scene v2".
 */
import { useRef } from 'react';
import Image from 'next/image';
import {
  Image as ImageIcon,
  FileText,
  Calculator,
  Code2,
  Gamepad2,
  Sparkles,
  Music,
  QrCode,
  ArrowRight,
  Check,
} from 'lucide-react';

const TILES = [
  { icon: ImageIcon, cls: 't1' },
  { icon: FileText, cls: 't2' },
  { icon: Calculator, cls: 't3' },
  { icon: Code2, cls: 't4' },
  { icon: Gamepad2, cls: 't5' },
  { icon: Sparkles, cls: 't6' },
];
const ORBIT = [Music, QrCode, ImageIcon, Code2];

export default function Hero3D() {
  const scene = useRef<HTMLDivElement>(null);
  const onMove = (e: React.PointerEvent) => {
    const el = scene.current;
    if (!el || e.pointerType !== 'mouse') return;
    const r = el.getBoundingClientRect();
    el.style.setProperty('--ry', `${((e.clientX - r.left) / r.width - 0.5) * 16}deg`);
    el.style.setProperty('--rx', `${-((e.clientY - r.top) / r.height - 0.5) * 10}deg`);
  };
  const reset = () => {
    scene.current?.style.setProperty('--ry', '0deg');
    scene.current?.style.setProperty('--rx', '0deg');
  };

  return (
    <div className="hero3d v2" onPointerMove={onMove} onPointerLeave={reset} aria-hidden="true">
      <div className="hero3dScene" ref={scene}>
        <div className="h3Planet">
          <span className="h3PlanetRing" />
        </div>
        <div className="h3Platform" />
        <div className="h3Beam" />

        <div className="h3Screen">
          <div className="h3ScreenBar">
            <i />
            <i />
            <i />
            <span>craftsprint · tools</span>
          </div>
          <div className="h3Tiles">
            {TILES.map(({ icon: Icon, cls }) => (
              <span key={cls} className={`h3Tile ${cls}`}>
                <Icon size={30} strokeWidth={1.8} />
              </span>
            ))}
          </div>
        </div>

        <div className="h3Logo">
          <Image src="/icons/icon-192.png" alt="" width={70} height={70} priority />
        </div>

        {ORBIT.map((Icon, i) => (
          <span key={i} className="hero3dOrbit" style={{ '--i': i } as React.CSSProperties}>
            <Icon size={17} />
          </span>
        ))}

        <div className="hero3dCard c1">
          <span className="hero3dIcon">
            <ImageIcon size={18} />
          </span>
          <div>
            <b>Image Compressor</b>
            <small>
              2.4 MB <ArrowRight size={11} aria-hidden="true" /> 380 KB
            </small>
          </div>
        </div>
        <div className="hero3dCard c2">
          <span className="hero3dIcon">
            <FileText size={18} />
          </span>
          <div>
            <b>PDF Merge</b>
            <small>
              3 files <ArrowRight size={11} aria-hidden="true" /> 1 PDF
            </small>
          </div>
        </div>
        <div className="hero3dAi">
          <div className="hero3dAiHead">
            <Image src="/images/favicon.png" alt="" width={22} height={22} />
            <b>CraftSprint AI</b>
            <i>online</i>
          </div>
          <p className="q">Make my photo under 100 KB</p>
          <p className="a">
            Use <b>Image Compressor</b> <ArrowRight size={11} aria-hidden="true" /> 92 KB{' '}
            <Check size={12} aria-hidden="true" />
          </p>
        </div>
        {Array.from({ length: 10 }, (_, i) => (
          <span key={`p${i}`} className="hero3dSpark" style={{ '--i': i } as React.CSSProperties} />
        ))}
      </div>
    </div>
  );
}
