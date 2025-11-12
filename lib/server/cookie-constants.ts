export const AUTH_TOKEN_COOKIE = "auth_token";
export const AUTH_EXPIRES_COOKIE = "auth_expires";
export const REG_TOKEN_COOKIE = "reg_token"; // temporary token during registration

export const isProd = process.env.NODE_ENV === "production";

export const defaultCookieOptions = {
  httpOnly: true as const,
  secure: isProd,
  sameSite: (isProd ? "strict" : "lax") as "strict" | "lax",
  path: "/",
} as const;

