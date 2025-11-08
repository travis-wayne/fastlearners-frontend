import { NextRequest, NextResponse } from "next/server";
import { parseAuthCookiesServer } from "../../../../lib/server/auth-cookies";
import { SERVER_API_BASE } from "@/lib/config";

export async function POST(req: NextRequest) {
  const auth = parseAuthCookiesServer(req);
  if (!auth) {
    return NextResponse.json({ success: false, message: 'Unauthorized', content: null, code: 401 }, { status: 401 });
  }

  let body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ success: false, message: 'Invalid JSON', content: null, code: 400 }, { status: 400 });
  }

  const { subject } = body;
  if (typeof subject !== 'number' || subject <= 0) {
    return NextResponse.json({ success: false, message: 'Invalid subject', content: null, code: 400 }, { status: 400 });
  }

  try {
    const response = await fetch(`${SERVER_API_BASE}/subjects/update-compulsory-selective`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${auth.token}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ subject }),
    });

    if (response.ok) {
      const data = await response.json();
      return NextResponse.json(data, { status: response.status });
    } else {
      // Try to forward upstream JSON body, fallback to generic error
      let errorData;
      try {
        errorData = await response.json();
      } catch {
        errorData = { message: 'Error' };
      }
      return NextResponse.json({ 
        success: false, 
        message: errorData.message || 'Error', 
        content: null,
        code: response.status 
      }, { status: response.status });
    }
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Internal Server Error', content: null, code: 500 }, { status: 500 });
  }
}