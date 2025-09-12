"use client";

import { useState } from "react";
import Link from "next/link";
import { BookOpen, Eye, Plus, Search, Trash2, Upload } from "lucide-react";

import { usePermissionCheck } from "@/hooks/useRBACGuard";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DashboardHeader } from "@/components/dashboard/header";
import { LessonsDataTable } from "@/components/lessons/LessonsDataTable";

export default function LessonsPage() {
  const { hasPermission } = usePermissionCheck();
  const canManageLessons = hasPermission("manage_lessons");
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="space-y-6">
      <DashboardHeader
        heading="Lesson Management"
        text="Manage lesson content, uploads, and organization for FastLeaners"
      />

      {/* Tabbed Interface */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <BookOpen className="size-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="browse" className="flex items-center gap-2">
            <Eye className="size-4" />
            Browse Lessons
          </TabsTrigger>
          <TabsTrigger value="upload" className="flex items-center gap-2">
            <Upload className="size-4" />
            Upload
          </TabsTrigger>
          <TabsTrigger value="trash" className="flex items-center gap-2">
            <Trash2 className="size-4" />
            Trash
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {/* Quick Actions */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardContent className="flex items-center p-6">
                <Upload className="size-8 text-primary" />
                <div className="ml-4">
                  <h3 className="text-lg font-medium">Upload Files</h3>
                  <p className="text-sm text-muted-foreground">
                    Upload lesson content
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="flex items-center p-6">
                <BookOpen className="size-8 text-blue-600" />
                <div className="ml-4">
                  <h3 className="text-lg font-medium">View Lessons</h3>
                  <p className="text-sm text-muted-foreground">
                    Browse all lessons
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="flex items-center p-6">
                <Search className="size-8 text-green-600" />
                <div className="ml-4">
                  <h3 className="text-lg font-medium">Search</h3>
                  <p className="text-sm text-muted-foreground">
                    Find specific content
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="flex items-center p-6">
                <Trash2 className="size-8 text-red-600" />
                <div className="ml-4">
                  <h3 className="text-lg font-medium">Manage Trash</h3>
                  <p className="text-sm text-muted-foreground">
                    Restore or delete
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Actions */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {/* Upload Lessons */}
            <Card className="relative">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="size-5 text-primary" />
                  Upload Lesson Content
                </CardTitle>
                <CardDescription>
                  Upload CSV files containing lesson data, exercises, and
                  assessments
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Features:</h4>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>• Step-by-step upload process</li>
                    <li>• Dependency management</li>
                    <li>• Individual & bulk uploads</li>
                    <li>• Real-time validation</li>
                  </ul>
                </div>

                <div className="pt-2">
                  {canManageLessons ? (
                    <Link href="/dashboard/superadmin/lessons/upload">
                      <Button className="w-full" size="lg">
                        <Upload className="mr-2 size-4" />
                        Start Upload Process
                      </Button>
                    </Link>
                  ) : (
                    <Button disabled className="w-full" size="lg">
                      <Upload className="mr-2 size-4" />
                      Upload Restricted
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Manage Content */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="size-5 text-blue-600" />
                  Browse & Manage
                </CardTitle>
                <CardDescription>
                  View, search, and organize uploaded lesson content
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Actions:</h4>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>• View all lessons with filtering</li>
                    <li>• Search by topic, class, subject</li>
                    <li>• Export lesson data</li>
                    <li>• Delete lessons (move to trash)</li>
                  </ul>
                </div>

                <div className="pt-2">
                  {canManageLessons ? (
                    <Button
                      variant="outline"
                      className="w-full"
                      size="lg"
                      onClick={() => setActiveTab("browse")}
                    >
                      <Eye className="mr-2 size-4" />
                      Browse Lessons
                    </Button>
                  ) : (
                    <Button
                      variant="outline"
                      className="w-full"
                      size="lg"
                      disabled
                    >
                      <Eye className="mr-2 size-4" />
                      Browse Restricted
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Trash Management */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trash2 className="size-5 text-red-600" />
                  Trash Management
                </CardTitle>
                <CardDescription>
                  Restore or permanently delete trashed lessons
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Options:</h4>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>• View trashed lessons</li>
                    <li>• Restore individual items</li>
                    <li>• Permanent deletion</li>
                    <li>• Bulk operations</li>
                  </ul>
                </div>

                <div className="pt-2">
                  <Button
                    variant="outline"
                    className="w-full"
                    size="lg"
                    disabled
                  >
                    <Trash2 className="mr-2 size-4" />
                    Coming Soon
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Information Panel */}
          <Card>
            <CardHeader>
              <CardTitle>Upload Guidelines</CardTitle>
              <CardDescription>
                Important information for successful lesson uploads
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <h4 className="mb-3 font-medium">File Requirements:</h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <span className="text-primary">•</span>
                      <span>CSV or TXT format only</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary">•</span>
                      <span>Maximum file size: 10MB</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary">•</span>
                      <span>Proper column structure required</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary">•</span>
                      <span>JSON fields must be valid</span>
                    </li>
                  </ul>
                </div>

                <div>
                  <h4 className="mb-3 font-medium">Upload Order:</h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <span className="text-primary">1.</span>
                      <span>Lessons (base content)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary">2.</span>
                      <span>Concepts (requires lessons)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary">3.</span>
                      <span>Examples & Exercises (requires concepts)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary">4.</span>
                      <span>General Exercises & Check Markers</span>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Browse Lessons Tab */}
        <TabsContent value="browse">
          {canManageLessons ? (
            <LessonsDataTable />
          ) : (
            <Card>
              <CardContent className="py-8 text-center">
                <BookOpen className="mx-auto mb-4 size-12 text-muted-foreground" />
                <h3 className="mb-2 text-lg font-medium">Access Restricted</h3>
                <p className="text-muted-foreground">
                  Only Teachers, Admins, and SuperAdmins can browse lesson
                  content.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Upload Tab */}
        <TabsContent value="upload">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="size-5" />
                Upload Lesson Content
              </CardTitle>
              <CardDescription>
                Choose your upload method and get started with lesson content
                management
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {canManageLessons ? (
                <div className="grid gap-4 md:grid-cols-2">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">
                        Individual Upload
                      </CardTitle>
                      <CardDescription>
                        Upload files one by one with dependency management
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Link href="/dashboard/superadmin/lessons/upload">
                        <Button className="w-full" size="lg">
                          <Upload className="mr-2 size-4" />
                          Start Individual Upload
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Bulk Upload</CardTitle>
                      <CardDescription>
                        Upload all lesson files at once for faster processing
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Link href="/dashboard/superadmin/lessons/upload/bulk">
                        <Button variant="outline" className="w-full" size="lg">
                          <Upload className="mr-2 size-4" />
                          Start Bulk Upload
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                </div>
              ) : (
                <div className="py-8 text-center">
                  <Upload className="mx-auto mb-4 size-12 text-muted-foreground" />
                  <h3 className="mb-2 text-lg font-medium">
                    Upload Restricted
                  </h3>
                  <p className="text-muted-foreground">
                    Only Teachers, Admins, and SuperAdmins can upload lesson
                    content.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Trash Tab */}
        <TabsContent value="trash">
          <Card>
            <CardContent className="py-8 text-center">
              <Trash2 className="mx-auto mb-4 size-12 text-muted-foreground" />
              <h3 className="mb-2 text-lg font-medium">Trash Management</h3>
              <p className="mb-4 text-muted-foreground">
                View and manage trashed lessons. Coming soon.
              </p>
              <Button variant="outline" disabled>
                Coming Soon
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
