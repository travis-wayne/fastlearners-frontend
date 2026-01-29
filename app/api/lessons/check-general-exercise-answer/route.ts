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
    
    // Debug logging (only in development)
    if (process.env.NODE_ENV === 'development') {
      console.log('[check-general-exercise-answer] Request:', {
        body,
        bodyTypes: {
          general_exercise_id: typeof body.general_exercise_id,
          answer: typeof body.answer
        },
        requestId,
        upstreamUrl: `${UPSTREAM_BASE}/lessons/check-general-exercise-answer`,
        hasAuth: !!auth,
      });
    }

    // Validation
    if (!body.general_exercise_id || typeof body.general_exercise_id !== 'number' || body.general_exercise_id <= 0) {
      return createErrorResponse("Invalid general exercise ID", 422, undefined, requestId);
    }

    if (!body.answer || typeof body.answer !== 'string' || !/^[A-Z]$/.test(body.answer)) {
      return createErrorResponse("Answer must be a single uppercase letter", 422, undefined, requestId);
    }
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000); // 15s timeout

    try {
      const upstream = await fetch(
        `${UPSTREAM_BASE}/lessons/check-general-exercise-answer`,
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${auth.token}`,
          },
          body: JSON.stringify(body),
          cache: "no-store",
          signal: controller.signal,
        }
      );

      clearTimeout(timeoutId);
      const data = await upstream.json();

      // Debug logging for upstream response
      if (process.env.NODE_ENV === 'development') {
        console.log('[check-general-exercise-answer] Upstream Response:', {
          status: upstream.status,
          statusText: upstream.statusText,
          data,
        });
      }

      if (!upstream.ok) {
        if (process.env.NODE_ENV === 'development') {
          console.log('[check-general-exercise-answer] Returning error to client:', {
            status: upstream.status,
            data
          });
        }
        return handleUpstreamError(upstream, data, requestId);
      }

      return NextResponse.json(data, { status: upstream.status });
    } catch (fetchError: any) {
      clearTimeout(timeoutId);
      
      // Retry on network errors
      if (fetchError.name === 'AbortError' || fetchError.message?.includes('fetch')) {
        try {
          const retryUpstream = await fetch(
            `${UPSTREAM_BASE}/lessons/check-general-exercise-answer`,
            {
              method: "POST",
              headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                Authorization: `Bearer ${auth.token}`,
              },
              body: JSON.stringify(body),
              cache: "no-store",
            }
          );

          const retryData = await retryUpstream.json();
          
          if (!retryUpstream.ok) {
            return handleUpstreamError(retryUpstream, retryData, requestId);
          }

          return NextResponse.json(retryData, { status: retryUpstream.status });
        } catch (retryError) {
          return handleApiError(retryError, "Network error: Failed to check general exercise answer after retry", requestId);
        }
      }
      
      throw fetchError;
    }
  } catch (err: any) {
    return handleApiError(err, "Failed to check general exercise answer", requestId);
  }
}
