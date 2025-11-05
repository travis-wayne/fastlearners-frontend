import { NextRequest, NextResponse } from "next/server";

// Thin alias to session for back-compat
export async function GET(req: NextRequest) {
  const url = new URL("/api/auth/session", req.url);
  const r = await fetch(url.toString(), { headers: { Accept: "application/json" }, cache: "no-store" });
  const data = await r.json().catch(() => ({}));
  return NextResponse.json(data, { status: r.status });
}
