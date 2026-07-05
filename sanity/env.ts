// These are public, non-secret values (also shipped to the browser via
// NEXT_PUBLIC_*). Env vars take precedence; the fallbacks keep builds working
// on hosts where the env vars haven't been set yet.
export const apiVersion =
  process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2026-07-04'

export const dataset =
  process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'

export const projectId =
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'oh5pjj5g'
