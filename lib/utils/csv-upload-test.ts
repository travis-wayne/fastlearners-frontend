// CSV Upload Test Utility
// This demonstrates how to use the enhanced upload functions

import {
  uploadLessonsFileWithValidation,
  type UploadResult,
} from "@/lib/api/lesson-service";
import {
  LESSON_REQUIRED_COLUMNS,
  validateCSVFile,
} from "@/lib/utils/csv-upload-helper";

/**
 * Test the enhanced CSV upload functionality
 * @param file The CSV file to upload
 * @returns Upload result with detailed information
 */
export async function testLessonCSVUpload(file: File): Promise<UploadResult> {
  console.log("🔄 Testing CSV upload for file:", file.name);

  // First, let's validate the file before attempting upload
  console.log("📋 Step 1: Validating CSV format...");
  const validation = await validateCSVFile({
    file,
    requiredColumns: LESSON_REQUIRED_COLUMNS,
  });

  console.log("📊 Validation Results:");
  console.log(`  ✅ Format detected: ${validation.format}`);
  console.log(`  ✅ Headers found: ${validation.headers.join(", ")}`);
  console.log(`  ✅ Row count: ${validation.rowCount}`);
  console.log(`  ✅ Valid: ${validation.isValid}`);

  if (!validation.isValid) {
    console.log("❌ Validation failed:");
    validation.errors.forEach((error) => console.log(`    - ${error}`));
    if (validation.missingColumns.length > 0) {
      console.log(
        `    - Missing columns: ${validation.missingColumns.join(", ")}`,
      );
    }
  }

  // Now attempt the smart upload
  console.log("📤 Step 2: Attempting smart upload...");
  const uploadResult = await uploadLessonsFileWithValidation(file);

  console.log("📈 Upload Results:");
  console.log(`  ✅ Success: ${uploadResult.success}`);

  if (uploadResult.triedFormats) {
    console.log(`  ✅ Formats tried: ${uploadResult.triedFormats.join(", ")}`);
  }

  if (uploadResult.success) {
    console.log("🎉 Upload successful!");
    if (uploadResult.apiResponse) {
      console.log(`  ✅ API Message: ${uploadResult.apiResponse.message}`);
      console.log(`  ✅ API Code: ${uploadResult.apiResponse.code}`);
    }
  } else {
    console.log("❌ Upload failed:");
    if (uploadResult.error) {
      console.log(`    - Error: ${uploadResult.error}`);
    }
    if (uploadResult.apiResponse) {
      console.log(`    - API Message: ${uploadResult.apiResponse.message}`);
      console.log(`    - API Code: ${uploadResult.apiResponse.code}`);
      if (uploadResult.apiResponse.errors) {
        console.log(`    - API Errors:`, uploadResult.apiResponse.errors);
      }
    }
  }

  return uploadResult;
}

/**
 * Create a File object from a local file path for testing
 * @param filePath Path to the CSV file
 * @returns File object
 */
export async function createFileFromPath(filePath: string): Promise<File> {
  // This would work in a Node.js environment or with a file input
  // For browser usage, you'd typically get the File from an input element

  // Example usage in a React component:
  // const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
  //   const file = event.target.files?.[0];
  //   if (file) {
  //     const result = await testLessonCSVUpload(file);
  //     console.log('Upload result:', result);
  //   }
  // };

  throw new Error(
    "createFileFromPath is not implemented for browser usage. Use a file input element instead.",
  );
}

/**
 * Example usage in a React component
 */
export const ExampleUsage = `
import React, { useState } from 'react';
import { testLessonCSVUpload } from '@/lib/utils/csv-upload-test';
import type { UploadResult } from '@/lib/api/lesson-service';

export function CSVUploadComponent() {
  const [uploadResult, setUploadResult] = useState<UploadResult | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const result = await testLessonCSVUpload(file);
      setUploadResult(result);
    } catch (error) {
      console.error('Upload error:', error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div>
      <input 
        type="file" 
        accept=".csv,.txt"
        onChange={handleFileSelect}
        disabled={isUploading}
      />
      
      {isUploading && <p>Uploading...</p>}
      
      {uploadResult && (
        <div>
          <h3>Upload Result</h3>
          <p>Success: {uploadResult.success ? 'Yes' : 'No'}</p>
          {uploadResult.validation && (
            <div>
              <p>Format: {uploadResult.validation.format}</p>
              <p>Headers: {uploadResult.validation.headers.join(', ')}</p>
              <p>Rows: {uploadResult.validation.rowCount}</p>
            </div>
          )}
          {uploadResult.error && <p style={{ color: 'red' }}>Error: {uploadResult.error}</p>}
          {uploadResult.apiResponse?.message && (
            <p>API Response: {uploadResult.apiResponse.message}</p>
          )}
        </div>
      )}
    </div>
  );
}
`;

/**
 * Quick validation function to check if a CSV file has the right structure
 * without uploading it
 */
export async function quickValidateCSV(file: File): Promise<{
  isValid: boolean;
  format: string;
  headers: string[];
  issues: string[];
}> {
  try {
    const validation = await validateCSVFile({
      file,
      requiredColumns: LESSON_REQUIRED_COLUMNS,
    });

    return {
      isValid: validation.isValid,
      format: validation.format,
      headers: validation.headers,
      issues: validation.errors,
    };
  } catch (error) {
    return {
      isValid: false,
      format: "unknown",
      headers: [],
      issues: [error instanceof Error ? error.message : "Unknown error"],
    };
  }
}
