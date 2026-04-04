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
    const { child_email } = body;

    if (!child_email) {
      return createErrorResponse("Invalid request: child_email is required", 400, undefined, requestId);
    }

    const payload = JSON.stringify({ child_email });
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000); // 15s timeout

    try {
      const upstream = await fetch(
        `${UPSTREAM_BASE}/guardian/children/request/new`,
        {
          method: "POST",
          headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
            "Authorization": `Bearer ${auth.token}`,
          },
          body: payload,
          cache: "no-store",
          signal: controller.signal,
        }
      );

      clearTimeout(timeoutId);

      // Check if response is JSON
      const contentType = upstream.headers.get("content-type");
      let data: any = null;
      if (contentType && contentType.includes("application/json")) {
        try {
          data = await upstream.json();
        } catch (e) {
          console.error(`[API] Failed to parse JSON from ${upstream.url}:`, e);
        }
      }

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
            `${UPSTREAM_BASE}/guardian/children/request/new`,
            {
              method: "POST",
              headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
                "Authorization": `Bearer ${auth.token}`,
              },
              body: payload,
              cache: "no-store",
            }
          );

          // Check if response is JSON
          const retryContentType = retryUpstream.headers.get("content-type");
          let retryData: any = null;
          if (retryContentType && retryContentType.includes("application/json")) {
            try {
              retryData = await retryUpstream.json();
            } catch (e) {
              console.error(`[API] Failed to parse JSON from ${retryUpstream.url}:`, e);
            }
          }
          
          if (!retryUpstream.ok) {
            return handleUpstreamError(retryUpstream, retryData, requestId);
          }

          return NextResponse.json(retryData, { status: retryUpstream.status });
        } catch (retryError) {
          return handleApiError(retryError, "Network error: Failed to send child request after retry", requestId);
        }
      }
      
      throw fetchError;
    }
  } catch (err: any) {
    return handleApiError(err, "Failed to send child request", requestId);
  }
}
