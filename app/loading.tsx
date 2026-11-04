/**
 * Shown while a page streams in. It fills the screen on purpose: if it were short, the footer
 * would appear first and then jump down when the page arrives (a "layout shift" Google penalises).
 */
export default function Loading() {
  return (
    <div className="routeLoader" role="status" aria-label="Loading">
      <div className="routeSpinner" />
    </div>
  );
}
