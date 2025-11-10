// lib/api/lessons.ts - Client-side service for lessons API

import type {
  LessonMetaResponse,
  LessonsListResponse,
  LessonContentResponse,
} from "@/lib/types/lessons";

export async function getLessonMeta(): Promise<LessonMetaResponse> {
  try {
    const res = await fetch("/api/lessons/meta", {
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
        message: data.message || "Failed to fetch lesson meta",
        content: null,
        code: res.status,
      };
    }

    return data as LessonMetaResponse;
  } catch (err: any) {
    if (process.env.NEXT_PUBLIC_DEBUG_AUTH === "true") {
      console.error("getLessonMeta error:", err);
    }
    return {
      success: false,
      message: err?.message || "Network error",
      content: null,
      code: 500,
    };
  }
}

export async function fetchLessons(params: {
  class: string;
  subject: string;
  term: string;
  week: string;
  page?: number | string;
}): Promise<LessonsListResponse> {
  try {
    const res = await fetch("/api/lessons/list", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(params),
      cache: "no-store",
    });

    const data = await res.json();

    if (!res.ok) {
      return {
        success: false,
        message: data.message || "Failed to fetch lessons",
        content: null,
        code: res.status,
      };
    }

    return data as LessonsListResponse;
  } catch (err: any) {
    if (process.env.NEXT_PUBLIC_DEBUG_AUTH === "true") {
      console.error("fetchLessons error:", err);
    }
    return {
      success: false,
      message: err?.message || "Network error",
      content: null,
      code: 500,
    };
  }
}

export async function getLessonContent(
  id: number
): Promise<LessonContentResponse> {
  try {
    const res = await fetch(`/api/lessons/${id}/content`, {
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
        message: data.message || "Failed to fetch lesson content",
        content: null,
        code: res.status,
      };
    }

    return data as LessonContentResponse;
  } catch (err: any) {
    if (process.env.NEXT_PUBLIC_DEBUG_AUTH === "true") {
      console.error("getLessonContent error:", err);
    }
    return {
      success: false,
      message: err?.message || "Network error",
      content: null,
      code: 500,
    };
  }
}

// Mark lesson as complete
export async function markLessonComplete(
  lessonId: number
): Promise<{ success: boolean; message: string; code: number }> {
  try {
    const res = await fetch(`/api/lessons/${lessonId}/complete`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      credentials: "include",
      cache: "no-store",
    });

    const data = await res.json();

    if (!res.ok) {
      return {
        success: false,
        message: data.message || "Failed to mark lesson as complete",
        code: res.status,
      };
    }

    return {
      success: true,
      message: data.message || "Lesson marked as complete",
      code: res.status,
    };
  } catch (err: any) {
    if (process.env.NEXT_PUBLIC_DEBUG_AUTH === "true") {
      console.error("markLessonComplete error:", err);
    }
    return {
      success: false,
      message: err?.message || "Network error",
      code: 500,
    };
  }
}
