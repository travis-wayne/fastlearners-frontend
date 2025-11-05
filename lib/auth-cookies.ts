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
 * Read auth data from legacy client cookies (transitional support only).
 * Returns null if cookies are missing/expired.
 */
export function getAuthCookies(): AuthCookieData | null {
  try {
    const token = Cookies.get(AUTH_TOKEN_COOKIE);
    const expiresStr = Cookies.get(AUTH_EXPIRES_COOKIE);

    if (!token || !expiresStr) {
      return null;
    }
    const expiresAt = parseInt(expiresStr);

    // Check if token is expired
    if (Number.isNaN(expiresAt) || Date.now() >= expiresAt) {
      clearAuthCookies();
      return null;
    }

    return { token, expiresAt };
  } catch {
    clearAuthCookies(); // Clear corrupted cookies
    return null;
  }
}

/**
 * Clear legacy client-side auth cookies (transitional support).
 */
export function clearAuthCookies(): void {
  try {
    Cookies.remove(AUTH_TOKEN_COOKIE);
    Cookies.remove(AUTH_EXPIRES_COOKIE);
  } catch {
    // ignore
  }
}

export function isAuthenticatedFromCookies(): boolean {
  return getAuthCookies() !== null;
}

export function getTokenFromCookies(): string | null {
  return getAuthCookies()?.token || null;
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
