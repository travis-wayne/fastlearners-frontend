import { NextRequest, NextResponse } from 'next/server';
import { parseAuthCookiesServer } from '@/lib/server/auth-cookies';
import { SERVER_API_BASE } from '@/lib/config';

export async function GET(req: NextRequest) {
  const auth = parseAuthCookiesServer(req);
  if (!auth) {
    return NextResponse.json({ success: false, message: 'Unauthorized', content: null, code: 401 }, { status: 401 });
  }

  try {
    const response = await fetch(`${SERVER_API_BASE}/subjects`, {
      headers: {
        'Authorization': `Bearer ${auth.token}`,
        'Accept': 'application/json',
      },
    });

    if (response.ok) {
      const data = await response.json();
      return NextResponse.json(data);
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
    return NextResponse.json({ success: false, message: 'Network error', content: null, code: 500 }, { status: 500 });
  }
}