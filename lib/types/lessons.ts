// Base types for lesson metadata
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

// Lesson types
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

export interface LessonDetail extends Lesson {
  overview: string;
  objectives: LessonObjective[];
  key_concepts: Record<string, string>;
  summary: string;
  application: string;
  video_path: string | null;
}

export interface LessonObjective {
  description: string;
  points: string[];
}

// Content types
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

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  content: T;
  code: number;
}

export interface ApiErrorResponse {
  success: false;
  message: string;
  errors: Record<string, string[]> | null;
  code: number;
}

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

export interface PaginatedResponse<T> {
  data: T[];
  links: PaginationLinks;
  meta: PaginationMeta;
}

// Specific API response types
export interface LessonsMetadataResponse {
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

// Filter types for lesson queries
export interface LessonFilters {
  class: string;
  subject: string;
  term: string;
  week: string;
}

// UI state types
export interface LessonUIState {
  selectedLesson: LessonContent | null;
  currentSection: 'overview' | 'concepts' | 'exercises';
  completedSections: string[];
  progress: number;
}