import type { Metadata } from 'next';
import { site } from '@/lib/site';

/**
 * Adds a self-referencing canonical plus page-specific Open Graph / Twitter tags.
 * Tool pages replace the default share image with their own (app/tools/[slug]/opengraph-image.tsx).
 */
export function withSeo(path: string, meta: Metadata): Metadata {
  const title = typeof meta.title === 'string' ? meta.title : site.name;
  const description = meta.description ?? site.description;
  const fullTitle = title.includes(site.name) ? title : `${title} | ${site.name}`;
  return {
    ...meta,
    alternates: { canonical: path },
    // Tool pages have their own generated share image, so only other pages use the default one.
    openGraph: {
      type: 'website',
      siteName: site.name,
      url: path,
      title: fullTitle,
      description,
      ...(path.startsWith('/tools/') ? {} : { images: ['/images/og.png'] }),
    },
    twitter: { card: 'summary_large_image', title: fullTitle, description },
  };
}

/** Keeps a title within ~60 characters including " | CraftSprint" (Google shows about 60). */
export function fitTitle(title: string, max = 46) {
  if (title.length <= max) return title;
  const noBrackets = title.replace(/\s*\([^)]*\)/g, '').trim();
  if (noBrackets.length <= max) return noBrackets;
  const beforeColon = noBrackets.split(/[:?]/)[0].trim();
  if (beforeColon.length >= 20 && beforeColon.length <= max) return beforeColon;
  return noBrackets.slice(0, max - 1).replace(/\s+\S*$/, '') + '…';
}
