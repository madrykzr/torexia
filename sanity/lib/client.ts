import { createClient } from 'next-sanity'

import { apiVersion, dataset, projectId } from '../env'

// Server-only token (never NEXT_PUBLIC). Needed when the dataset is private.
// Prefer a dedicated read-only token; falls back to the write token if that's
// all that's configured. If the dataset is public, no token is required.
const token =
  process.env.SANITY_API_READ_TOKEN || process.env.SANITY_API_WRITE_TOKEN

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false, // false for static generation / ISR / tag-based revalidation
  token,
  // Only ever return published documents to the public site (never drafts).
  perspective: 'published',
})
