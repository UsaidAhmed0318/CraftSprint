'use client';
import { ShieldCheck, Layers, Gauge, ArrowLeftRight } from 'lucide-react';
import { useEffect, useState } from 'react';
import Dropzone from '@/components/shared/Dropzone';
import { canvasBlob, formatBytes } from '@/lib/utils/image';
import ToolShell from '@/components/shared/ToolShell';
import { ScanOverlay } from '@/components/shared/ProFx';
import { useRevokeObjectUrl } from '@/hooks/useObjectUrl';
import { loadImage } from '@/lib/utils/image';
/** File name without its extension, for naming downloads (photo.jpg → photo). */
const baseName = (f: File | null) => (f?.name || 'image').replace(/\.[^.]+$/, '');

const OUT_EXT: Record<string, string> = { 'image/jpeg': 'jpg', 'image/webp': 'webp', 'image/png': 'png' };

/** Image Compressor PRO: real browser-side compression with a before/after comparison slider. */
export function ImageCompressor() {
  const [file, setFile] = useState<File | null>(null);
  const [src, setSrc] = useState('');
  const [out, setOut] = useState<string>('');
  useRevokeObjectUrl(src);
  useRevokeObjectUrl(out);
  const [quality, setQuality] = useState(0.75);
  const [format, setFormat] = useState<'auto' | 'image/jpeg' | 'image/webp'>('auto');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [after, setAfter] = useState(0);
  const [outType, setOutType] = useState('image/webp');
  const [split, setSplit] = useState(50);

  const reset = () => {
    setOut('');
    setAfter(0);
    setError('');
  };
  const run = async () => {
    if (!file) return;
    setBusy(true);
    setError('');
    try {
      const type = format !== 'auto' ? format : file.type === 'image/jpeg' ? 'image/jpeg' : 'image/webp';
      const b = await canvasBlob(file, type, quality);
      setOutType(type);
      setAfter(b.size);
      setOut(URL.createObjectURL(b));
      setSplit(50);
    } catch {
      setError('This image could not be read. Try a JPG, PNG or WebP file.');
    } finally {
      setBusy(false);
    }
  };
  const saved = file && after ? Math.round((1 - after / file.size) * 100) : 0;

  return (
    <ToolShell
      wide
      title="Compress images online"
      description="Reduce JPG, PNG and WebP file size in seconds and compare before and after. Processing happens in your browser — your image is not uploaded."
      faq={[
        {
          q: 'Are my images uploaded?',
          a: 'No. This tool processes the selected image in your browser. The image is not sent to a CraftSprint upload server.',
        },
        {
          q: 'What format is the output?',
          a: 'With “Auto”, JPG stays JPG and PNG or WebP become WebP, which is usually much smaller. You can also choose JPG or WebP yourself. Transparency is kept in WebP but not in JPG.',
        },
        {
          q: 'Why is my file not smaller?',
          a: 'Images that are already heavily compressed may not shrink further. Lower the quality, choose WebP, or make the image smaller with the image resizer.',
        },
      ]}
    >
      <div className="proGrid">
        <div className="proMain">
          <Dropzone
            onFile={f => {
              setFile(f);
              setSrc(URL.createObjectURL(f));
              reset();
            }}
          />
          {file && (
            <div className="compare" style={{ '--split': `${split}%` } as React.CSSProperties}>
              {busy && <ScanOverlay label="Compressing…" />}
              <img src={src} alt="Original image" className="compareImg" />
              {out && (
                <div className="compareAfter">
                  <img src={out} alt="Compressed image" className="compareImg" />
                </div>
              )}
              <span className="compareTag before">Before</span>
              {out && <span className="compareTag after">After</span>}
              {out && (
                <>
                  <span className="compareHandle" aria-hidden="true">
                    <span className="compareKnob">
                      <ArrowLeftRight size={18} />
                    </span>
                  </span>
                  <input
                    className="compareRange"
                    type="range"
                    min="0"
                    max="100"
                    value={split}
                    onChange={e => setSplit(Number(e.target.value))}
                    aria-label="Move to compare the original and compressed image"
                  />
                </>
              )}
            </div>
          )}
          {file && (
            <div className="proStats">
              <div>
                <small>Original size</small>
                <b>{formatBytes(file.size)}</b>
              </div>
              <div>
                <small>Compressed size</small>
                <b>{after ? formatBytes(after) : '—'}</b>
              </div>
              <div>
                <small>Reduction</small>
                <b className={saved > 0 ? 'good' : ''}>{after ? `${saved > 0 ? saved : 0}%` : '—'}</b>
              </div>
            </div>
          )}
          {after > 0 && saved <= 0 && (
            <div className="notice">
              This image is already well compressed — the new file is not smaller. Try a lower quality or
              WebP, or keep your original.
            </div>
          )}
          {error && (
            <div className="notice error" role="alert">
              {error}
            </div>
          )}
        </div>

        <aside className="proSide" aria-label="Compression settings">
          <h2 className="proSideTitle">Compression settings</h2>
          <div className="field">
            <label htmlFor="cmp-q" className="proRow">
              <span>Quality</span>
              <b>{Math.round(quality * 100)}%</b>
            </label>
            <input
              id="cmp-q"
              type="range"
              min="0.2"
              max="1"
              step="0.05"
              value={quality}
              onChange={e => {
                setQuality(Number(e.target.value));
                reset();
              }}
            />
            <small className="proHint">60–80% is usually the best balance of size and quality.</small>
          </div>
          <div className="field">
            <label htmlFor="cmp-f">Output format</label>
            <select
              id="cmp-f"
              value={format}
              onChange={e => {
                setFormat(e.target.value as typeof format);
                reset();
              }}
            >
              <option value="auto">Auto (best for this image)</option>
              <option value="image/webp">WebP — smallest, keeps transparency</option>
              <option value="image/jpeg">JPG — opens everywhere</option>
            </select>
          </div>
          <button className="btn btnPrimary proGo" disabled={!file || busy} onClick={run}>
            {busy ? 'Optimizing…' : 'Optimize image'}
          </button>
          <ul className="proFeatures">
            <li>
              <span className="g4">
                <ShieldCheck size={17} />
              </span>
              <div>
                <b>Private</b>
                <small>Processed in your browser, never uploaded</small>
              </div>
            </li>
            <li>
              <span className="g1">
                <Layers size={17} />
              </span>
              <div>
                <b>JPG, PNG, WebP</b>
                <small>Common web formats supported</small>
              </div>
            </li>
            <li>
              <span className="g3">
                <Gauge size={17} />
              </span>
              <div>
                <b>Real numbers</b>
                <small>Sizes measured from the actual files</small>
              </div>
            </li>
          </ul>
          {out ? (
            <a
              className="btn btnDark proDownload"
              href={out}
              download={`${baseName(file)}-compressed.${OUT_EXT[outType] || 'webp'}`}
            >
              Download
            </a>
          ) : (
            <button type="button" className="btn btnDark proDownload" disabled>
              Download
            </button>
          )}
        </aside>
      </div>
    </ToolShell>
  );
}

export function ImageConverter() {
  const [file, setFile] = useState<File | null>(null);
  const [type, setType] = useState('image/webp');
  const [out, setOut] = useState('');
  useRevokeObjectUrl(out);
  const run = async () => {
    if (!file) return;
    const b = await canvasBlob(file, type, 0.9);
    setOut(URL.createObjectURL(b));
  };
  return (
    <ToolShell
      title="Convert images to JPG, PNG or WebP"
      description="Change image format online without installing software. Your image stays in the browser while it is converted."
      faq={[
        {
          q: 'Can I convert PNG to WebP?',
          a: 'Yes. PNG, JPEG and WebP files can be converted to the supported output formats.',
        },
        {
          q: 'Does conversion reduce quality?',
          a: 'JPEG and WebP use quality settings. PNG output is lossless in the browser canvas pipeline.',
        },
      ]}
    >
      <Dropzone
        onFile={f => {
          setFile(f);
          setOut('');
        }}
      />
      <div className="controls">
        <div className="field">
          <label>Output format</label>
          <select
            aria-label="Output format"
            value={type}
            onChange={e => {
              setType(e.target.value);
              setOut('');
            }}
          >
            <option value="image/webp">WebP</option>
            <option value="image/jpeg">JPG</option>
            <option value="image/png">PNG</option>
          </select>
        </div>
      </div>
      {file && (
        <div style={{ marginTop: 18 }}>
          <button className="btn btnPrimary" onClick={run}>
            Convert image
          </button>
        </div>
      )}
      {out && (
        <div className="result">
          <span>Conversion complete.</span>
          <a
            className="btn btnDark"
            href={out}
            download={`${baseName(file)}.${type === 'image/jpeg' ? 'jpg' : type.split('/')[1]}`}
          >
            Download
          </a>
        </div>
      )}
    </ToolShell>
  );
}
export function ImageResizer() {
  const [file, setFile] = useState<File | null>(null);
  const [w, setW] = useState(1200);
  const [h, setH] = useState(800);
  const [lock, setLock] = useState(true);
  const [ratio, setRatio] = useState(1.5);
  const [out, setOut] = useState('');
  useRevokeObjectUrl(out);
  const run = async () => {
    if (!file) return;
    if (w < 1 || h < 1) return;
    const b = await canvasBlob(file, 'image/webp', 0.9, Math.round(w), Math.round(h));
    setOut(URL.createObjectURL(b));
  };
  return (
    <ToolShell
      title="Resize an image to exact dimensions"
      description="Set the width and height you need, then download a resized WebP image. Useful for websites, social media and documents."
      faq={[
        {
          q: 'What dimensions can I use?',
          a: 'Any positive pixel dimensions supported by your browser canvas can be used, subject to device memory.',
        },
      ]}
    >
      <Dropzone
        onFile={async f => {
          setFile(f);
          setOut('');
          try {
            const img = await loadImage(f);
            setW(img.naturalWidth);
            setH(img.naturalHeight);
            setRatio(img.naturalWidth / img.naturalHeight);
          } catch {}
        }}
      />
      <div className="controls">
        <div className="field">
          <label>Width (px)</label>
          <input
            aria-label="Width (px)"
            type="number"
            min="1"
            value={w}
            onChange={e => {
              const v = Number(e.target.value);
              setW(v);
              if (lock && v > 0) setH(Math.max(1, Math.round(v / ratio)));
              setOut('');
            }}
          />
        </div>
        <div className="field">
          <label>Height (px)</label>
          <input
            aria-label="Height (px)"
            type="number"
            min="1"
            value={h}
            onChange={e => {
              const v = Number(e.target.value);
              setH(v);
              if (lock && v > 0) setW(Math.max(1, Math.round(v * ratio)));
              setOut('');
            }}
          />
        </div>
        <div className="field">
          <label>Aspect ratio</label>
          <label className="checkInline">
            <input type="checkbox" checked={lock} onChange={e => setLock(e.target.checked)} /> Keep
            proportions
          </label>
        </div>
      </div>
      {file && (
        <div style={{ marginTop: 18 }}>
          <button className="btn btnPrimary" onClick={run}>
            Resize image
          </button>
        </div>
      )}
      {out && (
        <div className="result">
          <span>
            {w} × {h}px ready.
          </span>
          <a
            className="btn btnDark"
            href={out}
            download={`${baseName(file)}-${Math.round(w)}x${Math.round(h)}.webp`}
          >
            Download
          </a>
        </div>
      )}
    </ToolShell>
  );
}
export function TextCleaner() {
  const [text, setText] = useState('');
  const clean = () =>
    setText(
      text
        .replace(/[ \t]+/g, ' ')
        .replace(/\n\s*\n\s*/g, '\n')
        .trim(),
    );
  const removeLines = () =>
    setText(
      text
        .split('\n')
        .map(x => x.trim())
        .filter(Boolean)
        .join('\n'),
    );
  return (
    <ToolShell
      title="Clean and format text online"
      description="Remove extra spaces, blank lines and messy copied formatting from text. Great for notes, documents and content editing."
      faq={[
        {
          q: 'Is my text stored?',
          a: 'No. The cleaner runs in your browser and does not need to upload your text.',
        },
        {
          q: 'Can it remove blank lines?',
          a: 'Yes. Use the Remove blank lines action after pasting your text.',
        },
      ]}
    >
      <textarea
        aria-label="Text input"
        className="textArea"
        value={text}
        onChange={e => setText(e.target.value)}
        placeholder="Paste your text here…"
      />
      <div className="heroActions" style={{ justifyContent: 'flex-start' }}>
        <button className="btn btnPrimary" onClick={clean}>
          Clean spaces
        </button>
        <button className="btn btnGhost" onClick={removeLines}>
          Remove blank lines
        </button>
        <button className="btn btnGhost" onClick={() => navigator.clipboard?.writeText(text)}>
          Copy
        </button>
        <button className="btn btnGhost" onClick={() => setText('')}>
          Clear
        </button>
      </div>
      <div className="stats">
        <span>{text.length} characters</span>
        <span>{text.trim() ? text.trim().split(/\s+/).length : 0} words</span>
        <span>{text ? text.split(/\n/).length : 0} lines</span>
      </div>
    </ToolShell>
  );
}
