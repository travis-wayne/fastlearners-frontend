// Client-side lesson service - uses internal API routes for security

// Base API response interface
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  content: T;
  code: number;
  errors?: any;
}

// Metadata interfaces
export interface ClassItem {
  id: number;
  name: string;
}

export interface Subject {
  id: number;
  name: string;
}

export interface Term {
  id: number;
  name: string;
}
// - getTopicsBySubjectSlug(subjectSlug)
// - getLessonContentBySlug(subjectSlug, topicSlug)
// getLesson removed - use slug-based endpoints from lib/api/lessons.ts instead
// getLessonContent removed - use getLessonContentBySlug() from lib/api/lessons.ts instead

// Student/Guardian/Guest Dashboard APIs
export interface StudentDashboardData {
  name: string;
  subjects: string;
  lessons: string;
  progress: {
    subject: string;
    covered: number;
    left: number;
  };
  quizzes: string;
  subscription_status: string;
}

export interface GuardianDashboardData {
  children: number;
  report: any;
}

export interface GuestDashboardData {
  data: string;
}

export interface StudentSubjectsData {
  subjects: Subject[];
  compulsory_selective_status: string;
  compulsory_selective: Subject[];
  selective_status: string;
  selective: Subject[];
}

export const getStudentDashboard = async (): Promise<ApiResponse<StudentDashboardData>> => {
  const response = await fetch('/api/proxy/dashboard', {
    method: 'GET',
    credentials: 'include',
    headers: {
      'Accept': 'application/json',
    },
  });
  return await response.json();
};

export const getGuardianDashboard = async (): Promise<ApiResponse<GuardianDashboardData>> => {
  const response = await fetch('/api/proxy/guardian', {
    method: 'GET',
    credentials: 'include',
    headers: {
      'Accept': 'application/json',
    },
  });
  return await response.json();
};

export const getGuestDashboard = async (): Promise<ApiResponse<GuestDashboardData>> => {
  const response = await fetch('/api/proxy/guest', {
    method: 'GET',
    credentials: 'include',
    headers: {
      'Accept': 'application/json',
    },
  });
  return await response.json();
};

export const getStudentSubjects = async (): Promise<ApiResponse<StudentSubjectsData>> => {
  const response = await fetch('/api/subjects', {
    method: 'GET',
    credentials: 'include',
    headers: {
      'Accept': 'application/json',
    },
  });
  return await response.json();
};

export const updateCompulsorySelectiveSubject = async (
  subjectId: number
): Promise<ApiResponse<null>> => {
  const response = await fetch('/api/subjects/update-compulsory-selective', {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ subject: subjectId }),
  });
  return await response.json();
};

export const updateSelectiveSubjects = async (
  subjectIds: number[]
): Promise<ApiResponse<null>> => {
  // Format subjects as array for API
  const formData = new FormData();
  subjectIds.forEach(id => {
    formData.append('subjects[]', id.toString());
  });

  const response = await fetch('/api/subjects/update-selective', {
    method: 'POST',
    credentials: 'include',
    body: formData,
  });
  return await response.json();
};

// Error handling helper
export const isApiError = (error: any): error is { response: { data: ApiResponse } } => {
  return error?.response?.data?.success === false;
};

export const getErrorMessage = (error: any): string => {
  if (isApiError(error)) {
    return error.response.data.message || 'An error occurred';
  }
  if (error?.message) {
    return error.message;
  }
  return 'An unexpected error occurred';
};