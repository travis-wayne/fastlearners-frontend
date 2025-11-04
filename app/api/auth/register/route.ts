import { NextRequest, NextResponse } from "next/server";

const BASE = process.env.NEXT_PUBLIC_API_URL || "https://fastlearnersapp.com/api/v1";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const r = await fetch(`${BASE}/register`, {
      method: "POST",
      headers: { Accept: "application/json", "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await r.json();
    return NextResponse.json(data, { status: r.status });
  } catch (e: any) {
    return NextResponse.json(
      { success: false, message: e?.message || "Registration failed", code: 500 },
      { status: 500 },
    );
  }
}
