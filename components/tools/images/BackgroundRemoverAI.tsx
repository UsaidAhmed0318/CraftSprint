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

const MODEL_URL = 'https://huggingface.co/Xenova/modnet/resolve/main/onnx/model_quantized.onnx';
const MODEL_CACHE = 'cs-models-v1';
type Session = import('onnxruntime-web').InferenceSession;
let sessionPromise: Promise<Session> | null = null;

async function fetchModel(onProgress: (pct: number) => void): Promise<ArrayBuffer> {
  const url = (globalThis as { __CS_BG_MODEL_URL?: string }).__CS_BG_MODEL_URL || MODEL_URL;
  try {
    const cache = await caches.open(MODEL_CACHE);
    const hit = await cache.match(url);
    if (hit) return hit.arrayBuffer();
  } catch {}
  const res = await fetch(url);
  if (!res.ok || !res.body) throw new Error('model');
  const total = Number(res.headers.get('content-length')) || 0;
  const reader = res.body.getReader();
  const parts: Uint8Array[] = [];
  let got = 0;
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    parts.push(value);
    got += value.length;
    if (total) onProgress(Math.round((got / total) * 100));
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

function getSession(onProgress: (pct: number) => void) {
  if (!sessionPromise) {
    sessionPromise = (async () => {
      const ort = await import('onnxruntime-web/wasm');
      ort.env.wasm.wasmPaths = '/ort/';
      ort.env.wasm.numThreads = 1;
      const model = await fetchModel(onProgress);
      return ort.InferenceSession.create(model, { executionProviders: ['wasm'] });
    })().catch(e => {
      sessionPromise = null;
      throw e;
    });
  }
  return sessionPromise;
}

/** Runs MODNet and returns a canvas of the original size with the background made transparent. */
async function cutOut(img: ImageBitmap, onProgress: (pct: number) => void): Promise<HTMLCanvasElement> {
  const session = await getSession(onProgress);
  const ort = await import('onnxruntime-web/wasm');
  // MODNet works at ~512 px with sides that are multiples of 32.
  const scale = 512 / Math.max(img.width, img.height);
  const w = Math.max(32, Math.round((img.width * Math.min(1, scale)) / 32) * 32);
  const h = Math.max(32, Math.round((img.height * Math.min(1, scale)) / 32) * 32);
  const small = document.createElement('canvas');
  small.width = w;
  small.height = h;
  const sctx = small.getContext('2d', { willReadFrequently: true })!;
  sctx.drawImage(img, 0, 0, w, h);
  const px = sctx.getImageData(0, 0, w, h).data;
  const input = new Float32Array(3 * w * h);
  for (let i = 0; i < w * h; i++) {
    input[i] = px[i * 4] / 127.5 - 1;
    input[w * h + i] = px[i * 4 + 1] / 127.5 - 1;
    input[2 * w * h + i] = px[i * 4 + 2] / 127.5 - 1;
  }
  const feeds = { [session.inputNames[0]]: new ort.Tensor('float32', input, [1, 3, h, w]) };
  const result = await session.run(feeds);
  const matte = result[session.outputNames[0]].data as Float32Array;
  // Matte → grayscale alpha image, scaled up smoothly to the original size.
  const m = sctx.createImageData(w, h);
  for (let i = 0; i < w * h; i++) {
    const a = Math.max(0, Math.min(255, Math.round(matte[i] * 255)));
    m.data[i * 4 + 3] = a;
  }
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

  const run = async () => {
    if (!bitmap.current) return;
    setBusy(true);
    setError('');
    setStatus('Loading the AI model…');
    try {
      const c = await cutOut(bitmap.current, pct =>
        setStatus(`Downloading the AI model (one time only)… ${pct}%`),
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
          a: 'No. The AI model is downloaded to your browser once (about 6 MB) and runs on your own device. Your photo stays with you.',
        },
        {
          q: 'Which photos work best?',
          a: 'Clear photos where the person or object stands out — portraits, selfies, products and pets. Very busy scenes or fine hair against a similar colour may leave soft edges.',
        },
        {
          q: 'Can I get a white background for passport or product photos?',
          a: 'Yes. After removing the background, choose White or any colour, then download.',
        },
      ]}
    >
      <Dropzone onFile={onFile} />
      {file && !error && (
        <button className="btn btnPrimary" disabled={busy || !ready} onClick={run} style={{ marginTop: 12 }}>
          {busy ? 'Removing background…' : cut ? 'Run again' : 'Remove background'}
        </button>
      )}
      {status && (
        <p className="notice" role="status">
          {status}
        </p>
      )}
      {error && <Note error>{error}</Note>}
      {(src || preview) && (
        <div className="bgCompare">
          {src && (
            <figure>
              <img src={src} alt="Original" />
              <figcaption>Original</figcaption>
            </figure>
          )}
          {preview && (
            <figure className="checker">
              <img src={preview} alt="Background removed" />
              <figcaption>Result</figcaption>
            </figure>
          )}
        </div>
      )}
      {cut && (
        <>
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
