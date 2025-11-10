// lib/api/subjects.ts - Client-side service for subjects API

import type { 
  SubjectsResponse, 
  UpdateResponse, 
  ApiSubjectsResponse,
  ProfileData,
  DashboardData,
  SubjectItem
} from "@/lib/types/subjects";

import { API_BASE } from './client';

// Get user profile (direct backend call with token)
export async function getUserProfile(token: string): Promise<ProfileData> {
  const response = await fetch(`${API_BASE}/profile`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json',
    },
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error('Failed to fetch profile');
  }

  const data = await response.json();
  return data.content.user;
}

// Update user profile (class, discipline, term)
export async function updateProfile(
  token: string,
  data: {
    class: string;
    discipline?: string;
    term?: string;
    [key: string]: any;
  }
): Promise<ProfileData> {
  const response = await fetch(`${API_BASE}/profile/edit`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to update profile');
  }

  const result = await response.json();
  return result.content.user;
}

// Get available subjects for user (direct backend call with token)
export async function getSubjects(token: string): Promise<ApiSubjectsResponse['content']> {
  const response = await fetch(`${API_BASE}/subjects`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json',
    },
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error('Failed to fetch subjects');
  }

  const data = await response.json();
  return data.content;
}

// Update compulsory selective subject (1 religious study)
export async function updateCompulsorySelective(
  token: string,
  subjectId: number
): Promise<void> {
  const response = await fetch(`${API_BASE}/subjects/update-compulsory-selective`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ subject: subjectId }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to update compulsory selective');
  }
}

// Update selective subjects (JSS: 4, SSS: 5) - using FormData
export async function updateSelectiveSubjects(
  token: string,
  subjectIds: number[]
): Promise<void> {
  const formData = new FormData();
  subjectIds.forEach(id => {
    formData.append('subjects[]', id.toString());
  });

  const response = await fetch(`${API_BASE}/subjects/update-selective`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json',
    },
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to update selective subjects');
  }
}

// Get dashboard data
export async function getDashboard(token: string): Promise<DashboardData['content']> {
  const response = await fetch(`${API_BASE}/dashboard`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json',
    },
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error('Failed to fetch dashboard');
  }

  const data = await response.json();
  return data.content;
}

// Client-side functions using internal API routes (for browser use)
// These are kept for backward compatibility and security (tokens stay server-side)

export async function getStudentSubjects(): Promise<SubjectsResponse> {
  try {
    const res = await fetch("/api/subjects", {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
      cache: "no-store",
    });

    const data = await res.json();

    if (!res.ok) {
      return {
        success: false,
        message: data.message || "Failed to fetch subjects",
        content: null,
        code: res.status,
        errors: data.errors,
      };
    }

    return data as SubjectsResponse;
  } catch (err: any) {
    if (process.env.NEXT_PUBLIC_DEBUG_AUTH === "true") {
      console.error("getStudentSubjects error:", err);
    }
    return {
      success: false,
      message: err?.message || "Network error",
      content: null,
      code: 500,
    };
  }
}

export async function updateCompulsorySelectiveClient(
  subjectId: number
): Promise<UpdateResponse> {
  try {
    const res = await fetch("/api/subjects/update-compulsory-selective", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ subject: subjectId }),
      cache: "no-store",
    });

    const data = await res.json();

    if (!res.ok) {
      return {
        success: false,
        message: data.message || "Failed to update compulsory selective",
        content: null,
        code: res.status,
        errors: data.errors,
      };
    }

    return data as UpdateResponse;
  } catch (err: any) {
    if (process.env.NEXT_PUBLIC_DEBUG_AUTH === "true") {
      console.error("updateCompulsorySelective error:", err);
    }
    return {
      success: false,
      message: err?.message || "Network error",
      content: null,
      code: 500,
    };
  }
}

export async function updateSelectiveSubjectsClient(
  subjectIds: number[]
): Promise<UpdateResponse> {
  try {
    const res = await fetch("/api/subjects/update-selective", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ subjects: subjectIds }),
      cache: "no-store",
    });

    const data = await res.json();

    if (!res.ok) {
      return {
        success: false,
        message: data.message || "Failed to update selective subjects",
        content: null,
        code: res.status,
        errors: data.errors,
      };
    }

    return data as UpdateResponse;
  } catch (err: any) {
    if (process.env.NEXT_PUBLIC_DEBUG_AUTH === "true") {
      console.error("updateSelectiveSubjects error:", err);
    }
    return {
      success: false,
      message: err?.message || "Network error",
      content: null,
      code: 500,
    };
  }
}

// Note: The direct backend functions (with token parameter) are the primary API.
// The Client functions (using internal routes) are kept for backward compatibility.
// For new code, prefer the direct functions when you have access to the token.
