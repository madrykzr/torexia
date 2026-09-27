import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { isValidSignature, SIGNATURE_HEADER_NAME } from "@sanity/webhook";

// Sanity calls this the moment anything is published, so edits go live within
// seconds instead of waiting for the ~60s cache to expire on its own.
// Deliberately unfiltered (fires for every document type) rather than
// per-type — a per-type filter is easy to forget to extend for a new content
// type later, and it fails silently when you do.
export async function POST(req: NextRequest) {
  const rawBody = await req.text();
  const signature = req.headers.get(SIGNATURE_HEADER_NAME);
  const secret = process.env.SANITY_WEBHOOK_SECRET;

  if (!secret) {
    return NextResponse.json({ error: "Webhook not configured." }, { status: 500 });
  }
  if (!signature || !(await isValidSignature(rawBody, signature, secret))) {
    return NextResponse.json({ error: "Invalid signature." }, { status: 401 });
  }

  revalidatePath("/", "layout");
  return NextResponse.json({ revalidated: true });
}
