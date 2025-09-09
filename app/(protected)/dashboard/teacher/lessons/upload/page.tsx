"use client";

import Link from "next/link";
import { DashboardHeader } from "@/components/dashboard/header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Upload, FileStack, FileText, Download, Info } from "lucide-react";
// Note: metadata cannot be exported from client components

export default function UploadPage() {
  const downloadTemplate = (filename: string) => {
    // Create download link for CSV templates from the lesson-csv-files directory
    const link = document.createElement('a');
    link.href = `/lesson-csv-files/${filename}`;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const templateFiles = [
    { name: 'lesson-structure.csv', label: 'Lessons Template' },
    { name: 'concept-structure.csv', label: 'Concepts Template' },
    { name: 'examples-structure.csv', label: 'Examples Template' },
    { name: 'exercises-structure.csv', label: 'Exercises Template' },
    { name: 'general-exercises-structure.csv', label: 'General Exercises Template' },
    { name: 'check-markers-structure.csv', label: 'Check Markers Template' },
    { name: 'scheme-civic-education.csv', label: 'Scheme of Work Template' }
  ];

  return (
    <>
      <DashboardHeader
        heading="Upload Lesson Files"
        text="Choose your preferred method to upload lesson content and materials"
      />

      <div className="space-y-8">
        {/* Upload Options */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Individual Upload */}
          <Card className="relative">
            <CardHeader>
              <div className="flex items-center gap-2">
                <FileText className="size-6 text-primary" />
                <CardTitle>Individual File Upload</CardTitle>
              </div>
              <CardDescription>
                Upload lesson components one at a time with detailed control and validation.
              </CardDescription>
              <Badge className="absolute right-4 top-4" variant="secondary">
                Recommended
              </Badge>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Benefits:</h4>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>• Step-by-step upload process</li>
                  <li>• Individual file validation</li>
                  <li>• Detailed error reporting</li>
                  <li>• Continue from where you left off</li>
                </ul>
              </div>
              
              <div className="space-y-2">
                <h4 className="text-sm font-medium">File Types:</h4>
                <div className="flex flex-wrap gap-1">
                  {['Lessons', 'Concepts', 'Examples', 'Exercises', 'General Exercises', 'Check Markers', 'Scheme of Work'].map((type) => (
                    <Badge key={type} variant="outline" className="text-xs">
                      {type}
                    </Badge>
                  ))}
                </div>
              </div>

              <Link href="/dashboard/teacher/lessons/upload/individual">
                <Button className="w-full" size="lg">
                  <FileText className="mr-2 size-4" />
                  Start Individual Upload
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Bulk Upload */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <FileStack className="size-6 text-primary" />
                <CardTitle>Bulk File Upload</CardTitle>
              </div>
              <CardDescription>
                Upload all lesson components at once for efficient batch processing.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Benefits:</h4>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>• Upload all files simultaneously</li>
                  <li>• Faster for complete lesson sets</li>
                  <li>• Maintains data consistency</li>
                  <li>• Single upload process</li>
                </ul>
              </div>

              <div className="space-y-2">
                <h4 className="text-sm font-medium">Requirements:</h4>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>• All 6 files must be ready</li>
                  <li>• Data must be consistent across files</li>
                  <li>• Cannot upload partial sets</li>
                </ul>
              </div>

              <Link href="/dashboard/teacher/lessons/upload/bulk">
                <Button className="w-full" size="lg" variant="outline">
                  <FileStack className="mr-2 size-4" />
                  Start Bulk Upload
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* CSV Templates */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Download className="size-5" />
              CSV Templates
            </CardTitle>
            <CardDescription>
              Download template files to understand the required format for each lesson component
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
              {templateFiles.map((template) => (
                <Button
                  key={template.name}
                  variant="outline"
                  className="justify-start"
                  onClick={() => downloadTemplate(template.name)}
                >
                  <Download className="mr-2 size-4" />
                  {template.label}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Upload Guidelines */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Info className="size-5" />
              Upload Guidelines
            </CardTitle>
            <CardDescription>
              Important information to ensure successful uploads
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <h4 className="mb-3 font-medium">File Format Requirements:</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-primary">•</span>
                    <span>Use CSV or TXT format only</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary">•</span>
                    <span>Column separator must be pipe (|) character</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary">•</span>
                    <span>Include all required columns in exact order</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary">•</span>
                    <span>JSON fields must be properly formatted</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary">•</span>
                    <span>Maximum file size: 10MB per file</span>
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="mb-3 font-medium">Data Consistency:</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-primary">•</span>
                    <span>Lesson topics must match between files</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary">•</span>
                    <span>Concept titles must be consistent</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary">•</span>
                    <span>Class and subject names must exist in system</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary">•</span>
                    <span>Order indexes should be sequential</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary">•</span>
                    <span>All referenced entities must be valid</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="mt-6 rounded-lg bg-muted/50 p-4">
              <h4 className="mb-2 text-sm font-medium">💡 Pro Tip:</h4>
              <p className="text-sm text-muted-foreground">
                Start with the individual upload method if you&apos;re new to the system. It provides better feedback 
                and allows you to understand the data structure before attempting bulk uploads.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
