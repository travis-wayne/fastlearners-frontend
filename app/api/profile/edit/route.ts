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
    
    // If only partial updates are provided (e.g., just class/discipline),
    // fetch current profile first to merge and send complete payload
    const hasOnlyAcademicFields = body.class !== undefined && 
      Object.keys(body).filter(k => !['class', 'discipline', 'term'].includes(k)).length === 0;
    
    let updateData = body;
    
    if (hasOnlyAcademicFields) {
      // Fetch current profile to merge
      try {
        const profileResponse = await fetch(`${UPSTREAM_BASE}/profile`, {
          method: "GET",
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${auth.token}`,
          },
          cache: "no-store",
        });

        if (profileResponse.ok) {
          const profileData = await profileResponse.json();
          if (profileData.content?.user) {
            // Merge current profile with updates
            updateData = {
              ...profileData.content.user,
              ...body,
            };
            
            // Only forward role if it's explicitly provided in the request body
            // Preserve existing role without coercion
            if (!body.role) {
              // Keep existing role from profile
              updateData.role = profileData.content.user.role;
            }
            
          }
        }
      } catch (profileError) {
        // If profile fetch fails, proceed with partial update
        // Backend validation will catch any issues
        if (process.env.NEXT_PUBLIC_DEBUG_AUTH === "true") {
          console.warn("Failed to fetch current profile for merge:", profileError);
        }
      }
    }
    
    // Always remove discipline for non-SSS classes (outside hasOnlyAcademicFields path)
    if (updateData.class && !updateData.class.startsWith('SSS')) {
      delete updateData.discipline;
    }
    
    // Validate discipline if provided
    if (updateData.discipline) {
      const validDisciplines = ['Art', 'Commercial', 'Science'];
      if (!validDisciplines.includes(updateData.discipline)) {
        return NextResponse.json(
          {
            success: false,
            message: `Invalid discipline. Must be one of: ${validDisciplines.join(', ')}`,
            errors: {
              discipline: [`Discipline must be one of: ${validDisciplines.join(', ')}`],
            },
            requestId,
          },
          { status: 422 }
        );
      }
    }

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
          message: data?.message || "Profile updated successfully",
          content: {
            user: data?.content?.user || null,
          },
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
              message: retryData?.message || "Profile updated successfully",
              content: {
                user: retryData?.content?.user || null,
              },
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

