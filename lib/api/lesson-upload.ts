import axios from 'axios';

const BASE_URL = 'https://fastlearnersapp.com/api/v1';

// Types
export interface ApiResponse {
  success: boolean;
  message: string;
  content: any;
  code: number;
  errors?: any;
}

export interface UploadResult {
  success: boolean;
  message: string;
  error?: string;
}

import { getTokenFromCookies } from '@/lib/auth-cookies';

// Get auth token from cookies (matching your auth store)
const getAuthToken = (): string | null => {
  return getTokenFromCookies();
};

// Create axios instance with auth headers
const createAuthHeaders = () => {
  const token = getAuthToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// Generic upload function
const uploadFile = async (
  endpoint: string, 
  file: File, 
  fieldName: string
): Promise<UploadResult> => {
  try {
    const formData = new FormData();
    formData.append(fieldName, file);
    
    console.log(`Generic upload - ${fieldName}:`, formData.get(fieldName));
    console.log(`Generic upload - File details:`, { name: file.name, size: file.size, type: file.type });
    
    const response = await axios.post(`${BASE_URL}${endpoint}`, formData, {
      headers: {
        ...createAuthHeaders(),
        'Accept': 'application/json',
        // Don't set Content-Type - let axios set it with boundary
      },
    });
    
    return {
      success: true,
      message: response.data.message || 'Upload successful',
    };
  } catch (error: any) {
    let errorMessage = 'Upload failed';
    
    if (error.response?.data?.message) {
      errorMessage = error.response.data.message;
      
      // Add specific error details if available
      if (error.response?.data?.errors) {
        const errorDetails = error.response.data.errors;
        if (typeof errorDetails === 'object' && errorDetails !== null) {
          const detailsArray = Object.entries(errorDetails).map(([key, value]) => 
            `${key}: ${Array.isArray(value) ? value.join(', ') : value}`
          );
          errorMessage += ` - ${detailsArray.join('; ')}`;
        }
      }
    } else if (error.message) {
      errorMessage = error.message;
    }
    
    return {
      success: false,
      message: 'Upload failed',
      error: errorMessage,
    };
  }
};

// Individual upload functions
export const uploadLessons = (file: File): Promise<UploadResult> =>
  uploadFile('/superadmin/lessons/uploads/lessons', file, 'lessons_file');

export const uploadConcepts = (file: File): Promise<UploadResult> =>
  uploadFile('/superadmin/lessons/uploads/concepts', file, 'concepts_file');

export const uploadExamples = (file: File): Promise<UploadResult> =>
  uploadFile('/superadmin/lessons/uploads/examples', file, 'examples_file');

export const uploadExercises = (file: File): Promise<UploadResult> =>
  uploadFile('/superadmin/lessons/uploads/exercises', file, 'exercises_file');

export const uploadGeneralExercises = (file: File): Promise<UploadResult> =>
  uploadFile('/superadmin/lessons/uploads/general-exercises', file, 'general_exercises_file');

export const uploadCheckMarkers = (file: File): Promise<UploadResult> =>
  uploadFile('/superadmin/lessons/uploads/check-markers', file, 'check_markers_file');

export const uploadSchemeOfWork = (file: File): Promise<UploadResult> =>
  uploadFile('/superadmin/lessons/uploads/scheme-of-work', file, 'scheme_of_work_file');

// Bulk upload function
export const uploadAllLessonFiles = async (files: {
  lessons_file: File;
  concepts_file: File;
  examples_file: File;
  exercises_file: File;
  general_exercises_file: File;
  check_markers_file: File;
}): Promise<UploadResult> => {
  try {
    const formData = new FormData();
    
    Object.entries(files).forEach(([key, file]) => {
      formData.append(key, file);
    });
    
    const response = await axios.post(
      `${BASE_URL}/superadmin/lessons/uploads/all-lesson-files`,
      formData,
      {
        headers: {
          ...createAuthHeaders(),
          'Accept': 'application/json',
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    
    return {
      success: true,
      message: response.data.message || 'All files uploaded successfully',
    };
  } catch (error: any) {
    let errorMessage = 'Bulk upload failed';
    
    if (error.response?.data?.message) {
      errorMessage = error.response.data.message;
    } else if (error.message) {
      errorMessage = error.message;
    }
    
    return {
      success: false,
      message: 'Bulk upload failed',
      error: errorMessage,
    };
  }
};

// Upload configuration
export const UPLOAD_CONFIGS = [
  {
    key: 'lessons',
    title: 'Lessons',
    description: 'Upload lesson structure with topics, objectives, and key concepts',
    uploadFunction: uploadLessons,
    dependency: null, // First in order
    order: 1,
  },
  {
    key: 'concepts',
    title: 'Concepts',
    description: 'Upload detailed concept descriptions for lessons',
    uploadFunction: uploadConcepts,
    dependency: 'lessons',
    order: 2,
  },
  {
    key: 'examples',
    title: 'Examples',
    description: 'Upload worked examples for each concept',
    uploadFunction: uploadExamples,
    dependency: 'concepts',
    order: 3,
  },
  {
    key: 'exercises',
    title: 'Exercises',
    description: 'Upload practice exercises for concepts',
    uploadFunction: uploadExercises,
    dependency: 'concepts',
    order: 4,
  },
  {
    key: 'general_exercises',
    title: 'General Exercises',
    description: 'Upload general exercises for entire lessons',
    uploadFunction: uploadGeneralExercises,
    dependency: 'lessons',
    order: 5,
  },
  {
    key: 'check_markers',
    title: 'Check Markers',
    description: 'Upload assessment checkpoints and scoring',
    uploadFunction: uploadCheckMarkers,
    dependency: 'lessons',
    order: 6,
  },
  {
    key: 'scheme_of_work',
    title: 'Scheme of Work',
    description: 'Upload curriculum planning and breakdown',
    uploadFunction: uploadSchemeOfWork,
    dependency: null, // Independent
    order: 7,
  },
] as const;
