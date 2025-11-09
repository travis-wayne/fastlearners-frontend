import { NextRequest, NextResponse } from "next/server";
import { parseAuthCookiesServer } from "@/lib/server/auth-cookies";

const UPSTREAM_BASE = "https://fastlearnersapp.com/api/v1";

export async function GET(req: NextRequest) {
  const auth = parseAuthCookiesServer(req);
  if (!auth) {
    return NextResponse.json(
      { success: false, message: "Unauthorized", content: null, code: 401 },
      { status: 401 }
    );
  }

  try {
    const upstream = await fetch(`${UPSTREAM_BASE}/subjects`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${auth.token}`,
      },
      cache: "no-store",
    });

    const data = await upstream.json();

    // Wrap upstream errors for security
    if (!upstream.ok) {
      // Log detailed error server-side
      if (process.env.NEXT_PUBLIC_DEBUG_AUTH === "true") {
        console.error("Subjects API upstream error:", {
          status: upstream.status,
          data,
        });
      }

      // Return sanitized error response
      const requestId = crypto.randomUUID();
      return NextResponse.json(
        {
          success: false,
          message: data.message || "Failed to fetch subjects",
          content: null,
          code: upstream.status,
          requestId, // For traceability
        },
        { status: upstream.status }
      );
    }

    // Forward successful response
    return NextResponse.json(data, { status: upstream.status });
  } catch (err: any) {
    // Log detailed error server-side
    if (process.env.NEXT_PUBLIC_DEBUG_AUTH === "true") {
      console.error("Subjects API error:", err);
    }
    
    const requestId = crypto.randomUUID();
    return NextResponse.json(
      {
        success: false,
        message: "An error occurred while fetching subjects",
        content: null,
        code: 500,
        requestId, // For traceability
      },
      { status: 500 }
    );
  }
}

