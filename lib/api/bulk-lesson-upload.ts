// Client-side bulk upload service - uses internal API routes for security

// Types based on API documentation
export interface BulkUploadApiResponse {
  success: boolean;
  message: string;
  content: any;
  code: number;
  errors?: {
    lessons_file?: string[];
    concepts_file?: string[];
    examples_file?: string[];
    exercises_file?: string[];
    general_exercises_file?: string[];
    check_markers_file?: string[];
  };
}

export interface BulkUploadResult {
  success: boolean;
  message: string;
  apiResponse?: BulkUploadApiResponse;
  error?: string;
  validationErrors?: Record<string, string[]>;
}

export interface BulkUploadFiles {
  lessons_file: File;
  concepts_file: File;
  examples_file: File;
  exercises_file: File;
  general_exercises_file: File;
  check_markers_file: File;
}


/**
 * Upload all lesson files in one request
 * Matches API documentation: POST /api/v1/superadmin/lessons/uploads/all-lesson-files
 */
export const uploadAllLessonFilesBulk = async (
  files: BulkUploadFiles,
): Promise<BulkUploadResult> => {
  try {
    console.log("🚀 Starting bulk upload of all lesson files...");

    // Validate that all required files are provided
    const requiredFields = [
      "lessons_file",
      "concepts_file",
      "examples_file",
      "exercises_file",
      "general_exercises_file",
      "check_markers_file",
    ];

    const missingFiles = requiredFields.filter(
      (field) => !files[field as keyof BulkUploadFiles],
    );

    if (missingFiles.length > 0) {
      return {
        success: false,
        message: `Missing required files: ${missingFiles.join(", ")}`,
        error: "Missing required files",
      };
    }

    // Log file details for debugging
    console.log("📁 Files to upload:");
    Object.entries(files).forEach(([key, file]) => {
      console.log(`  ${key}: ${file.name} (${file.size} bytes, ${file.type})`);
    });

    // Create FormData with all files
    const formData = new FormData();
    Object.entries(files).forEach(([key, file]) => {
      formData.append(key, file);
    });

    // Log FormData contents
    console.log("📤 FormData entries:");
    const entries = Array.from(formData.entries());
    for (let [key, value] of entries) {
      if (value instanceof File) {
        console.log(`  ${key}: ${value.name} (${value.size} bytes)`);
      }
    }

    console.log("🎯 Uploading to: /api/uploads/all-lesson-files");

    // Make the API request
    const response = await fetch("/api/uploads/all-lesson-files", {
      method: "POST",
      credentials: "include",
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("❌ Bulk upload failed:", data);
      console.error("🔍 Error details:");
      console.error("  Status:", response.status);
      console.error("  Response Data:", data);

      let errorMessage = "Bulk upload failed";
      let validationErrors: Record<string, string[]> | undefined;

      if (data) {
        // Handle API error response
        if (data.message) {
          errorMessage = data.message;
        }

        // Handle validation errors (422 status)
        if (response.status === 422 && data.errors) {
          validationErrors = data.errors;

          // Create user-friendly error message
          const errorDetails = Object.entries(data.errors)
            .map(
              ([field, errors]) =>
                `${field}: ${Array.isArray(errors) ? errors.join(", ") : errors}`,
            )
            .join("; ");

          errorMessage = `Validation failed - ${errorDetails}`;
        }

        // Handle specific error codes from documentation
        else if (response.status === 400) {
          errorMessage = data.message || "Invalid CSV format or missing columns";
        } else if (response.status === 404) {
          errorMessage =
            data.message ||
            "Resource not found (class, subject, term, week, lesson, or concept)";
        } else if (response.status === 500) {
          errorMessage = data.message || "Server error processing CSV files";
        } else if (response.status === 401) {
          errorMessage = "Unauthorized - please log in again";
        }
      }

      return {
        success: false,
        message: errorMessage,
        error: errorMessage,
        apiResponse: data,
        validationErrors,
      };
    }

    console.log("✅ Bulk upload successful!", data);

    return {
      success: true,
      message: data.message || "All lesson files uploaded successfully",
      apiResponse: data,
    };
  } catch (error: any) {
    console.error("❌ Bulk upload failed:", error);
    console.error("🔍 Error details:", error);

    let errorMessage = "Bulk upload failed";
    if (error.message) {
      errorMessage = error.message;
    }

    return {
      success: false,
      message: errorMessage,
      error: errorMessage,
    };
  }
};

/**
 * Validate files before bulk upload
 */
export const validateBulkUploadFiles = (
  files: Partial<BulkUploadFiles>,
): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];

  const requiredFields: (keyof BulkUploadFiles)[] = [
    "lessons_file",
    "concepts_file",
    "examples_file",
    "exercises_file",
    "general_exercises_file",
    "check_markers_file",
  ];

  // Check for missing files
  requiredFields.forEach((field) => {
    if (!files[field]) {
      errors.push(`${field} is required`);
    }
  });

  // Check file types (must be CSV or TXT as per API docs)
  Object.entries(files).forEach(([key, file]) => {
    if (file && file instanceof File) {
      const validTypes = ["text/csv", "text/plain", "application/csv"];
      const validExtensions = [".csv", ".txt"];

      const hasValidType =
        validTypes.includes(file.type) ||
        validExtensions.some((ext) => file.name.toLowerCase().endsWith(ext));

      if (!hasValidType) {
        errors.push(`${key} must be a CSV or TXT file`);
      }
    }
  });

  return {
    valid: errors.length === 0,
    errors,
  };
};
