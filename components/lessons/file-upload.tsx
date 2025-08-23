"use client";

import { useState, useRef, useCallback } from "react";
import { Upload, FileText, X, Check, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { validateCSVFormat, CSV_COLUMNS } from "@/lib/api/lesson-service";

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  onFileRemove: () => void;
  fileType: keyof typeof CSV_COLUMNS;
  title: string;
  description: string;
  acceptedFormats?: string[];
  maxFileSize?: number; // in MB
  selectedFile?: File | null;
  isUploading?: boolean;
  uploadProgress?: number;
  error?: string | null;
  success?: boolean;
}

export default function FileUpload({
  onFileSelect,
  onFileRemove,
  fileType,
  title,
  description,
  acceptedFormats = [".csv", ".txt"],
  maxFileSize = 10,
  selectedFile,
  isUploading = false,
  uploadProgress = 0,
  error,
  success
}: FileUploadProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [isValidating, setIsValidating] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = async (file: File): Promise<boolean> => {
    setIsValidating(true);
    setValidationError(null);

    try {
      // Check file size
      if (file.size > maxFileSize * 1024 * 1024) {
        setValidationError(`File size must be less than ${maxFileSize}MB`);
        return false;
      }

      // Check file extension
      const fileExtension = file.name.toLowerCase().substring(file.name.lastIndexOf('.'));
      if (!acceptedFormats.includes(fileExtension)) {
        setValidationError(`File must be one of: ${acceptedFormats.join(', ')}`);
        return false;
      }

      // Validate CSV structure
      const expectedColumns = CSV_COLUMNS[fileType];
      const isValidFormat = await validateCSVFormat(file, expectedColumns);
      
      if (!isValidFormat) {
        setValidationError(
          `Invalid CSV format. Required columns: ${expectedColumns.join(', ')}`
        );
        return false;
      }

      return true;
    } catch (err) {
      setValidationError('Error validating file format');
      return false;
    } finally {
      setIsValidating(false);
    }
  };

  const handleFileSelection = async (file: File) => {
    const isValid = await validateFile(file);
    if (isValid) {
      onFileSelect(file);
    }
  };

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelection(files[0]);
    }
  }, []);

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelection(files[0]);
    }
  };

  const handleRemoveFile = () => {
    setValidationError(null);
    onFileRemove();
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getStatusColor = () => {
    if (error || validationError) return "destructive";
    if (success) return "default";
    if (selectedFile && !validationError) return "secondary";
    return "outline";
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          {title}
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* File Upload Area */}
        {!selectedFile && (
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer ${
              isDragOver
                ? "border-primary bg-primary/10"
                : "border-muted-foreground/25 hover:border-muted-foreground/50"
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload className="h-10 w-10 mx-auto mb-4 text-muted-foreground" />
            <p className="text-lg font-medium mb-2">
              {isValidating ? "Validating file..." : "Drop your file here, or click to browse"}
            </p>
            <p className="text-sm text-muted-foreground mb-4">
              Supports: {acceptedFormats.join(', ')} (max {maxFileSize}MB)
            </p>
            <Button disabled={isValidating}>
              {isValidating ? "Validating..." : "Select File"}
            </Button>
          </div>
        )}

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept={acceptedFormats.join(',')}
          onChange={handleFileInputChange}
          className="hidden"
        />

        {/* Selected File Display */}
        {selectedFile && (
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <div className="flex items-center gap-3">
                <FileText className="h-8 w-8 text-primary" />
                <div>
                  <p className="font-medium">{selectedFile.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {formatFileSize(selectedFile.size)}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={getStatusColor()}>
                  {success && <Check className="h-3 w-3 mr-1" />}
                  {error || validationError ? (
                    <AlertCircle className="h-3 w-3 mr-1" />
                  ) : null}
                  {success ? "Uploaded" : validationError ? "Invalid" : "Ready"}
                </Badge>
                {!isUploading && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleRemoveFile}
                  >
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
                  <span>{uploadProgress}%</span>
                </div>
                <Progress value={uploadProgress} className="h-2" />
              </div>
            )}
          </div>
        )}

        {/* Error Messages */}
        {(error || validationError) && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {error || validationError}
            </AlertDescription>
          </Alert>
        )}

        {/* Success Message */}
        {success && !error && !validationError && (
          <Alert>
            <Check className="h-4 w-4" />
            <AlertDescription>
              File uploaded successfully!
            </AlertDescription>
          </Alert>
        )}

        {/* Column Requirements */}
        <div className="bg-muted/50 p-3 rounded-lg">
          <p className="text-sm font-medium mb-2">Required CSV columns:</p>
          <div className="flex flex-wrap gap-1">
            {CSV_COLUMNS[fileType].map((column) => (
              <Badge key={column} variant="outline" className="text-xs">
                {column}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
