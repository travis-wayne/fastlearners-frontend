import { ApiResponse } from "@/lib/types/auth";
import { Motd, AdminMotd, CreateMotdData } from "@/lib/types/motd";

export async function getMotd(): Promise<ApiResponse<{ motd: Motd | null }>> {
  try {
    const res = await fetch("/api/proxy/motd", {
      method: "GET",
      headers: { Accept: "application/json" },
      credentials: "include",
    });
    const data = await res.json();
    if (data.success && data.content) {
      data.content = { motd: data.content };
    }
    return data;
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to fetch MOTD",
      content: null,
      code: 500,
    };
  }
}

export async function adminGetMotds(): Promise<ApiResponse<{ motds: AdminMotd[] }>> {
  try {
    const res = await fetch("/api/proxy/superadmin/motds", {
      method: "GET",
      headers: { Accept: "application/json" },
      credentials: "include",
    });
    const data = await res.json();
    if (data.success && Array.isArray(data.content)) {
      data.content = { motds: data.content[0]?.motd || [] };
    }
    return data;
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to fetch MOTDs",
      content: null,
      code: 500,
    };
  }
}

export async function adminGetMotd(id: number): Promise<ApiResponse<{ motd: AdminMotd }>> {
  try {
    const res = await fetch(`/api/proxy/superadmin/motds/${id}/view`, {
      method: "GET",
      headers: { Accept: "application/json" },
      credentials: "include",
    });
    return await res.json();
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to fetch MOTD",
      content: null,
      code: 500,
    };
  }
}

export async function adminCreateMotd(data: CreateMotdData): Promise<ApiResponse<{ motd: AdminMotd }>> {
  try {
    const res = await fetch("/api/proxy/superadmin/motds/create", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(data),
    });
    const resData = await res.json();
    if (resData.success && resData.content) {
      resData.content = { motd: resData.content };
    }
    return resData;
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to create MOTD",
      content: null,
      code: 500,
    };
  }
}

export async function adminUpdateMotd(id: number, data: CreateMotdData): Promise<ApiResponse<{ motd: AdminMotd }>> {
  try {
    const res = await fetch(`/api/proxy/superadmin/motds/${id}/update`, {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(data),
    });
    const resData = await res.json();
    if (resData.success && resData.content) {
      resData.content = { motd: resData.content };
    }
    return resData;
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to update MOTD",
      content: null,
      code: 500,
    };
  }
}

export async function adminDeleteMotd(id: number): Promise<ApiResponse<any>> {
  try {
    const res = await fetch(`/api/proxy/superadmin/motds/${id}/delete`, {
      method: "DELETE",
      headers: { Accept: "application/json" },
      credentials: "include",
    });
    return await res.json();
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to delete MOTD",
      content: null,
      code: 500,
    };
  }
}

export async function adminUpdateMotdStatus(id: number): Promise<ApiResponse<any>> {
  try {
    const res = await fetch(`/api/proxy/superadmin/motds/${id}/update-status`, {
      method: "POST",
      headers: { Accept: "application/json" },
      credentials: "include",
    });
    return await res.json();
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to update MOTD status",
      content: null,
      code: 500,
    };
  }
}
