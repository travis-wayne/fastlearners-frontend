import { NextRequest, NextResponse } from "next/server";
import { parseAuthCookiesServer } from "@/lib/server/auth-cookies";

const UPSTREAM_BASE = "https://fastlearnersapp.com/api/v1";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const auth = parseAuthCookiesServer(req);
  if (!auth) {
    return NextResponse.json(
      { success: false, message: "Unauthorized", content: null, code: 401 },
      { status: 401 }
    );
  }

  try {
    const id = params.id;
    if (!id || Number.isNaN(Number(id))) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid lesson ID",
          content: null,
          code: 400,
        },
        { status: 400 }
      );
    }

    const response = await fetch(
      `${UPSTREAM_BASE}/superadmin/lessons/lesson/${id}`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${auth.token}`,
        },
        cache: "no-store",
      }
    );

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (err: any) {
    if (process.env.NEXT_PUBLIC_DEBUG_AUTH === "true") {
      console.error("Superadmin lesson detail API error:", err);
    }
    return NextResponse.json(
      {
        success: false,
        message: err?.message || "An error occurred while fetching lesson",
        content: null,
        code: 500,
      },
      { status: 500 }
    );
  }
}

