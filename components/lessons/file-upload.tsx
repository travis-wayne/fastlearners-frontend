"use client";

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { 
  Upload, 
  FileText, 
  X, 
  CheckCircle, 
  AlertCircle,
  Download,
  Eye
} from 'lucide-react';
import { toast } from 'sonner';

// Import CSV_COLUMNS for validation
const CSV_COLUMNS = {
  lessons: ['id', 'topic', 'overview', 'class', 'subject', 'term', 'week', 'objectives', 'key_concepts'],
  concepts: ['id', 'lesson_id', 'title', 'description', 'detailed_explanation', 'practical_applications'],
  examples: ['id', 'concept_id', 'title', 'description', 'solution_steps', 'solution_explanation'],
  exercises: ['id', 'concept_id', 'question', 'options', 'correct_answer', 'explanation', 'difficulty_level'],
  general_exercises: ['id', 'lesson_id', 'question', 'options', 'correct_answer', 'explanation', 'difficulty_level'],
  check_markers: ['id', 'lesson_id', 'marker_type', 'question', 'expected_answer', 'scoring_criteria', 'points'],
  scheme_of_work: ['id', 'class', 'subject', 'term', 'week', 'topic', 'subtopic', 'learning_objectives', 'activities']
};

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  onFileRemove: () => void;
  fileType: keyof typeof CSV_COLUMNS;
  title: string;
  description: string;
  selectedFile?: File | null;
  isUploading?: boolean;
  uploadProgress?: number;
  error?: string | null;
  success?: boolean;
  maxSize?: number; // in MB
}

export default function FileUpload({
  onFileSelect,
  onFileRemove,
  fileType,
  title,
  description,
  selectedFile = null,
  isUploading = false,
  uploadProgress = 0,
  error = null,
  success = false,
  maxSize = 10
}: FileUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  const validateFile = (file: File): string[] => {
    const errors: string[] = [];
    
    // Check file size
    const fileSizeInMB = file.size / (1024 * 1024);
    if (fileSizeInMB > maxSize) {
      errors.push(`File size (${fileSizeInMB.toFixed(2)}MB) exceeds maximum allowed size of ${maxSize}MB`);
    }
    
    // Check file type
    const allowedTypes = ['.csv', '.txt'];
    const fileExtension = file.name.toLowerCase().slice(file.name.lastIndexOf('.'));
    if (!allowedTypes.includes(fileExtension)) {
      errors.push(`Invalid file type. Only CSV and TXT files are allowed.`);
    }
    
    // Basic content validation (we can't fully validate CSV structure without parsing)
    if (file.type && !['text/csv', 'text/plain', 'application/csv'].includes(file.type)) {
      errors.push('File appears to be in wrong format. Please ensure it\'s a CSV or TXT file.');
    }
    
    return errors;
  };

  const handleFileSelection = (file: File) => {
    const errors = validateFile(file);
    setValidationErrors(errors);
    
    if (errors.length === 0) {
      onFileSelect(file);
      toast.success(`${file.name} selected successfully`);
    } else {
      toast.error(`File validation failed: ${errors[0]}`);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      handleFileSelection(files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelection(files[0]);
    }
  };

  const handleRemoveFile = () => {
    onFileRemove();
    setValidationErrors([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    toast.success('File removed');
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getExpectedColumns = (): string[] => {
    return CSV_COLUMNS[fileType] || [];
  };

  return (
    <Card className={`transition-all duration-200 ${
      success ? 'border-green-200 bg-green-50/30' : 
      error || validationErrors.length > 0 ? 'border-red-200 bg-red-50/30' : 
      dragActive ? 'border-primary bg-primary/5' : ''
    }`}>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg flex items-center gap-2">
              <FileText className="h-5 w-5" />
              {title}
            </CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
          {success && <CheckCircle className="h-6 w-6 text-green-600" />}
          {(error || validationErrors.length > 0) && <AlertCircle className="h-6 w-6 text-red-600" />}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Upload Area */}
        {!selectedFile && (
          <div
            className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
              dragActive ? 'border-primary bg-primary/10' : 'border-muted-foreground/25 hover:border-primary/50'
            } ${isUploading ? 'pointer-events-none opacity-50' : 'cursor-pointer'}`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <div className="space-y-2">
              <p className="text-lg font-medium">
                {dragActive ? 'Drop your file here' : 'Choose a file or drag it here'}
              </p>
              <p className="text-sm text-muted-foreground">
                CSV or TXT files only, up to {maxSize}MB
              </p>
            </div>
          </div>
        )}

        {/* Selected File Info */}
        {selectedFile && (
          <div className="border rounded-lg p-4 space-y-3">
            <div className="flex items-center justify-between">
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
                {success && <Badge className="bg-green-100 text-green-800">Uploaded</Badge>}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleRemoveFile}
                  disabled={isUploading}
                >
                  <X className="h-4 w-4" />
                </Button>
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

        {/* Validation Errors */}
        {validationErrors.length > 0 && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <ul className="list-disc list-inside space-y-1">
                {validationErrors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </AlertDescription>
          </Alert>
        )}

        {/* Error Message */}
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Success Message */}
        {success && (
          <Alert className="border-green-200 bg-green-50">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              File uploaded successfully!
            </AlertDescription>
          </Alert>
        )}

        {/* Expected Columns Info */}
        <div className="bg-muted/50 p-3 rounded-lg">
          <h4 className="text-sm font-medium mb-2">Expected CSV Columns:</h4>
          <div className="flex flex-wrap gap-1">
            {getExpectedColumns().map((column, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {column}
              </Badge>
            ))}
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Use pipe (|) as column delimiter. Ensure all columns are present in your CSV file.
          </p>
        </div>

        {/* Hidden File Input */}
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv,.txt"
          onChange={handleFileInputChange}
          className="hidden"
        />
      </CardContent>
    </Card>
  );
}
