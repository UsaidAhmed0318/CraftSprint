/**
 * Small polyfills for very new JavaScript features that some libraries (PDF.js v6) rely on.
 * Browsers that already support them are left untouched.
 */
type Upsert<K, V> = {
  getOrInsert?: (key: K, value: V) => V;
  getOrInsertComputed?: (key: K, fn: (key: K) => V) => V;
};

function patch(proto: Map<unknown, unknown> | WeakMap<object, unknown>) {
  const p = proto as unknown as Upsert<unknown, unknown> & {
    has(k: unknown): boolean;
    get(k: unknown): unknown;
    set(k: unknown, v: unknown): unknown;
  };
  if (!p.getOrInsert) {
    Object.defineProperty(p, 'getOrInsert', {
      configurable: true,
      writable: true,
      value(this: typeof p, key: unknown, value: unknown) {
        if (!this.has(key)) this.set(key, value);
        return this.get(key);
      },
    });
  }
  if (!p.getOrInsertComputed) {
    Object.defineProperty(p, 'getOrInsertComputed', {
      configurable: true,
      writable: true,
      value(this: typeof p, key: unknown, fn: (k: unknown) => unknown) {
        if (!this.has(key)) this.set(key, fn(key));
        return this.get(key);
      },
    });
  }
}

export function installPolyfills() {
  if (typeof window === 'undefined') return;
  patch(Map.prototype);
  patch(WeakMap.prototype);
}
