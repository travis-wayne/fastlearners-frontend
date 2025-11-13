/**
 * Profile Management API
 * Handles user profile operations including view, edit, and password change
 */

// Using fetch with credentials for internal API routes

// Profile data interfaces
export interface UserProfile {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: string[];
  email_verified_at: string | null;
  phone_verified_at: string | null;
  created_at: string;
  updated_at: string;
  // Guardian-specific fields
  child_email?: string;
  child_phone?: string;
  // Additional fields from API
  username: string | null;
  school: string | null;
  class: string | null;
  discipline: string | null;
  date_of_birth: string | null;
  country: string | null;
  state: string | null;
  city: string | null;
  address: string | null;
  gender: string | null;
  status: string;
}

export interface ProfileResponse {
  success: boolean;
  message: string;
  content: {
    user: UserProfile;
  };
}

export interface ProfileEditData {
  name?: string;
  phone?: string;
  role?: "student" | "guest" | "guardian";
  // Required only for guardians
  child_email?: string;
  child_phone?: string;
  // Additional fields
  username?: string;
  school?: string;
  class?: string;
  discipline?: string;
  date_of_birth?: string;
  country?: string;
  state?: string;
  city?: string;
  address?: string;
  gender?: string;
}

export interface ChangePasswordData {
  current_password: string;
  new_password: string;
  new_password_confirmation: string;
}

export interface ChangePasswordResponse {
  success: boolean;
  message: string;
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
    const response = await fetch("/api/profile", {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
      credentials: "include",
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Failed to fetch profile");
    }
    
    const data = await response.json() as ProfileResponse;

    if (!data.success) {
      throw new Error(data.message || "Failed to fetch profile");
    }

    return data.content.user;
  } catch (error: any) {
    if (error.message) {
      throw error;
    }
    throw new Error("Failed to fetch profile information");
  }
};

/**
 * Update user profile information
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
        // Handle validation errors - collect all error messages
        const errors = errorData.errors;
        const errorMessages: string[] = [];
        
        // Collect all error messages from all fields
        Object.entries(errors).forEach(([field, messages]) => {
          const msgArray = Array.isArray(messages) ? messages : [messages];
          msgArray.forEach(msg => {
            if (typeof msg === 'string') {
              errorMessages.push(msg);
            }
          });
        });
        
        // Return all error messages joined, or just the first if only one
        if (errorMessages.length > 0) {
          throw new Error(errorMessages.length === 1 
            ? errorMessages[0] 
            : errorMessages.join('; '));
        }
        
        throw new Error("Validation failed");
      }
      
      throw new Error(errorData.message || "Failed to update profile");
    }

    const data = await response.json();
    
    if (!data.success || !data.content?.user) {
      throw new Error(data.message || "Failed to update profile");
    }

    return data.content.user as UserProfile;
  } catch (error: any) {
    if (error.message) {
      throw error;
    }
    throw new Error("Failed to update profile");
  }
};

/**
 * Change user password
 * Note: This should be called after email verification for security
 */
export const changePassword = async (
  passwordData: ChangePasswordData,
): Promise<void> => {
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

    const data = await response.json() as ChangePasswordResponse;

    if (!data.success) {
      throw new Error(data.message || "Failed to change password");
    }

    // Password change successful, no user data returned
    return;
  } catch (error: any) {
    if (error.message) {
      throw error;
    }
    throw new Error("Failed to change password");
  }
};

/**
 * Get profile metadata (classes, roles, disciplines)
 */
export const getProfileData = async (): Promise<{ classes: Array<{ name: string }>; roles: string[]; discipline: Array<{ name: string }> }> => {
  try {
    const response = await fetch("/api/profile/data", {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
      credentials: "include",
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Failed to fetch profile data");
    }
    
    const data = await response.json();

    if (!data.success) {
      throw new Error(data.message || "Failed to fetch profile data");
    }

    return data.content;
  } catch (error: any) {
    if (error.message) {
      throw error;
    }
    throw new Error("Failed to fetch profile metadata");
  }
};

/**
 * Validate profile data before submission
 * Only enforces fields relevant to the current role context
 */
export const validateProfileData = (data: ProfileEditData): string[] => {
  const errors: string[] = [];

  // Basic validations - always required
  if (!data.name?.trim()) {
    errors.push("Name is required");
  }

  // Phone format validation if provided (not universally required)
  // Let backend handle nuanced requirements

  // Role validation - only for student/guardian (not guest)
  if (data.role && !['student', 'guardian'].includes(data.role)) {
    errors.push("Role must be student or guardian");
  }

  // Student-specific validations (only if role is student)
  if (data.role === "student") {
    // Student fields are optional - backend will enforce what's needed
    // Only validate format if provided
  }

  // Guardian-specific validation (only if role is guardian)
  if (data.role === "guardian") {
    if (data.child_email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.child_email)) {
      errors.push("Please enter a valid child email address");
    }
    // Let backend enforce required fields for guardians
  }

  // Format validations for optional fields (only if provided)
  if (data.discipline && !['Art', 'Commercial', 'Science'].includes(data.discipline)) {
    errors.push("Discipline must be Art, Commercial, or Science");
  }

  if (data.class && !['JSS1', 'JSS2', 'JSS3', 'SSS1', 'SSS2', 'SSS3'].includes(data.class)) {
    errors.push("Class must be JSS1-JSS3 or SSS1-SSS3");
  }

  if (data.date_of_birth && !/^\d{2}\/\d{2}\/\d{4}$/.test(data.date_of_birth)) {
    errors.push("Date of birth must be in DD/MM/YYYY format");
  }

  if (data.gender && !['male', 'female'].includes(data.gender)) {
    errors.push("Gender must be male or female");
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