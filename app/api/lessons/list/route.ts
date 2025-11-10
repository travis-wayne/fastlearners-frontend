import { NextRequest, NextResponse } from "next/server";
import { parseAuthCookiesServer } from "@/lib/server/auth-cookies";
import { UPSTREAM_BASE } from "@/lib/api/client";
import { handleUpstreamError, handleApiError, createErrorResponse } from "@/lib/api/error-handler";

export async function POST(req: NextRequest) {
  const auth = parseAuthCookiesServer(req);
  if (!auth) {
    return createErrorResponse("Unauthorized", 401);
  }

  const requestId = crypto.randomUUID();

  try {
    const body = await req.json();
    const { class: classId, subject, term, week, page } = body;

    // Use student-facing endpoint instead of superadmin endpoint
    // If student endpoint doesn't exist, this will need to be updated when backend provides it
    // For now, we use the lessons endpoint with proper authorization checks
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000); // 15s timeout

    try {
      const upstream = await fetch(`${UPSTREAM_BASE}/lessons/list`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth.token}`,
        },
        body: JSON.stringify({
          class: classId,
          subject,
          term,
          week,
          page,
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
      
      // Retry on network errors (idempotent POST)
      if (fetchError.name === 'AbortError' || fetchError.message?.includes('fetch')) {
        // Simple retry once for network errors
        try {
          const retryUpstream = await fetch(`${UPSTREAM_BASE}/lessons/list`, {
            method: "POST",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
              Authorization: `Bearer ${auth.token}`,
            },
            body: JSON.stringify({
              class: classId,
              subject,
              term,
              week,
              page,
            }),
            cache: "no-store",
          });

          const retryData = await retryUpstream.json();
          
          if (!retryUpstream.ok) {
            return handleUpstreamError(retryUpstream, retryData, requestId);
          }

          return NextResponse.json(retryData, { status: retryUpstream.status });
        } catch (retryError) {
          return handleApiError(retryError, "Network error: Failed to fetch lessons after retry", requestId);
        }
      }
      
      throw fetchError;
    }
  } catch (err: any) {
    return handleApiError(err, "Failed to fetch lessons list", requestId);
  }
}

