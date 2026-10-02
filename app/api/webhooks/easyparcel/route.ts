import { NextRequest, NextResponse } from "next/server";
import { after } from "next/server";

import { syncShipment } from "@/lib/easyparcel";

export const maxDuration = 30;

// EasyParcel posts AWB / status / tracking updates here. The payload is
// unsigned, so it is never trusted: we only read the shipment number from it
// and re-fetch the real details from EasyParcel. Always answers 200.
export async function POST(req: NextRequest) {
  const body = (await req.json().catch(() => null)) as Record<string, unknown> | null;
  const data = (body?.data ?? body) as Record<string, unknown> | undefined;
  const shipmentNo =
    (data?.shipment_number as string | undefined) ??
    (body?.shipment_number as string | undefined);
  if (typeof shipmentNo === "string" && /^[A-Za-z0-9-]{4,60}$/.test(shipmentNo)) {
    after(() => syncShipment(shipmentNo).catch((e) => console.error("EasyParcel sync failed:", e)));
  }
  return NextResponse.json({ ok: true });
}
