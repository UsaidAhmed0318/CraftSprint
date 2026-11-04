import type { Metadata } from 'next';
import MyTools from '@/components/shared/MyTools';

export const metadata: Metadata = {
  title: 'Your favourite and recent tools',
  description: 'Your favourite and recently used CraftSprint tools, saved only in this browser.',
  robots: { index: false, follow: true },
};

export default function MyToolsPage() {
  return (
    <main className="section">
      <div className="container">
        <h1>Your tools</h1>
        <p className="lead">
          Favourites and recently used tools. They are saved only in this browser — nothing is sent to a
          server.
        </p>
        <MyTools />
      </div>
    </main>
  );
}
