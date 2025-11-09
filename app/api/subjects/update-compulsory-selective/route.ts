import { NextRequest, NextResponse } from "next/server";
import { parseAuthCookiesServer } from "@/lib/server/auth-cookies";

const UPSTREAM_BASE = "https://fastlearnersapp.com/api/v1";

export async function POST(req: NextRequest) {
  const auth = parseAuthCookiesServer(req);
  if (!auth) {
    return NextResponse.json(
      { success: false, message: "Unauthorized", content: null, code: 401 },
      { status: 401 }
    );
  }

  try {
    const body = await req.json();
    const { subject } = body;

    if (!subject || typeof subject !== "number") {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid request: subject ID is required",
          content: null,
          code: 400,
        },
        { status: 400 }
      );
    }

    const upstream = await fetch(
      `${UPSTREAM_BASE}/subjects/update-compulsory-selective`,
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth.token}`,
        },
        body: JSON.stringify({ subject }),
        cache: "no-store",
      }
    );

    const data = await upstream.json();

    // Wrap upstream errors for security
    if (!upstream.ok) {
      // Log detailed error server-side
      if (process.env.NEXT_PUBLIC_DEBUG_AUTH === "true") {
        console.error("Update compulsory selective upstream error:", {
          status: upstream.status,
          data,
        });
      }

      // Return sanitized error response
      const requestId = crypto.randomUUID();
      return NextResponse.json(
        {
          success: false,
          message: data.message || "Failed to update compulsory selective",
          content: null,
          code: upstream.status,
          requestId, // For traceability
          // Include sanitized error code if available
          ...(data.code && { errorCode: data.code }),
        },
        { status: upstream.status }
      );
    }

    // Forward successful response
    return NextResponse.json(data, { status: upstream.status });
  } catch (err: any) {
    // Log detailed error server-side
    if (process.env.NEXT_PUBLIC_DEBUG_AUTH === "true") {
      console.error("Update compulsory selective error:", err);
    }
    
    const requestId = crypto.randomUUID();
    return NextResponse.json(
      {
        success: false,
        message: "An error occurred while updating compulsory selective",
        content: null,
        code: 500,
        requestId, // For traceability
      },
      { status: 500 }
    );
  }
}

