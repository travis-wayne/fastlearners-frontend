import { NextRequest, NextResponse } from "next/server";

import { parseAuthCookiesServer } from "@/lib/server/auth-cookies";

export async function GET(req: NextRequest) {
  const auth = parseAuthCookiesServer(req);
  if (!auth) {
    return NextResponse.json({ success: false, user: null }, { status: 401 });
  }
  return NextResponse.json({ success: true, user: auth.user });
}