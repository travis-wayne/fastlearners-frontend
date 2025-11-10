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
    // Support both FormData and JSON formats
    const contentType = req.headers.get("content-type") || "";
    let subjectIds: number[] = [];

    if (contentType.includes("multipart/form-data") || contentType.includes("application/x-www-form-urlencoded")) {
      // Handle FormData format
      const formData = await req.formData();
      const subjectsArray = formData.getAll("subjects[]");
      subjectIds = subjectsArray.map((id) => {
        const numId = typeof id === "string" ? parseInt(id, 10) : Number(id);
        return Number.isNaN(numId) ? 0 : numId;
      }).filter((id) => id > 0);
    } else {
      // Handle JSON format
      const body = await req.json();
      const { subjects } = body;
      if (Array.isArray(subjects)) {
        subjectIds = subjects.map((id: any) => {
          const numId = typeof id === "string" ? parseInt(id, 10) : Number(id);
          return Number.isNaN(numId) ? 0 : numId;
        }).filter((id) => id > 0);
      }
    }

    if (!Array.isArray(subjectIds) || subjectIds.length === 0) {
      return createErrorResponse("Invalid request: subjects array is required", 400, undefined, requestId);
    }

    // Build form data as the upstream API expects subjects[] format
    const formData = new URLSearchParams();
    subjectIds.forEach((id: number) => {
      formData.append("subjects[]", String(id));
    });

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000); // 15s timeout

    try {
      const upstream = await fetch(`${UPSTREAM_BASE}/subjects/update-selective`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Bearer ${auth.token}`,
        },
        body: formData.toString(),
        cache: "no-store",
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      const data = await upstream.json();

      if (!upstream.ok) {
        return handleUpstreamError(upstream, data, requestId);
      }

      // Forward successful response
      return NextResponse.json(data, { status: upstream.status });
    } catch (fetchError: any) {
      clearTimeout(timeoutId);
      
      // Retry on network errors (idempotent POST)
      if (fetchError.name === 'AbortError' || fetchError.message?.includes('fetch')) {
        try {
          const retryUpstream = await fetch(`${UPSTREAM_BASE}/subjects/update-selective`, {
            method: "POST",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/x-www-form-urlencoded",
              Authorization: `Bearer ${auth.token}`,
            },
            body: formData.toString(),
            cache: "no-store",
          });

          const retryData = await retryUpstream.json();
          
          if (!retryUpstream.ok) {
            return handleUpstreamError(retryUpstream, retryData, requestId);
          }

          return NextResponse.json(retryData, { status: retryUpstream.status });
        } catch (retryError) {
          return handleApiError(retryError, "Network error: Failed to update selective subjects after retry", requestId);
        }
      }
      
      throw fetchError;
    }
  } catch (err: any) {
    return handleApiError(err, "An error occurred while updating selective subjects", requestId);
  }
}

