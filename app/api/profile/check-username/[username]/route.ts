import { NextRequest, NextResponse } from "next/server";
import { parseAuthCookiesServer } from "@/lib/server/auth-cookies";
import { BASE_API_URL } from "@/lib/api/client";
import { handleUpstreamError, handleApiError, createErrorResponse } from "@/lib/api/error-handler";

export async function GET(
  req: NextRequest,
  { params }: { params: { username: string } }
) {
  const auth = parseAuthCookiesServer(req);
  if (!auth) {
    return createErrorResponse("Unauthorized", 401);
  }

  const requestId = crypto.randomUUID();
  const username = params.username;

  // Validation
  if (!username || username.trim().length === 0) {
    return NextResponse.json(
      {
        success: false,
        message: "Username is required",
        content: null,
        code: 422,
        requestId,
      },
      { status: 422 }
    );
  }

  try {
    const response = await fetch(
      `${BASE_API_URL}/check-username-availability/${encodeURIComponent(username)}`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${auth.token}`,
        },
        cache: "no-store",
      }
    );

    const data = await response.json();

    // Backend returns 200 for available, 400 for not available or error
    // We want to pass this status code through, but ensure our frontend can parse it.
    
    // Available: 200 OK, success: true, content: { is_available: true, username: "..." }
    // Not Available: 400 Bad Request, success: false, errors: { is_available: false, username: "Taken" }

    if (response.ok && data.success) {
        return NextResponse.json({
            success: true,
            content: {
                is_available: true, 
                username: data.content?.username || "Username is available!"
            }
        });
    } else {
        // Handle "Not Available" / 400 case or other errors
        // Normalize the error response for our frontend helper
        const isAvailable = false;
        const message = data.errors?.username || data.message || "Username is not available";
        
        return NextResponse.json({
             success: false,
             message: message,
             content: {
                 is_available: false,
                 username: message
             },
             // Use 200 status so frontend fetch doesn't throw, but indicate logic failure in body
             // OR keep it 400 if client handles it. 
             // Let's stick to returning 200 with success:false so client logic is simpler
        }, { status: 200 }); 
    }

  } catch (error: any) {
    return handleApiError(error, "Failed to check username availability", requestId);
  }
}
