'use client';
/**
 * File picker used by every file tool. Files never leave the browser.
 * - "Try with a sample" lets a visitor see the tool work without a file of their own.
 * - Resets the input after each pick, so choosing the same file again still works.
 * - Rejects files that don't match `accept` (also on drag-and-drop).
 * - Shows which file is currently loaded.
 */
import { useRef, useState } from 'react';
import { UploadCloud, FileCheck2, Sparkles } from 'lucide-react';
import { formatBytes } from '@/lib/utils/image';
import { makeSampleFile, sampleKind } from '@/lib/utils/samples';

/** Human-readable list of accepted formats, e.g. "image/*" → "JPG, PNG, WebP, GIF". */
function formatsLabel(accept: string) {
  if (!accept || accept === '*') return 'Any file';
  const map: Record<string, string> = {
    'image/*': 'JPG, PNG, WebP, GIF',
    'video/*': 'MP4, WebM, MOV',
    'audio/*': 'MP3, WAV, OGG, M4A',
    'application/pdf': 'PDF',
  };
  return [
    ...new Set(
      accept
        .split(',')
        .map(a => a.trim().toLowerCase())
        .map(a => map[a] || a.replace(/^\./, '').replace(/^.*\//, '').toUpperCase()),
    ),
  ].join(', ');
}

function matches(file: File, accept: string) {
  if (!accept || accept === '*') return true;
  return accept
    .split(',')
    .map(a => a.trim().toLowerCase())
    .some(rule => {
      if (rule.endsWith('/*')) return file.type.toLowerCase().startsWith(rule.slice(0, -1));
      if (rule.startsWith('.')) return file.name.toLowerCase().endsWith(rule);
      return file.type.toLowerCase() === rule;
    });
}

export default function Dropzone({
  onFile,
  accept = 'image/*',
}: {
  onFile: (f: File) => void;
  accept?: string;
}) {
  const ref = useRef<HTMLInputElement>(null);
  const [drag, setDrag] = useState(false);
  const [picked, setPicked] = useState<File | null>(null);
  const [error, setError] = useState('');
  const [making, setMaking] = useState(false);
  const kind = sampleKind(accept);

  const take = (f?: File | null, skipCheck = false) => {
    if (!f) return;
    if (!skipCheck && !matches(f, accept)) {
      setError(`“${f.name}” is not a supported file for this tool.`);
      return;
    }
    setError('');
    setPicked(f);
    onFile(f);
  };

  const useSample = async () => {
    if (!kind) return;
    setError('');
    setMaking(true);
    try {
      take(await makeSampleFile(kind), true);
    } catch {
      setError('Your browser could not create a sample file. Please choose a file instead.');
    } finally {
      setMaking(false);
    }
  };

  return (
    <div
      className={`dropzone ${drag ? 'drag' : ''} ${picked ? 'hasFile' : ''}`}
      onDragOver={e => {
        e.preventDefault();
        setDrag(true);
      }}
      onDragLeave={() => setDrag(false)}
      onDrop={e => {
        e.preventDefault();
        setDrag(false);
        take(e.dataTransfer.files?.[0]);
      }}
    >
      <span className="dropIcon" aria-hidden="true">
        {picked ? <FileCheck2 size={34} /> : <UploadCloud size={40} />}
      </span>
      <h3>
        {picked ? (
          picked.name
        ) : (
          <>
            Drag &amp; drop your file or{' '}
            <button type="button" className="dropLink" onClick={() => ref.current?.click()}>
              click to upload
            </button>
          </>
        )}
      </h3>
      <p>
        {picked
          ? `${formatBytes(picked.size)} · stays on your device`
          : `${formatsLabel(accept)} · processed in your browser, never uploaded`}
      </p>
      <div className="dropActions">
        <button className="btn btnPrimary" type="button" onClick={() => ref.current?.click()}>
          {picked ? 'Choose another file' : 'Choose file'}
        </button>
        {kind && (
          <button className="btn btnGhost" type="button" onClick={useSample} disabled={making}>
            <Sparkles size={16} /> {making ? 'Creating sample…' : 'Try with a sample'}
          </button>
        )}
      </div>
      <input
        ref={ref}
        className="hidden"
        type="file"
        accept={accept}
        aria-label="Choose a file"
        onChange={e => {
          take(e.target.files?.[0]);
          e.target.value = '';
        }}
      />
      {error && (
        <div className="notice error" role="alert">
          {error}
        </div>
      )}
    </div>
  );
}
