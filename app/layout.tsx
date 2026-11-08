import type { Metadata, Viewport } from 'next';
import Script from 'next/script';
import '@fontsource-variable/manrope';
import '@fontsource-variable/sora';
import './globals.css';
import './vip.css';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import JsonLd from '@/components/shared/JsonLd';
import WhatsAppButton from '@/components/layout/WhatsAppButton';
import ToolAssistant from '@/components/shared/ToolAssistant';
import SplashLoader from '@/components/layout/SplashLoader';
import MobileTabBar from '@/components/layout/MobileTabBar';
import PwaManager from '@/components/pwa/PwaManager';
import { themeInitScript, splashInitScript } from '@/lib/initScripts';
import { site } from '@/lib/site';
import { IS_PRODUCTION } from '@/lib/deployEnv';

const GA = process.env.NEXT_PUBLIC_GA_ID;
// Analytics and ads run only on the live site, never on staging/preview builds.
const gaOn = IS_PRODUCTION && !!GA && !GA.includes('XXXX');
const ADS = process.env.NEXT_PUBLIC_ADSENSE_CLIENT;
const adsOn = IS_PRODUCTION && !!ADS && !ADS.includes('XXXX');

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  // iPhone/iPad: 'Add to Home Screen' opens CraftSprint full-screen with its own name
  appleWebApp: { capable: true, title: 'CraftSprint', statusBarStyle: 'black-translucent' },
  title: {
    default: 'CraftSprint — Free Online Tools for Images, PDFs & Code',
    template: '%s | CraftSprint',
  },
  description: site.description,
  applicationName: site.name,
  openGraph: {
    type: 'website',
    siteName: site.name,
    title: 'CraftSprint — Free Online Tools',
    description: site.description,
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CraftSprint — Free Online Tools',
    description: site.description,
  },
  robots: IS_PRODUCTION ? { index: true, follow: true } : { index: false, follow: false },
};
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#07051a',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript + splashInitScript }} />
        {adsOn && (
          <script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADS}`}
            crossOrigin="anonymous"
          />
        )}
      </head>
      <body>
        {!IS_PRODUCTION && (
          <div className="stagingBadge" role="note">
            Staging — not the live site
          </div>
        )}
        <SplashLoader />
        <JsonLd
          data={{
            '@context': 'https://schema.org',
            '@type': 'Organization',
            name: site.name,
            url: site.url,
            description: site.description,
            email: site.email,
            logo: `${site.url}/images/logo.png`,
          }}
        />
        <JsonLd
          data={{ '@context': 'https://schema.org', '@type': 'WebSite', name: site.name, url: site.url }}
        />
        <a href="#main" className="skipLink">
          Skip to content
        </a>
        <Header />
        <div id="main">{children}</div>
        <Footer />
        <MobileTabBar />
        <PwaManager />
        <ToolAssistant />
        <WhatsAppButton />
        {gaOn && (
          <>
            <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA}`} strategy="afterInteractive" />
            <Script
              id="ga"
              strategy="afterInteractive"
            >{`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config','${GA}');`}</Script>
          </>
        )}
      </body>
    </html>
  );
}
