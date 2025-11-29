import { NextRequest, NextResponse } from "next/server";
import { BASE_API_URL } from "@/lib/api/client";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const r = await fetch(`${BASE_API_URL}/reset-password`, {
      method: "POST",
      headers: { Accept: "application/json", "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await r.json();
    return NextResponse.json(data, { status: r.status });
  } catch (e: any) {
    return NextResponse.json(
      { success: false, message: e?.message || "Reset password failed", code: 500 },
      { status: 500 },
    );
  }
}
