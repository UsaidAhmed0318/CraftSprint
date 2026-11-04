'use client';
/**
 * Install support for the CraftSprint app (one app for the whole site — not one per tool).
 * - Android/desktop Chrome & Edge: the browser's own install prompt (beforeinstallprompt).
 * - iPhone/iPad Safari: no prompt exists, so we show "Share → Add to Home Screen" steps.
 */
type PromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
};

let deferred: PromptEvent | null = null;
export const INSTALL_STATE_EVENT = 'cs-install-state';
export const OPEN_INSTALL_EVENT = 'cs-open-install';
export const RETURN_ROUTE_KEY = 'cs-install-route';

export function captureInstallPrompt(e: Event) {
  e.preventDefault();
  deferred = e as PromptEvent;
  window.dispatchEvent(new Event(INSTALL_STATE_EVENT));
}
export function clearInstallPrompt() {
  deferred = null;
  window.dispatchEvent(new Event(INSTALL_STATE_EVENT));
}
export const canPromptInstall = () => !!deferred;

export function isStandalone() {
  if (typeof window === 'undefined') return false;
  return (
    window.matchMedia?.('(display-mode: standalone)').matches ||
    (navigator as Navigator & { standalone?: boolean }).standalone === true
  );
}

export function isIOS() {
  if (typeof navigator === 'undefined') return false;
  const ua = navigator.userAgent;
  return /iPad|iPhone|iPod/.test(ua) || (ua.includes('Macintosh') && navigator.maxTouchPoints > 1);
}

/** Safari is the only iOS browser that can add a web app to the home screen reliably. */
export function isIOSSafari() {
  if (!isIOS()) return false;
  const ua = navigator.userAgent;
  return /Safari/.test(ua) && !/CriOS|FxiOS|EdgiOS|OPiOS|GSA|Instagram|FBAN|FBAV/.test(ua);
}

/** Shows the browser's install prompt. Returns the visitor's choice, or 'unavailable'. */
export async function promptInstall(): Promise<'accepted' | 'dismissed' | 'unavailable'> {
  if (!deferred) return 'unavailable';
  const ev = deferred;
  await ev.prompt();
  const { outcome } = await ev.userChoice;
  clearInstallPrompt();
  return outcome;
}

/** Remember the page the visitor installed from, so the installed app can open it first. */
export function rememberReturnRoute(path: string) {
  try {
    if (path && path !== '/') localStorage.setItem(RETURN_ROUTE_KEY, path);
  } catch {}
}

/** Opens the install sheet. Pass the tool/game name when installing a single tool as its own app. */
export function openInstall(appName?: string) {
  window.dispatchEvent(new CustomEvent<string | undefined>(OPEN_INSTALL_EVENT, { detail: appName }));
}
