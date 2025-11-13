// lib/api/lessons.ts - Client-side service for lessons API

import type {
  LessonContentResponse,
  SubjectsWithSlugsResponse,
  TopicsResponse,
  TopicOverviewResponse,
} from "@/lib/types/lessons";


// getLessonContent removed - use getLessonContentBySlug instead

// Mark lesson as complete
// Note: Route moved to /api/lessons/by-id/[id]/complete to avoid conflict with [subjectSlug]
export async function markLessonComplete(
  lessonId: number
): Promise<{ success: boolean; message: string; code: number }> {
  try {
    const res = await fetch(`/api/lessons/by-id/${lessonId}/complete`, {
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

export async function getSubjectsWithSlugs(): Promise<SubjectsWithSlugsResponse> {
  try {
    const res = await fetch("/api/lessons", {
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
        message: data.message || "Failed to fetch subjects with slugs",
        content: null,
        code: res.status,
      };
    }

    return data as SubjectsWithSlugsResponse;
  } catch (err: any) {
    if (process.env.NEXT_PUBLIC_DEBUG_AUTH === "true") {
      console.error("getSubjectsWithSlugs error:", err);
    }
    return {
      success: false,
      message: err?.message || "Network error",
      content: null,
      code: 500,
    };
  }
}

export async function getTopicsBySubjectSlug(subjectSlug: string): Promise<TopicsResponse> {
  try {
    const res = await fetch(`/api/lessons/${subjectSlug}`, {
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
        message: data.message || "Failed to fetch topics by subject slug",
        content: null,
        code: res.status,
      };
    }

    return data as TopicsResponse;
  } catch (err: any) {
    if (process.env.NEXT_PUBLIC_DEBUG_AUTH === "true") {
      console.error("getTopicsBySubjectSlug error:", err);
    }
    return {
      success: false,
      message: err?.message || "Network error",
      content: null,
      code: 500,
    };
  }
}

export async function getTopicOverview(subjectSlug: string, topicSlug: string): Promise<TopicOverviewResponse> {
  try {
    const res = await fetch(`/api/lessons/${subjectSlug}/${topicSlug}/overview`, {
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
        message: data.message || "Failed to fetch topic overview",
        content: null,
        code: res.status,
      };
    }

    return data as TopicOverviewResponse;
  } catch (err: any) {
    if (process.env.NEXT_PUBLIC_DEBUG_AUTH === "true") {
      console.error("getTopicOverview error:", err);
    }
    return {
      success: false,
      message: err?.message || "Network error",
      content: null,
      code: 500,
    };
  }
}

export async function getLessonContentBySlug(subjectSlug: string, topicSlug: string): Promise<LessonContentResponse> {
  try {
    const res = await fetch(`/api/lessons/${subjectSlug}/${topicSlug}/content`, {
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
        message: data.message || "Failed to fetch lesson content by slug",
        content: null,
        code: res.status,
      };
    }

    return data as LessonContentResponse;
  } catch (err: any) {
    if (process.env.NEXT_PUBLIC_DEBUG_AUTH === "true") {
      console.error("getLessonContentBySlug error:", err);
    }
    return {
      success: false,
      message: err?.message || "Network error",
      content: null,
      code: 500,
    };
  }
}