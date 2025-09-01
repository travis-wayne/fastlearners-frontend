import axios from 'axios';
import { getTokenFromCookies } from '@/lib/auth-cookies';

const BASE_URL = 'https://fastlearnersapp.com/api/v1';

export interface DirectUploadResult {
  success: boolean;
  message: string;
  content?: any;
  error?: string;
}

/**
 * Direct check-markers upload that exactly matches HTTPie behavior
 * No format conversion, no validation - just direct upload
 */
export const uploadCheckMarkersDirectly = async (file: File): Promise<DirectUploadResult> => {
  try {
    const token = getTokenFromCookies();
    
    if (!token) {
      return {
        success: false,
        message: 'No authentication token found',
        error: 'Please log in again'
      };
    }

    console.log('🚀 Direct upload starting (using vanilla fetch)...');
    console.log('📁 File:', { name: file.name, size: file.size, type: file.type });
    console.log('🔑 Token present:', token ? 'Yes' : 'No');

    const formData = new FormData();
    formData.append('check_markers_file', file);

    console.log('📤 FormData created with file:', formData.get('check_markers_file'));
    console.log('📤 FormData entries:');
    const entries = Array.from(formData.entries());
    for (let [key, value] of entries) {
      console.log(`  ${key}:`, value);
    }

    // Log the request details before sending
    const url = `${BASE_URL}/superadmin/lessons/uploads/check-markers`;
    console.log('🎯 Request URL:', url);
    console.log('📨 Request headers will be:', {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json'
    });
    console.log('📦 Request body (FormData):', formData);
    
    // Attempt to inspect the FormData more thoroughly
    console.log('🔍 FormData inspection:');
    console.log('  has check_markers_file:', formData.has('check_markers_file'));
    const fileEntry = formData.get('check_markers_file');
    if (fileEntry instanceof File) {
      console.log('  File details:', {
        name: fileEntry.name,
        size: fileEntry.size,
        type: fileEntry.type,
        lastModified: fileEntry.lastModified
      });
    }
    
    // Use vanilla fetch to bypass ALL axios issues
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
        // DO NOT set Content-Type - let browser set multipart boundary
      },
      body: formData
    });

    console.log('📄 Response status:', response.status);
    console.log('📄 Response headers:', response.headers);
    
    const responseData = await response.json();
    console.log('📄 Response data:', responseData);

    if (!response.ok) {
      // Log detailed validation errors
      if (responseData.errors) {
        console.error('🚨 Validation errors:', responseData.errors);
        responseData.errors.forEach((error: any, index: number) => {
          console.error(`  Error ${index + 1}:`, error);
        });
      }
      throw new Error(`HTTP ${response.status}: ${responseData.message || 'Upload failed'}`);
    }

    console.log('✅ Upload successful!', responseData);

    return {
      success: true,
      message: responseData.message || 'Check markers uploaded successfully!',
      content: responseData.content
    };

  } catch (error: any) {
    console.error('❌ Upload failed:', error);
    console.error('🔍 Error details:', {
      name: error.name,
      message: error.message,
      stack: error.stack
    });

    // For fetch errors, we might have already parsed the response in the try block
    // The error could be from the response.json() or the Error we threw
    let errorMessage = 'Upload failed';

    if (error.message) {
      errorMessage = error.message;
    }

    return {
      success: false,
      message: errorMessage,
      error: errorMessage
    };
  }
};
