// lib/api/subjects.ts - Client-side service for subjects API

import type { SubjectsResponse, UpdateResponse } from "@/lib/types/subjects";

export async function getStudentSubjects(): Promise<SubjectsResponse> {
  try {
    const res = await fetch("/api/subjects", {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
      cache: "no-store",
    });

    const data = await res.json();

    if (!res.ok) {
      return {
        success: false,
        message: data.message || "Failed to fetch subjects",
        content: null,
        code: res.status,
        errors: data.errors,
      };
    }

    return data as SubjectsResponse;
  } catch (err: any) {
    if (process.env.NEXT_PUBLIC_DEBUG_AUTH === "true") {
      console.error("getStudentSubjects error:", err);
    }
    return {
      success: false,
      message: err?.message || "Network error",
      content: null,
      code: 500,
    };
  }
}

export async function updateCompulsorySelective(
  subjectId: number
): Promise<UpdateResponse> {
  try {
    const res = await fetch("/api/subjects/update-compulsory-selective", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ subject: subjectId }),
      cache: "no-store",
    });

    const data = await res.json();

    if (!res.ok) {
      return {
        success: false,
        message: data.message || "Failed to update compulsory selective",
        content: null,
        code: res.status,
        errors: data.errors,
      };
    }

    return data as UpdateResponse;
  } catch (err: any) {
    if (process.env.NEXT_PUBLIC_DEBUG_AUTH === "true") {
      console.error("updateCompulsorySelective error:", err);
    }
    return {
      success: false,
      message: err?.message || "Network error",
      content: null,
      code: 500,
    };
  }
}

export async function updateSelectiveSubjects(
  subjectIds: number[]
): Promise<UpdateResponse> {
  try {
    const res = await fetch("/api/subjects/update-selective", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ subjects: subjectIds }),
      cache: "no-store",
    });

    const data = await res.json();

    if (!res.ok) {
      return {
        success: false,
        message: data.message || "Failed to update selective subjects",
        content: null,
        code: res.status,
        errors: data.errors,
      };
    }

    return data as UpdateResponse;
  } catch (err: any) {
    if (process.env.NEXT_PUBLIC_DEBUG_AUTH === "true") {
      console.error("updateSelectiveSubjects error:", err);
    }
    return {
      success: false,
      message: err?.message || "Network error",
      content: null,
      code: 500,
    };
  }
}

