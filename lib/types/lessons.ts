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

// Concept description structure
export interface ConceptDescription {
  heading: string | null;
  description: string;
  image_path: string | null;
  points: string[];
}

// Example structure
export interface Example {
  id: number;
  order_index: number;
  concept_title: string;
  title: string;
  problem: string;
  solution_steps: string[];
  answer: string;
  created_at?: string;
  updated_at?: string;
}

// Exercise structure
export interface Exercise {
  id: number;
  order_index: number;
  concept_title: string;
  title?: string;
  problem: string;
  solution_steps?: string[];
  answers: string[];
  correct_answer: string;
  created_at?: string;
  updated_at?: string;
}

// General exercise structure
export interface GeneralExercise {
  id: number;
  order_index: number;
  lesson_topic: string;
  problem: string;
  solution_steps?: string[];
  answers: string[];
  correct_answer: string;
  created_at?: string;
  updated_at?: string;
}

// Concept structure
export interface Concept {
  id: number;
  order_index: number;
  lesson_topic?: string;
  title: string;
  description: ConceptDescription[];
  examples: Example[];
  exercises: Exercise[];
  created_at?: string;
  updated_at?: string;
}

// Lesson objective structure
export interface LessonObjective {
  description: string;
  points: string[];
}

export interface LessonContent {
  id: number;
  title?: string;
  topic?: string;
  class?: string;
  subject?: string;
  term?: string;
  week?: string | number;
  subject_id?: number; // Subject identifier for the lesson
  overview?: string;
  objectives?: LessonObjective[];
  key_concepts?: Record<string, string>;
  concepts?: Concept[];
  general_exercises?: GeneralExercise[];
  video_path?: string | null;
  content?: any;
  check_markers?: any[];
  summary?: string;
  application?: string;
  created_at?: string;
  updated_at?: string;
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
