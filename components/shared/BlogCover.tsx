/**
 * Generated cover art for a guide: the topic's colour, a large icon and the title.
 * Pure SVG — no stock photos, no licences, no extra downloads.
 */
import {
  FileText,
  ShieldCheck,
  Braces,
  Calculator,
  QrCode,
  Image as ImageIcon,
  BookOpen,
  type LucideIcon,
} from 'lucide-react';

const THEMES: { match: RegExp; icon: LucideIcon; from: string; to: string }[] = [
  { match: /pdf/i, icon: FileText, from: '#ef4444', to: '#991b1b' },
  { match: /password|security/i, icon: ShieldCheck, from: '#10b981', to: '#065f46' },
  { match: /json|code|developer/i, icon: Braces, from: '#f59e0b', to: '#b45309' },
  { match: /emi|loan|money|calculat|finance/i, icon: Calculator, from: '#0ea5e9', to: '#075985' },
  { match: /qr/i, icon: QrCode, from: '#8b5cf6', to: '#4c1d95' },
  { match: /image|photo|compress|resize|webp|png|jpg/i, icon: ImageIcon, from: '#2563eb', to: '#1e3a8a' },
];

export default function BlogCover({
  title,
  topic,
  large = false,
}: {
  title: string;
  topic: string;
  large?: boolean;
}) {
  const t = THEMES.find(x => x.match.test(`${topic} ${title}`)) || {
    icon: BookOpen,
    from: '#2563eb',
    to: '#0f172a',
  };
  const Icon = t.icon;
  return (
    <div
      className={`blogCover ${large ? 'large' : ''}`}
      style={{ background: `linear-gradient(135deg, ${t.from}, ${t.to})` }}
      aria-hidden="true"
    >
      <span className="bcGrid" />
      <span className="bcIcon">
        <Icon size={large ? 64 : 42} strokeWidth={1.6} />
      </span>
      <span className="bcTopic">{topic}</span>
    </div>
  );
}
