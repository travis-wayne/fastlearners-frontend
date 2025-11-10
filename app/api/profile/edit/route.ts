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
    
    // Ensure term is included if provided (backend should support this)
    // Note: If backend doesn't support term yet, it will be ignored
    const updateData = {
      ...body,
      // term is already included in body if provided by client
    };

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);

    try {
      const r = await fetch(`${UPSTREAM_BASE}/profile/edit`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth.token}`,
        },
        body: JSON.stringify(updateData),
        cache: "no-store",
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      const data = await r.json();

      if (!r.ok) {
        // Return validation errors if present
        if (data?.errors) {
          return NextResponse.json(
            {
              success: false,
              message: data?.message || "Failed to update profile",
              errors: data.errors,
              requestId,
            },
            { status: r.status }
          );
        }
        return handleUpstreamError(r, data, requestId);
      }

      return NextResponse.json(
        {
          success: true,
          user: data?.content?.user || null,
          message: data?.message || "Profile updated successfully",
        },
        { status: 200 }
      );
    } catch (fetchError: any) {
      clearTimeout(timeoutId);
      
      if (fetchError.name === 'AbortError' || fetchError.message?.includes('fetch')) {
        try {
          const retryR = await fetch(`${UPSTREAM_BASE}/profile/edit`, {
            method: "POST",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
              Authorization: `Bearer ${auth.token}`,
            },
            body: JSON.stringify(updateData),
            cache: "no-store",
          });

          const retryData = await retryR.json();
          
          if (!retryR.ok) {
            if (retryData?.errors) {
              return NextResponse.json(
                {
                  success: false,
                  message: retryData?.message || "Failed to update profile",
                  errors: retryData.errors,
                  requestId,
                },
                { status: retryR.status }
              );
            }
            return handleUpstreamError(retryR, retryData, requestId);
          }

          return NextResponse.json(
            {
              success: true,
              user: retryData?.content?.user || null,
              message: retryData?.message || "Profile updated successfully",
            },
            { status: 200 }
          );
        } catch (retryError) {
          return handleApiError(retryError, "Network error: Failed to update profile after retry", requestId);
        }
      }
      
      throw fetchError;
    }
  } catch (e: any) {
    return handleApiError(e, "Profile update failed", requestId);
  }
}

