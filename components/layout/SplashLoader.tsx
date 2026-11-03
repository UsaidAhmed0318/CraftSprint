/**
 * CraftSprint intro loader — shows once per browser session (~1.8 s), then fades by itself.
 * Pure HTML + CSS (no JavaScript needed), so it never blocks the page or hurts Google.
 * Styles: app/vip.css → "Intro loader".
 */
import { Image as ImageIcon, FileText, Code2, Calculator, Gamepad2, Sparkles } from 'lucide-react';
import { tools } from '@/data/tools';

const ORBIT = [ImageIcon, FileText, Code2, Calculator, Gamepad2, Sparkles];
const NAME = 'Craft'.split('');
const NAME2 = 'Sprint'.split('');

export default function SplashLoader() {
  return (
    <div className="csSplash" aria-hidden="true">
      <div className="csSplashStars" />
      <div className="csSplashFloor" />

      <div className="csSplashStage">
        <div className="csSplashHalo" />
        <div className="csSplashRing" />
        <div className="csSplashRing r2" />
        <div className="csSplashOrbit">
          {ORBIT.map((Icon, i) => (
            <span key={i} style={{ '--i': i } as React.CSSProperties}>
              <Icon size={16} />
            </span>
          ))}
        </div>
        <div className="csSplashCoin">
          <div className="csCoinFace">
            {/* eslint-disable-next-line @next/next/no-img-element -- must show before React loads */}
            <img src="/icons/icon-192.png" alt="" width={86} height={86} />
          </div>
          <div className="csCoinFace back">
            {/* eslint-disable-next-line @next/next/no-img-element -- must show before React loads */}
            <img src="/icons/icon-192.png" alt="" width={86} height={86} />
          </div>
        </div>
      </div>

      <div className="csSplashName">
        {NAME.map((c, i) => (
          <i key={`a${i}`} style={{ '--d': i } as React.CSSProperties}>
            {c}
          </i>
        ))}
        {NAME2.map((c, i) => (
          <i key={`b${i}`} className="g" style={{ '--d': i + NAME.length } as React.CSSProperties}>
            {c}
          </i>
        ))}
      </div>
      <div className="csSplashTag">{tools.length} free tools · CraftSprint AI · 100% in your browser</div>
      <div className="csSplashBar">
        <i />
      </div>
      <div className="csSplashPct" />
    </div>
  );
}
