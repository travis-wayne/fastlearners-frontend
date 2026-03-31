import { 
  GuardianActionResponse, 
  StudentGuardianHistoryResponse, 
  GuardianChildrenHistoryResponse 
} from "@/lib/types/guardian";

/**
 * Accept a guardian request (Student side)
 */
export async function acceptGuardianRequest(id: number): Promise<GuardianActionResponse> {
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
export async function rejectGuardianRequest(id: number): Promise<GuardianActionResponse> {
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
export async function sendChildRequest(childEmail: string): Promise<GuardianActionResponse> {
  try {
    const response = await fetch("/api/guardian/children/request/new", {
      method: "POST",
      headers: {
        "Accept": "application/json",
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
export async function cancelChildRequest(id: number): Promise<GuardianActionResponse> {
  try {
    const response = await fetch(`/api/guardian/children/request/cancel/${id}`, {
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
