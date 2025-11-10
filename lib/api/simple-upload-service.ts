// Client-side upload service - uses internal API routes for security

export interface SimpleUploadResult {
  success: boolean;
  message: string;
  error?: string;
}

// Simple upload function for check markers
export const uploadCheckMarkersSimple = async (
  file: File,
): Promise<SimpleUploadResult> => {
  try {
    const formData = new FormData();
    formData.append("check_markers_file", file);

    console.log(
      "Simple upload - FormData contents:",
      formData.get("check_markers_file"),
    );
    console.log("Simple upload - File details:", {
      name: file.name,
      size: file.size,
      type: file.type,
    });

    const response = await fetch("/api/uploads/check-markers", {
      method: "POST",
      credentials: "include",
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: "Upload failed",
        error: data?.message || "Unknown error occurred",
      };
    }

    return {
      success: true,
      message: data?.message || "Check markers uploaded successfully!",
    };
  } catch (error: any) {
    return {
      success: false,
      message: "Upload failed",
      error: error.message || "Unknown error occurred",
    };
  }
};

// Simple upload function for scheme of work
export const uploadSchemeOfWorkSimple = async (
  file: File,
): Promise<SimpleUploadResult> => {
  try {
    const formData = new FormData();
    formData.append("scheme_of_work_file", file);

    const response = await fetch("/api/uploads/scheme-of-work", {
      method: "POST",
      credentials: "include",
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: "Upload failed",
        error: data?.message || "Unknown error occurred",
      };
    }

    return {
      success: true,
      message: data?.message || "Scheme of work uploaded successfully!",
    };
  } catch (error: any) {
    return {
      success: false,
      message: "Upload failed",
      error: error.message || "Unknown error occurred",
    };
  }
};
