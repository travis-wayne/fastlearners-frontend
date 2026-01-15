import { NextRequest, NextResponse } from "next/server";
import { parseAuthCookiesServer } from "@/lib/server/auth-cookies";
import { BASE_API_URL } from "@/lib/api/client";
import { handleUpstreamError, handleApiError, createErrorResponse } from "@/lib/api/error-handler";

export async function POST(req: NextRequest) {
  const auth = parseAuthCookiesServer(req);
  if (!auth) {
    return createErrorResponse("Unauthorized", 401);
  }

  const requestId = crypto.randomUUID();

  try {
    // Get the form data from the request
    const formData = await req.formData();
    const file = formData.get("profile_picture");

    if (!file || !(file instanceof File)) {
      return NextResponse.json(
        {
          success: false,
          message: "Profile picture file is required",
          content: null,
          code: 422,
          errors: {
            profile_picture: ["The profile picture field is required."],
          },
          requestId,
        },
        { status: 422 }
      );
    }

    // Validate file type
    const allowedTypes = ["image/png", "image/jpeg", "image/jpg", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid file type. Only PNG, JPG, JPEG, and WEBP are allowed.",
          content: null,
          code: 422,
          errors: {
            profile_picture: [
              "Profile picture must be of type, png, jpg, jpeg, webp.",
            ],
          },
          requestId,
        },
        { status: 422 }
      );
    }

    // Validate file size (1MB = 1048576 bytes)
    if (file.size > 1048576) {
      return NextResponse.json(
        {
          success: false,
          message: "File size exceeds 1MB limit.",
          content: null,
          code: 422,
          errors: {
            profile_picture: ["Profile picture size must not be larger than 1MB."],
          },
          requestId,
        },
        { status: 422 }
      );
    }

    // Forward the form data to upstream API
    const upstreamFormData = new FormData();
    upstreamFormData.append("profile_picture", file);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30s timeout for file upload

    try {
      const response = await fetch(`${BASE_API_URL}/profile/edit/profile-picture`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${auth.token}`,
          // Don't set Content-Type - let fetch set it with boundary for multipart/form-data
        },
        body: upstreamFormData,
        cache: "no-store",
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      const data = await response.json();

      if (!response.ok) {
        return handleUpstreamError(response, data, requestId);
      }

      return NextResponse.json(
        {
          success: data.success,
          message: data.message || "Profile picture uploaded successfully",
          content: data.content,
          code: data.code || 200,
        },
        { status: 200 }
      );
    } catch (fetchError: any) {
      clearTimeout(timeoutId);
      throw fetchError;
    }
  } catch (error: any) {
    return handleApiError(error, "Profile picture upload failed", requestId);
  }
}
