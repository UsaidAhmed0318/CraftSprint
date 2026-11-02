import Link from 'next/link';
import SearchBar from '@/components/layout/SearchBar';
import ToolCard from '@/components/shared/ToolCard';
import { tools } from '@/data/tools';
export const metadata = { title: 'Page not found', robots: { index: false } };
const popular = ['image-compressor', 'pdf-merge', 'qr-code-generator', 'json-formatter'];
export default function NotFound() {
  return (
    <main className="container notFound">
      <h1>This page doesn&apos;t exist</h1>
      <p>The link may be old or mistyped. Search for the tool you need, or start from a popular one.</p>
      <div className="heroSearch">
        <SearchBar />
      </div>
      <div className="toolGrid" style={{ marginTop: 40, textAlign: 'left' }}>
        {popular
          .map(s => tools.find(t => t.slug === s))
          .filter(Boolean)
          .map(t => (
            <ToolCard key={t!.slug} tool={t!} />
          ))}
      </div>
      <div className="heroActions">
        <Link className="btn btnPrimary" href="/">
          Go to all tools
        </Link>
      </div>
    </main>
  );
}
