// Adds Map/WeakMap getOrInsert(Computed) for browsers that lack them, then starts the PDF.js worker.
for (const proto of [Map.prototype, WeakMap.prototype]) {
  if (!proto.getOrInsert) Object.defineProperty(proto, 'getOrInsert', {configurable: true, writable: true, value(k, v) { if (!this.has(k)) this.set(k, v); return this.get(k); }});
  if (!proto.getOrInsertComputed) Object.defineProperty(proto, 'getOrInsertComputed', {configurable: true, writable: true, value(k, fn) { if (!this.has(k)) this.set(k, fn(k)); return this.get(k); }});
}
await import('./pdf.worker.min.mjs');
