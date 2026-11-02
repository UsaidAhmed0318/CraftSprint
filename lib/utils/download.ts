/**
 * Saves a file for the visitor and tells the page about it, so the tool can show
 * "Your file is ready" with a "Download again" link (see components/shared/ResultBanner.tsx).
 * The temporary URL is freed by ResultBanner when it is no longer listed or the page closes.
 */
export type ReadyFile = { name: string; size: number; url: string };
export const FILE_READY_EVENT = 'cs-file-ready';

export function downloadBlob(blob: Blob, name: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = name;
  a.rel = 'noopener';
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.dispatchEvent(
    new CustomEvent<ReadyFile>(FILE_READY_EVENT, { detail: { name, size: blob.size, url } }),
  );
}

/** Same name used by older code. */
export const deliverFile = downloadBlob;

/** Same as downloadBlob, for a canvas (PNG by default). */
export function deliverCanvas(canvas: HTMLCanvasElement, name: string, type = 'image/png') {
  canvas.toBlob(b => {
    if (b) downloadBlob(b, name);
  }, type);
}
