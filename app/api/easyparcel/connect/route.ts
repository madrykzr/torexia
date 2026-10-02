import { NextRequest, NextResponse } from "next/server";

import { authorizeUrl, safeEqual, signState } from "@/lib/easyparcel";

// One-time owner authorization: /api/easyparcel/connect?key=<EASYPARCEL_ADMIN_KEY>
export async function GET(req: NextRequest) {
  const adminKey = process.env.EASYPARCEL_ADMIN_KEY;
  const key = req.nextUrl.searchParams.get("key") ?? "";
  if (!adminKey || !safeEqual(key, adminKey)) {
    return NextResponse.json({ error: "Not allowed." }, { status: 403 });
  }
  return NextResponse.redirect(authorizeUrl(signState(adminKey)));
}
