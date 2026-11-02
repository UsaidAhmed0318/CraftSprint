'use client';
import { deliverCanvas } from '@/lib/utils/download';
import { useRevokeObjectUrl } from '@/hooks/useObjectUrl';
import { useState, useRef, useEffect, useMemo } from 'react';
import JsBarcode from 'jsbarcode';
import Dropzone from '@/components/shared/Dropzone';
import ToolShell from '@/components/shared/ToolShell';

export function BorderRadiusPreviewer() {
  const [tl, setTl] = useState(24);
  const [tr, setTr] = useState(24);
  const [br, setBr] = useState(24);
  const [bl, setBl] = useState(24);
  const radius = `${tl}px ${tr}px ${br}px ${bl}px`;
  const code = `border-radius: ${radius};`;
  const copy = () => navigator.clipboard?.writeText(code);
  return (
    <ToolShell
      title="CSS border-radius previewer"
      description="Adjust each corner independently and copy the generated border-radius CSS, with a live preview."
      faq={[
        {
          q: 'Can I set each corner separately?',
          a: 'Yes, each of the four corners has its own slider and can be set to a different value.',
        },
      ]}
    >
      <div
        style={{
          height: 200,
          display: 'grid',
          placeItems: 'center',
          background: '#f7f8fb',
          borderRadius: 16,
          marginBottom: 20,
        }}
      >
        <div
          style={{
            width: 160,
            height: 120,
            background: 'linear-gradient(135deg,var(--brand),var(--brand2))',
            borderRadius: radius,
          }}
        />
      </div>
      <div className="controls">
        <div className="field">
          <label>Top left: {tl}px</label>
          <input
            aria-label="Top left"
            type="range"
            min="0"
            max="100"
            value={tl}
            onChange={e => setTl(Number(e.target.value))}
          />
        </div>
        <div className="field">
          <label>Top right: {tr}px</label>
          <input
            aria-label="Top right"
            type="range"
            min="0"
            max="100"
            value={tr}
            onChange={e => setTr(Number(e.target.value))}
          />
        </div>
        <div className="field">
          <label>Bottom right: {br}px</label>
          <input
            aria-label="Bottom right"
            type="range"
            min="0"
            max="100"
            value={br}
            onChange={e => setBr(Number(e.target.value))}
          />
        </div>
      </div>
      <div className="controls">
        <div className="field">
          <label>Bottom left: {bl}px</label>
          <input
            aria-label="Bottom left"
            type="range"
            min="0"
            max="100"
            value={bl}
            onChange={e => setBl(Number(e.target.value))}
          />
        </div>
      </div>
      <pre className="codeBox">{code}</pre>
      <div className="heroActions" style={{ justifyContent: 'flex-start', marginTop: 14 }}>
        <button className="btn btnDark" onClick={copy}>
          Copy CSS
        </button>
      </div>
    </ToolShell>
  );
}

const PATTERNS = ['dots', 'stripes', 'grid', 'cross'] as const;
function patternSvg(type: (typeof PATTERNS)[number], color: string, size: number) {
  if (type === 'dots')
    return `<svg xmlns='http://www.w3.org/2000/svg' width='${size}' height='${size}'><circle cx='${size / 2}' cy='${size / 2}' r='${size / 8}' fill='${color}'/></svg>`;
  if (type === 'stripes')
    return `<svg xmlns='http://www.w3.org/2000/svg' width='${size}' height='${size}'><rect width='${size / 2}' height='${size}' fill='${color}'/></svg>`;
  if (type === 'grid')
    return `<svg xmlns='http://www.w3.org/2000/svg' width='${size}' height='${size}'><rect width='${size}' height='2' fill='${color}'/><rect width='2' height='${size}' fill='${color}'/></svg>`;
  return `<svg xmlns='http://www.w3.org/2000/svg' width='${size}' height='${size}'><line x1='0' y1='0' x2='${size}' y2='${size}' stroke='${color}' stroke-width='2'/><line x1='${size}' y1='0' x2='0' y2='${size}' stroke='${color}' stroke-width='2'/></svg>`;
}

export function SvgPatternGenerator() {
  const [type, setType] = useState<(typeof PATTERNS)[number]>('dots');
  const [color, setColor] = useState('#2563eb');
  const [size, setSize] = useState(24);
  const svg = patternSvg(type, color, size);
  const dataUrl = `data:image/svg+xml,${encodeURIComponent(svg)}`;
  const code = `background-image: url("${dataUrl}");\nbackground-size: ${size}px ${size}px;`;
  const copy = () => navigator.clipboard?.writeText(code);
  return (
    <ToolShell
      title="SVG background pattern generator"
      description="Create a tiling dots, stripes, grid or cross-hatch background pattern and copy the CSS to use anywhere."
      faq={[
        {
          q: 'How do I use the generated pattern?',
          a: "Copy the CSS and paste it into any element's style — it tiles automatically as a background-image.",
        },
      ]}
    >
      <div
        style={{
          height: 180,
          borderRadius: 16,
          backgroundImage: `url("${dataUrl}")`,
          backgroundSize: `${size}px ${size}px`,
          border: '1px solid var(--line)',
          marginBottom: 20,
        }}
      />
      <div className="toggleGroup">
        {PATTERNS.map(p => (
          <button key={p} className={`toggleBtn ${type === p ? 'active' : ''}`} onClick={() => setType(p)}>
            {p}
          </button>
        ))}
      </div>
      <div className="controls">
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
          <label>Tile size: {size}px</label>
          <input
            aria-label="Tile size"
            type="range"
            min="8"
            max="80"
            value={size}
            onChange={e => setSize(Number(e.target.value))}
          />
        </div>
      </div>
      <pre className="codeBox">{code}</pre>
      <div className="heroActions" style={{ justifyContent: 'flex-start', marginTop: 14 }}>
        <button className="btn btnDark" onClick={copy}>
          Copy CSS
        </button>
      </div>
    </ToolShell>
  );
}

export function ImageToBase64() {
  const [file, setFile] = useState<File | null>(null);
  const [dataUrl, setDataUrl] = useState('');
  const onFile = (f: File) => {
    setFile(f);
    const reader = new FileReader();
    reader.onload = () => setDataUrl(reader.result as string);
    reader.readAsDataURL(f);
  };
  const copy = () => navigator.clipboard?.writeText(dataUrl);
  return (
    <ToolShell
      title="Image to Base64 converter"
      description="Convert an image into a Base64 data URI you can embed directly in HTML, CSS or JSON, with no server upload."
      faq={[
        {
          q: 'Is my image uploaded?',
          a: 'No, the file is read locally in your browser using the FileReader API.',
        },
        {
          q: 'When should I use a data URI?',
          a: 'Data URIs are useful for small icons or inline images where an extra network request is not worth it.',
        },
      ]}
    >
      <Dropzone onFile={onFile} />
      {file && dataUrl && (
        <>
          <img src={dataUrl} alt="preview" className="previewImg" style={{ maxHeight: 180 }} />
          <pre className="codeBox" style={{ wordBreak: 'break-all' }}>
            {dataUrl.slice(0, 400)}
            {dataUrl.length > 400 ? '…' : ''}
          </pre>
          <div className="heroActions" style={{ justifyContent: 'flex-start', marginTop: 14 }}>
            <button className="btn btnDark" onClick={copy}>
              Copy full data URI
            </button>
          </div>
        </>
      )}
    </ToolShell>
  );
}

export function PlaceholderImageGenerator() {
  const [w, setW] = useState(800);
  const [h, setH] = useState(450);
  const [bg, setBg] = useState('#2563eb');
  const [fg, setFg] = useState('#ffffff');
  const [out, setOut] = useState('');
  const generate = () => {
    const canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d')!;
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = fg;
    ctx.font = `bold ${Math.max(16, Math.round(Math.min(w, h) / 8))}px sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(`${w} × ${h}`, w / 2, h / 2);
    setOut(canvas.toDataURL('image/png'));
  };
  return (
    <ToolShell
      title="Placeholder image generator"
      description="Generate a solid-color placeholder image at any size, with the dimensions printed on it, for mockups and layout testing."
      faq={[{ q: 'What format is the output?', a: 'PNG, generated entirely on a canvas in your browser.' }]}
    >
      <div className="controls">
        <div className="field">
          <label>Width</label>
          <input
            aria-label="Width"
            type="number"
            min="1"
            value={w}
            onChange={e => setW(Number(e.target.value))}
          />
        </div>
        <div className="field">
          <label>Height</label>
          <input
            aria-label="Height"
            type="number"
            min="1"
            value={h}
            onChange={e => setH(Number(e.target.value))}
          />
        </div>
        <div className="field">
          <label>Background</label>
          <input
            aria-label="Background"
            type="color"
            value={bg}
            onChange={e => setBg(e.target.value)}
            style={{ height: 46, padding: 4 }}
          />
        </div>
      </div>
      <div className="controls">
        <div className="field">
          <label>Text color</label>
          <input
            aria-label="Text color"
            type="color"
            value={fg}
            onChange={e => setFg(e.target.value)}
            style={{ height: 46, padding: 4 }}
          />
        </div>
      </div>
      <div style={{ marginTop: 16 }}>
        <button className="btn btnPrimary" onClick={generate}>
          Generate placeholder
        </button>
      </div>
      {out && (
        <div className="result">
          <img src={out} alt="placeholder" style={{ maxWidth: 200, borderRadius: 10 }} />
          <a className="btn btnDark" href={out} download={`placeholder-${w}x${h}.png`}>
            Download
          </a>
        </div>
      )}
    </ToolShell>
  );
}

export function BarcodeGenerator() {
  const [value, setValue] = useState('123456789012');
  const [format, setFormat] = useState('CODE128');
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const error = useMemo(() => {
    if (!value || typeof document === 'undefined') return '';
    try {
      JsBarcode(document.createElement('canvas'), value, {
        format,
        width: 2,
        height: 80,
        displayValue: true,
      });
      return '';
    } catch {
      return 'This value is not valid for the selected barcode format.';
    }
  }, [value, format]);
  useEffect(() => {
    if (!canvasRef.current || !value || error) return;
    JsBarcode(canvasRef.current, value, { format, width: 2, height: 80, displayValue: true });
  }, [value, format, error]);
  const download = () => {
    if (!canvasRef.current) return;
    deliverCanvas(canvasRef.current, 'barcode.png');
  };
  return (
    <ToolShell
      title="Barcode generator online"
      description="Generate a scannable barcode (CODE128, EAN13, UPC and more) from any text or number, downloadable as PNG."
      faq={[
        {
          q: 'Which barcode formats are supported?',
          a: 'CODE128, EAN-13, EAN-8, UPC and a few other common retail and logistics formats.',
        },
      ]}
    >
      <div className="controls">
        <div className="field">
          <label>Value</label>
          <input aria-label="Value" value={value} onChange={e => setValue(e.target.value)} />
        </div>
        <div className="field">
          <label>Format</label>
          <select aria-label="Format" value={format} onChange={e => setFormat(e.target.value)}>
            <option value="CODE128">CODE128</option>
            <option value="EAN13">EAN-13</option>
            <option value="EAN8">EAN-8</option>
            <option value="UPC">UPC</option>
            <option value="CODE39">CODE39</option>
          </select>
        </div>
      </div>
      {error && <div className="notice error">{error}</div>}
      <div className="qrPreview">
        <canvas ref={canvasRef} />
      </div>
      <div style={{ marginTop: 14 }}>
        <button className="btn btnDark" onClick={download}>
          Download PNG
        </button>
      </div>
    </ToolShell>
  );
}

export function VideoThumbnailGrabber() {
  const [url, setUrl] = useState('');
  useRevokeObjectUrl(url);
  const [out, setOut] = useState('');
  const videoRef = useRef<HTMLVideoElement>(null);
  const onFile = (f: File) => setUrl(URL.createObjectURL(f));
  const grab = () => {
    const v = videoRef.current;
    if (!v) return;
    const canvas = document.createElement('canvas');
    canvas.width = v.videoWidth;
    canvas.height = v.videoHeight;
    canvas.getContext('2d')!.drawImage(v, 0, 0);
    setOut(canvas.toDataURL('image/png'));
  };
  return (
    <ToolShell
      title="Video thumbnail grabber"
      description="Upload a video, scrub to the frame you want and grab it as a downloadable image, entirely in your browser."
      faq={[
        {
          q: 'Is my video uploaded?',
          a: 'No, the video is played and captured locally using the HTML5 video and canvas APIs.',
        },
      ]}
    >
      <Dropzone accept="video/*" onFile={onFile} />
      {url && (
        <video ref={videoRef} src={url} controls style={{ width: '100%', borderRadius: 14, marginTop: 16 }} />
      )}
      {url && (
        <div style={{ marginTop: 14 }}>
          <button className="btn btnPrimary" onClick={grab}>
            Grab current frame
          </button>
        </div>
      )}
      {out && (
        <div className="result">
          <img src={out} alt="frame" style={{ maxWidth: 220, borderRadius: 10 }} />
          <a className="btn btnDark" href={out} download="thumbnail.png">
            Download
          </a>
        </div>
      )}
    </ToolShell>
  );
}
