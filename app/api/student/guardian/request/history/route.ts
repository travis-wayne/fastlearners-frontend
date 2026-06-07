import { NextRequest, NextResponse } from "next/server";

import { UPSTREAM_BASE } from "@/lib/api/client";
import {
  createErrorResponse,
  handleApiError,
  handleUpstreamError,
} from "@/lib/api/error-handler";
import { parseAuthCookiesServer } from "@/lib/server/auth-cookies";

export async function GET(req: NextRequest) {
  const auth = parseAuthCookiesServer(req);
  if (!auth) {
    return createErrorResponse("Unauthorized", 401);
  }

  const requestId = crypto.randomUUID();

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000); // 15s timeout

    try {
      const upstream = await fetch(
        `${UPSTREAM_BASE}/student/guardian/request/history`,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${auth.token}`,
          },
          cache: "no-store",
          signal: controller.signal,
        },
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

      if (upstream.ok && data === null) {
        return NextResponse.json({
          success: true,
          message: "No guardian history found",
          content: { history: { request_history: [], links: {}, meta: {} } },
          code: 200,
        });
      }

      return NextResponse.json(data, { status: upstream.status });
    } catch (fetchError: any) {
      clearTimeout(timeoutId);

      // Retry on network errors
      if (
        fetchError.name === "AbortError" ||
        fetchError.message?.includes("fetch")
      ) {
        try {
          const retryUpstream = await fetch(
            `${UPSTREAM_BASE}/student/guardian/request/history`,
            {
              method: "GET",
              headers: {
                Accept: "application/json",
                Authorization: `Bearer ${auth.token}`,
              },
              cache: "no-store",
            },
          );

          // Check if response is JSON
          const retryContentType = retryUpstream.headers.get("content-type");
          let retryData: any = null;
          if (
            retryContentType &&
            retryContentType.includes("application/json")
          ) {
            try {
              retryData = await retryUpstream.json();
            } catch (e) {
              console.error(
                `[API] Failed to parse JSON from ${retryUpstream.url}:`,
                e,
              );
            }
          }

          if (!retryUpstream.ok) {
            return handleUpstreamError(retryUpstream, retryData, requestId);
          }

          if (retryUpstream.ok && retryData === null) {
            return NextResponse.json({
              success: true,
              message: "No guardian history found",
              content: { history: { request_history: [], links: {}, meta: {} } },
              code: 200,
            });
          }

          return NextResponse.json(retryData, { status: retryUpstream.status });
        } catch (retryError) {
          return handleApiError(
            retryError,
            "Network error: Failed to fetch student guardian history after retry",
            requestId,
          );
        }
      }

      throw fetchError;
    }
  } catch (err: any) {
    return handleApiError(
      err,
      "Failed to fetch student guardian history",
      requestId,
    );
  }
}
