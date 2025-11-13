"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DashboardHeader } from "@/components/dashboard/header";
// NOTE: getLessonsMetadata removed - this superadmin page needs admin-only endpoint
// Use getProfileData() from lib/api/profile.ts for metadata or create admin-only client
import Link from "next/link";
import { Input } from "@/components/ui/input";

export default function LessonsPage() {
  const [apiData, setApiData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lessonId, setLessonId] = useState("");

  const testAPI = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // TODO: Replace with admin-only endpoint or use getProfileData() from lib/api/profile.ts
      // getLessonsMetadata removed - this superadmin page needs admin-only client
      setError("Admin endpoint not implemented. getLessonsMetadata() was removed from student app.");
      setApiData(null);
      // const data = await getLessonsMetadata();
      // setApiData(data);
      // console.log("API Response:", data);
    } catch (err: any) {
      setError(err.message || "Failed to fetch data");
      console.error("API Error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <DashboardHeader
        heading="Lesson Management"
        text="Manage lesson content for FastLeaners"
      />

      {/* API Test Section */}
      <Card>
        <CardHeader>
          <CardTitle>API Connection Test</CardTitle>
          <CardDescription>
            Test the connection to the lessons API endpoints
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button onClick={testAPI} disabled={loading}>
            {loading ? "Testing..." : "Test API Connection"}
          </Button>
          
          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-4">
              <p className="text-red-800">Error: {error}</p>
            </div>
          )}
          
          {apiData && (
            <div className="rounded-lg border bg-green-50 p-4">
              <p className="mb-2 font-medium text-green-800">API Connection Successful!</p>
              <div className="space-y-2 text-sm">
                <p>Classes: {apiData.classes?.length || 0}</p>
                <p>Subjects: {apiData.subjects?.length || 0}</p>
                <p>Terms: {apiData.terms?.length || 0}</p>
                <p>Weeks: {apiData.weeks?.length || 0}</p>
              </div>
              
              {/* Display sample data */}
              {apiData.classes && (
                <details className="mt-4">
                  <summary className="cursor-pointer font-medium">Sample Classes</summary>
                  <div className="mt-2 rounded bg-white p-2 text-xs">
                    {JSON.stringify(apiData.classes.slice(0, 3), null, 2)}
                  </div>
                </details>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Open Lesson by ID</CardTitle>
            <CardDescription>Fetch specific lesson details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Input
              placeholder="Enter lesson ID (e.g. 2)"
              value={lessonId}
              onChange={(e) => setLessonId(e.target.value)}
              inputMode="numeric"
            />
<Link href={lessonId ? `/dashboard/superadmin/lessons/${lessonId}` : "#"}>
              <Button disabled={!lessonId} className="w-full">Open Lesson</Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Upload Content</CardTitle>
            <CardDescription>Add new lessons</CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full">
              Upload Lessons
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Manage Content</CardTitle>
            <CardDescription>Edit and organize</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="secondary" className="w-full">
              Manage Lessons
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}