"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Upload, 
  FileText, 
  AlertCircle, 
  CheckCircle, 
  Info,
  Eye,
  Download,
  RefreshCw,
  Bug
} from "lucide-react";
import { 
  uploadCheckMarkersFile,
  uploadCheckMarkersFileWithValidation 
} from "@/lib/api/lesson-service";
import { 
  uploadCheckMarkersSimple 
} from "@/lib/api/simple-upload-service";
import { 
  uploadCheckMarkers 
} from "@/lib/api/lesson-upload";
import {
  uploadCheckMarkersDirectly
} from "@/lib/api/direct-check-markers-upload";
import {
  uploadAllLessonFilesBulk,
  validateBulkUploadFiles,
  type BulkUploadFiles
} from "@/lib/api/bulk-lesson-upload";
import { getTokenFromCookies, getAuthCookies } from "@/lib/auth-cookies";
import { useAuthStore } from "@/store/authStore";

interface DebugLog {
  timestamp: Date;
  type: "info" | "success" | "error" | "warning";
  message: string;
  data?: any;
}

export default function CheckMarkersUploadDebugPage() {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [debugLogs, setDebugLogs] = useState<DebugLog[]>([]);
  const { user, isAuthenticated } = useAuthStore();

  const addLog = (type: DebugLog["type"], message: string, data?: any) => {
    const log: DebugLog = {
      timestamp: new Date(),
      type,
      message,
      data
    };
    setDebugLogs(prev => [log, ...prev].slice(0, 50)); // Keep last 50 logs
    
    // Also log to console for additional debugging
    console.log(`[${type.toUpperCase()}] ${message}`, data ? data : '');
  };

  const clearLogs = () => {
    setDebugLogs([]);
    addLog("info", "Debug logs cleared");
  };

  const downloadSampleFile = () => {
    const sampleContent = `lesson,overview,lesson_video,concept_one,concept_two,concept_three,concept_four,concept_five,concept_six,concept_seven,general_exercises
Numbers and Counting,10,15,20,20,0,0,0,0,0,35
Addition Basics,10,15,25,25,0,0,0,0,0,25
The Alphabet,10,15,30,30,0,0,0,0,0,15`;
    
    const blob = new Blob([sampleContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sample_check_markers.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    
    addLog("info", "Sample check-markers file downloaded");
  };

  const debugAuthState = () => {
    addLog("info", "=== AUTH STATE DEBUG ===");
    
    // Check auth store
    addLog("info", `Auth Store - Authenticated: ${isAuthenticated}`);
    addLog("info", `Auth Store - User:`, user);
    
    // Check cookies
    const authCookies = getAuthCookies();
    addLog("info", `Auth Cookies:`, authCookies);
    
    const token = getTokenFromCookies();
    addLog("info", `Token from cookies: ${token ? 'Present (' + token.substring(0, 20) + '...)' : 'Missing'}`);
    
    // Check if token is valid format
    if (token) {
      try {
        const tokenParts = token.split('.');
        addLog("info", `Token format: ${tokenParts.length === 3 ? 'JWT (3 parts)' : `${tokenParts.length} parts`}`);
      } catch (e) {
        addLog("warning", "Token format validation failed");
      }
    }
  };

  const previewFileContent = async () => {
    if (!file) {
      addLog("warning", "No file selected for preview");
      return;
    }
    
    try {
      const content = await file.text();
      addLog("info", `File preview (first 1000 chars):`, content.substring(0, 1000));
      
      // Analyze file structure
      const lines = content.split('\n');
      addLog("info", `File analysis - Total lines: ${lines.length}`);
      
      if (lines.length > 0) {
        // Auto-detect delimiter
        const headerLine = lines[0];
        const commaCount = (headerLine.match(/,/g) || []).length;
        const pipeCount = (headerLine.match(/\|/g) || []).length;
        
        let delimiter = ',';
        let format = 'comma';
        
        if (pipeCount > commaCount) {
          delimiter = '|';
          format = 'pipe';
        }
        
        const headers = headerLine.split(delimiter).map(h => h.trim());
        addLog("info", `Format detected: ${format}-delimited`);
        addLog("info", `Headers found (${headers.length}):`, headers);
        
        const expectedHeaders = ['lesson', 'overview', 'lesson_video', 'concept_one', 'concept_two', 'concept_three', 'concept_four', 'concept_five', 'concept_six', 'concept_seven', 'general_exercises'];
        const missingHeaders = expectedHeaders.filter(h => !headers.includes(h));
        
        if (missingHeaders.length > 0) {
          addLog("error", `Missing headers:`, missingHeaders);
        } else {
          addLog("success", "All required headers present");
        }
      }
    } catch (error) {
      addLog("error", `Failed to preview file: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const testUploadMethod = async (method: string) => {
    if (!file) {
      toast.error("Please select a file first");
      addLog("error", "No file selected for upload test");
      return;
    }

    setIsUploading(true);
    addLog("info", `=== TESTING ${method.toUpperCase()} METHOD ===`);
    
    try {
      let result;
      
      switch (method) {
        case "basic":
          addLog("info", "Using uploadCheckMarkersFile (basic method)");
          result = await uploadCheckMarkersFile(file);
          break;
          
        case "validated":
          addLog("info", "Using uploadCheckMarkersFileWithValidation (smart method)");
          result = await uploadCheckMarkersFileWithValidation(file);
          break;
          
        case "simple":
          addLog("info", "Using uploadCheckMarkersSimple (simple method)");
          result = await uploadCheckMarkersSimple(file);
          break;
          
        case "generic":
          addLog("info", "Using uploadCheckMarkers (generic method)");
          result = await uploadCheckMarkers(file);
          break;
          
        case "direct":
          addLog("info", "Using uploadCheckMarkersDirectly (HTTPie-style direct method)");
          result = await uploadCheckMarkersDirectly(file);
          break;
          
        default:
          throw new Error(`Unknown method: ${method}`);
      }
      
      addLog("info", `Upload result:`, result);
      
      if (result.success) {
        addLog("success", `✅ ${method} method succeeded: ${result.message}`);
        toast.success(`Upload successful with ${method} method!`);
      } else {
        addLog("error", `❌ ${method} method failed: ${result.error || result.message}`);
        toast.error(`Upload failed with ${method} method`);
      }
    } catch (error: any) {
      const errorMsg = error.response?.data?.message || error.message || 'Unknown error';
      addLog("error", `❌ ${method} method threw error: ${errorMsg}`);
      addLog("error", "Full error object:", error);
      toast.error(`${method} method error: ${errorMsg}`);
    } finally {
      setIsUploading(false);
    }
  };

  const testAllMethods = async () => {
    const methods = ["basic", "validated", "simple", "generic"];
    
    for (const method of methods) {
      await testUploadMethod(method);
      // Add a small delay between tests
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      addLog("info", `File selected: ${selectedFile.name} (${selectedFile.size} bytes, ${selectedFile.type})`);
    }
  };

  // Load the correct comma-delimited CSV for testing
  const loadCorrectCsvFile = () => {
    // Correct comma-delimited format that API expects
    const correctCsvContent = `lesson,overview,lesson_video,concept_one,concept_two,concept_three,concept_four,concept_five,concept_six,concept_seven,general_exercises
Number Bases System,5,5,20,25,25,0,0,0,0,20`;
    
    const blob = new Blob([correctCsvContent], { type: 'text/csv' });
    const correctFile = new File([blob], 'correct_check_markers.csv', { type: 'text/csv' });
    setFile(correctFile);
    addLog("info", `✅ Loaded correct comma-delimited CSV format for testing`);
    addLog("info", `File details: ${correctFile.name} (${correctFile.size} bytes)`);
  };

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Bug className="h-8 w-8" />
          Debug: Check-Markers Upload
        </h1>
        <p className="text-muted-foreground mt-2">
          Comprehensive testing and debugging for check-markers upload functionality
        </p>
      </div>

      {/* Authentication Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info className="h-5 w-5" />
            Authentication Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                {isAuthenticated ? (
                  <CheckCircle className="h-4 w-4 text-green-500" />
                ) : (
                  <AlertCircle className="h-4 w-4 text-red-500" />
                )}
                <span>Authentication: {isAuthenticated ? 'Authenticated' : 'Not Authenticated'}</span>
              </div>
              {user && (
                <div className="text-sm text-muted-foreground">
                  User: {user.name} ({user.email}) - Role: {user.role.join(', ')}
                </div>
              )}
            </div>
            <Button onClick={debugAuthState} variant="outline" size="sm">
              Debug Auth
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* File Selection and Preview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            File Selection & Preview
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <input
                type="file"
                accept=".csv,.txt"
                onChange={handleFileSelect}
                className="block w-full text-sm text-muted-foreground
                file:mr-4 file:py-2 file:px-4
                file:rounded-full file:border-0
                file:text-sm file:font-semibold
                file:bg-primary file:text-primary-foreground
                hover:file:bg-primary/90"
              />
              {file && (
                <div className="mt-2 text-sm text-muted-foreground">
                  Selected: {file.name} ({Math.round(file.size / 1024)}KB)
                </div>
              )}
            </div>
            
            <div className="flex gap-2 flex-wrap">
              <Button onClick={downloadSampleFile} variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Download Sample
              </Button>
              <Button 
                onClick={loadCorrectCsvFile}
                variant="default" 
                size="sm"
              >
                ✅ Load Correct Format
              </Button>
              <Button 
                onClick={previewFileContent} 
                variant="outline" 
                size="sm"
                disabled={!file}
              >
                <Eye className="h-4 w-4 mr-2" />
                Preview File
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Upload Testing */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Upload Testing
          </CardTitle>
          <CardDescription>
            Test different upload methods to identify which one works
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="individual" className="w-full">
            <TabsList>
              <TabsTrigger value="individual">Individual Tests</TabsTrigger>
              <TabsTrigger value="batch">Batch Test</TabsTrigger>
            </TabsList>
            
            <TabsContent value="individual" className="space-y-4">
              <div className="grid gap-3 md:grid-cols-2">
                <Button
                  onClick={() => testUploadMethod("direct")}
                  disabled={!file || isUploading}
                  variant="default"
                >
                  🚀 Test Direct Upload (HTTPie-style)
                </Button>
                <Button
                  onClick={() => testUploadMethod("basic")}
                  disabled={!file || isUploading}
                  variant="outline"
                >
                  Test Basic Upload
                </Button>
                <Button
                  onClick={() => testUploadMethod("validated")}
                  disabled={!file || isUploading}
                  variant="outline"
                >
                  Test Validated Upload
                </Button>
                <Button
                  onClick={() => testUploadMethod("simple")}
                  disabled={!file || isUploading}
                  variant="outline"
                >
                  Test Simple Upload
                </Button>
                <Button
                  onClick={() => testUploadMethod("generic")}
                  disabled={!file || isUploading}
                  variant="outline"
                >
                  Test Generic Upload
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="batch">
              <div className="space-y-4">
                <Button
                  onClick={testAllMethods}
                  disabled={!file || isUploading}
                  className="w-full"
                  size="lg"
                >
                  {isUploading ? (
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Upload className="h-4 w-4 mr-2" />
                  )}
                  Test All Methods
                </Button>
                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertDescription>
                    This will test all upload methods sequentially. Check the logs below for detailed results.
                  </AlertDescription>
                </Alert>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <Separator />

      {/* Debug Logs */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Bug className="h-5 w-5" />
              Debug Logs
            </CardTitle>
            <Button onClick={clearLogs} variant="outline" size="sm">
              Clear Logs
            </Button>
          </div>
          <CardDescription>
            Real-time debugging information and upload results
          </CardDescription>
        </CardHeader>
        <CardContent>
          {debugLogs.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              No logs yet. Start testing to see debug information here.
            </p>
          ) : (
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {debugLogs.map((log, index) => (
                <div
                  key={index}
                  className={`p-3 rounded-lg border-l-4 text-sm ${
                    log.type === "success"
                      ? "border-green-500 bg-green-50/50"
                      : log.type === "error"
                      ? "border-red-500 bg-red-50/50"
                      : log.type === "warning"
                      ? "border-yellow-500 bg-yellow-50/50"
                      : "border-blue-500 bg-blue-50/50"
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <Badge
                          variant={
                            log.type === "success"
                              ? "default"
                              : log.type === "error"
                              ? "destructive"
                              : "secondary"
                          }
                          className="text-xs"
                        >
                          {log.type}
                        </Badge>
                        <span className="font-medium">{log.message}</span>
                      </div>
                      {log.data && (
                        <pre className="mt-2 text-xs bg-muted/50 p-2 rounded overflow-x-auto">
                          {typeof log.data === 'string' 
                            ? log.data 
                            : JSON.stringify(log.data, null, 2)
                          }
                        </pre>
                      )}
                    </div>
                    <span className="text-xs text-muted-foreground ml-2">
                      {log.timestamp.toLocaleTimeString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* API Information */}
      <Card>
        <CardHeader>
          <CardTitle>API Configuration</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6 text-sm">
            <div>
              <h4 className="font-medium text-base mb-3">Check Markers Upload</h4>
              <div className="space-y-3">
                <div>
                  <h5 className="font-medium">Endpoint:</h5>
                  <code className="bg-muted px-2 py-1 rounded">
                    POST https://fastlearnersapp.com/api/v1/superadmin/lessons/uploads/check-markers
                  </code>
                </div>
                
                <div>
                  <h5 className="font-medium">Expected Form Field:</h5>
                  <code className="bg-muted px-2 py-1 rounded">check_markers_file</code>
                </div>
                
                <div>
                  <h5 className="font-medium">Expected CSV Format:</h5>
                  <div className="bg-muted p-3 rounded text-xs font-mono">
                    lesson,overview,lesson_video,concept_one,concept_two,concept_three,concept_four,concept_five,concept_six,concept_seven,general_exercises
                    <br />Number Bases System,5,5,20,25,25,0,0,0,0,20
                  </div>
                </div>
              </div>
            </div>
            
            <Separator />
            
            <div>
              <h4 className="font-medium text-base mb-3">Bulk Upload (All Lesson Files)</h4>
              <div className="space-y-3">
                <div>
                  <h5 className="font-medium">Endpoint:</h5>
                  <code className="bg-muted px-2 py-1 rounded">
                    POST https://fastlearnersapp.com/api/v1/superadmin/lessons/uploads/all-lesson-files
                  </code>
                </div>
                
                <div>
                  <h5 className="font-medium">Required Form Fields:</h5>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    <code className="bg-muted px-2 py-1 rounded text-xs">lessons_file</code>
                    <code className="bg-muted px-2 py-1 rounded text-xs">concepts_file</code>
                    <code className="bg-muted px-2 py-1 rounded text-xs">examples_file</code>
                    <code className="bg-muted px-2 py-1 rounded text-xs">exercises_file</code>
                    <code className="bg-muted px-2 py-1 rounded text-xs">general_exercises_file</code>
                    <code className="bg-muted px-2 py-1 rounded text-xs">check_markers_file</code>
                  </div>
                </div>
                
                <div>
                  <h5 className="font-medium">File Types:</h5>
                  <p className="text-muted-foreground">Only CSV (.csv) or TXT (.txt) files are accepted</p>
                </div>
              </div>
            </div>
            
            <Separator />
            
            <div>
              <h4 className="font-medium text-base mb-3">Common Headers</h4>
              <ul className="space-y-1">
                <li>• <code>Authorization: Bearer {'{token}'}</code></li>
                <li>• <code>Accept: application/json</code></li>
                <li>• <code>Content-Type: multipart/form-data</code> (auto-set by browser)</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
