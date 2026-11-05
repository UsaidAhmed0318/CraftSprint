import type { NextConfig } from 'next';

// Canonical URL: NEXT_PUBLIC_SITE_URL wins; on Vercel the production domain is used automatically.
const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : 'http://localhost:3000');

if (process.env.NODE_ENV === 'production' && siteUrl.includes('localhost')) {
  console.warn(
    '\n[CraftSprint] NEXT_PUBLIC_SITE_URL is not set and this is not a Vercel build — canonical URLs and the sitemap will use localhost. Set NEXT_PUBLIC_SITE_URL to your real domain.\n',
  );
}

const isDev = process.env.NODE_ENV !== 'production';

// Ads and analytics hosts that AdSense / Google Analytics need.
const google =
  'https://*.google.com https://*.googlesyndication.com https://*.doubleclick.net https://*.googletagmanager.com https://*.google-analytics.com https://*.adtrafficquality.google https://*.gstatic.com https://*.googleadservices.com';

const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline' ${isDev ? "'unsafe-eval'" : ''} 'wasm-unsafe-eval' blob: ${google}`,
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src 'self' data: https://fonts.gstatic.com",
  "img-src 'self' data: blob: https:",
  "media-src 'self' data: blob:",
  "worker-src 'self' blob:",
  // API tester sends requests from the visitor's browser to any HTTPS address they type.
  "connect-src 'self' https: data: blob:",
  `frame-src 'self' about: blob: data: ${google}`,
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'self'",
  'upgrade-insecure-requests',
].join('; ');

const securityHeaders = [
  { key: 'Content-Security-Policy', value: csp },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
  { key: 'Strict-Transport-Security', value: 'max-age=63072000' },
  { key: 'Cross-Origin-Opener-Policy', value: 'same-origin-allow-popups' },
  // Tools may use the camera (QR scanner) or microphone; nothing else is allowed.
  {
    key: 'Permissions-Policy',
    value: 'camera=(self), microphone=(self), geolocation=(), payment=(), usb=(), interest-cohort=()',
  },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  compress: true,
  reactStrictMode: true,
  env: { NEXT_PUBLIC_SITE_URL: siteUrl },
  // Old category addresses keep working (permanent redirect) after the categories were split up.
  async redirects() {
    return [
      { source: '/category/image-design-tools', destination: '/category/image-tools', permanent: true },
      { source: '/category/pdf-document-tools', destination: '/category/pdf-tools', permanent: true },
      { source: '/category/content-seo-tools', destination: '/category/writing-tools', permanent: true },
    ];
  },
  async headers() {
    return [
      { source: '/:path*', headers: securityHeaders },
      // API answers are always fresh; never stored by the browser or CDN.
      { source: '/api/:path*', headers: [{ key: 'Cache-Control', value: 'no-store, max-age=0' }] },
      // The service worker must always be re-checked so updates reach installed apps quickly.
      {
        source: '/sw.js',
        headers: [
          { key: 'Cache-Control', value: 'no-cache, max-age=0' },
          { key: 'Content-Type', value: 'application/javascript; charset=utf-8' },
        ],
      },
    ];
  },
};

export default nextConfig;
