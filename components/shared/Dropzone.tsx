'use client';
import { takeHandedOffFile } from '@/lib/utils/fileHandoff';
/**
 * File picker used by every file tool. Files never leave the browser.
 * - "Try with a sample" lets a visitor see the tool work without a file of their own.
 * - Resets the input after each pick, so choosing the same file again still works.
 * - Rejects files that don't match `accept` (also on drag-and-drop).
 * - Shows which file is currently loaded.
 */
import { useEffect, useRef, useState } from 'react';
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
  multiple = false,
}: {
  /** Called once per file (several times when `multiple` is on and several files are chosen). */
  onFile: (f: File) => void;
  accept?: string;
  /** Let the visitor pick or drop several files at once (e.g. PDF merge, images to PDF). */
  multiple?: boolean;
}) {
  const ref = useRef<HTMLInputElement>(null);
  const [drag, setDrag] = useState(false);
  const [picked, setPicked] = useState<File | null>(null);
  const [error, setError] = useState('');
  const [making, setMaking] = useState(false);
  const kind = sampleKind(accept);
  // A file chosen in the File Workspace opens here automatically.
  useEffect(() => {
    const f = takeHandedOffFile(file => matches(file, accept));
    if (f) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- show the handed-over file once
      setPicked(f);
      onFile(f);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const takeMany = (list?: FileList | File[] | null) => {
    const all = Array.from(list || []);
    if (!all.length) return;
    if (!multiple) return take(all[0]);
    const ok = all.filter(f => matches(f, accept));
    const bad = all.length - ok.length;
    setError(
      bad ? `${bad} file${bad > 1 ? 's were' : ' was'} skipped — not a supported type for this tool.` : '',
    );
    if (ok.length) setPicked(ok[ok.length - 1]);
    ok.forEach(f => onFile(f));
  };

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
        takeMany(e.dataTransfer.files);
      }}
    >
      <span className="dropIcon" aria-hidden="true">
        {picked ? <FileCheck2 size={34} /> : <UploadCloud size={40} />}
      </span>
      <p className="dropTitle">
        {picked ? (
          picked.name
        ) : (
          <>
            Drag &amp; drop {multiple ? 'your files' : 'your file'} or{' '}
            <button type="button" className="dropLink" onClick={() => ref.current?.click()}>
              click to upload
            </button>
          </>
        )}
      </p>
      <p>
        {picked
          ? `${formatBytes(picked.size)} · stays on your device`
          : `${formatsLabel(accept)} · processed in your browser, never uploaded`}
      </p>
      <div className="dropActions">
        <button className="btn btnPrimary" type="button" onClick={() => ref.current?.click()}>
          {multiple
            ? picked
              ? 'Add more files'
              : 'Choose files'
            : picked
              ? 'Choose another file'
              : 'Choose file'}
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
        multiple={multiple}
        aria-label={multiple ? 'Choose files' : 'Choose a file'}
        onChange={e => {
          takeMany(e.target.files);
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
