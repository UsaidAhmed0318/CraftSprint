import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import JsonLd from '@/components/shared/JsonLd';
import ToolCard from '@/components/shared/ToolCard';
import { posts } from '@/data/posts';
import { tools } from '@/data/tools';
import { withSeo, fitTitle } from '@/lib/seo';
import { site } from '@/lib/site';

/** One page renders every blog post written in data/posts.ts. */
const written = posts.filter(p => p.sections);
export const dynamicParams = false;
export function generateStaticParams() {
  return written.map(p => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = written.find(p => p.slug === slug);
  if (!post) return {};
  return withSeo(`/blog/${slug}`, { title: fitTitle(post.title), description: post.description });
}

export default async function BlogPost({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = written.find(p => p.slug === slug);
  if (!post) notFound();
  const recommended = post.tools
    .map(s => tools.find(t => t.slug === s))
    .filter((t): t is (typeof tools)[number] => !!t);
  return (
    <main className="section">
      <article className="container article">
        <JsonLd
          data={{
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: post.title,
            description: post.description,
            datePublished: post.date,
            dateModified: post.date,
            author: { '@type': 'Organization', name: site.name },
            publisher: { '@type': 'Organization', name: site.name, url: site.url },
            mainEntityOfPage: `${site.url}/blog/${slug}`,
          }}
        />
        <nav className="breadcrumbs" aria-label="Breadcrumb">
          <Link href="/">Home</Link>
          <span>/</span>
          <Link href="/blog">Guides</Link>
          <span>/</span>
          <span aria-current="page">{post.topic}</span>
        </nav>
        <h1>{post.title}</h1>
        <p className="lead">{post.description}</p>
        {post.sections!.map(s => (
          <section key={s.heading}>
            <h2>{s.heading}</h2>
            {s.paragraphs.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </section>
        ))}
        <h2>Tools from this guide</h2>
      </article>
      <div className="container" style={{ maxWidth: 980 }}>
        <div className="toolGrid">
          {recommended.map(t => (
            <ToolCard key={t.slug} tool={t} />
          ))}
        </div>
      </div>
    </main>
  );
}
