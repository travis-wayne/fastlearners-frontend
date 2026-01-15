export interface TrashedLesson {
  id: number;
  order_index: number;
  class: string;
  subject: string;
  term: string;
  week: number;
  topic: string;
  status: string;
  deleted_at: string;
  created_at: string;
  updated_at: string;
}

export interface TrashedLessonsResponse {
  lessons: TrashedLesson[];
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

export interface TrashActionResponse {
  success: boolean;
  message: string;
  content: null;
  code: number;
}
