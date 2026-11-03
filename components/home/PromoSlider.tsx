'use client';
import { useEffect, useState } from 'react';
import { ArrowUpRight, Sparkles } from 'lucide-react';

const slides = [
  {
    eyebrow: 'Sponsored',
    kicker: 'Your Growth Partner',
    title: 'Over The Stack Solutions',
    text: "A dynamic software company committed to unleashing tomorrow's solutions today. We are your dedicated growth partner.",
    href: 'https://www.overthestack.com/',
  },
];

export default function PromoSlider() {
  const [i, setI] = useState(0);
  useEffect(() => {
    if (slides.length < 2) return;
    const t = setInterval(() => setI(v => (v + 1) % slides.length), 6000);
    return () => clearInterval(t);
  }, []);
  const s = slides[i];
  return (
    <a
      className="promoSlide"
      href={s.href}
      target="_blank"
      rel="sponsored noopener noreferrer"
      aria-label={`${s.title} — visit overthestack.com`}
    >
      <div className="promoText">
        <span className="promoEyebrow">
          <Sparkles size={13} aria-hidden="true" /> {s.eyebrow}
        </span>
        <div className="promoKicker">{s.kicker}</div>
        <h3>{s.title}</h3>
        <p>{s.text}</p>
      </div>
      <span className="promoCta">
        Visit site <ArrowUpRight size={17} />
      </span>
      {slides.length > 1 && (
        <span className="promoDots">
          {slides.map((_, d) => (
            <span key={d} className={`promoDot ${d === i ? 'active' : ''}`} />
          ))}
        </span>
      )}
    </a>
  );
}
