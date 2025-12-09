import { NextRequest, NextResponse } from "next/server";
import { BASE_API_URL } from "@/lib/api/client";
import { parseAuthCookiesServer } from "@/lib/server/auth-cookies";
import { handleApiError } from "@/lib/api/error-handler";

/**
 * GET /api/superadmin/uploads/list
 * 
 * Proxy endpoint for fetching upload history list.
 * Supports query parameters for filtering.
 * 
 * BACKEND ACTIVATION INSTRUCTIONS:
 * ================================
 * When the backend endpoint is ready at ${BASE_API_URL}/superadmin/uploads/list:
 * 
 * 1. Comment out or remove the "TODO: Remove this" block below (lines 31-40)
 * 2. Uncomment the "Uncomment when backend is ready" block (lines 42-62)
 * 3. Test by navigating to /dashboard/superadmin/manage as a superadmin user
 * 4. Verify that upload history appears in the table
 * 
 * Supported query parameters:
 * - page: number (pagination)
 * - perPage: number (items per page)
 * - status: "success" | "failed" | "pending"
 * - fileType: string
 * 
 * Expected backend response format:
 * {
 *   "success": true,
 *   "content": {
 *     "uploads": Array<{
 *       "id": number,
 *       "fileName": string,
 *       "fileType": string,
 *       "uploadedAt": string (ISO date),
 *       "uploadedBy": number,
 *       "status": "success" | "failed" | "pending",
 *       "recordCount": number,
 *       "conflictCount": number,
 *       "errorMessage"?: string
 *     }>,
 *     "total": number,
 *     "page": number,
 *     "perPage": number
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
        message: "Upload list endpoint not yet implemented on backend",
        content: null,
        code: 501,
      },
      { status: 501 }
    );

    /* Uncomment when backend is ready:
    const { searchParams } = new URL(req.url);
    const queryString = searchParams.toString();
    const url = queryString 
      ? `${BASE_API_URL}/superadmin/uploads/list?${queryString}`
      : `${BASE_API_URL}/superadmin/uploads/list`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${auth.token}`,
      },
      cache: "no-store",
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
    */
  } catch (err: any) {
    return handleApiError(err, "Error fetching upload list");
  }
}
