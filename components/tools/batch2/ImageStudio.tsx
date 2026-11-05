'use client';
/**
 * Image Studio: a multi-step workflow for many images at once —
 * resize to a preset (Instagram, YouTube, passport…) → convert → compress → download all as a ZIP.
 */
import { useEffect, useState } from 'react';
import ToolShell from '@/components/shared/ToolShell';
import { Choice, Note } from '@/components/shared/ui';
import { formatBytes } from '@/lib/utils/image';
import { downloadBlob } from '@/lib/utils/download';
import { takeHandedOffFiles } from '@/lib/utils/fileHandoff';

const PRESETS = [
  { id: 'original', label: 'Original size', w: 0, h: 0 },
  { id: 'max1920', label: 'Web (max 1920 px wide)', w: 1920, h: 0 },
  { id: 'ig-square', label: 'Instagram post 1080×1080', w: 1080, h: 1080 },
  { id: 'ig-portrait', label: 'Instagram portrait 1080×1350', w: 1080, h: 1350 },
  { id: 'ig-story', label: 'Story / Reel 1080×1920', w: 1080, h: 1920 },
  { id: 'yt', label: 'YouTube thumbnail 1280×720', w: 1280, h: 720 },
  { id: 'linkedin', label: 'LinkedIn post 1200×627', w: 1200, h: 627 },
  { id: 'fb-cover', label: 'Facebook cover 820×312', w: 820, h: 312 },
  { id: 'passport', label: 'Passport photo 35×45 mm (300 dpi)', w: 413, h: 531 },
  { id: 'shop', label: 'Online store 2000×2000', w: 2000, h: 2000 },
] as const;
type Fmt = 'image/jpeg' | 'image/webp' | 'image/png';
const EXT: Record<Fmt, string> = { 'image/jpeg': 'jpg', 'image/webp': 'webp', 'image/png': 'png' };
type Out = { name: string; before: number; blob: Blob; w: number; h: number };

async function processOne(
  file: File,
  preset: (typeof PRESETS)[number],
  fit: 'cover' | 'contain',
  fmt: Fmt,
  q: number,
  bg: string,
): Promise<Out> {
  const img = await createImageBitmap(file);
  let w = img.width;
  let h = img.height;
  if (preset.w && preset.h) {
    w = preset.w;
    h = preset.h;
  } else if (preset.w && img.width > preset.w) {
    w = preset.w;
    h = Math.round((img.height * preset.w) / img.width);
  }
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  const ctx = c.getContext('2d')!;
  if (fmt === 'image/jpeg' || fit === 'contain') {
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, w, h);
  }
  const scale =
    preset.w && preset.h
      ? fit === 'cover'
        ? Math.max(w / img.width, h / img.height)
        : Math.min(w / img.width, h / img.height)
      : w / img.width;
  const dw = img.width * scale;
  const dh = img.height * scale;
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(img, (w - dw) / 2, (h - dh) / 2, dw, dh);
  img.close();
  const blob = await new Promise<Blob>((res, rej) =>
    c.toBlob(b => (b ? res(b) : rej(new Error('encode'))), fmt, q),
  );
  return {
    name: `${file.name.replace(/\.[^.]+$/, '')}-${preset.id}.${EXT[fmt]}`,
    before: file.size,
    blob,
    w,
    h,
  };
}

export function ImageStudio() {
  const [files, setFiles] = useState<File[]>([]);
  // An image chosen in the File Workspace opens here automatically.
  useEffect(() => {
    const fs = takeHandedOffFiles(x => x.type.startsWith('image/'));
    // eslint-disable-next-line react-hooks/set-state-in-effect -- receive the handed-over files once
    if (fs.length) setFiles(fs.slice(0, 50));
  }, []);
  const [preset, setPreset] = useState<(typeof PRESETS)[number]['id']>('max1920');
  const [fit, setFit] = useState<'cover' | 'contain'>('cover');
  const [fmt, setFmt] = useState<Fmt>('image/webp');
  const [q, setQ] = useState(0.8);
  const [bg, setBg] = useState('#ffffff');
  const [busy, setBusy] = useState(0);
  const [outs, setOuts] = useState<Out[]>([]);
  const [error, setError] = useState('');
  const p = PRESETS.find(x => x.id === preset)!;

  const pick = (list: FileList | null) => {
    if (!list) return;
    const imgs = Array.from(list).filter(f => f.type.startsWith('image/'));
    if (imgs.length < list.length) setError('Some files were skipped because they are not images.');
    else setError('');
    setFiles(imgs.slice(0, 50));
    setOuts([]);
  };
  const run = async () => {
    setOuts([]);
    setError('');
    const res: Out[] = [];
    for (let i = 0; i < files.length; i++) {
      setBusy(i + 1);
      try {
        res.push(await processOne(files[i], p, fit, fmt, q, bg));
      } catch {
        setError(`“${files[i].name}” could not be processed and was skipped.`);
      }
    }
    setOuts(res);
    setBusy(0);
  };
  const zip = async () => {
    const JSZip = (await import('jszip')).default;
    const z = new JSZip();
    const used = new Set<string>();
    outs.forEach(o => {
      let n = o.name;
      for (let k = 2; used.has(n); k++) n = o.name.replace(/(\.[^.]+)$/, `-${k}$1`);
      used.add(n);
      z.file(n, o.blob);
    });
    downloadBlob(await z.generateAsync({ type: 'blob' }), 'craftsprint-images.zip');
  };
  const total = (a: number[]) => a.reduce((x, y) => x + y, 0);
  const before = total(outs.map(o => o.before));
  const after = total(outs.map(o => o.blob.size));

  return (
    <ToolShell
      title="Image Studio — batch resize, convert & compress"
      description="Process up to 50 images in one go: pick a size preset (Instagram, YouTube, passport, online store…), a format and quality, then download everything as a ZIP."
      faq={[
        {
          q: 'Are my photos uploaded?',
          a: 'No. Every image is processed in your browser and the ZIP is created on your device.',
        },
        {
          q: 'What is the difference between Fill and Fit?',
          a: 'Fill covers the whole size and trims the edges if the shape is different. Fit keeps the whole picture and adds a background colour around it.',
        },
        {
          q: 'Is the passport preset official?',
          a: 'It makes a 35×45 mm photo at 300 dpi (413×531 px), the size used by many countries. Always check your country’s exact rules for background and face size.',
        },
      ]}
    >
      <label className="dropzone wsDrop">
        <input type="file" accept="image/*" multiple hidden onChange={e => pick(e.target.files)} />
        <p className="dropTitle">
          {files.length
            ? `${files.length} image${files.length > 1 ? 's' : ''} selected — click to change`
            : 'Choose up to 50 images'}
        </p>
        <p>JPG, PNG, WebP, GIF · processed in your browser</p>
      </label>
      <div className="field">
        <label htmlFor="is-preset">Size preset</label>
        <select id="is-preset" value={preset} onChange={e => setPreset(e.target.value as typeof preset)}>
          {PRESETS.map(x => (
            <option key={x.id} value={x.id}>
              {x.label}
            </option>
          ))}
        </select>
      </div>
      {p.w > 0 && p.h > 0 && (
        <Choice
          options={[
            { value: 'cover' as const, label: 'Fill (crop to size)' },
            { value: 'contain' as const, label: 'Fit (add background)' },
          ]}
          value={fit}
          set={setFit}
        />
      )}
      <div className="controls" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))' }}>
        <div className="field">
          <label htmlFor="is-fmt">Format</label>
          <select id="is-fmt" value={fmt} onChange={e => setFmt(e.target.value as Fmt)}>
            <option value="image/webp">WebP (smallest)</option>
            <option value="image/jpeg">JPG</option>
            <option value="image/png">PNG (lossless)</option>
          </select>
        </div>
        {fmt !== 'image/png' && (
          <div className="field">
            <label htmlFor="is-q">Quality {Math.round(q * 100)}%</label>
            <input
              id="is-q"
              type="range"
              min="0.4"
              max="1"
              step="0.05"
              value={q}
              onChange={e => setQ(Number(e.target.value))}
            />
          </div>
        )}
        <div className="field">
          <label htmlFor="is-bg">Background</label>
          <input id="is-bg" type="color" value={bg} onChange={e => setBg(e.target.value)} />
        </div>
      </div>
      <button className="btn btnPrimary" disabled={!files.length || busy > 0} onClick={run}>
        {busy
          ? `Processing ${busy} of ${files.length}…`
          : `Process ${files.length || ''} image${files.length === 1 ? '' : 's'}`}
      </button>
      {error && <Note error>{error}</Note>}
      {outs.length > 0 && (
        <>
          <div className="proStats" style={{ marginTop: 16 }}>
            <div>
              <small>Before</small>
              <b>{formatBytes(before)}</b>
            </div>
            <div>
              <small>After</small>
              <b>{formatBytes(after)}</b>
            </div>
            <div>
              <small>Saved</small>
              <b className={after < before ? 'good' : ''}>
                {before ? Math.max(0, Math.round((1 - after / before) * 100)) : 0}%
              </b>
            </div>
          </div>
          <ul className="isList">
            {outs.map((o, i) => (
              <li key={i}>
                <span>{o.name}</span>
                <small>
                  {o.w}×{o.h} · {formatBytes(o.before)} → {formatBytes(o.blob.size)}
                </small>
                <button className="btn btnGhost" onClick={() => downloadBlob(o.blob, o.name)}>
                  Download
                </button>
              </li>
            ))}
          </ul>
          <button className="btn btnDark" onClick={zip}>
            Download all as ZIP
          </button>
        </>
      )}
    </ToolShell>
  );
}
