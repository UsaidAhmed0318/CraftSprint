'use client';
import { useState } from 'react';
import QRCode from 'qrcode';
import ToolShell from '@/components/shared/ToolShell';

export function QrCodeGenerator() {
  const [text, setText] = useState('');
  const [level, setLevel] = useState<'L' | 'M' | 'Q' | 'H'>('M');
  const [dataUrl, setDataUrl] = useState('');
  const [error, setError] = useState('');
  const generate = async () => {
    if (!text.trim()) {
      setError('Type a link or some text first.');
      setDataUrl('');
      return;
    }
    try {
      const url = await QRCode.toDataURL(text, {
        width: 480,
        margin: 2,
        errorCorrectionLevel: level,
        color: { dark: '#10131a', light: '#ffffff' },
      });
      setDataUrl(url);
      setError('');
    } catch {
      setError('Could not generate a QR code for this input.');
      setDataUrl('');
    }
  };
  return (
    <ToolShell
      title="Generate a QR code online"
      description="Turn any link, Wi-Fi text or message into a downloadable QR code, created instantly in your browser."
      faq={[
        {
          q: 'Is the content sent to a server?',
          a: 'No. The QR code is generated locally in your browser and never leaves your device.',
        },
        {
          q: 'What is error correction level?',
          a: 'Higher levels (Q, H) let the QR code stay scannable even if it is partly damaged or covered, at the cost of a denser pattern.',
        },
      ]}
    >
      <div className="field">
        <label>Text or URL</label>
        <textarea
          aria-label="Text or URL"
          className="textArea"
          style={{ minHeight: 120 }}
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="https://example.com"
        />
      </div>
      <div className="controls">
        <div className="field">
          <label>Error correction</label>
          <select
            aria-label="Error correction"
            value={level}
            onChange={e => setLevel(e.target.value as typeof level)}
          >
            <option value="L">Low (L)</option>
            <option value="M">Medium (M)</option>
            <option value="Q">Quartile (Q)</option>
            <option value="H">High (H)</option>
          </select>
        </div>
      </div>
      <div style={{ marginTop: 18 }}>
        <button className="btn btnPrimary" onClick={generate}>
          Generate QR code
        </button>
      </div>
      {error && <div className="notice error">{error}</div>}
      {dataUrl && (
        <div className="qrPreview">
          <img src={dataUrl} alt="Generated QR code" width={240} height={240} />
        </div>
      )}
      {dataUrl && (
        <div style={{ marginTop: 14, textAlign: 'center' }}>
          <a className="btn btnDark" href={dataUrl} download="qr-code.png">
            Download PNG
          </a>
        </div>
      )}
    </ToolShell>
  );
}
