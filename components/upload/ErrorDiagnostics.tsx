"use client";

import { AlertCircle, CheckCircle, FileText } from "lucide-react";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface ErrorDiagnosticsProps {
  error: string;
  fileType: string;
  className?: string;
}

export function ErrorDiagnostics({
  error,
  fileType,
  className,
}: ErrorDiagnosticsProps) {
  const getDiagnostics = (error: string, fileType: string) => {
    const diagnostics: Array<{
      type: "error" | "warning" | "info";
      message: string;
      solution?: string;
    }> = [];

    // Check Markers specific errors
    if (fileType === "check_markers") {
      if (error.includes("Validation failed") || error.includes("422")) {
        diagnostics.push({
          type: "error",
          message: "CSV validation failed",
          solution:
            "Check that your file has all required columns: lesson, overview, lesson_video, concept_one through concept_seven, general_exercises",
        });
      }

      if (error.includes("not found")) {
        diagnostics.push({
          type: "error",
          message: "Referenced lesson not found",
          solution:
            "Make sure the lesson name in your check_markers file exactly matches a lesson that was already uploaded",
        });
      }
    }

    // Scheme of Work specific errors
    if (fileType === "scheme_of_work") {
      if (error.includes("Invalid JSON format in breakdown")) {
        diagnostics.push({
          type: "error",
          message: "Invalid JSON in breakdown field",
          solution:
            'The breakdown field must contain valid JSON. Example: ["Week 1 activities", "Week 2 review"]',
        });
      }

      if (error.includes("Class") && error.includes("not found")) {
        diagnostics.push({
          type: "error",
          message: "Referenced class not found",
          solution:
            "Ensure the class name exists in the system before uploading",
        });
      }
    }

    // General validation errors
    if (error.includes("All columns are required")) {
      diagnostics.push({
        type: "error",
        message: "Missing required columns",
        solution: `Your CSV must include all required columns for ${fileType}`,
      });
    }

    if (error.includes("file field is required")) {
      diagnostics.push({
        type: "error",
        message: "File not properly attached",
        solution: "Try selecting the file again and ensure it's a valid CSV",
      });
    }

    // If no specific diagnostics, provide general help
    if (diagnostics.length === 0) {
      diagnostics.push({
        type: "info",
        message: "Upload failed with API error",
        solution:
          "Check the error message above for specific details, or verify your file format and data",
      });
    }

    return diagnostics;
  };

  const getRequiredColumns = (fileType: string): string[] => {
    const columnMap: Record<string, string[]> = {
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
      scheme_of_work: [
        "subject",
        "class",
        "term",
        "week",
        "topic",
        "breakdown",
      ],
    };

    return columnMap[fileType] || [];
  };

  const diagnostics = getDiagnostics(error, fileType);
  const requiredColumns = getRequiredColumns(fileType);

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertCircle className="size-5 text-red-500" />
          Upload Error Diagnostics
        </CardTitle>
        <CardDescription>
          Analysis and suggestions for fixing the upload error
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Error Analysis */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium">Identified Issues:</h4>
          {diagnostics.map((diagnostic, index) => (
            <Alert
              key={index}
              variant={diagnostic.type === "error" ? "destructive" : "default"}
            >
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  {diagnostic.type === "error" ? (
                    <AlertCircle className="size-4" />
                  ) : diagnostic.type === "warning" ? (
                    <AlertCircle className="size-4 text-yellow-600" />
                  ) : (
                    <FileText className="size-4" />
                  )}
                  <span className="font-medium">{diagnostic.message}</span>
                </div>
                {diagnostic.solution && (
                  <AlertDescription className="mt-2">
                    <strong>Solution:</strong> {diagnostic.solution}
                  </AlertDescription>
                )}
              </div>
            </Alert>
          ))}
        </div>

        {/* Required Columns */}
        {requiredColumns.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium">
              Required Columns for {fileType}:
            </h4>
            <div className="flex flex-wrap gap-1">
              {requiredColumns.map((column) => (
                <Badge key={column} variant="outline" className="text-xs">
                  {column}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Raw Error */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Raw Error Message:</h4>
          <div className="break-words rounded-lg bg-muted p-3 font-mono text-sm">
            {error}
          </div>
        </div>

        {/* Common Solutions */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Common Solutions:</h4>
          <ul className="space-y-1 text-sm text-muted-foreground">
            <li>
              • Ensure all required columns are present and spelled correctly
            </li>
            <li>• Check that JSON fields (if any) contain valid JSON format</li>
            <li>
              • Verify that referenced entities (lessons, concepts, classes)
              exist
            </li>
            <li>
              • Make sure there are no special characters or encoding issues
            </li>
            <li>• Try re-saving the CSV with UTF-8 encoding</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
