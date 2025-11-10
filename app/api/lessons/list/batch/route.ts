// app/api/lessons/list/batch/route.ts - Batch endpoint for fetching lessons across multiple subjects
// Currently uses mock data. See docs/API_ENDPOINTS.md for backend implementation guide.

import { NextRequest, NextResponse } from "next/server";
import { parseAuthCookiesServer } from "@/lib/server/auth-cookies";
import { UPSTREAM_BASE } from "@/lib/api/client";
import { handleUpstreamError, handleApiError, createErrorResponse } from "@/lib/api/error-handler";

// Use mock data flag (set to false when backend is ready)
const USE_MOCK_DATA = false;

export async function POST(req: NextRequest) {
  const auth = parseAuthCookiesServer(req);
  if (!auth) {
    return createErrorResponse("Unauthorized", 401);
  }

  const requestId = crypto.randomUUID();

  try {
    const body = await req.json();
    const { class: classId, subject_ids, term, week } = body;

    if (!Array.isArray(subject_ids) || subject_ids.length === 0) {
      return createErrorResponse("Invalid request: subject_ids array is required", 400, undefined, requestId);
    }

    // Backend implementation
    // This endpoint accepts an array of subject_ids and returns aggregated lessons
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);

    try {
      const upstream = await fetch(`${UPSTREAM_BASE}/lessons/list/batch`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth.token}`,
        },
        body: JSON.stringify({
          class: classId,
          subject_ids,
          term,
          week,
        }),
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
          const retryUpstream = await fetch(`${UPSTREAM_BASE}/lessons/list/batch`, {
            method: "POST",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
              Authorization: `Bearer ${auth.token}`,
            },
            body: JSON.stringify({
              class: classId,
              subject_ids,
              term,
              week,
            }),
            cache: "no-store",
          });

          const retryData = await retryUpstream.json();
          
          if (!retryUpstream.ok) {
            return handleUpstreamError(retryUpstream, retryData, requestId);
          }

          return NextResponse.json(retryData, { status: retryUpstream.status });
        } catch (retryError) {
          return handleApiError(retryError, "Network error: Failed to fetch lessons batch after retry", requestId);
        }
      }
      
      throw fetchError;
    }
  } catch (err: any) {
    return handleApiError(err, "Failed to fetch lessons batch", requestId);
  }
}

