'use client';
/**
 * Browser media tools: Screen Recorder, Voice Recorder, Speech to Text, Webcam & Mic Test.
 * Everything stays on the device — recordings are never uploaded.
 */
import { useEffect, useRef, useState } from 'react';
import ToolShell from '@/components/shared/ToolShell';
import { Note, CopyButton } from '@/components/shared/ui';
import { downloadBlob } from '@/lib/utils/download';

const pickType = (cands: string[]) =>
  cands.find(t => typeof MediaRecorder !== 'undefined' && MediaRecorder.isTypeSupported(t)) || '';
const clock = (s: number) =>
  `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

function useRecorder(getStream: () => Promise<MediaStream>, types: string[]) {
  const [state, setState] = useState<'idle' | 'rec' | 'done'>('idle');
  const [url, setUrl] = useState('');
  const [blob, setBlob] = useState<Blob | null>(null);
  const [secs, setSecs] = useState(0);
  const [error, setError] = useState('');
  const rec = useRef<MediaRecorder | null>(null);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);
  useEffect(
    () => () => {
      if (url) URL.revokeObjectURL(url);
    },
    [url],
  );
  const start = async () => {
    setError('');
    try {
      const stream = await getStream();
      const type = pickType(types);
      const r = new MediaRecorder(stream, type ? { mimeType: type } : undefined);
      const chunks: BlobPart[] = [];
      r.ondataavailable = e => e.data.size && chunks.push(e.data);
      r.onstop = () => {
        stream.getTracks().forEach(t => t.stop());
        const b = new Blob(chunks, { type: r.mimeType || type || 'video/webm' });
        setBlob(b);
        setUrl(URL.createObjectURL(b));
        setState('done');
        if (timer.current) clearInterval(timer.current);
      };
      stream.getVideoTracks()[0]?.addEventListener('ended', () => r.state === 'recording' && r.stop());
      r.start(1000);
      rec.current = r;
      setSecs(0);
      setState('rec');
      timer.current = setInterval(() => setSecs(s => s + 1), 1000);
    } catch (e) {
      const name = (e as Error).name;
      setError(
        name === 'NotAllowedError'
          ? 'Permission was not given. Allow access in your browser and try again.'
          : name === 'NotFoundError'
            ? 'No camera or microphone was found.'
            : 'Recording is not supported in this browser. Try the latest Chrome, Edge or Firefox.',
      );
    }
  };
  const stop = () => rec.current?.state === 'recording' && rec.current.stop();
  return { state, url, blob, secs, error, start, stop };
}

export function ScreenRecorder() {
  const [audio, setAudio] = useState(true);
  const r = useRecorder(
    () => navigator.mediaDevices.getDisplayMedia({ video: true, audio }),
    ['video/webm;codecs=vp9,opus', 'video/webm', 'video/mp4'],
  );
  const ext = r.blob?.type.includes('mp4') ? 'mp4' : 'webm';
  return (
    <ToolShell
      title="Screen recorder"
      description="Record your screen, a window or a browser tab — with sound — and download the video. Free, no watermark, nothing uploaded."
      faq={[
        {
          q: 'Does it work on phones?',
          a: 'Screen recording in the browser works on computers (Chrome, Edge, Firefox). Phones usually do not allow websites to record the screen — use the phone’s built-in recorder.',
        },
        {
          q: 'Is there a time limit or watermark?',
          a: 'No watermark and no fixed limit; very long recordings are limited only by your device’s memory.',
        },
      ]}
    >
      <label className="checkInline">
        <input
          type="checkbox"
          checked={audio}
          onChange={e => setAudio(e.target.checked)}
          disabled={r.state === 'rec'}
        />{' '}
        Include sound (tab or system audio when available)
      </label>
      <div className="recBar">
        {r.state !== 'rec' ? (
          <button className="btn btnPrimary" onClick={r.start}>
            {r.state === 'done' ? 'Record again' : 'Start recording'}
          </button>
        ) : (
          <button className="btn btnDanger" onClick={r.stop}>
            Stop · {clock(r.secs)}
          </button>
        )}
        {r.state === 'rec' && <span className="recDot">Recording</span>}
      </div>
      {r.error && <Note error>{r.error}</Note>}
      {r.url && (
        <>
          <video className="recPreview" src={r.url} controls />
          <button
            className="btn btnDark"
            onClick={() => r.blob && downloadBlob(r.blob, `screen-recording.${ext}`)}
          >
            Download video ({ext.toUpperCase()})
          </button>
        </>
      )}
    </ToolShell>
  );
}

export function VoiceRecorder() {
  const r = useRecorder(
    () => navigator.mediaDevices.getUserMedia({ audio: true }),
    ['audio/webm;codecs=opus', 'audio/webm', 'audio/mp4', 'audio/ogg'],
  );
  const ext = r.blob?.type.includes('mp4') ? 'm4a' : r.blob?.type.includes('ogg') ? 'ogg' : 'webm';
  return (
    <ToolShell
      title="Voice recorder"
      description="Record your voice with the microphone, play it back and download the audio file. Works on phones and computers."
      faq={[
        {
          q: 'Where is my recording saved?',
          a: 'Only in this browser tab until you download it. Nothing is uploaded.',
        },
      ]}
    >
      <div className="recBar">
        {r.state !== 'rec' ? (
          <button className="btn btnPrimary" onClick={r.start}>
            {r.state === 'done' ? 'Record again' : 'Start recording'}
          </button>
        ) : (
          <button className="btn btnDanger" onClick={r.stop}>
            Stop · {clock(r.secs)}
          </button>
        )}
        {r.state === 'rec' && <span className="recDot">Recording</span>}
      </div>
      {r.error && <Note error>{r.error}</Note>}
      {r.url && (
        <>
          <audio src={r.url} controls style={{ width: '100%', marginTop: 12 }} />
          <button
            className="btn btnDark"
            onClick={() => r.blob && downloadBlob(r.blob, `voice-recording.${ext}`)}
          >
            Download audio
          </button>
        </>
      )}
    </ToolShell>
  );
}

type SR = {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  start: () => void;
  stop: () => void;
  onresult:
    | ((e: {
        resultIndex: number;
        results: ArrayLike<{ isFinal: boolean; 0: { transcript: string } }>;
      }) => void)
    | null;
  onend: (() => void) | null;
  onerror: ((e: { error: string }) => void) | null;
};
const LANGS = [
  ['en-US', 'English (US)'],
  ['en-GB', 'English (UK)'],
  ['ur-PK', 'Urdu'],
  ['hi-IN', 'Hindi'],
  ['ar-SA', 'Arabic'],
  ['es-ES', 'Spanish'],
  ['fr-FR', 'French'],
  ['de-DE', 'German'],
  ['tr-TR', 'Turkish'],
  ['id-ID', 'Indonesian'],
  ['pt-BR', 'Portuguese (Brazil)'],
  ['bn-BD', 'Bengali'],
];
export function SpeechToText() {
  const [lang, setLang] = useState('en-US');
  const [text, setText] = useState('');
  const [interim, setInterim] = useState('');
  const [on, setOn] = useState(false);
  const [error, setError] = useState('');
  const recog = useRef<SR | null>(null);
  const start = () => {
    const W = window as unknown as {
      SpeechRecognition?: new () => SR;
      webkitSpeechRecognition?: new () => SR;
    };
    const C = W.SpeechRecognition || W.webkitSpeechRecognition;
    if (!C)
      return setError(
        'Speech recognition is not available in this browser. Use Chrome or Edge on a computer or Android.',
      );
    setError('');
    const r = new C();
    r.lang = lang;
    r.continuous = true;
    r.interimResults = true;
    r.onresult = e => {
      let fin = '';
      let mid = '';
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const res = e.results[i];
        if (res.isFinal) fin += res[0].transcript;
        else mid += res[0].transcript;
      }
      if (fin) setText(t => (t ? `${t} ` : '') + fin.trim());
      setInterim(mid);
    };
    r.onerror = e =>
      setError(
        e.error === 'not-allowed'
          ? 'Microphone permission was not given.'
          : `Speech recognition stopped (${e.error}).`,
      );
    r.onend = () => {
      setOn(false);
      setInterim('');
    };
    r.start();
    recog.current = r;
    setOn(true);
  };
  return (
    <ToolShell
      title="Speech to text"
      description="Speak and watch your words appear as text in 12 languages, then copy or download them. Uses your browser’s speech recognition."
      faq={[
        {
          q: 'Which browsers work?',
          a: 'Chrome and Edge (computer and Android) support it best. Safari support depends on the version.',
        },
        {
          q: 'Is my voice uploaded?',
          a: 'The browser’s speech service may send audio to its provider (for example Google in Chrome) to recognise it. CraftSprint does not receive or store it.',
        },
      ]}
    >
      <div className="field">
        <label htmlFor="stt-lang">Language</label>
        <select id="stt-lang" value={lang} onChange={e => setLang(e.target.value)} disabled={on}>
          {LANGS.map(([v, l]) => (
            <option key={v} value={v}>
              {l}
            </option>
          ))}
        </select>
      </div>
      <div className="recBar">
        {!on ? (
          <button className="btn btnPrimary" onClick={start}>
            Start listening
          </button>
        ) : (
          <button className="btn btnDanger" onClick={() => recog.current?.stop()}>
            Stop
          </button>
        )}
        {on && <span className="recDot">Listening</span>}
      </div>
      {error && <Note error>{error}</Note>}
      <div className="field">
        <label htmlFor="stt-out">Your text</label>
        <textarea
          id="stt-out"
          className="textArea"
          value={text + (interim ? ` ${interim}` : '')}
          onChange={e => setText(e.target.value)}
        />
      </div>
      <div className="rowBtns">
        <CopyButton text={text} />
        <button
          className="btn btnGhost"
          disabled={!text}
          onClick={() =>
            downloadBlob(new Blob([text], { type: 'text/plain;charset=utf-8' }), 'speech-to-text.txt')
          }
        >
          Download .txt
        </button>
        <button className="btn btnGhost" disabled={!text} onClick={() => setText('')}>
          Clear
        </button>
      </div>
    </ToolShell>
  );
}

export function WebcamMicTest() {
  const video = useRef<HTMLVideoElement>(null);
  const [level, setLevel] = useState(0);
  const [info, setInfo] = useState('');
  const [error, setError] = useState('');
  const [running, setRunning] = useState(false);
  const stopRef = useRef<() => void>(() => {});
  useEffect(() => () => stopRef.current(), []);
  const start = async () => {
    setError('');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      if (video.current) video.current.srcObject = stream;
      const s = stream.getVideoTracks()[0]?.getSettings();
      const mic = stream.getAudioTracks()[0]?.label;
      setInfo(
        `${s?.width ?? '?'}×${s?.height ?? '?'} at ${Math.round(s?.frameRate ?? 0)} fps${mic ? ` · Microphone: ${mic}` : ''}`,
      );
      const ctx = new AudioContext();
      const an = ctx.createAnalyser();
      an.fftSize = 512;
      ctx.createMediaStreamSource(stream).connect(an);
      const data = new Uint8Array(an.fftSize);
      let raf = 0;
      const tick = () => {
        an.getByteTimeDomainData(data);
        let peak = 0;
        for (const v of data) peak = Math.max(peak, Math.abs(v - 128));
        setLevel(Math.min(100, Math.round((peak / 128) * 160)));
        raf = requestAnimationFrame(tick);
      };
      tick();
      stopRef.current = () => {
        cancelAnimationFrame(raf);
        stream.getTracks().forEach(t => t.stop());
        ctx.close().catch(() => {});
        setRunning(false);
        setLevel(0);
      };
      setRunning(true);
    } catch (e) {
      setError(
        (e as Error).name === 'NotAllowedError'
          ? 'Permission was not given. Allow camera and microphone access and try again.'
          : 'No camera or microphone could be started.',
      );
    }
  };
  return (
    <ToolShell
      title="Webcam & microphone test"
      description="Check that your camera and microphone work before a call or interview — live video, resolution and a sound level meter."
      faq={[
        {
          q: 'Is my video recorded?',
          a: 'No. The preview is shown only on your screen and nothing is recorded or uploaded.',
        },
      ]}
    >
      <div className="recBar">
        {!running ? (
          <button className="btn btnPrimary" onClick={start}>
            Start test
          </button>
        ) : (
          <button className="btn btnGhost" onClick={() => stopRef.current()}>
            Stop
          </button>
        )}
      </div>
      {error && <Note error>{error}</Note>}
      <video
        ref={video}
        className="recPreview"
        autoPlay
        playsInline
        muted
        style={{ display: running ? 'block' : 'none' }}
      />
      {running && (
        <>
          <p className="notice">{info}</p>
          <div
            className="micMeter"
            role="meter"
            aria-label="Microphone level"
            aria-valuenow={level}
            aria-valuemin={0}
            aria-valuemax={100}
          >
            <span style={{ width: `${level}%` }} />
          </div>
          <small>Speak — the bar should move.</small>
        </>
      )}
    </ToolShell>
  );
}
