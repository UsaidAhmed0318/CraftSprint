import { describe, expect, it } from 'vitest';
import { validateContact } from '@/lib/validateContact';
import { formatBytes } from '@/lib/utils/image';
import { matchTools } from '@/lib/toolMatch';
import { evaluate } from '@/components/tools/calculators/MathCalculators';

describe('contact form validation', () => {
  const ok = { name: 'Ali', email: 'ali@example.com', message: 'Hello', startedAt: 0 };
  it('accepts a normal message', () => expect(validateContact(ok, 10_000)).toBeNull());
  it('flags the honeypot as spam', () =>
    expect(validateContact({ ...ok, website: 'x' }, 10_000)).toBe('spam'));
  it('flags instant submits as spam', () =>
    expect(validateContact({ ...ok, startedAt: 9_000 }, 10_000)).toBe('spam'));
  it('rejects a bad email', () =>
    expect(validateContact({ ...ok, email: 'nope' }, 10_000)).toBe('Invalid email'));
  it('rejects link spam', () =>
    expect(validateContact({ ...ok, message: 'http://a http://b http://c http://d' }, 10_000)).toMatch(
      /links/,
    ));
  it('rejects non-objects', () => expect(validateContact(null)).toBe('Invalid request'));
});

describe('formatBytes', () => {
  it('formats sizes', () => {
    expect(formatBytes(0)).toBe('0 B');
    expect(formatBytes(1024)).toBe('1.0 KB');
    expect(formatBytes(5 * 1024 * 1024)).toBe('5.0 MB');
  });
});

describe('tool search', () => {
  it('finds the image compressor', () =>
    expect(matchTools('compress photo').map(t => t.slug)).toContain('image-compressor'));
  it('finds PDF merge', () => expect(matchTools('merge pdf').map(t => t.slug)).toContain('pdf-merge'));
});

describe('scientific calculator engine', () => {
  it('respects operator precedence', () => expect(evaluate('2+3*4', true)).toBe(14));
  it('handles brackets and powers', () => expect(evaluate('(2+3)^2', true)).toBe(25));
  it('uses degrees when asked', () => expect(evaluate('sin(90)', true)).toBeCloseTo(1));
  it('throws on bad input', () => expect(() => evaluate('2+*', true)).toThrow());
});

import { salaryTax } from '@/components/tools/batch2/Converters2';
describe('Pakistan salary tax', () => {
  it('matches the published FY 2026-27 and FY 2025-26 examples', () => {
    expect(salaryTax(600000, '2026-27')).toBe(0);
    expect(salaryTax(1800000, '2026-27')).toBeCloseTo(72000);
    expect(salaryTax(3600000, '2026-27')).toBeCloseTo(416000);
    expect(salaryTax(3600000, '2025-26')).toBeCloseTo(466000);
    expect(salaryTax(15000000, '2026-27')).toBeCloseTo(4224000);
  });
});

describe('staging / preview builds stay out of Google', () => {
  it('robots.txt blocks everything on preview and allows the site on production', async () => {
    const { vi } = await import('vitest');
    vi.resetModules();
    process.env.NEXT_PUBLIC_DEPLOY_ENV = 'preview';
    const preview = (await import('@/app/robots')).default();
    expect(preview.rules).toEqual({ userAgent: '*', disallow: '/' });
    expect(preview.sitemap).toBeUndefined();
    vi.resetModules();
    process.env.NEXT_PUBLIC_DEPLOY_ENV = 'production';
    const prod = (await import('@/app/robots')).default();
    expect(prod.sitemap).toContain('/sitemap.xml');
    delete process.env.NEXT_PUBLIC_DEPLOY_ENV;
  });
});

import { timeStretch } from '@/components/tools/media/MediaTools';
describe('audio speed change keeps pitch', () => {
  const rate = 44100;
  const tone = new Float32Array(rate * 2).map((_, i) => Math.sin((2 * Math.PI * 440 * i) / rate));
  const freq = (x: Float32Array) => {
    let z = 0;
    for (let i = 1; i < x.length; i++) if (x[i - 1] < 0 && x[i] >= 0) z++;
    return z / (x.length / rate);
  };
  it.each([0.75, 1.5, 2])('speed %s× changes length but keeps 440 Hz', s => {
    const [out] = timeStretch([tone], s);
    expect(out.length).toBe(Math.floor(tone.length / s));
    const mid = out.subarray(4096, out.length - 4096);
    expect(Math.abs(freq(mid) - 440)).toBeLessThan(12);
  });
});

import { detectFlatBackground, keyAlpha, despeckle } from '@/components/tools/images/BackgroundRemoverAI';
describe('background remover: logos on a flat colour', () => {
  const W = 64;
  const H = 64;
  const logo = () => {
    const d = new Uint8ClampedArray(W * H * 4);
    for (let y = 0; y < H; y++)
      for (let x = 0; x < W; x++) {
        const i = (y * W + x) * 4;
        const inShape = x > 16 && x < 48 && y > 16 && y < 48;
        const c = inShape ? (x < 32 ? [255, 255, 255] : [37, 99, 235]) : [11, 18, 32];
        d.set([...c, 255], i);
      }
    return d;
  };
  it('detects the flat background colour of a logo and removes exactly that colour', () => {
    const d = logo();
    const flat = detectFlatBackground(d, W, H)!;
    expect(flat.bg).toEqual([11, 18, 32]);
    const a = keyAlpha(d, flat.bg, flat.tol);
    expect(a[0]).toBe(0); // background corner
    expect(a[20 * W + 20]).toBe(255); // white part
    expect(a[20 * W + 40]).toBe(255); // blue part
    expect([...a].filter(v => v > 0 && v < 255)).toHaveLength(0); // no speckle
  });
  it('does not treat a photo as a flat graphic', () => {
    const d = new Uint8ClampedArray(W * H * 4);
    for (let i = 0; i < W * H; i++) d.set([(i * 7) % 256, (i * 13) % 256, (i * 29) % 256, 255], i * 4);
    expect(detectFlatBackground(d, W, H)).toBeNull();
  });
  it('removes single-pixel speckles from an AI mask', () => {
    const a = new Uint8ClampedArray(25).fill(255);
    a[12] = 0;
    expect(despeckle(a, 5, 5)[12]).toBe(255);
  });
});
