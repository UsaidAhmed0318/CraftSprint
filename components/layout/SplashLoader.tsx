/**
 * Branded intro loader. Shows once per browser session for about one second.
 * Pure CSS: it fades itself out, so the page is never blocked (good for speed and Google).
 */

export default function SplashLoader() {
  return (
    <div className="csSplash" aria-hidden="true">
      <div className="csSplashStage">
        <div className="csSplashRing" />
        <div className="csSplashRing r2" />
        {/* eslint-disable-next-line @next/next/no-img-element -- must show before React loads */}
        <img className="csSplashLogo" src="/icons/icon-192.png" alt="" width={84} height={84} />
      </div>
      <div className="csSplashName">
        Craft<span>Sprint</span>
      </div>
      <div className="csSplashBar">
        <i />
      </div>
      <div className="csSplashTag">Every tool you need, in one place</div>
    </div>
  );
}
