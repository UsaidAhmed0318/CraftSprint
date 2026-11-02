'use client';
import { useState, useRef } from 'react';
import Dropzone from '@/components/shared/Dropzone';
import ToolShell from '@/components/shared/ToolShell';

export function CssGradientGenerator() {
  const [c1, setC1] = useState('#6d4aff');
  const [c2, setC2] = useState('#8b5cf6');
  const [angle, setAngle] = useState(135);
  const [type, setType] = useState<'linear' | 'radial'>('linear');
  const css =
    type === 'linear'
      ? `linear-gradient(${angle}deg, ${c1}, ${c2})`
      : `radial-gradient(circle, ${c1}, ${c2})`;
  const code = `background: ${css};`;
  const copy = () => navigator.clipboard?.writeText(code);
  return (
    <ToolShell
      title="CSS gradient generator"
      description="Pick two colors, choose the angle and type, then copy ready-to-use CSS gradient code for your site or app."
      faq={[
        {
          q: 'Does this support radial gradients?',
          a: 'Yes, switch between linear and radial gradients using the type selector.',
        },
        {
          q: 'Can I use this in Tailwind or plain CSS?',
          a: 'Yes, paste the generated background value into any stylesheet or inline style.',
        },
      ]}
    >
      <div style={{ height: 220, borderRadius: 20, background: css, marginBottom: 20 }} />
      <div className="controls">
        <div className="field">
          <label>Color 1</label>
          <input
            aria-label="Color 1"
            type="color"
            value={c1}
            onChange={e => setC1(e.target.value)}
            style={{ height: 46, padding: 4 }}
          />
        </div>
        <div className="field">
          <label>Color 2</label>
          <input
            aria-label="Color 2"
            type="color"
            value={c2}
            onChange={e => setC2(e.target.value)}
            style={{ height: 46, padding: 4 }}
          />
        </div>
        <div className="field">
          <label>Type</label>
          <select aria-label="Type" value={type} onChange={e => setType(e.target.value as typeof type)}>
            <option value="linear">Linear</option>
            <option value="radial">Radial</option>
          </select>
        </div>
      </div>
      {type === 'linear' && (
        <div className="field" style={{ marginTop: 14 }}>
          <label>Angle: {angle}°</label>
          <input
            aria-label="Angle"
            type="range"
            min="0"
            max="360"
            value={angle}
            onChange={e => setAngle(Number(e.target.value))}
          />
        </div>
      )}
      <pre className="codeBox">{code}</pre>
      <div className="heroActions" style={{ justifyContent: 'flex-start', marginTop: 14 }}>
        <button className="btn btnDark" onClick={copy}>
          Copy CSS
        </button>
      </div>
    </ToolShell>
  );
}

export function BoxShadowGenerator() {
  const [x, setX] = useState(0);
  const [y, setY] = useState(10);
  const [blur, setBlur] = useState(24);
  const [spread, setSpread] = useState(0);
  const [color, setColor] = useState('#10131a');
  const [opacity, setOpacity] = useState(20);
  const [inset, setInset] = useState(false);
  const rgba = (() => {
    const n = parseInt(color.replace('#', ''), 16);
    const r = (n >> 16) & 255,
      g = (n >> 8) & 255,
      b = n & 255;
    return `rgba(${r}, ${g}, ${b}, ${(opacity / 100).toFixed(2)})`;
  })();
  const shadow = `${inset ? 'inset ' : ''}${x}px ${y}px ${blur}px ${spread}px ${rgba}`;
  const code = `box-shadow: ${shadow};`;
  const copy = () => navigator.clipboard?.writeText(code);
  return (
    <ToolShell
      title="CSS box-shadow generator"
      description="Adjust offset, blur, spread and color with live preview, then copy the generated box-shadow CSS."
      faq={[
        {
          q: 'Can I create an inset shadow?',
          a: 'Yes, enable the inset toggle to generate an inner shadow.',
        },
        {
          q: 'Can I stack multiple shadows?',
          a: 'This tool generates one shadow layer; combine multiple copied values with commas for layered shadows.',
        },
      ]}
    >
      <div
        style={{
          height: 180,
          borderRadius: 20,
          background: '#fff',
          display: 'grid',
          placeItems: 'center',
          marginBottom: 20,
        }}
      >
        <div style={{ width: 140, height: 100, borderRadius: 16, background: '#fff', boxShadow: shadow }} />
      </div>
      <div className="controls">
        <div className="field">
          <label>X offset: {x}px</label>
          <input
            aria-label="X offset"
            type="range"
            min="-50"
            max="50"
            value={x}
            onChange={e => setX(Number(e.target.value))}
          />
        </div>
        <div className="field">
          <label>Y offset: {y}px</label>
          <input
            aria-label="Y offset"
            type="range"
            min="-50"
            max="50"
            value={y}
            onChange={e => setY(Number(e.target.value))}
          />
        </div>
        <div className="field">
          <label>Blur: {blur}px</label>
          <input
            aria-label="Blur"
            type="range"
            min="0"
            max="100"
            value={blur}
            onChange={e => setBlur(Number(e.target.value))}
          />
        </div>
      </div>
      <div className="controls">
        <div className="field">
          <label>Spread: {spread}px</label>
          <input
            aria-label="Spread"
            type="range"
            min="-50"
            max="50"
            value={spread}
            onChange={e => setSpread(Number(e.target.value))}
          />
        </div>
        <div className="field">
          <label>Color</label>
          <input
            aria-label="Color"
            type="color"
            value={color}
            onChange={e => setColor(e.target.value)}
            style={{ height: 46, padding: 4 }}
          />
        </div>
        <div className="field">
          <label>Opacity: {opacity}%</label>
          <input
            aria-label="Opacity"
            type="range"
            min="0"
            max="100"
            value={opacity}
            onChange={e => setOpacity(Number(e.target.value))}
          />
        </div>
      </div>
      <label className="checkRow" style={{ marginTop: 16 }}>
        <input type="checkbox" checked={inset} onChange={e => setInset(e.target.checked)} />
        Inset shadow
      </label>
      <pre className="codeBox">{code}</pre>
      <div className="heroActions" style={{ justifyContent: 'flex-start', marginTop: 14 }}>
        <button className="btn btnDark" onClick={copy}>
          Copy CSS
        </button>
      </div>
    </ToolShell>
  );
}

export function ColorPaletteExtractor() {
  const [colors, setColors] = useState<string[]>([]);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const extract = (file: File) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      const canvas = canvasRef.current || document.createElement('canvas');
      const size = 100;
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext('2d')!;
      ctx.drawImage(img, 0, 0, size, size);
      const data = ctx.getImageData(0, 0, size, size).data;
      const buckets: Record<string, number> = Object.create(null);
      for (let i = 0; i < data.length; i += 4 * 7) {
        const r = Math.round(data[i] / 32) * 32,
          g = Math.round(data[i + 1] / 32) * 32,
          b = Math.round(data[i + 2] / 32) * 32;
        const key = `${r},${g},${b}`;
        buckets[key] = (buckets[key] || 0) + 1;
      }
      const sorted = Object.entries(buckets)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 6);
      setColors(
        sorted.map(([k]) => {
          const [r, g, b] = k.split(',').map(Number);
          return '#' + [r, g, b].map(n => Math.min(255, n).toString(16).padStart(2, '0')).join('');
        }),
      );
      URL.revokeObjectURL(url);
    };
    img.src = url;
  };
  const copy = (hex: string) => navigator.clipboard?.writeText(hex);
  return (
    <ToolShell
      title="Extract a color palette from an image"
      description="Upload an image to pull out its dominant colors as ready-to-copy HEX codes. Processing happens locally in your browser."
      faq={[
        {
          q: 'Is my image uploaded to a server?',
          a: 'No. The image is analyzed on a canvas in your browser and never leaves your device.',
        },
        {
          q: 'How many colors does it extract?',
          a: 'The tool returns up to 6 dominant colors sorted by how often they appear.',
        },
      ]}
    >
      <Dropzone onFile={extract} />
      <canvas ref={canvasRef} className="hidden" />
      {colors.length > 0 && (
        <div className="swatchRow">
          {colors.map(c => (
            <div
              key={c}
              className="swatch"
              style={{ background: c, cursor: 'pointer' }}
              onClick={() => copy(c)}
              title="Click to copy"
            >
              {c}
            </div>
          ))}
        </div>
      )}
    </ToolShell>
  );
}

function gcd(a: number, b: number): number {
  return b === 0 ? a : gcd(b, a % b);
}
const PRESETS = [
  { name: 'Instagram Post', w: 1080, h: 1080 },
  { name: 'Instagram Story / Reel', w: 1080, h: 1920 },
  { name: 'YouTube Thumbnail', w: 1280, h: 720 },
  { name: 'YouTube Video', w: 1920, h: 1080 },
  { name: 'X / Twitter Post', w: 1200, h: 675 },
  { name: 'Facebook Cover', w: 820, h: 312 },
  { name: 'LinkedIn Banner', w: 1584, h: 396 },
  { name: 'TikTok Video', w: 1080, h: 1920 },
];

export function AspectRatioCalculator() {
  const [w, setW] = useState(1920);
  const [h, setH] = useState(1080);
  const valid = w > 0 && h > 0;
  const d = valid ? gcd(w, h) : 1;
  return (
    <ToolShell
      title="Aspect ratio calculator for video & social media"
      description="Calculate the simplified aspect ratio of any resolution, or jump to standard sizes for Instagram, YouTube, TikTok, X and LinkedIn."
      faq={[
        {
          q: 'Why does aspect ratio matter?',
          a: 'Using the right ratio for each platform avoids automatic cropping or black bars on images and video.',
        },
      ]}
    >
      <div className="controls">
        <div className="field">
          <label>Width (px)</label>
          <input
            aria-label="Width (px)"
            type="number"
            min="1"
            value={w}
            onChange={e => setW(Number(e.target.value))}
          />
        </div>
        <div className="field">
          <label>Height (px)</label>
          <input
            aria-label="Height (px)"
            type="number"
            min="1"
            value={h}
            onChange={e => setH(Number(e.target.value))}
          />
        </div>
      </div>
      {valid ? (
        <div className="result">
          <span>Simplified ratio</span>
          <b style={{ fontSize: 22 }}>
            {w / d}:{h / d}
          </b>
        </div>
      ) : (
        <div className="notice error">Enter positive width and height values.</div>
      )}
      <div
        style={{
          height: Math.min(220, 220 * (Math.min(h, w) / Math.max(h, w))),
          maxWidth: '100%',
          aspectRatio: `${w} / ${h}`,
          background: 'linear-gradient(135deg,var(--brand),var(--brand2))',
          borderRadius: 16,
          margin: '20px auto 0',
        }}
      />
      <h3 style={{ margin: '28px 0 14px' }}>Common presets</h3>
      <div className="toggleGroup">
        {PRESETS.map(p => (
          <button
            key={p.name}
            className="toggleBtn"
            onClick={() => {
              setW(p.w);
              setH(p.h);
            }}
          >
            {p.name} ({p.w}×{p.h})
          </button>
        ))}
      </div>
    </ToolShell>
  );
}
