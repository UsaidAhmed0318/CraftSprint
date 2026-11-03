/**
 * Tiny scripts that must run before the page paints (placed in <head> by app/layout.tsx).
 * They live in a plain (server-safe) file so they are sent to the browser as real code.
 */
// Applies the saved light/dark theme before anything is shown (dark by default), so the page never flashes.
export const themeInitScript = `(function(){try{var t=localStorage.getItem('cs-theme');if(!t){t='dark'}document.documentElement.setAttribute('data-theme',t)}catch(e){}})();`;

// Shows the intro loader only on the first page of a browser session.
export const splashInitScript = `(function(){try{if(sessionStorage.getItem('cs-splash')){document.documentElement.classList.add('cs-seen')}else{sessionStorage.setItem('cs-splash','1')}}catch(e){}})();`;
