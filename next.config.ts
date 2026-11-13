import type { NextConfig } from 'next';

// The real public address of CraftSprint. Used for canonical URLs, the sitemap and share links.
const PRODUCTION_URL = 'https://www.craftsprint.io';
// Canonical URL: NEXT_PUBLIC_SITE_URL wins (spaces and a trailing slash are ignored); production builds on
// Vercel fall back to the real domain, preview builds to their own Vercel address.
const envUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim().replace(/\/+$/, '');
const siteUrl =
  process.env.VERCEL_ENV === 'production'
    ? envUrl && !envUrl.includes('vercel.app')
      ? envUrl
      : PRODUCTION_URL
    : envUrl ||
      (process.env.VERCEL_PROJECT_PRODUCTION_URL
        ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
        : 'http://localhost:3000');

if (process.env.NODE_ENV === 'production' && siteUrl.includes('localhost')) {
  console.warn(
    '\n[CraftSprint] NEXT_PUBLIC_SITE_URL is not set and this is not a Vercel build — canonical URLs and the sitemap will use localhost. Set NEXT_PUBLIC_SITE_URL to your real domain.\n',
  );
}

const isDev = process.env.NODE_ENV !== 'production';
// production on Vercel's Production environment (main); preview for staging/other branches; local builds count as production.
const deployEnv = process.env.VERCEL_ENV || (isDev ? 'development' : 'production');
const isPreviewDeploy = deployEnv !== 'production';

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
    value:
      'camera=(self), microphone=(self), display-capture=(self), geolocation=(), payment=(), usb=(), interest-cohort=()',
  },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  compress: true,
  reactStrictMode: true,
  env: { NEXT_PUBLIC_SITE_URL: siteUrl, NEXT_PUBLIC_DEPLOY_ENV: deployEnv },
  // Old category addresses keep working (permanent redirect) after the categories were split up.
  async redirects() {
    return [
      // One address for Google: the old Vercel address and the bare domain go to www.craftsprint.io.
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'craft-sprint-six.vercel.app' }],
        destination: `${PRODUCTION_URL}/:path*`,
        permanent: true,
      },
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'craftsprint.io' }],
        destination: `${PRODUCTION_URL}/:path*`,
        permanent: true,
      },
      { source: '/category/image-design-tools', destination: '/category/image-tools', permanent: true },
      { source: '/category/pdf-document-tools', destination: '/category/pdf-tools', permanent: true },
      { source: '/category/content-seo-tools', destination: '/category/writing-tools', permanent: true },
    ];
  },
  async headers() {
    return [
      { source: '/:path*', headers: securityHeaders },
      // AI model files never change under the same name: let browsers keep them for a year.
      {
        source: '/models/:path*',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
      },
      // Staging and other preview builds must never appear in search results.
      ...(isPreviewDeploy
        ? [{ source: '/:path*', headers: [{ key: 'X-Robots-Tag', value: 'noindex, nofollow' }] }]
        : []),
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
