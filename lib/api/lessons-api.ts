// New lesson service matching the exact API structure
import axios from 'axios';
import { getTokenFromCookies } from '@/lib/auth-cookies';

// Use server-side direct base in SSR, proxy in browser to avoid CORS
const BASE_URL = typeof window === 'undefined' ? 'https://fastlearnersapp.com/api/v1' : '/api/proxy';

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

export interface Week {
  id: number;
  name: number;
}

// Lesson interfaces
export interface Lesson {
  id: number;
  class: string;
  subject: string;
  term: string;
  week: number;
  topic: string;
  status: 'active' | 'inactive';
  created_at: string;
  updated_at: string;
}

export interface LessonObjective {
  description: string;
  points: string[];
}

export interface LessonDetail extends Lesson {
  overview: string;
  objectives: LessonObjective[];
  key_concepts: Record<string, string>;
  summary: string;
  application: string;
  video_path: string | null;
}

// Content interfaces
export interface ConceptDescription {
  heading: string | null;
  description: string;
  image_path: string | null;
  points: string[];
}

export interface Example {
  id: number;
  order_index: number;
  concept_title: string;
  title: string;
  problem: string;
  solution_steps: string[];
  answer: string;
  created_at: string;
  updated_at: string;
}

export interface Exercise {
  id: number;
  order_index: number;
  concept_title: string;
  title: string;
  problem: string;
  solution_steps: string[];
  answers: string[];
  correct_answer: string;
  created_at: string;
  updated_at: string;
}

export interface Concept {
  id: number;
  order_index: number;
  lesson_topic: string;
  title: string;
  description: ConceptDescription[];
  created_at: string;
  updated_at: string;
  examples: Example[];
  exercises: Exercise[];
}

export interface GeneralExercise {
  id: number;
  order_index: number;
  lesson_topic: string;
  problem: string;
  solution_steps: string[];
  answers: string[];
  correct_answer: string;
  created_at: string;
  updated_at: string;
}

export interface CheckMarker {
  id: number;
  lesson_topic: string;
  overview: number;
  lesson_video: number;
  concept_one: number;
  concept_two: number;
  concept_three: number;
  concept_four: number;
  concept_five: number;
  concept_six: number;
  concept_seven: number;
  general_exercises: number;
  created_at: string;
  updated_at: string;
}

export interface LessonContent extends LessonDetail {
  concepts: Concept[];
  general_exercises: GeneralExercise[];
  check_markers: CheckMarker[];
}

// Pagination interfaces
export interface PaginationLinks {
  first: string;
  last: string;
  prev: string | null;
  next: string | null;
}

export interface PaginationMeta {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

// API response interfaces
export interface MetadataResponse {
  classes: ClassItem[];
  subjects: Subject[];
  terms: Term[];
  weeks: Week[];
}

export interface LessonsListResponse {
  lessons: Lesson[];
  links: PaginationLinks;
  meta: PaginationMeta;
}

export interface LessonFilters {
  class: string;
  subject: string;
  term: string;
  week: string;
}

// Auth helper
const getAuthHeaders = () => {
  const token = getTokenFromCookies();
  return {
    'Authorization': `Bearer ${token}`,
    'Accept': 'application/json',
  };
};

// API functions
export const getLessonsMetadata = async (): Promise<ApiResponse<MetadataResponse>> => {
  const response = await axios.get(
    `${BASE_URL}/superadmin/lessons/get-classes-subjects-terms-weeks`,
    { headers: getAuthHeaders() }
  );
  return response.data;
};

export const getLessons = async (
  filters: LessonFilters
): Promise<ApiResponse<LessonsListResponse>> => {
  const response = await axios.post(
    `${BASE_URL}/superadmin/lessons/lessons/`,
    filters,
    { 
      headers: {
        ...getAuthHeaders(),
        'Content-Type': 'application/json'
      }
    }
  );
  return response.data;
};

export const getLesson = async (
  lessonId: number
): Promise<ApiResponse<LessonDetail>> => {
  const response = await axios.get(
    `${BASE_URL}/superadmin/lessons/lesson/${lessonId}`,
    { headers: getAuthHeaders() }
  );
  return response.data;
};

export const getLessonContent = async (
  lessonId: number
): Promise<ApiResponse<LessonContent>> => {
  const response = await axios.get(
    `${BASE_URL}/superadmin/lessons/lesson/${lessonId}/content`,
    { headers: getAuthHeaders() }
  );
  return response.data;
};

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
  const response = await axios.get(
    `${BASE_URL}/dashboard`,
    { headers: getAuthHeaders() }
  );
  return response.data;
};

export const getGuardianDashboard = async (): Promise<ApiResponse<GuardianDashboardData>> => {
  const response = await axios.get(
    `${BASE_URL}/guardian`,
    { headers: getAuthHeaders() }
  );
  return response.data;
};

export const getGuestDashboard = async (): Promise<ApiResponse<GuestDashboardData>> => {
  const response = await axios.get(
    `${BASE_URL}/guest`,
    { headers: getAuthHeaders() }
  );
  return response.data;
};

export const getStudentSubjects = async (): Promise<ApiResponse<StudentSubjectsData>> => {
  const response = await axios.get(
    `${BASE_URL}/subjects`,
    { headers: getAuthHeaders() }
  );
  return response.data;
};

export const updateCompulsorySelectiveSubject = async (
  subjectId: number
): Promise<ApiResponse<null>> => {
  const response = await axios.post(
    `${BASE_URL}/subjects/update-compulsory-selective`,
    { subject: subjectId },
    { 
      headers: {
        ...getAuthHeaders(),
        'Content-Type': 'application/json'
      }
    }
  );
  return response.data;
};

export const updateSelectiveSubjects = async (
  subjectIds: number[]
): Promise<ApiResponse<null>> => {
  // Format subjects as array for API
  const formData = new FormData();
  subjectIds.forEach(id => {
    formData.append('subjects[]', id.toString());
  });

  const response = await axios.post(
    `${BASE_URL}/subjects/update-selective`,
    formData,
    { 
      headers: {
        ...getAuthHeaders(),
        'Content-Type': 'multipart/form-data'
      }
    }
  );
  return response.data;
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