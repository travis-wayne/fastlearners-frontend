"use client";

import { useState, useRef } from "react";
import Papa from "papaparse";
import { Upload, FileText, X, Check, AlertCircle, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { uploadLessonsFileWithValidation } from "@/lib/api/lesson-service";
import { toast } from "sonner";

interface ParsedLesson {
  class: string;
  subject: string;
  term: string;
  week: number;
  topic: string;
  overview: string;
  objectives: any; // Will be parsed JSON
  key_concepts: any; // Will be parsed JSON  
  summary: string;
  application: string;
  _errors?: string[]; // Validation errors for this row
}

interface CSVUploadWithPreviewProps {
  onUploadSuccess?: (lessons: ParsedLesson[]) => void;
  onUploadError?: (error: string) => void;
}

export default function CSVUploadWithPreview({
  onUploadSuccess,
  onUploadError
}: CSVUploadWithPreviewProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [parsedData, setParsedData] = useState<ParsedLesson[]>([]);
  const [parseErrors, setParseErrors] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set());
  const fileInputRef = useRef<HTMLInputElement>(null);

  const requiredColumns = [
    'class', 'subject', 'term', 'week', 'topic', 'overview', 
    'objectives', 'key_concepts', 'summary', 'application'
  ];

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
    setParseErrors([]);
    setParsedData([]);
    setShowPreview(false);
    
    // Parse CSV immediately when file is selected
    parseCSVFile(file);
  };

  const parseCSVFile = (file: File) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      transformHeader: (header: string) => header.trim().toLowerCase(),
      complete: (results) => {
        console.log("Papa Parse results:", results);
        
        const errors: string[] = [];
        const lessons: ParsedLesson[] = [];

        // Check for parsing errors
        if (results.errors && results.errors.length > 0) {
          results.errors.forEach(error => {
            errors.push(`Row ${error.row}: ${error.message}`);
          });
        }

        // Validate headers
        const headers = results.meta.fields || [];
        const missingColumns = requiredColumns.filter(col => !headers.includes(col));
        if (missingColumns.length > 0) {
          errors.push(`Missing required columns: ${missingColumns.join(', ')}`);
        }

        // Process each row
        results.data.forEach((row: any, index: number) => {
          const rowErrors: string[] = [];
          const lesson: ParsedLesson = {
            class: row.class || '',
            subject: row.subject || '',
            term: row.term || '',
            week: parseInt(row.week) || 0,
            topic: row.topic || '',
            overview: row.overview || '',
            objectives: row.objectives || '',
            key_concepts: row.key_concepts || '',
            summary: row.summary || '',
            application: row.application || ''
          };

          // Validate and parse JSON fields
          if (lesson.objectives) {
            try {
              lesson.objectives = JSON.parse(lesson.objectives);
            } catch (e) {
              rowErrors.push(`Invalid JSON in objectives field`);
            }
          }

          if (lesson.key_concepts) {
            try {
              lesson.key_concepts = JSON.parse(lesson.key_concepts);
            } catch (e) {
              rowErrors.push(`Invalid JSON in key_concepts field`);
            }
          }

          // Validate required fields
          requiredColumns.forEach(col => {
            if (!row[col] || (typeof row[col] === 'string' && row[col].trim() === '')) {
              rowErrors.push(`Missing ${col}`);
            }
          });

          if (rowErrors.length > 0) {
            lesson._errors = rowErrors;
          }

          lessons.push(lesson);
        });

        setParseErrors(errors);
        setParsedData(lessons);
        setShowPreview(true);

        if (errors.length === 0) {
          toast.success(`Successfully parsed ${lessons.length} lessons from CSV`);
        } else {
          toast.warning(`Parsed CSV with ${errors.length} errors`);
        }
      },
      error: (error) => {
        console.error("Papa Parse error:", error);
        setParseErrors([`Failed to parse CSV: ${error.message}`]);
        toast.error("Failed to parse CSV file");
      }
    });
  };

  const handleUpload = async () => {
    if (!selectedFile || parsedData.length === 0) {
      toast.error("No valid data to upload");
      return;
    }

    // Check for any validation errors
    const hasErrors = parsedData.some(lesson => lesson._errors && lesson._errors.length > 0);
    if (hasErrors) {
      toast.error("Please fix validation errors before uploading");
      return;
    }

    setIsUploading(true);
    
    try {
      const result = await uploadLessonsFileWithValidation(selectedFile);
      
      if (result.success) {
        toast.success("Lessons uploaded successfully!");
        onUploadSuccess?.(parsedData);
        
        // Reset form
        setSelectedFile(null);
        setParsedData([]);
        setShowPreview(false);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      } else {
        const errorMessage = result.error || "Upload failed";
        toast.error(errorMessage);
        onUploadError?.(errorMessage);
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || "Upload failed";
      toast.error(errorMessage);
      onUploadError?.(errorMessage);
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setParsedData([]);
    setParseErrors([]);
    setShowPreview(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const toggleRowExpanded = (index: number) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedRows(newExpanded);
  };

  const validLessons = parsedData.filter(lesson => !lesson._errors || lesson._errors.length === 0);
  const invalidLessons = parsedData.filter(lesson => lesson._errors && lesson._errors.length > 0);

  return (
    <div className="space-y-6">
      {/* File Upload Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="size-5" />
            Upload Lessons CSV
          </CardTitle>
          <CardDescription>
            Upload a CSV file containing lesson data with proper JSON formatting
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* File Selection */}
          {!selectedFile && (
            <div
              className="border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer border-muted-foreground/25 hover:border-muted-foreground/50"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="size-10 mx-auto mb-4 text-muted-foreground" />
              <p className="text-lg font-medium mb-2">Drop your CSV file here, or click to browse</p>
              <p className="text-sm text-muted-foreground mb-4">
                Supports: .csv files (max 10MB)
              </p>
              <Button>Select CSV File</Button>
            </div>
          )}

          {/* Hidden file input */}
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv"
            onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
            className="hidden"
          />

          {/* Selected File Info */}
          {selectedFile && (
            <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <div className="flex items-center gap-3">
                <FileText className="size-8 text-primary" />
                <div>
                  <p className="font-medium">{selectedFile.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={parseErrors.length > 0 ? "destructive" : "secondary"}>
                  {parseErrors.length > 0 ? "Has Errors" : `${parsedData.length} Lessons`}
                </Badge>
                <Button variant="ghost" size="sm" onClick={handleRemoveFile}>
                  <X className="size-4" />
                </Button>
              </div>
            </div>
          )}

          {/* Parse Errors */}
          {parseErrors.length > 0 && (
            <Alert variant="destructive">
              <AlertCircle className="size-4" />
              <AlertDescription>
                <strong>CSV Parse Errors:</strong>
                <ul className="mt-2 list-disc list-inside">
                  {parseErrors.map((error, index) => (
                    <li key={index} className="text-sm">{error}</li>
                  ))}
                </ul>
              </AlertDescription>
            </Alert>
          )}

          {/* Upload Actions */}
          {parsedData.length > 0 && parseErrors.length === 0 && (
            <div className="flex gap-3">
              <Button
                onClick={handleUpload}
                disabled={isUploading || invalidLessons.length > 0}
                className="flex-1"
              >
                {isUploading ? "Uploading..." : `Upload ${validLessons.length} Lessons`}
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowPreview(!showPreview)}
              >
                {showPreview ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                {showPreview ? "Hide" : "Preview"}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Data Preview */}
      {showPreview && parsedData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Data Preview</CardTitle>
            <CardDescription>
              Review the parsed lesson data before uploading. 
              {validLessons.length > 0 && ` ${validLessons.length} valid lessons`}
              {invalidLessons.length > 0 && `, ${invalidLessons.length} lessons with errors`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[500px] w-full">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">#</TableHead>
                    <TableHead>Class</TableHead>
                    <TableHead>Subject</TableHead>
                    <TableHead>Term</TableHead>
                    <TableHead>Week</TableHead>
                    <TableHead>Topic</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="w-20">Details</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {parsedData.map((lesson, index) => (
                    <>
                      <TableRow key={index} className={lesson._errors ? "bg-destructive/10" : ""}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>{lesson.class}</TableCell>
                        <TableCell>{lesson.subject}</TableCell>
                        <TableCell>{lesson.term}</TableCell>
                        <TableCell>{lesson.week}</TableCell>
                        <TableCell className="max-w-[200px] truncate">{lesson.topic}</TableCell>
                        <TableCell>
                          <Badge variant={lesson._errors ? "destructive" : "default"}>
                            {lesson._errors ? (
                              <>
                                <AlertCircle className="size-3 mr-1" />
                                {lesson._errors.length} Error{lesson._errors.length > 1 ? 's' : ''}
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
                            onClick={() => toggleRowExpanded(index)}
                          >
                            {expandedRows.has(index) ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                          </Button>
                        </TableCell>
                      </TableRow>
                      
                      {/* Expanded Row Details */}
                      {expandedRows.has(index) && (
                        <TableRow>
                          <TableCell colSpan={8} className="bg-muted/50">
                            <div className="space-y-4 p-4">
                              {/* Errors */}
                              {lesson._errors && (
                                <Alert variant="destructive">
                                  <AlertCircle className="size-4" />
                                  <AlertDescription>
                                    <strong>Validation Errors:</strong>
                                    <ul className="mt-1 list-disc list-inside">
                                      {lesson._errors.map((error, errorIndex) => (
                                        <li key={errorIndex} className="text-sm">{error}</li>
                                      ))}
                                    </ul>
                                  </AlertDescription>
                                </Alert>
                              )}
                              
                              {/* Lesson Details */}
                              <div className="grid gap-4">
                                <div>
                                  <strong>Overview:</strong>
                                  <p className="text-sm text-muted-foreground mt-1">{lesson.overview}</p>
                                </div>
                                <div>
                                  <strong>Objectives:</strong>
                                  <pre className="text-sm bg-muted p-2 rounded mt-1 overflow-x-auto">
                                    {JSON.stringify(lesson.objectives, null, 2)}
                                  </pre>
                                </div>
                                <div>
                                  <strong>Key Concepts:</strong>
                                  <pre className="text-sm bg-muted p-2 rounded mt-1 overflow-x-auto">
                                    {JSON.stringify(lesson.key_concepts, null, 2)}
                                  </pre>
                                </div>
                                <div>
                                  <strong>Summary:</strong>
                                  <p className="text-sm text-muted-foreground mt-1">{lesson.summary}</p>
                                </div>
                                <div>
                                  <strong>Application:</strong>
                                  <p className="text-sm text-muted-foreground mt-1">{lesson.application}</p>
                                </div>
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
          <CardTitle>CSV Format Requirements</CardTitle>
          <CardDescription>
            Your CSV file must include these columns with proper formatting
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <h4 className="font-medium mb-2">Required Columns:</h4>
              <div className="flex flex-wrap gap-1">
                {requiredColumns.map((column) => (
                  <Badge key={column} variant="outline" className="text-xs">
                    {column}
                  </Badge>
                ))}
              </div>
            </div>
            <div>
              <h4 className="font-medium mb-2">JSON Format Fields:</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• <strong>objectives:</strong> Array with description and points</li>
                <li>• <strong>key_concepts:</strong> Object with concept-explanation pairs</li>
                <li>• Both must be valid JSON strings in CSV</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
