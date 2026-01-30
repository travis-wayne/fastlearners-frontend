import { NextRequest, NextResponse } from "next/server";
import { parseAuthCookiesServer } from "@/lib/server/auth-cookies";
import { UPSTREAM_BASE } from "@/lib/api/client";
import { handleUpstreamError, handleApiError, createErrorResponse } from "@/lib/api/error-handler";

export async function GET(
  req: NextRequest,
  { params }: { params: { lessonId: string } }
) {
  const auth = parseAuthCookiesServer(req);
  if (!auth) {
    return createErrorResponse("Unauthorized", 401);
  }

  const requestId = crypto.randomUUID();

  try {
    const { lessonId } = params;

    if (!lessonId) {
      return createErrorResponse("Invalid request: lessonId is required", 400, undefined, requestId);
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000); // 15s timeout

    try {
      // Match API docs: uses singular 'lesson'
      const upstream = await fetch(
        `${UPSTREAM_BASE}/lessons/scores/lessons/${lessonId}`,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${auth.token}`,
          },
          cache: "no-store",
          signal: controller.signal,
        }
      );

      clearTimeout(timeoutId);
      const data = await upstream.json();

      if (!upstream.ok) {
        return handleUpstreamError(upstream, data, requestId);
      }

      return NextResponse.json(data, { status: upstream.status });
    } catch (fetchError: any) {
      clearTimeout(timeoutId);
      
      // Retry on network errors
      if (fetchError.name === 'AbortError' || fetchError.message?.includes('fetch')) {
        try {
          const retryUpstream = await fetch(
            `${UPSTREAM_BASE}/lessons/scores/lessons/${lessonId}`,
            {
              method: "GET",
              headers: {
                Accept: "application/json",
                Authorization: `Bearer ${auth.token}`,
              },
              cache: "no-store",
            }
          );

          const retryData = await retryUpstream.json();
          
          if (!retryUpstream.ok) {
            return handleUpstreamError(retryUpstream, retryData, requestId);
          }

          return NextResponse.json(retryData, { status: retryUpstream.status });
        } catch (retryError) {
          return handleApiError(retryError, "Network error: Failed to fetch lesson score after retry", requestId);
        }
      }
      
      throw fetchError;
    }
  } catch (err: any) {
    return handleApiError(err, "Failed to fetch lesson score", requestId);
  }
}
