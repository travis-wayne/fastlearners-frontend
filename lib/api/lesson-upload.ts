// Client-side lesson upload service - uses internal API routes for security
import {
  uploadAllLessonFilesBulk,
  type BulkUploadFiles,
} from "@/lib/api/bulk-lesson-upload";

// Types
export interface ApiResponse {
  success: boolean;
  message: string;
  content: any;
  code: number;
  errors?: any;
}

export interface UploadResult {
  success: boolean;
  message: string;
  error?: string;
}

const debugUploads = process.env.NEXT_PUBLIC_DEBUG_UPLOADS === "true";

// Generic upload function
const uploadFile = async (
  endpoint: string,
  file: File,
  fieldName: string,
): Promise<UploadResult> => {
  try {
    const formData = new FormData();
    formData.append(fieldName, file);

    if (debugUploads) {
      console.log(`Generic upload - ${fieldName}:`, formData.get(fieldName));
      console.log(`Generic upload - File details:`, {
        name: file.name,
        size: file.size,
        type: file.type,
      });
    }

    const response = await fetch(endpoint, {
      method: "POST",
      credentials: "include",
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      let errorMessage = "Upload failed";

      if (data?.message) {
        errorMessage = data.message;

        // Add specific error details if available
        if (data?.errors) {
          const errorDetails = data.errors;
          if (typeof errorDetails === "object" && errorDetails !== null) {
            const detailsArray = Object.entries(errorDetails).map(
              ([key, value]) =>
                `${key}: ${Array.isArray(value) ? value.join(", ") : value}`,
            );
            errorMessage += ` - ${detailsArray.join("; ")}`;
          }
        }
      }

      return {
        success: false,
        message: "Upload failed",
        error: errorMessage,
      };
    }

    return {
      success: true,
      message: data.message || "Upload successful",
    };
  } catch (error: any) {
    if (debugUploads) {
      console.error("Upload error:", error);
    }
    return {
      success: false,
      message: "Upload failed",
      error: error.message || "Unknown error occurred",
    };
  }
};

// Individual upload functions
export const uploadLessons = (file: File): Promise<UploadResult> =>
  uploadFile("/api/uploads/lessons", file, "lessons_file");

export const uploadConcepts = (file: File): Promise<UploadResult> =>
  uploadFile("/api/uploads/concepts", file, "concepts_file");

export const uploadExamples = (file: File): Promise<UploadResult> =>
  uploadFile("/api/uploads/examples", file, "examples_file");

export const uploadExercises = (file: File): Promise<UploadResult> =>
  uploadFile("/api/uploads/exercises", file, "exercises_file");

export const uploadGeneralExercises = (file: File): Promise<UploadResult> =>
  uploadFile("/api/uploads/general-exercises", file, "general_exercises_file");

export const uploadCheckMarkers = (file: File): Promise<UploadResult> =>
  uploadFile("/api/uploads/check-markers", file, "check_markers_file");

export const uploadSchemeOfWork = (file: File): Promise<UploadResult> =>
  uploadFile("/api/uploads/scheme-of-work", file, "scheme_of_work_file");

/**
 * Bulk upload helper (deprecated in favor of uploadAllLessonFilesBulk)
 *
 * This function is kept for backward compatibility and delegates to the
 * canonical bulk helper `uploadAllLessonFilesBulk`, adapting its result
 * to the simpler `UploadResult` shape.
 */
export const uploadAllLessonFiles = async (files: {
  lessons_file: File;
  concepts_file: File;
  examples_file: File;
  exercises_file: File;
  general_exercises_file: File;
  check_markers_file: File;
}): Promise<UploadResult> => {
  const bulkFiles: BulkUploadFiles = files;
  const result = await uploadAllLessonFilesBulk(bulkFiles);

  return {
    success: result.success,
    message: result.message,
    error: result.error,
  };
};

// Upload configuration
export const UPLOAD_CONFIGS = [
  {
    key: "lessons",
    title: "Lessons",
    description:
      "Upload lesson structure with topics, objectives, and key concepts",
    uploadFunction: uploadLessons,
    dependency: null, // First in order
    order: 1,
  },
  {
    key: "concepts",
    title: "Concepts",
    description: "Upload detailed concept descriptions for lessons",
    uploadFunction: uploadConcepts,
    dependency: "lessons",
    order: 2,
  },
  {
    key: "examples",
    title: "Examples",
    description: "Upload worked examples for each concept",
    uploadFunction: uploadExamples,
    dependency: "concepts",
    order: 3,
  },
  {
    key: "exercises",
    title: "Exercises",
    description: "Upload practice exercises for concepts",
    uploadFunction: uploadExercises,
    dependency: "concepts",
    order: 4,
  },
  {
    key: "general_exercises",
    title: "General Exercises",
    description: "Upload general exercises for entire lessons",
    uploadFunction: uploadGeneralExercises,
    dependency: "lessons",
    order: 5,
  },
  {
    key: "check_markers",
    title: "Check Markers",
    description: "Upload assessment checkpoints and scoring",
    uploadFunction: uploadCheckMarkers,
    dependency: "lessons",
    order: 6,
  },
  {
    key: "scheme_of_work",
    title: "Scheme of Work",
    description: "Upload curriculum planning and breakdown",
    uploadFunction: uploadSchemeOfWork,
    dependency: null, // Independent
    order: 7,
  },
] as const;
