import { NextRequest, NextResponse } from "next/server";
import { BASE_API_URL } from "@/lib/api/client";
import { parseAuthCookiesServer, parseRegTokenServer } from "@/lib/server/auth-cookies";

export async function POST(req: NextRequest) {
  try {
    const auth = parseAuthCookiesServer(req);
    const regToken = parseRegTokenServer(req);
    const mainToken = auth?.token;

    // Prefer main session token, otherwise use reg token during onboarding
    const token = mainToken || regToken;
    if (!token) {
      return NextResponse.json(
        { success: false, message: "Unauthorized", code: 401 },
        { status: 401 },
      );
    }

    const body = await req.json();

    const r = await fetch(`${BASE_API_URL}/create-password`, {
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
