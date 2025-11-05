import { NextRequest, NextResponse } from "next/server";
import { parseAuthCookiesServer } from "@/lib/server/auth-cookies";

const UPSTREAM_BASE = "https://fastlearnersapp.com/api/v1";

async function forward(req: NextRequest, path: string[]) {
  const auth = parseAuthCookiesServer(req);
  const url = `${UPSTREAM_BASE}/${path.join("/")}`;

  const headers: HeadersInit = {
    Accept: "application/json",
  };
  if (auth?.token) headers["Authorization"] = `Bearer ${auth.token}`;

  try {
    if (req.method === "POST" || req.method === "PUT" || req.method === "PATCH") {
      const body = await req.json().catch(() => undefined);
      const resp = await fetch(url, {
        method: req.method,
        headers: { ...headers, "Content-Type": "application/json" },
        body: body ? JSON.stringify(body) : undefined,
        cache: "no-store",
      });
      const data = await resp.json().catch(() => ({}));
      return NextResponse.json(data, { status: resp.status });
    }

    // Default: GET/DELETE
    const resp = await fetch(url, { method: req.method, headers, cache: "no-store" });
    const data = await resp.json().catch(() => ({}));
    return NextResponse.json(data, { status: resp.status });
  } catch (e: any) {
    return NextResponse.json(
      { success: false, message: e?.message || "Proxy request failed", code: 500 },
      { status: 500 },
    );
  }
}

export async function GET(req: NextRequest, { params }: { params: { path: string[] } }) {
  return forward(req, params.path);
}

export async function POST(req: NextRequest, { params }: { params: { path: string[] } }) {
  return forward(req, params.path);
}

export async function PUT(req: NextRequest, { params }: { params: { path: string[] } }) {
  return forward(req, params.path);
}

export async function PATCH(req: NextRequest, { params }: { params: { path: string[] } }) {
  return forward(req, params.path);
}

export async function DELETE(req: NextRequest, { params }: { params: { path: string[] } }) {
  return forward(req, params.path);
}