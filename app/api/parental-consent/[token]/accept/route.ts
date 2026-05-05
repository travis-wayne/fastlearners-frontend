import { NextRequest, NextResponse } from "next/server";
import { BASE_API_URL } from "@/lib/api/client";

export async function POST(
  req: NextRequest,
  { params }: { params: { token: string } }
) {
  try {
    const { token } = params;
    let body = {};
    
    try {
      body = await req.json();
    } catch (e) {
      // Handle empty body gracefully
      body = {};
    }

    const r = await fetch(`${BASE_API_URL}/parental-consent/${token}/accept`, {
      method: "POST",
      headers: { 
        Accept: "application/json", 
        "Content-Type": "application/json" 
      },
      body: JSON.stringify(body),
    });

    const data = await r.json();
    return NextResponse.json(data, { status: r.status });
  } catch (e: any) {
    return NextResponse.json(
      { 
        success: false, 
        message: e?.message || "Failed to accept consent", 
        code: 500 
      },
      { status: 500 }
    );
  }
}
