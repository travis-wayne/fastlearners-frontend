import { NextRequest, NextResponse } from "next/server";
import { parseAuthCookiesServer } from "@/lib/server/auth-cookies";
import { UPSTREAM_BASE } from "@/lib/api/client";
import { handleUpstreamError, handleApiError, createErrorResponse } from "@/lib/api/error-handler";

export async function GET(req: NextRequest) {
  const auth = parseAuthCookiesServer(req);
  if (!auth) {
    return createErrorResponse("Unauthorized", 401);
  }

  const requestId = crypto.randomUUID();

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);

    try {
      const r = await fetch(`${UPSTREAM_BASE}/guardian`, {
        method: "GET",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${auth.token}`,
        },
        cache: "no-store",
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      // Check if response is JSON
      const contentType = r.headers.get("content-type");
      let data: any = null;
      if (contentType && contentType.includes("application/json")) {
        try {
          data = await r.json();
        } catch (e) {
          console.error(`[API] Failed to parse JSON from ${r.url}:`, e);
        }
      }

      if (!r.ok) {
        return handleUpstreamError(r, data, requestId);
      }

      return NextResponse.json(data, { status: 200 });
    } catch (fetchError: any) {
      clearTimeout(timeoutId);
      
      if (fetchError.name === 'AbortError' || fetchError.message?.includes('fetch')) {
        try {
          const retryR = await fetch(`${UPSTREAM_BASE}/guardian`, {
            method: "GET",
            headers: {
              Accept: "application/json",
              Authorization: `Bearer ${auth.token}`,
            },
            cache: "no-store",
          });

          // Check if response is JSON
          const retryContentType = retryR.headers.get("content-type");
          let retryData: any = null;
          if (retryContentType && retryContentType.includes("application/json")) {
            try {
              retryData = await retryR.json();
            } catch (e) {
              console.error(`[API] Failed to parse JSON from ${retryR.url}:`, e);
            }
          }
          
          if (!retryR.ok) {
            return handleUpstreamError(retryR, retryData, requestId);
          }

          return NextResponse.json(retryData, { status: 200 });
        } catch (retryError) {
          return handleApiError(retryError, "Network error: Failed to fetch guardian dashboard after retry", requestId);
        }
      }
      
      throw fetchError;
    }
  } catch (e: any) {
    return handleApiError(e, "Failed to fetch guardian dashboard", requestId);
  }
}
