"use client";

import { useState } from "react";
import { toast } from "sonner";
import { DashboardHeader } from "@/components/dashboard/header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, Upload, FileText, AlertCircle } from "lucide-react";
import FileUpload from "@/components/lessons/file-upload";
import {
  uploadAllLessonFiles,
  CSV_COLUMNS
} from "@/lib/api/lesson-service";
// Note: metadata cannot be exported from client components

interface FileState {
  file: File | null;
  error: string | null;
}

interface BulkUploadState {
  isUploading: boolean;
  progress: number;
  error: string | null;
  success: boolean;
}

const initialFileState: FileState = {
  file: null,
  error: null
};

const initialUploadState: BulkUploadState = {
  isUploading: false,
  progress: 0,
  error: null,
  success: false
};

export default function BulkUploadPage() {
  const [files, setFiles] = useState<Record<string, FileState>>({
    lessons_file: { ...initialFileState },
    concepts_file: { ...initialFileState },
    examples_file: { ...initialFileState },
    exercises_file: { ...initialFileState },
    general_exercises_file: { ...initialFileState },
    check_markers_file: { ...initialFileState }
  });

  const [uploadState, setUploadState] = useState<BulkUploadState>(initialUploadState);

  const handleFileSelect = (type: string, file: File) => {
    setFiles(prev => ({
      ...prev,
      [type]: { file, error: null }
    }));
  };

  const handleFileRemove = (type: string) => {
    setFiles(prev => ({
      ...prev,
      [type]: initialFileState
    }));
  };

  const allFilesSelected = () => {
    return Object.values(files).every(fileState => fileState.file !== null);
  };

  const anyFileHasError = () => {
    return Object.values(files).some(fileState => fileState.error !== null);
  };

  const handleBulkUpload = async () => {
    if (!allFilesSelected()) {
      toast.error("Please select all required files before uploading");
      return;
    }

    setUploadState({ isUploading: true, progress: 0, error: null, success: false });

    try {
      // Simulate progress
      const progressInterval = setInterval(() => {
        setUploadState(prev => ({
          ...prev,
          progress: Math.min(prev.progress + 5, 90)
        }));
      }, 300);

      const uploadFiles = {
        lessons_file: files.lessons_file.file!,
        concepts_file: files.concepts_file.file!,
        examples_file: files.examples_file.file!,
        exercises_file: files.exercises_file.file!,
        general_exercises_file: files.general_exercises_file.file!,
        check_markers_file: files.check_markers_file.file!
      };

      const response = await uploadAllLessonFiles(uploadFiles);

      clearInterval(progressInterval);
      
      setUploadState({
        isUploading: false,
        progress: 100,
        success: response.success,
        error: response.success ? null : response.message
      });

      if (response.success) {
        toast.success(response.message || "All lesson files uploaded successfully!");
      } else {
        toast.error(response.message || "Failed to upload lesson files");
      }
    } catch (error: any) {
      setUploadState({
        isUploading: false,
        progress: 0,
        error: error.response?.data?.message || error.message || 'Upload failed',
        success: false
      });
      toast.error(`Upload failed: ${error.response?.data?.message || error.message}`);
    }
  };

  const handleResetAll = () => {
    setFiles({
      lessons_file: { ...initialFileState },
      concepts_file: { ...initialFileState },
      examples_file: { ...initialFileState },
      exercises_file: { ...initialFileState },
      general_exercises_file: { ...initialFileState },
      check_markers_file: { ...initialFileState }
    });
    setUploadState(initialUploadState);
  };

  const fileConfigs = [
    {
      key: 'lessons_file',
      title: 'Lessons File',
      description: 'Main lesson structure and content',
      fileType: 'lessons' as keyof typeof CSV_COLUMNS
    },
    {
      key: 'concepts_file',
      title: 'Concepts File',
      description: 'Detailed concept descriptions',
      fileType: 'concepts' as keyof typeof CSV_COLUMNS
    },
    {
      key: 'examples_file',
      title: 'Examples File',
      description: 'Worked examples for concepts',
      fileType: 'examples' as keyof typeof CSV_COLUMNS
    },
    {
      key: 'exercises_file',
      title: 'Exercises File',
      description: 'Practice exercises for concepts',
      fileType: 'exercises' as keyof typeof CSV_COLUMNS
    },
    {
      key: 'general_exercises_file',
      title: 'General Exercises File',
      description: 'General exercises for lessons',
      fileType: 'general_exercises' as keyof typeof CSV_COLUMNS
    },
    {
      key: 'check_markers_file',
      title: 'Check Markers File',
      description: 'Assessment checkpoints and scoring',
      fileType: 'check_markers' as keyof typeof CSV_COLUMNS
    }
  ];

  return (
    <>
      <DashboardHeader
        heading="Bulk Upload Lesson Files"
        text="Upload all lesson components at once for efficient processing"
      />

      <div className="space-y-6">
        {/* Upload Status Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              Upload Progress
            </CardTitle>
            <CardDescription>
              {uploadState.success 
                ? "All files uploaded successfully!"
                : allFilesSelected() 
                ? "All files ready for upload"
                : `${Object.values(files).filter(f => f.file).length}/${fileConfigs.length} files selected`
              }
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {uploadState.isUploading && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Uploading all lesson files...</span>
                  <span>{uploadState.progress}%</span>
                </div>
                <Progress value={uploadState.progress} className="h-2" />
              </div>
            )}

            <div className="flex gap-3">
              <Button
                onClick={handleBulkUpload}
                disabled={!allFilesSelected() || anyFileHasError() || uploadState.isUploading || uploadState.success}
                className="flex-1"
                size="lg"
              >
                {uploadState.isUploading 
                  ? "Uploading All Files..." 
                  : uploadState.success 
                  ? "All Files Uploaded!"
                  : "Upload All Files"
                }
              </Button>

              {(uploadState.success || Object.values(files).some(f => f.file)) && (
                <Button
                  variant="outline"
                  onClick={handleResetAll}
                  disabled={uploadState.isUploading}
                >
                  Reset All
                </Button>
              )}
            </div>

            {/* Upload Status Messages */}
            {uploadState.error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{uploadState.error}</AlertDescription>
              </Alert>
            )}

            {uploadState.success && (
              <Alert>
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>
                  All lesson files have been uploaded successfully! You can now view and manage your lessons.
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        {/* File Upload Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {fileConfigs.map((config) => {
            const fileState = files[config.key];
            
            return (
              <FileUpload
                key={config.key}
                onFileSelect={(file) => handleFileSelect(config.key, file)}
                onFileRemove={() => handleFileRemove(config.key)}
                fileType={config.fileType}
                title={config.title}
                description={config.description}
                selectedFile={fileState.file}
                isUploading={uploadState.isUploading}
                error={fileState.error}
                success={uploadState.success}
              />
            );
          })}
        </div>

        {/* Upload Instructions */}
        <Card>
          <CardHeader>
            <CardTitle>Bulk Upload Requirements</CardTitle>
            <CardDescription>
              Important information for successful bulk uploads
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <h4 className="font-medium mb-2">File Requirements:</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• All 6 files must be selected</li>
                  <li>• Files must be in CSV or TXT format</li>
                  <li>• Use pipe (|) as column delimiter</li>
                  <li>• Maximum 10MB per file</li>
                  <li>• Ensure data consistency between files</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-2">Upload Process:</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Files are validated before upload</li>
                  <li>• All files are processed together</li>
                  <li>• Referential integrity is maintained</li>
                  <li>• Upload progress is tracked</li>
                  <li>• Detailed error messages if failed</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
