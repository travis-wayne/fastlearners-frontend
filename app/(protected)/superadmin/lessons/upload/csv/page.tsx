"use client";

import { DashboardHeader } from "@/components/dashboard/header";
import EnhancedCSVUpload from "@/components/lessons/enhanced-csv-upload";
import { usePermissionCheck } from "@/hooks/useRBACGuard";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ShieldX, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { toast } from "sonner";

export default function SmartCSVUploadPage() {
  const { hasPermission, userRole } = usePermissionCheck();
  
  // Check if user has permission to manage lessons
  const canManageLessons = hasPermission('manage_lessons');
  
  if (!canManageLessons) {
    return (
      <>
        <DashboardHeader
          heading="Smart CSV Upload"
          text="Enhanced CSV upload with preview and validation"
        />
        
        <Alert variant="destructive">
          <ShieldX className="size-4" />
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

  const handleUploadSuccess = (lessons: any[]) => {
    toast.success(`Successfully uploaded ${lessons.length} lessons!`);
    console.log('Uploaded lessons:', lessons);
  };

  const handleUploadError = (error: string) => {
    console.error('=== CSV UPLOAD ERROR HANDLER ===');
    console.error('Error received:', error);
    
    // Extract more meaningful error messages
    let displayError = error;
    
    // Common validation issues and user-friendly messages
    if (error.includes('Invalid scheme of work CSV format')) {
      displayError = 'CSV format validation failed. Please ensure your file matches the expected format with all required columns.';
    } else if (error.includes('422') || error.includes('Unprocessable')) {
      displayError = 'File content validation failed. Please check that your data matches the expected format and column requirements.';
    } else if (error.includes('400') || error.includes('Bad Request')) {
      displayError = 'Invalid file format or structure. Please verify your CSV file follows the correct template.';
    } else if (error.includes('401') || error.includes('Unauthorized')) {
      displayError = 'Authentication required. Please refresh the page and try again.';
    } else if (error.includes('403') || error.includes('Forbidden')) {
      displayError = 'Insufficient permissions to upload files.';
    }
    
    toast.error(`Upload failed: ${displayError}`);
    
    // Also show a more technical toast for developers
    if (error !== displayError) {
      setTimeout(() => {
        toast.error(`Technical details: ${error}`, {
          duration: 10000 // Show longer for debugging
        });
      }, 500);
    }
    
    console.error('Processed error for display:', displayError);
    console.error('=== END ERROR HANDLER ===');
  };

  return (
    <>
      <div className="mb-6">
        <Link href="/superadmin/lessons/upload">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="size-4 mr-2" />
            Back to Upload Options
          </Button>
        </Link>
      </div>

      <DashboardHeader
        heading="Smart CSV Upload"
        text="Upload lessons with intelligent parsing, validation, and preview"
      />

      <EnhancedCSVUpload
        onUploadSuccess={handleUploadSuccess}
        onUploadError={handleUploadError}
      />
    </>
  );
}
