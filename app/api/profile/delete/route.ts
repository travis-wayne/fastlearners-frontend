import { NextRequest, NextResponse } from "next/server";
import { parseAuthCookiesServer } from "@/lib/server/auth-cookies";
import { UPSTREAM_BASE } from "@/lib/api/client";
import { handleUpstreamError, handleApiError, createErrorResponse } from "@/lib/api/error-handler";

export async function DELETE(req: NextRequest) {
  const auth = parseAuthCookiesServer(req);
  if (!auth) {
    return createErrorResponse("Unauthorized", 401);
  }

  const requestId = crypto.randomUUID();

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);

    try {
      const r = await fetch(`${UPSTREAM_BASE}/profile/delete`, {
        method: "DELETE",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${auth.token}`,
        },
        cache: "no-store",
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      
      let data = {};
      try {
        data = await r.json();
      } catch (err) {
        // Fallback if response is not valid JSON
      }

      if (!r.ok) {
        return handleUpstreamError(r, data, requestId);
      }

      return NextResponse.json(data, { status: r.status });
    } catch (fetchError: any) {
      clearTimeout(timeoutId);
      
      if (fetchError.name === 'AbortError' || fetchError.message?.includes('fetch')) {
        try {
          const retryR = await fetch(`${UPSTREAM_BASE}/profile/delete`, {
            method: "DELETE",
            headers: {
              Accept: "application/json",
              Authorization: `Bearer ${auth.token}`,
            },
            cache: "no-store",
          });

          let retryData = {};
          try {
            retryData = await retryR.json();
          } catch (err) {
            // Fallback if response is not valid JSON
          }
          
          if (!retryR.ok) {
            return handleUpstreamError(retryR, retryData, requestId);
          }

          return NextResponse.json(retryData, { status: retryR.status });
        } catch (retryError) {
          return handleApiError(retryError, "Network error: Failed to delete account after retry", requestId);
        }
      }
      
      throw fetchError;
    }
  } catch (e: any) {
    return handleApiError(e, "Delete account request failed", requestId);
  }
}
