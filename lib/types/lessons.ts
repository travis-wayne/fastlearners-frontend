// lib/types/lessons.ts

export interface LessonMeta {
  classes: Array<{ id: number; name: string }>;
  subjects: Array<{ id: number; name: string }>;
  terms: Array<{ id: number; name: string }>;
  weeks: Array<{ id: number; name: string }>;
}

export interface SubjectWithSlug {
  id: number;
  name: string;
  slug: string;
}

export interface Lesson {
  id: number;
  title?: string; // Optional for backward compatibility
  topic?: string; // API returns this
  description?: string;
  subject_id?: number; // Optional - API may return subject as string
  class_id?: number; // Optional - API may return class as string
  term_id?: number; // Optional - API may return term as string
  week_id?: number; // Optional - API may return week as number
  class?: string; // API returns this
  subject?: string; // API returns this
  term?: string; // API returns this
  week?: number | string; // API returns this
  created_at: string;
  updated_at: string;
  status?: "not_started" | "in_progress" | "completed";
  progress?: number;
}

export interface TopicItem {
  id: number;
  topic: string;
  slug: string;
  week: number;
  order_index: number;
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

export interface TopicsByTerm {
  first_term: TopicItem[];
  second_term: TopicItem[];
  third_term: TopicItem[];
}

/**
 * Map internal term IDs to API keys
 */
export function mapTermIdToApiKey(termId: string): keyof TopicsByTerm {
  const termKeyMap: Record<string, keyof TopicsByTerm> = {
    'term1': 'first_term',
    'term2': 'second_term',
    'term3': 'third_term',
  };
  return termKeyMap[termId] || 'first_term';
}

/**
 * Safely get topics for a term, defaulting to empty array if undefined
 */
export function getTopicsForTerm(
  topics: TopicsByTerm | undefined,
  termId: string
): TopicItem[] {
  if (!topics) return [];
  const apiKey = mapTermIdToApiKey(termId);
  return topics[apiKey] || [];
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

export interface TopicOverview {
  introduction: string;
  concepts_count: number;
  summary: string;
  application: string;
  general_exercises: string;
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

export interface SubjectsWithSlugsResponse {
  success: boolean;
  message: string;
  content: { subjects: SubjectWithSlug[] } | null;
  code: number;
}

export interface TopicsResponse {
  success: boolean;
  message: string;
  content: { topics: TopicsByTerm } | null;
  code: number;
}

export interface TopicOverviewResponse {
  success: boolean;
  message: string;
  content: { overview: TopicOverview } | null;
  code: number;
}

export interface LessonCheckResponse {
  success: boolean;
  message: string;
  content: {
    check?: {
      is_completed: boolean;
      [key: string]: any;
    };
    [key: string]: any;
  } | null;
  code: number;
}

export interface ExerciseAnswerContent {
  score: string;
  attempt: string;
  concept_total_score?: string;
  concept_weight?: string;
  general_exercise_total_score?: string;
  general_exercise_weight?: string;
}

export interface ExerciseCheckResponse {
  success: boolean;
  message: string;
  content: ExerciseAnswerContent | null;
  code: number;
  isCorrect?: boolean;
  errors?: any;
}

export interface LessonFilters {
  class: string;
  subject: string;
  term: string;
  week: string;
}

export interface ConceptScoreResponse {
  success: boolean;
  message: string;
  content: {
    concept_id: number;
    total_score: string;
    weight: string;
  } | null;
  code: number;
}

export interface GeneralExerciseScoreResponse {
  success: boolean;
  message: string;
  content: {
    total_score: string;
    weight: string;
  } | null;
  code: number;
}

export interface LessonScoreResponse {
  success: boolean;
  message: string;
  content: {
    lesson_total_score: string;
  } | null;
  code: number;
}

export interface SubjectScoreResponse {
  success: boolean;
  message: string;
  content: {
    subject_total_score: string;
  } | null;
  code: number;
}