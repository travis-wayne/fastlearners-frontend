// CSV Upload Helper with format detection and validation

export interface CSVValidationResult {
  isValid: boolean;
  format: "comma" | "pipe" | "unknown";
  headers: string[];
  missingColumns: string[];
  rowCount: number;
  errors: string[];
}

export interface CSVUploadOptions {
  file: File;
  requiredColumns: string[];
  allowedFormats?: ("comma" | "pipe")[];
}

// Required columns for different file types
export const LESSON_REQUIRED_COLUMNS = [
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
];

export const CONCEPT_REQUIRED_COLUMNS = [
  "lesson",
  "title",
  "description",
  "order_index",
];

export const EXAMPLE_REQUIRED_COLUMNS = [
  "concept",
  "title",
  "problem",
  "solution_steps",
  "answer",
  "order_index",
];

export const EXERCISE_REQUIRED_COLUMNS = [
  "concept",
  "title",
  "problem",
  "solution_steps",
  "answers",
  "correct_answer",
  "order_index",
];

export const GENERAL_EXERCISE_REQUIRED_COLUMNS = [
  "lesson",
  "problem",
  "solution_steps",
  "answers",
  "correct_answer",
  "order_index",
];

export const CHECK_MARKER_REQUIRED_COLUMNS = [
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
];

export const SCHEME_OF_WORK_REQUIRED_COLUMNS = [
  "subject",
  "class",
  "term",
  "week",
  "topic",
  "breakdown",
];

/**
 * Parse CSV content and detect format
 */
export function parseCSVContent(content: string): CSVValidationResult {
  const lines = content.trim().split("\n");

  if (lines.length < 1) {
    return {
      isValid: false,
      format: "unknown",
      headers: [],
      missingColumns: [],
      rowCount: 0,
      errors: ["File is empty"],
    };
  }

  // Clean the first line of any BOM or special characters
  let headerLine = lines[0].replace(/^\uFEFF/, ""); // Remove BOM

  // Check if this is the numbered format used by the API (e.g., "1|header1,header2,header3")
  const numberedFormatMatch = headerLine.match(/^\d+\|(.*)$/);
  if (numberedFormatMatch) {
    headerLine = numberedFormatMatch[1]; // Extract content after number|
    // This indicates the API's expected format: numbered rows with comma-separated content
    const headers = parseCSVLine(headerLine).map((h) =>
      h.replace(/^["']|["']$/g, "").trim(),
    );

    return {
      isValid: headers.length > 0,
      format: "comma", // API format is comma-separated after the row number
      headers,
      missingColumns: [],
      rowCount: lines.length - 1,
      errors: [],
    };
  }

  // Standard CSV detection (fallback)
  headerLine = headerLine.replace(/^\d+\|/, ""); // Remove row number prefix if present

  // Detect format by checking delimiters
  const commaCount = (headerLine.match(/,/g) || []).length;
  const pipeCount = (headerLine.match(/\|/g) || []).length;

  let format: "comma" | "pipe" | "unknown" = "unknown";
  let headers: string[] = [];

  if (pipeCount > commaCount && pipeCount > 0) {
    format = "pipe";
    headers = headerLine.split("|").map((h) => h.trim());
  } else if (commaCount > 0) {
    format = "comma";
    // Handle CSV parsing with proper quote handling
    headers = parseCSVLine(headerLine);
  } else {
    return {
      isValid: false,
      format: "unknown",
      headers: [],
      missingColumns: [],
      rowCount: 0,
      errors: ["Unable to detect CSV format (no commas or pipes found)"],
    };
  }

  // Clean headers of quotes and whitespace
  headers = headers.map((h) => h.replace(/^["']|["']$/g, "").trim());

  return {
    isValid: headers.length > 0,
    format,
    headers,
    missingColumns: [],
    rowCount: lines.length - 1, // Subtract header row
    errors: [],
  };
}

/**
 * Parse a CSV line respecting quotes
 */
function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = "";
  let inQuotes = false;
  let i = 0;

  while (i < line.length) {
    const char = line[i];
    const nextChar = line[i + 1];

    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        // Escaped quote
        current += '"';
        i += 2;
        continue;
      } else {
        // Toggle quote state
        inQuotes = !inQuotes;
      }
    } else if (char === "," && !inQuotes) {
      // Field separator
      result.push(current.trim());
      current = "";
    } else {
      current += char;
    }
    i++;
  }

  // Add the last field
  result.push(current.trim());

  return result;
}

/**
 * Validate CSV against required columns
 */
export function validateCSVColumns(
  csvResult: CSVValidationResult,
  requiredColumns: string[],
): CSVValidationResult {
  const normalizedHeaders = csvResult.headers.map((h) =>
    h.toLowerCase().trim(),
  );
  const normalizedRequired = requiredColumns.map((c) => c.toLowerCase().trim());

  const missingColumns = normalizedRequired.filter(
    (required) => !normalizedHeaders.includes(required),
  );

  const errors = [...csvResult.errors];

  if (missingColumns.length > 0) {
    errors.push(`Missing required columns: ${missingColumns.join(", ")}`);
  }

  return {
    ...csvResult,
    isValid:
      csvResult.isValid && missingColumns.length === 0 && errors.length === 0,
    missingColumns,
    errors,
  };
}

/**
 * Validate and prepare CSV file for upload
 */
export async function validateCSVFile(
  options: CSVUploadOptions,
): Promise<CSVValidationResult> {
  try {
    // Read file content
    const content = await options.file.text();

    // Parse and detect format
    const csvResult = parseCSVContent(content);

    // Validate required columns
    const validationResult = validateCSVColumns(
      csvResult,
      options.requiredColumns,
    );

    // Check if format is allowed
    if (
      options.allowedFormats &&
      !options.allowedFormats.includes(validationResult.format as any)
    ) {
      validationResult.errors.push(
        `Format '${validationResult.format}' not allowed. Allowed formats: ${options.allowedFormats.join(", ")}`,
      );
      validationResult.isValid = false;
    }

    return validationResult;
  } catch (error) {
    return {
      isValid: false,
      format: "unknown",
      headers: [],
      missingColumns: options.requiredColumns,
      rowCount: 0,
      errors: [
        `Error reading file: ${error instanceof Error ? error.message : "Unknown error"}`,
      ],
    };
  }
}

/**
 * Convert CSV content to standardized format
 */
export function normalizeCSVContent(
  content: string,
  targetFormat: "comma" | "pipe",
): string {
  const lines = content.trim().split("\n");
  const csvResult = parseCSVContent(content);

  if (!csvResult.isValid || csvResult.format === "unknown") {
    return content; // Return as-is if we can't parse it
  }

  const normalizedLines: string[] = [];

  for (const line of lines) {
    // Clean line of row number prefixes and BOM
    let cleanLine = line.replace(/^\uFEFF/, "").replace(/^\d+\|/, "");

    if (csvResult.format === targetFormat) {
      normalizedLines.push(cleanLine);
      continue;
    }

    // Convert between formats
    let fields: string[];

    if (csvResult.format === "comma") {
      fields = parseCSVLine(cleanLine);
    } else {
      fields = cleanLine.split("|").map((f) => f.trim());
    }

    // Convert to target format
    if (targetFormat === "pipe") {
      normalizedLines.push(fields.join("|"));
    } else {
      // Convert to comma format with proper quoting
      const quotedFields = fields.map((field) => {
        // Quote fields that contain commas, quotes, or newlines
        if (
          field.includes(",") ||
          field.includes('"') ||
          field.includes("\n")
        ) {
          return '"' + field.replace(/"/g, '""') + '"';
        }
        return field;
      });
      normalizedLines.push(quotedFields.join(","));
    }
  }

  return normalizedLines.join("\n");
}

/**
 * Create a standardized File object with normalized content
 */
export function createNormalizedFile(
  originalFile: File,
  normalizedContent: string,
  targetFormat: "comma" | "pipe",
): File {
  const filename =
    originalFile.name.replace(/\.[^/.]+$/, "") +
    `_${targetFormat}.${originalFile.name.split(".").pop()}`;

  return new File([normalizedContent], filename, {
    type: originalFile.type || "text/csv",
    lastModified: Date.now(),
  });
}

/**
 * Convert CSV content to the API's expected numbered row format
 * The API expects format like: "1|header1,header2,header3" for headers
 * and "2|value1,value2,value3" for data rows
 */
export function convertToAPIFormat(content: string): string {
  const lines = content.trim().split("\n");
  const numberedLines: string[] = [];

  // Check if already in numbered format
  if (lines.length > 0 && /^\d+\|/.test(lines[0])) {
    return content; // Already in correct format
  }

  // Convert to numbered format
  lines.forEach((line, index) => {
    if (line.trim()) {
      // Skip empty lines
      const rowNumber = index + 1;
      // Add BOM to first line (header) if not present
      if (index === 0 && !line.startsWith("\uFEFF")) {
        line = "\uFEFF" + line;
      }
      numberedLines.push(`${rowNumber}|${line}`);
    }
  });

  return numberedLines.join("\n");
}

/**
 * Create a File object with API-formatted content
 */
export function createAPIFormattedFile(
  originalFile: File,
  content: string,
): File {
  const apiContent = convertToAPIFormat(content);
  const filename =
    originalFile.name.replace(/\.[^/.]+$/, "") +
    `_api_format.${originalFile.name.split(".").pop()}`;

  return new File([apiContent], filename, {
    type: originalFile.type || "text/csv",
    lastModified: Date.now(),
  });
}
