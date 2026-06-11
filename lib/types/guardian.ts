export interface GuardianRequestItem {
  id: number;
  guardian_name: string;
  guardian_email: string;
  status: "pending" | "accepted" | "rejected";
  response_date: string;
}

export interface ChildRequestItem {
  id: number;
  child_name: string;
  child_email: string;
  class: string;
  status: "pending" | "accepted" | "cancelled";
  response_date: string;
}

export interface PaginationLinks {
  first: string | null;
  last: string | null;
  prev: string | null;
  next: string | null;
}

export interface PaginationMeta {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

export interface PaginatedHistory<T> {
  request_history: T[];
  links: PaginationLinks;
  meta: PaginationMeta;
}

export interface GuardianActionResponse {
  success: boolean;
  message: string;
  content: null;
  code: number;
}

export interface StudentGuardianHistoryResponse {
  success: boolean;
  message: string;
  content: {
    history: PaginatedHistory<GuardianRequestItem>;
  } | null;
  code: number;
}

export interface GuardianChildrenHistoryResponse {
  success: boolean;
  message: string;
  content: {
    history: PaginatedHistory<ChildRequestItem>;
  } | null;
  code: number;
}

export interface GuardianChild {
  id: number;
  child_id: string;
  name: string;
  email: string;
  class: string;
  subscription_active: boolean;
  created_at: string;
}

export interface GuardianChildrenResponse {
  success: boolean;
  message: string;
  content: {
    children: GuardianChild[];
    links: PaginationLinks;
    meta: PaginationMeta;
  } | null;
  code: number;
}

export interface GuardianChildDetail {
  child_id: string;
  class_id: number;
  child_subjects: { id: number; name: string; slug: string }[];
}

export interface GuardianChildDetailResponse {
  success: boolean;
  message: string;
  content: GuardianChildDetail;
  code: number;
}

export interface LessonScore {
  id: number;
  child_id: string;
  child_name: string;
  class_id: number;
  class_name: string;
  subject_id: number;
  subject_name: string;
  lesson_id: number;
  lesson_topic: string;
  term_id: number;
  term_name: string;
  lesson_total_score: string;
  start_date: string;
  last_attempted_date: string;
}

export interface GuardianChildSubjectDetail {
  subject_total_score: string;
  lesson_scores: LessonScore[];
}

export interface GuardianChildSubjectDetailResponse {
  success: boolean;
  message: string;
  content: GuardianChildSubjectDetail;
  code: number;
}

export interface GuardianChildLessonDetail {
  lesson_summary: {
    overview: string;
    video: string;
    concepts: Record<string, string>;
    general_exercise: string;
  };
  lesson_total: string;
}

export interface GuardianChildLessonDetailResponse {
  success: boolean;
  message: string;
  content: GuardianChildLessonDetail;
  code: number;
}
