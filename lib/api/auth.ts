import { api, tokenManager } from './client';
import {
  ApiResponse,
  AuthTokens,
  LoginCredentials,
  RegisterData,
  VerifyEmailData,
  CreatePasswordData,
  ResetPasswordData,
  ForgotPasswordData,
  VerifyResetCodeData,
  ProfileUpdateData,
  ChangePasswordData,
  User,
} from '@/lib/types/auth';

export const authApi = {
  // Registration flow
  register: async (data: RegisterData): Promise<ApiResponse> => {
    const response = await api.post('/register', data);
    return response.data;
  },

  verifyEmail: async (data: VerifyEmailData): Promise<ApiResponse<AuthTokens>> => {
    const response = await api.post<AuthTokens>('/verify-email', data);
    
    if (response.data.success && response.data.content?.access_token) {
      tokenManager.setToken(response.data.content.access_token);
    }
    
    return response.data;
  },

  createPassword: async (data: CreatePasswordData): Promise<ApiResponse<AuthTokens>> => {
    const response = await api.post<AuthTokens>('/create-password', data);
    
    if (response.data.success && response.data.content?.access_token) {
      tokenManager.setToken(response.data.content.access_token);
    }
    
    return response.data;
  },

  resendVerificationCode: async (email: string): Promise<ApiResponse> => {
    const response = await api.post('/resend-verification-code', { email });
    return response.data;
  },

  // Login/Logout
  login: async (credentials: LoginCredentials): Promise<ApiResponse<AuthTokens>> => {
    const response = await api.post<AuthTokens>('/login', credentials);
    
    if (response.data.success && response.data.content?.access_token) {
      tokenManager.setToken(response.data.content.access_token);
    }
    
    return response.data;
  },

  googleRedirect: async (): Promise<ApiResponse> => {
    const response = await api.get('/google/redirect');
    return response.data;
  },

  logout: async (): Promise<ApiResponse> => {
    try {
      const response = await api.post('/logout');
      return response.data;
    } finally {
      tokenManager.removeToken();
    }
  },

  // Password reset flow
  forgotPassword: async (data: ForgotPasswordData): Promise<ApiResponse> => {
    const response = await api.post('/forgot-password', data);
    return response.data;
  },

  verifyResetCode: async (data: VerifyResetCodeData): Promise<ApiResponse> => {
    const response = await api.post('/verify-reset-code', data);
    return response.data;
  },

  resendResetCode: async (email: string): Promise<ApiResponse> => {
    const response = await api.post('/resend-reset-code', { email });
    return response.data;
  },

  resetPassword: async (data: ResetPasswordData): Promise<ApiResponse> => {
    const response = await api.post('/reset-password', data);
    return response.data;
  },
};

// User Profile Management APIs
export const profileApi = {
  getProfile: async (): Promise<ApiResponse<{ user: User }>> => {
    const response = await api.get<{ user: User }>('/profile');
    return response.data;
  },

  updateProfile: async (data: ProfileUpdateData): Promise<ApiResponse<{ user: User }>> => {
    const response = await api.post<{ user: User }>('/profile/edit', data);
    return response.data;
  },

  changePassword: async (data: ChangePasswordData): Promise<ApiResponse> => {
    const response = await api.post('/profile/edit/password', data);
    return response.data;
  },

  updateRole: async (role: string): Promise<ApiResponse<{ user: User }>> => {
    const response = await api.post<{ user: User }>('/profile/update-role', { role });
    return response.data;
  },
};

// Helper functions
export const isAuthenticated = (): boolean => {
  return tokenManager.getToken() !== null;
};

export const getUserFromStorage = (): any => {
  if (typeof window !== 'undefined') {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }
  return null;
};

export const setUserInStorage = (user: any): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('user', JSON.stringify(user));
  }
};

export const clearAuthData = (): void => {
  tokenManager.removeToken();
  if (typeof window !== 'undefined') {
    localStorage.removeItem('user');
  }
};
