import { NextRequest, NextResponse } from "next/server";
import { BASE_API_URL } from "@/lib/api/client";
import { parseAuthCookiesServer } from "@/lib/server/auth-cookies";
import { handleApiError } from "@/lib/api/error-handler";

/**
 * GET /api/superadmin/uploads/stats
 * 
 * Proxy endpoint for fetching upload statistics.
 * 
 * BACKEND ACTIVATION INSTRUCTIONS:
 * ================================
 * When the backend endpoint is ready at ${BASE_API_URL}/superadmin/uploads/stats:
 * 
 * 1. Comment out or remove the "TODO: Remove this" block below (lines 28-37)
 * 2. Uncomment the "Uncomment when backend is ready" block (lines 39-54)
 * 3. Test by navigating to /dashboard/superadmin/manage as a superadmin user
 * 4. Verify that upload stats appear in the summary cards
 * 
 * Expected backend response format:
 * {
 *   "success": true,
 *   "content": {
 *     "totalUploads": number,
 *     "successfulUploads": number,
 *     "failedUploads": number,
 *     "conflictCount": number,
 *     "lastUploadAt": string (ISO date)
 *   },
 *   "code": 200,
 *   "message": string
 * }
 */
export async function GET(req: NextRequest) {
  const auth = parseAuthCookiesServer(req);
  if (!auth) {
    return NextResponse.json(
      { success: false, message: "Unauthorized", content: null, code: 401 },
      { status: 401 }
    );
  }

  try {
    // TODO: Remove this block once backend endpoint is available
    return NextResponse.json(
      {
        success: false,
        message: "Upload statistics endpoint not yet implemented on backend",
        content: null,
        code: 501,
      },
      { status: 501 }
    );

    /* Uncomment when backend is ready:
    const response = await fetch(
      `${BASE_API_URL}/superadmin/uploads/stats`,
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
    */
  } catch (err: any) {
    return handleApiError(err, "Error fetching upload statistics");
  }
}
