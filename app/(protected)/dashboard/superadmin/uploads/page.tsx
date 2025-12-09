"use client";

import { useEffect } from "react";
import { 
  FileUp, 
  CheckCircle, 
  AlertCircle,
  Upload
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

import FileUpload from "@/components/lessons/file-upload";
import { 
  useSuperadminState, 
  UploadType 
} from "@/components/superadmin/use-superadmin-state";
import {
  uploadLessonsFileWithValidation,
  uploadConceptsFileWithValidation,
  uploadExamplesFileWithValidation,
  uploadExercisesFileWithValidation,
  uploadGeneralExercisesFileWithValidation,
  uploadCheckMarkersFileWithValidation,
  uploadSchemeOfWorkFileWithValidation,
  uploadAllLessonFiles,
  UploadResult,
  ApiResponse,
} from "@/lib/api/lesson-service";

const UPLOAD_CONFIG: {
  id: UploadType;
  title: string;
  description: string;
  uploadFn: (file: File) => Promise<UploadResult>;
}[] = [
  {
    id: "lessons",
    title: "Lessons",
    description: "Upload main lessons data (topics, overviews, objectives)",
    uploadFn: uploadLessonsFileWithValidation,
  },
  {
    id: "concepts",
    title: "Concepts",
    description: "Upload lesson concepts and explanations",
    uploadFn: uploadConceptsFileWithValidation,
  },
  {
    id: "examples",
    title: "Examples",
    description: "Upload worked examples for concepts",
    uploadFn: uploadExamplesFileWithValidation,
  },
  {
    id: "exercises",
    title: "Exercises",
    description: "Upload practice exercises for concepts",
    uploadFn: uploadExercisesFileWithValidation,
  },
  {
    id: "general_exercises",
    title: "General Exercises",
    description: "Upload lesson-level general exercises",
    uploadFn: uploadGeneralExercisesFileWithValidation,
  },
  {
    id: "check_markers",
    title: "Check Markers",
    description: "Upload progress check markers",
    uploadFn: uploadCheckMarkersFileWithValidation,
  },
  {
    id: "scheme_of_work",
    title: "Scheme of Work",
    description: "Upload curriculum scheme of work",
    uploadFn: uploadSchemeOfWorkFileWithValidation,
  },
];

export default function UploadsPage() {
  const {
     uploadStates,
     setUploadState,
     resetUploadState,
     bulkFiles,
     setBulkFile,
     isBulkUploading,
     bulkProgress,
     bulkError,
     bulkSuccess,
     setBulkStatus,
     resetBulkState
  } = useSuperadminState();

  // --- Individual Upload Handlers ---

  const handleFileSelect = (type: UploadType, file: File) => {
    setUploadState(type, {
      selectedFile: file,
      error: null,
      success: false,
    });
  };

  const handleFileRemove = (type: UploadType) => {
    resetUploadState(type);
  };

  const handleUpload = async (type: UploadType) => {
    const state = uploadStates[type];
    if (!state.selectedFile) return;

    setUploadState(type, { isUploading: true, uploadProgress: 0, error: null });

    // Simulate progress using functional update to avoid stale closure
    const progressInterval = setInterval(() => {
      setUploadState(type, (prev) => ({ 
        uploadProgress: prev.uploadProgress >= 90 ? 90 : prev.uploadProgress + 10 
      }));
    }, 200);

    try {
      const config = UPLOAD_CONFIG.find((c) => c.id === type);
      if (!config) throw new Error("Invalid upload type");

      const result = await config.uploadFn(state.selectedFile);

      clearInterval(progressInterval);

      if (result.success) {
        setUploadState(type, { isUploading: false, uploadProgress: 100, success: true });
        toast.success(`${config.title} uploaded successfully`);
      } else {
        throw new Error(result.error || "Upload failed");
      }
    } catch (error: any) {
      clearInterval(progressInterval);
      const errorMessage = error.message || "An unexpected error occurred";
      setUploadState(type, { isUploading: false, uploadProgress: 0, error: errorMessage });
      toast.error(`Failed to upload ${type}`, { description: errorMessage });
    }
  };

  // --- Bulk Upload Handlers ---

  const isBulkReady = Object.values(bulkFiles).every((f) => f !== null);

  const handleBulkUpload = async () => {
    if (!isBulkReady) {
      toast.error("Missing files", { description: "Please select all 6 required files." });
      return;
    }

    setBulkStatus({ isBulkUploading: true, bulkProgress: 0, bulkError: null, bulkSuccess: false });

    // Simulate progress
    const progressInterval = setInterval(() => {
       setBulkStatus((prev) => ({
         bulkProgress: prev.bulkProgress >= 90 ? 90 : prev.bulkProgress + 5
       }));
    }, 300);

    try {
      // Cast to the expected structure since we verified all are not null
      const files = bulkFiles as {
        lessons_file: File;
        concepts_file: File;
        examples_file: File;
        exercises_file: File;
        general_exercises_file: File;
        check_markers_file: File;
      };

      const result: ApiResponse = await uploadAllLessonFiles(files);

      clearInterval(progressInterval);

      if (result.success) {
        setBulkStatus({ isBulkUploading: false, bulkProgress: 100, bulkSuccess: true });
        toast.success("All files uploaded successfully", { 
          description: result.message || "The database has been updated." 
        });
      } else {
        throw new Error(result.message || "Bulk upload failed");
      }
    } catch (error: any) {
      clearInterval(progressInterval);
      const errorMessage = error.message || "An unexpected error occurred during bulk upload";
      setBulkStatus({ isBulkUploading: false, bulkProgress: 0, bulkError: errorMessage });
      toast.error("Bulk Upload Failed", { description: errorMessage });
    }
  };

  return (
    <div className="space-y-8 duration-500 animate-in slide-in-from-right-4">
      
      <div className="grid gap-6">
        <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold tracking-tight">Individual Uploads</h2>
            <p className="text-sm text-muted-foreground">Upload specific content files one by one</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {UPLOAD_CONFIG.map((config) => (
            <div key={config.id} className="space-y-4">
                <FileUpload
                fileType={config.id}
                title={config.title}
                description={config.description}
                onFileSelect={(file) => handleFileSelect(config.id, file)}
                onFileRemove={() => handleFileRemove(config.id)}
                selectedFile={uploadStates[config.id].selectedFile}
                isUploading={uploadStates[config.id].isUploading}
                uploadProgress={uploadStates[config.id].uploadProgress}
                error={uploadStates[config.id].error}
                success={uploadStates[config.id].success}
                />
                {uploadStates[config.id].selectedFile && !uploadStates[config.id].success && !uploadStates[config.id].isUploading && (
                    <Button 
                    className="w-full" 
                    onClick={() => handleUpload(config.id)}
                    >
                    <Upload className="mr-2 size-4" />
                    Upload {config.title}
                    </Button>
                )}
            </div>
            ))}
        </div>
      </div>

      <Separator className="my-8" />

      {/* Bulk Upload Section */}
      <div className="rounded-xl border bg-card text-card-foreground shadow-sm">
        <div className="flex flex-col space-y-1.5 p-6">
            <h3 className="text-2xl font-semibold leading-none tracking-tight">Bulk Upload (All-In-One)</h3>
            <p className="text-sm text-muted-foreground">Upload all lesson files at once. All 6 files are required.</p>
        </div>
        <div className="p-6 pt-0">
            {bulkError && (
                <Alert variant="destructive" className="mb-6">
                <AlertCircle className="size-4" />
                <AlertTitle>Upload Failed</AlertTitle>
                <AlertDescription>{bulkError}</AlertDescription>
                </Alert>
            )}
            
            {bulkSuccess && (
                <Alert className="mb-6 border-green-200 bg-green-50 text-green-800">
                <CheckCircle className="size-4" />
                <AlertTitle>Success!</AlertTitle>
                <AlertDescription>All files have been uploaded and processed successfully.</AlertDescription>
                </Alert>
            )}

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {[
                { id: 'lessons_file', label: 'Lessons File' },
                { id: 'concepts_file', label: 'Concepts File' },
                { id: 'examples_file', label: 'Examples File' },
                { id: 'exercises_file', label: 'Exercises File' },
                { id: 'general_exercises_file', label: 'General Exercises File' },
                { id: 'check_markers_file', label: 'Check Markers File' },
                ].map((fileInput) => (
                <div key={fileInput.id} className="grid w-full max-w-sm items-center gap-1.5">
                    <Label htmlFor={fileInput.id}>{fileInput.label}</Label>
                    <Input 
                    id={fileInput.id} 
                    type="file" 
                    accept=".csv,.txt"
                    disabled={isBulkUploading || bulkSuccess}
                    onChange={(e) => setBulkFile(fileInput.id as any, e.target.files?.[0] || null)}
                    />
                    <p className="text-xs text-muted-foreground">
                    {bulkFiles[fileInput.id as any]?.name || "No file selected"}
                    </p>
                </div>
                ))}
            </div>

            {isBulkUploading && (
                <div className="mt-6 space-y-2">
                <div className="flex justify-between text-sm">
                    <span>Processing bulk upload... {bulkProgress}%</span>
                </div>
                <Progress value={bulkProgress} className="h-2" />
                </div>
            )}

            <div className="mt-6 flex justify-end">
                <Button 
                onClick={handleBulkUpload} 
                disabled={!isBulkReady || isBulkUploading || bulkSuccess}
                size="lg"
                className="w-full md:w-auto"
                >
                {isBulkUploading ? (
                    <>Processing...</>
                ) : (
                    <>
                    <FileUp className="mr-2 size-4" />
                    Upload All Files
                    </>
                )}
                </Button>
            </div>
        </div>
      </div>
    </div>
  );
}
