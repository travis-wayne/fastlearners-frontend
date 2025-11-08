import axios, {
  AxiosError,
  AxiosInstance,
  InternalAxiosRequestConfig,
} from "axios";

import { clearAuthCookies, getTokenFromCookies } from "@/lib/auth-cookies";
import { ApiResponse } from "@/lib/types/auth";
import { useAuthStore } from "@/store/authStore";

const useHttpOnly = process.env.NEXT_PUBLIC_USE_HTTPONLY_AUTH !== "false"; // default to true

// Create axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL:
    process.env.NEXT_PUBLIC_API_URL || "https://fastlearnersapp.com/api/v1",
  timeout: 30000,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

// Token management - only used when not in HttpOnly mode
export const tokenManager = {
  getToken: (): string | null => {
    if (useHttpOnly) return null;
    return getTokenFromCookies();
  },

  setToken: (_token: string): void => {
    console.warn("tokenManager.setToken is ignored; use server HttpOnly cookies.");
  },

  removeToken: (): void => {
    console.warn("tokenManager.removeToken is ignored; use server /api/auth/logout.");
  },
};

// Central 401 handler to avoid loops and manage app state
let isHandling401 = false;
export function handleUnauthorized() {
  if (typeof window === "undefined") return; // SSR: nothing to do
  if (isHandling401) return; // prevent loops
  isHandling401 = true;

  try {
    // Clear auth state
    useAuthStore.setState({ user: null, isAuthenticated: false, error: null, isLoading: false });

    // Clear legacy client cookies if any
    try {
      clearAuthCookies();
    } catch {}

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
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = tokenManager.getToken();

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    } else if (config.headers && useHttpOnly) {
      // Ensure no Authorization header leaks in HttpOnly mode
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
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<ApiResponse>) => {
    const originalRequest = error.config;

    // Handle 401 Unauthorized
    if (error.response?.status === 401 && originalRequest) {
      const isLoginAttempt = originalRequest.url?.includes("/login");
      const isOnLoginPage =
        typeof window !== "undefined" &&
        window.location.pathname.includes("/auth/login");

      if (!isLoginAttempt && !isOnLoginPage) {
        handleUnauthorized();
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
