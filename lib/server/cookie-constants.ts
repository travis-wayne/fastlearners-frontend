export const AUTH_TOKEN_COOKIE = "auth_token";
export const AUTH_EXPIRES_COOKIE = "auth_expires";
export const REG_TOKEN_COOKIE = "reg_token"; // temporary token during registration

export const isProd = process.env.NODE_ENV === "production";

type SameSiteOption = "strict" | "lax" | "none";

export const defaultCookieOptions: {
  httpOnly: boolean;
  secure: boolean;
  sameSite: SameSiteOption;
  path: string;
} = {
  httpOnly: true,
  secure: isProd,
  sameSite: isProd ? "strict" : "lax",
  path: "/",
};

