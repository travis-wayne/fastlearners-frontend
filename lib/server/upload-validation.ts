export const VALID_UPLOAD_MIME_TYPES = [
  "text/csv",
  "text/plain",
  "application/csv",
];

export const VALID_UPLOAD_EXTENSIONS = [".csv", ".txt"];

export const MAX_UPLOAD_SIZE_BYTES = 10 * 1024 * 1024; // 10MB

export function isValidUploadFile(file: File): boolean {
  const lowerName = file.name.toLowerCase();
  const hasValidExtension = VALID_UPLOAD_EXTENSIONS.some((ext) =>
    lowerName.endsWith(ext)
  );
  const hasValidType = VALID_UPLOAD_MIME_TYPES.includes(file.type);
  return hasValidExtension || hasValidType;
}


