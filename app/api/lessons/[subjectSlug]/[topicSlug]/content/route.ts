import { NextRequest, NextResponse } from "next/server";
import { parseAuthCookiesServer } from "@/lib/server/auth-cookies";
import { UPSTREAM_BASE } from "@/lib/api/client";
import { handleUpstreamError, handleApiError, createErrorResponse } from "@/lib/api/error-handler";

export async function GET(
  req: NextRequest,
  { params }: { params: { subjectSlug: string; topicSlug: string } }
) {
  const auth = parseAuthCookiesServer(req);
  if (!auth) {
    return createErrorResponse("Unauthorized", 401);
  }

  const requestId = crypto.randomUUID();

  try {
    const { subjectSlug, topicSlug } = params;

    if (!subjectSlug || !topicSlug) {
      return createErrorResponse("Invalid request: subjectSlug and topicSlug are required", 400, undefined, requestId);
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000); // 15s timeout

    try {
      const upstream = await fetch(
        `${UPSTREAM_BASE}/lessons/${subjectSlug}/${topicSlug}/content`,
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

      // Normalize response shape: map data.content.lesson to content
      const normalizedData = {
        ...data,
        content: data.content?.lesson || data.content,
      };

      return NextResponse.json(normalizedData, { status: upstream.status });
    } catch (fetchError: any) {
      clearTimeout(timeoutId);
      
      // Retry on network errors
      if (fetchError.name === 'AbortError' || fetchError.message?.includes('fetch')) {
        try {
          const retryUpstream = await fetch(
            `${UPSTREAM_BASE}/lessons/${subjectSlug}/${topicSlug}/content`,
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

          // Normalize response shape: map retryData.content.lesson to content
          const normalizedRetryData = {
            ...retryData,
            content: retryData.content?.lesson || retryData.content,
          };

          return NextResponse.json(normalizedRetryData, { status: retryUpstream.status });
        } catch (retryError) {
          return handleApiError(retryError, "Network error: Failed to fetch lesson content after retry", requestId);
        }
      }
      
      throw fetchError;
    }
  } catch (err: any) {
    return handleApiError(err, "Failed to fetch lesson content", requestId);
  }
}