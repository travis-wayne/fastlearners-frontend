import { NextRequest, NextResponse } from "next/server";

import { parseAuthCookiesServer } from "@/lib/server/auth-cookies";

const BASE = process.env.NEXT_PUBLIC_API_URL || "https://fastlearnersapp.com/api/v1";
const REQUEST_TIMEOUT = 7000; // 7 seconds

/**
 * Fetches user session data from the backend API.
 * This route retrieves the authenticated user's profile information, including the full user object with role details.
 * It is primarily used by client-side components to obtain session data; middleware calls the backend directly instead.
 * The request has a 7-second timeout to balance responsiveness with allowing sufficient time for backend processing.
 *
 * @param req - The NextRequest object containing the request details.
 * @returns A NextResponse with session data or error information.
 *
 * Response structure:
 * - `OK`: Session is valid, returns user object.
 * - `NO_AUTH_COOKIES`: No authentication cookies found.
 * - `TOKEN_EXPIRED`: Authentication token has expired.
 * - `FORBIDDEN`: Access is forbidden.
 * - `UPSTREAM_TIMEOUT`: Request to backend timed out after 7 seconds.
 * - `SESSION_FETCH_FAILED`: General failure in fetching session data.
 */
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