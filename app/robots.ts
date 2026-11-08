import type { MetadataRoute } from 'next';
import { site } from '@/lib/site';
import { IS_PRODUCTION } from '@/lib/deployEnv';

/** Production: crawl everything except the API. Staging/preview: crawl nothing. */
export default function robots(): MetadataRoute.Robots {
  if (!IS_PRODUCTION) return { rules: { userAgent: '*', disallow: '/' } };
  return { rules: { userAgent: '*', allow: '/', disallow: ['/api/'] }, sitemap: `${site.url}/sitemap.xml` };
}
