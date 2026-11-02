import Link from 'next/link';
import type { LucideIcon } from 'lucide-react';
export default function ToolCard({
  tool,
}: {
  tool: { slug: string; name: string; description: string; icon: LucideIcon; category?: string };
}) {
  const Icon = tool.icon;
  return (
    <Link className={`toolCard ${tool.category === 'Games' ? 'game' : ''}`} href={`/tools/${tool.slug}`}>
      <div className="iconBox">
        <Icon size={21} />
      </div>
      <h3>{tool.name}</h3>
      <p>{tool.description}</p>
      <span className="toolLink">{tool.category === 'Games' ? `Play ${tool.name}` : `Use ${tool.name}`}</span>
    </Link>
  );
}
