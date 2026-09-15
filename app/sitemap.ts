import type {MetadataRoute} from 'next';import {site} from '@/lib/site';import {tools} from '@/data/tools';
export default function sitemap():MetadataRoute.Sitemap{
 const staticPaths=['','/about','/contact','/privacy','/terms','/blog','/blog/compress-images','/blog/jpg-png-webp','/blog/resize-images','/signup','/login'];
 const toolPaths=tools.map(t=>`/tools/${t.slug}`);
 const paths=[...staticPaths,...toolPaths];
 return paths.map(path=>({url:`${site.url}${path}`,lastModified:new Date(),changeFrequency:path.startsWith('/tools')?'monthly':'weekly',priority:path===''?1:path.startsWith('/tools')?.9:.6}));
}
