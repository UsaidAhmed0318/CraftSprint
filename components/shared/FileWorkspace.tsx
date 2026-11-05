'use client';
/**
 * Universal File Workspace: drop any file, see what it is, and open it in the right tool in one click.
 * The file stays in this tab's memory and is handed straight to the chosen tool — never uploaded.
 */
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { UploadCloud, FileQuestion, ArrowRight, Layers } from 'lucide-react';
import { tools } from '@/data/tools';
import { formatBytes } from '@/lib/utils/image';
import { handOffFile, handOffFiles } from '@/lib/utils/fileHandoff';

type Kind = 'image' | 'heic' | 'svg' | 'pdf' | 'video' | 'audio' | 'subtitle' | 'other';
const ACTIONS: Record<Kind, string[]> = {
  image: [
    'image-studio',
    'image-compressor',
    'image-upscaler',
    'image-resizer',
    'image-converter',
    'image-cropper',
    'background-remover',
    'image-watermark',
    'image-to-pdf-converter',
    'color-palette-extractor',
    'favicon-generator',
    'image-to-base64',
    'qr-code-scanner',
    'mockup-generator',
  ],
  heic: ['heic-to-jpg'],
  svg: ['svg-to-png-converter', 'image-to-base64'],
  pdf: [
    'pdf-to-word',
    'pdf-compressor',
    'pdf-merge',
    'pdf-split',
    'rotate-pdf',
    'pdf-to-image-converter',
    'pdf-text-extractor',
    'pdf-password-protector',
    'pdf-password-unlocker',
  ],
  video: ['video-compressor', 'video-to-gif-converter', 'video-thumbnail-grabber'],
  audio: ['audio-trimmer', 'audio-speed-changer'],
  subtitle: ['srt-subtitle-formatter'],
  other: [],
};
const LABEL: Record<Kind, string> = {
  image: 'Image',
  heic: 'iPhone photo (HEIC)',
  svg: 'SVG image',
  pdf: 'PDF document',
  video: 'Video',
  audio: 'Audio',
  subtitle: 'Subtitle file',
  other: 'Unknown type',
};

function detect(f: File): Kind {
  const n = f.name.toLowerCase();
  if (/\.(heic|heif)$/.test(n) || /image\/hei[cf]/.test(f.type)) return 'heic';
  if (f.type === 'image/svg+xml' || n.endsWith('.svg')) return 'svg';
  if (f.type.startsWith('image/')) return 'image';
  if (f.type === 'application/pdf' || n.endsWith('.pdf')) return 'pdf';
  if (f.type.startsWith('video/')) return 'video';
  if (f.type.startsWith('audio/')) return 'audio';
  if (n.endsWith('.srt')) return 'subtitle';
  return 'other';
}

export default function FileWorkspace() {
  const [files, setFiles] = useState<File[]>([]);
  const [drag, setDrag] = useState(false);
  const router = useRouter();
  const file = files[0];
  const kind = file ? detect(file) : null;
  const add = (list: FileList | null) => list && list.length && setFiles(Array.from(list));
  const open = (slug: string) => {
    if (!file) return;
    handOffFile(file);
    router.push(`/tools/${slug}`);
  };
  const multipleImages = files.length > 1 && files.every(f => detect(f) === 'image');
  return (
    <div className="workspace">
      <label
        className={`dropzone wsDrop ${drag ? 'drag' : ''}`}
        onDragOver={e => {
          e.preventDefault();
          setDrag(true);
        }}
        onDragLeave={() => setDrag(false)}
        onDrop={e => {
          e.preventDefault();
          setDrag(false);
          add(e.dataTransfer.files);
        }}
      >
        <input type="file" multiple hidden onChange={e => add(e.target.files)} />
        <span className="dropIcon" aria-hidden="true">
          <UploadCloud size={40} />
        </span>
        <p className="dropTitle">Drop any file here or click to choose</p>
        <p>
          Images, PDFs, videos, audio or subtitles — we’ll show what you can do with it. Nothing is uploaded.
        </p>
      </label>

      {file && kind && (
        <section className="wsResult" aria-live="polite">
          <div className="wsInfo">
            <b>{files.length > 1 ? `${files.length} files` : file.name}</b>
            <span>
              {LABEL[kind]} · {formatBytes(files.reduce((n, f) => n + f.size, 0))}
              {file.type ? ` · ${file.type}` : ''}
            </span>
          </div>
          {multipleImages && (
            <button
              type="button"
              className="wsBatch"
              onClick={() => {
                handOffFiles(files);
                router.push('/tools/image-studio');
              }}
            >
              <Layers size={20} /> Process all {files.length} images together in Image Studio{' '}
              <ArrowRight size={16} />
            </button>
          )}
          {ACTIONS[kind].length ? (
            <>
              <h2>What do you want to do?</h2>
              <div className="wsActions">
                {ACTIONS[kind].map(slug => {
                  const t = tools.find(x => x.slug === slug);
                  if (!t) return null;
                  const Icon = t.icon;
                  return (
                    <button key={slug} type="button" className="wsAction" onClick={() => open(slug)}>
                      <Icon size={22} aria-hidden="true" />
                      <span>
                        <b>{t.name}</b>
                        <small>{t.description}</small>
                      </span>
                      <ArrowRight size={16} aria-hidden="true" />
                    </button>
                  );
                })}
              </div>
              <p className="wsNote">Your file opens in the tool automatically.</p>
            </>
          ) : (
            <p className="emptyState big">
              <FileQuestion size={32} aria-hidden="true" />
              No CraftSprint tool works with this file type yet. Try an image, PDF, video, audio or .srt file.
            </p>
          )}
        </section>
      )}
    </div>
  );
}
