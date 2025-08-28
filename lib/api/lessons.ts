import axios from 'axios';

const BASE_URL = 'https://fastlearnersapp.com/api/v1';

// Types
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  content: T;
  code: number;
}

export interface Class {
  id: number;
  name: string;
}

export interface Subject {
  id: number;
  name: string;
  class_id: number;
}

export interface ClassesAndSubjects {
  classes: Class[];
  subjects: Subject[];
}

export interface Lesson {
  id: number;
  class: string;
  subject: string;
  term: string;
  week: number;
  topic: string;
  overview: string;
  objectives: string[];
  key_concepts: string[];
  summary: string;
  application: string[];
  created_at: string;
  updated_at: string;
}

export interface Concept {
  id: number;
  lesson_name: string;
  concept_name: string;
  description: string;
  examples: string;
  exercises: string;
  created_at: string;
  updated_at: string;
}

export interface Example {
  id: number;
  concept_name: string;
  example_title: string;
  example_content: string;
  explanation: string;
  created_at: string;
  updated_at: string;
}

export interface Exercise {
  id: number;
  concept_name: string;
  question: string;
  options: string[];
  correct_answer: string;
  explanation: string;
  created_at: string;
  updated_at: string;
}

export interface GeneralExercise {
  id: number;
  lesson_name: string;
  question: string;
  options: string[];
  correct_answer: string;
  explanation: string;
  difficulty_level: string;
  created_at: string;
  updated_at: string;
}

export interface CheckMarker {
  id: number;
  lesson_name: string;
  marker_type: string;
  criteria: string;
  points: number;
  description: string;
  created_at: string;
  updated_at: string;
}

export interface LessonContent {
  lesson: Lesson;
  concepts: Concept[];
  examples: Example[];
  exercises: Exercise[];
  general_exercises: GeneralExercise[];
  check_markers: CheckMarker[];
}

export interface LessonsResponse {
  lessons: Lesson[];
  pagination: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number;
    to: number;
  };
}

// Get auth token from storage
const getAuthToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('access_token');
  }
  return null;
};

// Create axios instance with auth headers
const createAuthHeaders = () => {
  const token = getAuthToken();
  return token ? { 
    Authorization: `Bearer ${token}`,
    Accept: 'application/json'
  } : { Accept: 'application/json' };
};

// Get classes and subjects for filtering
export const getClassesAndSubjects = async (): Promise<ClassesAndSubjects> => {
  try {
    const response = await axios.get<ApiResponse<ClassesAndSubjects>>(
      `${BASE_URL}/superadmin/lessons`,
      { headers: createAuthHeaders() }
    );
    return response.data.content;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to fetch classes and subjects');
  }
};

// Get lessons with optional filtering
export const getLessons = async (params?: {
  class_id?: number;
  subject_id?: number;
  term?: string;
  week?: number;
  search?: string;
  page?: number;
  per_page?: number;
}): Promise<LessonsResponse> => {
  try {
    const queryParams = new URLSearchParams();
    
    if (params?.class_id) queryParams.append('class_id', params.class_id.toString());
    if (params?.subject_id) queryParams.append('subject_id', params.subject_id.toString());
    if (params?.term) queryParams.append('term', params.term);
    if (params?.week) queryParams.append('week', params.week.toString());
    if (params?.search) queryParams.append('search', params.search);
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.per_page) queryParams.append('per_page', params.per_page.toString());

    const url = `${BASE_URL}/superadmin/lessons/contents${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    
    const response = await axios.get<ApiResponse<LessonsResponse>>(
      url,
      { headers: createAuthHeaders() }
    );
    return response.data.content;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to fetch lessons');
  }
};

// Get specific lesson content by ID
export const getLessonContent = async (lessonId: number): Promise<LessonContent> => {
  try {
    const response = await axios.get<ApiResponse<LessonContent>>(
      `${BASE_URL}/superadmin/lessons/lesson/${lessonId}/`,
      { headers: createAuthHeaders() }
    );
    return response.data.content;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to fetch lesson content');
  }
};

// Delete lesson
export const deleteLesson = async (lessonId: number): Promise<{ success: boolean; message: string }> => {
  try {
    const response = await axios.delete<ApiResponse<any>>(
      `${BASE_URL}/superadmin/lessons/lesson/${lessonId}/`,
      { headers: createAuthHeaders() }
    );
    return {
      success: true,
      message: response.data.message || 'Lesson deleted successfully'
    };
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to delete lesson');
  }
};

// Get trashed lessons
export const getTrashedLessons = async (params?: {
  page?: number;
  per_page?: number;
}): Promise<LessonsResponse> => {
  try {
    const queryParams = new URLSearchParams();
    
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.per_page) queryParams.append('per_page', params.per_page.toString());

    const url = `${BASE_URL}/superadmin/lessons/trashed${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    
    const response = await axios.get<ApiResponse<LessonsResponse>>(
      url,
      { headers: createAuthHeaders() }
    );
    return response.data.content;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to fetch trashed lessons');
  }
};

// Restore lesson from trash
export const restoreLesson = async (lessonId: number): Promise<{ success: boolean; message: string }> => {
  try {
    const response = await axios.post<ApiResponse<any>>(
      `${BASE_URL}/superadmin/lessons/lesson/${lessonId}/restore/`,
      {},
      { headers: createAuthHeaders() }
    );
    return {
      success: true,
      message: response.data.message || 'Lesson restored successfully'
    };
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to restore lesson');
  }
};

// Permanently delete lesson
export const permanentlyDeleteLesson = async (lessonId: number): Promise<{ success: boolean; message: string }> => {
  try {
    const response = await axios.delete<ApiResponse<any>>(
      `${BASE_URL}/superadmin/lessons/lesson/${lessonId}/force-delete/`,
      { headers: createAuthHeaders() }
    );
    return {
      success: true,
      message: response.data.message || 'Lesson permanently deleted'
    };
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to permanently delete lesson');
  }
};
