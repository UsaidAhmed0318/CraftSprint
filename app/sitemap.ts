import type { MetadataRoute } from 'next';
import { site } from '@/lib/site';
import { tools, categories } from '@/data/tools';
import { categoryInfo } from '@/lib/categories';
import { posts } from '@/data/posts';
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const staticPaths = [
    '',
    '/about',
    '/contact',
    '/services',
    '/privacy',
    '/terms',
    '/blog',
    ...posts.map(p => `/blog/${p.slug}`),
  ];
  const catPaths = categories.map(c => `/category/${categoryInfo[c].slug}`);
  const toolPaths = tools.map(t => `/tools/${t.slug}`);
  return [...staticPaths, ...catPaths, ...toolPaths].map(path => ({
    url: `${site.url}${path}`,
    lastModified: now,
    changeFrequency: path.startsWith('/tools') ? 'monthly' : 'weekly',
    priority: path === '' ? 1 : path.startsWith('/category') ? 0.9 : path.startsWith('/tools') ? 0.8 : 0.5,
  }));
}
