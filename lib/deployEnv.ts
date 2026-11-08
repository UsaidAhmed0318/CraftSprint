/**
 * Which copy of CraftSprint is running.
 * - production: www.craftsprint.io (main branch) — indexed by Google, ads and analytics on.
 * - preview: staging.craftsprint.io and every other Vercel preview (staging and other branches) —
 *   never indexed, no ads, no analytics, shows a "Staging" label.
 * Self-hosted production builds outside Vercel count as production.
 */
export const DEPLOY_ENV = process.env.NEXT_PUBLIC_DEPLOY_ENV || 'development';
export const IS_PRODUCTION = DEPLOY_ENV === 'production';
