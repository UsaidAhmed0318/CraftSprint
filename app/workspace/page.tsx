import FileWorkspace from '@/components/shared/FileWorkspace';
import { withSeo } from '@/lib/seo';

export const metadata = withSeo('/workspace', {
  title: 'File Workspace – Open Any File in the Right Tool',
  description:
    'Drop any image, PDF, video or audio file and CraftSprint shows every tool that can work with it. Files stay on your device.',
});

export default function WorkspacePage() {
  return (
    <main className="section">
      <div className="container">
        <h1 className="pageHero">
          File <span className="violetText">workspace</span>
        </h1>
        <p className="lead">
          One place for any file: drop it in, pick what you want to do, and it opens in the right tool — no
          searching.
        </p>
        <FileWorkspace />
      </div>
    </main>
  );
}
