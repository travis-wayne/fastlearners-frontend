/**
 * @deprecated This file is deprecated. Client-side code should NOT read tokens from cookies.
 * All authentication must be handled server-side via HttpOnly cookies.
 * Use internal API routes (/api/*) which handle authentication server-side using parseAuthCookiesServer().
 * 
 * This file is kept only for legacy cookie cleanup utilities.
 */

import Cookies from "js-cookie";
import { AUTH_TOKEN_COOKIE, AUTH_EXPIRES_COOKIE } from "@/lib/server/cookie-constants";

export interface AuthCookieData {
  token: string;
  expiresAt: number;
}

/**
 * DEPRECATED: Client-side auth cookie setter
 * Do not use. Tokens and user data must be set via server HttpOnly cookies.
 */
export function setAuthCookies(_data: AuthCookieData): void {
  if (process.env.NODE_ENV !== "production") {
    console.warn(
      "setAuthCookies is deprecated. Use server-side /api/auth/login to set HttpOnly cookies.",
    );
  }
  // No-op: intentionally does nothing to avoid storing sensitive data in JS-accessible cookies
}

/**
 * @deprecated REMOVED: Client-side code must NOT read tokens from cookies (XSS exposure).
 * This function now throws an error to prevent misuse.
 * Use internal API routes (/api/*) which handle authentication server-side.
 */
export function getAuthCookies(): AuthCookieData | null {
  throw new Error(
    "getAuthCookies() is removed for security. Use /api/auth/session or server routes instead.",
  );
}

/**
 * Clear legacy client-side auth cookies (transitional support).
 * This function is safe to use for cleanup purposes.
 */
export function clearAuthCookies(): void {
  try {
    Cookies.remove(AUTH_TOKEN_COOKIE);
    Cookies.remove(AUTH_EXPIRES_COOKIE);
  } catch {
    // ignore
  }
}

/**
 * @deprecated REMOVED: Client-side code must NOT read tokens from cookies (XSS exposure).
 * This function now throws an error to prevent misuse.
 * Use internal API routes (/api/*) which handle authentication server-side.
 */
export function isAuthenticatedFromCookies(): boolean {
  throw new Error(
    "isAuthenticatedFromCookies() is removed for security. Use /api/auth/session or server routes instead.",
  );
}

/**
 * @deprecated REMOVED: Client-side code must NOT read tokens from cookies (XSS exposure).
 * This function now throws an error to prevent misuse.
 * Use internal API routes (/api/*) which handle authentication server-side.
 */
export function getTokenFromCookies(): string | null {
  throw new Error(
    "getTokenFromCookies() is removed for security. Use /api/auth/session or server routes instead.",
  );
}

/**
 * Parse cookies from a raw cookie header string (legacy support).
 */
export function parseServerCookies(cookieString?: string): AuthCookieData | null {
  if (!cookieString) return null;

  try {
    const cookies = cookieString.split(";").reduce(
      (acc, cookie) => {
        const [key, value] = cookie.trim().split("=");
        acc[key] = decodeURIComponent(value);
        return acc;
      },
      {} as Record<string, string>,
    );

    const token = cookies[AUTH_TOKEN_COOKIE];
    const expiresStr = cookies[AUTH_EXPIRES_COOKIE];

    if (!token || !expiresStr) return null;
    const expiresAt = parseInt(expiresStr);
    if (Number.isNaN(expiresAt) || Date.now() >= expiresAt) return null;

    return { token, expiresAt };
  } catch {
    return null;
  }
}
