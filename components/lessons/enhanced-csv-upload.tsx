"use client";

import { useState, useRef } from "react";
import Papa from "papaparse";
import { Upload, FileText, X, Check, AlertCircle, Eye, EyeOff, FileStack, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { 
  uploadLessonsFileWithValidation,
  uploadConceptsFileWithValidation,
  uploadExamplesFileWithValidation,
  uploadExercisesFileWithValidation,
  uploadGeneralExercisesFileWithValidation,
  uploadCheckMarkersFileWithValidation,
  uploadSchemeOfWorkFileWithValidation,
  uploadAllLessonFiles,
  CSV_COLUMNS,
  type UploadResult
} from "@/lib/api/lesson-service";
import { toast } from "sonner";

interface FileState {
  file: File | null;
  isUploading: boolean;
  progress: number;
  error: string | null;
  success: boolean;
  parsedData?: any[];
}

interface ParsedLesson {
  class: string;
  subject: string;
  term: string;
  week: number;
  topic: string;
  overview: string;
  objectives: any;
  key_concepts: any;
  summary: string;
  application: string;
  _errors?: string[];
}

interface EnhancedCSVUploadProps {
  onUploadSuccess?: (data: any) => void;
  onUploadError?: (error: string) => void;
}

const initialFileState: FileState = {
  file: null,
  isUploading: false,
  progress: 0,
  error: null,
  success: false
};

export default function EnhancedCSVUpload({
  onUploadSuccess,
  onUploadError
}: EnhancedCSVUploadProps) {
  const [activeTab, setActiveTab] = useState("lessons");
  const [files, setFiles] = useState<Record<string, FileState>>({
    lessons: { ...initialFileState },
    concepts: { ...initialFileState },
    examples: { ...initialFileState },
    exercises: { ...initialFileState },
    general_exercises: { ...initialFileState },
    check_markers: { ...initialFileState },
    scheme_of_work: { ...initialFileState }
  });
  const [showPreview, setShowPreview] = useState<Record<string, boolean>>({});
  const [expandedRows, setExpandedRows] = useState<Record<string, Set<number>>>({});
  const [bulkUploadState, setBulkUploadState] = useState<{
    isUploading: boolean;
    progress: number;
    error: string | null;
    success: boolean;
  }>({
    isUploading: false,
    progress: 0,
    error: null,
    success: false
  });
  
  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  const fileConfigs = [
    {
      key: 'lessons',
      title: 'Lessons',
      description: 'Main lesson structure with topics, objectives, and key concepts',
      fileType: 'lessons' as keyof typeof CSV_COLUMNS,
      requiredColumns: CSV_COLUMNS.lessons,
      uploadFunction: uploadLessonsFileWithValidation,
      template: 'lesson-structure.csv'
    },
    {
      key: 'concepts',
      title: 'Concepts',
      description: 'Detailed concept descriptions for lessons',
      fileType: 'concepts' as keyof typeof CSV_COLUMNS,
      requiredColumns: CSV_COLUMNS.concepts,
      uploadFunction: uploadConceptsFileWithValidation,
      template: 'concept-structure.csv'
    },
    {
      key: 'examples',
      title: 'Examples',
      description: 'Worked examples for each concept',
      fileType: 'examples' as keyof typeof CSV_COLUMNS,
      requiredColumns: CSV_COLUMNS.examples,
      uploadFunction: uploadExamplesFileWithValidation,
      template: 'examples-structure.csv'
    },
    {
      key: 'exercises',
      title: 'Exercises',
      description: 'Practice exercises for concepts',
      fileType: 'exercises' as keyof typeof CSV_COLUMNS,
      requiredColumns: CSV_COLUMNS.exercises,
      uploadFunction: uploadExercisesFileWithValidation,
      template: 'exercises-structure.csv'
    },
    {
      key: 'general_exercises',
      title: 'General Exercises',
      description: 'General exercises for entire lessons',
      fileType: 'general_exercises' as keyof typeof CSV_COLUMNS,
      requiredColumns: CSV_COLUMNS.general_exercises,
      uploadFunction: uploadGeneralExercisesFileWithValidation,
      template: 'general-exercises-structure.csv'
    },
    {
      key: 'check_markers',
      title: 'Check Markers',
      description: 'Assessment checkpoints and scoring',
      fileType: 'check_markers' as keyof typeof CSV_COLUMNS,
      requiredColumns: CSV_COLUMNS.check_markers,
      uploadFunction: uploadCheckMarkersFileWithValidation,
      template: 'check-markers-structure.csv'
    },
    {
      key: 'scheme_of_work',
      title: 'Scheme of Work',
      description: 'Curriculum planning and breakdown',
      fileType: 'scheme_of_work' as keyof typeof CSV_COLUMNS,
      requiredColumns: CSV_COLUMNS.scheme_of_work,
      uploadFunction: uploadSchemeOfWorkFileWithValidation,
      template: 'scheme-civic-education.csv'
    }
  ];

  const downloadTemplate = (filename: string) => {
    const link = document.createElement('a');
    link.href = `/lesson-csv-files/${filename}`;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const updateFileState = (type: string, update: Partial<FileState>) => {
    setFiles(prev => ({
      ...prev,
      [type]: { ...prev[type], ...update }
    }));
  };

  const parseCSVFile = (file: File, type: string) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      transformHeader: (header: string) => header.trim().toLowerCase(),
      complete: (results) => {
        console.log(`Papa Parse results for ${type}:`, results);
        
        const parsedData: any[] = [];
        const config = fileConfigs.find(c => c.key === type);
        
        if (config) {
          results.data.forEach((row: any, index: number) => {
            const rowErrors: string[] = [];
            const processedRow: any = { ...row };

            // Special handling for lessons with JSON fields
            if (type === 'lessons') {
              if (processedRow.objectives) {
                try {
                  processedRow.objectives = JSON.parse(processedRow.objectives);
                } catch (e) {
                  rowErrors.push(`Invalid JSON in objectives field`);
                }
              }

              if (processedRow.key_concepts) {
                try {
                  processedRow.key_concepts = JSON.parse(processedRow.key_concepts);
                } catch (e) {
                  rowErrors.push(`Invalid JSON in key_concepts field`);
                }
              }

              processedRow.week = parseInt(processedRow.week) || 0;
            }

            // Validate required fields
            config.requiredColumns.forEach(col => {
              if (!row[col] || (typeof row[col] === 'string' && row[col].trim() === '')) {
                rowErrors.push(`Missing ${col}`);
              }
            });

            if (rowErrors.length > 0) {
              processedRow._errors = rowErrors;
            }

            parsedData.push(processedRow);
          });
        }

        updateFileState(type, { parsedData });
        setShowPreview(prev => ({ ...prev, [type]: true }));

        if (parsedData.length > 0) {
          toast.success(`Successfully parsed ${parsedData.length} rows from ${config?.title}`);
        }
      },
      error: (error) => {
        console.error("Papa Parse error:", error);
        updateFileState(type, { error: `Failed to parse CSV: ${error.message}` });
        toast.error("Failed to parse CSV file");
      }
    });
  };

  const handleFileSelect = (type: string, file: File) => {
    updateFileState(type, { 
      file, 
      error: null, 
      success: false,
      parsedData: undefined 
    });
    
    // Parse CSV immediately when file is selected
    parseCSVFile(file, type);
  };

  const handleFileRemove = (type: string) => {
    updateFileState(type, initialFileState);
    setShowPreview(prev => ({ ...prev, [type]: false }));
    if (fileInputRefs.current[type]) {
      fileInputRefs.current[type]!.value = '';
    }
  };

  const handleUpload = async (type: string) => {
    const fileState = files[type];
    const config = fileConfigs.find(c => c.key === type);
    
    if (!fileState.file || !config) return;

    // Check for validation errors
    const hasErrors = fileState.parsedData?.some((row: any) => row._errors && row._errors.length > 0);
    if (hasErrors) {
      toast.error("Please fix validation errors before uploading");
      return;
    }

    updateFileState(type, { isUploading: true, error: null, progress: 0 });

    try {
      // Simulate progress for better UX
      const progressInterval = setInterval(() => {
        updateFileState(type, { progress: Math.min(files[type].progress + 10, 90) });
      }, 200);

      const result: UploadResult = await config.uploadFunction(fileState.file);

      clearInterval(progressInterval);
      updateFileState(type, { 
        isUploading: false, 
        progress: 100, 
        success: result.success,
        error: result.success ? null : result.error || 'Upload failed'
      });

      if (result.success) {
        toast.success(`${config.title} uploaded successfully!`);
        onUploadSuccess?.(result.apiResponse);
      } else {
        const errorMessage = result.error || `Failed to upload ${config.title}`;
        toast.error(errorMessage);
        onUploadError?.(errorMessage);
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Upload failed';
      updateFileState(type, { 
        isUploading: false, 
        progress: 0, 
        error: errorMessage
      });
      toast.error(`Failed to upload ${config.title}: ${errorMessage}`);
      onUploadError?.(errorMessage);
    }
  };

  const handleBulkUpload = async () => {
    const requiredFiles = ['lessons_file', 'concepts_file', 'examples_file', 'exercises_file', 'general_exercises_file', 'check_marker_file'];
    const fileMapping = {
      lessons_file: files.lessons.file,
      concepts_file: files.concepts.file,
      examples_file: files.examples.file,
      exercises_file: files.exercises.file,
      general_exercises_file: files.general_exercises.file,
      check_marker_file: files.check_markers.file
    };

    const missingFiles = requiredFiles.filter(key => !fileMapping[key as keyof typeof fileMapping]);
    
    if (missingFiles.length > 0) {
      toast.error(`Missing required files for bulk upload`);
      return;
    }

    setBulkUploadState({ isUploading: true, progress: 0, error: null, success: false });

    try {
      // Simulate progress
      const progressInterval = setInterval(() => {
        setBulkUploadState(prev => ({
          ...prev,
          progress: Math.min(prev.progress + 5, 90)
        }));
      }, 300);

      const uploadFiles = {
        lessons_file: files.lessons.file!,
        concepts_file: files.concepts.file!,
        examples_file: files.examples.file!,
        exercises_file: files.exercises.file!,
        general_exercises_file: files.general_exercises.file!,
        check_marker_file: files.check_markers.file!
      };

      const response = await uploadAllLessonFiles(uploadFiles);

      clearInterval(progressInterval);
      setBulkUploadState({
        isUploading: false,
        progress: 100,
        success: response.success,
        error: response.success ? null : response.message
      });

      if (response.success) {
        toast.success("All lesson files uploaded successfully!");
        onUploadSuccess?.(response);
        
        // Reset all files
        setFiles(prev => Object.keys(prev).reduce((acc, key) => ({
          ...acc,
          [key]: { ...initialFileState }
        }), {} as Record<string, FileState>));
        
        // Clear file inputs
        Object.values(fileInputRefs.current).forEach(ref => {
          if (ref) ref.value = '';
        });
      } else {
        toast.error(response.message || "Failed to upload lesson files");
        onUploadError?.(response.message || "Bulk upload failed");
      }
    } catch (error: any) {
      setBulkUploadState({
        isUploading: false,
        progress: 0,
        error: error.response?.data?.message || error.message || 'Bulk upload failed',
        success: false
      });
      toast.error(`Bulk upload failed: ${error.response?.data?.message || error.message}`);
      onUploadError?.(error.response?.data?.message || error.message || "Bulk upload failed");
    }
  };

  const toggleRowExpanded = (type: string, index: number) => {
    setExpandedRows(prev => ({
      ...prev,
      [type]: prev[type] ? (
        prev[type].has(index) 
          ? new Set(Array.from(prev[type]).filter(i => i !== index))
          : new Set([...Array.from(prev[type]), index])
      ) : new Set([index])
    }));
  };

  const allRequiredFilesSelected = () => {
    return ['lessons', 'concepts', 'examples', 'exercises', 'general_exercises', 'check_markers']
      .every(key => files[key].file !== null);
  };

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4 lg:grid-cols-8">
          {fileConfigs.map((config) => (
            <TabsTrigger 
              key={config.key} 
              value={config.key}
              className="text-xs relative"
            >
              {config.title}
              {files[config.key].success && (
                <Check className="size-3 text-green-600 absolute -top-1 -right-1" />
              )}
              {files[config.key].file && !files[config.key].success && (
                <AlertCircle className="size-3 text-yellow-600 absolute -top-1 -right-1" />
              )}
            </TabsTrigger>
          ))}
        </TabsList>

        {fileConfigs.map((config) => {
          const fileState = files[config.key];
          const validRows = fileState.parsedData?.filter((row: any) => !row._errors || row._errors.length === 0) || [];
          const invalidRows = fileState.parsedData?.filter((row: any) => row._errors && row._errors.length > 0) || [];
          
          return (
            <TabsContent key={config.key} value={config.key}>
              <div className="space-y-6">
                {/* File Upload Card */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="size-5" />
                      Upload {config.title}
                    </CardTitle>
                    <CardDescription>
                      {config.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* File Selection */}
                    {!fileState.file && (
                      <div
                        className="border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer border-muted-foreground/25 hover:border-muted-foreground/50"
                        onClick={() => fileInputRefs.current[config.key]?.click()}
                      >
                        <Upload className="size-10 mx-auto mb-4 text-muted-foreground" />
                        <p className="text-lg font-medium mb-2">Drop your CSV file here, or click to browse</p>
                        <p className="text-sm text-muted-foreground mb-4">
                          Supports: .csv files (max 10MB)
                        </p>
                        <Button>Select {config.title} File</Button>
                      </div>
                    )}

                    {/* Hidden file input */}
                    <input
                      ref={(el) => { fileInputRefs.current[config.key] = el; }}
                      type="file"
                      accept=".csv"
                      onChange={(e) => e.target.files?.[0] && handleFileSelect(config.key, e.target.files[0])}
                      className="hidden"
                    />

                    {/* Selected File Info */}
                    {fileState.file && (
                      <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                        <div className="flex items-center gap-3">
                          <FileText className="size-8 text-primary" />
                          <div>
                            <p className="font-medium">{fileState.file.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {(fileState.file.size / 1024 / 1024).toFixed(2)} MB
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant={fileState.error ? "destructive" : fileState.success ? "default" : "secondary"}>
                            {fileState.error ? "Has Errors" : fileState.success ? "Uploaded" : `${fileState.parsedData?.length || 0} Rows`}
                          </Badge>
                          <Button variant="ghost" size="sm" onClick={() => handleFileRemove(config.key)}>
                            <X className="size-4" />
                          </Button>
                        </div>
                      </div>
                    )}

                    {/* Upload Progress */}
                    {fileState.isUploading && (
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Uploading...</span>
                          <span>{fileState.progress}%</span>
                        </div>
                        <Progress value={fileState.progress} className="h-2" />
                      </div>
                    )}

                    {/* Error Messages */}
                    {fileState.error && (
                      <Alert variant="destructive">
                        <AlertCircle className="size-4" />
                        <AlertDescription>{fileState.error}</AlertDescription>
                      </Alert>
                    )}

                    {/* Success Message */}
                    {fileState.success && !fileState.error && (
                      <Alert>
                        <Check className="size-4" />
                        <AlertDescription>
                          {config.title} uploaded successfully!
                        </AlertDescription>
                      </Alert>
                    )}

                    {/* Upload Actions */}
                    {fileState.parsedData && fileState.parsedData.length > 0 && (
                      <div className="flex gap-3">
                        <Button
                          onClick={() => handleUpload(config.key)}
                          disabled={fileState.isUploading || invalidRows.length > 0 || fileState.success}
                          className="flex-1"
                        >
                          {fileState.isUploading ? "Uploading..." : fileState.success ? "Uploaded!" : `Upload ${validRows.length} Rows`}
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => setShowPreview(prev => ({ ...prev, [config.key]: !prev[config.key] }))}
                        >
                          {showPreview[config.key] ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                          {showPreview[config.key] ? "Hide" : "Preview"}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => downloadTemplate(config.template)}
                          title={`Download ${config.title} template`}
                        >
                          <Download className="size-4" />
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Data Preview */}
                {showPreview[config.key] && fileState.parsedData && fileState.parsedData.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Data Preview - {config.title}</CardTitle>
                      <CardDescription>
                        {validRows.length > 0 && `${validRows.length} valid rows`}
                        {invalidRows.length > 0 && `, ${invalidRows.length} rows with errors`}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ScrollArea className="h-[400px] w-full">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead className="w-12">#</TableHead>
                              {config.requiredColumns.slice(0, 4).map(col => (
                                <TableHead key={col} className="capitalize">{col.replace('_', ' ')}</TableHead>
                              ))}
                              <TableHead>Status</TableHead>
                              <TableHead className="w-20">Details</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {fileState.parsedData.map((row: any, index: number) => (
                              <>
                                <TableRow key={index} className={row._errors ? "bg-destructive/10" : ""}>
                                  <TableCell>{index + 1}</TableCell>
                                  {config.requiredColumns.slice(0, 4).map(col => (
                                    <TableCell key={col} className="max-w-[150px] truncate">
                                      {typeof row[col] === 'object' ? JSON.stringify(row[col]).substring(0, 50) + '...' : String(row[col] || '')}
                                    </TableCell>
                                  ))}
                                  <TableCell>
                                    <Badge variant={row._errors ? "destructive" : "default"}>
                                      {row._errors ? (
                                        <>
                                          <AlertCircle className="size-3 mr-1" />
                                          {row._errors.length} Error{row._errors.length > 1 ? 's' : ''}
                                        </>
                                      ) : (
                                        <>
                                          <Check className="size-3 mr-1" />
                                          Valid
                                        </>
                                      )}
                                    </Badge>
                                  </TableCell>
                                  <TableCell>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => toggleRowExpanded(config.key, index)}
                                    >
                                      {expandedRows[config.key]?.has(index) ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                                    </Button>
                                  </TableCell>
                                </TableRow>
                                
                                {/* Expanded Row Details */}
                                {expandedRows[config.key]?.has(index) && (
                                  <TableRow>
                                    <TableCell colSpan={7} className="bg-muted/50">
                                      <div className="space-y-4 p-4">
                                        {/* Errors */}
                                        {row._errors && (
                                          <Alert variant="destructive">
                                            <AlertCircle className="size-4" />
                                            <AlertDescription>
                                              <strong>Validation Errors:</strong>
                                              <ul className="mt-1 list-disc list-inside">
                                                {row._errors.map((error: string, errorIndex: number) => (
                                                  <li key={errorIndex} className="text-sm">{error}</li>
                                                ))}
                                              </ul>
                                            </AlertDescription>
                                          </Alert>
                                        )}
                                        
                                        {/* Row Details */}
                                        <div className="grid gap-2">
                                          {config.requiredColumns.map(col => (
                                            <div key={col} className="flex gap-2">
                                              <strong className="min-w-[120px] capitalize">{col.replace('_', ' ')}:</strong>
                                              <span className="text-sm">
                                                {typeof row[col] === 'object' 
                                                  ? JSON.stringify(row[col], null, 2) 
                                                  : String(row[col] || 'N/A')
                                                }
                                              </span>
                                            </div>
                                          ))}
                                        </div>
                                      </div>
                                    </TableCell>
                                  </TableRow>
                                )}
                              </>
                            ))}
                          </TableBody>
                        </Table>
                      </ScrollArea>
                    </CardContent>
                  </Card>
                )}

                {/* Required Format Info */}
                <Card>
                  <CardHeader>
                    <CardTitle>Required Format - {config.title}</CardTitle>
                    <CardDescription>
                      Your CSV file must include these columns in the correct order
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium mb-2">Required Columns:</h4>
                        <div className="flex flex-wrap gap-1">
                          {config.requiredColumns.map((column) => (
                            <Badge key={column} variant="outline" className="text-xs">
                              {column}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      
                      {/* <div className="flex gap-2">
                        <Button
                          variant="outline"
                          onClick={() => downloadTemplate(config.template)}
                          className="flex items-center gap-2"
                        >
                          <Download className="size-4" />
                          Download Template
                        </Button>
                      </div> */}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          );
        })}

        {/* Bulk Upload Tab */}
        <TabsContent value="bulk">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileStack className="size-5" />
                Bulk Upload All Files
              </CardTitle>
              <CardDescription>
                Upload all lesson components at once for efficient processing
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Bulk Upload Status */}
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <h4 className="font-medium mb-2">File Status:</h4>
                  <div className="space-y-2">
                    {['lessons', 'concepts', 'examples', 'exercises', 'general_exercises', 'check_markers'].map(key => {
                      const config = fileConfigs.find(c => c.key === key);
                      const fileState = files[key];
                      return (
                        <div key={key} className="flex items-center justify-between p-2 border rounded">
                          <span className="text-sm">{config?.title}</span>
                          <Badge variant={fileState.file ? (fileState.success ? "default" : "secondary") : "outline"}>
                            {fileState.success ? "✅ Uploaded" : fileState.file ? "📁 Selected" : "❌ Missing"}
                          </Badge>
                        </div>
                      );
                    })}
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">Upload Progress:</h4>
                  {bulkUploadState.isUploading && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Uploading all files...</span>
                        <span>{bulkUploadState.progress}%</span>
                      </div>
                      <Progress value={bulkUploadState.progress} className="h-2" />
                    </div>
                  )}
                  
                  {bulkUploadState.error && (
                    <Alert variant="destructive">
                      <AlertCircle className="size-4" />
                      <AlertDescription>{bulkUploadState.error}</AlertDescription>
                    </Alert>
                  )}
                  
                  {bulkUploadState.success && (
                    <Alert>
                      <Check className="size-4" />
                      <AlertDescription>
                        All files uploaded successfully!
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
              </div>

              {/* Bulk Upload Button */}
              <div className="flex gap-3">
                <Button
                  onClick={handleBulkUpload}
                  disabled={!allRequiredFilesSelected() || bulkUploadState.isUploading || bulkUploadState.success}
                  className="flex-1"
                  size="lg"
                >
                  {bulkUploadState.isUploading 
                    ? "Uploading All Files..." 
                    : bulkUploadState.success 
                    ? "All Files Uploaded!"
                    : "Upload All Files"
                  }
                </Button>
                
                {bulkUploadState.success && (
                  <Button
                    variant="outline"
                    onClick={() => {
                      setBulkUploadState({ isUploading: false, progress: 0, error: null, success: false });
                      setFiles(prev => Object.keys(prev).reduce((acc, key) => ({
                        ...acc,
                        [key]: { ...initialFileState }
                      }), {} as Record<string, FileState>));
                    }}
                  >
                    Reset All
                  </Button>
                )}
              </div>

              {/* Bulk Upload Instructions */}
              <Alert>
                <AlertCircle className="size-4" />
                <AlertDescription>
                  <strong>Bulk Upload Requirements:</strong>
                  <ul className="mt-2 list-disc list-inside text-sm">
                    <li>All 6 required files must be selected</li>
                    <li>Data must be consistent across files</li>
                    <li>All files will be processed together</li>
                    <li>Cannot upload partial sets</li>
                  </ul>
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsList className="mt-6">
          <TabsTrigger value="bulk" className="flex items-center gap-2">
            <FileStack className="size-4" />
            Bulk Upload
          </TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
}
