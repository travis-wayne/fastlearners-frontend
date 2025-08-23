"use client";

import Link from "next/link";
import { DashboardHeader } from "@/components/dashboard/header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Upload, FileStack, FileText, Download, Info, ShieldX } from "lucide-react";
import { usePermissionCheck, useRBACGuard } from "@/hooks/useRBACGuard";
// Note: metadata cannot be exported from client components

export default function UploadPage() {
  const { hasPermission, userRole } = usePermissionCheck();
  const { canAccess } = useRBACGuard();
  
  // Check if user has permission to manage lessons
  const canManageLessons = hasPermission('manage_lessons');
  
  if (!canManageLessons) {
    return (
      <>
        <DashboardHeader
          heading="Upload Lesson Files"
          text="Lesson upload and management tools"
        />
        
        <Alert variant="destructive">
          <ShieldX className="h-4 w-4" />
          <AlertDescription>
            <strong>Access Restricted:</strong> Only Teachers, Admins, and SuperAdmins can upload lesson content. 
            Your current role ({userRole}) does not have permission to manage lessons.
          </AlertDescription>
        </Alert>
        
        <Card>
          <CardHeader>
            <CardTitle>Need Access?</CardTitle>
            <CardDescription>
              Contact your system administrator if you believe you should have access to lesson management features.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>• Teachers can create and upload lesson content</p>
              <p>• Admins can manage all lessons and users</p>
              <p>• SuperAdmins have full system access</p>
            </div>
          </CardContent>
        </Card>
      </>
    );
  }
  
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
                <FileText className="h-6 w-6 text-primary" />
                <CardTitle>Individual File Upload</CardTitle>
              </div>
              <CardDescription>
                Upload lesson components one at a time with detailed control and validation.
              </CardDescription>
              <Badge className="absolute top-4 right-4" variant="secondary">
                Recommended
              </Badge>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h4 className="font-medium text-sm">Benefits:</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Step-by-step upload process</li>
                  <li>• Individual file validation</li>
                  <li>• Detailed error reporting</li>
                  <li>• Continue from where you left off</li>
                </ul>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-medium text-sm">File Types:</h4>
                <div className="flex flex-wrap gap-1">
                  {['Lessons', 'Concepts', 'Examples', 'Exercises', 'General Exercises', 'Check Markers', 'Scheme of Work'].map((type) => (
                    <Badge key={type} variant="outline" className="text-xs">
                      {type}
                    </Badge>
                  ))}
                </div>
              </div>

              <Link href="/admin/lessons/upload/individual">
                <Button className="w-full" size="lg">
                  <FileText className="h-4 w-4 mr-2" />
                  Start Individual Upload
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Bulk Upload */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <FileStack className="h-6 w-6 text-primary" />
                <CardTitle>Bulk File Upload</CardTitle>
              </div>
              <CardDescription>
                Upload all lesson components at once for efficient batch processing.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h4 className="font-medium text-sm">Benefits:</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Upload all files simultaneously</li>
                  <li>• Faster for complete lesson sets</li>
                  <li>• Maintains data consistency</li>
                  <li>• Single upload process</li>
                </ul>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium text-sm">Requirements:</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• All 6 files must be ready</li>
                  <li>• Data must be consistent across files</li>
                  <li>• Cannot upload partial sets</li>
                </ul>
              </div>

              <Link href="/admin/lessons/upload/bulk">
                <Button className="w-full" size="lg" variant="outline">
                  <FileStack className="h-4 w-4 mr-2" />
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
              <Download className="h-5 w-5" />
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
                  <Download className="h-4 w-4 mr-2" />
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
              <Info className="h-5 w-5" />
              Upload Guidelines
            </CardTitle>
            <CardDescription>
              Important information to ensure successful uploads
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <h4 className="font-medium mb-3">File Format Requirements:</h4>
                <ul className="text-sm text-muted-foreground space-y-2">
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
                <h4 className="font-medium mb-3">Data Consistency:</h4>
                <ul className="text-sm text-muted-foreground space-y-2">
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

            <div className="mt-6 p-4 bg-muted/50 rounded-lg">
              <h4 className="font-medium mb-2 text-sm">💡 Pro Tip:</h4>
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
