import { NextRequest, NextResponse } from "next/server";

import { setAuthCookiesServer } from "@/lib/server/auth-cookies";

const BASE = process.env.NEXT_PUBLIC_API_URL || "https://fastlearnersapp.com/api/v1";

export async function GET(req: NextRequest) {
  try {
    const search = req.nextUrl.search || "";
    const r = await fetch(`${BASE}/google/callback${search}`, {
      method: "GET",
      headers: { Accept: "application/json" },
    });
    const data = await r.json();

    if (r.ok && data?.content?.access_token && data?.content?.user) {
      const expiresAt = Date.now() + 7 * 24 * 60 * 60 * 1000;
      const res = NextResponse.json({ success: true, user: data.content.user });
      setAuthCookiesServer(res, {
        token: data.content.access_token,
        expiresAt,
      });
      return res;
    }

    return NextResponse.json(data, { status: r.status });
  } catch (e: any) {
    return NextResponse.json(
      { success: false, message: e?.message || "Google callback failed", code: 500 },
      { status: 500 },
    );
  }
}
