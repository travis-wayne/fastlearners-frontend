"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { DashboardHeader } from "@/components/dashboard/header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, FileStack, Upload } from "lucide-react";
import Link from "next/link";

export default function BulkUploadPage() {
  const router = useRouter();

  // Redirect to Smart CSV Upload with bulk functionality after a brief delay
  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace('/superadmin/lessons/upload/csv#bulk');
    }, 3000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <>
      <DashboardHeader
        heading="Bulk Upload Redirecting..."
        text="The bulk upload functionality has been enhanced and moved to Smart CSV Upload"
      />

      <div className="space-y-6">
        {/* Redirect Notice */}
        <Card className="border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileStack className="size-6 text-primary" />
              Enhanced Bulk Upload Available
            </CardTitle>
            <CardDescription>
              We&apos;ve improved the bulk upload experience with better validation, preview, and error handling.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
                <h4 className="font-medium mb-2">🚀 New Features in Smart CSV Upload:</h4>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>• Enhanced bulk upload with all 6 file types</li>
                  <li>• Individual file upload tabs for better control</li>
                  <li>• Real-time CSV parsing and validation</li>
                  <li>• Data preview before upload</li>
                  <li>• Better error reporting and handling</li>
                  <li>• Template downloads integrated</li>
                </ul>
              </div>

              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-4">
                  You will be automatically redirected in a few seconds, or click below to go immediately.
                </p>
                
                <Link href="/superadmin/lessons/upload/csv">
                  <Button size="lg" className="flex items-center gap-2">
                    <Upload className="size-4" />
                    Go to Smart CSV Upload
                    <ArrowRight className="size-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Legacy vs New Comparison */}
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-muted-foreground">Previous Bulk Upload</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="text-sm space-y-2 text-muted-foreground">
                <li>• Basic file selection</li>
                <li>• Limited validation</li>
                <li>• No preview capability</li>
                <li>• Basic error messages</li>
                <li>• All-or-nothing approach</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-primary/20">
            <CardHeader>
              <CardTitle className="text-primary">New Smart CSV Upload</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="text-sm space-y-2">
                <li>• Individual + bulk upload options</li>
                <li>• Papa Parse CSV processing</li>
                <li>• Real-time data preview</li>
                <li>• Detailed validation feedback</li>
                <li>• Granular control per file type</li>
                <li>• Template downloads</li>
                <li>• Better progress tracking</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
