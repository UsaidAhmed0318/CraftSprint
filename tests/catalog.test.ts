import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { tools, categories } from '@/data/tools';
import { toolSeo } from '@/data/seo';
import { categoryInfo } from '@/lib/categories';

const registry = readFileSync('lib/toolRegistry.tsx', 'utf8');
const registered = new Set([...registry.matchAll(/^\s*'?([a-z0-9-]+)'?:\s*dynamic/gm)].map(m => m[1]));

describe('tool catalogue', () => {
  it('has unique slugs', () => {
    const slugs = tools.map(t => t.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });
  it('every tool has a component in the registry', () => {
    const missing = tools.filter(t => !registered.has(t.slug)).map(t => t.slug);
    expect(missing).toEqual([]);
  });
  it('registry has no orphan entries', () => {
    const slugs = new Set(tools.map(t => t.slug));
    expect([...registered].filter(s => !slugs.has(s))).toEqual([]);
  });
  it('every tool has an SEO title and description of a sensible length', () => {
    for (const t of tools) {
      const seo = toolSeo[t.slug];
      expect(seo, t.slug).toBeTruthy();
      expect(seo.title.length, `${t.slug} title`).toBeLessThanOrEqual(70);
      expect(seo.description.length, `${t.slug} description`).toBeGreaterThanOrEqual(50);
      expect(seo.description.length, `${t.slug} description`).toBeLessThanOrEqual(170);
    }
  });
  it('slugs are URL-safe', () => {
    for (const t of tools) expect(t.slug).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
  });
  it('every category has page info', () => {
    for (const c of categories) expect(categoryInfo[c], c).toBeTruthy();
  });
});
