/**
 * Profile Management API
 * Handles user profile operations including view, edit, and password change
 */

// Profile data interfaces
export interface UserProfile {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: "student" | "guest" | "guardian" | "teacher" | "admin" | "superadmin";
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
  role: "student" | "guest" | "guardian";
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
 * Uses internal /api/auth/session route which reads HttpOnly cookies
 */
export const getProfile = async (): Promise<UserProfile> => {
  try {
    const response = await fetch("/api/auth/session", {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Failed to fetch profile");
    }

    const data = await response.json();
    
    if (!data.success || !data.user) {
      throw new Error(data.message || "Failed to fetch profile");
    }

    return data.user as UserProfile;
  } catch (error: any) {
    throw new Error(error.message || "Failed to fetch profile information");
  }
};

/**
 * Update user profile information
 * Uses internal /api/profile/edit route which reads HttpOnly cookies
 */
export const updateProfile = async (
  profileData: ProfileEditData,
): Promise<UserProfile> => {
  try {
    const response = await fetch("/api/profile/edit", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(profileData),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      
      if (errorData.errors) {
        // Handle validation errors
        const errors = errorData.errors;
        const firstError = Object.values(errors)[0] as string[];
        throw new Error(firstError[0] || "Validation failed");
      }
      
      throw new Error(errorData.message || "Failed to update profile");
    }

    const data = await response.json();
    
    if (!data.success || !data.user) {
      throw new Error(data.message || "Failed to update profile");
    }

    return data.user as UserProfile;
  } catch (error: any) {
    throw new Error(error.message || "Failed to update profile");
  }
};

/**
 * Change user password
 * Note: This should be called after email verification for security
 * Uses internal /api/profile/edit/password route which reads HttpOnly cookies
 */
export const changePassword = async (
  passwordData: ChangePasswordData,
): Promise<UserProfile> => {
  try {
    const response = await fetch("/api/profile/edit/password", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(passwordData),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      
      if (errorData.errors) {
        // Handle validation errors
        const errors = errorData.errors;
        const firstError = Object.values(errors)[0] as string[];
        throw new Error(firstError[0] || "Validation failed");
      }
      
      throw new Error(errorData.message || "Failed to change password");
    }

    const data = await response.json();
    
    if (!data.success || !data.user) {
      throw new Error(data.message || "Failed to change password");
    }

    return data.user as UserProfile;
  } catch (error: any) {
    throw new Error(error.message || "Failed to change password");
  }
};

/**
 * Validate profile data before submission
 */
export const validateProfileData = (data: ProfileEditData): string[] => {
  const errors: string[] = [];

  if (!data.name.trim()) {
    errors.push("Name is required");
  }

  if (!data.email.trim()) {
    errors.push("Email is required");
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.push("Please enter a valid email address");
  }

  if (!data.phone.trim()) {
    errors.push("Phone number is required");
  }

  if (!data.role) {
    errors.push("Role is required");
  }

  // Guardian-specific validation
  if (data.role === "guardian") {
    if (!data.child_email?.trim()) {
      errors.push("Child email is required for guardians");
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.child_email)) {
      errors.push("Please enter a valid child email address");
    }

    if (!data.child_phone?.trim()) {
      errors.push("Child phone number is required for guardians");
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
    errors.push("Current password is required");
  }

  if (!data.new_password) {
    errors.push("New password is required");
  } else if (data.new_password.length < 8) {
    errors.push("New password must be at least 8 characters long");
  }

  if (!data.new_password_confirmation) {
    errors.push("Password confirmation is required");
  } else if (data.new_password !== data.new_password_confirmation) {
    errors.push("New password and confirmation do not match");
  }

  if (data.current_password === data.new_password) {
    errors.push("New password must be different from current password");
  }

  return errors;
};
