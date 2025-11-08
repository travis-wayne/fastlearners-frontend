import { NextRequest, NextResponse } from 'next/server';
import { parseAuthCookiesServer } from '../../../../lib/server/auth-cookies';
import { SERVER_API_BASE } from '@/lib/config';

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

  const { subjects } = body;
  if (!Array.isArray(subjects) || !subjects.every((n) => typeof n === 'number')) {
    return NextResponse.json({ success: false, message: 'Invalid subjects array', content: null, code: 400 }, { status: 400 });
  }

  const formData = new FormData();
  subjects.forEach((id) => formData.append('subjects[]', id.toString()));

  try {
    const res = await fetch(`${SERVER_API_BASE}/subjects/update-selective`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${auth.token}`,
        Accept: 'application/json',
      },
      body: formData,
    });

    if (res.ok) {
      const data = await res.json();
      return NextResponse.json(data, { status: res.status });
    } else {
      // Try to forward upstream JSON body, fallback to generic error
      let errorData;
      try {
        errorData = await res.json();
      } catch {
        errorData = { message: 'Error' };
      }
      return NextResponse.json({ 
        success: false, 
        message: errorData.message || 'Error', 
        content: null,
        code: res.status 
      }, { status: res.status });
    }
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Internal Server Error', content: null, code: 500 }, { status: 500 });
  }
}