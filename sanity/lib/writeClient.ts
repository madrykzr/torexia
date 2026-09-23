import { createClient } from "next-sanity";

import { apiVersion, dataset, projectId } from "../env";

// Server-only write-capable client — used only by app/api/**/route.ts
// (Next.js Route Handlers run server-side, so this token never reaches the
// browser bundle). Never import this from a "use client" file.
export const writeClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
  token: process.env.SANITY_API_WRITE_TOKEN,
});
