import { NextRequest, NextResponse } from "next/server";
import { BASE_API_URL } from "@/lib/api/client";
import { parseAuthCookiesServer } from "@/lib/server/auth-cookies";

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

    // Backend expects field names with _id suffix
    const backendPayload = {
      class_id: classId,
      subject_id: subject,
      term_id: term,
      week_id: week,
    };

    const response = await fetch(
      `${BASE_API_URL}/superadmin/lessons/lessons`,
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth.token}`,
        },
        body: JSON.stringify(backendPayload),
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
