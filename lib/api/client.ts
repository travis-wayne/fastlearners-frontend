import axios, {
  AxiosError,
  AxiosInstance,
  InternalAxiosRequestConfig,
} from "axios";

import { ApiResponse } from "@/lib/types/auth";

/**
 * DEPRECATED: This axios client should only be used for public, non-authenticated calls.
 * 
 * For authenticated API calls, always use internal Next.js API routes under `app/api/*`
 * that read HttpOnly cookies server-side via `parseAuthCookiesServer()` and proxy
 * to the backend with `Authorization: Bearer {token}` header.
 * 
 * Never send tokens from the browser. All authenticated requests must go through
 * internal routes that handle authentication server-side.
 * 
 * Example:
 * - ❌ DON'T: apiClient.get("/profile") from browser
 * - ✅ DO: fetch("/api/profile") which proxies to backend with auth from cookies
 */
const apiClient: AxiosInstance = axios.create({
  baseURL:
    process.env.NEXT_PUBLIC_API_URL || "https://fastlearnersapp.com/api/v1",
  timeout: 30000,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

// Token management is deprecated - HttpOnly-only mode
export const tokenManager = {
  getToken: (): string | null => {
    console.warn("tokenManager.getToken is deprecated. All auth uses HttpOnly cookies. Use internal /api/* routes.");
    return null;
  },

  setToken: (_token: string): void => {
    console.warn("tokenManager.setToken is deprecated. Use server-side /api/auth/* routes to set HttpOnly cookies.");
  },

  removeToken: (): void => {
    console.warn("tokenManager.removeToken is deprecated. Use /api/auth/logout to clear HttpOnly cookies.");
  },
};

/**
 * Handles 401 Unauthorized responses.
 * 
 * NOTE: This should rarely be called since authenticated requests should go through
 * internal /api/* routes. This handler is kept for legacy support and public API calls.
 * 
 * For authenticated flows, rely on:
 * - Middleware to redirect unauthenticated users to /auth/login
 * - /api/auth/session hydration to manage auth state
 * - Components to gracefully handle 401 errors without hard redirects
 */
let isHandling401 = false;
export function handleUnauthorized() {
  if (typeof window === "undefined") return; // SSR: nothing to do
  if (isHandling401) return; // prevent loops
  
  // Only handle 401 for critical auth checks, not for every API call
  // Most authenticated requests should go through internal routes which handle 401s gracefully
  const isCriticalAuthCheck = window.location.pathname.includes("/api/auth/session");
  
  if (!isCriticalAuthCheck) {
    // For non-critical calls, let components handle errors gracefully
    // Don't hard redirect - let the component decide what to do
    return;
  }
  
  isHandling401 = true;

  try {
    // Only redirect if we're checking auth status and it's critical
    const loginPath = "/auth/login";
    const isOnLogin = window.location.pathname.startsWith(loginPath);
    const callbackUrl = encodeURIComponent(window.location.href);

    if (!isOnLogin) {
      window.location.href = `${loginPath}?callbackUrl=${callbackUrl}`;
    }
  } finally {
    // Keep flag set to avoid rapid loops; navigation will replace page
  }
}

// Request interceptor
// NOTE: This should NOT add Authorization headers since all authenticated calls
// should go through internal /api/* routes. This client is for public calls only.
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Never add Authorization header - authenticated calls must use internal routes
    if (config.headers) {
      delete (config.headers as any)["Authorization"];
    }

    // Don't set Content-Type for FormData
    if (config.data instanceof FormData && config.headers) {
      delete config.headers["Content-Type"];
    }

    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  },
);

// Response interceptor
// NOTE: This interceptor should rarely trigger for 401s since authenticated calls
// should use internal routes. It's kept for legacy/public API call support.
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<ApiResponse>) => {
    const originalRequest = error.config;

    // Handle 401 Unauthorized - but only for critical auth checks
    // Most 401s should be handled gracefully by components, not hard redirected
    if (error.response?.status === 401 && originalRequest) {
      const isLoginAttempt = originalRequest.url?.includes("/login");
      const isOnLoginPage =
        typeof window !== "undefined" &&
        window.location.pathname.includes("/auth/login");
      const isInternalRoute = originalRequest.url?.startsWith("/api/");

      // Only handle 401 for non-internal routes and non-login attempts
      // Internal routes should handle 401s themselves
      if (!isLoginAttempt && !isOnLoginPage && !isInternalRoute) {
        // For public API calls that get 401, don't hard redirect
        // Let the component handle the error gracefully
        console.warn("401 on public API call - consider using internal /api/* route");
      }
    }

    // Handle network errors
    if (!error.response) {
      return Promise.reject({
        success: false,
        message: "Network error. Please check your internet connection.",
        code: 0,
        content: null,
      });
    }

    // Normalize 422 validation errors
    if (error.response.status === 422) {
      const d: any = error.response.data || {};
      return Promise.reject({
        success: false,
        message: d.message || "Validation failed",
        code: 422,
        errors: d.errors || null,
      });
    }

    const errorData = error.response.data || {
      success: false,
      message: "An error occurred",
      code: error.response.status,
      errors: null,
    };
    return Promise.reject(errorData);
  },
);

export const api = {
  get: <T = any>(url: string, params?: any, config?: any) =>
    apiClient.get<ApiResponse<T>>(url, { params, ...config }),

  post: <T = any>(url: string, data?: any, config?: any) =>
    apiClient.post<ApiResponse<T>>(url, data, config),

  put: <T = any>(url: string, data?: any, config?: any) =>
    apiClient.put<ApiResponse<T>>(url, data, config),

  patch: <T = any>(url: string, data?: any, config?: any) =>
    apiClient.patch<ApiResponse<T>>(url, data, config),

  delete: <T = any>(url: string, config?: any) =>
    apiClient.delete<ApiResponse<T>>(url, config),
};

// Export both named and default
export { apiClient };
export default apiClient;
