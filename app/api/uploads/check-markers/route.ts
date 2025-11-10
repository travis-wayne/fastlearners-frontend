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
    const checkMarkersFile = formData.get("check_markers_file") as File;

    if (!checkMarkersFile) {
      return NextResponse.json(
        {
          success: false,
          message: "Missing check_markers_file",
          content: null,
          code: 400,
        },
        { status: 400 }
      );
    }

    // Create new FormData for upstream
    const upstreamFormData = new FormData();
    upstreamFormData.append("check_markers_file", checkMarkersFile);

    const upstream = await fetch(
      `${UPSTREAM_BASE}/superadmin/lessons/uploads/check-markers`,
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
      console.error("Check markers upload API error:", err);
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

