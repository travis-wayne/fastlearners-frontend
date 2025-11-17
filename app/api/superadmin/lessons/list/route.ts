import { NextRequest, NextResponse } from "next/server";
import { parseAuthCookiesServer } from "@/lib/server/auth-cookies";

const UPSTREAM_BASE = "https://fastlearnersapp.com/api/v1";

// This endpoint only supports POST method (as per API docs: Post /api/v1/superadmin/lessons/lessons/)
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
    const { class: classId, subject, term, week } = body;

    // Validate required fields
    if (!classId || !subject || !term || !week) {
      return NextResponse.json(
        {
          success: false,
          message: "Validation failed.",
          errors: {
            class: !classId ? ["The class field is required."] : [],
            subject: !subject ? ["The subject field is required."] : [],
            term: !term ? ["The term field is required."] : [],
            week: !week ? ["The week field is required."] : [],
          },
          code: 422,
        },
        { status: 422 }
      );
    }

    const response = await fetch(
      `${UPSTREAM_BASE}/superadmin/lessons/lessons/`,
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth.token}`,
        },
        body: JSON.stringify({
          class: classId,
          subject,
          term,
          week,
        }),
        cache: "no-store",
      }
    );

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (err: any) {
    if (process.env.NEXT_PUBLIC_DEBUG_AUTH === "true") {
      console.error("Superadmin lessons list API error:", err);
    }
    return NextResponse.json(
      {
        success: false,
        message: err?.message || "An error occurred while fetching lessons",
        content: null,
        code: 500,
      },
      { status: 500 }
    );
  }
}

