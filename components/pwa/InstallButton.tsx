'use client';
/** Mobile-only "Install App" button for tool and game pages. Installs the one CraftSprint app. */
import { useEffect, useState } from 'react';
import { Download, Smartphone, CheckCircle2 } from 'lucide-react';
import { isStandalone, openInstall } from '@/lib/utils/pwa';

export default function InstallButton({ label = 'Install App' }: { label?: string }) {
  const [installed, setInstalled] = useState(false);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- display mode is only known in the browser
    setInstalled(isStandalone());
  }, []);
  if (installed) {
    return (
      <p className="installDone">
        <CheckCircle2 size={16} /> You are using the CraftSprint app
      </p>
    );
  }
  return (
    <button type="button" className="installBtn" onClick={openInstall}>
      <Smartphone size={20} aria-hidden="true" />
      <span>{label}</span>
      <Download size={20} aria-hidden="true" />
    </button>
  );
}
