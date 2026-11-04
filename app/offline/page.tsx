import Link from 'next/link';
import type { Metadata } from 'next';
import { WifiOff } from 'lucide-react';

export const metadata: Metadata = { title: 'You are offline', robots: { index: false, follow: false } };

export default function OfflinePage() {
  return (
    <main className="section">
      <div className="container article" style={{ textAlign: 'center' }}>
        <span className="dropIcon" aria-hidden="true">
          <WifiOff size={36} />
        </span>
        <h1>You are offline</h1>
        <p>
          This page has not been saved on your device yet. Pages you opened before still work offline —
          reconnect to open new tools.
        </p>
        <Link href="/" className="btn btnPrimary">
          Go to the homepage
        </Link>
      </div>
    </main>
  );
}
