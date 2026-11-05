'use client';
import { Globe } from 'lucide-react';
import { LANGS, setLang, useT, type Lang } from '@/lib/i18n';

export default function LanguageSwitcher({ compact = false }: { compact?: boolean }) {
  const { lang, t } = useT();
  return (
    <label className={`langSwitch ${compact ? 'compact' : ''}`}>
      <Globe size={16} aria-hidden="true" />
      <span className="srOnly">{t('language')}</span>
      <select value={lang} onChange={e => setLang(e.target.value as Lang)} aria-label={t('language')}>
        {LANGS.map(l => (
          <option key={l.code} value={l.code}>
            {l.label}
          </option>
        ))}
      </select>
    </label>
  );
}
