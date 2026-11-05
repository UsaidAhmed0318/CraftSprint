import type { MetadataRoute } from 'next';
import { site } from '@/lib/site';
import { tools, categories } from '@/data/tools';
import { categoryInfo } from '@/lib/categories';
import { posts } from '@/data/posts';
export default function sitemap(): MetadataRoute.Sitemap {
  // Only blog posts have a real "last changed" date; other pages leave lastModified out rather than invent one.
  const postDate = new Map(posts.map(p => [`/blog/${p.slug}`, p.date]));
  const staticPaths = [
    '',
    '/about',
    '/contact',
    '/services',
    '/tools',
    '/ai',
    '/prompts',
    '/privacy',
    '/terms',
    '/blog',
    ...posts.map(p => `/blog/${p.slug}`),
  ];
  const catPaths = categories.map(c => `/category/${categoryInfo[c].slug}`);
  const toolPaths = tools.map(t => `/tools/${t.slug}`);
  return [...staticPaths, ...catPaths, ...toolPaths].map(path => ({
    url: `${site.url}${path}`,
    ...(postDate.get(path) ? { lastModified: new Date(postDate.get(path)!) } : {}),
    changeFrequency: path.startsWith('/tools') ? 'monthly' : 'weekly',
    priority: path === '' ? 1 : path.startsWith('/category') ? 0.9 : path.startsWith('/tools') ? 0.8 : 0.5,
  }));
}
