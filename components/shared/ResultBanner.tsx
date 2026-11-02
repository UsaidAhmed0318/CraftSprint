'use client';
/** Shows the files a tool just produced, so visitors can see the job worked and download again. */
import { useEffect, useRef, useState } from 'react';
import { CircleCheck, Download } from 'lucide-react';
import { FILE_READY_EVENT, type ReadyFile } from '@/lib/utils/download';

const size = (b: number) =>
  b < 1024 * 1024 ? `${Math.max(1, Math.round(b / 1024))} KB` : `${(b / 1024 / 1024).toFixed(1)} MB`;

const KEEP = 5;

export default function ResultBanner() {
  const [files, setFiles] = useState<ReadyFile[]>([]);
  const all = useRef(new Set<string>());

  useEffect(() => {
    const urls = all.current;
    const onReady = (e: Event) => {
      const f = (e as CustomEvent<ReadyFile>).detail;
      urls.add(f.url);
      setFiles(prev => {
        const next = [f, ...prev.filter(p => p.name !== f.name)];
        // Free memory used by files that drop off the list (after the browser has started the download).
        const dropped = [...prev.filter(p => p.name === f.name), ...next.slice(KEEP)];
        setTimeout(() => dropped.forEach(d => URL.revokeObjectURL(d.url)), 4000);
        return next.slice(0, KEEP);
      });
    };
    window.addEventListener(FILE_READY_EVENT, onReady);
    return () => {
      window.removeEventListener(FILE_READY_EVENT, onReady);
      urls.forEach(u => URL.revokeObjectURL(u));
    };
  }, []);

  if (!files.length) return null;
  return (
    <div className="resultBanner" role="status">
      <p>
        <CircleCheck size={18} />{' '}
        {files.length === 1
          ? 'Your file is ready and has been downloaded.'
          : 'Your files are ready and have been downloaded.'}
      </p>
      <ul>
        {files.map(f => (
          <li key={f.url}>
            <span>
              <b>{f.name}</b> · {size(f.size)}
            </span>
            <a className="btn btnGhost" href={f.url} download={f.name}>
              <Download size={15} /> Download again
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
