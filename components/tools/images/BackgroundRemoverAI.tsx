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
    // Levels: anything below 6% is background, above 94% is fully solid; smooth in between (keeps soft hair edges).
    a = (a - 0.06) / 0.88;
    a = a <= 0 ? 0 : a >= 1 ? 1 : a * a * (3 - 2 * a);
    out[i] = Math.round(a * 255);
  }
  return out;
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
  const alpha = refineMatte(raw.length === n ? raw : raw.subarray(0, n), q === 'hq');
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
  const [quality, setQuality] = useState<Quality>('hq');
  const [split, setSplit] = useState(50);
  const [color, setColor] = useState('#2563eb');
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const bitmap = useRef<ImageBitmap | null>(null);
  const [ready, setReady] = useState(false);

  const onFile = async (f: File) => {
    setFile(f);
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
      const c = await cutOut(bitmap.current, quality, pct =>
        setStatus(`Downloading the AI model (${MODELS[quality].mb} MB, one time only)… ${pct}%`),
      );
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
          ]}
          value={quality}
          set={q => {
            setQuality(q);
            setCut(null);
            setPreview('');
          }}
        />
        <small className="proHint">
          {quality === 'hq'
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
