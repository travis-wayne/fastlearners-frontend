/**
 * Profile-related types for API responses and form data
 */

export interface ProfilePageData {
  classes: Array<{ name: string }>;
  roles: string[];
  discipline: Array<{ name: string }>;
}

export interface UsernameAvailabilityResponse {
  success: boolean;
  message: string;
  content: {
    is_available: boolean;
    username: string;
  } | null;
  code: number;
}

export interface ProfilePictureUploadResponse {
  success: boolean;
  message: string;
  content: {
    avatar: string;
  } | null;
  code: number;
}

