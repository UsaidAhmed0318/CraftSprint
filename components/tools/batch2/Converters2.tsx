'use client';
/**
 * HEIC → JPG/PNG, PDF → Word (editable text), Image Upscaler (2×/4×), Video Compressor (WebM),
 * Pakistan Salary Tax Calculator. All file work happens in the browser.
 */
import { useEffect, useRef, useState } from 'react';
import ToolShell from '@/components/shared/ToolShell';
import Dropzone from '@/components/shared/Dropzone';
import { Num, Stats, Stat, Choice, Note, money } from '@/components/shared/ui';
import { formatBytes } from '@/lib/utils/image';
import { downloadBlob } from '@/lib/utils/download';
import { loadPdfjs } from '@/components/tools/pdf/PdfTools';

const base = (f: File) => f.name.replace(/\.[^.]+$/, '');

/* ---------- HEIC to JPG ---------- */
export function HeicToJpg() {
  const [file, setFile] = useState<File | null>(null);
  const [fmt, setFmt] = useState<'image/jpeg' | 'image/png'>('image/jpeg');
  const [busy, setBusy] = useState(false);
  const [out, setOut] = useState<Blob | null>(null);
  const [url, setUrl] = useState('');
  const [error, setError] = useState('');
  useEffect(
    () => () => {
      if (url) URL.revokeObjectURL(url);
    },
    [url],
  );
  const run = async () => {
    if (!file) return;
    setBusy(true);
    setError('');
    try {
      const heic2any = (await import('heic2any')).default;
      const res = await heic2any({ blob: file, toType: fmt, quality: 0.9 });
      const b = Array.isArray(res) ? res[0] : res;
      setOut(b);
      setUrl(URL.createObjectURL(b));
    } catch {
      setError('This file could not be converted. Make sure it is an iPhone HEIC/HEIF photo.');
    } finally {
      setBusy(false);
    }
  };
  return (
    <ToolShell
      title="HEIC to JPG converter"
      description="Convert iPhone HEIC/HEIF photos to JPG or PNG so they open everywhere — right in your browser, without uploading."
      faq={[
        {
          q: 'What is a HEIC file?',
          a: 'HEIC is the photo format iPhones use by default. Many Windows apps and websites cannot open it, so converting to JPG makes it work everywhere.',
        },
        {
          q: 'Is quality lost?',
          a: 'JPG is saved at 90% quality, which looks the same to the eye. Choose PNG if you need a lossless copy (bigger file).',
        },
      ]}
    >
      <Dropzone
        accept=".heic,.heif,image/heic,image/heif"
        onFile={f => {
          setFile(f);
          setOut(null);
          setUrl('');
        }}
      />
      <Choice
        options={[
          { value: 'image/jpeg' as const, label: 'JPG' },
          { value: 'image/png' as const, label: 'PNG' },
        ]}
        value={fmt}
        set={v => {
          setFmt(v);
          setOut(null);
        }}
      />
      <button className="btn btnPrimary" disabled={!file || busy} onClick={run}>
        {busy ? 'Converting…' : `Convert to ${fmt === 'image/jpeg' ? 'JPG' : 'PNG'}`}
      </button>
      {error && <Note error>{error}</Note>}
      {out && file && (
        <>
          <img src={url} alt="Converted photo" className="recPreview" style={{ objectFit: 'contain' }} />
          <button
            className="btn btnDark"
            onClick={() => downloadBlob(out, `${base(file)}.${fmt === 'image/jpeg' ? 'jpg' : 'png'}`)}
          >
            Download ({formatBytes(out.size)})
          </button>
        </>
      )}
    </ToolShell>
  );
}

/* ---------- PDF to Word (text) ---------- */
export function PdfToWord() {
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState('');
  const [error, setError] = useState('');
  const [done, setDone] = useState('');
  const run = async () => {
    if (!file) return;
    setError('');
    setDone('');
    try {
      setBusy('Reading PDF…');
      const pdfjs = await loadPdfjs();
      const doc = await pdfjs.getDocument({ data: new Uint8Array(await file.arrayBuffer()) }).promise;
      const { Document, Packer, Paragraph, TextRun, PageBreak } = await import('docx');
      const children: InstanceType<typeof Paragraph>[] = [];
      let chars = 0;
      for (let p = 1; p <= doc.numPages; p++) {
        setBusy(`Page ${p} of ${doc.numPages}…`);
        const page = await doc.getPage(p);
        const tc = await page.getTextContent();
        // Group text items into lines by their vertical position, then lines into paragraphs by gaps.
        const lines: { y: number; text: string }[] = [];
        for (const it of tc.items as { str: string; transform: number[]; hasEOL?: boolean }[]) {
          const y = Math.round(it.transform[5]);
          const last = lines[lines.length - 1];
          if (last && Math.abs(last.y - y) < 3) last.text += it.str;
          else lines.push({ y, text: it.str });
        }
        let para = '';
        let prevY: number | null = null;
        const flush = () => {
          if (para.trim())
            children.push(new Paragraph({ children: [new TextRun(para.trim())], spacing: { after: 160 } }));
          para = '';
        };
        for (const l of lines) {
          if (prevY !== null && prevY - l.y > 20) flush();
          para += (para && !para.endsWith('-') ? ' ' : '') + l.text.trim();
          chars += l.text.length;
          prevY = l.y;
        }
        flush();
        if (p < doc.numPages) children.push(new Paragraph({ children: [new PageBreak()] }));
      }
      if (chars < 20) {
        setError(
          'No selectable text was found. This PDF is probably scanned images — it needs OCR, which this tool does not do.',
        );
        return;
      }
      const blob = await Packer.toBlob(new Document({ sections: [{ children }] }));
      downloadBlob(blob, `${base(file)}.docx`);
      setDone(`Converted ${doc.numPages} page${doc.numPages > 1 ? 's' : ''} to an editable Word document.`);
    } catch {
      setError(
        'This PDF could not be read. It may be damaged or password-protected (use PDF Unlocker first).',
      );
    } finally {
      setBusy('');
    }
  };
  return (
    <ToolShell
      title="PDF to Word converter"
      description="Turn the text of a PDF into an editable Word (.docx) document — paragraphs and pages kept, processed in your browser."
      faq={[
        {
          q: 'Will it keep my exact layout?',
          a: 'It keeps the text, paragraphs and page breaks so you can edit them. Complex layouts, tables, columns and images are not recreated — for those, editing the PDF directly works better.',
        },
        {
          q: 'Does it work with scanned PDFs?',
          a: 'No. Scanned PDFs are pictures of text and need OCR. The tool tells you if no text is found.',
        },
      ]}
    >
      <Dropzone
        accept="application/pdf,.pdf"
        onFile={f => {
          setFile(f);
          setDone('');
          setError('');
        }}
      />
      <button className="btn btnPrimary" disabled={!file || !!busy} onClick={run}>
        {busy || 'Convert to Word'}
      </button>
      {error && <Note error>{error}</Note>}
      {done && <Note>{done} The download has started.</Note>}
    </ToolShell>
  );
}

/* ---------- Image upscaler ---------- */
export function ImageUpscaler() {
  const [file, setFile] = useState<File | null>(null);
  const [scale, setScale] = useState<2 | 3 | 4>(2);
  const [sharpen, setSharpen] = useState(true);
  const [busy, setBusy] = useState(false);
  const [out, setOut] = useState<{ blob: Blob; w: number; h: number } | null>(null);
  const [error, setError] = useState('');
  const run = async () => {
    if (!file) return;
    setBusy(true);
    setError('');
    try {
      const img = await createImageBitmap(file);
      const w = img.width * scale;
      const h = img.height * scale;
      if (w * h > 50_000_000) throw new Error('big');
      const c = document.createElement('canvas');
      c.width = w;
      c.height = h;
      const ctx = c.getContext('2d')!;
      ctx.imageSmoothingQuality = 'high';
      // Step up in 2× stages for a cleaner result than one big jump.
      let src: CanvasImageSource = img;
      let cw = img.width;
      let ch = img.height;
      while (cw * 2 <= w) {
        const t = document.createElement('canvas');
        t.width = cw * 2;
        t.height = ch * 2;
        const tc = t.getContext('2d')!;
        tc.imageSmoothingQuality = 'high';
        tc.drawImage(src, 0, 0, t.width, t.height);
        src = t;
        cw = t.width;
        ch = t.height;
      }
      ctx.drawImage(src, 0, 0, w, h);
      if (sharpen) {
        // Light unsharp mask: original + 0.5 × (original − blurred).
        const d = ctx.getImageData(0, 0, w, h);
        const blur = document.createElement('canvas');
        blur.width = w;
        blur.height = h;
        const bc = blur.getContext('2d')!;
        bc.filter = 'blur(1px)';
        bc.drawImage(c, 0, 0);
        const b = bc.getImageData(0, 0, w, h).data;
        const a = d.data;
        for (let i = 0; i < a.length; i += 4)
          for (let k = 0; k < 3; k++)
            a[i + k] = Math.max(0, Math.min(255, a[i + k] + 0.5 * (a[i + k] - b[i + k])));
        ctx.putImageData(d, 0, 0);
      }
      const blob = await new Promise<Blob>((res, rej) =>
        c.toBlob(x => (x ? res(x) : rej(new Error('encode'))), 'image/png'),
      );
      setOut({ blob, w, h });
    } catch (e) {
      setError(
        (e as Error).message === 'big'
          ? 'The result would be too large for the browser. Try 2× or a smaller image.'
          : 'This image could not be processed.',
      );
    } finally {
      setBusy(false);
    }
  };
  return (
    <ToolShell
      title="Image upscaler (2×, 3×, 4×)"
      description="Make small images bigger with high-quality step-by-step scaling and light sharpening — for printing, thumbnails and old photos."
      faq={[
        {
          q: 'Is this AI upscaling?',
          a: 'No. It uses high-quality scaling and sharpening in your browser. It makes images larger and clearer but cannot invent detail that was never in the photo.',
        },
        {
          q: 'What size can I upscale?',
          a: 'Up to about 50 megapixels of output, which is the safe limit for most browsers.',
        },
      ]}
    >
      <Dropzone
        onFile={f => {
          setFile(f);
          setOut(null);
        }}
      />
      <Choice
        options={[
          { value: 2 as const, label: '2×' },
          { value: 3 as const, label: '3×' },
          { value: 4 as const, label: '4×' },
        ]}
        value={scale}
        set={v => {
          setScale(v);
          setOut(null);
        }}
      />
      <label className="checkInline">
        <input type="checkbox" checked={sharpen} onChange={e => setSharpen(e.target.checked)} /> Sharpen
      </label>
      <button className="btn btnPrimary" disabled={!file || busy} onClick={run}>
        {busy ? 'Upscaling…' : 'Upscale image'}
      </button>
      {error && <Note error>{error}</Note>}
      {out && file && (
        <>
          <Note>
            New size: {out.w}×{out.h} px · {formatBytes(out.blob.size)}
          </Note>
          <button
            className="btn btnDark"
            onClick={() => downloadBlob(out.blob, `${base(file)}-${scale}x.png`)}
          >
            Download PNG
          </button>
        </>
      )}
    </ToolShell>
  );
}

/* ---------- Video compressor (re-encode to WebM) ---------- */
export function VideoCompressor() {
  const [file, setFile] = useState<File | null>(null);
  const [quality, setQuality] = useState<'small' | 'balanced' | 'high'>('balanced');
  const [maxH, setMaxH] = useState<480 | 720 | 1080>(720);
  const [progress, setProgress] = useState(0);
  const [out, setOut] = useState<Blob | null>(null);
  const [error, setError] = useState('');
  const busy = progress > 0 && progress < 100;
  const cancel = useRef(false);
  const run = async () => {
    if (!file) return;
    setError('');
    setOut(null);
    cancel.current = false;
    const types = ['video/webm;codecs=vp9,opus', 'video/webm;codecs=vp8,opus', 'video/webm'];
    const type = types.find(t => typeof MediaRecorder !== 'undefined' && MediaRecorder.isTypeSupported(t));
    if (!type) return setError('Video compression needs Chrome, Edge or Firefox on a computer or Android.');
    const url = URL.createObjectURL(file);
    try {
      const v = document.createElement('video');
      v.src = url;
      v.playsInline = true;
      await new Promise<void>((res, rej) => {
        v.onloadedmetadata = () => res();
        v.onerror = () => rej(new Error('load'));
      });
      const scale = Math.min(1, maxH / v.videoHeight);
      const w = Math.round((v.videoWidth * scale) / 2) * 2;
      const h = Math.round((v.videoHeight * scale) / 2) * 2;
      const c = document.createElement('canvas');
      c.width = w;
      c.height = h;
      const ctx = c.getContext('2d')!;
      const stream = c.captureStream(30);
      const vs = v as HTMLVideoElement & { captureStream?: () => MediaStream };
      const audio = vs.captureStream?.().getAudioTracks()[0];
      if (audio) stream.addTrack(audio);
      const bits = { small: 0.06, balanced: 0.1, high: 0.16 }[quality] * w * h * 30;
      const rec = new MediaRecorder(stream, {
        mimeType: type,
        videoBitsPerSecond: Math.round(bits),
        audioBitsPerSecond: 96000,
      });
      const chunks: BlobPart[] = [];
      rec.ondataavailable = e => e.data.size && chunks.push(e.data);
      const finished = new Promise<void>(res => (rec.onstop = () => res()));
      v.muted = !audio;
      rec.start(500);
      await v.play();
      await new Promise<void>(res => {
        const draw = () => {
          if (cancel.current || v.ended) return res();
          ctx.drawImage(v, 0, 0, w, h);
          setProgress(Math.max(1, Math.min(99, Math.round((v.currentTime / v.duration) * 100))));
          requestAnimationFrame(draw);
        };
        draw();
      });
      rec.stop();
      await finished;
      if (cancel.current) {
        setProgress(0);
        return;
      }
      setOut(new Blob(chunks, { type: 'video/webm' }));
      setProgress(100);
    } catch {
      setError('This video could not be read by your browser. Try an MP4 (H.264) or WebM file.');
      setProgress(0);
    } finally {
      URL.revokeObjectURL(url);
    }
  };
  return (
    <ToolShell
      title="Video compressor"
      description="Make videos smaller by lowering resolution and bitrate, right in your browser. Output is a WebM video that plays in all modern browsers."
      faq={[
        {
          q: 'Why does it take as long as the video?',
          a: 'The browser plays the video once while re-encoding it, so a 2-minute video takes about 2 minutes. Keep this tab open.',
        },
        {
          q: 'Is the output MP4?',
          a: 'No — browsers can only record WebM. WebM plays in Chrome, Edge, Firefox and Android, and uploads to YouTube and most websites.',
        },
        { q: 'Is my video uploaded?', a: 'No. Everything happens on your device.' },
      ]}
    >
      <Dropzone
        accept="video/*"
        onFile={f => {
          setFile(f);
          setOut(null);
          setProgress(0);
        }}
      />
      <Choice
        options={[
          { value: 480 as const, label: '480p' },
          { value: 720 as const, label: '720p' },
          { value: 1080 as const, label: '1080p' },
        ]}
        value={maxH}
        set={setMaxH}
      />
      <Choice
        options={[
          { value: 'small' as const, label: 'Smallest file' },
          { value: 'balanced' as const, label: 'Balanced' },
          { value: 'high' as const, label: 'Higher quality' },
        ]}
        value={quality}
        set={setQuality}
      />
      {!busy ? (
        <button className="btn btnPrimary" disabled={!file} onClick={run}>
          Compress video
        </button>
      ) : (
        <button className="btn btnGhost" onClick={() => (cancel.current = true)}>
          Cancel · {progress}%
        </button>
      )}
      {busy && (
        <div
          className="micMeter"
          role="progressbar"
          aria-valuenow={progress}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Compression progress"
        >
          <span style={{ width: `${progress}%`, background: '#2563eb' }} />
        </div>
      )}
      {error && <Note error>{error}</Note>}
      {out && file && (
        <>
          <Note>
            {formatBytes(file.size)} → {formatBytes(out.size)}
            {out.size < file.size
              ? ` (${Math.round((1 - out.size / file.size) * 100)}% smaller)`
              : ' — already well compressed; try a lower resolution'}
          </Note>
          <button className="btn btnDark" onClick={() => downloadBlob(out, `${base(file)}-compressed.webm`)}>
            Download WebM
          </button>
        </>
      )}
    </ToolShell>
  );
}

/* ---------- Pakistan salary tax ---------- */
type Slab = [number, number, number]; // [from, fixed tax, rate on amount above from]
const SLABS: Record<'2026-27' | '2025-26', Slab[]> = {
  // Finance Act 2026 (tax year 2027)
  '2026-27': [
    [0, 0, 0],
    [600000, 0, 0.01],
    [1200000, 6000, 0.11],
    [2200000, 116000, 0.2],
    [3200000, 316000, 0.25],
    [4100000, 541000, 0.29],
    [5600000, 976000, 0.32],
    [7000000, 1424000, 0.35],
  ],
  // Finance Act 2025 (tax year 2026)
  '2025-26': [
    [0, 0, 0],
    [600000, 0, 0.01],
    [1200000, 6000, 0.11],
    [2200000, 116000, 0.23],
    [3200000, 346000, 0.3],
    [4100000, 616000, 0.35],
  ],
};
export function salaryTax(annual: number, year: '2026-27' | '2025-26') {
  const s = [...SLABS[year]].reverse().find(([from]) => annual > from) || SLABS[year][0];
  let tax = s[1] + (annual - s[0]) * s[2];
  if (year === '2025-26' && annual > 10_000_000) tax *= 1.09; // 9% surcharge (abolished from 2026-27)
  return Math.max(0, tax);
}
export function PakistanSalaryTax() {
  const [monthly, setMonthly] = useState(150000);
  const [year, setYear] = useState<'2026-27' | '2025-26'>('2026-27');
  const annual = monthly * 12;
  const tax = salaryTax(annual, year);
  return (
    <ToolShell
      title="Pakistan salary tax calculator 2026-27"
      description="Calculate income tax on your salary in Pakistan with the FBR slabs for 2026-27 (Finance Act 2026) — monthly tax, yearly tax and take-home pay."
      faq={[
        {
          q: 'Which slabs are used?',
          a: 'Tax year 2027 (July 2026 – June 2027): 0% up to Rs 600,000; then 1%, 11%, 20%, 25%, 29%, 32% and 35% above Rs 7,000,000, with the fixed amounts set by the Finance Act 2026. The 2025-26 slabs are available for comparison.',
        },
        {
          q: 'Is this my exact tax?',
          a: 'It is an estimate for salaried individuals. Allowances, exemptions and withholding adjustments can change it — check the FBR IRIS portal or a tax consultant before filing.',
        },
        {
          q: 'Does it apply to freelancers?',
          a: 'No. These slabs are for salaried people (more than 75% of income from salary). Business and freelance income uses different rates.',
        },
      ]}
    >
      <Choice
        options={[
          { value: '2026-27' as const, label: '2026-27 (current)' },
          { value: '2025-26' as const, label: '2025-26' },
        ]}
        value={year}
        set={setYear}
      />
      <Num label="Monthly salary (PKR)" value={monthly} set={setMonthly} />
      <Stats cols={3}>
        <Stat label="Monthly tax" value={`Rs ${money(tax / 12)}`} />
        <Stat label="Monthly take-home" value={`Rs ${money(monthly - tax / 12)}`} />
        <Stat label="Yearly tax" value={`Rs ${money(tax)}`} />
        <Stat label="Yearly salary" value={`Rs ${money(annual)}`} />
        <Stat label="Effective rate" value={`${annual ? ((tax / annual) * 100).toFixed(2) : '0'}%`} />
      </Stats>
      <Note>Rates: Finance Act 2026 (tax year 2027). Always confirm with FBR before filing.</Note>
    </ToolShell>
  );
}
