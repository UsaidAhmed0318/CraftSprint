import { withSeo } from '@/lib/seo';
export const metadata = withSeo('/blog/resize-images', {
  title: 'How to Resize an Image for a Website',
  description: 'Learn how pixel dimensions, aspect ratio and image size affect website images.',
});
export default function Page() {
  return (
    <main className="section">
      <article className="container article">
        <span className="kicker">Image guide</span>
        <h1>How to resize an image for a website</h1>
        <p>
          Resizing changes the pixel dimensions of an image. The best dimensions depend on the space where the
          image will actually appear.
        </p>
        <h2>Keep the aspect ratio</h2>
        <p>
          Stretching an image can make people and objects look distorted. When possible, calculate the new
          height from the original aspect ratio instead of choosing unrelated width and height values.
        </p>
        <h2>Resize before upload</h2>
        <p>
          Uploading an image that is much larger than its display size wastes bandwidth. Resize it before
          publishing and then choose an appropriate compression level.
        </p>
      </article>
    </main>
  );
}
