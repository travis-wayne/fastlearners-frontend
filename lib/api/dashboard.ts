/**
 * Dashboard API
 * Handles fetching student dashboard data
 */

export interface DashboardProgress {
  subject: string;
  covered: number;
  left: number;
}

export interface DashboardContent {
  name: string;
  subjects: string;
  lessons: string;
  progress: DashboardProgress;
  quizzes: string;
  subscription_status: string;
}

export interface DashboardResponse {
  success: boolean;
  message: string;
  content: DashboardContent;
  code: number;
}

/**
 * Get student dashboard data
 */
export async function getDashboard(): Promise<DashboardResponse> {
  try {
    const response = await fetch("/api/dashboard", {
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
        message: data.message || "Failed to fetch dashboard",
        content: {
          name: "",
          subjects: "",
          lessons: "",
          progress: {
            subject: "",
            covered: 0,
            left: 0,
          },
          quizzes: "",
          subscription_status: "",
        },
        code: response.status,
      };
    }

    return data as DashboardResponse;
  } catch (error: any) {
    return {
      success: false,
      message: error?.message || "Network error",
      content: {
        name: "",
        subjects: "",
        lessons: "",
        progress: {
          subject: "",
          covered: 0,
          left: 0,
        },
        quizzes: "",
        subscription_status: "",
      },
      code: 500,
    };
  }
}

