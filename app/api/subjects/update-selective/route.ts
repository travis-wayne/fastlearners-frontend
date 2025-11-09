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
    const { subjects } = body;

    if (!Array.isArray(subjects) || subjects.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid request: subjects array is required",
          content: null,
          code: 400,
        },
        { status: 400 }
      );
    }

    // Build form data as the API expects subjects[] format
    const formData = new URLSearchParams();
    subjects.forEach((id: number) => {
      formData.append("subjects[]", String(id));
    });

    const upstream = await fetch(`${UPSTREAM_BASE}/subjects/update-selective`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Bearer ${auth.token}`,
      },
      body: formData.toString(),
      cache: "no-store",
    });

    const data = await upstream.json();

    // Wrap upstream errors for security
    if (!upstream.ok) {
      // Log detailed error server-side
      if (process.env.NEXT_PUBLIC_DEBUG_AUTH === "true") {
        console.error("Update selective subjects upstream error:", {
          status: upstream.status,
          data,
        });
      }

      // Return sanitized error response
      const requestId = crypto.randomUUID();
      return NextResponse.json(
        {
          success: false,
          message: data.message || "Failed to update selective subjects",
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
      console.error("Update selective subjects error:", err);
    }
    
    const requestId = crypto.randomUUID();
    return NextResponse.json(
      {
        success: false,
        message: "An error occurred while updating selective subjects",
        content: null,
        code: 500,
        requestId, // For traceability
      },
      { status: 500 }
    );
  }
}

