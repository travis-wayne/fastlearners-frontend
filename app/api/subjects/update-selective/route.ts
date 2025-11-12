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
    let validationErrors: Record<string, string> = {};

    if (contentType.includes("multipart/form-data") || contentType.includes("application/x-www-form-urlencoded")) {
      // Handle FormData format
      const incomingFormData = await req.formData();
      const subjectsArray = incomingFormData.getAll("subjects[]");
      
      if (subjectsArray.length === 0) {
        validationErrors.subjects = "subjects array is required";
      } else {
        subjectIds = subjectsArray
          .map((id) => {
            const numId = typeof id === "string" ? parseInt(id, 10) : Number(id);
            return Number.isNaN(numId) ? null : numId;
          })
          .filter((id): id is number => id !== null && id > 0 && Number.isInteger(id));
        
        if (subjectIds.length === 0) {
          validationErrors.subjects = "subjects array must contain at least one valid positive integer";
        }
      }
    } else {
      // Handle JSON format
      try {
        const body = await req.json();
        const { subjects } = body;
        
        if (!subjects) {
          validationErrors.subjects = "subjects field is required";
        } else if (!Array.isArray(subjects)) {
          validationErrors.subjects = "subjects must be an array";
        } else if (subjects.length === 0) {
          validationErrors.subjects = "subjects array cannot be empty";
        } else {
          subjectIds = subjects
            .map((id: any) => {
              if (id == null || id === undefined) return null;
              const numId = typeof id === "string" ? parseInt(id, 10) : Number(id);
              return Number.isNaN(numId) ? null : numId;
            })
            .filter((id): id is number => id !== null && id > 0 && Number.isInteger(id));
          
          if (subjectIds.length === 0) {
            validationErrors.subjects = "subjects array must contain at least one valid positive integer";
          } else if (subjectIds.length !== subjects.length) {
            validationErrors.subjects = `subjects array contains invalid values. ${subjects.length - subjectIds.length} invalid value(s) filtered out`;
          }
        }
      } catch (jsonError) {
        validationErrors.body = "Invalid JSON in request body";
      }
    }

    // Return 422 Unprocessable Entity for validation errors
    if (Object.keys(validationErrors).length > 0 || !Array.isArray(subjectIds) || subjectIds.length === 0) {
      if (process.env.NEXT_PUBLIC_DEBUG_AUTH === "true") {
        console.error("[update-selective] Validation failed:", {
          validationErrors,
          subjectIds,
          receivedSubjects: contentType.includes("multipart") 
            ? "FormData" 
            : "JSON (check body)",
        });
      }
      return NextResponse.json(
        {
          success: false,
          message: "Validation failed: " + (Object.values(validationErrors)[0] || "subjects array is required"),
          content: null,
          code: 422,
          requestId,
          errors: validationErrors,
        },
        { status: 422 }
      );
    }

    // Log successful validation for debugging
    if (process.env.NEXT_PUBLIC_DEBUG_AUTH === "true") {
      console.log("[update-selective] Validation passed:", {
        subjectIdsCount: subjectIds.length,
        subjectIds,
        requestId,
      });
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
        // Log upstream error details for debugging
        if (process.env.NEXT_PUBLIC_DEBUG_AUTH === "true") {
          console.error("[update-selective] Upstream API error:", {
            status: upstream.status,
            statusText: upstream.statusText,
            data,
            requestId,
            sentSubjectIds: subjectIds,
          });
        }
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

