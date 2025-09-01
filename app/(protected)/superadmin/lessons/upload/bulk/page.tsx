"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, FileStack, CheckCircle2, Clock, AlertCircle, Upload } from "lucide-react";
import { DashboardHeader } from "@/components/dashboard/header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { UPLOAD_CONFIGS, uploadAllLessonFiles } from "@/lib/api/lesson-upload";
import { uploadAllLessonFilesBulk, validateBulkUploadFiles, type BulkUploadFiles } from "@/lib/api/bulk-lesson-upload";
import { UploadLogs, UploadLog } from "@/components/upload/UploadLogs";
import { toast } from "sonner";
import { usePermissionCheck } from "@/hooks/useRBACGuard";
import { cn } from "@/lib/utils";

export default function BulkUploadPage() {
  const { hasPermission, userRole } = usePermissionCheck();
  const [isBulkUploading, setBulkUploading] = useState(false);
  const [bulkFiles, setBulkFiles] = useState<Record<string, File>>({});
  const [logs, setLogs] = useState<UploadLog[]>([]);

  // Check permissions
  const canManageLessons = hasPermission('manage_lessons');

  const addLog = (type: UploadLog['type'], message: string, configKey?: string, fileName?: string) => {
    setLogs(prev => [{
      type,
      message,
      timestamp: new Date(),
      configKey,
      fileName
    }, ...prev].slice(0, 50)); // Keep only last 50 logs
  };

  const clearLogs = () => {
    setLogs([]);
  };

  const handleBulkUpload = async () => {
    const requiredFiles = ['lessons_file', 'concepts_file', 'examples_file', 'exercises_file', 'general_exercises_file', 'check_markers_file'];
    
    // Check if all required files are selected
    const missingFiles = requiredFiles.filter(key => !bulkFiles[key]);
    if (missingFiles.length > 0) {
      const missingFileNames = missingFiles.map(key => key.replace('_file', '')).join(', ');
      toast.error(`Please select all required files. Missing: ${missingFileNames}`);
      addLog('error', `Missing required files: ${missingFileNames}`);
      return;
    }

    // Validate files before upload
    const files: BulkUploadFiles = {
      lessons_file: bulkFiles.lessons_file,
      concepts_file: bulkFiles.concepts_file,
      examples_file: bulkFiles.examples_file,
      exercises_file: bulkFiles.exercises_file,
      general_exercises_file: bulkFiles.general_exercises_file,
      check_markers_file: bulkFiles.check_markers_file,
    };

    const validation = validateBulkUploadFiles(files);
    if (!validation.valid) {
      const errorMessage = `File validation failed: ${validation.errors.join(', ')}`;
      toast.error(errorMessage);
      addLog('error', errorMessage);
      return;
    }

    setBulkUploading(true);
    addLog('info', 'Starting enhanced bulk upload of all lesson files...');
    addLog('info', 'Files validated successfully, proceeding with upload');

    try {
      // Use the enhanced bulk upload service
      const result = await uploadAllLessonFilesBulk(files);
      
      if (result.success) {
        toast.success(result.message);
        addLog('success', `✅ Bulk upload completed: ${result.message}`);
        
        // Log API response details
        if (result.apiResponse) {
          addLog('info', `API Response: ${JSON.stringify(result.apiResponse, null, 2)}`);
        }
        
        setBulkFiles({}); // Clear selected files
      } else {
        toast.error(result.error || result.message);
        addLog('error', `❌ Bulk upload failed: ${result.error || result.message}`);
        
        // Log validation errors if available
        if (result.validationErrors) {
          Object.entries(result.validationErrors).forEach(([field, errors]) => {
            addLog('error', `Validation error in ${field}: ${errors.join(', ')}`);
          });
        }
        
        // Log API response for debugging
        if (result.apiResponse) {
          addLog('error', `API Error Response: ${JSON.stringify(result.apiResponse, null, 2)}`);
        }
      }
    } catch (error: any) {
      const errorMessage = error.message || 'Bulk upload failed';
      toast.error(errorMessage);
      addLog('error', `❌ Bulk upload error: ${errorMessage}`);
      addLog('error', `Error details: ${JSON.stringify(error, Object.getOwnPropertyNames(error), 2)}`);
    } finally {
      setBulkUploading(false);
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const bulkConfigs = UPLOAD_CONFIGS.filter(c => c.key !== 'scheme_of_work');

  if (!canManageLessons) {
    return (
      <div className="space-y-6">
        <div className="mb-6">
          <Link href="/superadmin">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
        </div>

        <DashboardHeader
          heading="Bulk Upload Lesson Files"
          text="Upload all lesson files at once"
        />

        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <strong>Access Restricted:</strong> Only Teachers, Admins, and SuperAdmins can upload lesson content. 
            Your current role ({userRole}) does not have permission to manage lessons.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <Link href="/superadmin/lessons/upload">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Upload Options
          </Button>
        </Link>
      </div>

      <DashboardHeader
        heading="Bulk Upload Lesson Files"
        text="Upload all lesson files at once for faster processing"
      />

      <Alert>
        <FileStack className="h-4 w-4" />
        <AlertDescription>
          <strong>Bulk Upload:</strong> Select all 6 required files and upload them together. 
          This is faster but requires all files to be ready and properly formatted.
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <CardTitle>Select All Files</CardTitle>
          <CardDescription>
            Choose all required lesson files for bulk upload
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {bulkConfigs.map((config) => (
              <Card key={config.key} className="p-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <div className={cn(
                      "p-2 rounded-lg",
                      bulkFiles[`${config.key}_file`] 
                        ? "bg-green-100 dark:bg-green-900" 
                        : "bg-gray-100 dark:bg-gray-800"
                    )}>
                      <FileStack className={cn(
                        "h-4 w-4",
                        bulkFiles[`${config.key}_file`] 
                          ? "text-green-600 dark:text-green-400" 
                          : "text-gray-500"
                      )} />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-sm">{config.title}</p>
                      <p className="text-xs text-muted-foreground">{config.description}</p>
                    </div>
                    {bulkFiles[`${config.key}_file`] && (
                      <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
                    )}
                  </div>

                  <div className="space-y-2">
                    <input
                      type="file"
                      accept=".csv"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setBulkFiles(prev => ({ 
                            ...prev, 
                            [`${config.key}_file`]: file 
                          }));
                          addLog('info', `Selected ${config.title} file: ${file.name}`, config.key, file.name);
                        }
                      }}
                      className="block w-full text-xs file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-medium file:bg-primary file:text-primary-foreground hover:file:bg-primary/90 file:cursor-pointer"
                    />
                    
                    {bulkFiles[`${config.key}_file`] && (
                      <div className="text-xs text-muted-foreground">
                        <p className="truncate">{bulkFiles[`${config.key}_file`].name}</p>
                        <p>{formatFileSize(bulkFiles[`${config.key}_file`].size)}</p>
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>

          <div className="pt-4 border-t">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Badge variant="outline">
                  Files Selected: {Object.keys(bulkFiles).length}/6
                </Badge>
                <Badge variant={Object.keys(bulkFiles).length === 6 ? "default" : "secondary"}>
                  {Object.keys(bulkFiles).length === 6 ? "Ready to Upload" : "Incomplete"}
                </Badge>
              </div>
            </div>

            <Button
              onClick={handleBulkUpload}
              disabled={isBulkUploading || Object.keys(bulkFiles).length < 6}
              className="w-full"
              size="lg"
            >
              {isBulkUploading ? (
                <>
                  <Clock className="h-4 w-4 mr-2 animate-spin" />
                  Uploading All Files...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4 mr-2" />
                  Upload All Files ({Object.keys(bulkFiles).length}/6)
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Upload Logs */}
      <UploadLogs logs={logs} onClearLogs={clearLogs} />
    </div>
  );
}
