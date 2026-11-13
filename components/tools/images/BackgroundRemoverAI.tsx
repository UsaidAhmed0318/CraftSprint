'use client';
/**
 * AI background remover (MODNet). Runs fully in the browser with ONNX Runtime Web:
 * the model (~6 MB) is downloaded once from Hugging Face and kept in the browser cache; photos are never uploaded.
 */
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import ToolShell from '@/components/shared/ToolShell';
import Dropzone from '@/components/shared/Dropzone';
import { Choice, Note } from '@/components/shared/ui';
import { downloadBlob } from '@/lib/utils/download';
import { useRevokeObjectUrl } from '@/hooks/useObjectUrl';
import { ScanOverlay, SuccessCard } from '@/components/shared/ProFx';

/**
 * Two open models, both run on the visitor's device:
 * - hq:   ISNet general-use (int8, ~44 MB) — any subject: people, products, cars, animals, objects. 1024×1024.
 * - fast: MODNet (~6 MB) — portraits of people; quick and light for phones.
 */
type Quality = 'hq' | 'fast';
type Mode = Quality | 'logo';
const MODELS: Record<Quality, { url: string; mb: number }> = {
  hq: {
    url: 'https://huggingface.co/onnx-community/ISNet-ONNX/resolve/main/onnx/model_quantized.onnx',
    mb: 44,
  },
  fast: { url: 'https://huggingface.co/Xenova/modnet/resolve/main/onnx/model_quantized.onnx', mb: 6 },
};
const MODEL_CACHE = 'cs-models-v1';
type Session = import('onnxruntime-web').InferenceSession;
const sessions: Partial<Record<Quality, Promise<Session>>> = {};

async function fetchModel(q: Quality, onProgress: (pct: number) => void): Promise<ArrayBuffer> {
  const override = (globalThis as { __CS_BG_MODEL_URL?: string }).__CS_BG_MODEL_URL;
  const url = override || MODELS[q].url;
  try {
    const cache = await caches.open(MODEL_CACHE);
    const hit = await cache.match(url);
    if (hit) return hit.arrayBuffer();
  } catch {}
  const res = await fetch(url);
  if (!res.ok || !res.body) throw new Error('model');
  const total = Number(res.headers.get('content-length')) || MODELS[q].mb * 1024 * 1024;
  const reader = res.body.getReader();
  const parts: Uint8Array[] = [];
  let got = 0;
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    parts.push(value);
    got += value.length;
    onProgress(Math.min(99, Math.round((got / total) * 100)));
  }
  const buf = new Uint8Array(got);
  let o = 0;
  for (const p of parts) {
    buf.set(p, o);
    o += p.length;
  }
  try {
    const cache = await caches.open(MODEL_CACHE);
    await cache.put(
      url,
      new Response(buf.slice().buffer, { headers: { 'content-type': 'application/octet-stream' } }),
    );
  } catch {}
  return buf.buffer;
}

function getSession(q: Quality, onProgress: (pct: number) => void) {
  if (!sessions[q]) {
    sessions[q] = (async () => {
      const ort = await import('onnxruntime-web/wasm');
      ort.env.wasm.wasmPaths = '/ort/';
      ort.env.wasm.numThreads = 1;
      const model = await fetchModel(q, onProgress);
      return ort.InferenceSession.create(model, {
        executionProviders: ['wasm'],
        graphOptimizationLevel: 'all',
      });
    })().catch(e => {
      delete sessions[q];
      throw e;
    });
  }
  return sessions[q]!;
}

/** Cleans a raw matte: stretches it to the full 0–1 range and removes faint haze and pinholes. */
export function refineMatte(matte: Float32Array, minMax: boolean): Uint8ClampedArray {
  let lo = 0;
  let hi = 1;
  if (minMax) {
    lo = Infinity;
    hi = -Infinity;
    for (let i = 0; i < matte.length; i++) {
      if (matte[i] < lo) lo = matte[i];
      if (matte[i] > hi) hi = matte[i];
    }
    if (!(hi - lo > 1e-6)) {
      lo = 0;
      hi = 1;
    }
  }
  const out = new Uint8ClampedArray(matte.length);
  for (let i = 0; i < matte.length; i++) {
    let a = (matte[i] - lo) / (hi - lo);
    // Levels: anything below 15% is background, above 85% is fully solid; smooth in between (keeps soft hair edges
    // but removes the faint speckle a compressed model leaves in flat areas).
    a = (a - 0.15) / 0.7;
    a = a <= 0 ? 0 : a >= 1 ? 1 : a * a * (3 - 2 * a);
    out[i] = Math.round(a * 255);
  }
  return out;
}

/**
 * Logos, icons and graphics on one flat colour are not a job for an AI model (it leaves speckles).
 * These helpers detect that case and remove the exact background colour with clean, anti-aliased edges.
 */
export function detectFlatBackground(
  data: Uint8ClampedArray,
  w: number,
  h: number,
): { bg: [number, number, number]; tol: number } | null {
  const border: number[] = [];
  const push = (x: number, y: number) => border.push((y * w + x) * 4);
  for (let x = 0; x < w; x++) {
    push(x, 0);
    push(x, h - 1);
  }
  for (let y = 0; y < h; y++) {
    push(0, y);
    push(w - 1, y);
  }
  if (border.some(i => data[i + 3] < 250)) return null; // already has transparency
  const med = (c: number) => {
    const v = border.map(i => data[i + c]).sort((a, b) => a - b);
    return v[v.length >> 1];
  };
  const bg: [number, number, number] = [med(0), med(1), med(2)];
  const dist = (i: number) =>
    Math.max(Math.abs(data[i] - bg[0]), Math.abs(data[i + 1] - bg[1]), Math.abs(data[i + 2] - bg[2]));
  const d = border.map(dist).sort((a, b) => a - b);
  // The frame must be one colour: 97% of the border within a small distance of its median colour.
  if (d[Math.floor(d.length * 0.97)] > 14) return null;
  // And the picture must be a graphic (few colours), not a photo taken against a plain wall.
  const buckets = new Map<number, number>();
  const n = w * h;
  for (let i = 0; i < n; i++) {
    const k = ((data[i * 4] >> 4) << 8) | ((data[i * 4 + 1] >> 4) << 4) | (data[i * 4 + 2] >> 4);
    buckets.set(k, (buckets.get(k) || 0) + 1);
  }
  const top = [...buckets.values()]
    .sort((a, b) => b - a)
    .slice(0, 10)
    .reduce((a, b) => a + b, 0);
  if (top / n < 0.9) return null;
  return { bg, tol: Math.max(12, d[Math.floor(d.length * 0.97)] + 10) };
}

/** Alpha for a flat-colour background: 0 at the background colour, 255 away from it, smooth in between. */
export function keyAlpha(
  data: Uint8ClampedArray,
  bg: [number, number, number],
  tol: number,
): Uint8ClampedArray {
  const n = data.length / 4;
  const out = new Uint8ClampedArray(n);
  const hi = tol * 2.4;
  for (let i = 0; i < n; i++) {
    const d = Math.max(
      Math.abs(data[i * 4] - bg[0]),
      Math.abs(data[i * 4 + 1] - bg[1]),
      Math.abs(data[i * 4 + 2] - bg[2]),
    );
    const a = d <= tol ? 0 : d >= hi ? 1 : (d - tol) / (hi - tol);
    out[i] = Math.round(a * 255);
  }
  return out;
}

/** 3×3 median filter: removes isolated speckles from an AI mask without blurring real edges. */
export function despeckle(a: Uint8ClampedArray, w: number, h: number): Uint8ClampedArray {
  const out = new Uint8ClampedArray(a);
  const v = new Uint8Array(9);
  for (let y = 1; y < h - 1; y++)
    for (let x = 1; x < w - 1; x++) {
      let k = 0;
      for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) v[k++] = a[(y + dy) * w + x + dx];
      v.sort();
      out[y * w + x] = v[4];
    }
  return out;
}

/** Exact removal for flat-colour graphics, at the picture's full resolution. */
function cutOutFlat(
  img: ImageBitmap,
  flat: { bg: [number, number, number]; tol: number },
): HTMLCanvasElement {
  const out = document.createElement('canvas');
  out.width = img.width;
  out.height = img.height;
  const ctx = out.getContext('2d', { willReadFrequently: true })!;
  ctx.drawImage(img, 0, 0);
  const d = ctx.getImageData(0, 0, out.width, out.height);
  const alpha = keyAlpha(d.data, flat.bg, flat.tol);
  for (let i = 0; i < alpha.length; i++) {
    const a = alpha[i];
    if (a < 255 && a > 0) {
      // Remove the background tint from edge pixels so no coloured halo is left.
      const f = a / 255;
      for (let c = 0; c < 3; c++)
        d.data[i * 4 + c] = Math.max(
          0,
          Math.min(255, Math.round((d.data[i * 4 + c] - flat.bg[c] * (1 - f)) / f)),
        );
    }
    d.data[i * 4 + 3] = a;
  }
  ctx.putImageData(d, 0, 0);
  return out;
}

/** Colour of the top-left corner (used when the visitor forces Logo mode on a picture that is not flat). */
function cornerColour(img: ImageBitmap): [number, number, number] {
  const c = document.createElement('canvas');
  c.width = 2;
  c.height = 2;
  const ctx = c.getContext('2d', { willReadFrequently: true })!;
  ctx.drawImage(img, 0, 0, 2, 2, 0, 0, 2, 2);
  const d = ctx.getImageData(0, 0, 1, 1).data;
  return [d[0], d[1], d[2]];
}

/** Looks at a small copy of the picture and says whether it is a flat-colour graphic. */
function analyseFlat(img: ImageBitmap) {
  const s = Math.min(1, 256 / Math.max(img.width, img.height));
  const c = document.createElement('canvas');
  c.width = Math.max(8, Math.round(img.width * s));
  c.height = Math.max(8, Math.round(img.height * s));
  const ctx = c.getContext('2d', { willReadFrequently: true })!;
  ctx.imageSmoothingEnabled = false;
  ctx.drawImage(img, 0, 0, c.width, c.height);
  return detectFlatBackground(ctx.getImageData(0, 0, c.width, c.height).data, c.width, c.height);
}

/** Runs the chosen model and returns a canvas of the original size with the background made transparent. */
async function cutOut(
  img: ImageBitmap,
  q: Quality,
  onProgress: (pct: number) => void,
): Promise<HTMLCanvasElement> {
  const session = await getSession(q, onProgress);
  const ort = await import('onnxruntime-web/wasm');
  let w: number;
  let h: number;
  if (q === 'hq') {
    w = 1024;
    h = 1024; // ISNet takes a fixed square; the picture is stretched in and the mask stretched back.
  } else {
    // MODNet: shorter side ≈ 512 (as in the reference implementation), sides multiples of 32, long side ≤ 1024.
    const s = Math.min(512 / Math.min(img.width, img.height), 1024 / Math.max(img.width, img.height));
    w = Math.max(32, Math.round((img.width * s) / 32) * 32);
    h = Math.max(32, Math.round((img.height * s) / 32) * 32);
  }
  const small = document.createElement('canvas');
  small.width = w;
  small.height = h;
  const sctx = small.getContext('2d', { willReadFrequently: true })!;
  sctx.imageSmoothingQuality = 'high';
  sctx.drawImage(img, 0, 0, w, h);
  const px = sctx.getImageData(0, 0, w, h).data;
  const n = w * h;
  const input = new Float32Array(3 * n);
  if (q === 'hq') {
    for (let i = 0; i < n; i++) {
      input[i] = px[i * 4] / 255 - 0.5;
      input[n + i] = px[i * 4 + 1] / 255 - 0.5;
      input[2 * n + i] = px[i * 4 + 2] / 255 - 0.5;
    }
  } else {
    for (let i = 0; i < n; i++) {
      input[i] = px[i * 4] / 127.5 - 1;
      input[n + i] = px[i * 4 + 1] / 127.5 - 1;
      input[2 * n + i] = px[i * 4 + 2] / 127.5 - 1;
    }
  }
  const result = await session.run({
    [session.inputNames[0]]: new ort.Tensor('float32', input, [1, 3, h, w]),
  });
  const raw = result[session.outputNames[0]].data as Float32Array;
  const alpha = despeckle(refineMatte(raw.length === n ? raw : raw.subarray(0, n), q === 'hq'), w, h);
  const m = sctx.createImageData(w, h);
  for (let i = 0; i < n; i++) m.data[i * 4 + 3] = alpha[i];
  const mask = document.createElement('canvas');
  mask.width = w;
  mask.height = h;
  mask.getContext('2d')!.putImageData(m, 0, 0);
  const out = document.createElement('canvas');
  out.width = img.width;
  out.height = img.height;
  const octx = out.getContext('2d')!;
  octx.imageSmoothingQuality = 'high';
  octx.drawImage(mask, 0, 0, img.width, img.height);
  octx.globalCompositeOperation = 'source-in';
  octx.drawImage(img, 0, 0);
  octx.globalCompositeOperation = 'source-over';
  return out;
}

type Bg = 'transparent' | 'white' | 'color';

export function BackgroundRemoverAI() {
  const [file, setFile] = useState<File | null>(null);
  const [src, setSrc] = useState('');
  useRevokeObjectUrl(src);
  const [cut, setCut] = useState<HTMLCanvasElement | null>(null);
  const [preview, setPreview] = useState('');
  useRevokeObjectUrl(preview);
  const [bg, setBg] = useState<Bg>('transparent');
  const [quality, setQuality] = useState<Mode>('hq');
  const [note, setNote] = useState('');
  const [forceAi, setForceAi] = useState(false);
  const [split, setSplit] = useState(50);
  const [color, setColor] = useState('#2563eb');
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const bitmap = useRef<ImageBitmap | null>(null);
  const [ready, setReady] = useState(false);

  const onFile = async (f: File) => {
    setFile(f);
    setForceAi(false);
    setNote('');
    setReady(false);
    setCut(null);
    setPreview('');
    setError('');
    setSrc(URL.createObjectURL(f));
    try {
      bitmap.current?.close();
      bitmap.current = await createImageBitmap(f);
      setReady(true);
    } catch {
      bitmap.current = null;
      setReady(false);
      setError('This image could not be opened. Try a JPG, PNG or WebP photo.');
    }
  };

  // Paste an image from the clipboard (Ctrl/⌘ + V), like the big background-removal sites.
  useEffect(() => {
    const onPaste = (e: ClipboardEvent) => {
      const f = Array.from(e.clipboardData?.files || []).find(x => x.type.startsWith('image/'));
      if (f) void onFile(f);
    };
    window.addEventListener('paste', onPaste);
    return () => window.removeEventListener('paste', onPaste);
  }, []);

  const run = async () => {
    if (!bitmap.current) return;
    setBusy(true);
    setError('');
    setStatus('Preparing the AI…');
    try {
      // Logos and graphics on one flat colour get exact colour removal (an AI model would leave speckles).
      const flat = analyseFlat(bitmap.current);
      let c: HTMLCanvasElement;
      if (quality === 'logo' || (flat && !forceAi)) {
        const use = flat || { bg: cornerColour(bitmap.current), tol: 28 };
        c = cutOutFlat(bitmap.current, use);
        setNote(quality === 'logo' ? '' : 'flat');
      } else {
        setNote('');
        const q: Quality = quality;
        c = await cutOut(bitmap.current, q, pct =>
          setStatus(`Downloading the AI model (${MODELS[q].mb} MB, one time only)… ${pct}%`),
        );
      }
      setStatus('');
      setCut(c);
    } catch {
      setStatus('');
      setError(
        'The AI could not run in this browser or the model could not be downloaded. Check your connection and try again, or use the Solid Colour Background Remover below.',
      );
    } finally {
      setBusy(false);
    }
  };

  // Final picture with the chosen background.
  const compose = (): HTMLCanvasElement | null => {
    if (!cut) return null;
    if (bg === 'transparent') return cut;
    const c = document.createElement('canvas');
    c.width = cut.width;
    c.height = cut.height;
    const ctx = c.getContext('2d')!;
    ctx.fillStyle = bg === 'white' ? '#ffffff' : color;
    ctx.fillRect(0, 0, c.width, c.height);
    ctx.drawImage(cut, 0, 0);
    return c;
  };
  useEffect(() => {
    const c = compose();
    if (!c) return;
    let alive = true;
    c.toBlob(b => {
      if (b && alive) setPreview(URL.createObjectURL(b));
    }, 'image/png');
    return () => {
      alive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cut, bg, color]);

  const save = () => {
    const c = compose();
    if (!c || !file) return;
    const asJpg = bg !== 'transparent';
    c.toBlob(
      b => b && downloadBlob(b, `${file.name.replace(/\.[^.]+$/, '')}-no-bg.${asJpg ? 'jpg' : 'png'}`),
      asJpg ? 'image/jpeg' : 'image/png',
      0.95,
    );
  };

  return (
    <ToolShell
      title="AI background remover"
      description="Remove the background from photos of people, products and pets with AI — free, no signup, and your photo never leaves your device."
      faq={[
        {
          q: 'Is my photo uploaded?',
          a: 'No. The AI model is downloaded to your browser once (44 MB for best quality, 6 MB for the fast portrait model) and runs on your own device. Your photo stays with you.',
        },
        {
          q: 'Which photos work best?',
          a: 'Clear photos where the person or object stands out — portraits, selfies, products and pets. Very busy scenes or fine hair against a similar colour may leave soft edges.',
        },
        {
          q: 'Does it work on logos and graphics?',
          a: 'Yes. When a picture is a logo, icon or graphic on one flat colour, the tool notices and removes that exact colour instead of using the AI, which gives crisp edges with no speckles. You can also choose “Logo / graphic” yourself.',
        },
        {
          q: 'Does it work on cars, products, animals and objects?',
          a: 'Yes. Choose “Best quality — any subject”. It is made for any clear main subject: cars, products, furniture, animals and people. The fast mode is tuned for portraits of people.',
        },
        {
          q: 'Can I get a white background for passport or product photos?',
          a: 'Yes. After removing the background, choose White or any colour, then download.',
        },
      ]}
    >
      <Dropzone onFile={onFile} />
      <p className="wsNote" style={{ marginTop: 6 }}>
        Tip: you can also paste a picture with Ctrl + V.
      </p>
      <div className="field">
        <span className="fieldLabel" id="bgq-label">
          Quality
        </span>
        <Choice
          options={[
            { value: 'hq' as const, label: 'Best quality — any subject' },
            { value: 'fast' as const, label: 'Fast — people & portraits' },
            { value: 'logo' as const, label: 'Logo / graphic' },
          ]}
          value={quality}
          set={q => {
            setQuality(q);
            setCut(null);
            setPreview('');
          }}
        />
        <small className="proHint">
          {quality === 'logo'
            ? 'For logos, icons, signatures and graphics on one flat colour: removes that exact colour with crisp edges. No download needed.'
            : quality === 'hq'
              ? 'People, products, cars, pets and objects. First use downloads a 44 MB AI model (kept for next time); a photo takes about 5–30 seconds depending on your device.'
              : 'Small 6 MB model, best for photos of people. Quicker on phones.'}
        </small>
      </div>
      {file && !error && (
        <button
          className="btn btnPrimary proGo"
          disabled={busy || !ready}
          onClick={run}
          style={{ marginTop: 4 }}
        >
          {busy ? 'Removing background…' : cut ? 'Run again' : 'Remove background'}
        </button>
      )}
      {error && <Note error>{error}</Note>}
      {note === 'flat' && (
        <p className="notice" role="status">
          This looks like a logo or graphic on one flat colour, so that exact colour was removed for crisp,
          clean edges.{' '}
          <button
            type="button"
            className="dropLink"
            onClick={() => {
              setForceAi(true);
              setCut(null);
              setPreview('');
              setNote('');
            }}
          >
            Use the AI instead
          </button>
        </p>
      )}
      {src && !preview && (
        <div className="bgStage">
          <img src={src} alt="Original" />
          {busy && <ScanOverlay label={status || 'Analysing image…'} />}
        </div>
      )}
      {src && preview && (
        <div className="compare bgSlide" style={{ '--split': `${split}%` } as React.CSSProperties}>
          <img src={preview} alt="Background removed" className="compareImg" />
          <div className="compareAfter bgBefore">
            <img src={src} alt="Original" className="compareImg" />
          </div>
          <span className="compareTag before">Result</span>
          <span className="compareTag after">Original</span>
          <span className="compareHandle" aria-hidden="true">
            <span className="compareKnob">⇆</span>
          </span>
          <input
            className="compareRange"
            type="range"
            min="0"
            max="100"
            value={split}
            onChange={e => setSplit(Number(e.target.value))}
            aria-label="Slide to compare the result with the original"
          />
          {busy && <ScanOverlay label={status || 'Analysing image…'} />}
        </div>
      )}
      {cut && (
        <>
          <SuccessCard title="Background removed" detail="Choose a background below, then download." />
          <Choice
            options={[
              { value: 'transparent' as const, label: 'Transparent' },
              { value: 'white' as const, label: 'White' },
              { value: 'color' as const, label: 'Colour' },
            ]}
            value={bg}
            set={setBg}
          />
          {bg === 'color' && (
            <div className="field">
              <label htmlFor="bg-col">Background colour</label>
              <input id="bg-col" type="color" value={color} onChange={e => setColor(e.target.value)} />
            </div>
          )}
          <button className="btn btnDark" onClick={save}>
            Download {bg === 'transparent' ? 'PNG' : 'JPG'}
          </button>
        </>
      )}
      <p className="wsNote">
        Logo or graphic on a single flat colour?{' '}
        <Link href="/tools/solid-background-remover">Use the Solid Colour Background Remover</Link> for
        pixel-exact edges.
      </p>
    </ToolShell>
  );
}
