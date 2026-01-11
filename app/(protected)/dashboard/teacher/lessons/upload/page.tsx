"use client";

import Link from "next/link";
import { Download, FileStack, FileText, Info, Upload } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DashboardHeader } from "@/components/dashboard/header";

// Note: metadata cannot be exported from client components

export default function UploadPage() {
  const downloadTemplate = (filename: string) => {
    // Create download link for CSV templates from the lesson-csv-files directory
    const link = document.createElement("a");
    link.href = `/lesson-csv-files/${filename}`;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const templateFiles = [
    { name: "lesson-structure.csv", label: "Lessons Template" },
    { name: "concept-structure.csv", label: "Concepts Template" },
    { name: "examples-structure.csv", label: "Examples Template" },
    { name: "exercises-structure.csv", label: "Exercises Template" },
    {
      name: "general-exercises-structure.csv",
      label: "General Exercises Template",
    },
    { name: "check-markers-structure.csv", label: "Check Markers Template" },
    { name: "scheme-civic-education.csv", label: "Scheme of Work Template" },
  ];

  return (
    <>
      <DashboardHeader
        heading="Upload Lesson Files"
        text="Choose your preferred method to upload lesson content and materials"
      />

      <div className="space-y-component-md sm:space-y-component-lg">
        {/* Upload Options */}
        <div className="grid gap-4 sm:gap-6 md:grid-cols-2">
          {/* Individual Upload */}
          <Card className="relative">
            <CardHeader className="p-component-sm sm:p-component-md">
              <div className="flex items-center gap-2">
                <FileText className="size-5 text-primary sm:size-6" />
                <CardTitle className="text-base sm:text-lg">Individual File Upload</CardTitle>
              </div>
              <CardDescription className="text-xs sm:text-sm">
                Upload lesson components one at a time with detailed control and
                validation.
              </CardDescription>
              <Badge className="absolute right-3 top-3 text-[10px] sm:right-4 sm:top-4 sm:text-xs" variant="secondary">
                Recommended
              </Badge>
            </CardHeader>
            <CardContent className="space-y-component-xs p-component-sm sm:space-y-component-sm sm:p-component-md">
              <div className="space-y-component-xs">
                <h4 className="text-xs font-medium sm:text-sm">Benefits:</h4>
                <ul className="space-y-1 text-xs text-muted-foreground sm:text-sm">
                  <li>• Step-by-step upload process</li>
                  <li>• Individual file validation</li>
                  <li>• Detailed error reporting</li>
                  <li>• Continue from where you left off</li>
                </ul>
              </div>

              <div className="space-y-component-xs">
                <h4 className="text-xs font-medium sm:text-sm">File Types:</h4>
                <div className="flex flex-wrap gap-1">
                  {[
                    "Lessons",
                    "Concepts",
                    "Examples",
                    "Exercises",
                    "General Exercises",
                    "Check Markers",
                    "Scheme of Work",
                  ].map((type) => (
                    <Badge key={type} variant="outline" className="text-[10px] sm:text-xs">
                      {type}
                    </Badge>
                  ))}
                </div>
              </div>

              <Link href="/dashboard/teacher/lessons/upload/individual">
                <Button className="w-full" size="lg">
                  <FileText className="mr-2 size-4" />
                  <span className="text-sm sm:text-base">Start Individual Upload</span>
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Bulk Upload */}
          <Card>
            <CardHeader className="p-component-sm sm:p-component-md">
              <div className="flex items-center gap-2">
                <FileStack className="size-5 text-primary sm:size-6" />
                <CardTitle className="text-base sm:text-lg">Bulk File Upload</CardTitle>
              </div>
              <CardDescription className="text-xs sm:text-sm">
                Upload all lesson components at once for efficient batch
                processing.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-component-xs p-component-sm sm:space-y-component-sm sm:p-component-md">
              <div className="space-y-component-xs">
                <h4 className="text-xs font-medium sm:text-sm">Benefits:</h4>
                <ul className="space-y-1 text-xs text-muted-foreground sm:text-sm">
                  <li>• Upload all files simultaneously</li>
                  <li>• Faster for complete lesson sets</li>
                  <li>• Maintains data consistency</li>
                  <li>• Single upload process</li>
                </ul>
              </div>

              <div className="space-y-component-xs">
                <h4 className="text-xs font-medium sm:text-sm">Requirements:</h4>
                <ul className="space-y-1 text-xs text-muted-foreground sm:text-sm">
                  <li>• All 6 files must be ready</li>
                  <li>• Data must be consistent across files</li>
                  <li>• Cannot upload partial sets</li>
                </ul>
              </div>

              <Link href="/dashboard/teacher/lessons/upload/bulk">
                <Button className="w-full" size="lg" variant="outline">
                  <FileStack className="mr-2 size-4" />
                  <span className="text-sm sm:text-base">Start Bulk Upload</span>
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* CSV Templates */}
        <Card>
          <CardHeader className="p-component-sm sm:p-component-md">
            <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
              <Download className="size-4 sm:size-5" />
              CSV Templates
            </CardTitle>
            <CardDescription className="text-xs sm:text-sm">
              Download template files to understand the required format for each
              lesson component
            </CardDescription>
          </CardHeader>
          <CardContent className="p-component-sm sm:p-component-md">
            <div className="grid gap-2 sm:gap-3 md:grid-cols-2 lg:grid-cols-3">
              {templateFiles.map((template) => (
                <Button
                  key={template.name}
                  variant="outline"
                  className="justify-start text-xs sm:text-sm"
                  size="sm"
                  onClick={() => downloadTemplate(template.name)}
                >
                  <Download className="mr-2 size-3 sm:size-4" />
                  {template.label}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Upload Guidelines */}
        <Card>
          <CardHeader className="p-component-sm sm:p-component-md">
            <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
              <Info className="size-4 sm:size-5" />
              Upload Guidelines
            </CardTitle>
            <CardDescription className="text-xs sm:text-sm">
              Important information to ensure successful uploads
            </CardDescription>
          </CardHeader>
          <CardContent className="p-component-sm sm:p-component-md">
            <div className="grid gap-4 sm:gap-6 md:grid-cols-2">
              <div>
                <h4 className="mb-2 text-xs font-medium sm:mb-3 sm:text-sm">File Format Requirements:</h4>
                <ul className="space-y-1.5 text-xs text-muted-foreground sm:space-y-2 sm:text-sm">
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
                <h4 className="mb-2 text-xs font-medium sm:mb-3 sm:text-sm">Data Consistency:</h4>
                <ul className="space-y-1.5 text-xs text-muted-foreground sm:space-y-2 sm:text-sm">
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

            <div className="mt-4 rounded-lg bg-muted/50 p-3 sm:mt-6 sm:p-4">
              <h4 className="mb-1.5 text-xs font-medium sm:mb-2 sm:text-sm">💡 Pro Tip:</h4>
              <p className="text-xs text-muted-foreground sm:text-sm">
                Start with the individual upload method if you&apos;re new to
                the system. It provides better feedback and allows you to
                understand the data structure before attempting bulk uploads.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
