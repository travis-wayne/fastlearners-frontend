import { NextRequest, NextResponse } from "next/server";

import { authApi } from "@/lib/api/auth";
import { setAuthCookiesServer } from "@/lib/server/auth-cookies";
import { LoginCredentials } from "@/lib/types/auth";

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as LoginCredentials;
    if (!body?.email_phone || !body?.password) {
      return NextResponse.json(
        { success: false, message: "Missing credentials" },
        { status: 400 },
      );
    }

    const apiRes = await authApi.login(body);
    if (!apiRes.success || !apiRes.content) {
      return NextResponse.json(
        { success: false, message: apiRes.message || "Login failed" },
        { status: 401 },
      );
    }

    const { access_token, user } = apiRes.content;
    const expiresAt = Date.now() + 7 * 24 * 60 * 60 * 1000; // 7 days

    const res = NextResponse.json({ success: true, user });
    setAuthCookiesServer(res, { token: access_token, user, expiresAt });
    return res;
  } catch (e: any) {
    return NextResponse.json(
      {
        success: false,
        message: e?.message || "Unexpected error during login",
      },
      { status: 500 },
    );
  }
}