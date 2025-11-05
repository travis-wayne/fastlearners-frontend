import { NextRequest, NextResponse } from "next/server";

import { parseAuthCookiesServer } from "@/lib/server/auth-cookies";

const BASE = process.env.NEXT_PUBLIC_API_URL || "https://fastlearnersapp.com/api/v1";

export async function GET(req: NextRequest) {
  const auth = parseAuthCookiesServer(req);
  if (!auth) {
    return NextResponse.json({ success: false, user: null }, { status: 401 });
  }

  try {
    const r = await fetch(`${BASE}/profile`, {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${auth.token}`,
      },
      cache: "no-store",
    });
    const data = await r.json();
    if (!r.ok) {
      return NextResponse.json({ success: false, user: null, message: data?.message || "Unauthorized" }, { status: r.status });
    }
    return NextResponse.json({ success: true, user: data?.content?.user || null }, { status: 200 });
  } catch (e: any) {
    return NextResponse.json({ success: false, user: null, message: e?.message || "Session fetch failed" }, { status: 500 });
  }
}