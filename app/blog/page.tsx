import BlogCover from '@/components/shared/BlogCover';
import Link from 'next/link';
import { posts } from '@/data/posts';
import { tools } from '@/data/tools';
import { withSeo } from '@/lib/seo';

export const metadata = withSeo('/blog', {
  title: 'Free Guides: Images, PDFs, Passwords, JSON, Money & More',
  description:
    'Short, practical guides that answer everyday questions — and link straight to the free tool that does the job.',
});

export default function Blog() {
  return (
    <main className="section">
      <div className="container">
        <div className="sectionHead">
          <h1>Guides</h1>
          <p>
            Short, practical answers to everyday questions — each one links to the free tool that does the
            job.
          </p>
        </div>
        <div className="blogGrid">
          {posts.map(p => (
            <Link href={`/blog/${p.slug}`} className="postCard" key={p.slug}>
              <BlogCover title={p.title} topic={p.topic} />
              <span className="kicker">{p.topic}</span>
              <h3>{p.title}</h3>
              <p>{p.description}</p>
              <span className="toolLink">Read the guide</span>
            </Link>
          ))}
        </div>
        <p style={{ marginTop: 40, color: 'var(--muted)' }}>
          Looking for a tool instead?{' '}
          <Link href="/" style={{ color: 'var(--brand)', fontWeight: 700 }}>
            Browse all {tools.length} free tools
          </Link>
          .
        </p>
      </div>
    </main>
  );
}
