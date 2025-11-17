"use client";

import { useState } from "react";
import Link from "next/link";
import {
  BarChart3,
  BookOpen,
  Search,
  Settings,
  Upload,
  Users,
} from "lucide-react";

import { getLessonsMetadata } from "@/lib/api/superadmin-lessons";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DashboardHeader } from "@/components/dashboard/header";

export default function SuperAdminDashboard() {
  const [apiData, setApiData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const testAPI = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await getLessonsMetadata();
      if (res.success && res.content) {
        setApiData(res.content);
        console.log("API Response:", res.content);
      } else {
        setError(res.message || "Failed to fetch metadata");
        setApiData(null);
      }
    } catch (err: any) {
      setError(err.message || "Failed to fetch data");
      console.error("API Error:", err);
      setApiData(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <DashboardHeader
        heading="SuperAdmin Dashboard"
        text="Manage the FastLeaners platform"
      />

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,234</div>
            <p className="text-xs text-muted-foreground">
              +10.1% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Lessons</CardTitle>
            <BookOpen className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {apiData?.lessons?.length || "0"}
            </div>
            <p className="text-xs text-muted-foreground">Across all subjects</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active Classes
            </CardTitle>
            <BarChart3 className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {apiData?.classes?.length || "0"}
            </div>
            <p className="text-xs text-muted-foreground">From JSS1 to SSS3</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Subjects</CardTitle>
            <Search className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {apiData?.subjects?.length || "0"}
            </div>
            <p className="text-xs text-muted-foreground">Available subjects</p>
          </CardContent>
        </Card>
      </div>

      {/* Lesson Management Section */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold tracking-tight">Lesson Management</h2>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* API Test */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">API Connection</CardTitle>
              <CardDescription>Test lessons API connection</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button onClick={testAPI} disabled={loading} className="w-full">
                {loading ? "Testing..." : "Test API"}
              </Button>

              {error && (
                <div className="rounded border border-red-200 bg-red-50 p-3">
                  <p className="text-sm text-red-800">Error: {error}</p>
                </div>
              )}

              {apiData && (
                <div className="rounded border bg-green-50 p-3">
                  <p className="mb-1 text-sm font-medium text-green-800">
                    Connected!
                  </p>
                  <div className="space-y-1 text-xs">
                    <p>Classes: {apiData.classes?.length || 0}</p>
                    <p>Subjects: {apiData.subjects?.length || 0}</p>
                    <p>Terms: {apiData.terms?.length || 0}</p>
                    <p>Weeks: {apiData.weeks?.length || 0}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Browse Lessons */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Browse Lessons</CardTitle>
              <CardDescription>View and manage all lessons</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/dashboard/superadmin/lessons/browse">
                <Button variant="outline" className="w-full">
                  <BookOpen className="mr-2 size-4" />
                  Browse All Lessons
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Upload Content */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Upload Content</CardTitle>
              <CardDescription>Add new lesson content</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/dashboard/superadmin/lessons/upload">
                <Button className="w-full">
                  <Upload className="mr-2 size-4" />
                  Upload Lessons
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* System Management */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold tracking-tight">System Management</h2>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">User Management</CardTitle>
              <CardDescription>Manage platform users</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full">
                <Users className="mr-2 size-4" />
                Manage Users
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">System Settings</CardTitle>
              <CardDescription>Configure platform settings</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full">
                <Settings className="mr-2 size-4" />
                Settings
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Analytics</CardTitle>
              <CardDescription>View platform analytics</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full">
                <BarChart3 className="mr-2 size-4" />
                View Analytics
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Reports</CardTitle>
              <CardDescription>Generate system reports</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full">
                Generate Reports
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
