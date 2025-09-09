"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { DashboardHeader } from "@/components/dashboard/header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Plus, 
  Search, 
  Filter, 
  Upload, 
  Eye, 
  Trash2, 
  BookOpen,
  AlertCircle,
  FileText
} from "lucide-react";
import { 
  getLessons, 
  trashLesson,
  type Lesson, 
  type ClassInfo, 
  type SubjectInfo 
} from "@/lib/api/lesson-service";
// Note: metadata cannot be exported from client components

interface FilterState {
  search: string;
  classId: string;
  subjectId: string;
}

export default function LessonsPage() {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [classes, setClasses] = useState<ClassInfo[]>([]);
  const [subjects, setSubjects] = useState<SubjectInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    classId: '',
    subjectId: ''
  });

  // Fetch lessons data
  const fetchLessons = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const classId = filters.classId ? parseInt(filters.classId) : undefined;
      const subjectId = filters.subjectId ? parseInt(filters.subjectId) : undefined;
      
      const response = await getLessons(classId, subjectId);
      
      if (response.success) {
        setLessons(response.content.lessons || []);
        setClasses(response.content.classes || []);
        setSubjects(response.content.subjects || []);
      } else {
        setError(response.message || "Failed to fetch lessons");
      }
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || "Failed to fetch lessons");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLessons();
  }, [filters.classId, filters.subjectId]);

  // Filter lessons based on search term
  const filteredLessons = lessons.filter(lesson => 
    lesson.topic.toLowerCase().includes(filters.search.toLowerCase()) ||
    lesson.class.toLowerCase().includes(filters.search.toLowerCase()) ||
    lesson.subject.toLowerCase().includes(filters.search.toLowerCase())
  );

  // Handle lesson deletion
  const handleTrashLesson = async (lessonId: number, lessonTopic: string) => {
    if (!confirm(`Are you sure you want to move "${lessonTopic}" to trash?`)) {
      return;
    }

    try {
      const response = await trashLesson(lessonId);
      
      if (response.success) {
        toast.success(response.message || "Lesson moved to trash successfully");
        // Remove from current list
        setLessons(prev => prev.filter(lesson => lesson.id !== lessonId));
      } else {
        toast.error(response.message || "Failed to move lesson to trash");
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || err.message || "Failed to move lesson to trash");
    }
  };

  // Parse JSON fields safely
  const parseJSON = (jsonString: string) => {
    try {
      return JSON.parse(jsonString);
    } catch {
      return null;
    }
  };

  return (
    <>
      <DashboardHeader
        heading="Lessons Management"
        text="Manage and organize lesson content for FastLearners platform"
      />

      <div className="space-y-6">
        {/* Actions Bar */}
        <div className="flex flex-col justify-between gap-4 sm:flex-row">
          <div className="flex flex-1 flex-col gap-3 sm:flex-row">
            {/* Search Input */}
            <div className="relative max-w-sm flex-1">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search lessons..."
                value={filters.search}
                onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                className="pl-10"
              />
            </div>

            {/* Class Filter */}
            <Select 
              value={filters.classId} 
              onValueChange={(value) => setFilters(prev => ({ ...prev, classId: value }))}
            >
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Class" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Classes</SelectItem>
                {classes.map(cls => (
                  <SelectItem key={cls.id} value={cls.id.toString()}>
                    {cls.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Subject Filter */}
            <Select 
              value={filters.subjectId} 
              onValueChange={(value) => setFilters(prev => ({ ...prev, subjectId: value }))}
            >
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Subject" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Subjects</SelectItem>
                {subjects.map(subject => (
                  <SelectItem key={subject.id} value={subject.id.toString()}>
                    {subject.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <Link href="/dashboard/teacher/lessons/upload">
              <Button>
                <Upload className="mr-2 size-4" />
                Upload Lessons
              </Button>
            </Link>
            <Link href="/dashboard/teacher/lessons/trash">
              <Button variant="outline">
                <Trash2 className="mr-2 size-4" />
                Trash
              </Button>
            </Link>
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
                  <div key={i} className="flex items-center justify-between rounded border p-4">
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-48" />
                      <Skeleton className="h-3 w-32" />
                    </div>
                    <div className="flex gap-2">
                      <Skeleton className="h-8 w-16" />
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
                <BookOpen className="size-6 text-muted-foreground" />
              </div>
              <CardTitle>No lessons found</CardTitle>
              <CardDescription>
                {lessons.length === 0 
                  ? "Get started by uploading your first lesson"
                  : "No lessons match your current filters"
                }
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              {lessons.length === 0 && (
                <Link href="/dashboard/teacher/lessons/upload">
                  <Button>
                    <Plus className="mr-2 size-4" />
                    Upload First Lesson
                  </Button>
                </Link>
              )}
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>
                Lessons ({filteredLessons.length})
              </CardTitle>
              <CardDescription>
                Manage your lesson content and materials
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
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredLessons.map((lesson) => {
                    const objectives = parseJSON(lesson.objectives);
                    const keyConceptsCount = Object.keys(parseJSON(lesson.key_concepts) || {}).length;
                    
                    return (
                      <TableRow key={lesson.id}>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="font-medium">{lesson.topic}</div>
                            {objectives && objectives.length > 0 && (
                              <div className="text-xs text-muted-foreground">
                                {objectives[0]?.points?.length || 0} objectives
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{lesson.class}</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="max-w-32 truncate" title={lesson.subject}>
                            {lesson.subject}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary">{lesson.term}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">Week {lesson.week}</Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Link href={`/dashboard/teacher/lessons/${lesson.id}`}>
                              <Button variant="outline" size="sm">
                                <Eye className="mr-1 size-3" />
                                View
                              </Button>
                            </Link>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleTrashLesson(lesson.id, lesson.topic)}
                            >
                              <Trash2 className="mr-1 size-3" />
                              Trash
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}
      </div>
    </>
  );
}
