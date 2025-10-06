import { NextRequest, NextResponse } from "next/server";

import { clearAuthCookiesServer } from "@/lib/server/auth-cookies";

export async function POST(_req: NextRequest) {
  const res = NextResponse.json({ success: true, message: "Logged out" });
  clearAuthCookiesServer(res);
  return res;
}