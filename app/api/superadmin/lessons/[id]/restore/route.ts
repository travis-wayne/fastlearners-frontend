import { NextRequest, NextResponse } from "next/server";
import { BASE_API_URL } from "@/lib/api/client";
import { parseAuthCookiesServer } from "@/lib/server/auth-cookies";
import { handleUpstreamError, handleApiError, createErrorResponse } from "@/lib/api/error-handler";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const auth = parseAuthCookiesServer(req);
  if (!auth) {
    return createErrorResponse("Unauthorized", 401);
  }

  const requestId = crypto.randomUUID();
  const lessonId = params.id;

  try {
    const response = await fetch(
      `${BASE_API_URL}/superadmin/lessons/lessons/${lessonId}/restore`,
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${auth.token}`,
        },
        cache: "no-store",
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return handleUpstreamError(response, data, requestId);
    }

    return NextResponse.json(data, { status: 200 });
  } catch (error: any) {
    return handleApiError(error, "Failed to restore lesson", requestId);
  }
}
