import Cookies from 'js-cookie'

/**
 * Get a cookie value by name
 * @param name - Cookie name
 * @returns Cookie value or undefined if not found
 */
export function getCookie(name: string): string | undefined {
  return Cookies.get(name)
}

/**
 * Set a cookie with a max age
 * @param name - Cookie name
 * @param value - Cookie value
 * @param maxAge - Max age in seconds
 */
export function setCookie(name: string, value: string, maxAge: number): void {
  Cookies.set(name, value, {
    expires: new Date(Date.now() + maxAge * 1000), // Convert seconds to milliseconds for Date
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
  })
}

/**
 * Remove a cookie by name
 * @param name - Cookie name
 */
export function removeCookie(name: string): void {
  Cookies.remove(name)
}

