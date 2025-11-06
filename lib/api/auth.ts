import {
  ApiResponse,
  AuthTokens,
  ChangePasswordData,
  CreatePasswordData,
  ForgotPasswordData,
  LoginCredentials,
  ProfileUpdateData,
  RegisterData,
  ResetPasswordData,
  User,
  VerifyEmailData,
  VerifyResetCodeData,
} from "@/lib/types/auth";

import { api } from "./client";

async function postJson<T>(path: string, body?: any): Promise<T> {
  try {
    const r = await fetch(path, {
      method: "POST",
      headers: { 
        "Accept": "application/json",
        "Content-Type": "application/json" 
      },
      body: body ? JSON.stringify(body) : undefined,
    });
    
    const data = await r.json();
    
    // If response is not ok, throw the error data for proper handling
    if (!r.ok) {
      throw data;
    }
    
    return data as T;
  } catch (error: any) {
    // Re-throw if it's already our API error format
    if (error.success === false || error.message || error.errors) {
      throw error;
    }
    // Otherwise, wrap in a generic error
    throw {
      success: false,
      message: error.message || "Network error occurred",
      code: 500,
    };
  }
}

export const authApi = {
  // Registration flow → map to Next server routes
  register: async (data: RegisterData): Promise<ApiResponse> => {
    return postJson<ApiResponse>("/api/auth/register", data);
  },

  verifyEmail: async (
    data: VerifyEmailData,
  ): Promise<ApiResponse<AuthTokens>> => {
    return postJson<ApiResponse<AuthTokens>>("/api/auth/verify-email", data);
  },

  createPassword: async (
    data: CreatePasswordData,
  ): Promise<ApiResponse<AuthTokens>> => {
    // Prefer using CreatePasswordForm fetch; keep API for compatibility
    return postJson<ApiResponse<AuthTokens>>("/api/auth/create-password", data);
  },

  resendVerificationCode: async (email: string): Promise<ApiResponse> => {
    return postJson<ApiResponse>("/api/auth/resend-verification-code", { email });
  },

  // Login/Logout → map to server routes
  login: async (
    credentials: LoginCredentials,
  ): Promise<ApiResponse<AuthTokens>> => {
    return postJson<ApiResponse<AuthTokens>>("/api/auth/login", credentials);
  },

  googleRedirect: async (): Promise<ApiResponse> => {
    // Not used; Google flow handled via /api/auth/google/callback
    return { success: false, message: "Not implemented", code: 501 } as any;
  },

  logout: async (): Promise<ApiResponse> => {
    return postJson<ApiResponse>("/api/auth/logout");
  },

  // Password reset flow → map to server routes
  forgotPassword: async (data: ForgotPasswordData): Promise<ApiResponse> => {
    return postJson<ApiResponse>("/api/auth/forgot-password", data);
  },

  verifyResetCode: async (data: VerifyResetCodeData): Promise<ApiResponse> => {
    return postJson<ApiResponse>("/api/auth/verify-reset-code", data);
  },

  resendResetCode: async (email: string): Promise<ApiResponse> => {
    return postJson<ApiResponse>("/api/auth/resend-reset-code", { email });
  },

  resetPassword: async (data: ResetPasswordData): Promise<ApiResponse> => {
    return postJson<ApiResponse>("/api/auth/reset-password", data);
  },
};

/**
 * DEPRECATED: profileApi should not be used.
 * 
 * Use the functions from `lib/api/profile.ts` instead, which use internal
 * /api/* routes that read HttpOnly cookies server-side.
 * 
 * This API is kept for backward compatibility but should be migrated.
 */
export const profileApi = {
  getProfile: async (): Promise<ApiResponse<{ user: User }>> => {
    console.warn("profileApi.getProfile is deprecated. Use getProfile() from lib/api/profile.ts");
    // Redirect to internal route
    const response = await fetch("/api/auth/session", {
      method: "GET",
      headers: { Accept: "application/json" },
      credentials: "include",
    });
    const data = await response.json();
    if (!response.ok || !data.success) {
      throw { success: false, message: data.message || "Failed to fetch profile", code: response.status };
    }
    return { success: true, content: { user: data.user }, message: "", code: 200 };
  },

  updateProfile: async (
    data: ProfileUpdateData,
  ): Promise<ApiResponse<{ user: User }>> => {
    console.warn("profileApi.updateProfile is deprecated. Use updateProfile() from lib/api/profile.ts");
    // Redirect to internal route
    const response = await fetch("/api/profile/edit", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(data),
    });
    const result = await response.json();
    if (!response.ok || !result.success) {
      throw { success: false, message: result.message || "Failed to update profile", code: response.status, errors: result.errors };
    }
    return { success: true, content: { user: result.user }, message: result.message || "", code: 200 };
  },

  changePassword: async (data: ChangePasswordData): Promise<ApiResponse> => {
    console.warn("profileApi.changePassword is deprecated. Use changePassword() from lib/api/profile.ts");
    // Redirect to internal route
    const response = await fetch("/api/profile/edit/password", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(data),
    });
    const result = await response.json();
    if (!response.ok || !result.success) {
      throw { success: false, message: result.message || "Failed to change password", code: response.status, errors: result.errors };
    }
    return { success: true, content: { user: result.user }, message: result.message || "", code: 200 };
  },

  updateRole: async (role: string): Promise<ApiResponse<{ user: User }>> => {
    console.warn("profileApi.updateRole is deprecated. Use /api/auth/set-role route instead");
    // Redirect to internal route
    const response = await fetch("/api/auth/set-role", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ user_role: role }),
    });
    const result = await response.json();
    if (!response.ok || !result.success) {
      throw { success: false, message: result.message || "Failed to update role", code: response.status };
    }
    return { success: true, content: { user: result.user }, message: result.message || "", code: 200 };
  },
};

// Helper functions
export const isAuthenticated = (): boolean => {
  // In HttpOnly mode, client cannot directly know; prefer calling /api/auth/session
  return false;
};

export const getUserFromStorage = (): any => {
  if (typeof window !== "undefined") {
    const userStr = localStorage.getItem("user");
    return userStr ? JSON.parse(userStr) : null;
  }
  return null;
};

export const setUserInStorage = (user: any): void => {
  if (typeof window !== "undefined") {
    localStorage.setItem("user", JSON.stringify(user));
  }
};

export const clearAuthData = (): void => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("user");
  }
};
