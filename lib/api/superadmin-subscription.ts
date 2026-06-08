import { ApiResponse } from "@/lib/types/auth";
import {
  Package,
  Coupon,
  AdminSubscription,
  AdminTransaction,
  PaginatedContent,
} from "@/lib/types/subscription";

export interface CreatePackageData {
  name: string;
  amount: string | number;
  billing_cycle: "monthly" | "yearly";
  duration_days: number;
  description?: string | null;
  original_amount?: string | number | null;
}

export interface UpdatePackageData extends Partial<CreatePackageData> {}

export interface CreateCouponData {
  code: string;
  package_id: number;
  type: "percentage" | "fixed";
  value: number;
  minimum_amount: number;
  usage_limit: number;
  expires_at: string;
  description?: string | null;
}

export interface UpdateCouponData extends Partial<CreateCouponData> {}

// Package functions
export async function adminGetPackages(): Promise<ApiResponse<{ packages: Package[] }>> {
  try {
    const res = await fetch("/api/proxy/superadmin/packages", {
      method: "GET",
      headers: { Accept: "application/json" },
      credentials: "include",
    });
    return await res.json();
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to fetch packages",
      content: null,
      code: 500,
    };
  }
}

export async function adminGetPackage(id: number): Promise<ApiResponse<{ package: Package }>> {
  try {
    const res = await fetch(`/api/proxy/superadmin/packages/${id}/view`, {
      method: "GET",
      headers: { Accept: "application/json" },
      credentials: "include",
    });
    return await res.json();
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to fetch package",
      content: null,
      code: 500,
    };
  }
}

export async function adminCreatePackage(
  data: CreatePackageData
): Promise<ApiResponse<{ package: Package }>> {
  try {
    const res = await fetch("/api/proxy/superadmin/packages/create", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(data),
    });
    return await res.json();
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to create package",
      content: null,
      code: 500,
    };
  }
}

export async function adminUpdatePackage(
  id: number,
  data: UpdatePackageData
): Promise<ApiResponse<{ package: Package }>> {
  try {
    const res = await fetch(`/api/proxy/superadmin/packages/${id}/update`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(data),
    });
    return await res.json();
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to update package",
      content: null,
      code: 500,
    };
  }
}

export async function adminDeletePackage(id: number): Promise<ApiResponse<any>> {
  try {
    const res = await fetch(`/api/proxy/superadmin/packages/${id}/delete`, {
      method: "DELETE",
      headers: { Accept: "application/json" },
      credentials: "include",
    });
    return await res.json();
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to delete package",
      content: null,
      code: 500,
    };
  }
}

export async function adminUpdatePackageStatus(id: number): Promise<ApiResponse<any>> {
  try {
    const res = await fetch(`/api/proxy/superadmin/packages/${id}/update-status`, {
      method: "POST",
      headers: { Accept: "application/json" },
      credentials: "include",
    });
    return await res.json();
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to update package status",
      content: null,
      code: 500,
    };
  }
}

// Coupon functions
export async function adminGetCoupons(
  page?: number
): Promise<ApiResponse<PaginatedContent<"coupons", Coupon>>> {
  try {
    const url = page && page > 1 
      ? `/api/proxy/superadmin/coupons?page=${page}`
      : "/api/proxy/superadmin/coupons";
    const res = await fetch(url, {
      method: "GET",
      headers: { Accept: "application/json" },
      credentials: "include",
    });
    const data = await res.json();
    if (data.success && Array.isArray(data.content)) {
      data.content = data.content[0];
    }
    return data;
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to fetch coupons",
      content: null,
      code: 500,
    };
  }
}

export async function adminGetCoupon(id: number): Promise<ApiResponse<{ coupon: Coupon }>> {
  try {
    const res = await fetch(`/api/proxy/superadmin/coupons/${id}/view`, {
      method: "GET",
      headers: { Accept: "application/json" },
      credentials: "include",
    });
    return await res.json();
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to fetch coupon",
      content: null,
      code: 500,
    };
  }
}

export async function adminCreateCoupon(
  data: CreateCouponData
): Promise<ApiResponse<{ coupon: Coupon }>> {
  try {
    const res = await fetch("/api/proxy/superadmin/coupons/create", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(data),
    });
    return await res.json();
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to create coupon",
      content: null,
      code: 500,
    };
  }
}

export async function adminUpdateCoupon(
  id: number,
  data: UpdateCouponData
): Promise<ApiResponse<{ coupon: Coupon }>> {
  try {
    const res = await fetch(`/api/proxy/superadmin/coupons/${id}/update`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(data),
    });
    return await res.json();
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to update coupon",
      content: null,
      code: 500,
    };
  }
}

export async function adminDeleteCoupon(id: number): Promise<ApiResponse<any>> {
  try {
    const res = await fetch(`/api/proxy/superadmin/coupons/${id}/delete`, {
      method: "DELETE",
      headers: { Accept: "application/json" },
      credentials: "include",
    });
    return await res.json();
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to delete coupon",
      content: null,
      code: 500,
    };
  }
}

export async function adminUpdateCouponStatus(id: number): Promise<ApiResponse<any>> {
  try {
    const res = await fetch(`/api/proxy/superadmin/coupons/${id}/update-status`, {
      method: "POST",
      headers: { Accept: "application/json" },
      credentials: "include",
    });
    return await res.json();
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to update coupon status",
      content: null,
      code: 500,
    };
  }
}

export async function adminSearchCoupons(
  searchTerm: string,
  page?: number
): Promise<ApiResponse<PaginatedContent<"coupons", Coupon>>> {
  try {
    const url = page && page > 1
      ? `/api/proxy/superadmin/coupons/search?page=${page}`
      : "/api/proxy/superadmin/coupons/search";
    const res = await fetch(url, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ search_term: searchTerm }),
    });
    const data = await res.json();
    if (data.success && Array.isArray(data.content)) {
      data.content = data.content[0];
    }
    return data;
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to search coupons",
      content: null,
      code: 500,
    };
  }
}

// Subscription functions
export async function adminGetSubscriptions(
  page?: number
): Promise<ApiResponse<PaginatedContent<"subscriptions", AdminSubscription>>> {
  try {
    const url = page && page > 1
      ? `/api/proxy/superadmin/subscriptions?page=${page}`
      : "/api/proxy/superadmin/subscriptions";
    const res = await fetch(url, {
      method: "GET",
      headers: { Accept: "application/json" },
      credentials: "include",
    });
    const data = await res.json();
    if (data.success && Array.isArray(data.content)) {
      data.content = data.content[0];
    }
    return data;
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to fetch subscriptions",
      content: null,
      code: 500,
    };
  }
}

export async function adminGetSubscription(
  id: number
): Promise<ApiResponse<{ subscription: AdminSubscription }>> {
  try {
    const res = await fetch(`/api/proxy/superadmin/subscriptions/${id}/view`, {
      method: "GET",
      headers: { Accept: "application/json" },
      credentials: "include",
    });
    const data = await res.json();
    // API returns content as an array — unwrap the first element
    if (data.success && Array.isArray(data.content)) {
      data.content = { subscription: data.content[0] };
    }
    return data;
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to fetch subscription",
      content: null,
      code: 500,
    };
  }
}

// Transaction functions
export async function adminGetTransactions(
  page?: number
): Promise<ApiResponse<PaginatedContent<"transactions", AdminTransaction>>> {
  try {
    const url = page && page > 1
      ? `/api/proxy/superadmin/transactions?page=${page}`
      : "/api/proxy/superadmin/transactions";
    const res = await fetch(url, {
      method: "GET",
      headers: { Accept: "application/json" },
      credentials: "include",
    });
    const data = await res.json();
    if (data.success && Array.isArray(data.content)) {
      data.content = data.content[0];
    }
    return data;
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to fetch transactions",
      content: null,
      code: 500,
    };
  }
}

export async function adminGetTransaction(
  id: number
): Promise<ApiResponse<{ transaction: AdminTransaction }>> {
  try {
    const res = await fetch(`/api/proxy/superadmin/transactions/${id}/view`, {
      method: "GET",
      headers: { Accept: "application/json" },
      credentials: "include",
    });
    const data = await res.json();
    // API returns content as an array — unwrap the first element
    if (data.success && Array.isArray(data.content)) {
      data.content = { transaction: data.content[0] };
    }
    return data;
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to fetch transaction",
      content: null,
      code: 500,
    };
  }
}
