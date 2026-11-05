import { tools, categories } from '@/data/tools';
import { categoryInfo } from '@/lib/categories';
import { toolSeo } from '@/data/seo';
import { site } from '@/lib/site';

/**
 * /llms.txt — a plain-text map of CraftSprint for AI assistants and answer engines (GEO/AEO).
 * Format follows the llms.txt proposal: title, short summary, then sections of links.
 */
export const dynamic = 'force-static';

export function GET() {
  const lines = [
    '# CraftSprint',
    '',
    `> ${tools.length} free online tools and games that run in the browser. No signup; files are processed on the visitor's device and not uploaded.`,
    '',
    `Website: ${site.url}`,
    `All tools: ${site.url}/tools`,
    `Ask CraftSprint AI: ${site.url}/ai`,
    '',
  ];
  for (const c of categories) {
    const info = categoryInfo[c];
    lines.push(`## ${c}`, '', `${info.description} (${site.url}/category/${info.slug})`, '');
    for (const t of tools.filter(x => x.category === c)) {
      lines.push(
        `- [${t.name}](${site.url}/tools/${t.slug}): ${toolSeo[t.slug]?.description ?? t.description}`,
      );
    }
    lines.push('');
  }
  return new Response(lines.join('\n'), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'public, max-age=3600' },
  });
}
