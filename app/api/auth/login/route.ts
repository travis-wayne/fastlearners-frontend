import { NextRequest, NextResponse } from "next/server";

import { setAuthCookiesServer } from "@/lib/server/auth-cookies";
import { LoginCredentials } from "@/lib/types/auth";

const BASE_API_URL = process.env.NEXT_PUBLIC_API_URL || "https://fastlearnersapp.com/api/v1";

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as LoginCredentials;
    
    // Validate required fields
    if (!body?.email_phone || !body?.password) {
      return NextResponse.json(
        { success: false, message: "Email and password are required", code: 422 },
        { status: 422 },
      );
    }

    // Call backend API directly (not through authApi client wrapper)
    const backendResponse = await fetch(`${BASE_API_URL}/login`, {
      method: "POST",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const apiRes = await backendResponse.json();

    // Handle error responses
    if (!backendResponse.ok) {
      // 401 - Invalid credentials OR inactive user
      if (backendResponse.status === 401) {
        // Check if user needs email verification
        if (apiRes.message?.toLowerCase().includes("inactive") || 
            apiRes.message?.toLowerCase().includes("not verified") ||
            apiRes.message?.toLowerCase().includes("verify")) {
          return NextResponse.json(
            {
              success: false,
              message: "Please verify your email to continue",
              code: 401,
              redirect: `/auth/verify-email?email=${encodeURIComponent(body.email_phone)}`,
            },
            { status: 401 }
          );
        }
        // Regular invalid credentials
        return NextResponse.json(
          {
            success: false,
            message: apiRes.message || "Invalid email or password",
            code: 401,
          },
          { status: 401 }
        );
      }

      // 400/403 - New/unverified user
      if (backendResponse.status === 400 || backendResponse.status === 403) {
        return NextResponse.json(
          {
            success: false,
            message: apiRes.message || "Please verify your email to continue",
            code: backendResponse.status,
            redirect: `/auth/verify-email?email=${encodeURIComponent(body.email_phone)}`,
          },
          { status: backendResponse.status }
        );
      }

      // 422 - Validation error
      if (backendResponse.status === 422) {
        return NextResponse.json(
          {
            success: false,
            message: apiRes.message || "Invalid input data",
            errors: apiRes.errors || {},
            code: 422,
          },
          { status: 422 }
        );
      }

      // 500 or other errors
      return NextResponse.json(
        {
          success: false,
          message: apiRes.message || "Something went wrong, please try again",
          code: backendResponse.status,
        },
        { status: backendResponse.status }
      );
    }

    // 200 OK - Success!
    if (!apiRes.success || !apiRes.content) {
      return NextResponse.json(
        { success: false, message: apiRes.message || "Login failed", code: 500 },
        { status: 500 },
      );
    }

    const { access_token, user } = apiRes.content;
    const expiresAt = Date.now() + 7 * 24 * 60 * 60 * 1000; // 7 days

    const res = NextResponse.json({ success: true, user });
    setAuthCookiesServer(res, { token: access_token, expiresAt });
    return res;
  } catch (e: any) {
    console.error("[Login Route] Unexpected error:", e);
    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong, please try again",
        code: 500,
      },
      { status: 500 },
    );
  }
}
