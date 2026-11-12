'use client';
import { useRevokeObjectUrl } from '@/hooks/useObjectUrl';
import { useState, useRef } from 'react';
import ToolShell from '@/components/shared/ToolShell';
import Dropzone from '@/components/shared/Dropzone';

function encodeWav(buffer: AudioBuffer): Blob {
  const numCh = buffer.numberOfChannels,
    sampleRate = buffer.sampleRate,
    length = buffer.length * numCh * 2 + 44;
  const arrBuf = new ArrayBuffer(length);
  const view = new DataView(arrBuf);
  const writeStr = (offset: number, s: string) => {
    for (let i = 0; i < s.length; i++) view.setUint8(offset + i, s.charCodeAt(i));
  };
  writeStr(0, 'RIFF');
  view.setUint32(4, 36 + buffer.length * numCh * 2, true);
  writeStr(8, 'WAVE');
  writeStr(12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, numCh, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * numCh * 2, true);
  view.setUint16(32, numCh * 2, true);
  view.setUint16(34, 16, true);
  writeStr(36, 'data');
  view.setUint32(40, buffer.length * numCh * 2, true);
  let offset = 44;
  const channels = Array.from({ length: numCh }, (_, i) => buffer.getChannelData(i));
  for (let i = 0; i < buffer.length; i++) {
    for (let ch = 0; ch < numCh; ch++) {
      const s = Math.max(-1, Math.min(1, channels[ch][i]));
      view.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7fff, true);
      offset += 2;
    }
  }
  return new Blob([arrBuf], { type: 'audio/wav' });
}

export function VideoToGifConverter() {
  const [file, setFile] = useState<File | null>(null);
  const [url, setUrl] = useState('');
  useRevokeObjectUrl(url);
  const [start, setStart] = useState(0);
  const [end, setEnd] = useState(3);
  const [fps, setFps] = useState(8);
  const [scale, setScale] = useState(320);
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState(0);
  const [gifUrl, setGifUrl] = useState('');
  useRevokeObjectUrl(gifUrl);
  const videoRef = useRef<HTMLVideoElement>(null);

  const onFile = (f: File) => {
    setFile(f);
    setUrl(URL.createObjectURL(f));
    setGifUrl('');
  };

  const generate = async () => {
    const video = videoRef.current;
    if (!video) return;
    setBusy(true);
    setProgress(0);
    setGifUrl('');
    try {
      const GIF = (await import('gif.js.optimized')).default;
      const w = scale,
        h = Math.round(scale * (video.videoHeight / video.videoWidth || 0.5625));
      const gif = new GIF({ workers: 2, quality: 10, width: w, height: h, workerScript: '/gif.worker.js' });
      const canvas = document.createElement('canvas');
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext('2d')!;
      const frameCount = Math.max(1, Math.round((end - start) * fps));
      for (let i = 0; i < frameCount; i++) {
        const t = start + i / fps;
        await new Promise<void>(resolve => {
          const onSeeked = () => {
            video.removeEventListener('seeked', onSeeked);
            resolve();
          };
          video.addEventListener('seeked', onSeeked);
          video.currentTime = Math.min(t, video.duration - 0.01);
        });
        ctx.drawImage(video, 0, 0, w, h);
        gif.addFrame(canvas, { copy: true, delay: 1000 / fps });
        setProgress(Math.round(((i + 1) / frameCount) * 60));
      }
      gif.on('progress', (p: unknown) => setProgress(60 + Math.round((p as number) * 40)));
      gif.on('finished', (blob: Blob) => {
        setGifUrl(URL.createObjectURL(blob));
        setBusy(false);
      });
      gif.render();
    } catch {
      alert('Could not create a GIF from this video.');
      setBusy(false);
    }
  };

  return (
    <ToolShell
      title="Video to GIF converter"
      description="Trim a clip from a video and turn it into an animated GIF, sampled and encoded entirely in your browser."
      faq={[
        {
          q: 'How long can the clip be?',
          a: 'Short clips (a few seconds) work best — longer clips or higher frame rates take more time and memory to encode.',
        },
      ]}
    >
      <Dropzone accept="video/*" onFile={onFile} />
      {url && (
        <video
          ref={videoRef}
          src={url}
          controls
          style={{ width: '100%', borderRadius: 14, marginTop: 16 }}
          onLoadedMetadata={e => setEnd(Math.min(3, e.currentTarget.duration))}
        />
      )}
      {file && (
        <>
          <div className="controls">
            <div className="field">
              <label>Start (s)</label>
              <input
                aria-label="Start (s)"
                type="number"
                min="0"
                step="0.1"
                value={start}
                onChange={e => setStart(Number(e.target.value))}
              />
            </div>
            <div className="field">
              <label>End (s)</label>
              <input
                aria-label="End (s)"
                type="number"
                min="0"
                step="0.1"
                value={end}
                onChange={e => setEnd(Number(e.target.value))}
              />
            </div>
            <div className="field">
              <label>FPS</label>
              <input
                aria-label="FPS"
                type="number"
                min="2"
                max="20"
                value={fps}
                onChange={e => setFps(Number(e.target.value))}
              />
            </div>
          </div>
          <div className="field" style={{ marginTop: 14 }}>
            <label>Width (px)</label>
            <input
              aria-label="Width (px)"
              type="number"
              min="80"
              max="640"
              value={scale}
              onChange={e => setScale(Number(e.target.value))}
            />
          </div>
          <div style={{ marginTop: 16 }}>
            <button className="btn btnPrimary" disabled={busy} onClick={generate}>
              {busy ? `Encoding… ${progress}%` : 'Convert to GIF'}
            </button>
          </div>
        </>
      )}
      {gifUrl && (
        <div className="result">
          <img src={gifUrl} alt="gif" style={{ maxWidth: 200, borderRadius: 10 }} />
          <a className="btn btnDark" href={gifUrl} download="clip.gif">
            Download GIF
          </a>
        </div>
      )}
    </ToolShell>
  );
}

/** Decodes any audio the browser understands without opening a sound device (no limit on how many times it runs). */
async function decodeAudio(f: File): Promise<AudioBuffer> {
  const ctx = new OfflineAudioContext(1, 1, 44100);
  return ctx.decodeAudioData(await f.arrayBuffer());
}

/** MP3 encoder (LAME) — loaded only when someone exports an MP3. */
async function encodeMp3(buffer: AudioBuffer, kbps = 192): Promise<Blob> {
  const { Mp3Encoder } = await import('@breezystack/lamejs');
  const channels = Math.min(2, buffer.numberOfChannels);
  const enc = new Mp3Encoder(channels, buffer.sampleRate, kbps);
  const toInt16 = (f: Float32Array) => {
    const out = new Int16Array(f.length);
    for (let i = 0; i < f.length; i++) {
      const v = Math.max(-1, Math.min(1, f[i]));
      out[i] = v < 0 ? v * 0x8000 : v * 0x7fff;
    }
    return out;
  };
  const left = toInt16(buffer.getChannelData(0));
  const right = channels > 1 ? toInt16(buffer.getChannelData(1)) : undefined;
  const parts: BlobPart[] = [];
  const block = 1152;
  for (let i = 0; i < left.length; i += block) {
    const l = left.subarray(i, i + block);
    const chunk = right ? enc.encodeBuffer(l, right.subarray(i, i + block)) : enc.encodeBuffer(l);
    if (chunk.length) parts.push(new Uint8Array(chunk));
  }
  const end = enc.flush();
  if (end.length) parts.push(new Uint8Array(end));
  return new Blob(parts, { type: 'audio/mpeg' });
}

type AudioFmt = 'mp3' | 'wav';
const fmtTime = (s: number) => `${Math.floor(s / 60)}:${(s % 60).toFixed(1).padStart(4, '0')}`;
const baseName = (f: File | null) => (f ? f.name.replace(/\.[^.]+$/, '') : 'audio');

function AudioFormatChoice({ fmt, set }: { fmt: AudioFmt; set: (f: AudioFmt) => void }) {
  return (
    <div className="field">
      <label htmlFor="audio-fmt">Save as</label>
      <select id="audio-fmt" value={fmt} onChange={e => set(e.target.value as AudioFmt)}>
        <option value="mp3">MP3 (small, plays everywhere)</option>
        <option value="wav">WAV (lossless, large)</option>
      </select>
    </div>
  );
}

export function AudioTrimmer() {
  const [file, setFile] = useState<File | null>(null);
  const [duration, setDuration] = useState(0);
  const [start, setStart] = useState(0);
  const [end, setEnd] = useState(0);
  const [fmt, setFmt] = useState<AudioFmt>('mp3');
  const [out, setOut] = useState('');
  const [outBlob, setOutBlob] = useState<Blob | null>(null);
  useRevokeObjectUrl(out);
  const [src, setSrc] = useState('');
  useRevokeObjectUrl(src);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const bufferRef = useRef<AudioBuffer | null>(null);

  const onFile = async (f: File) => {
    setFile(f);
    setOut('');
    setOutBlob(null);
    setError('');
    setDuration(0);
    setSrc(URL.createObjectURL(f));
    try {
      const buffer = await decodeAudio(f);
      bufferRef.current = buffer;
      setDuration(buffer.duration);
      setStart(0);
      setEnd(Math.round(buffer.duration * 10) / 10);
    } catch {
      bufferRef.current = null;
      setError('This file could not be read. Try an MP3, WAV, M4A or OGG file.');
    }
  };
  const valid = end - start >= 0.1;
  const trim = async () => {
    const buffer = bufferRef.current;
    if (!buffer || !valid) return;
    setBusy(true);
    setError('');
    try {
      const startSample = Math.floor(start * buffer.sampleRate);
      const endSample = Math.min(buffer.length, Math.floor(end * buffer.sampleRate));
      const length = Math.max(1, endSample - startSample);
      const ctx = new OfflineAudioContext(buffer.numberOfChannels, length, buffer.sampleRate);
      const piece = ctx.createBuffer(buffer.numberOfChannels, length, buffer.sampleRate);
      for (let ch = 0; ch < buffer.numberOfChannels; ch++)
        piece.getChannelData(ch).set(buffer.getChannelData(ch).subarray(startSample, endSample));
      const blob = fmt === 'mp3' ? await encodeMp3(piece) : encodeWav(piece);
      setOutBlob(blob);
      setOut(URL.createObjectURL(blob));
    } catch {
      setError('Trimming failed. Please try again with a shorter part or another file.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <ToolShell
      title="Audio trimmer / cutter"
      description="Cut a part of a song, voice note or recording: choose start and end, listen, and download as MP3 or WAV — in your browser."
      faq={[
        {
          q: 'What formats can I upload?',
          a: 'MP3, WAV, M4A/AAC, OGG and most other formats your browser can play.',
        },
        {
          q: 'MP3 or WAV?',
          a: 'MP3 is small and plays everywhere (192 kbps). WAV keeps every detail but is about 10× larger.',
        },
        { q: 'Is my audio uploaded?', a: 'No. Cutting and encoding happen on your device.' },
      ]}
    >
      <Dropzone accept="audio/*" onFile={onFile} />
      {src && (
        <audio className="audioPreview" src={src} controls preload="metadata" aria-label="Original audio">
          Your browser cannot play this file.
        </audio>
      )}
      {file && duration > 0 && (
        <>
          <div className="trimBox">
            <div className="field">
              <label htmlFor="trim-s">
                Start: <b>{fmtTime(start)}</b>
              </label>
              <input
                id="trim-s"
                type="range"
                min="0"
                max={duration}
                step="0.1"
                value={start}
                onChange={e => setStart(Math.min(Number(e.target.value), end - 0.1))}
              />
            </div>
            <div className="field">
              <label htmlFor="trim-e">
                End: <b>{fmtTime(end)}</b>
              </label>
              <input
                id="trim-e"
                type="range"
                min="0"
                max={duration}
                step="0.1"
                value={end}
                onChange={e => setEnd(Math.max(Number(e.target.value), start + 0.1))}
              />
            </div>
            <div className="trimBar" aria-hidden="true">
              <span
                style={{
                  left: `${(start / duration) * 100}%`,
                  width: `${((end - start) / duration) * 100}%`,
                }}
              />
            </div>
            <p className="stats">
              <span>Clip length: {fmtTime(Math.max(0, end - start))}</span>
              <span>Total: {fmtTime(duration)}</span>
            </p>
          </div>
          <AudioFormatChoice
            fmt={fmt}
            set={f => {
              setFmt(f);
              setOut('');
            }}
          />
          <button className="btn btnPrimary" disabled={busy || !valid} onClick={trim}>
            {busy ? 'Cutting…' : `Cut & export ${fmt.toUpperCase()}`}
          </button>
        </>
      )}
      {error && (
        <p className="notice error" role="alert">
          {error}
        </p>
      )}
      {out && outBlob && (
        <div className="result">
          <audio src={out} controls aria-label="Trimmed audio" />
          <a className="btn btnDark" href={out} download={`${baseName(file)}-trimmed.${fmt}`}>
            Download {fmt.toUpperCase()}
          </a>
        </div>
      )}
    </ToolShell>
  );
}

export function AudioSpeedChanger() {
  const [file, setFile] = useState<File | null>(null);
  const [speed, setSpeed] = useState(1.25);
  const [fmt, setFmt] = useState<AudioFmt>('mp3');
  const [out, setOut] = useState('');
  useRevokeObjectUrl(out);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const bufferRef = useRef<AudioBuffer | null>(null);

  const onFile = async (f: File) => {
    setFile(f);
    setOut('');
    setError('');
    try {
      bufferRef.current = await decodeAudio(f);
    } catch {
      bufferRef.current = null;
      setError('This file could not be read. Try an MP3, WAV, M4A or OGG file.');
    }
  };

  const apply = async () => {
    const buffer = bufferRef.current;
    if (!buffer) return;
    setBusy(true);
    setError('');
    try {
      const newLength = Math.max(1, Math.floor(buffer.length / speed));
      const offline = new OfflineAudioContext(buffer.numberOfChannels, newLength, buffer.sampleRate);
      const node = offline.createBufferSource();
      node.buffer = buffer;
      node.playbackRate.value = speed;
      node.connect(offline.destination);
      node.start();
      const rendered = await offline.startRendering();
      const blob = fmt === 'mp3' ? await encodeMp3(rendered) : encodeWav(rendered);
      setOut(URL.createObjectURL(blob));
    } catch {
      setError('Could not process this audio file. Please try another file.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <ToolShell
      title="Audio speed changer"
      description="Speed up or slow down any audio (0.5× to 2×) and download it as MP3 or WAV. Pitch moves with speed, like a turntable."
      faq={[
        {
          q: 'Does the pitch change?',
          a: 'Yes — faster sounds higher and slower sounds deeper, like changing a record’s speed. To keep the voice natural, stay between 0.8× and 1.25×.',
        },
        { q: 'Is my audio uploaded?', a: 'No. Everything is processed on your device.' },
      ]}
    >
      <Dropzone accept="audio/*" onFile={onFile} />
      {file && !error && (
        <>
          <div className="field" style={{ marginTop: 14 }}>
            <label htmlFor="spd">
              Speed: <b>{speed.toFixed(2)}×</b>
            </label>
            <input
              id="spd"
              type="range"
              min="0.5"
              max="2"
              step="0.05"
              value={speed}
              onChange={e => {
                setSpeed(Number(e.target.value));
                setOut('');
              }}
            />
          </div>
          <div className="tbChips" role="group" aria-label="Quick speeds">
            {[0.75, 1.25, 1.5, 2].map(v => (
              <button
                key={v}
                type="button"
                className={speed === v ? 'on' : ''}
                aria-pressed={speed === v}
                onClick={() => {
                  setSpeed(v);
                  setOut('');
                }}
              >
                {v}×
              </button>
            ))}
          </div>
          <AudioFormatChoice
            fmt={fmt}
            set={f => {
              setFmt(f);
              setOut('');
            }}
          />
          <button className="btn btnPrimary" disabled={busy} onClick={apply}>
            {busy ? 'Processing…' : `Change speed & export ${fmt.toUpperCase()}`}
          </button>
        </>
      )}
      {error && (
        <p className="notice error" role="alert">
          {error}
        </p>
      )}
      {out && (
        <div className="result">
          <audio src={out} controls aria-label="Result" />
          <a className="btn btnDark" href={out} download={`${baseName(file)}-${speed}x.${fmt}`}>
            Download {fmt.toUpperCase()}
          </a>
        </div>
      )}
    </ToolShell>
  );
}

export function GifOptimizer() {
  const [file, setFile] = useState<File | null>(null);
  const [scale, setScale] = useState(1);
  const [quality, setQuality] = useState(10);
  const [keepEvery, setKeepEvery] = useState(1);
  const [busy, setBusy] = useState(false);
  const [before, setBefore] = useState(0);
  const [after, setAfter] = useState(0);
  const [out, setOut] = useState('');
  useRevokeObjectUrl(out);

  const optimize = async () => {
    if (!file) return;
    setBusy(true);
    setOut('');
    try {
      const { parseGIF, decompressFrames } = await import('gifuct-js');
      const GIF = (await import('gif.js.optimized')).default;
      const buf = await file.arrayBuffer();
      const parsed = parseGIF(buf);
      const frames = decompressFrames(parsed, true);
      const fullW = parsed.lsd.width,
        fullH = parsed.lsd.height;
      const compose = document.createElement('canvas');
      compose.width = fullW;
      compose.height = fullH;
      const composeCtx = compose.getContext('2d')!;
      const outW = Math.max(1, Math.round(fullW * scale)),
        outH = Math.max(1, Math.round(fullH * scale));
      const gif = new GIF({ workers: 2, quality, width: outW, height: outH, workerScript: '/gif.worker.js' });
      const outCanvas = document.createElement('canvas');
      outCanvas.width = outW;
      outCanvas.height = outH;
      const outCtx = outCanvas.getContext('2d')!;
      let prevDisposal = 0,
        prevRect = { left: 0, top: 0, width: fullW, height: fullH };
      frames.forEach((frame, i) => {
        if (prevDisposal === 2)
          composeCtx.clearRect(prevRect.left, prevRect.top, prevRect.width, prevRect.height);
        const imgData = new ImageData(
          new Uint8ClampedArray(frame.patch),
          frame.dims.width,
          frame.dims.height,
        );
        const patchCanvas = document.createElement('canvas');
        patchCanvas.width = frame.dims.width;
        patchCanvas.height = frame.dims.height;
        patchCanvas.getContext('2d')!.putImageData(imgData, 0, 0);
        composeCtx.drawImage(patchCanvas, frame.dims.left, frame.dims.top);
        prevDisposal = frame.disposalType;
        prevRect = frame.dims;
        if (i % keepEvery === 0) {
          outCtx.clearRect(0, 0, outW, outH);
          outCtx.drawImage(compose, 0, 0, outW, outH);
          gif.addFrame(outCanvas, { copy: true, delay: frame.delay * keepEvery });
        }
      });
      await new Promise<void>(resolve => {
        gif.on('finished', (blob: Blob) => {
          setBefore(file.size);
          setAfter(blob.size);
          setOut(URL.createObjectURL(blob));
          resolve();
        });
        gif.render();
      });
    } catch {
      alert('Could not optimize this GIF.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <ToolShell
      title="GIF optimizer"
      description="Shrink an animated GIF by reducing its resolution, quality or frame count, decoded and re-encoded entirely in your browser."
      faq={[
        {
          q: 'How does this reduce file size?',
          a: 'You can scale down the resolution, drop frames (lower frame rate) and reduce color quality — the three biggest levers for GIF file size.',
        },
      ]}
    >
      <Dropzone accept="image/gif" onFile={setFile} />
      {file && (
        <>
          <div className="controls">
            <div className="field">
              <label>Scale: {Math.round(scale * 100)}%</label>
              <input
                aria-label="Scale"
                type="range"
                min="0.2"
                max="1"
                step="0.1"
                value={scale}
                onChange={e => setScale(Number(e.target.value))}
              />
            </div>
            <div className="field">
              <label>Quality (lower = smaller): {quality}</label>
              <input
                aria-label="Quality (lower = smaller)"
                type="range"
                min="1"
                max="30"
                value={quality}
                onChange={e => setQuality(Number(e.target.value))}
              />
            </div>
            <div className="field">
              <label>Keep every Nth frame</label>
              <input
                aria-label="Keep every Nth frame"
                type="number"
                min="1"
                max="5"
                value={keepEvery}
                onChange={e => setKeepEvery(Number(e.target.value))}
              />
            </div>
          </div>
          <div style={{ marginTop: 16 }}>
            <button className="btn btnPrimary" disabled={busy} onClick={optimize}>
              {busy ? 'Optimizing…' : 'Optimize GIF'}
            </button>
          </div>
        </>
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
          <a className="btn btnDark" href={out} download="optimized.gif">
            Download
          </a>
        </div>
      )}
    </ToolShell>
  );
}
