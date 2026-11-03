import AiChat from '@/components/ai/AiChat';
import { withSeo } from '@/lib/seo';

export const metadata = withSeo('/ai', {
  title: 'CraftSprint AI – Find the Right Free Tool',
  description:
    'Ask CraftSprint AI what you want to do — compress a photo, merge PDFs, format JSON — and it points you to the right free tool in seconds.',
});

export default function AiPage() {
  return (
    <main>
      <AiChat />
    </main>
  );
}
