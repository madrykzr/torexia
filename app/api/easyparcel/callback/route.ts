import { NextRequest, NextResponse } from "next/server";

import { exchangeCode, getWalletBalance, verifyState } from "@/lib/easyparcel";

export async function GET(req: NextRequest) {
  const adminKey = process.env.EASYPARCEL_ADMIN_KEY;
  const code = req.nextUrl.searchParams.get("code");
  const state = req.nextUrl.searchParams.get("state") ?? "";
  if (!adminKey || !code || !verifyState(state, adminKey)) {
    return new NextResponse("Authorization link expired or invalid. Start again from the connect link.", {
      status: 400,
    });
  }
  try {
    await exchangeCode(code);
    let wallet = "";
    try {
      wallet = await getWalletBalance();
    } catch {
      wallet = "(could not read wallet)";
    }
    return new NextResponse(`EasyParcel connected. Wallet: ${wallet}\nYou can close this page.`, {
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  } catch (err) {
    console.error("EasyParcel callback failed:", err);
    return new NextResponse("Connecting failed — see server logs.", { status: 500 });
  }
}
