import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

const UPSTREAM_BASE = "https://fastlearnersapp.com/api/v1";

async function forward(req: NextRequest, path: string[]) {
  const token = cookies().get("auth_token")?.value;
  const url = `${UPSTREAM_BASE}/${path.join("/")}`;

  const headers: HeadersInit = {
    Accept: "application/json",
  };
  if (token) headers["Authorization"] = `Bearer ${token}`;

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