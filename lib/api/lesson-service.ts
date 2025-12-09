// Client-side lesson service - uses internal API routes for security
import {
  CHECK_MARKER_REQUIRED_COLUMNS,
  CONCEPT_REQUIRED_COLUMNS,
  convertToAPIFormat,
  createAPIFormattedFile,
  createNormalizedFile,
  EXAMPLE_REQUIRED_COLUMNS,
  EXERCISE_REQUIRED_COLUMNS,
  GENERAL_EXERCISE_REQUIRED_COLUMNS,
  LESSON_REQUIRED_COLUMNS,
  normalizeCSVContent,
  SCHEME_OF_WORK_REQUIRED_COLUMNS,
  validateCSVFile,
  type CSVValidationResult,
} from "@/lib/utils/csv-upload-helper";

// Types based on API documentation

/**
 * Represents a row-level conflict or duplicate detected during upload
 */
export interface ConflictRecord {
  rowIndex: number;
  primaryKeys: {
    class?: string;
    subject?: string;
    term?: string;
    week?: number;
    topic?: string;
    lesson?: string;
    concept?: string;
  };
  reason: string;
  conflictType: "duplicate" | "semantic" | "validation";
}

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  content: T;
  code: number;
  errors?: any;
  conflicts?: ConflictRecord[];
}

export interface Lesson {
  id: number;
  class: string;
  subject: string;
  term: string;
  week: number;
  topic: string;
  overview: string;
  objectives: string; // JSON string
  key_concepts: string; // JSON string
  summary: string;
  application: string;
  created_at?: string;
  updated_at?: string;
}

export interface Concept {
  id: number;
  lesson_id: number;
  lesson: string;
  title: string;
  description: string; // JSON string
  order_index: number;
}

export interface Example {
  id: number;
  concept_id: number;
  concept: string;
  title: string;
  problem: string;
  solution_steps: string; // JSON string
  answer: string;
  order_index: number;
}

export interface Exercise {
  id: number;
  concept_id: number;
  concept: string;
  title: string;
  problem: string;
  solution_steps: string; // JSON string
  answers: string; // JSON string array
  correct_answer: string;
  order_index: number;
}

export interface GeneralExercise {
  id: number;
  lesson_id: number;
  lesson: string;
  problem: string;
  solution_steps: string; // JSON string
  answers: string; // JSON string array
  correct_answer: string;
  order_index: number;
}

export interface CheckMarker {
  id: number;
  lesson_id: number;
  lesson: string;
  overview: number;
  lesson_video: number;
  concept_one: number;
  concept_two: number;
  concept_three: number;
  concept_four: number;
  concept_five: number;
  concept_six: number;
  concept_seven: number;
  general_exercises: number;
}

export interface SchemeOfWork {
  id: number;
  subject: string;
  class: string;
  term: string;
  week: number;
  topic: string;
  breakdown: string; // JSON string array
}

export interface ClassInfo {
  id: number;
  name: string;
}

export interface SubjectInfo {
  id: number;
  name: string;
}

export interface GetLessonsResponse {
  classes: ClassInfo[];
  subjects: SubjectInfo[];
  lessons?: Lesson[];
}


// Upload functions
export const uploadLessonsFile = async (file: File): Promise<ApiResponse> => {
  const formData = new FormData();
  formData.append("lessons_file", file);

  const response = await fetch("/api/uploads/lessons", {
    method: "POST",
    credentials: "include",
    body: formData,
  });

  return await response.json();
};

export const uploadConceptsFile = async (file: File): Promise<ApiResponse> => {
  const formData = new FormData();
  formData.append("concepts_file", file);

  const response = await fetch("/api/uploads/concepts", {
    method: "POST",
    credentials: "include",
    body: formData,
  });

  return await response.json();
};

export const uploadExamplesFile = async (file: File): Promise<ApiResponse> => {
  const formData = new FormData();
  formData.append("examples_file", file);

  const response = await fetch("/api/uploads/examples", {
    method: "POST",
    credentials: "include",
    body: formData,
  });

  return await response.json();
};

export const uploadExercisesFile = async (file: File): Promise<ApiResponse> => {
  const formData = new FormData();
  formData.append("exercises_file", file);

  const response = await fetch("/api/uploads/exercises", {
    method: "POST",
    credentials: "include",
    body: formData,
  });

  return await response.json();
};

export const uploadGeneralExercisesFile = async (
  file: File,
): Promise<ApiResponse> => {
  const formData = new FormData();
  formData.append("general_exercises_file", file);

  const response = await fetch("/api/uploads/general-exercises", {
    method: "POST",
    credentials: "include",
    body: formData,
  });

  return await response.json();
};

const debugUploads = process.env.NEXT_PUBLIC_DEBUG_UPLOADS === "true";

export const uploadCheckMarkersFile = async (
  file: File,
): Promise<ApiResponse> => {
  const formData = new FormData();
  formData.append("check_markers_file", file);

  if (debugUploads) {
    console.log("FormData contents:", formData.get("check_markers_file"));
    console.log("File details:", {
      name: file.name,
      size: file.size,
      type: file.type,
    });
  }

  const response = await fetch("/api/uploads/check-markers", {
    method: "POST",
    credentials: "include",
    body: formData,
  });

  return await response.json();
};

export const uploadSchemeOfWorkFile = async (
  file: File,
): Promise<ApiResponse> => {
  const formData = new FormData();
  formData.append("scheme_of_work_file", file);

  const response = await fetch("/api/uploads/scheme-of-work", {
    method: "POST",
    credentials: "include",
    body: formData,
  });

  return await response.json();
};

export const uploadAllLessonFiles = async (files: {
  lessons_file: File;
  concepts_file: File;
  examples_file: File;
  exercises_file: File;
  general_exercises_file: File;
  check_markers_file: File;
}): Promise<ApiResponse> => {
  const formData = new FormData();
  formData.append("lessons_file", files.lessons_file);
  formData.append("concepts_file", files.concepts_file);
  formData.append("examples_file", files.examples_file);
  formData.append("exercises_file", files.exercises_file);
  formData.append("general_exercises_file", files.general_exercises_file);
  formData.append("check_markers_file", files.check_markers_file);

  const response = await fetch("/api/uploads/all-lesson-files", {
    method: "POST",
    credentials: "include",
    body: formData,
  });

  return await response.json();
};

// Get lessons data
// getLessons removed - use slug-based endpoints instead:
// - getSubjectsWithSlugs()
// - getTopicsBySubjectSlug(subjectSlug)
// - getLessonContentBySlug(subjectSlug, topicSlug)
// getLessonContent removed - use getLessonContentBySlug() from lib/api/lessons.ts instead
// This function called /api/lessons/[id] which proxies to superadmin endpoints not in student docs

// Trash functions removed - these hit superadmin endpoints not in student docs
// If staff tools require them, segregate under an admin-only feature flag or separate admin app
// Functions that should be in admin-only client:
// - trashLesson(lessonId)
// - getTrashedLessons()
// - getLessonContent(lessonId) - use slug-based endpoints for student app

// CSV validation helpers
export const validateCSVFormat = (
  file: File,
  expectedColumns: string[],
): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const lines = text.split("\n");

        if (lines.length < 2) {
          resolve(false);
          return;
        }

        // Get header row and clean it
        const headers = lines[0]
          .split("|")
          .map((h) => h.replace(/^\ufeff/, "").trim()) // Remove BOM if present
          .filter((h) => h.length > 0);

        // Check if all expected columns are present
        const hasAllColumns = expectedColumns.every((col) =>
          headers.includes(col),
        );

        resolve(hasAllColumns);
      } catch (error) {
        reject(error);
      }
    };

    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsText(file);
  });
};

// CSV column definitions for validation
export const CSV_COLUMNS = {
  lessons: [
    "class",
    "subject",
    "term",
    "week",
    "topic",
    "overview",
    "objectives",
    "key_concepts",
    "summary",
    "application",
  ],
  concepts: ["lesson", "title", "description", "order_index"],
  examples: [
    "concept",
    "title",
    "problem",
    "solution_steps",
    "answer",
    "order_index",
  ],
  exercises: [
    "concept",
    "title",
    "problem",
    "solution_steps",
    "answers",
    "correct_answer",
    "order_index",
  ],
  general_exercises: [
    "lesson",
    "problem",
    "solution_steps",
    "answers",
    "correct_answer",
    "order_index",
  ],
  check_markers: [
    "lesson",
    "overview",
    "lesson_video",
    "concept_one",
    "concept_two",
    "concept_three",
    "concept_four",
    "concept_five",
    "concept_six",
    "concept_seven",
    "general_exercises",
  ],
  scheme_of_work: ["subject", "class", "term", "week", "topic", "breakdown"],
};

// Enhanced upload results
export interface UploadResult {
  success: boolean;
  validation?: CSVValidationResult;
  apiResponse?: ApiResponse;
  error?: string;
  triedFormats?: string[];
  conflicts?: ConflictRecord[];
}

// Smart upload function that tries both formats
export const uploadLessonsFileWithValidation = async (
  file: File,
): Promise<UploadResult> => {
  if (debugUploads) {
    console.log("Starting upload validation for lessons file:", file.name);
  }

  try {
    // First, validate the file
    const validation = await validateCSVFile({
      file,
      requiredColumns: LESSON_REQUIRED_COLUMNS,
    });

    if (debugUploads) {
      console.log("Validation result:", validation);
    }

    if (!validation.isValid) {
      return {
        success: false,
        validation,
        error: `File validation failed: ${validation.errors.join(", ")}`,
      };
    }

    // Try uploading with detected format first
    let uploadResult = await tryUploadLessonsFile(file);
    let triedFormats = [validation.format];

    if (!uploadResult.success) {
      if (debugUploads) {
        console.log(
          `Upload failed with ${validation.format} format, trying alternative format`,
        );
      }

      // Try the alternative format
      const alternativeFormat =
        validation.format === "comma" ? "pipe" : "comma";
      const content = await file.text();
      const normalizedContent = normalizeCSVContent(content, alternativeFormat);
      const normalizedFile = createNormalizedFile(
        file,
        normalizedContent,
        alternativeFormat,
      );

      uploadResult = await tryUploadLessonsFile(normalizedFile);
      triedFormats.push(alternativeFormat);
    }

    return {
      success: uploadResult.success,
      validation,
      apiResponse: uploadResult.apiResponse,
      error: uploadResult.error,
      triedFormats,
    };
  } catch (error) {
    if (debugUploads) {
      console.error("Upload error:", error);
    }
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
};

// Helper function to try uploading a file
const tryUploadLessonsFile = async (
  file: File,
): Promise<{ success: boolean; apiResponse?: ApiResponse; error?: string }> => {
  try {
    const apiResponse = await uploadLessonsFile(file);
    return { success: true, apiResponse };
  } catch (error: any) {
    if (debugUploads) {
      console.error("Upload API error:", error);
    }

    let errorMessage = "Upload failed";

    if (error.response?.data?.message) {
      errorMessage = error.response.data.message;
    } else if (error.message) {
      errorMessage = error.message;
    }

    return {
      success: false,
      error: errorMessage,
      apiResponse: error.response?.data,
    };
  }
};

// Smart upload functions for other file types
export const uploadConceptsFileWithValidation = async (
  file: File,
): Promise<UploadResult> => {
  return await smartUploadWithValidation(
    file,
    CONCEPT_REQUIRED_COLUMNS,
    uploadConceptsFile,
    "concepts",
  );
};

export const uploadExamplesFileWithValidation = async (
  file: File,
): Promise<UploadResult> => {
  return await smartUploadWithValidation(
    file,
    EXAMPLE_REQUIRED_COLUMNS,
    uploadExamplesFile,
    "examples",
  );
};

export const uploadExercisesFileWithValidation = async (
  file: File,
): Promise<UploadResult> => {
  return await smartUploadWithValidation(
    file,
    EXERCISE_REQUIRED_COLUMNS,
    uploadExercisesFile,
    "exercises",
  );
};

export const uploadGeneralExercisesFileWithValidation = async (
  file: File,
): Promise<UploadResult> => {
  return await smartUploadWithValidation(
    file,
    GENERAL_EXERCISE_REQUIRED_COLUMNS,
    uploadGeneralExercisesFile,
    "general_exercises",
  );
};

export const uploadCheckMarkersFileWithValidation = async (
  file: File,
): Promise<UploadResult> => {
  return await smartUploadWithValidation(
    file,
    CHECK_MARKER_REQUIRED_COLUMNS,
    uploadCheckMarkersFile,
    "check_markers",
  );
};

export const uploadSchemeOfWorkFileWithValidation = async (
  file: File,
): Promise<UploadResult> => {
  return await smartUploadWithValidation(
    file,
    SCHEME_OF_WORK_REQUIRED_COLUMNS,
    uploadSchemeOfWorkFile,
    "scheme_of_work",
  );
};

// Generic smart upload function
const smartUploadWithValidation = async (
  file: File,
  requiredColumns: string[],
  uploadFunction: (file: File) => Promise<ApiResponse>,
  fileType: string,
): Promise<UploadResult> => {
  if (debugUploads) {
    console.log(`Starting upload validation for ${fileType} file:`, file.name);
  }

  try {
    // Log file content for debugging
    const fileContent = await file.text();
    if (debugUploads) {
      console.log(
        `${fileType} file content preview:`,
        fileContent.substring(0, 500),
      );
      console.log(`${fileType} file size:`, file.size, "bytes");
    }

    // Validate the file
    const validation = await validateCSVFile({
      file,
      requiredColumns,
    });

    if (debugUploads) {
      console.log("Validation result:", validation);
    }

    if (!validation.isValid) {
      return {
        success: false,
        validation,
        error: `File validation failed: ${validation.errors.join(", ")}`,
      };
    }

    // Convert file to API format before upload
    if (debugUploads) {
      console.log("Converting file to API format...");
    }
    const apiFormattedFile = createAPIFormattedFile(file, fileContent);
    if (debugUploads) {
      console.log(
        "API formatted file created:",
        apiFormattedFile.name,
        apiFormattedFile.size,
        "bytes",
      );
    }

    // Try uploading with API format
    let uploadResult = await tryUpload(apiFormattedFile, uploadFunction);
    let triedFormats = [`api_${validation.format}`];

    if (!uploadResult.success && debugUploads) {
      console.log(`Upload failed with API format, trying original file`);

      // Fallback: try uploading the original file
      uploadResult = await tryUpload(file, uploadFunction);
      triedFormats.push(validation.format);

      if (!uploadResult.success && debugUploads) {
        console.log(
          `Upload failed with original format, trying alternative format`,
        );

        // Try the alternative format
        const alternativeFormat =
          validation.format === "comma" ? "pipe" : "comma";
        const normalizedContent = normalizeCSVContent(
          fileContent,
          alternativeFormat,
        );
        const normalizedFile = createNormalizedFile(
          file,
          normalizedContent,
          alternativeFormat,
        );

        uploadResult = await tryUpload(normalizedFile, uploadFunction);
        triedFormats.push(alternativeFormat);
      }
    }

    return {
      success: uploadResult.success,
      validation,
      apiResponse: uploadResult.apiResponse,
      error: uploadResult.error,
      triedFormats,
    };
  } catch (error) {
    if (debugUploads) {
      console.error(`${fileType} upload error:`, error);
    }
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
};

// Generic helper function to try uploading a file
const tryUpload = async (
  file: File,
  uploadFunction: (file: File) => Promise<ApiResponse>,
): Promise<{ success: boolean; apiResponse?: ApiResponse; error?: string }> => {
  try {
    if (debugUploads) {
      console.log("Attempting upload with file:", {
        name: file.name,
        size: file.size,
        type: file.type,
        lastModified: file.lastModified,
      });

      // Log a preview of the file content being sent
      const fileContent = await file.text();
      console.log(
        "File content being uploaded (first 1000 chars):",
        fileContent.substring(0, 1000),
      );
    }

    const apiResponse = await uploadFunction(file);
    if (debugUploads) {
      console.log("Upload successful! API Response:", apiResponse);
    }
    return { success: true, apiResponse };
  } catch (error: any) {
    if (debugUploads) {
      console.error("=== UPLOAD API ERROR DETAILS ===");
      console.error("Error object:", error);
      console.error("Response status:", error.response?.status);
      console.error("Response status text:", error.response?.statusText);
      console.error("Response headers:", error.response?.headers);
      console.error("Full response data:", error.response?.data);
    }

    // Try to extract more detailed error information
    let errorMessage = "Upload failed";
    let validationDetails = null;

    if (error.response?.data) {
      const responseData = error.response.data;

      // Handle different response formats
      if (typeof responseData === "string") {
        errorMessage = responseData;
      } else if (responseData.message) {
        errorMessage = responseData.message;
      } else if (responseData.error) {
        errorMessage = responseData.error;
      } else if (responseData.errors) {
        // Handle validation errors array
        if (Array.isArray(responseData.errors)) {
          errorMessage = responseData.errors.join(", ");
        } else if (typeof responseData.errors === "object") {
          // Handle field-specific validation errors
          const fieldErrors = Object.entries(responseData.errors)
            .map(
              ([field, errors]) =>
                `${field}: ${Array.isArray(errors) ? errors.join(", ") : errors}`,
            )
            .join("; ");
          errorMessage = fieldErrors;
          validationDetails = responseData.errors;
        } else {
          errorMessage = String(responseData.errors);
        }
      } else {
        errorMessage = JSON.stringify(responseData);
      }
    } else if (error.message) {
      errorMessage = error.message;
    }

    if (debugUploads) {
      console.error("Processed error message:", errorMessage);
      if (validationDetails) {
        console.error("Validation details:", validationDetails);
      }
      console.error("=== END ERROR DETAILS ===");
    }

    return {
      success: false,
      error: errorMessage,
      apiResponse: error.response?.data,
    };
  }
};
