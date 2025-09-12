"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  AlertCircle,
  Archive,
  ArrowLeft,
  FileX,
  RotateCcw,
  Search,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";

import { getTrashedLessons, type Lesson } from "@/lib/api/lesson-service";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DashboardHeader } from "@/components/dashboard/header";

// Note: metadata cannot be exported from client components

export default function LessonTrashPage() {
  const [trashedLessons, setTrashedLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch trashed lessons
  const fetchTrashedLessons = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await getTrashedLessons();

      if (response.success) {
        setTrashedLessons(response.content || []);
      } else {
        setError(response.message || "Failed to fetch trashed lessons");
      }
    } catch (err: any) {
      // Handle the case where the endpoint doesn't exist yet
      if (err.response?.status === 404) {
        setError(
          "Trash functionality is not yet available. The API endpoint needs to be implemented.",
        );
      } else {
        setError(
          err.response?.data?.message ||
            err.message ||
            "Failed to fetch trashed lessons",
        );
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrashedLessons();
  }, []);

  // Filter lessons based on search term
  const filteredLessons = trashedLessons.filter(
    (lesson) =>
      lesson.topic.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lesson.class.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lesson.subject.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  // Handle lesson restoration (placeholder - API endpoint not available yet)
  const handleRestoreLesson = async (lessonId: number, lessonTopic: string) => {
    toast.info(
      `Restore functionality for "${lessonTopic}" is not yet implemented. The API endpoint needs to be created.`,
    );
  };

  // Handle permanent deletion (placeholder - API endpoint not available yet)
  const handlePermanentDelete = async (
    lessonId: number,
    lessonTopic: string,
  ) => {
    if (
      !confirm(
        `Are you sure you want to permanently delete "${lessonTopic}"? This action cannot be undone.`,
      )
    ) {
      return;
    }

    toast.info(
      `Permanent delete functionality for "${lessonTopic}" is not yet implemented. The API endpoint needs to be created.`,
    );
  };

  return (
    <>
      <DashboardHeader
        heading="Lesson Trash"
        text="Manage trashed lessons and restore content when needed"
      />

      <div className="space-y-6">
        {/* Actions Bar */}
        <div className="flex flex-col justify-between gap-4 sm:flex-row">
          <div className="flex items-center gap-3">
            <Link href="/dashboard/teacher/lessons">
              <Button variant="outline">
                <ArrowLeft className="mr-2 size-4" />
                Back to Lessons
              </Button>
            </Link>

            {/* Search Input */}
            <div className="relative max-w-sm flex-1">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search trashed lessons..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Info */}
          <div className="text-sm text-muted-foreground">
            {trashedLessons.length} item{trashedLessons.length !== 1 ? "s" : ""}{" "}
            in trash
          </div>
        </div>

        {/* Content Area */}
        {loading ? (
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-4 w-64" />
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between rounded border p-4"
                  >
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-48" />
                      <Skeleton className="h-3 w-32" />
                    </div>
                    <div className="flex gap-2">
                      <Skeleton className="h-8 w-20" />
                      <Skeleton className="h-8 w-16" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ) : error ? (
          <Alert variant="destructive">
            <AlertCircle className="size-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ) : filteredLessons.length === 0 ? (
          <Card>
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full bg-muted">
                {trashedLessons.length === 0 ? (
                  <Archive className="size-6 text-muted-foreground" />
                ) : (
                  <FileX className="size-6 text-muted-foreground" />
                )}
              </div>
              <CardTitle>
                {trashedLessons.length === 0
                  ? "Trash is empty"
                  : "No matching lessons"}
              </CardTitle>
              <CardDescription>
                {trashedLessons.length === 0
                  ? "No lessons have been moved to trash"
                  : "No trashed lessons match your search criteria"}
              </CardDescription>
            </CardHeader>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Trashed Lessons ({filteredLessons.length})</CardTitle>
              <CardDescription>
                Lessons that have been moved to trash. You can restore or
                permanently delete them.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Topic</TableHead>
                    <TableHead>Class</TableHead>
                    <TableHead>Subject</TableHead>
                    <TableHead>Term</TableHead>
                    <TableHead>Week</TableHead>
                    <TableHead>Deleted Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredLessons.map((lesson) => (
                    <TableRow key={lesson.id}>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="font-medium text-muted-foreground">
                            {lesson.topic}
                          </div>
                          <Badge variant="destructive" className="text-xs">
                            Trashed
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{lesson.class}</Badge>
                      </TableCell>
                      <TableCell>
                        <div
                          className="max-w-32 truncate"
                          title={lesson.subject}
                        >
                          {lesson.subject}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">{lesson.term}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">Week {lesson.week}</Badge>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-muted-foreground">
                          {lesson.updated_at
                            ? new Date(lesson.updated_at).toLocaleDateString()
                            : "Unknown"}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              handleRestoreLesson(lesson.id, lesson.topic)
                            }
                          >
                            <RotateCcw className="mr-1 size-3" />
                            Restore
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() =>
                              handlePermanentDelete(lesson.id, lesson.topic)
                            }
                          >
                            <Trash2 className="mr-1 size-3" />
                            Delete
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}

        {/* Information Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="size-5" />
              Trash Management Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <h4 className="mb-2 font-medium">About Trashed Lessons:</h4>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>• Lessons moved to trash are not permanently deleted</li>
                  <li>• You can restore trashed lessons at any time</li>
                  <li>• Trashed lessons are not visible to students</li>
                  <li>
                    • Use &quot;Restore&quot; to move lessons back to active
                    status
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="mb-2 font-medium">Permanent Deletion:</h4>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>• Permanently deleted lessons cannot be recovered</li>
                  <li>• This action will remove all associated content</li>
                  <li>• Consider downloading backups before deletion</li>
                  <li>• Use this option only when certain</li>
                </ul>
              </div>
            </div>

            <Alert className="mt-4">
              <AlertCircle className="size-4" />
              <AlertDescription>
                <strong>Note:</strong> The trash functionality is currently in
                development. Restore and permanent delete features will be
                available once the corresponding API endpoints are implemented.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
