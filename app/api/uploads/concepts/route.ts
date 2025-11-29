import { NextRequest, NextResponse } from "next/server";
import { BASE_API_URL } from "@/lib/api/client";
import { parseAuthCookiesServer } from "@/lib/server/auth-cookies";

export async function POST(req: NextRequest) {
  const auth = parseAuthCookiesServer(req);
  if (!auth) {
    return NextResponse.json(
      { success: false, message: "Unauthorized", code: 401 },
      { status: 401 }
    );
  }

  try {
    const formData = await req.formData();
    const file = formData.get("concepts_file") as File;

    if (!file) {
      return NextResponse.json(
        {
          success: false,
          message: "Missing concepts_file",
          content: null,
          code: 400,
        },
        { status: 400 }
      );
    }

    // Create new FormData for upstream
    const upstreamFormData = new FormData();
    upstreamFormData.append("concepts_file", file);

    const upstream = await fetch(
      `${BASE_API_URL}/superadmin/lessons/uploads/concepts`,
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${auth.token}`,
        },
        body: upstreamFormData,
        cache: "no-store",
      }
    );

    const data = await upstream.json();
    return NextResponse.json(data, { status: upstream.status });
  } catch (err: any) {
    if (process.env.NEXT_PUBLIC_DEBUG_AUTH === "true") {
      console.error("Concepts upload API error:", err);
    }
    return NextResponse.json(
      {
        success: false,
        message: err?.message || "Server error",
        content: null,
        code: 500,
      },
      { status: 500 }
    );
  }
}
