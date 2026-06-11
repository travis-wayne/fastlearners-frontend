import {
  GuardianActionResponse,
  GuardianChildrenHistoryResponse,
  StudentGuardianHistoryResponse,
} from "@/lib/types/guardian";

/**
 * Accept a guardian request (Student side)
 */
export async function acceptGuardianRequest(
  id: number,
): Promise<GuardianActionResponse> {
  try {
    const response = await fetch(`/api/student/guardian/request/accept/${id}`, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
      credentials: "include",
      cache: "no-store",
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: data.message || "Failed to accept guardian request",
        content: null,
        code: response.status,
      };
    }

    return data as GuardianActionResponse;
  } catch (error: any) {
    return {
      success: false,
      message: error?.message || "Network error",
      content: null,
      code: 500,
    };
  }
}

/**
 * Reject a guardian request (Student side)
 */
export async function rejectGuardianRequest(
  id: number,
): Promise<GuardianActionResponse> {
  try {
    const response = await fetch(`/api/student/guardian/request/reject/${id}`, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
      credentials: "include",
      cache: "no-store",
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: data.message || "Failed to reject guardian request",
        content: null,
        code: response.status,
      };
    }

    return data as GuardianActionResponse;
  } catch (error: any) {
    return {
      success: false,
      message: error?.message || "Network error",
      content: null,
      code: 500,
    };
  }
}

/**
 * Get history of guardian requests (Student side)
 */
export async function getStudentGuardianRequestHistory(): Promise<StudentGuardianHistoryResponse> {
  try {
    const response = await fetch("/api/student/guardian/request/history", {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
      credentials: "include",
      cache: "no-store",
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: data.message || "Failed to fetch student guardian history",
        content: null,
        code: response.status,
      };
    }

    return data as StudentGuardianHistoryResponse;
  } catch (error: any) {
    return {
      success: false,
      message: error?.message || "Network error",
      content: null,
      code: 500,
    };
  }
}

/**
 * Send a new child request (Guardian side)
 */
export async function sendChildRequest(
  childEmail: string,
): Promise<GuardianActionResponse> {
  try {
    const response = await fetch("/api/guardian/children/request/new", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ child_email: childEmail }),
      credentials: "include",
      cache: "no-store",
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: data.message || "Failed to send child request",
        content: null,
        code: response.status,
      };
    }

    return data as GuardianActionResponse;
  } catch (error: any) {
    return {
      success: false,
      message: error?.message || "Network error",
      content: null,
      code: 500,
    };
  }
}

/**
 * Cancel a child request (Guardian side)
 */
export async function cancelChildRequest(
  id: number,
): Promise<GuardianActionResponse> {
  try {
    const response = await fetch(
      `/api/guardian/children/request/cancel/${id}`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
        credentials: "include",
        cache: "no-store",
      },
    );

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: data.message || "Failed to cancel child request",
        content: null,
        code: response.status,
      };
    }

    return data as GuardianActionResponse;
  } catch (error: any) {
    return {
      success: false,
      message: error?.message || "Network error",
      content: null,
      code: 500,
    };
  }
}

/**
 * Get history of child requests (Guardian side)
 */
export async function getGuardianChildrenHistory(): Promise<GuardianChildrenHistoryResponse> {
  try {
    const response = await fetch("/api/guardian/children/request/history", {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
      credentials: "include",
      cache: "no-store",
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: data.message || "Failed to fetch guardian children history",
        content: null,
        code: response.status,
      };
    }

    return data as GuardianChildrenHistoryResponse;
  } catch (error: any) {
    return {
      success: false,
      message: error?.message || "Network error",
      content: null,
      code: 500,
    };
  }
}

export async function getGuardianChildren(): Promise<import("@/lib/types/guardian").GuardianChildrenResponse> {
  try {
    const response = await fetch("/api/guardian/children", {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
      credentials: "include",
      cache: "no-store",
    });
    const data = await response.json();
    if (!response.ok) {
      return {
        success: false,
        message: data.message || "Failed to fetch guardian children",
        content: null,
        code: response.status,
      };
    }
    
    // Normalize nested payload
    const normalizedData = {
      ...data,
      content: data.content?.children ? {
        children: data.content.children.children || [],
        links: data.content.children.links,
        meta: data.content.children.meta,
      } : null
    };
    return normalizedData as import("@/lib/types/guardian").GuardianChildrenResponse;
  } catch (error: any) {
    return {
      success: false,
      message: error?.message || "Network error",
      content: null,
      code: 500,
    };
  }
}

export async function getGuardianChild(id: number): Promise<import("@/lib/types/guardian").GuardianChildDetailResponse> {
  try {
    const response = await fetch(`/api/guardian/children/${id}/view`, {
      method: "GET",
      headers: { Accept: "application/json" },
      credentials: "include",
      cache: "no-store",
    });
    const data = await response.json();
    if (!response.ok) {
      return {
        success: false,
        message: data.message || "Failed to fetch guardian child details",
        content: { child_id: "", class_id: 0, child_subjects: [] },
        code: response.status,
      };
    }
    return data as import("@/lib/types/guardian").GuardianChildDetailResponse;
  } catch (error: any) {
    return {
      success: false,
      message: error?.message || "Network error",
      content: { child_id: "", class_id: 0, child_subjects: [] },
      code: 500,
    };
  }
}

export async function getGuardianChildSubjectDetails(childId: number, classId: number, subjectId: number): Promise<import("@/lib/types/guardian").GuardianChildSubjectDetailResponse> {
  try {
    const response = await fetch(`/api/guardian/children/subject/${childId}/${classId}/${subjectId}/view-subject-details`, {
      method: "GET",
      headers: { Accept: "application/json" },
      credentials: "include",
      cache: "no-store",
    });
    const data = await response.json();
    if (!response.ok) {
      return {
        success: false,
        message: data.message || "Failed to fetch subject details",
        content: { subject_total_score: "0", lesson_scores: [] },
        code: response.status,
      };
    }
    return data as import("@/lib/types/guardian").GuardianChildSubjectDetailResponse;
  } catch (error: any) {
    return {
      success: false,
      message: error?.message || "Network error",
      content: { subject_total_score: "0", lesson_scores: [] },
      code: 500,
    };
  }
}

export async function getGuardianChildLessonDetails(lessonId: number, childId: number): Promise<import("@/lib/types/guardian").GuardianChildLessonDetailResponse> {
  try {
    const response = await fetch(`/api/guardian/children/lesson/${lessonId}/${childId}/view-lesson-details`, {
      method: "GET",
      headers: { Accept: "application/json" },
      credentials: "include",
      cache: "no-store",
    });
    const data = await response.json();
    if (!response.ok) {
      return {
        success: false,
        message: data.message || "Failed to fetch lesson details",
        content: { lesson_summary: { overview: "0", video: "0", concepts: {}, general_exercise: "0" }, lesson_total: "0" },
        code: response.status,
      };
    }
    return data as import("@/lib/types/guardian").GuardianChildLessonDetailResponse;
  } catch (error: any) {
    return {
      success: false,
      message: error?.message || "Network error",
      content: { lesson_summary: { overview: "0", video: "0", concepts: {}, general_exercise: "0" }, lesson_total: "0" },
      code: 500,
    };
  }
}
