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

/**
 * Parses authentication cookies from the request to extract the auth token and expiry time.
 * This function only extracts token and expiry from cookies; it does NOT extract user role.
 * User role must be fetched from the backend API or will be available in a separate cookie in Phase 2.
 *
 * @param req - The NextRequest object containing the cookies.
 * @returns An AuthCookieData object with token and expiresAt, or null if cookies are invalid or expired.
 *
 * @example
 * ```typescript
 * const authData = parseAuthCookiesServer(request);
 * if (authData) {
 *   // Use the token to fetch user data from backend
 *   const userRole = await getUserRoleFromBackend(authData.token);
 *   // Proceed with role-based logic
 * }
 * ```
 *
 * @see {@link getUserRoleFromBackend} in `middleware.ts` for an example of fetching user role using the token.
 */
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