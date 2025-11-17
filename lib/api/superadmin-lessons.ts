// Superadmin lessons API client - uses internal API routes

export interface Class {
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

export interface MetadataResponse {
  classes: Class[];
  subjects: Subject[];
  terms: Term[];
  weeks: Week[];
}

export interface Lesson {
  id: number;
  class: string;
  subject: string;
  term: string;
  week: number;
  topic: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface LessonsListResponse {
  lessons: Lesson[];
  links: {
    first: string;
    last: string;
    prev: string | null;
    next: string | null;
  };
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}

export interface LessonDetail {
  id: number;
  class: string;
  subject: string;
  term: string;
  week: number;
  topic: string;
  overview: string;
  objectives: Array<{
    description: string;
    points: string[];
  }>;
  key_concepts: Record<string, string>;
  summary: string;
  application: string;
  video_path: string | null;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface Concept {
  id: number;
  order_index: number;
  lesson_topic: string;
  title: string;
  description: Array<{
    heading: string | null;
    description: string;
    image_path: string | null;
    points: string[];
  }>;
  created_at: string;
  updated_at: string;
  examples: Example[];
  exercises: Exercise[];
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

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  content: T | null;
  code: number;
  errors?: Record<string, string[]>;
}

// Get metadata (classes, subjects, terms, weeks)
export async function getLessonsMetadata(): Promise<ApiResponse<MetadataResponse>> {
  try {
    const response = await fetch("/api/superadmin/lessons/metadata", {
      method: "GET",
      credentials: "include",
      headers: {
        Accept: "application/json",
      },
    });

    const data = await response.json();
    return data;
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to fetch metadata",
      content: null,
      code: 500,
    };
  }
}

// Get lessons with filters
export async function getLessons(filters: {
  class: string;
  subject: string;
  term: string;
  week: string;
}): Promise<ApiResponse<LessonsListResponse>> {
  try {
    const response = await fetch("/api/superadmin/lessons/list", {
      method: "POST",
      credentials: "include",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(filters),
    });

    const data = await response.json();
    return data;
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to fetch lessons",
      content: null,
      code: 500,
    };
  }
}

// Get specific lesson
export async function getLessonById(id: number): Promise<ApiResponse<LessonDetail>> {
  try {
    const response = await fetch(`/api/superadmin/lessons/${id}`, {
      method: "GET",
      credentials: "include",
      headers: {
        Accept: "application/json",
      },
    });

    const data = await response.json();
    return data;
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to fetch lesson",
      content: null,
      code: 500,
    };
  }
}

// Get lesson content (with concepts, examples, exercises, etc.)
export async function getLessonContent(id: number): Promise<ApiResponse<LessonContent>> {
  try {
    const response = await fetch(`/api/superadmin/lessons/${id}/content`, {
      method: "GET",
      credentials: "include",
      headers: {
        Accept: "application/json",
      },
    });

    const data = await response.json();
    return data;
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to fetch lesson content",
      content: null,
      code: 500,
    };
  }
}

// Helper to extract error message
export function getErrorMessage(error: any): string {
  if (error?.message) return error.message;
  if (typeof error === "string") return error;
  return "An unexpected error occurred";
}

