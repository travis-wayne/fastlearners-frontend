export interface GuardianRequestItem {
  id: number;
  guardian_name: string;
  guardian_email: string;
  status: 'pending' | 'accepted' | 'rejected';
  response_date: string;
}

export interface ChildRequestItem {
  id: number;
  child_name: string;
  child_email: string;
  class: string;
  status: 'pending' | 'accepted' | 'cancelled';
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
