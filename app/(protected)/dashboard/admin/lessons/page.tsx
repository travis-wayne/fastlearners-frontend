"use client";

import { useState } from "react";
import { BookOpen, Eye, Search } from "lucide-react";

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
import { HorizontalScroll } from "@/components/shared/horizontal-scroll";
import { DashboardHeader } from "@/components/dashboard/header";
import { LessonFilters } from "@/components/lessons/LessonFilters";
import { LessonsList } from "@/components/lessons/LessonsList";
import { LessonViewer } from "@/components/lessons/LessonViewer";

export default function AdminLessonsPage() {
  const { hasPermission } = usePermissionCheck();
  const canViewLessons = hasPermission("view_lessons");
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedLessonId, setSelectedLessonId] = useState<number | null>(null);
  const [lessonViewMode, setLessonViewMode] = useState<"list" | "viewer">(
    "list",
  );

  const handleLessonSelect = (lessonId: number) => {
    setSelectedLessonId(lessonId);
    setLessonViewMode("viewer");
  };

  const handleBackToList = () => {
    setSelectedLessonId(null);
    setLessonViewMode("list");
  };

  return (
    <div className="space-y-6">
      <DashboardHeader
        heading="Lesson Management"
        text="Browse and view lesson content for FastLeaners"
      />

      {/* Tabbed Interface */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <HorizontalScroll className="block">
          <TabsList className="grid min-w-full grid-cols-2">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <BookOpen className="size-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="browse" className="flex items-center gap-2">
              <Eye className="size-4" />
              Browse Lessons
            </TabsTrigger>
          </TabsList>
        </HorizontalScroll>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {/* Quick Actions */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
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
                <Eye className="size-8 text-purple-600" />
                <div className="ml-4">
                  <h3 className="text-lg font-medium">Preview</h3>
                  <p className="text-sm text-muted-foreground">
                    View lesson content
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Actions */}
          <div className="grid gap-6 md:grid-cols-2">
            {/* Browse Lessons */}
            <Card className="relative">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="size-5 text-blue-600" />
                  Browse & View Lessons
                </CardTitle>
                <CardDescription>
                  View and search lesson content across all classes and subjects
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Available Actions:</h4>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>• View all lessons with filtering</li>
                    <li>• Search by topic, class, subject</li>
                    <li>• Preview lesson content</li>
                    <li>• View exercises and examples</li>
                  </ul>
                </div>

                <div className="pt-2">
                  {canViewLessons ? (
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
                      Access Restricted
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Search & Filter */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Search className="size-5 text-green-600" />
                  Advanced Search
                </CardTitle>
                <CardDescription>
                  Find specific lessons using advanced filtering options
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Search Options:</h4>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>• Filter by class level</li>
                    <li>• Search by subject area</li>
                    <li>• Filter by term and week</li>
                    <li>• Full-text topic search</li>
                  </ul>
                </div>

                <div className="pt-2">
                  <Button
                    variant="outline"
                    className="w-full"
                    size="lg"
                    onClick={() => setActiveTab("browse")}
                  >
                    <Search className="mr-2 size-4" />
                    Start Searching
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Information Panel */}
          <Card>
            <CardHeader>
              <CardTitle>Admin Access Level</CardTitle>
              <CardDescription>
                Your permissions and available actions as an Admin user
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <h4 className="mb-3 font-medium text-green-600">
                    ✓ Allowed Actions:
                  </h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <span className="text-green-600">•</span>
                      <span>Browse all lesson content</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-600">•</span>
                      <span>Search and filter lessons</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-600">•</span>
                      <span>View detailed lesson content</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-600">•</span>
                      <span>Preview exercises and examples</span>
                    </li>
                  </ul>
                </div>

                <div>
                  <h4 className="mb-3 font-medium text-red-600">
                    ✗ Restricted Actions:
                  </h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <span className="text-red-600">•</span>
                      <span>Upload new lesson content</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-600">•</span>
                      <span>Edit or delete lessons</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-600">•</span>
                      <span>Manage lesson structure</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-600">•</span>
                      <span>Access system configuration</span>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Browse Lessons Tab */}
        <TabsContent value="browse">
          {canViewLessons ? (
            <div className="space-y-6">
              {lessonViewMode === "viewer" && selectedLessonId ? (
                <LessonViewer
                  lessonId={selectedLessonId}
                  onBack={handleBackToList}
                  autoLoad={true}
                />
              ) : (
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
                  {/* Filters Sidebar */}
                  <div className="lg:col-span-1">
                    <div className="sticky top-6">
                      <LessonFilters showTitle={true} compact={false} />
                    </div>
                  </div>

                  {/* Lessons List */}
                  <div className="lg:col-span-3">
                    <LessonsList
                      onLessonSelect={handleLessonSelect}
                      showPagination={true}
                      compact={false}
                    />
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Card>
              <CardContent className="py-8 text-center">
                <BookOpen className="mx-auto mb-4 size-12 text-muted-foreground" />
                <h3 className="mb-2 text-lg font-medium">Access Restricted</h3>
                <p className="text-muted-foreground">
                  You don&apos;t have permission to browse lesson content.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
