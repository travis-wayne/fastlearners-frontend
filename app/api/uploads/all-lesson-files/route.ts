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
    const formData = await req.formData();

    // Validate required files
    const requiredFields = [
      "lessons_file",
      "concepts_file",
      "examples_file",
      "exercises_file",
      "general_exercises_file",
      "check_markers_file",
    ];

    const missingFiles = requiredFields.filter(
      (field) => !formData.get(field)
    );

    if (missingFiles.length > 0) {
      return NextResponse.json(
        {
          success: false,
          message: `Missing required files: ${missingFiles.join(", ")}`,
          content: null,
          code: 400,
        },
        { status: 400 }
      );
    }

    // Create new FormData for upstream with all files
    const upstreamFormData = new FormData();
    requiredFields.forEach((field) => {
      const file = formData.get(field) as File;
      if (file) {
        // Map check_markers_file to check_marker_file for API compatibility
        const upstreamField = field === "check_markers_file" ? "check_marker_file" : field;
        upstreamFormData.append(upstreamField, file);
      }
    });

    const upstream = await fetch(
      `${UPSTREAM_BASE}/superadmin/lessons/uploads/all-lesson-files`,
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
      console.error("Bulk lesson files upload API error:", err);
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

