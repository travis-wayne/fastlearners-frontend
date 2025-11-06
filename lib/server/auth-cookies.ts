import { NextRequest, NextResponse } from "next/server";
import { defaultCookieOptions, AUTH_TOKEN_COOKIE, AUTH_EXPIRES_COOKIE, REG_TOKEN_COOKIE } from "./cookie-constants";

export interface AuthCookieData {
  token: string;
  expiresAt: number; // epoch ms
}

export function setAuthCookiesServer(
  res: NextResponse,
  data: AuthCookieData,
): void {
  res.cookies.set(AUTH_TOKEN_COOKIE, data.token, {
    ...defaultCookieOptions,
    // maxAge in seconds
    maxAge: Math.floor((data.expiresAt - Date.now()) / 1000),
  });
  res.cookies.set(AUTH_EXPIRES_COOKIE, data.expiresAt.toString(), {
    ...defaultCookieOptions,
    maxAge: Math.floor((data.expiresAt - Date.now()) / 1000),
  });
  // Note: User data is not stored in cookies. User info is fetched via /api/auth/session
}

export function clearAuthCookiesServer(res: NextResponse): void {
  res.cookies.set(AUTH_TOKEN_COOKIE, "", { ...defaultCookieOptions, maxAge: 0 });
  res.cookies.set(AUTH_EXPIRES_COOKIE, "", { ...defaultCookieOptions, maxAge: 0 });
}

export function setRegTokenServer(res: NextResponse, token: string, maxAgeSeconds: number): void {
  res.cookies.set(REG_TOKEN_COOKIE, token, { ...defaultCookieOptions, maxAge: maxAgeSeconds });
}

export function clearRegTokenServer(res: NextResponse): void {
  res.cookies.set(REG_TOKEN_COOKIE, "", { ...defaultCookieOptions, maxAge: 0 });
}

export function parseAuthCookiesServer(
  req: NextRequest,
): AuthCookieData | null {
  try {
    const token = req.cookies.get(AUTH_TOKEN_COOKIE)?.value;
    const expiresStr = req.cookies.get(AUTH_EXPIRES_COOKIE)?.value;
    if (!token || !expiresStr) return null;
    const expiresAt = parseInt(expiresStr);
    if (Number.isNaN(expiresAt)) return null;
    if (Date.now() >= expiresAt) return null;

    return { token, expiresAt };
  } catch {
    return null;
  }
}