import axios, {
  AxiosError,
  AxiosInstance,
  InternalAxiosRequestConfig,
} from "axios";

import { getTokenFromCookies } from "@/lib/auth-cookies";
import { ApiResponse } from "@/lib/types/auth";

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

// Token management - now uses cookies to match auth store
export const tokenManager = {
  getToken: (): string | null => {
    return getTokenFromCookies();
  },

  setToken: (token: string): void => {
    // This should be handled by the auth store via setAuthCookies
    console.warn("Use auth store setUser instead of tokenManager.setToken");
  },

  removeToken: (): void => {
    // This should be handled by the auth store via logout
    console.warn("Use auth store logout instead of tokenManager.removeToken");
  },
};

// Request interceptor
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = tokenManager.getToken();

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
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

      if (!isLoginAttempt) {
        tokenManager.removeToken();

        if (typeof window !== "undefined" && !isOnLoginPage) {
          window.location.href = "/auth/login";
        }
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
