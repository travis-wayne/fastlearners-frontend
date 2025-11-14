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

// User Profile Management APIs
export const profileApi = {
  getProfile: async (): Promise<ApiResponse<{ user: User }>> => {
    const response = await fetch("/api/profile", {
      method: "GET",
      headers: { Accept: "application/json" },
      credentials: "include",
    });
    return await response.json();
  },

  updateProfile: async (
    data: ProfileUpdateData,
  ): Promise<ApiResponse<{ user: User }>> => {
    return postJson<ApiResponse<{ user: User }>>("/api/profile/edit", data);
  },

  changePassword: async (data: ChangePasswordData): Promise<ApiResponse> => {
    return postJson<ApiResponse>("/api/profile/edit/password", data);
  },

  updateRole: async (role: string): Promise<ApiResponse<{ user: User }>> => {
    return postJson<ApiResponse<{ user: User }>>("/api/auth/set-role", { role });
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
