import { NextRequest, NextResponse } from "next/server";

import { parseAuthCookiesServer } from "@/lib/server/auth-cookies";

const BASE = process.env.NEXT_PUBLIC_API_URL || "https://fastlearnersapp.com/api/v1";
const REQUEST_TIMEOUT = 7000; // 7 seconds

export async function GET(req: NextRequest) {
  const auth = parseAuthCookiesServer(req);
  if (!auth) {
    return NextResponse.json(
      {
        success: false,
        code: "NO_AUTH_COOKIES",
        message: "No authentication cookies found",
        user: null,
      },
      { status: 401 },
    );
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);

    const r = await fetch(`${BASE}/profile`, {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${auth.token}`,
      },
      cache: "no-store",
      signal: controller.signal,
    });

    clearTimeout(timeoutId);
    const data = await r.json();

    if (!r.ok) {
      // Determine error code based on response
      let code = "UNAUTHORIZED";
      if (r.status === 401) {
        code = "TOKEN_EXPIRED";
      } else if (r.status === 403) {
        code = "FORBIDDEN";
      }

      return NextResponse.json(
        {
          success: false,
          code,
          message: data?.message || "Unauthorized",
          user: null,
        },
        { status: r.status },
      );
    }

    return NextResponse.json(
      {
        success: true,
        code: "OK",
        message: "Session valid",
        user: data?.content?.user || null,
      },
      { status: 200 },
    );
  } catch (e: any) {
    // Handle timeout
    if (e.name === "AbortError") {
      return NextResponse.json(
        {
          success: false,
          code: "UPSTREAM_TIMEOUT",
          message: "Request to authentication service timed out",
          user: null,
        },
        { status: 504 },
      );
    }

    return NextResponse.json(
      {
        success: false,
        code: "SESSION_FETCH_FAILED",
        message: e?.message || "Session fetch failed",
        user: null,
      },
      { status: 500 },
    );
  }
}