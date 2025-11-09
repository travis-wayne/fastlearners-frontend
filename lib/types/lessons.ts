// lib/types/lessons.ts

export interface LessonMeta {
  classes: Array<{ id: number; name: string }>;
  subjects: Array<{ id: number; name: string }>;
  terms: Array<{ id: number; name: string }>;
  weeks: Array<{ id: number; name: string }>;
}

export interface Lesson {
  id: number;
  title: string;
  description?: string;
  subject_id: number;
  class_id: number;
  term_id: number;
  week_id: number;
  created_at: string;
  updated_at: string;
  status?: "not_started" | "in_progress" | "completed";
  progress?: number;
}

export interface LessonContent {
  id: number;
  title: string;
  overview?: string;
  objectives?: string[];
  key_concepts?: Record<string, string>;
  concepts?: Array<{
    id: number;
    title: string;
    description: string;
    examples?: Array<{ title: string; content: string }>;
    exercises?: Array<{ title: string; content: string; check_markers?: any[] }>;
  }>;
  video_path?: string;
  content?: any;
  check_markers?: any[];
}

export interface LessonsListResponse {
  success: boolean;
  message: string;
  content: {
    data: Lesson[];
    meta?: {
      current_page: number;
      last_page: number;
      per_page: number;
      total: number;
    };
  } | null;
  code: number;
}

export interface LessonContentResponse {
  success: boolean;
  message: string;
  content: LessonContent | null;
  code: number;
}

export interface LessonMetaResponse {
  success: boolean;
  message: string;
  content: LessonMeta | null;
  code: number;
}
