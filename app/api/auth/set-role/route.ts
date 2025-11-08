import { NextRequest, NextResponse } from "next/server";

import {
  AUTH_TOKEN_COOKIE,
  REG_TOKEN_COOKIE,
  clearRegTokenServer,
  setAuthCookiesServer,
} from "@/lib/server/auth-cookies";

const BASE = process.env.NEXT_PUBLIC_API_URL || "https://fastlearnersapp.com/api/v1";

export async function POST(req: NextRequest) {
  try {
    const cookies = req.cookies;
    const regToken = cookies.get(REG_TOKEN_COOKIE)?.value;
    const mainToken = cookies.get(AUTH_TOKEN_COOKIE)?.value;
    const token = mainToken || regToken;
    if (!token) {
      return NextResponse.json({ success: false, message: "Unauthorized", code: 401 }, { status: 401 });
    }

    const body = await req.json();

    const r = await fetch(`${BASE}/set-role`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });

    const data = await r.json();
    if (!r.ok) return NextResponse.json(data, { status: r.status });

    // Fetch profile to obtain user, then set main session cookies using existing token
    const prof = await fetch(`${BASE}/profile`, {
      headers: { Accept: "application/json", Authorization: `Bearer ${token}` },
    });
    const profData = await prof.json();

    const res = NextResponse.json({ ...data, user: profData?.content?.user }, { status: 200 });
    if (profData?.content?.user) {
      const expiresAt = Date.now() + 7 * 24 * 60 * 60 * 1000; // 7 days
      setAuthCookiesServer(res, { token, expiresAt });
      clearRegTokenServer(res);
    }
    return res;
  } catch (e: any) {
    return NextResponse.json(
      { success: false, message: e?.message || "Set role failed", code: 500 },
      { status: 500 },
    );
  }
}
