/**
 * Profile Management API
 * Handles user profile operations including view, edit, and password change
 */

import { apiClient } from './client';

// Profile data interfaces
export interface UserProfile {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: 'student' | 'guest' | 'guardian' | 'teacher' | 'admin' | 'superadmin';
  email_verified_at: string | null;
  phone_verified_at: string | null;
  created_at: string;
  updated_at: string;
  // Guardian-specific fields
  child_email?: string;
  child_phone?: string;
}

export interface ProfileResponse {
  success: boolean;
  message: string;
  content: {
    user: UserProfile;
  };
}

export interface ProfileEditData {
  name: string;
  email: string;
  phone: string;
  role: 'student' | 'guest' | 'guardian';
  // Required only for guardians
  child_email?: string;
  child_phone?: string;
}

export interface ChangePasswordData {
  current_password: string;
  new_password: string;
  new_password_confirmation: string;
}

export interface ChangePasswordResponse {
  success: boolean;
  message: string;
  content: {
    user: UserProfile;
  };
}

export interface ApiError {
  success: false;
  message: string;
  errors?: Record<string, string[]>;
}

/**
 * Get current user's profile information
 */
export const getProfile = async (): Promise<UserProfile> => {
  try {
    const response = await apiClient.get<ProfileResponse>('/profile');
    
    if (!response.data.success) {
      throw new Error(response.data.message || 'Failed to fetch profile');
    }
    
    return response.data.content.user;
  } catch (error: any) {
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error('Failed to fetch profile information');
  }
};

/**
 * Update user profile information
 */
export const updateProfile = async (profileData: ProfileEditData): Promise<UserProfile> => {
  try {
    const response = await apiClient.post<ProfileResponse>('/profile/edit', profileData);
    
    if (!response.data.success) {
      throw new Error(response.data.message || 'Failed to update profile');
    }
    
    return response.data.content.user;
  } catch (error: any) {
    if (error.response?.data?.errors) {
      // Handle validation errors
      const errors = error.response.data.errors;
      const firstError = Object.values(errors)[0] as string[];
      throw new Error(firstError[0] || 'Validation failed');
    }
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error('Failed to update profile');
  }
};

/**
 * Change user password
 * Note: This should be called after email verification for security
 */
export const changePassword = async (passwordData: ChangePasswordData): Promise<UserProfile> => {
  try {
    const response = await apiClient.post<ChangePasswordResponse>('/profile/edit/password', passwordData);
    
    if (!response.data.success) {
      throw new Error(response.data.message || 'Failed to change password');
    }
    
    return response.data.content.user;
  } catch (error: any) {
    if (error.response?.data?.errors) {
      // Handle validation errors
      const errors = error.response.data.errors;
      const firstError = Object.values(errors)[0] as string[];
      throw new Error(firstError[0] || 'Validation failed');
    }
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error('Failed to change password');
  }
};

/**
 * Validate profile data before submission
 */
export const validateProfileData = (data: ProfileEditData): string[] => {
  const errors: string[] = [];
  
  if (!data.name.trim()) {
    errors.push('Name is required');
  }
  
  if (!data.email.trim()) {
    errors.push('Email is required');
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.push('Please enter a valid email address');
  }
  
  if (!data.phone.trim()) {
    errors.push('Phone number is required');
  }
  
  if (!data.role) {
    errors.push('Role is required');
  }
  
  // Guardian-specific validation
  if (data.role === 'guardian') {
    if (!data.child_email?.trim()) {
      errors.push('Child email is required for guardians');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.child_email)) {
      errors.push('Please enter a valid child email address');
    }
    
    if (!data.child_phone?.trim()) {
      errors.push('Child phone number is required for guardians');
    }
  }
  
  return errors;
};

/**
 * Validate password change data
 */
export const validatePasswordData = (data: ChangePasswordData): string[] => {
  const errors: string[] = [];
  
  if (!data.current_password) {
    errors.push('Current password is required');
  }
  
  if (!data.new_password) {
    errors.push('New password is required');
  } else if (data.new_password.length < 8) {
    errors.push('New password must be at least 8 characters long');
  }
  
  if (!data.new_password_confirmation) {
    errors.push('Password confirmation is required');
  } else if (data.new_password !== data.new_password_confirmation) {
    errors.push('New password and confirmation do not match');
  }
  
  if (data.current_password === data.new_password) {
    errors.push('New password must be different from current password');
  }
  
  return errors;
};
