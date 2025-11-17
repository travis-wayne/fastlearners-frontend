import { NextRequest, NextResponse } from "next/server";
import { parseAuthCookiesServer } from "@/lib/server/auth-cookies";
import { UPSTREAM_BASE } from "@/lib/api/client";
import { handleUpstreamError, handleApiError, createErrorResponse } from "@/lib/api/error-handler";
import { validateProfileEdit } from "@/lib/validation/profile-validation";

async function checkUsernameAvailability(
  username: string,
  token: string,
): Promise<{ available: boolean; message?: string }> {
  try {
    const response = await fetch(`${UPSTREAM_BASE}/profile/check-username`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ username }),
      cache: "no-store",
    });

    if (!response.ok) {
      // Endpoint might not exist upstream yet; fail open
      return { available: true };
    }

    const data = await response.json();

    if (data?.success === false) {
      return {
        available: false,
        message:
          data?.errors?.username?.[0] ||
          data?.message ||
          "Username already taken. Please choose another username.",
      };
    }

    if (data?.content?.available === false) {
      return {
        available: false,
        message:
          data?.content?.message ||
          data?.message ||
          "Username already taken. Please choose another username.",
      };
    }

    return { available: true };
  } catch (error) {
    if (process.env.NEXT_PUBLIC_DEBUG_AUTH === "true") {
      console.warn("[profile/edit] Username availability check skipped:", error);
    }
    return { available: true };
  }
}

export async function POST(req: NextRequest) {
  const auth = parseAuthCookiesServer(req);
  if (!auth) {
    return createErrorResponse("Unauthorized", 401);
  }

  const requestId = crypto.randomUUID();

  try {
    const body = await req.json();
    
    // Fetch current profile to get user role for validation
    let currentProfile: any = null;
    let userRole: string | null = null;
    
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
          currentProfile = profileData.content.user;
          // Extract role - handle both array and string formats
          const role = currentProfile.role;
          userRole = Array.isArray(role) ? role[0] : role;
        }
      }
    } catch (profileError) {
      // If profile fetch fails, proceed without role-based validation
      // Backend validation will catch any issues
      if (process.env.NEXT_PUBLIC_DEBUG_AUTH === "true") {
        console.warn("Failed to fetch current profile for validation:", profileError);
      }
    }
    
    // If only partial updates are provided (e.g., just class/discipline),
    // merge with current profile to send complete payload
    const hasOnlyAcademicFields = body.class !== undefined && 
      Object.keys(body).filter(k => !['class', 'discipline', 'term'].includes(k)).length === 0;
    
    let updateData = { ...body };
    
    // Don't merge role from current profile - validation will handle role checking
    // Only merge other fields if needed for academic-only updates
    if (hasOnlyAcademicFields && currentProfile) {
      // Merge current profile with updates, but exclude role
      const { role, ...profileWithoutRole } = currentProfile;
      updateData = {
        ...profileWithoutRole,
        ...body,
      };
    }
    
    // Remove role from updateData if it's not explicitly in body and user is not guest
    // This prevents accidentally sending role when it shouldn't be changed
    if (!body.role && currentProfile) {
      const currentRole = Array.isArray(currentProfile.role) ? currentProfile.role[0] : currentProfile.role;
      if (currentRole && currentRole !== 'guest') {
        // Role is already set and not guest - don't include it in update
        delete updateData.role;
      }
    }
    
    // Use centralized validation logic
    const validationResult = validateProfileEdit(currentProfile || {}, updateData);
    
    // If validation failed, return errors
    if (!validationResult.isValid) {
      // Determine appropriate status code based on error type
      let statusCode = 422;
      
      // Check for specific error types that should return different status codes
      if (validationResult.errors.role?.some(msg => msg.includes('already updated'))) {
        statusCode = 401;
      } else if (validationResult.errors.class?.some(msg => msg.includes('already updated'))) {
        statusCode = 400;
      } else if (validationResult.errors.discipline?.some(msg => msg.includes('already updated'))) {
        statusCode = 401;
      } else if (validationResult.errors.discipline?.some(msg => msg.includes('SSS class'))) {
        statusCode = 400;
      } else if (validationResult.errors.username?.some(msg => msg.includes('already updated'))) {
        statusCode = 401;
      } else if (validationResult.errors.date_of_birth?.some(msg => msg.includes('already updated'))) {
        statusCode = 401;
      } else if (validationResult.errors.gender?.some(msg => msg.includes('already updated'))) {
        statusCode = 401;
      }
      
      return NextResponse.json(
        {
          success: false,
          message: statusCode === 422 
            ? "Validation failed." 
            : Object.values(validationResult.errors)[0]?.[0] || "Validation failed.",
          errors: validationResult.errors,
          requestId,
        },
        { status: statusCode }
      );
    }
    
    // Use cleaned data from validation
    updateData = validationResult.cleanedData;

    const requestedUsername =
      typeof updateData.username === "string"
        ? updateData.username.trim()
        : undefined;

    if (
      requestedUsername &&
      (!currentProfile?.username ||
        requestedUsername.toLowerCase() !==
          currentProfile.username.toLowerCase())
    ) {
      const availability = await checkUsernameAvailability(
        requestedUsername,
        auth.token,
      );
      if (!availability.available) {
        return NextResponse.json(
          {
            success: false,
            message:
              availability.message ||
              "Username already taken. Please choose another username.",
            errors: {
              username: [
                availability.message ||
                  "Username already taken. Please choose another username.",
              ],
            },
            requestId,
          },
          { status: 422 },
        );
      }
      updateData.username = requestedUsername;
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
        // Handle different error status codes according to API documentation
        if (r.status === 422 && data?.errors) {
          if (
            typeof data.message === "string" &&
            data.message.toLowerCase().includes("duplicate entry") &&
            data.message.includes("users_username_unique")
          ) {
            return NextResponse.json(
              {
                success: false,
                message: "Username already taken. Please choose another username.",
                errors: { username: ["This username is already in use."] },
                requestId,
              },
              { status: 422 },
            );
          }
          // Validation errors - return as-is with proper message
          return NextResponse.json(
            {
              success: false,
              message: data?.message || "Validation failed.",
              errors: data.errors,
              requestId,
            },
            { status: 422 }
          );
        }
        
        // Handle specific error messages from backend
        if (data?.message) {
          if (
            typeof data.message === "string" &&
            data.message.toLowerCase().includes("duplicate entry") &&
            data.message.includes("users_username_unique")
          ) {
            return NextResponse.json(
              {
                success: false,
                message: "Username already taken. Please choose another username.",
                errors: {
                  username: ["This username is already in use."],
                },
                requestId,
              },
              { status: 422 },
            );
          }

          // Check for specific error types and return appropriate status codes
          if (data.message.includes('Username already updated')) {
            return NextResponse.json(
              {
                success: false,
                message: "Username already updated and cannot be changed.",
                errors: null,
                requestId,
              },
              { status: 401 }
            );
          }
          
          if (data.message.includes('Role already updated')) {
            return NextResponse.json(
              {
                success: false,
                message: "Role already updated and cannot be changed. For further enquiries, please contact our support team.",
                errors: null,
                requestId,
              },
              { status: 401 }
            );
          }
          
          if (data.message.includes('Class already updated')) {
            return NextResponse.json(
              {
                success: false,
                message: "Class already updated. Make a request for class upgrade.",
                errors: null,
                requestId,
              },
              { status: 400 }
            );
          }
          
          if (data.message.includes('Discipline already updated')) {
            return NextResponse.json(
              {
                success: false,
                message: "Discipline already updated. For further enquiries, please contact our support team.",
                errors: null,
                requestId,
              },
              { status: 401 }
            );
          }
          
          if (data.message.includes('Gender already updated')) {
            return NextResponse.json(
              {
                success: false,
                message: "Gender already updated. For further enquiries, please contact our support team.",
                errors: null,
                requestId,
              },
              { status: 401 }
            );
          }
          
          if (data.message.includes('Date of birth already updated')) {
            return NextResponse.json(
              {
                success: false,
                message: "Date of birth already updated. For further enquiries, please contact our support team.",
                errors: null,
                requestId,
              },
              { status: 401 }
            );
          }
          
          if (data.message.includes('SSS class to choose a discipline')) {
            return NextResponse.json(
              {
                success: false,
                message: "You have to be in SSS class to choose a discipline!",
                errors: null,
                requestId,
              },
              { status: 400 }
            );
          }
        }
        
        // Return validation errors if present (for other status codes)
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
          // Handle errors same way as main request
          if (retryR.status === 422 && retryData?.errors) {
            if (
              typeof retryData.message === "string" &&
              retryData.message.toLowerCase().includes("duplicate entry") &&
              retryData.message.includes("users_username_unique")
            ) {
              return NextResponse.json(
                {
                  success: false,
                  message: "Username already taken. Please choose another username.",
                  errors: { username: ["This username is already in use."] },
                  requestId,
                },
                { status: 422 },
              );
            }
              return NextResponse.json(
                {
                  success: false,
                  message: retryData?.message || "Validation failed.",
                  errors: retryData.errors,
                  requestId,
                },
                { status: 422 }
              );
            }
            
            // Handle specific error messages
            if (retryData?.message) {
              if (
                typeof retryData.message === "string" &&
                retryData.message.toLowerCase().includes("duplicate entry") &&
                retryData.message.includes("users_username_unique")
              ) {
                return NextResponse.json(
                  {
                    success: false,
                    message: "Username already taken. Please choose another username.",
                    errors: {
                      username: ["This username is already in use."],
                    },
                    requestId,
                  },
                  { status: 422 },
                );
              }

              if (retryData.message.includes('Username already updated')) {
                return NextResponse.json(
                  { success: false, message: "Username already updated and cannot be changed.", errors: null, requestId },
                  { status: 401 }
                );
              }
              if (retryData.message.includes('Role already updated')) {
                return NextResponse.json(
                  { success: false, message: "Role already updated and cannot be changed. For further enquiries, please contact our support team.", errors: null, requestId },
                  { status: 401 }
                );
              }
              if (retryData.message.includes('Class already updated')) {
                return NextResponse.json(
                  { success: false, message: "Class already updated. Make a request for class upgrade.", errors: null, requestId },
                  { status: 400 }
                );
              }
              if (retryData.message.includes('Discipline already updated')) {
                return NextResponse.json(
                  { success: false, message: "Discipline already updated. For further enquiries, please contact our support team.", errors: null, requestId },
                  { status: 401 }
                );
              }
              if (retryData.message.includes('Gender already updated')) {
                return NextResponse.json(
                  { success: false, message: "Gender already updated. For further enquiries, please contact our support team.", errors: null, requestId },
                  { status: 401 }
                );
              }
              if (retryData.message.includes('Date of birth already updated')) {
                return NextResponse.json(
                  { success: false, message: "Date of birth already updated. For further enquiries, please contact our support team.", errors: null, requestId },
                  { status: 401 }
                );
              }
              if (retryData.message.includes('SSS class to choose a discipline')) {
                return NextResponse.json(
                  { success: false, message: "You have to be in SSS class to choose a discipline!", errors: null, requestId },
                  { status: 400 }
                );
              }
            }
            
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

