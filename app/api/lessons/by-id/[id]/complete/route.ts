// app/api/lessons/by-id/[id]/complete/route.ts - Mark lesson as complete
// Moved from [id]/complete to avoid routing conflict with [subjectSlug]
// Currently uses mock data. See docs/API_ENDPOINTS.md for backend implementation guide.

import { NextRequest, NextResponse } from "next/server";
import { parseAuthCookiesServer } from "@/lib/server/auth-cookies";
import { UPSTREAM_BASE } from "@/lib/api/client";
import { handleUpstreamError, handleApiError, createErrorResponse } from "@/lib/api/error-handler";

// Use mock data flag (set to false when backend is ready)
const USE_MOCK_DATA = false;

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const auth = parseAuthCookiesServer(req);
  if (!auth) {
    return createErrorResponse("Unauthorized", 401);
  }

  const requestId = crypto.randomUUID();

  try {
    const lessonId = params.id;

    if (!lessonId) {
      return createErrorResponse("Invalid request: lesson ID is required", 400, undefined, requestId);
    }

    // Backend implementation
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);

    try {
      const upstream = await fetch(`${UPSTREAM_BASE}/lessons/${lessonId}/complete`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth.token}`,
        },
        cache: "no-store",
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      const data = await upstream.json();

      if (!upstream.ok) {
        return handleUpstreamError(upstream, data, requestId);
      }

      return NextResponse.json(data, { status: upstream.status });
    } catch (fetchError: any) {
      clearTimeout(timeoutId);
      
      if (fetchError.name === 'AbortError' || fetchError.message?.includes('fetch')) {
        try {
          const retryUpstream = await fetch(`${UPSTREAM_BASE}/lessons/${lessonId}/complete`, {
            method: "POST",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
              Authorization: `Bearer ${auth.token}`,
            },
            cache: "no-store",
          });

          const retryData = await retryUpstream.json();
          
          if (!retryUpstream.ok) {
            return handleUpstreamError(retryUpstream, retryData, requestId);
          }

          return NextResponse.json(retryData, { status: retryUpstream.status });
        } catch (retryError) {
          return handleApiError(retryError, "Network error: Failed to mark lesson complete after retry", requestId);
        }
      }
      
      throw fetchError;
    }
  } catch (err: any) {
    return handleApiError(err, "Failed to mark lesson as complete", requestId);
  }
}

