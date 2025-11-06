import { NextRequest, NextResponse } from "next/server";

import { parseAuthCookiesServer } from "@/lib/server/auth-cookies";

const BASE = process.env.NEXT_PUBLIC_API_URL || "https://fastlearnersapp.com/api/v1";

export async function POST(req: NextRequest) {
  const auth = parseAuthCookiesServer(req);
  if (!auth) {
    return NextResponse.json(
      { success: false, message: "Unauthorized", user: null },
      { status: 401 }
    );
  }

  try {
    const body = await req.json();

    const r = await fetch(`${BASE}/profile/edit`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${auth.token}`,
      },
      body: JSON.stringify(body),
      cache: "no-store",
    });

    const data = await r.json();

    if (!r.ok) {
      return NextResponse.json(
        {
          success: false,
          message: data?.message || "Failed to update profile",
          errors: data?.errors || null,
        },
        { status: r.status }
      );
    }

    return NextResponse.json(
      {
        success: true,
        user: data?.content?.user || null,
        message: data?.message || "Profile updated successfully",
      },
      { status: 200 }
    );
  } catch (e: any) {
    return NextResponse.json(
      {
        success: false,
        message: e?.message || "Profile update failed",
        user: null,
      },
      { status: 500 }
    );
  }
}

