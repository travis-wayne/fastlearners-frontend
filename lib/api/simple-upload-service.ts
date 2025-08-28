import axios from 'axios';

const BASE_URL = 'https://fastlearnersapp.com/api/v1';

// Get auth token from storage
const getAuthToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('access_token');
  }
  return null;
};

// Create axios instance with auth header
const createAuthHeaders = () => {
  const token = getAuthToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export interface SimpleUploadResult {
  success: boolean;
  message: string;
  error?: string;
}

// Simple upload function for check markers
export const uploadCheckMarkersSimple = async (file: File): Promise<SimpleUploadResult> => {
  try {
    const formData = new FormData();
    formData.append('check_marker_file', file);
    
    const response = await axios.post(
      `${BASE_URL}/superadmin/lessons/uploads/check-markers`,
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
      message: response.data?.message || 'Check markers uploaded successfully!'
    };
  } catch (error: any) {
    return {
      success: false,
      message: 'Upload failed',
      error: error.response?.data?.message || error.message || 'Unknown error occurred'
    };
  }
};

// Simple upload function for scheme of work
export const uploadSchemeOfWorkSimple = async (file: File): Promise<SimpleUploadResult> => {
  try {
    const formData = new FormData();
    formData.append('scheme_of_work_file', file);
    
    const response = await axios.post(
      `${BASE_URL}/superadmin/lessons/uploads/scheme-of-work`,
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
      message: response.data?.message || 'Scheme of work uploaded successfully!'
    };
  } catch (error: any) {
    return {
      success: false,
      message: 'Upload failed',
      error: error.response?.data?.message || error.message || 'Unknown error occurred'
    };
  }
};
