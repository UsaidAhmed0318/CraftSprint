/**
 * Mask tools for the background remover. Pure functions (no browser APIs) so they can be unit-tested.
 * All masks are Uint8 arrays, one value per pixel: 0 = background (transparent), 255 = subject (solid).
 */

/** Labels 4-connected regions where `inside(i)` is true. Returns labels (0 = not inside) and per-region stats. */
function regions(w: number, h: number, inside: (i: number) => boolean) {
  const label = new Int32Array(w * h);
  const stats: { size: number; border: boolean; sum: number }[] = [{ size: 0, border: false, sum: 0 }];
  const stack = new Int32Array(w * h);
  for (let s = 0; s < w * h; s++) {
    if (label[s] || !inside(s)) continue;
    const id = stats.length;
    const st = { size: 0, border: false, sum: 0 };
    stats.push(st);
    let top = 0;
    stack[top++] = s;
    label[s] = id;
    while (top) {
      const i = stack[--top];
      const x = i % w;
      const y = (i / w) | 0;
      st.size++;
      if (x === 0 || y === 0 || x === w - 1 || y === h - 1) st.border = true;
      if (x > 0 && !label[i - 1] && inside(i - 1)) ((label[i - 1] = id), (stack[top++] = i - 1));
      if (x < w - 1 && !label[i + 1] && inside(i + 1)) ((label[i + 1] = id), (stack[top++] = i + 1));
      if (y > 0 && !label[i - w] && inside(i - w)) ((label[i - w] = id), (stack[top++] = i - w));
      if (y < h - 1 && !label[i + w] && inside(i + w)) ((label[i + w] = id), (stack[top++] = i + w));
    }
  }
  return { label, stats };
}

/**
 * Cleans an AI mask:
 *  - uncertain patches that are completely surrounded by the subject (speckled areas inside a logo or object)
 *    become solid when they are mostly subject, or fully transparent when they are mostly background;
 *  - tiny stray dots far from the subject are removed.
 */
export function cleanMask(a: Uint8ClampedArray, w: number, h: number): Uint8ClampedArray {
  const out = new Uint8ClampedArray(a);
  // 1) Enclosed, not-fully-solid patches.
  const soft = regions(w, h, i => a[i] < 235);
  const sum = new Float64Array(soft.stats.length);
  for (let i = 0; i < a.length; i++) if (soft.label[i]) sum[soft.label[i]] += a[i];
  for (let i = 0; i < a.length; i++) {
    const id = soft.label[i];
    if (!id || soft.stats[id].border) continue;
    const mean = sum[id] / soft.stats[id].size;
    out[i] = mean >= 64 ? 255 : 0;
  }
  // 2) Stray dots: subject regions smaller than 0.03% of the picture (and not the only subject).
  const fg = regions(w, h, i => out[i] > 40);
  const biggest = Math.max(0, ...fg.stats.map(s => s.size));
  const tiny = Math.max(12, Math.round(w * h * 0.0003));
  for (let i = 0; i < out.length; i++) {
    const id = fg.label[i];
    if (id && fg.stats[id].size < tiny && fg.stats[id].size < biggest) out[i] = 0;
  }
  return out;
}

const diff = (d: Uint8ClampedArray, i: number, j: number) =>
  Math.max(
    Math.abs(d[i * 4] - d[j * 4]),
    Math.abs(d[i * 4 + 1] - d[j * 4 + 1]),
    Math.abs(d[i * 4 + 2] - d[j * 4 + 2]),
  );

/**
 * Finds a smooth background (flat colour OR a gradient / soft glow) by growing inwards from the picture's edges:
 * a pixel joins the background while the colour changes only gradually. Sharp edges (the logo or object) stop it.
 * Enclosed areas with the same colours as the background (inside letters, between shapes) are removed as well.
 * Returns the mask and whether the picture looks like a graphic (few subject colours) rather than a photo.
 */
export function smoothBackgroundMask(d: Uint8ClampedArray, w: number, h: number, step = 10) {
  const n = w * h;
  // Local contrast (largest colour change within 2 pixels). A soft gradient or glow is low everywhere;
  // the edge of a shape is high even when a JPEG has smeared it over a few pixels. Background never crosses it.
  const R = 2;
  const contrast = new Uint8Array(n);
  {
    const lo = new Uint8Array(n * 3).fill(255);
    const hi = new Uint8Array(n * 3);
    const tlo = new Uint8Array(n * 3).fill(255);
    const thi = new Uint8Array(n * 3);
    for (let y = 0; y < h; y++)
      for (let x = 0; x < w; x++)
        for (let dx = -R; dx <= R; dx++) {
          const xx = Math.min(w - 1, Math.max(0, x + dx));
          for (let c = 0; c < 3; c++) {
            const v = d[(y * w + xx) * 4 + c];
            const k = (y * w + x) * 3 + c;
            if (v < tlo[k]) tlo[k] = v;
            if (v > thi[k]) thi[k] = v;
          }
        }
    for (let y = 0; y < h; y++)
      for (let x = 0; x < w; x++)
        for (let dy = -R; dy <= R; dy++) {
          const yy = Math.min(h - 1, Math.max(0, y + dy));
          for (let c = 0; c < 3; c++) {
            const k = (y * w + x) * 3 + c;
            const s2 = (yy * w + x) * 3 + c;
            if (tlo[s2] < lo[k]) lo[k] = tlo[s2];
            if (thi[s2] > hi[k]) hi[k] = thi[s2];
          }
        }
    for (let i = 0; i < n; i++)
      contrast[i] = Math.max(
        hi[i * 3] - lo[i * 3],
        hi[i * 3 + 1] - lo[i * 3 + 1],
        hi[i * 3 + 2] - lo[i * 3 + 2],
      );
  }
  const bg = new Uint8Array(n);
  const stack = new Int32Array(n);
  let top = 0;
  const seed = (i: number) => {
    if (!bg[i] && d[i * 4 + 3] > 250) {
      bg[i] = 1;
      stack[top++] = i;
    }
  };
  for (let x = 0; x < w; x++) (seed(x), seed((h - 1) * w + x));
  for (let y = 0; y < h; y++) (seed(y * w), seed(y * w + w - 1));
  const seeds = top;
  while (top) {
    const i = stack[--top];
    const x = i % w;
    const y = (i / w) | 0;
    const tryJoin = (j: number) => {
      if (!bg[j] && contrast[j] <= 30 && diff(d, i, j) <= step) {
        bg[j] = 1;
        stack[top++] = j;
      }
    };
    if (x > 0) tryJoin(i - 1);
    if (x < w - 1) tryJoin(i + 1);
    if (y > 0) tryJoin(i - w);
    if (y < h - 1) tryJoin(i + w);
  }
  // Close the thin ring left next to edges: at most two pixels, and only while the colour stays close.
  for (let pass = 0; pass < 2; pass++) {
    const add: number[] = [];
    for (let i = 0; i < n; i++) {
      if (bg[i]) continue;
      const x = i % w;
      const y = (i / w) | 0;
      if (
        (x > 0 && bg[i - 1] && diff(d, i, i - 1) <= 12) ||
        (x < w - 1 && bg[i + 1] && diff(d, i, i + 1) <= 12) ||
        (y > 0 && bg[i - w] && diff(d, i, i - w) <= 12) ||
        (y < h - 1 && bg[i + w] && diff(d, i, i + w) <= 12)
      )
        add.push(i);
    }
    for (const i of add) bg[i] = 1;
  }
  // Colours the background uses (coarse buckets), to also clear enclosed pockets of the same colours.
  const key = (i: number) => ((d[i * 4] >> 3) << 10) | ((d[i * 4 + 1] >> 3) << 5) | (d[i * 4 + 2] >> 3);
  const bgCount = new Map<number, number>();
  let bgTotal = 0;
  for (let i = 0; i < n; i++)
    if (bg[i]) {
      bgCount.set(key(i), (bgCount.get(key(i)) || 0) + 1);
      bgTotal++;
    }
  const common = new Set([...bgCount].filter(([, c]) => c >= Math.max(3, bgTotal * 0.002)).map(([k]) => k));
  const pockets = regions(w, h, i => !bg[i] && common.has(key(i)));
  for (let i = 0; i < n; i++) if (pockets.label[i]) bg[i] = 1;
  // Graphic or photo? A logo's subject uses very few colours.
  const fgCount = new Map<number, number>();
  let fgTotal = 0;
  for (let i = 0; i < n; i++)
    if (!bg[i]) {
      const k = ((d[i * 4] >> 4) << 8) | ((d[i * 4 + 1] >> 4) << 4) | (d[i * 4 + 2] >> 4);
      fgCount.set(k, (fgCount.get(k) || 0) + 1);
      fgTotal++;
    }
  const topFg = [...fgCount.values()]
    .sort((x, y) => y - x)
    .slice(0, 6)
    .reduce((x, y) => x + y, 0);
  const coverage = bgTotal / n;
  // Trim one pixel off the subject's edge so no thin line of background colour (fringe) is left around it.
  const mask = new Uint8ClampedArray(n);
  for (let i = 0; i < n; i++) {
    if (bg[i]) continue;
    const x = i % w;
    const y = (i / w) | 0;
    const edge =
      (x > 0 && bg[i - 1]) || (x < w - 1 && bg[i + 1]) || (y > 0 && bg[i - w]) || (y < h - 1 && bg[i + w]);
    mask[i] = edge ? 0 : 255;
  }
  return {
    mask,
    coverage,
    /** True when the background is smooth all round and the subject is a few flat colours (logo, icon, graphic). */
    isGraphic: seeds > 0 && coverage > 0.25 && coverage < 0.97 && fgTotal > 0 && topFg / fgTotal >= 0.72,
  };
}
