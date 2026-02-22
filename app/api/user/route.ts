import { NextRequest, NextResponse } from "next/server";
import { parseAuthCookiesServer } from "@/lib/server/auth-cookies";
import { UPSTREAM_BASE } from "@/lib/api/client";
import { handleUpstreamError, handleApiError, createErrorResponse } from "@/lib/api/error-handler";

export async function DELETE(req: NextRequest) {
  const auth = parseAuthCookiesServer(req);
  if (!auth) {
    return createErrorResponse("Unauthorized", 401);
  }

  const requestId = crypto.randomUUID();

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);

    const url = new URL(req.url);
    const useDeleteNow = url.searchParams.get("instant") !== "false"; 
    const endpoint = useDeleteNow ? "/profile/delete-now" : "/profile/delete";

    try {
      const r = await fetch(`${UPSTREAM_BASE}${endpoint}`, {
        method: "DELETE",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${auth.token}`,
        },
        cache: "no-store",
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      const data = await r.json();

      if (!r.ok) {
        return handleUpstreamError(r, data, requestId);
      }

      return NextResponse.json(data, { status: 200 });
    } catch (fetchError: any) {
      clearTimeout(timeoutId);
      return handleApiError(fetchError, "Failed to delete account", requestId);
    }
  } catch (e: any) {
    return handleApiError(e, "Failed to delete account", requestId);
  }
}
