import { NextRequest, NextResponse } from "next/server";
import { BASE_API_URL } from "@/lib/api/client";
import { setAuthCookiesServer } from "@/lib/server/auth-cookies";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const code = searchParams.get("code");
    
    if (!code) {
      return NextResponse.json({ success: false, message: "No code provided", code: 400 }, { status: 400 });
    }

    const r = await fetch(`${BASE_API_URL}/auth/google/callback?code=${code}`, {
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
