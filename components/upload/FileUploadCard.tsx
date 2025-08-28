"use client";

import { useState, useRef } from "react";
import { Upload, FileText, X, Check, AlertCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { ErrorDiagnostics } from "./ErrorDiagnostics";

interface FileUploadCardProps {
  title: string;
  description: string;
  onUpload: (file: File) => Promise<{ success: boolean; message: string; error?: string }>;
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
  className 
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
    const validTypes = ['.csv', '.txt'];
    const fileExtension = selectedFile.name.toLowerCase().substring(selectedFile.name.lastIndexOf('.'));
    
    if (!validTypes.includes(fileExtension)) {
      setError('Please select a CSV or TXT file');
      return;
    }

    // Validate file size (10MB limit)
    if (selectedFile.size > 10 * 1024 * 1024) {
      setError('File size must be less than 10MB');
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
      fileInputRef.current.value = '';
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setIsUploading(true);
    setError(null);
    setProgress(0);

    // Simulate progress
    const progressInterval = setInterval(() => {
      setProgress(prev => Math.min(prev + 10, 90));
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
      const errorMessage = err.message || 'Upload failed';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsUploading(false);
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <Card className={cn(
      "w-full transition-all duration-200",
      disabled && "opacity-50 cursor-not-allowed",
      success && "border-green-200 bg-green-50/50",
      error && "border-red-200 bg-red-50/50",
      className
    )}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          {title}
          {success && <Check className="h-4 w-4 text-green-600" />}
          {disabled && <AlertCircle className="h-4 w-4 text-yellow-600" />}
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* File Upload Area */}
        {!file && !success && (
          <div
            className={cn(
              "border-2 border-dashed rounded-lg p-6 text-center transition-colors cursor-pointer",
              disabled 
                ? "border-gray-200 bg-gray-50 cursor-not-allowed" 
                : "border-muted-foreground/25 hover:border-muted-foreground/50"
            )}
            onClick={() => !disabled && fileInputRef.current?.click()}
          >
            <Upload className="h-8 w-8 mx-auto mb-3 text-muted-foreground" />
            <p className="text-sm font-medium mb-1">
              {disabled ? "Upload disabled" : "Click to select file"}
            </p>
            <p className="text-xs text-muted-foreground">
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
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <div className="flex items-center gap-3">
                <FileText className="h-6 w-6 text-primary" />
                <div>
                  <p className="font-medium text-sm">{file.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatFileSize(file.size)}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={error ? "destructive" : "secondary"}>
                  {error ? "Error" : "Ready"}
                </Badge>
                {!isUploading && (
                  <Button variant="ghost" size="sm" onClick={handleRemoveFile}>
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>

            {/* Upload Progress */}
            {isUploading && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
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
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4 mr-2" />
                  Upload File
                </>
              )}
            </Button>
          </div>
        )}

        {/* Success State */}
        {success && (
          <div className="space-y-3">
            <Alert>
              <Check className="h-4 w-4" />
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
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Disabled State Message */}
        {disabled && !success && (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Complete the required dependencies first to enable this upload.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}
