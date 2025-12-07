// lib/api/lessons.ts - Client-side service for lessons API

import type {
  LessonContentResponse,
  SubjectsWithSlugsResponse,
  TopicsResponse,
  TopicOverviewResponse,
  LessonCheckResponse,
  ExerciseCheckResponse,
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

export async function getLessonContentById(lessonId: number): Promise<LessonContentResponse> {
  try {
    const res = await fetch(`/api/lessons/by-id/${lessonId}/content`, {
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
        message: data.message || "Failed to fetch lesson content by ID",
        content: null,
        code: res.status,
      };
    }

    return data as LessonContentResponse;
  } catch (err: any) {
    if (process.env.NEXT_PUBLIC_DEBUG_AUTH === "true") {
      console.error("getLessonContentById error:", err);
    }
    return {
      success: false,
      message: err?.message || "Network error",
      content: null,
      code: 500,
    };
  }
}

// Lesson Completion Check Endpoints

export async function checkLessonOverview(lessonId: number): Promise<LessonCheckResponse> {
  try {
    const res = await fetch(`/api/lessons/check/overview/${lessonId}`, {
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
        message: data.message || "Failed to verify overview completion",
        content: null,
        code: res.status,
      };
    }

    return data as LessonCheckResponse;
  } catch (err: any) {
    return {
      success: false,
      message: err?.message || "Network error",
      content: null,
      code: 500,
    };
  }
}

export async function checkLessonConcept(lessonId: number, conceptId: number): Promise<LessonCheckResponse> {
  try {
    const res = await fetch(`/api/lessons/check/concept/${lessonId}/${conceptId}`, {
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
        message: data.message || "Failed to verify concept completion",
        content: null,
        code: res.status,
      };
    }

    return data as LessonCheckResponse;
  } catch (err: any) {
    return {
      success: false,
      message: err?.message || "Network error",
      content: null,
      code: 500,
    };
  }
}

export async function checkLessonSummaryAndApplication(lessonId: number): Promise<LessonCheckResponse> {
  try {
    const res = await fetch(`/api/lessons/check/summary-and-application/${lessonId}`, {
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
        message: data.message || "Failed to verify summary and application completion",
        content: null,
        code: res.status,
      };
    }

    return data as LessonCheckResponse;
  } catch (err: any) {
    return {
      success: false,
      message: err?.message || "Network error",
      content: null,
      code: 500,
    };
  }
}

export async function checkLessonGeneralExercises(lessonId: number): Promise<LessonCheckResponse> {
  try {
    const res = await fetch(`/api/lessons/check/general-exercises/${lessonId}`, {
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
        message: data.message || "Failed to verify general exercises completion",
        content: null,
        code: res.status,
      };
    }

    return data as LessonCheckResponse;
  } catch (err: any) {
    return {
      success: false,
      message: err?.message || "Network error",
      content: null,
      code: 500,
    };
  }
}

// Exercise Answer Checking

export async function checkExerciseAnswer(
  exerciseId: number,
  answer: string,
  isGeneral: boolean = false
): Promise<ExerciseCheckResponse> {
  try {
    // Validate inputs
    if (!exerciseId || exerciseId <= 0) {
      return {
        success: false,
        message: "Invalid exercise ID",
        content: null,
        code: 422,
        isCorrect: false,
        errors: { exercise_id: ["Exercise ID is required and must be greater than 0"] },
      };
    }

    if (!answer || answer.trim() === '') {
      return {
        success: false,
        message: "Answer is required",
        content: null,
        code: 422,
        isCorrect: false,
        errors: { answer: ["The answer field is required."] },
      };
    }

    // Ensure answer is uppercase letter (A, B, C, D, etc.)
    const normalizedAnswer = answer.trim().toUpperCase();
    if (!/^[A-Z]$/.test(normalizedAnswer)) {
      return {
        success: false,
        message: "Answer must be a single letter (A, B, C, D, etc.)",
        content: null,
        code: 422,
        isCorrect: false,
        errors: { answer: ["Answer must be a single letter"] },
      };
    }

    const body = isGeneral
      ? { general_exercise_id: exerciseId, answer: normalizedAnswer }
      : { exercise_id: exerciseId, answer: normalizedAnswer };

    // Use different endpoints for concept vs general exercises
    const endpoint = isGeneral
      ? "/api/lessons/check-general-exercise-answer"
      : "/api/lessons/check-exercise-answer";

    // Debug logging (only in development)
    if (process.env.NODE_ENV === 'development') {
      console.log('[checkExerciseAnswer] Request:', {
        endpoint,
        body,
        isGeneral,
      });
    }

    const res = await fetch(endpoint, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
      cache: "no-store",
    });

    const data = await res.json();

    // Debug logging (always log in development to see what we're getting)
    if (process.env.NODE_ENV === 'development') {
      console.log('[checkExerciseAnswer] Response:', {
        status: res.status,
        statusText: res.statusText,
        data,
        requestBody: body,
      });
    }

    if (!res.ok) {
      // Check if it's an "already answered" error - these should be treated as success
      const isAlreadyAnswered = data.message?.toLowerCase().includes('already answered') || 
                                data.message?.toLowerCase().includes('already answered correctly');
      
      if (isAlreadyAnswered) {
        return {
          success: true,
          message: data.message || "Exercise already answered",
          content: data.content || null,
          code: 200, // Treat as success
          isCorrect: true,
          errors: null,
        };
      }

      return {
        success: false,
        message: data.message || "Wrong answer. Try again!",
        content: null,
        code: data.code || res.status,
        isCorrect: false,
        errors: data.errors,
      };
    }

    // Success response (200) - determine if answer is correct
    // Backend returns 200 with success: true for correct answers
    // Backend returns 200 with message "already answered" for previously answered exercises
    const isAlreadyAnswered = data.message?.toLowerCase().includes('already answered') || 
                              data.message?.toLowerCase().includes('already answered correctly');
    
    // Answer is correct if:
    // 1. success is explicitly true, OR
    // 2. status is 200 and message doesn't say "wrong answer", OR
    // 3. message indicates "already answered" (was previously correct)
    const isCorrect = data.success === true || 
                     (res.status === 200 && !data.message?.toLowerCase().includes('wrong answer')) ||
                     isAlreadyAnswered;

    return {
      ...data,
      isCorrect: isCorrect,
      code: data.code || res.status,
      success: data.success !== false, // Ensure success is set
    } as ExerciseCheckResponse;
  } catch (err: any) {
    return {
      success: false,
      message: err?.message || "Network error",
      content: null,
      code: 500,
      isCorrect: false,
    };
  }
}