// Client-side superadmin upload management service
import { ApiResponse } from "./lesson-service";

/**
 * Upload statistics response from backend
 */
export interface UploadStats {
  totalUploads: number;
  successfulUploads: number;
  failedUploads: number;
  conflictCount: number;
  lastUploadAt?: string;
}

/**
 * Individual upload record
 */
export interface UploadRecord {
  id: number;
  fileName: string;
  fileType: string;
  uploadedAt: string;
  uploadedBy: number;
  status: "success" | "failed" | "pending";
  recordCount: number;
  conflictCount: number;
  errorMessage?: string;
}

/**
 * Upload list response with pagination
 */
export interface UploadListResponse {
  uploads: UploadRecord[];
  total: number;
  page: number;
  perPage: number;
}

/**
 * Fetch upload statistics
 * 
 * NOTE: This function will return a 501 error until the backend
 * endpoint /superadmin/uploads/stats is implemented.
 */
export const getUploadStats = async (): Promise<ApiResponse<UploadStats>> => {
  const response = await fetch("/api/superadmin/uploads/stats", {
    method: "GET",
    credentials: "include",
    headers: {
      Accept: "application/json",
    },
  });

  return await response.json();
};

/**
 * Fetch upload history list with optional filters
 * 
 * NOTE: This function will return a 501 error until the backend
 * endpoint /superadmin/uploads/list is implemented.
 * 
 * @param filters Optional query parameters for filtering
 */
export const getUploadList = async (filters?: {
  page?: number;
  perPage?: number;
  status?: "success" | "failed" | "pending";
  fileType?: string;
}): Promise<ApiResponse<UploadListResponse>> => {
  const params = new URLSearchParams();
  
  if (filters?.page) params.append("page", filters.page.toString());
  if (filters?.perPage) params.append("perPage", filters.perPage.toString());
  if (filters?.status) params.append("status", filters.status);
  if (filters?.fileType) params.append("fileType", filters.fileType);

  const queryString = params.toString();
  const url = queryString 
    ? `/api/superadmin/uploads/list?${queryString}`
    : `/api/superadmin/uploads/list`;

  const response = await fetch(url, {
    method: "GET",
    credentials: "include",
    headers: {
      Accept: "application/json",
    },
  });

  return await response.json();
};
