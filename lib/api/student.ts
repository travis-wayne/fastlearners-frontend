import { 
  StudentClassResponse, 
  ClassesResponse, 
  TermsResponse, 
  WeeksResponse 
} from "@/lib/types/subjects";

/**
 * Get current student's class
 */
export async function getStudentClass(): Promise<StudentClassResponse> {
  try {
    const response = await fetch("/api/student/class", {
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
        message: data.message || "Failed to fetch student class",
        content: null,
        code: response.status,
      };
    }

    return data as StudentClassResponse;
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
 * Get list of available classes
 */
export async function getStudentClasses(): Promise<ClassesResponse> {
  try {
    const response = await fetch("/api/student/classes", {
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
        message: data.message || "Failed to fetch classes",
        content: null,
        code: response.status,
      };
    }

    return data as ClassesResponse;
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
 * Get list of academic terms
 */
export async function getStudentTerms(): Promise<TermsResponse> {
  try {
    const response = await fetch("/api/student/terms", {
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
        message: data.message || "Failed to fetch terms",
        content: null,
        code: response.status,
      };
    }

    return data as TermsResponse;
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
 * Get list of weeks
 */
export async function getStudentWeeks(): Promise<WeeksResponse> {
  try {
    const response = await fetch("/api/student/weeks", {
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
        message: data.message || "Failed to fetch weeks",
        content: null,
        code: response.status,
      };
    }

    return data as WeeksResponse;
  } catch (error: any) {
    return {
      success: false,
      message: error?.message || "Network error",
      content: null,
      code: 500,
    };
  }
}
