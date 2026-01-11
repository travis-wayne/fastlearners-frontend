"use client";

import { useRef, useState } from "react";
import { AlertCircle, Check, FileText, Loader2, Upload, X } from "lucide-react";
import { toast } from "sonner";

import { cn } from "@/lib/utils";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

import { ErrorDiagnostics } from "./ErrorDiagnostics";

interface FileUploadCardProps {
  title: string;
  description: string;
  onUpload: (
    file: File,
  ) => Promise<{ success: boolean; message: string; error?: string }>;
  disabled?: boolean;
  completed?: boolean;
  className?: string;
}

export function FileUploadCard({
  title,
  description,
  onUpload,
  disabled = false,
  completed = false,
  className,
}: FileUploadCardProps) {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(completed);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (!selectedFile) return;

    // Validate file type
    const validTypes = [".csv", ".txt"];
    const fileExtension = selectedFile.name
      .toLowerCase()
      .substring(selectedFile.name.lastIndexOf("."));

    if (!validTypes.includes(fileExtension)) {
      setError("Please select a CSV or TXT file");
      return;
    }

    // Validate file size (10MB limit)
    if (selectedFile.size > 10 * 1024 * 1024) {
      setError("File size must be less than 10MB");
      return;
    }

    setFile(selectedFile);
    setError(null);
    setSuccess(false);
    setProgress(0);
  };

  const handleRemoveFile = () => {
    setFile(null);
    setError(null);
    setSuccess(false);
    setProgress(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setIsUploading(true);
    setError(null);
    setProgress(0);

    // Simulate progress
    const progressInterval = setInterval(() => {
      setProgress((prev) => Math.min(prev + 10, 90));
    }, 100);

    try {
      const result = await onUpload(file);

      clearInterval(progressInterval);
      setProgress(100);

      if (result.success) {
        setSuccess(true);
        toast.success(result.message);
      } else {
        setError(result.error || result.message);
        toast.error(result.error || result.message);
        setProgress(0);
      }
    } catch (err: any) {
      clearInterval(progressInterval);
      setProgress(0);
      const errorMessage = err.message || "Upload failed";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsUploading(false);
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <Card
      className={cn(
        "w-full transition-all duration-200",
        disabled && "cursor-not-allowed opacity-50",
        success && "border-green-200 bg-green-50/50",
        error && "border-red-200 bg-red-50/50",
        className,
      )}
    >
      <CardHeader className="p-component-sm sm:p-component-md">
        <CardTitle className="flex items-center gap-2 text-heading-md sm:text-heading-lg">
          <FileText className="size-4 sm:size-5" />
          {title}
          {success && <Check className="size-4 text-green-600" />}
          {disabled && <AlertCircle className="size-4 text-yellow-600" />}
        </CardTitle>
        <CardDescription className="text-xs sm:text-sm">{description}</CardDescription>
      </CardHeader>

      <CardContent className="space-y-component-sm p-component-sm sm:space-y-component-md sm:p-component-md">
        {/* File Upload Area */}
        {!file && !success && (
          <div
            className={cn(
              "min-h-[120px] cursor-pointer rounded-lg border-2 border-dashed p-4 text-center transition-colors sm:min-h-[150px] sm:p-6",
              disabled
                ? "cursor-not-allowed border-gray-200 bg-gray-50"
                : "border-muted-foreground/25 hover:border-muted-foreground/50",
            )}
            onClick={() => !disabled && fileInputRef.current?.click()}
          >
            <Upload className="mx-auto mb-2 size-6 text-muted-foreground sm:mb-3 sm:size-8" />
            <p className="mb-1 text-xs font-medium sm:text-sm">
              {disabled ? "Upload disabled" : "Click to select file"}
            </p>
            <p className="text-[10px] text-muted-foreground sm:text-xs">
              CSV or TXT files only (max 10MB)
            </p>
          </div>
        )}

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv,.txt"
          onChange={handleFileSelect}
          disabled={disabled}
          className="hidden"
        />

        {/* Selected File Display */}
        {file && !success && (
          <div className="space-y-component-xs sm:space-y-component-sm">
            <div className="flex flex-col gap-3 rounded-lg bg-muted p-3 sm:flex-row sm:items-center sm:justify-between sm:p-4">
              <div className="flex items-center gap-3">
                <FileText className="size-5 text-primary sm:size-6" />
                <div>
                  <p className="text-xs font-medium sm:text-sm">{file.name}</p>
                  <p className="text-[10px] text-muted-foreground sm:text-xs">
                    {formatFileSize(file.size)}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={error ? "destructive" : "secondary"} className="text-[10px] sm:text-xs">
                  {error ? "Error" : "Ready"}
                </Badge>
                {!isUploading && (
                  <Button variant="ghost" size="sm" onClick={handleRemoveFile}>
                    <X className="size-4" />
                  </Button>
                )}
              </div>
            </div>

            {/* Upload Progress */}
            {isUploading && (
              <div className="space-y-component-xs">
                <div className="flex justify-between text-xs sm:text-sm">
                  <span>Uploading...</span>
                  <span>{progress}%</span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>
            )}

            {/* Upload Button */}
            <Button
              onClick={handleUpload}
              disabled={isUploading || disabled}
              className="w-full"
              size="lg"
            >
              {isUploading ? (
                <>
                  <Loader2 className="mr-2 size-4 animate-spin" />
                  <span className="text-sm sm:text-base">Uploading...</span>
                </>
              ) : (
                <>
                  <Upload className="mr-2 size-4" />
                  <span className="text-sm sm:text-base">Upload File</span>
                </>
              )}
            </Button>
          </div>
        )}

        {/* Success State */}
        {success && (
          <div className="space-y-3">
            <Alert>
              <Check className="size-4" />
              <AlertDescription>
                <strong>{title}</strong> uploaded successfully!
              </AlertDescription>
            </Alert>
            <Button
              variant="outline"
              onClick={handleRemoveFile}
              className="w-full"
            >
              Upload Another File
            </Button>
          </div>
        )}

        {/* Error State */}
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="size-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Disabled State Message */}
        {disabled && !success && (
          <Alert>
            <AlertCircle className="size-4" />
            <AlertDescription>
              Complete the required dependencies first to enable this upload.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}
