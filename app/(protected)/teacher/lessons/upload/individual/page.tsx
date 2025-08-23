"use client";

import { useState } from "react";
import { toast } from "sonner";
import { DashboardHeader } from "@/components/dashboard/header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import FileUpload from "@/components/lessons/file-upload";
import {
  uploadLessonsFile,
  uploadConceptsFile,
  uploadExamplesFile,
  uploadExercisesFile,
  uploadGeneralExercisesFile,
  uploadCheckMarkersFile,
  uploadSchemeOfWorkFile,
  CSV_COLUMNS
} from "@/lib/api/lesson-service";
// Note: metadata cannot be exported from client components

interface UploadState {
  file: File | null;
  isUploading: boolean;
  progress: number;
  error: string | null;
  success: boolean;
}

const initialUploadState: UploadState = {
  file: null,
  isUploading: false,
  progress: 0,
  error: null,
  success: false
};

export default function IndividualUploadPage() {
  const [uploads, setUploads] = useState<Record<string, UploadState>>({
    lessons: { ...initialUploadState },
    concepts: { ...initialUploadState },
    examples: { ...initialUploadState },
    exercises: { ...initialUploadState },
    general_exercises: { ...initialUploadState },
    check_markers: { ...initialUploadState },
    scheme_of_work: { ...initialUploadState }
  });

  const updateUploadState = (type: string, update: Partial<UploadState>) => {
    setUploads(prev => ({
      ...prev,
      [type]: { ...prev[type], ...update }
    }));
  };

  const handleFileSelect = (type: string, file: File) => {
    updateUploadState(type, { file, error: null, success: false });
  };

  const handleFileRemove = (type: string) => {
    updateUploadState(type, initialUploadState);
  };

  const handleUpload = async (type: string) => {
    const uploadState = uploads[type];
    if (!uploadState.file) return;

    updateUploadState(type, { isUploading: true, error: null, progress: 0 });

    try {
      let response;
      
      // Simulate progress for better UX
      const progressInterval = setInterval(() => {
        updateUploadState(type, { progress: Math.min(uploads[type].progress + 10, 90) });
      }, 200);

      switch (type) {
        case 'lessons':
          response = await uploadLessonsFile(uploadState.file);
          break;
        case 'concepts':
          response = await uploadConceptsFile(uploadState.file);
          break;
        case 'examples':
          response = await uploadExamplesFile(uploadState.file);
          break;
        case 'exercises':
          response = await uploadExercisesFile(uploadState.file);
          break;
        case 'general_exercises':
          response = await uploadGeneralExercisesFile(uploadState.file);
          break;
        case 'check_markers':
          response = await uploadCheckMarkersFile(uploadState.file);
          break;
        case 'scheme_of_work':
          response = await uploadSchemeOfWorkFile(uploadState.file);
          break;
        default:
          throw new Error('Invalid upload type');
      }

      clearInterval(progressInterval);
      updateUploadState(type, { 
        isUploading: false, 
        progress: 100, 
        success: response.success,
        error: response.success ? null : response.message 
      });

      if (response.success) {
        toast.success(response.message || `${type} uploaded successfully!`);
      } else {
        toast.error(response.message || `Failed to upload ${type}`);
      }
    } catch (error: any) {
      updateUploadState(type, { 
        isUploading: false, 
        progress: 0, 
        error: error.response?.data?.message || error.message || 'Upload failed' 
      });
      toast.error(`Failed to upload ${type}: ${error.response?.data?.message || error.message}`);
    }
  };

  const uploadConfigs = [
    {
      key: 'lessons',
      title: 'Lessons',
      description: 'Upload lesson structure with topics, objectives, and key concepts',
      fileType: 'lessons' as keyof typeof CSV_COLUMNS
    },
    {
      key: 'concepts',
      title: 'Concepts',
      description: 'Upload detailed concept descriptions for lessons',
      fileType: 'concepts' as keyof typeof CSV_COLUMNS
    },
    {
      key: 'examples',
      title: 'Examples',
      description: 'Upload worked examples for each concept',
      fileType: 'examples' as keyof typeof CSV_COLUMNS
    },
    {
      key: 'exercises',
      title: 'Exercises',
      description: 'Upload practice exercises for concepts',
      fileType: 'exercises' as keyof typeof CSV_COLUMNS
    },
    {
      key: 'general_exercises',
      title: 'General Exercises',
      description: 'Upload general exercises for entire lessons',
      fileType: 'general_exercises' as keyof typeof CSV_COLUMNS
    },
    {
      key: 'check_markers',
      title: 'Check Markers',
      description: 'Upload assessment checkpoints and scoring',
      fileType: 'check_markers' as keyof typeof CSV_COLUMNS
    },
    {
      key: 'scheme_of_work',
      title: 'Scheme of Work',
      description: 'Upload curriculum planning and breakdown',
      fileType: 'scheme_of_work' as keyof typeof CSV_COLUMNS
    }
  ];

  return (
    <>
      <DashboardHeader
        heading="Upload Individual Files"
        text="Upload lesson components separately for more control over the process"
      />

      <div className="space-y-6">
        <Tabs defaultValue="lessons" className="w-full">
          <TabsList className="grid w-full grid-cols-7">
            {uploadConfigs.map((config) => (
              <TabsTrigger 
                key={config.key} 
                value={config.key}
                className="text-xs"
              >
                {config.title}
              </TabsTrigger>
            ))}
          </TabsList>

          {uploadConfigs.map((config) => {
            const uploadState = uploads[config.key];
            
            return (
              <TabsContent key={config.key} value={config.key}>
                <div className="grid gap-6 md:grid-cols-2">
                  <FileUpload
                    onFileSelect={(file) => handleFileSelect(config.key, file)}
                    onFileRemove={() => handleFileRemove(config.key)}
                    fileType={config.fileType}
                    title={config.title}
                    description={config.description}
                    selectedFile={uploadState.file}
                    isUploading={uploadState.isUploading}
                    uploadProgress={uploadState.progress}
                    error={uploadState.error}
                    success={uploadState.success}
                  />

                  <Card>
                    <CardHeader>
                      <CardTitle>Upload Actions</CardTitle>
                      <CardDescription>
                        Ready to upload your {config.title.toLowerCase()} file?
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <Button
                        onClick={() => handleUpload(config.key)}
                        disabled={!uploadState.file || uploadState.isUploading || uploadState.success}
                        className="w-full"
                        size="lg"
                      >
                        {uploadState.isUploading 
                          ? `Uploading ${config.title}...` 
                          : uploadState.success 
                          ? `${config.title} Uploaded!`
                          : `Upload ${config.title}`
                        }
                      </Button>

                      {uploadState.success && (
                        <Button
                          variant="outline"
                          onClick={() => handleFileRemove(config.key)}
                          className="w-full"
                        >
                          Upload Another File
                        </Button>
                      )}

                      <div className="bg-muted/50 p-3 rounded-lg">
                        <h4 className="text-sm font-medium mb-2">Upload Tips:</h4>
                        <ul className="text-xs text-muted-foreground space-y-1">
                          <li>• Ensure your CSV follows the exact column structure</li>
                          <li>• Use pipe (|) as delimiter between columns</li>
                          <li>• JSON fields should be properly formatted</li>
                          <li>• File size should be under 10MB</li>
                        </ul>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            );
          })}
        </Tabs>
      </div>
    </>
  );
}
