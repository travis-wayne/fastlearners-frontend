import { NextRequest, NextResponse } from "next/server";

import { User } from "@/lib/types/auth";

export const AUTH_TOKEN_COOKIE = "auth_token";
export const AUTH_USER_COOKIE = "auth_user";
export const AUTH_EXPIRES_COOKIE = "auth_expires";

const isProd = process.env.NODE_ENV === "production";

export const cookieOptions = {
  httpOnly: true as const,
  secure: isProd,
  sameSite: "lax" as const,
  path: "/",
};

export interface AuthCookieData {
  token: string;
  user: User;
  expiresAt: number; // epoch ms
}

export function setAuthCookiesServer(
  res: NextResponse,
  data: AuthCookieData,
): void {
  res.cookies.set(AUTH_TOKEN_COOKIE, data.token, {
    ...cookieOptions,
    // maxAge in seconds
    maxAge: Math.floor((data.expiresAt - Date.now()) / 1000),
  });
  res.cookies.set(AUTH_USER_COOKIE, JSON.stringify(data.user), {
    ...cookieOptions,
    maxAge: Math.floor((data.expiresAt - Date.now()) / 1000),
  });
  res.cookies.set(AUTH_EXPIRES_COOKIE, data.expiresAt.toString(), {
    ...cookieOptions,
    maxAge: Math.floor((data.expiresAt - Date.now()) / 1000),
  });
}

export function clearAuthCookiesServer(res: NextResponse): void {
  res.cookies.set(AUTH_TOKEN_COOKIE, "", { ...cookieOptions, maxAge: 0 });
  res.cookies.set(AUTH_USER_COOKIE, "", { ...cookieOptions, maxAge: 0 });
  res.cookies.set(AUTH_EXPIRES_COOKIE, "", { ...cookieOptions, maxAge: 0 });
}

export function parseAuthCookiesServer(
  req: NextRequest,
): AuthCookieData | null {
  try {
    const token = req.cookies.get(AUTH_TOKEN_COOKIE)?.value;
    const userStr = req.cookies.get(AUTH_USER_COOKIE)?.value;
    const expiresStr = req.cookies.get(AUTH_EXPIRES_COOKIE)?.value;

    if (!token || !userStr || !expiresStr) return null;

    const user = JSON.parse(userStr) as User;
    const expiresAt = parseInt(expiresStr);
    if (Number.isNaN(expiresAt)) return null;
    if (Date.now() >= expiresAt) return null;

    return { token, user, expiresAt };
  } catch {
    return null;
  }
}