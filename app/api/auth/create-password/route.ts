import { NextRequest, NextResponse } from "next/server";

import {
  AUTH_TOKEN_COOKIE,
  clearRegTokenServer,
  parseAuthCookiesServer,
  setAuthCookiesServer,
} from "@/lib/server/auth-cookies";

const BASE = process.env.NEXT_PUBLIC_API_URL || "https://fastlearnersapp.com/api/v1";

export async function POST(req: NextRequest) {
  try {
    const cookies = req.cookies;
    const regToken = cookies.get("reg_token")?.value;
    const mainToken = cookies.get(AUTH_TOKEN_COOKIE)?.value;

    // Prefer main session token, otherwise use reg token during onboarding
    const token = mainToken || regToken;
    if (!token) {
      return NextResponse.json(
        { success: false, message: "Unauthorized", code: 401 },
        { status: 401 },
      );
    }

    const body = await req.json();

    const r = await fetch(`${BASE}/create-password`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });

    const data = await r.json();

    // Do not clear reg token yet; allow set-role to use it as well
    return NextResponse.json(data, { status: r.status });
  } catch (e: any) {
    return NextResponse.json(
      { success: false, message: e?.message || "Create password failed", code: 500 },
      { status: 500 },
    );
  }
}
