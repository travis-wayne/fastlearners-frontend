import Cookies from 'js-cookie';
import { User, UserRole } from '@/types/auth';

// Cookie names
const AUTH_TOKEN_COOKIE = 'auth_token';
const AUTH_USER_COOKIE = 'auth_user';
const AUTH_EXPIRES_COOKIE = 'auth_expires';

// Cookie configuration
const COOKIE_CONFIG = {
  expires: 7, // 7 days
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
};

export interface AuthCookieData {
  token: string;
  user: User;
  expiresAt: number;
}

/**
 * Set auth cookies after successful login
 */
export function setAuthCookies(data: AuthCookieData): void {
  try {
    // Set the secure HTTP-only token (this would be set by your API in a real app)
    // For now, we'll store it as a regular cookie since we can't set HTTP-only from client
    Cookies.set(AUTH_TOKEN_COOKIE, data.token, COOKIE_CONFIG);
    
    // Set user data as JSON
    Cookies.set(AUTH_USER_COOKIE, JSON.stringify(data.user), COOKIE_CONFIG);
    
    // Set expiration timestamp
    Cookies.set(AUTH_EXPIRES_COOKIE, data.expiresAt.toString(), COOKIE_CONFIG);
    
    console.log('✅ Auth cookies set successfully');
  } catch (error) {
    console.error('❌ Failed to set auth cookies:', error);
  }
}

/**
 * Get auth data from cookies
 */
export function getAuthCookies(): AuthCookieData | null {
  try {
    const token = Cookies.get(AUTH_TOKEN_COOKIE);
    const userStr = Cookies.get(AUTH_USER_COOKIE);
    const expiresStr = Cookies.get(AUTH_EXPIRES_COOKIE);
    
    if (!token || !userStr || !expiresStr) {
      return null;
    }
    
    const user = JSON.parse(userStr) as User;
    const expiresAt = parseInt(expiresStr);
    
    // Check if token is expired
    if (Date.now() >= expiresAt) {
      console.log('🕐 Auth cookies expired, clearing...');
      clearAuthCookies();
      return null;
    }
    
    return { token, user, expiresAt };
  } catch (error) {
    console.error('❌ Failed to read auth cookies:', error);
    clearAuthCookies(); // Clear corrupted cookies
    return null;
  }
}

/**
 * Clear all auth cookies
 */
export function clearAuthCookies(): void {
  try {
    Cookies.remove(AUTH_TOKEN_COOKIE);
    Cookies.remove(AUTH_USER_COOKIE);
    Cookies.remove(AUTH_EXPIRES_COOKIE);
    console.log('✅ Auth cookies cleared');
  } catch (error) {
    console.error('❌ Failed to clear auth cookies:', error);
  }
}

/**
 * Check if user is authenticated based on cookies (server-safe)
 */
export function isAuthenticatedFromCookies(): boolean {
  const authData = getAuthCookies();
  return authData !== null;
}

/**
 * Get user data from cookies (server-safe)
 */
export function getUserFromCookies(): User | null {
  const authData = getAuthCookies();
  return authData?.user || null;
}

/**
 * Get token from cookies (server-safe)
 */
export function getTokenFromCookies(): string | null {
  const authData = getAuthCookies();
  return authData?.token || null;
}

/**
 * Server-side cookie parsing (for pages that need SSR auth)
 * This function can parse cookies from the request headers
 */
export function parseServerCookies(cookieString?: string): AuthCookieData | null {
  if (!cookieString) return null;
  
  try {
    const cookies = cookieString
      .split(';')
      .reduce((acc, cookie) => {
        const [key, value] = cookie.trim().split('=');
        acc[key] = decodeURIComponent(value);
        return acc;
      }, {} as Record<string, string>);
    
    const token = cookies[AUTH_TOKEN_COOKIE];
    const userStr = cookies[AUTH_USER_COOKIE];
    const expiresStr = cookies[AUTH_EXPIRES_COOKIE];
    
    if (!token || !userStr || !expiresStr) {
      return null;
    }
    
    const user = JSON.parse(userStr) as User;
    const expiresAt = parseInt(expiresStr);
    
    // Check if token is expired
    if (Date.now() >= expiresAt) {
      return null;
    }
    
    return { token, user, expiresAt };
  } catch (error) {
    console.error('❌ Failed to parse server cookies:', error);
    return null;
  }
}
