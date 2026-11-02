/**
 * Builds small sample files in the browser so visitors can try a tool without their own file.
 * Nothing is downloaded from the internet.
 */
export type SampleKind = 'image' | 'svg' | 'pdf' | 'audio' | 'video';

/** Which sample fits a file input's `accept` value (null = no sample offered). */
export function sampleKind(accept: string): SampleKind | null {
  const a = accept.toLowerCase();
  if (a.includes('pdf')) return 'pdf';
  if (a.includes('svg')) return 'svg';
  if (a.includes('gif')) return null; // animated GIF samples are not generated
  if (a.includes('audio')) return 'audio';
  if (a.includes('video')) return 'video';
  if (a.includes('image')) return 'image';
  return null;
}

export function makeSampleFile(kind: SampleKind): Promise<File> {
  switch (kind) {
    case 'image':
      return sampleImage();
    case 'svg':
      return Promise.resolve(sampleSvg());
    case 'pdf':
      return samplePdf();
    case 'audio':
      return Promise.resolve(sampleAudio());
    case 'video':
      return sampleVideo();
  }
}

/** Draws a colourful landscape-style picture on a canvas. */
function drawScene(ctx: CanvasRenderingContext2D, w: number, h: number, t = 0) {
  const sky = ctx.createLinearGradient(0, 0, 0, h);
  sky.addColorStop(0, '#1d2a6b');
  sky.addColorStop(0.6, '#f0a35e');
  sky.addColorStop(1, '#f7d79a');
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, w, h);
  ctx.fillStyle = '#fff3c4';
  ctx.beginPath();
  ctx.arc(w * 0.72, h * (0.45 - t * 0.15), h * 0.12, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#2b3a67';
  ctx.beginPath();
  ctx.moveTo(0, h);
  ctx.lineTo(w * 0.25, h * 0.5);
  ctx.lineTo(w * 0.5, h * 0.75);
  ctx.lineTo(w * 0.75, h * 0.45);
  ctx.lineTo(w, h * 0.8);
  ctx.lineTo(w, h);
  ctx.fill();
  ctx.fillStyle = 'rgba(255,255,255,.9)';
  ctx.font = `700 ${Math.round(h * 0.07)}px system-ui, sans-serif`;
  ctx.fillText('CraftSprint sample', w * 0.05, h * 0.14);
}

function canvasToFile(
  canvas: HTMLCanvasElement,
  name: string,
  type: string,
  quality?: number,
): Promise<File> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      b => (b ? resolve(new File([b], name, { type })) : reject(new Error('toBlob failed'))),
      type,
      quality,
    );
  });
}

async function sampleImage(): Promise<File> {
  const c = document.createElement('canvas');
  c.width = 1600;
  c.height = 1000;
  const ctx = c.getContext('2d')!;
  drawScene(ctx, c.width, c.height);
  // a little film grain makes it behave like a real photo when compressed
  const img = ctx.getImageData(0, 0, c.width, c.height);
  for (let i = 0; i < img.data.length; i += 4) {
    const n = (Math.random() - 0.5) * 18;
    img.data[i] += n;
    img.data[i + 1] += n;
    img.data[i + 2] += n;
  }
  ctx.putImageData(img, 0, 0);
  return canvasToFile(c, 'sample-photo.jpg', 'image/jpeg', 0.95);
}

function sampleSvg(): File {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400">
  <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#2f4bd8"/><stop offset="1" stop-color="#e2be6a"/></linearGradient></defs>
  <rect width="400" height="400" rx="80" fill="url(#g)"/>
  <circle cx="200" cy="170" r="70" fill="#fff" opacity=".9"/>
  <text x="200" y="320" font-family="system-ui, sans-serif" font-size="40" font-weight="700" text-anchor="middle" fill="#fff">Sample</text>
</svg>`;
  return new File([svg], 'sample-logo.svg', { type: 'image/svg+xml' });
}

async function samplePdf(): Promise<File> {
  const { PDFDocument, StandardFonts, rgb } = await import('@cantoo/pdf-lib');
  const pdf = await PDFDocument.create();
  const font = await pdf.embedFont(StandardFonts.Helvetica);
  const bold = await pdf.embedFont(StandardFonts.HelveticaBold);
  for (let n = 1; n <= 3; n++) {
    const page = pdf.addPage([595, 842]); // A4
    page.drawRectangle({ x: 0, y: 772, width: 595, height: 70, color: rgb(0.11, 0.16, 0.42) });
    page.drawText('CraftSprint sample document', {
      x: 40,
      y: 798,
      size: 22,
      font: bold,
      color: rgb(1, 1, 1),
    });
    page.drawText(`Page ${n} of 3`, { x: 40, y: 720, size: 28, font: bold, color: rgb(0.1, 0.1, 0.2) });
    const lines = [
      'This PDF was created in your browser so you can try the tool safely.',
      'Use it to test merging, splitting, compressing, rotating or extracting text.',
      'Nothing is uploaded: every step happens on your own device.',
    ];
    lines.forEach((line, i) =>
      page.drawText(line, { x: 40, y: 670 - i * 24, size: 13, font, color: rgb(0.2, 0.22, 0.3) }),
    );
  }
  const bytes = await pdf.save();
  return new File([bytes as BlobPart], 'sample-document.pdf', { type: 'application/pdf' });
}

/** A 6-second melody saved as a WAV file. */
function sampleAudio(): File {
  const rate = 22050,
    seconds = 6,
    n = rate * seconds;
  const notes = [261.6, 329.6, 392, 523.3, 392, 329.6];
  const data = new Int16Array(n);
  for (let i = 0; i < n; i++) {
    const t = i / rate;
    const f = notes[Math.floor(t) % notes.length];
    const fade = Math.min(1, (1 - (t % 1)) * 4);
    data[i] = Math.round(Math.sin(2 * Math.PI * f * t) * 0.3 * fade * 32767);
  }
  const buf = new ArrayBuffer(44 + data.length * 2);
  const v = new DataView(buf);
  const str = (o: number, s: string) => [...s].forEach((c, i) => v.setUint8(o + i, c.charCodeAt(0)));
  str(0, 'RIFF');
  v.setUint32(4, 36 + data.length * 2, true);
  str(8, 'WAVE');
  str(12, 'fmt ');
  v.setUint32(16, 16, true);
  v.setUint16(20, 1, true);
  v.setUint16(22, 1, true);
  v.setUint32(24, rate, true);
  v.setUint32(28, rate * 2, true);
  v.setUint16(32, 2, true);
  v.setUint16(34, 16, true);
  str(36, 'data');
  v.setUint32(40, data.length * 2, true);
  new Int16Array(buf, 44).set(data);
  return new File([buf], 'sample-melody.wav', { type: 'audio/wav' });
}

/** Records a 3-second animated clip from a canvas (WebM, or MP4 on Safari). */
function sampleVideo(): Promise<File> {
  return new Promise((resolve, reject) => {
    if (typeof MediaRecorder === 'undefined') return reject(new Error('MediaRecorder not supported'));
    const c = document.createElement('canvas');
    c.width = 640;
    c.height = 360;
    const ctx = c.getContext('2d')!;
    const type = ['video/webm;codecs=vp9', 'video/webm', 'video/mp4'].find(t =>
      MediaRecorder.isTypeSupported(t),
    );
    if (!type) return reject(new Error('No supported video format'));
    const rec = new MediaRecorder(c.captureStream(30), { mimeType: type });
    const chunks: Blob[] = [];
    rec.ondataavailable = e => {
      if (e.data.size) chunks.push(e.data);
    };
    rec.onstop = () => {
      const ext = type.includes('mp4') ? 'mp4' : 'webm';
      resolve(new File(chunks, `sample-clip.${ext}`, { type: type.split(';')[0] }));
    };
    const start = performance.now();
    const frame = () => {
      const t = Math.min(1, (performance.now() - start) / 3000);
      drawScene(ctx, c.width, c.height, t);
      if (t < 1) requestAnimationFrame(frame);
      else rec.stop();
    };
    rec.start();
    frame();
  });
}
