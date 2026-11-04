import { withSeo, fitTitle } from '@/lib/seo';
export const metadata = withSeo('/blog/compress-images', {
  title: fitTitle('How to Compress Images Without Losing Too Much Quality'),
  description: 'A practical guide to image compression, dimensions, formats and quality settings.',
});
export default function Page() {
  return (
    <main className="section">
      <article className="container article">
        <span className="kicker">Image guide</span>
        <h1>How to compress images without losing too much quality</h1>
        <p>
          Large image files slow down pages, consume storage and make sharing harder. Good compression is
          about reducing unnecessary bytes while keeping the image visually useful.
        </p>
        <h2>Start with the right dimensions</h2>
        <p>
          If an image only appears at 1200 pixels wide, exporting it at 5000 pixels creates unnecessary data.
          Resize oversized images before you compress them.
        </p>
        <h2>Choose the right format</h2>
        <p>
          WebP is often a strong choice for web images. JPEG remains useful for photographs, while PNG is
          valuable when you need lossless output or transparency.
        </p>
        <h2>Compare before and after</h2>
        <p>
          Do not judge compression by a percentage alone. Check the actual file size and inspect important
          areas of the image. Our compressor lets you adjust quality and download the result locally.
        </p>
      </article>
    </main>
  );
}
