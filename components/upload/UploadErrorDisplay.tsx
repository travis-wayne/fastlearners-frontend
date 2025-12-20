import React from "react";

import {
  getCategoryIcon,
  getErrorBgColor,
  getErrorColor,
  type ParsedUploadError,
} from "@/lib/api/upload-error-handler";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

interface UploadErrorDisplayProps {
  error: ParsedUploadError;
  fileName?: string;
  onRetry?: () => void;
}

export function UploadErrorDisplay({
  error,
  fileName,
  onRetry,
}: UploadErrorDisplayProps) {
  const Icon = getCategoryIcon(error.category);
  const colorClass = getErrorColor(error.category);
  const bgClass = getErrorBgColor(error.category);

  return (
    <Alert className={`border-2 ${bgClass} transition-all duration-200`}>
      <div className="flex items-start gap-3">
        <div className={`rounded-lg ${bgClass} p-2`}>
          <Icon className={`size-5 ${colorClass}`} />
        </div>
        <div className="flex-1 space-y-3">
          {/* File name and error category */}
          <div className="space-y-2">
            {fileName && (
              <div className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                {fileName}
              </div>
            )}
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={`rounded-md border ${bgClass} px-2.5 py-1 text-xs font-bold ${colorClass}`}
              >
                {error.category.replace("_", " ").toUpperCase()}
              </span>
              <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                HTTP {error.code}
              </span>
            </div>
          </div>

          {/* User-friendly error message */}
          <div className="rounded-lg border bg-background/50 p-3">
            <AlertDescription className="text-sm font-medium text-gray-900 dark:text-gray-100">
              {error.userMessage}
            </AlertDescription>
          </div>

          {/* Detailed error information based on category */}
          {error.details && (
            <div className="space-y-3">
              {/* Missing column error */}
              {error.details.missingColumn && (
                <div className="rounded-lg border bg-background p-3">
                  <div className="text-sm">
                    <span className="font-semibold text-gray-900 dark:text-gray-100">
                      Missing column:
                    </span>
                    <code className="ml-2 rounded bg-red-100 px-2 py-1 font-mono text-xs text-red-700 dark:bg-red-900/30 dark:text-red-300">
                      {error.details.missingColumn}
                    </code>
                  </div>
                </div>
              )}

              {/* Missing entity error */}
              {error.details.missingEntity && (
                <div className="rounded-lg border bg-background p-3">
                  <div className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                    Missing {error.details.missingEntity}
                  </div>
                </div>
              )}

              {/* Field-specific validation errors */}
              {error.details.fieldErrors &&
                Object.keys(error.details.fieldErrors).length > 0 && (
                  <div className="space-y-2 rounded-lg border bg-background p-3">
                    <div className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                      Field validation errors:
                    </div>
                    <ul className="space-y-2">
                      {Object.entries(error.details.fieldErrors).map(
                        ([field, errors]) => (
                          <li
                            key={field}
                            className="flex flex-col gap-1 text-sm"
                          >
                            <code className="inline-block w-fit rounded bg-gray-100 px-2 py-1 font-mono text-xs text-gray-900 dark:bg-gray-800 dark:text-gray-100">
                              {field}
                            </code>
                            <span className="text-xs text-gray-600 dark:text-gray-400">
                              {Array.isArray(errors)
                                ? errors.join(", ")
                                : errors}
                            </span>
                          </li>
                        ),
                      )}
                    </ul>
                  </div>
                )}
            </div>
          )}

          {/* Suggested action */}
          {error.suggestedAction && (
            <div className="rounded-lg border-2 border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-950/50">
              <div className="flex items-start gap-3">
                <div className="rounded-lg bg-blue-100 p-2 dark:bg-blue-900/50">
                  <svg
                    className="size-5 text-blue-600 dark:text-blue-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div className="flex-1">
                  <div className="mb-1 text-sm font-semibold text-blue-900 dark:text-blue-100">
                    💡 Suggested action
                  </div>
                  <div className="text-sm text-blue-800 dark:text-blue-200">
                    {error.suggestedAction}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Retry button if provided */}
          {onRetry && (
            <div className="flex gap-2">
              <Button
                onClick={onRetry}
                variant="default"
                size="sm"
                className={colorClass}
              >
                <svg
                  className="mr-2 size-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
                Try Again
              </Button>
            </div>
          )}

          {/* Original error message for debugging */}
          {error.message !== error.userMessage && (
            <details className="group">
              <summary className="flex cursor-pointer items-center gap-1 text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
                <svg
                  className="size-3 transition-transform group-open:rotate-90"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
                Technical details
              </summary>
              <div className="mt-2 rounded-lg border bg-gray-100 p-3 font-mono text-xs text-gray-600 dark:bg-gray-800 dark:text-gray-400">
                {error.message}
              </div>
            </details>
          )}
        </div>
      </div>
    </Alert>
  );
}
