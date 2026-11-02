'use client';
import { installPolyfills } from '@/lib/utils/polyfills';
import { downloadBlob } from '@/lib/utils/download';
import { useRevokeObjectUrl } from '@/hooks/useObjectUrl';
import { useState } from 'react';
import Dropzone from '@/components/shared/Dropzone';
import ToolShell from '@/components/shared/ToolShell';

async function loadPdfjs() {
  installPolyfills();
  const pdfjs = await import('pdfjs-dist');
  pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.polyfilled.mjs';
  return pdfjs;
}
const download = downloadBlob;
function pdfBlob(bytes: Uint8Array): Blob {
  return new Blob([bytes.buffer as ArrayBuffer], { type: 'application/pdf' });
}

export function ImageToPdfConverter() {
  const [files, setFiles] = useState<File[]>([]);
  const [busy, setBusy] = useState(false);
  const addFile = (f: File) => setFiles(prev => [...prev, f]);
  const build = async () => {
    if (files.length === 0) return;
    setBusy(true);
    try {
      const { PDFDocument } = await import('@cantoo/pdf-lib');
      const pdf = await PDFDocument.create();
      for (const file of files) {
        const bytes = await file.arrayBuffer();
        const isPng = file.type === 'image/png';
        const img = isPng ? await pdf.embedPng(bytes) : await pdf.embedJpg(bytes);
        const page = pdf.addPage([img.width, img.height]);
        page.drawImage(img, { x: 0, y: 0, width: img.width, height: img.height });
      }
      const bytes = await pdf.save();
      download(pdfBlob(bytes), 'images.pdf');
    } catch (e) {
      console.error('[CraftSprint PDF]', e);
      alert('Could not build the PDF. Make sure all files are JPG or PNG images.');
    } finally {
      setBusy(false);
    }
  };
  return (
    <ToolShell
      title="Image to PDF converter"
      description="Combine one or more JPG or PNG images into a single downloadable PDF, entirely in your browser."
      faq={[
        {
          q: 'Can I add multiple images?',
          a: 'Yes, add as many as you like — each becomes its own page, in the order added.',
        },
      ]}
    >
      <Dropzone onFile={addFile} />
      {files.length > 0 && (
        <div className="stats">
          {files.map((f, i) => (
            <span key={i}>{f.name}</span>
          ))}
        </div>
      )}
      {files.length > 0 && (
        <div className="heroActions" style={{ justifyContent: 'flex-start', marginTop: 14 }}>
          <button className="btn btnPrimary" disabled={busy} onClick={build}>
            {busy ? 'Building…' : 'Create PDF'}
          </button>
          <button className="btn btnGhost" onClick={() => setFiles([])}>
            Clear
          </button>
        </div>
      )}
    </ToolShell>
  );
}

export function PdfToImageConverter() {
  const [file, setFile] = useState<File | null>(null);
  const [images, setImages] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);
  const convert = async () => {
    if (!file) return;
    setBusy(true);
    setImages([]);
    try {
      const pdfjs = await loadPdfjs();
      const buf = await file.arrayBuffer();
      const doc = await pdfjs.getDocument({ data: buf }).promise;
      const out: string[] = [];
      for (let i = 1; i <= doc.numPages; i++) {
        const page = await doc.getPage(i);
        const viewport = page.getViewport({ scale: 2 });
        const canvas = document.createElement('canvas');
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        await page.render({ canvasContext: canvas.getContext('2d')!, viewport, canvas }).promise;
        out.push(canvas.toDataURL('image/png'));
      }
      setImages(out);
    } catch (e) {
      console.error('[CraftSprint PDF]', e);
      alert('Could not read this PDF file.');
    } finally {
      setBusy(false);
    }
  };
  return (
    <ToolShell
      title="PDF to image converter"
      description="Convert every page of a PDF into a downloadable PNG image, rendered locally in your browser."
      faq={[
        { q: 'Is my PDF uploaded to a server?', a: 'No, pages are rendered to canvas locally using PDF.js.' },
      ]}
    >
      <Dropzone onFile={setFile} accept=".pdf,application/pdf" />
      {file && (
        <div style={{ marginTop: 16 }}>
          <button className="btn btnPrimary" disabled={busy} onClick={convert}>
            {busy ? 'Converting…' : 'Convert to images'}
          </button>
        </div>
      )}
      {images.map((src, i) => (
        <div className="result" key={i}>
          <img src={src} alt={`page ${i + 1}`} style={{ maxWidth: 160, borderRadius: 8 }} />
          <a className="btn btnDark" href={src} download={`page-${i + 1}.png`}>
            Download page {i + 1}
          </a>
        </div>
      ))}
    </ToolShell>
  );
}

export function PdfMergeTool() {
  const [files, setFiles] = useState<File[]>([]);
  const [busy, setBusy] = useState(false);
  const merge = async () => {
    if (files.length < 2) return;
    setBusy(true);
    try {
      const { PDFDocument } = await import('@cantoo/pdf-lib');
      const merged = await PDFDocument.create();
      for (const file of files) {
        const bytes = await file.arrayBuffer();
        const src = await PDFDocument.load(bytes);
        const pages = await merged.copyPages(src, src.getPageIndices());
        pages.forEach(p => merged.addPage(p));
      }
      const bytes = await merged.save();
      download(pdfBlob(bytes), 'merged.pdf');
    } catch (e) {
      console.error('[CraftSprint PDF]', e);
      alert('Could not merge these PDF files.');
    } finally {
      setBusy(false);
    }
  };
  return (
    <ToolShell
      title="PDF merge tool"
      description="Combine multiple PDF files into one document, in the order you add them, entirely in your browser."
      faq={[
        {
          q: 'Is there a file limit?',
          a: 'No hard limit, but very large PDFs may be slow to process depending on your device.',
        },
      ]}
    >
      <Dropzone onFile={f => setFiles(prev => [...prev, f])} accept=".pdf,application/pdf" />
      {files.length > 0 && (
        <div className="stats">
          {files.map((f, i) => (
            <span key={i}>
              {i + 1}. {f.name}
            </span>
          ))}
        </div>
      )}
      {files.length > 1 && (
        <div className="heroActions" style={{ justifyContent: 'flex-start', marginTop: 14 }}>
          <button className="btn btnPrimary" disabled={busy} onClick={merge}>
            {busy ? 'Merging…' : 'Merge PDFs'}
          </button>
          <button className="btn btnGhost" onClick={() => setFiles([])}>
            Clear
          </button>
        </div>
      )}
    </ToolShell>
  );
}

export function PdfSplitTool() {
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const split = async () => {
    if (!file) return;
    setBusy(true);
    try {
      const { PDFDocument } = await import('@cantoo/pdf-lib');
      const JSZip = (await import('jszip')).default;
      const bytes = await file.arrayBuffer();
      const src = await PDFDocument.load(bytes);
      const zip = new JSZip();
      for (let i = 0; i < src.getPageCount(); i++) {
        const out = await PDFDocument.create();
        const [page] = await out.copyPages(src, [i]);
        out.addPage(page);
        const pageBytes = await out.save();
        zip.file(`page-${i + 1}.pdf`, pageBytes);
      }
      const zipBlob = await zip.generateAsync({ type: 'blob' });
      download(zipBlob, 'split-pages.zip');
    } catch (e) {
      console.error('[CraftSprint PDF]', e);
      alert('Could not split this PDF file.');
    } finally {
      setBusy(false);
    }
  };
  return (
    <ToolShell
      title="PDF split tool"
      description="Split a multi-page PDF into individual single-page PDF files, packaged as a ZIP."
      faq={[
        {
          q: 'How are the files named?',
          a: 'Each page is saved as page-1.pdf, page-2.pdf, and so on, inside a single ZIP download.',
        },
      ]}
    >
      <Dropzone onFile={setFile} accept=".pdf,application/pdf" />
      {file && (
        <div style={{ marginTop: 16 }}>
          <button className="btn btnPrimary" disabled={busy} onClick={split}>
            {busy ? 'Splitting…' : 'Split into pages'}
          </button>
        </div>
      )}
    </ToolShell>
  );
}

export function TextToPdfConverter() {
  const [text, setText] = useState('');
  const [busy, setBusy] = useState(false);
  const build = async () => {
    if (!text.trim()) return;
    setBusy(true);
    try {
      const { PDFDocument, StandardFonts, rgb } = await import('@cantoo/pdf-lib');
      const pdf = await PDFDocument.create();
      const font = await pdf.embedFont(StandardFonts.Helvetica);
      const fontSize = 12,
        margin = 50,
        pageWidth = 612,
        pageHeight = 792,
        maxWidth = pageWidth - margin * 2;
      const words = text.split(/\s+/);
      let page = pdf.addPage([pageWidth, pageHeight]);
      let y = pageHeight - margin;
      let line = '';
      const lines: string[] = [];
      for (const word of words) {
        const test = line ? `${line} ${word}` : word;
        if (font.widthOfTextAtSize(test, fontSize) > maxWidth) {
          lines.push(line);
          line = word;
        } else line = test;
      }
      if (line) lines.push(line);
      for (const l of lines) {
        if (y < margin) {
          page = pdf.addPage([pageWidth, pageHeight]);
          y = pageHeight - margin;
        }
        page.drawText(l, { x: margin, y, size: fontSize, font, color: rgb(0.06, 0.08, 0.1) });
        y -= fontSize * 1.4;
      }
      const bytes = await pdf.save();
      download(pdfBlob(bytes), 'document.pdf');
    } finally {
      setBusy(false);
    }
  };
  return (
    <ToolShell
      title="Text to PDF converter"
      description="Type or paste plain text and generate a downloadable, paginated PDF document."
      faq={[
        {
          q: 'Does it support formatting like bold or images?',
          a: 'No, this creates a simple plain-text PDF with automatic word wrap and pagination.',
        },
      ]}
    >
      <textarea
        aria-label="Text input"
        className="textArea"
        value={text}
        onChange={e => setText(e.target.value)}
        placeholder="Paste or type your document text here…"
      />
      <div style={{ marginTop: 16 }}>
        <button className="btn btnPrimary" disabled={busy} onClick={build}>
          {busy ? 'Building…' : 'Generate PDF'}
        </button>
      </div>
    </ToolShell>
  );
}

export function PdfTextExtractor() {
  const [file, setFile] = useState<File | null>(null);
  const [text, setText] = useState('');
  const [busy, setBusy] = useState(false);
  const extract = async () => {
    if (!file) return;
    setBusy(true);
    setText('');
    try {
      const pdfjs = await loadPdfjs();
      const buf = await file.arrayBuffer();
      const doc = await pdfjs.getDocument({ data: buf }).promise;
      let out = '';
      for (let i = 1; i <= doc.numPages; i++) {
        const page = await doc.getPage(i);
        const content = await page.getTextContent();
        out += content.items.map(it => ('str' in it ? it.str : '')).join(' ') + '\n\n';
      }
      setText(out.trim());
    } catch (e) {
      console.error('[CraftSprint PDF]', e);
      alert('Could not read text from this PDF.');
    } finally {
      setBusy(false);
    }
  };
  const copy = () => navigator.clipboard?.writeText(text);
  return (
    <ToolShell
      title="PDF text extractor"
      description="Extract the plain text content from a PDF file so you can copy, search or edit it, entirely in your browser."
      faq={[
        {
          q: 'Does this convert to an editable Word document?',
          a: 'No, it extracts the raw text content only. Formatting, images and layout are not preserved.',
        },
        {
          q: 'Will this work on scanned PDFs?',
          a: 'No, scanned image-only PDFs have no embedded text layer; this tool only extracts text that is already selectable in the PDF.',
        },
      ]}
    >
      <Dropzone onFile={setFile} accept=".pdf,application/pdf" />
      {file && (
        <div style={{ marginTop: 16 }}>
          <button className="btn btnPrimary" disabled={busy} onClick={extract}>
            {busy ? 'Extracting…' : 'Extract text'}
          </button>
        </div>
      )}
      {text && (
        <>
          <pre className="codeBox" style={{ maxHeight: 400 }}>
            {text}
          </pre>
          <div className="heroActions" style={{ justifyContent: 'flex-start', marginTop: 14 }}>
            <button className="btn btnDark" onClick={copy}>
              Copy text
            </button>
          </div>
        </>
      )}
    </ToolShell>
  );
}

export function PdfPasswordProtector() {
  const [file, setFile] = useState<File | null>(null);
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const protect = async () => {
    if (!file || !password) return;
    setBusy(true);
    setError('');
    try {
      const { PDFDocument } = await import('@cantoo/pdf-lib');
      const bytes = await file.arrayBuffer();
      const doc = await PDFDocument.load(bytes);
      doc.encrypt({ userPassword: password, ownerPassword: password });
      const out = await doc.save();
      download(pdfBlob(out), 'protected.pdf');
    } catch {
      setError('Could not protect this PDF. It may already be encrypted or corrupted.');
    } finally {
      setBusy(false);
    }
  };
  return (
    <ToolShell
      title="PDF password protector"
      description="Add a password to a PDF so it can only be opened with the correct password. Encryption is applied entirely in your browser."
      faq={[
        {
          q: 'What encryption is used?',
          a: 'AES-256, the strongest option recommended by the current PDF standard.',
        },
        {
          q: 'Is my PDF uploaded anywhere?',
          a: 'No, encryption happens locally in your browser — the file never leaves your device.',
        },
      ]}
    >
      <Dropzone onFile={setFile} accept=".pdf,application/pdf" />
      {file && (
        <div className="field" style={{ marginTop: 14 }}>
          <label>New password</label>
          <input
            aria-label="New password"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
        </div>
      )}
      {error && <div className="notice error">{error}</div>}
      {file && password && (
        <div style={{ marginTop: 16 }}>
          <button className="btn btnPrimary" disabled={busy} onClick={protect}>
            {busy ? 'Protecting…' : 'Protect PDF'}
          </button>
        </div>
      )}
    </ToolShell>
  );
}

export function PdfPasswordUnlocker() {
  const [file, setFile] = useState<File | null>(null);
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const unlock = async () => {
    if (!file) return;
    setBusy(true);
    setError('');
    try {
      const { PDFDocument } = await import('@cantoo/pdf-lib');
      const bytes = await file.arrayBuffer();
      const doc = await PDFDocument.load(bytes, { password });
      const out = await doc.save();
      download(pdfBlob(out), 'unlocked.pdf');
    } catch {
      setError('Could not unlock this PDF. Check that the password is correct.');
    } finally {
      setBusy(false);
    }
  };
  return (
    <ToolShell
      title="PDF password unlocker"
      description="Remove a known password from a protected PDF, entirely in your browser."
      faq={[
        {
          q: 'Can this crack a password I do not know?',
          a: 'No, you must already know the correct password — this tool only removes encryption once the document is unlocked with it.',
        },
        { q: 'Is my PDF uploaded anywhere?', a: 'No, decryption happens locally in your browser.' },
      ]}
    >
      <Dropzone onFile={setFile} accept=".pdf,application/pdf" />
      {file && (
        <div className="field" style={{ marginTop: 14 }}>
          <label>Current password</label>
          <input
            aria-label="Current password"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
        </div>
      )}
      {error && <div className="notice error">{error}</div>}
      {file && (
        <div style={{ marginTop: 16 }}>
          <button className="btn btnPrimary" disabled={busy} onClick={unlock}>
            {busy ? 'Unlocking…' : 'Unlock PDF'}
          </button>
        </div>
      )}
    </ToolShell>
  );
}

export function PdfCompressor() {
  const [file, setFile] = useState<File | null>(null);
  const [quality, setQuality] = useState(0.6);
  const [scale, setScale] = useState(1);
  const [busy, setBusy] = useState(false);
  const [before, setBefore] = useState(0);
  const [after, setAfter] = useState(0);
  const [out, setOut] = useState('');
  useRevokeObjectUrl(out);
  const compress = async () => {
    if (!file) return;
    setBusy(true);
    setOut('');
    try {
      const pdfjs = await loadPdfjs();
      const { PDFDocument } = await import('@cantoo/pdf-lib');
      const buf = await file.arrayBuffer();
      const srcDoc = await pdfjs.getDocument({ data: buf }).promise;
      const outDoc = await PDFDocument.create();
      for (let i = 1; i <= srcDoc.numPages; i++) {
        const page = await srcDoc.getPage(i);
        const viewport = page.getViewport({ scale });
        const canvas = document.createElement('canvas');
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        await page.render({ canvasContext: canvas.getContext('2d')!, viewport, canvas }).promise;
        const jpegUrl = canvas.toDataURL('image/jpeg', quality);
        const jpegBytes = await (await fetch(jpegUrl)).arrayBuffer();
        const img = await outDoc.embedJpg(jpegBytes);
        const pdfPage = outDoc.addPage([img.width, img.height]);
        pdfPage.drawImage(img, { x: 0, y: 0, width: img.width, height: img.height });
      }
      const bytes = await outDoc.save();
      setBefore(file.size);
      setAfter(bytes.length);
      setOut(URL.createObjectURL(pdfBlob(bytes)));
    } catch (e) {
      console.error('[CraftSprint PDF]', e);
      alert('Could not compress this PDF.');
    } finally {
      setBusy(false);
    }
  };
  return (
    <ToolShell
      title="PDF compressor"
      description="Shrink a PDF by re-rendering each page as a compressed image at your chosen quality — effective for scanned or image-heavy PDFs."
      faq={[
        {
          q: 'Will the text still be selectable?',
          a: 'No. This method rasterizes each page to an image to reduce size, so text is no longer selectable or searchable afterwards. For text-heavy PDFs where you need to keep selectable text, this trade-off may not be worth it.',
        },
        {
          q: 'How much smaller will my file be?',
          a: 'It depends heavily on the original PDF — scanned or image-heavy documents usually shrink the most.',
        },
      ]}
    >
      <Dropzone onFile={setFile} accept=".pdf,application/pdf" />
      <div className="controls">
        <div className="field">
          <label>Image quality: {Math.round(quality * 100)}%</label>
          <input
            aria-label="Image quality"
            type="range"
            min="0.2"
            max="0.95"
            step="0.05"
            value={quality}
            onChange={e => setQuality(Number(e.target.value))}
          />
        </div>
        <div className="field">
          <label>Resolution scale: {scale.toFixed(1)}×</label>
          <input
            aria-label="Resolution scale"
            type="range"
            min="0.5"
            max="2"
            step="0.1"
            value={scale}
            onChange={e => setScale(Number(e.target.value))}
          />
        </div>
      </div>
      {file && (
        <div style={{ marginTop: 16 }}>
          <button className="btn btnPrimary" disabled={busy} onClick={compress}>
            {busy ? 'Compressing…' : 'Compress PDF'}
          </button>
        </div>
      )}
      {out && (
        <div className="result">
          <div>
            <b>Done</b>
            <div className="stats">
              <span>Before: {(before / 1024).toFixed(0)} KB</span>
              <span>After: {(after / 1024).toFixed(0)} KB</span>
              <span>Saved: {Math.max(0, Math.round((1 - after / before) * 100))}%</span>
            </div>
          </div>
          <a className="btn btnDark" href={out} download="compressed.pdf">
            Download
          </a>
        </div>
      )}
    </ToolShell>
  );
}
