// Import types from separate file for better organization
import {
  ApiResponse,
  ApiErrorResponse,
  LessonsMetadataResponse,
  LessonsListResponse,
  LessonDetail,
  LessonContent,
  LessonFilters,
} from '@/lib/types/lessons';

const BASE_URL = 'https://fastlearnersapp.com/api/v1/superadmin';

// Generic error handler for API responses
class LessonsApiError extends Error {
  constructor(
    message: string,
    public code: number,
    public errors?: Record<string, string[]> | null
  ) {
    super(message);
    this.name = 'LessonsApiError';
  }
}

import { getTokenFromCookies } from '@/lib/auth-cookies';

// Helper function to get auth headers
function getAuthHeaders(): HeadersInit {
  const token = getTokenFromCookies();
  
  if (!token) {
    console.warn('No auth token found');
  }
  
  return {
    'Authorization': `Bearer ${token}`,
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  };
}

// Helper function to handle API responses
async function handleApiResponse<T>(response: Response): Promise<T> {
  const data = await response.json();
  
  if (!response.ok || !data.success) {
    const errorData = data as ApiErrorResponse;
    throw new LessonsApiError(
      errorData.message || 'An error occurred',
      errorData.code || response.status,
      errorData.errors
    );
  }
  
  return (data as ApiResponse<T>).content;
}

/**
 * Get classes, subjects, terms, and weeks metadata
 */
export async function getLessonsMetadata(): Promise<LessonsMetadataResponse> {
  try {
    const response = await fetch(`${BASE_URL}/lessons/get-classes-subjects-terms-weeks`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    
    return await handleApiResponse<LessonsMetadataResponse>(response);
  } catch (error) {
    if (error instanceof LessonsApiError) {
      throw error;
    }
    throw new LessonsApiError('Failed to fetch lessons metadata', 500);
  }
}

/**
 * Get lessons filtered by class, subject, term, and week
 */
export async function getLessons(filters: LessonFilters): Promise<LessonsListResponse> {
  try {
    const response = await fetch(`${BASE_URL}/lessons/lessons/`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(filters),
    });
    
    return await handleApiResponse<LessonsListResponse>(response);
  } catch (error) {
    if (error instanceof LessonsApiError) {
      throw error;
    }
    throw new LessonsApiError('Failed to fetch lessons', 500);
  }
}

/**
 * Get specific lesson details by ID
 */
export async function getLessonById(lessonId: number): Promise<LessonDetail> {
  try {
    const response = await fetch(`${BASE_URL}/lessons/lesson/${lessonId}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    
    return await handleApiResponse<LessonDetail>(response);
  } catch (error) {
    if (error instanceof LessonsApiError) {
      throw error;
    }
    throw new LessonsApiError('Failed to fetch lesson details', 500);
  }
}

/**
 * Get specific lesson content by ID (includes concepts, exercises, etc.)
 */
export async function getLessonContent(lessonId: number): Promise<LessonContent> {
  try {
    const response = await fetch(`${BASE_URL}/lessons/lesson/${lessonId}/content`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    
    return await handleApiResponse<LessonContent>(response);
  } catch (error) {
    if (error instanceof LessonsApiError) {
      throw error;
    }
    throw new LessonsApiError('Failed to fetch lesson content', 500);
  }
}

/**
 * Get lessons with pagination support
 */
export async function getLessonsPaginated(
  filters: LessonFilters,
  page = 1,
  perPage = 20
): Promise<LessonsListResponse> {
  try {
    const url = new URL(`${BASE_URL}/lessons/lessons/`);
    url.searchParams.append('page', page.toString());
    url.searchParams.append('per_page', perPage.toString());
    
    const response = await fetch(url.toString(), {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(filters),
    });
    
    return await handleApiResponse<LessonsListResponse>(response);
  } catch (error) {
    if (error instanceof LessonsApiError) {
      throw error;
    }
    throw new LessonsApiError('Failed to fetch paginated lessons', 500);
  }
}

// Export the error class for use in components
export { LessonsApiError };

// Helper function to check if user is authorized (can be used in components)
export function isUnauthorized(error: unknown): boolean {
  return error instanceof LessonsApiError && error.code === 401;
}

// Helper function to check if it's a validation error
export function isValidationError(error: unknown): boolean {
  return error instanceof LessonsApiError && error.code === 422;
}

// Helper function to get validation errors
export function getValidationErrors(error: unknown): Record<string, string[]> | null {
  if (error instanceof LessonsApiError && error.errors) {
    return error.errors;
  }
  return null;
}
