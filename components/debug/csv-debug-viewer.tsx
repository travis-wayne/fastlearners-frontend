"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Eye, Download, FileText, AlertCircle } from "lucide-react";
import { convertToAPIFormat } from "@/lib/utils/csv-upload-helper";

interface CSVDebugViewerProps {
  file: File | null;
  onClose?: () => void;
}

export default function CSVDebugViewer({ file, onClose }: CSVDebugViewerProps) {
  const [originalContent, setOriginalContent] = useState<string>("");
  const [apiFormattedContent, setApiFormattedContent] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  const analyzeFile = async () => {
    if (!file) return;
    
    setIsLoading(true);
    try {
      const content = await file.text();
      setOriginalContent(content);
      
      const apiFormatted = convertToAPIFormat(content);
      setApiFormattedContent(apiFormatted);
    } catch (error) {
      console.error("Error analyzing file:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const downloadAPIFormat = () => {
    if (!apiFormattedContent) return;
    
    const blob = new Blob([apiFormattedContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${file?.name?.replace('.csv', '')}_api_format.csv` || 'api_format.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (!file) {
    return (
      <Alert>
        <FileText className="size-4" />
        <AlertDescription>
          No file selected for debugging. Please select a CSV file first.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Eye className="size-5" />
              CSV Debug Viewer
            </CardTitle>
            <CardDescription>
              Analyze and debug CSV file format for API compatibility
            </CardDescription>
          </div>
          {onClose && (
            <Button variant="ghost" size="sm" onClick={onClose}>
              ×
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-sm font-medium">File: {file.name}</p>
            <div className="flex gap-2">
              <Badge variant="outline">
                {(file.size / 1024).toFixed(1)} KB
              </Badge>
              <Badge variant="outline">
                {file.type || 'text/csv'}
              </Badge>
            </div>
          </div>
          <div className="space-x-2">
            <Button
              onClick={analyzeFile}
              disabled={isLoading}
              size="sm"
            >
              {isLoading ? "Analyzing..." : "Analyze File"}
            </Button>
          </div>
        </div>

        {originalContent && (
          <>
            <Alert>
              <AlertCircle className="size-4" />
              <AlertDescription>
                <strong>Debug Information:</strong> This shows the original file content 
                and how it gets converted to the API&apos;s expected format.
              </AlertDescription>
            </Alert>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-medium">Original Content</h4>
                  <Badge variant="secondary">
                    {originalContent.split('\n').length} lines
                  </Badge>
                </div>
                <Textarea
                  value={originalContent}
                  readOnly
                  className="font-mono text-xs h-64"
                  placeholder="Original CSV content will appear here..."
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-medium">API Format</h4>
                  <div className="flex gap-2">
                    <Badge variant="default">
                      {apiFormattedContent.split('\n').length} lines
                    </Badge>
                    {apiFormattedContent && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={downloadAPIFormat}
                      >
                        <Download className="size-3 mr-1" />
                        Download
                      </Button>
                    )}
                  </div>
                </div>
                <Textarea
                  value={apiFormattedContent}
                  readOnly
                  className="font-mono text-xs h-64"
                  placeholder="API formatted content will appear here..."
                />
              </div>
            </div>

            {apiFormattedContent && (
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Format Analysis</h4>
                <div className="grid gap-2 md:grid-cols-3">
                  <div className="p-3 border rounded">
                    <p className="text-xs text-muted-foreground">Row Numbers</p>
                    <p className="font-mono text-sm">
                      {apiFormattedContent.includes('1|') ? '✅ Added' : '❌ Missing'}
                    </p>
                  </div>
                  <div className="p-3 border rounded">
                    <p className="text-xs text-muted-foreground">BOM Character</p>
                    <p className="font-mono text-sm">
                      {apiFormattedContent.includes('\ufeff') ? '✅ Present' : '⚠️ Missing'}
                    </p>
                  </div>
                  <div className="p-3 border rounded">
                    <p className="text-xs text-muted-foreground">Line Endings</p>
                    <p className="font-mono text-sm">
                      {apiFormattedContent.includes('\r\n') ? 'CRLF' : 'LF'}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
