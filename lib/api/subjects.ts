// lib/api/subjects.ts

import type { SubjectsResponse, UpdateResponse, ClassesResponse } from '../types/subjects';

export async function getStudentSubjects(): Promise<SubjectsResponse> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 15000);

  try {
    const response = await fetch('/api/subjects', {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    const data = await response.json();

    if (response.ok) {
      return data as SubjectsResponse;
    } else {
      return {
        success: false,
        message: data.message || 'An error occurred',
        content: null,
        code: response.status as 401 | 422 | 500,
      };
    }
  } catch (error) {
    clearTimeout(timeoutId);
    return {
      success: false,
      message: 'Network error or timeout',
      content: null,
      code: 500,
    };
  }
}

export async function updateCompulsorySelective(subjectId: number): Promise<UpdateResponse> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 15000);

  try {
    const response = await fetch('/api/subjects/update-compulsory-selective', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({ subject: subjectId }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    const data = await response.json();

    if (response.ok) {
      return data as UpdateResponse;
    } else {
      return {
        success: false,
        message: data.message || 'An error occurred',
        content: null,
        code: response.status as 400 | 422 | 500,
      };
    }
  } catch (error) {
    clearTimeout(timeoutId);
    return {
      success: false,
      message: 'Network error or timeout',
      content: null,
      code: 500,
    };
  }
}

export async function updateSelectiveSubjects(subjectIds: number[]): Promise<UpdateResponse> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 15000);

  try {
    const response = await fetch('/api/subjects/update-selective', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({ subjects: subjectIds }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    const data = await response.json();

    if (response.ok) {
      return data as UpdateResponse;
    } else {
      return {
        success: false,
        message: data.message || 'An error occurred',
        content: null,
        code: response.status as 400 | 422 | 500,
      };
    }
  } catch (error) {
    clearTimeout(timeoutId);
    return {
      success: false,
      message: 'Network error or timeout',
      content: null,
      code: 500,
    };
  }
}

export async function getAvailableClasses(): Promise<ClassesResponse> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 15000);

  try {
    // Use the proxy route to get lessons data which includes classes
    const response = await fetch('/api/proxy/lessons/lessons', {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    const data = await response.json();

    if (response.ok && data.success && data.content?.classes) {
      return {
        success: true,
        message: data.message || 'Success',
        content: {
          classes: data.content.classes,
        },
        code: 200,
      };
    } else {
      return {
        success: false,
        message: data.message || 'No classes found',
        content: null,
        code: response.status as 401 | 404 | 500,
      };
    }
  } catch (error) {
    clearTimeout(timeoutId);
    return {
      success: false,
      message: 'Network error or timeout',
      content: null,
      code: 500,
    };
  }
}