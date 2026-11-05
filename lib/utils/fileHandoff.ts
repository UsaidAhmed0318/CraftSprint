'use client';
/**
 * Hands files from the Universal File Workspace to the tool the visitor picks.
 * Files stay in this browser tab's memory (never uploaded) and are used once.
 */
let pending: File[] = [];
export function handOffFile(f: File) {
  pending = [f];
}
export function handOffFiles(fs: File[]) {
  pending = fs;
}
/** Returns the first waiting file if the tool accepts it, and clears the queue. */
export function takeHandedOffFile(accepts: (f: File) => boolean): File | null {
  const f = pending.find(accepts) || null;
  pending = [];
  return f;
}
/** Returns every waiting file the tool accepts, and clears the queue. */
export function takeHandedOffFiles(accepts: (f: File) => boolean): File[] {
  const fs = pending.filter(accepts);
  pending = [];
  return fs;
}
