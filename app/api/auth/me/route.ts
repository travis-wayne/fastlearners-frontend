import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

const BASE_API_URL = process.env.NEXT_PUBLIC_API_URL || "https://fastlearnersapp.com/api/v1";

/**
 * GET /api/auth/me
 * Fetches the current authenticated user from the backend
 * Requires auth_token cookie
 */
export async function GET(req: NextRequest) {
  try {
    // Get auth token from cookie
    const jar = await cookies();
    const authToken = jar.get("auth_token")?.value;

    if (!authToken) {
      return NextResponse.json(
        {
          success: false,
          message: "Not authenticated",
          code: 401,
        },
        { status: 401 }
      );
    }

    // Call backend /profile endpoint
    const backendResponse = await fetch(`${BASE_API_URL}/profile`, {
      method: "GET",
      headers: {
        "Accept": "application/json",
        "Authorization": `Bearer ${authToken}`,
      },
    });

    const apiRes = await backendResponse.json();

    if (!backendResponse.ok) {
      return NextResponse.json(
        {
          success: false,
          message: apiRes.message || "Failed to fetch user profile",
          code: backendResponse.status,
        },
        { status: backendResponse.status }
      );
    }

    // Return user data (backend returns: {success, message, content: {user}, code})
    return NextResponse.json({
      success: true,
      message: apiRes.message || "Profile fetched successfully",
      user: apiRes.content?.user || null,
      code: 200,
    });

  } catch (error: any) {
    console.error("[Auth Me Route] Unexpected error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch user profile",
        code: 500,
      },
      { status: 500 }
    );
  }
}
