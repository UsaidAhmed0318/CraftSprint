'use client';
/**
 * Registers the service worker, listens for the browser's install prompt, shows the
 * "Install CraftSprint" sheet, and — in the installed app — opens the page the visitor installed from.
 */
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { X, Download, Check, Share, SquarePlus, MoreVertical, Smartphone } from 'lucide-react';
import {
  captureInstallPrompt,
  clearInstallPrompt,
  canPromptInstall,
  isIOS,
  isIOSSafari,
  isStandalone,
  promptInstall,
  rememberReturnRoute,
  INSTALL_STATE_EVENT,
  OPEN_INSTALL_EVENT,
  RETURN_ROUTE_KEY,
} from '@/lib/utils/pwa';

type Mode = 'prompt' | 'ios' | 'ios-other' | 'manual' | 'installed';

export default function PwaManager() {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<Mode>('manual');
  const [busy, setBusy] = useState(false);
  const [note, setNote] = useState('');
  const [appName, setAppName] = useState<string | undefined>();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (process.env.NODE_ENV === 'production' && 'serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch(() => {});
    }
    const onPrompt = (e: Event) => captureInstallPrompt(e);
    const onInstalled = () => {
      clearInstallPrompt();
      try {
        localStorage.setItem('cs-installed', '1');
      } catch {}
    };
    window.addEventListener('beforeinstallprompt', onPrompt);
    window.addEventListener('appinstalled', onInstalled);
    // In the installed app: open the tool/game the visitor installed from (once).
    if (isStandalone()) {
      try {
        const route = localStorage.getItem(RETURN_ROUTE_KEY);
        if (route && window.location.pathname === '/') {
          localStorage.removeItem(RETURN_ROUTE_KEY);
          router.replace(route);
        }
      } catch {}
    }
    return () => {
      window.removeEventListener('beforeinstallprompt', onPrompt);
      window.removeEventListener('appinstalled', onInstalled);
    };
  }, [router]);

  useEffect(() => {
    const onOpen = (e: Event) => {
      setAppName((e as CustomEvent<string | undefined>).detail);
      setNote('');
      if (isStandalone()) setMode('installed');
      else if (canPromptInstall()) setMode('prompt');
      else if (isIOSSafari()) setMode('ios');
      else if (isIOS()) setMode('ios-other');
      else setMode('manual');
      setOpen(true);
    };
    const onState = () => setMode(m => (m === 'manual' && canPromptInstall() ? 'prompt' : m));
    window.addEventListener(OPEN_INSTALL_EVENT, onOpen);
    window.addEventListener(INSTALL_STATE_EVENT, onState);
    return () => {
      window.removeEventListener(OPEN_INSTALL_EVENT, onOpen);
      window.removeEventListener(INSTALL_STATE_EVENT, onState);
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  const install = async () => {
    setBusy(true);
    rememberReturnRoute(pathname);
    try {
      const r = await promptInstall();
      if (r === 'accepted') setMode('installed');
      else if (r === 'dismissed') setNote('No problem — you can install CraftSprint any time from the menu.');
      else setMode('manual');
    } catch {
      setMode('manual');
      setNote('Your browser could not show the install window. Use the steps below instead.');
    } finally {
      setBusy(false);
    }
  };

  if (!open) return null;
  return (
    <div className="sheetBackdrop" onClick={() => setOpen(false)}>
      <div
        className="installSheet"
        role="dialog"
        aria-modal="true"
        aria-labelledby="install-title"
        onClick={e => e.stopPropagation()}
      >
        <button className="sheetClose" onClick={() => setOpen(false)} aria-label="Close">
          <X size={20} />
        </button>
        <span className="installLogo">
          <Image src="/icons/icon-192.png" alt="" width={68} height={68} />
        </span>
        <h2 id="install-title">
          {mode === 'installed' ? 'Installed' : `Install ${appName || 'CraftSprint'}`}
        </h2>
        <p className="installLead">
          {mode === 'installed'
            ? 'You are using the CraftSprint app. Every tool and game is inside it.'
            : appName
              ? `Add ${appName} to your home screen as its own app — it opens straight into ${appName}.`
              : 'One app with every CraftSprint tool and game — open it from your home screen like any other app.'}
        </p>

        {mode !== 'installed' && (
          <ul className="installPoints">
            <li>
              <Check size={16} /> Opens full-screen, like an app
            </li>
            <li>
              <Check size={16} /> Pages you have opened also work offline
            </li>
            <li>
              <Check size={16} /> Free, no account, no app store
            </li>
          </ul>
        )}

        {mode === 'prompt' && (
          <button className="btn installBtnBig" onClick={install} disabled={busy}>
            <Download size={18} /> {busy ? 'Opening…' : 'Install app'}
          </button>
        )}
        {mode === 'ios' && (
          <ol className="installSteps">
            <li>
              <span>1</span> Tap the <Share size={16} aria-label="Share" /> <b>Share</b> button in Safari
            </li>
            <li>
              <span>2</span> Choose <SquarePlus size={16} aria-hidden="true" /> <b>Add to Home Screen</b>
            </li>
            <li>
              <span>3</span> Tap <b>Add</b>
            </li>
          </ol>
        )}
        {mode === 'ios-other' && (
          <p className="installLead">
            On iPhone and iPad, apps can only be added from <b>Safari</b>. Open this page in Safari, then tap
            Share → Add to Home Screen.
          </p>
        )}
        {mode === 'manual' && (
          <ol className="installSteps">
            <li>
              <span>1</span> Open your browser menu <MoreVertical size={16} aria-label="menu" />
            </li>
            <li>
              <span>2</span> Tap <b>Install app</b> or <b>Add to Home screen</b>
            </li>
            <li>
              <span>3</span> Confirm — CraftSprint appears on your home screen
            </li>
          </ol>
        )}
        {mode === 'installed' && (
          <p className="installLead">
            <Smartphone size={16} /> Find the CraftSprint icon on your home screen.
          </p>
        )}
        {note && <p className="installNote">{note}</p>}
        <button className="installLater" onClick={() => setOpen(false)}>
          {mode === 'installed' ? 'Close' : 'Maybe later'}
        </button>
      </div>
    </div>
  );
}
