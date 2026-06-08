import { ApiResponse } from "@/lib/types/auth";

export interface Package {
  id: number;
  name: string;
  slug: string;
  amount: string;
  original_amount: string | null;
  billing_cycle: "monthly" | "yearly";
  duration_days: number;
  description: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Subscription {
  id: number;
  package: string;
  reference: string;
  subscription_reference: string;
  starts_at: string;
  expires_at: string;
  status: "active" | "expired" | "pending";
  created_at: string;
}

export interface Transaction {
  id: number;
  package: string;
  coupon_code: string | null;
  reference: string;
  amount: string;
  discount_amount: string;
  final_amount: string;
  gateway: string;
  status: "successful" | "failed" | "pending";
  created_at: string;
  updated_at: string;
}

export interface PaymentStatusContent {
  transaction_details: {
    id: number;
    package?: string;
    coupon?: string | null;
    reference: string;
    amount?: string;
    discount_amount?: string;
    final_amount?: string;
    status: "success" | "failed" | "pending";
    created_at?: string;
  };
}

export interface Coupon {
  id: number;
  code: string;
  package_id: number;
  package_name: string;
  description: string | null;
  type: "percentage" | "fixed";
  value: string;
  minimum_amount: string;
  usage_limit: number;
  used_count: number;
  is_active: "active" | "inactive";
  expires_at: string;
  created_at: string;
  updated_at: string;
}

export interface AdminSubscription extends Subscription {
  user_name: string;
  user_email: string;
  is_first_subscription: boolean;
  updated_at: string;
}

export interface AdminTransaction extends Transaction {
  user_name: string;
  user_email: string;
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

export interface Paginated<T> {
  data: T[];
  links: PaginationLinks;
  meta: PaginationMeta;
}

export type PaginatedContent<K extends string, T> = {
  [key in K]: T[];
} & {
  links: PaginationLinks;
  meta: PaginationMeta;
};
