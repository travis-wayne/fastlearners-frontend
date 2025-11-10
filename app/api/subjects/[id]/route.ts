// app/api/subjects/[id]/route.ts - Get subject detail with scheme of work and lessons
// Currently uses mock data. See docs/API_ENDPOINTS.md for backend implementation guide.

import { NextRequest, NextResponse } from "next/server";
import { parseAuthCookiesServer } from "@/lib/server/auth-cookies";
import { UPSTREAM_BASE } from "@/lib/api/client";
import { handleUpstreamError, handleApiError, createErrorResponse } from "@/lib/api/error-handler";
import { mockSubjectDetails } from "@/data/mock-lesson-data";

// Use mock data flag (set to false when backend is ready)
const USE_MOCK_DATA = true;

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const auth = parseAuthCookiesServer(req);
  if (!auth) {
    return createErrorResponse("Unauthorized", 401);
  }

  const requestId = crypto.randomUUID();

  try {
    const subjectId = params.id;

    if (!subjectId) {
      return createErrorResponse("Invalid request: subject ID is required", 400, undefined, requestId);
    }

    if (USE_MOCK_DATA) {
      // Return mock subject detail
      // In real implementation, this would fetch from backend
      const mockData = mockSubjectDetails[subjectId] || mockSubjectDetails["mathematics"];
      
      return NextResponse.json({
        success: true,
        message: "Subject detail fetched successfully (mock data)",
        content: mockData,
        code: 200,
      });
    }

    // Backend implementation (when ready)
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);

    try {
      // Validate subject is registered for user
      const subjectsResponse = await fetch(`${UPSTREAM_BASE}/subjects`, {
        method: "GET",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${auth.token}`,
        },
        cache: "no-store",
        signal: controller.signal,
      });

      if (!subjectsResponse.ok) {
        clearTimeout(timeoutId);
        const subjectsData = await subjectsResponse.json();
        return handleUpstreamError(subjectsResponse, subjectsData, requestId);
      }

      const subjectsData = await subjectsResponse.json();
      const allSubjects = [
        ...(subjectsData.content?.compulsory_selective || []),
        ...(subjectsData.content?.subjects || []),
        ...(subjectsData.content?.selective || []),
      ];
      
      const isRegistered = allSubjects.some((s: any) => String(s.id) === subjectId);
      
      if (!isRegistered) {
        clearTimeout(timeoutId);
        return createErrorResponse("Subject not registered or unauthorized", 403, undefined, requestId);
      }

      // Fetch subject detail
      const detailResponse = await fetch(`${UPSTREAM_BASE}/subjects/${subjectId}`, {
        method: "GET",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${auth.token}`,
        },
        cache: "no-store",
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      const detailData = await detailResponse.json();

      if (!detailResponse.ok) {
        return handleUpstreamError(detailResponse, detailData, requestId);
      }

      return NextResponse.json(detailData, { status: detailResponse.status });
    } catch (fetchError: any) {
      clearTimeout(timeoutId);
      
      if (fetchError.name === 'AbortError' || fetchError.message?.includes('fetch')) {
        try {
          const retryResponse = await fetch(`${UPSTREAM_BASE}/subjects/${subjectId}`, {
            method: "GET",
            headers: {
              Accept: "application/json",
              Authorization: `Bearer ${auth.token}`,
            },
            cache: "no-store",
          });

          const retryData = await retryResponse.json();
          
          if (!retryResponse.ok) {
            return handleUpstreamError(retryResponse, retryData, requestId);
          }

          return NextResponse.json(retryData, { status: retryResponse.status });
        } catch (retryError) {
          return handleApiError(retryError, "Network error: Failed to fetch subject detail after retry", requestId);
        }
      }
      
      throw fetchError;
    }
  } catch (err: any) {
    return handleApiError(err, "Failed to fetch subject detail", requestId);
  }
}

