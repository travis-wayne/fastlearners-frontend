import axios from 'axios';

const BASE_URL = 'https://fastlearnersapp.com/api/v1';

import { getTokenFromCookies } from '@/lib/auth-cookies';

// Get auth token from cookies (matching your auth store)
const getAuthToken = (): string | null => {
  return getTokenFromCookies();
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
  formData.append('check_markers_file', file);
    
    console.log('Simple upload - FormData contents:', formData.get('check_markers_file'));
    console.log('Simple upload - File details:', { name: file.name, size: file.size, type: file.type });
    
    const response = await axios.post(
      `${BASE_URL}/superadmin/lessons/uploads/check-markers`,
      formData,
      {
        headers: {
          ...createAuthHeaders(),
          'Accept': 'application/json',
          // Don't set Content-Type - let axios set it with boundary
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
