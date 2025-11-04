import { NextRequest, NextResponse } from "next/server";

import { clearRegTokenServer, setRegTokenServer } from "@/lib/server/auth-cookies";

const BASE = process.env.NEXT_PUBLIC_API_URL || "https://fastlearnersapp.com/api/v1";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const r = await fetch(`${BASE}/verify-email`, {
      method: "POST",
      headers: { Accept: "application/json", "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await r.json();

    if (r.ok && data?.content?.access_token) {
      // set short-lived reg token (15 minutes)
      const res = NextResponse.json(data, { status: r.status });
      setRegTokenServer(res, data.content.access_token, 15 * 60);
      return res;
    }

    return NextResponse.json(data, { status: r.status });
  } catch (e: any) {
    return NextResponse.json(
      { success: false, message: e?.message || "Verify email failed", code: 500 },
      { status: 500 },
    );
  }
}
