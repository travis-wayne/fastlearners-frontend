import React from 'react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  getCategoryIcon,
  getErrorColor,
  getErrorBgColor,
  type ParsedUploadError
} from '@/lib/api/upload-error-handler';

interface UploadErrorDisplayProps {
  error: ParsedUploadError;
  fileName?: string;
  onRetry?: () => void;
}

export function UploadErrorDisplay({ error, fileName, onRetry }: UploadErrorDisplayProps) {
  const Icon = getCategoryIcon(error.category);
  const colorClass = getErrorColor(error.category);
  const bgClass = getErrorBgColor(error.category);

  return (
    <Alert className={`border-2 ${bgClass} transition-all duration-200`}>
      <div className="flex items-start gap-3">
        <div className={`rounded-lg p-2 ${bgClass}`}>
          <Icon className={`h-5 w-5 ${colorClass}`} />
        </div>
        <div className="flex-1 space-y-3">
          {/* File name and error category */}
          <div className="space-y-2">
            {fileName && (
              <div className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                {fileName}
              </div>
            )}
            <div className="flex items-center gap-2 flex-wrap">
              <span className={`text-xs font-bold px-2.5 py-1 rounded-md ${bgClass} ${colorClass} border`}>
                {error.category.replace('_', ' ').toUpperCase()}
              </span>
              <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                HTTP {error.code}
              </span>
            </div>
          </div>

          {/* User-friendly error message */}
          <div className="rounded-lg bg-background/50 p-3 border">
            <AlertDescription className="text-sm font-medium text-gray-900 dark:text-gray-100">
              {error.userMessage}
            </AlertDescription>
          </div>

          {/* Detailed error information based on category */}
          {error.details && (
            <div className="space-y-3">
              {/* Missing column error */}
              {error.details.missingColumn && (
                <div className="rounded-lg bg-background p-3 border">
                  <div className="text-sm">
                    <span className="font-semibold text-gray-900 dark:text-gray-100">
                      Missing column:
                    </span>
                    <code className="ml-2 px-2 py-1 bg-red-100 dark:bg-red-900/30 rounded text-red-700 dark:text-red-300 font-mono text-xs">
                      {error.details.missingColumn}
                    </code>
                  </div>
                </div>
              )}

              {/* Missing entity error */}
              {error.details.missingEntity && (
                <div className="rounded-lg bg-background p-3 border">
                  <div className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                    Missing {error.details.missingEntity}
                  </div>
                </div>
              )}

              {/* Field-specific validation errors */}
              {error.details.fieldErrors && Object.keys(error.details.fieldErrors).length > 0 && (
                <div className="rounded-lg bg-background p-3 border space-y-2">
                  <div className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                    Field validation errors:
                  </div>
                  <ul className="space-y-2">
                    {Object.entries(error.details.fieldErrors).map(([field, errors]) => (
                      <li key={field} className="text-sm flex flex-col gap-1">
                        <code className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded text-gray-900 dark:text-gray-100 font-mono text-xs inline-block w-fit">
                          {field}
                        </code>
                        <span className="text-gray-600 dark:text-gray-400 text-xs">
                          {Array.isArray(errors) ? errors.join(', ') : errors}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* Suggested action */}
          {error.suggestedAction && (
            <div className="rounded-lg p-4 bg-blue-50 dark:bg-blue-950/50 border-2 border-blue-200 dark:border-blue-800">
              <div className="flex items-start gap-3">
                <div className="rounded-lg bg-blue-100 dark:bg-blue-900/50 p-2">
                  <svg
                    className="h-5 w-5 text-blue-600 dark:text-blue-400"
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
                  <div className="text-sm font-semibold text-blue-900 dark:text-blue-100 mb-1">
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
                  className="mr-2 h-4 w-4"
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
              <summary className="text-xs text-gray-500 dark:text-gray-400 cursor-pointer hover:text-gray-700 dark:hover:text-gray-300 flex items-center gap-1">
                <svg
                  className="h-3 w-3 transition-transform group-open:rotate-90"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
                Technical details
              </summary>
              <div className="mt-2 p-3 bg-gray-100 dark:bg-gray-800 rounded-lg text-xs text-gray-600 dark:text-gray-400 font-mono border">
                {error.message}
              </div>
            </details>
          )}
        </div>
      </div>
    </Alert>
  );
}
