"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import {
  getLessonsMetadata,
  getLessons,
  getErrorMessage,
  type LessonsListResponse,
  type MetadataResponse,
} from "@/lib/api/superadmin-lessons";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DashboardHeader } from "@/components/dashboard/header";

export default function BrowseLessonsPage() {
  const [metadata, setMetadata] = useState<MetadataResponse | null>(null);
  const [lessons, setLessons] = useState<LessonsListResponse["lessons"]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [selectedClass, setSelectedClass] = useState<string>("");
  const [selectedSubject, setSelectedSubject] = useState<string>("");
  const [selectedTerm, setSelectedTerm] = useState<string>("");
  const [selectedWeek, setSelectedWeek] = useState<string>("");

  useEffect(() => {
    (async () => {
      try {
        const res = await getLessonsMetadata();
        if (res.success && res.content) {
          setMetadata(res.content);
          const m = res.content;
          setSelectedClass(m.classes?.[0]?.id?.toString() || "");
          setSelectedSubject(m.subjects?.[0]?.id?.toString() || "");
          setSelectedTerm(m.terms?.[0]?.id?.toString() || "");
          setSelectedWeek(m.weeks?.[0]?.id?.toString() || "");
        } else {
          setError(res.message || "Failed to load metadata");
        }
      } catch (e: any) {
        setError(getErrorMessage(e));
      }
    })();
  }, []);

  const onSearch = async () => {
    if (!selectedClass || !selectedSubject || !selectedTerm || !selectedWeek) {
      setError("Please select class, subject, term and week");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await getLessons({
        class: selectedClass,
        subject: selectedSubject,
        term: selectedTerm,
        week: selectedWeek,
      });
      if (res.success && res.content) {
        setLessons(res.content.lessons || []);
      } else if (res.success && res.content === null) {
        setLessons([]);
      } else {
        setError(res.message || "Failed to fetch lessons");
        setLessons([]);
      }
    } catch (e: any) {
      setError(getErrorMessage(e));
      setLessons([]);
    } finally {
      setLoading(false);
    }
  };

  const clearFilters = () => {
    if (metadata) {
      setSelectedClass(metadata.classes?.[0]?.id?.toString() || "");
      setSelectedSubject(metadata.subjects?.[0]?.id?.toString() || "");
      setSelectedTerm(metadata.terms?.[0]?.id?.toString() || "");
      setSelectedWeek(metadata.weeks?.[0]?.id?.toString() || "");
    }
    setLessons([]);
    setError(null);
  };

  return (
    <div className="container mx-auto space-y-6 p-4 md:p-6">
      <div className="flex items-center justify-between gap-4">
        <DashboardHeader
          heading="Browse Lessons"
          text="Filter and open uploaded lessons."
        />
        <Link href="/dashboard/superadmin/lessons">
          <Button variant="outline" size="sm">
            Back to Lessons
          </Button>
        </Link>
        </div>

      {/* Filters */}
        <Card>
          <CardHeader>
          <CardTitle>Query lessons</CardTitle>
            <CardDescription>
            Select class, subject, term and week, then click fetch to load
            lessons.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2">
                <Button onClick={onSearch} disabled={loading}>
              {loading ? "Fetching lessons..." : "Fetch lessons"}
                </Button>
                <Button variant="outline" onClick={clearFilters}>
              Reset
                </Button>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-1">
              <p className="text-sm font-medium">Class</p>
                <Select value={selectedClass} onValueChange={setSelectedClass}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select class" />
                  </SelectTrigger>
                  <SelectContent>
                    {metadata?.classes?.map((c) => (
                      <SelectItem key={c.id} value={c.id.toString()}>
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            <div className="space-y-1">
              <p className="text-sm font-medium">Subject</p>
                <Select
                  value={selectedSubject}
                  onValueChange={setSelectedSubject}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select subject" />
                  </SelectTrigger>
                  <SelectContent>
                    {metadata?.subjects?.map((s) => (
                      <SelectItem key={s.id} value={s.id.toString()}>
                        {s.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            <div className="space-y-1">
              <p className="text-sm font-medium">Term</p>
                <Select value={selectedTerm} onValueChange={setSelectedTerm}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select term" />
                  </SelectTrigger>
                  <SelectContent>
                    {metadata?.terms?.map((t) => (
                      <SelectItem key={t.id} value={t.id.toString()}>
                        {t.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            <div className="space-y-1">
              <p className="text-sm font-medium">Week</p>
                <Select value={selectedWeek} onValueChange={setSelectedWeek}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select week" />
                  </SelectTrigger>
                  <SelectContent>
                    {metadata?.weeks?.map((w) => (
                      <SelectItem key={w.id} value={w.id.toString()}>
                        Week {w.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {error && (
            <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-800">
                {error}
              </div>
            )}
          </CardContent>
        </Card>

      {/* Results */}
              <Card>
        <CardHeader>
          <CardTitle>Results</CardTitle>
          <CardDescription>
            {lessons.length} lesson
            {lessons.length === 1 ? "" : "s"} found.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {lessons.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No lessons to show yet. Select class, subject, term and week, then
              click &quot;Fetch lessons&quot;.
                  </p>
            ) : (
            <div className="space-y-3">
              {lessons.map((lesson) => (
                <div
                    key={lesson.id}
                  className="flex items-center justify-between gap-3 rounded-md border p-3 text-sm"
                  >
                  <div>
                    <p className="font-medium">{lesson.topic}</p>
                    <p className="text-xs text-muted-foreground">
                        {lesson.class} • {lesson.subject} • {lesson.term} • Week{" "}
                        {lesson.week}
                    </p>
                  </div>
                  <div className="flex gap-2">
                      <Link href={`/dashboard/superadmin/lessons/${lesson.id}`}>
                      <Button size="sm" variant="outline">
                        Details
                      </Button>
                      </Link>
                      <Link
                        href={`/dashboard/superadmin/lessons/${lesson.id}/content`}
                      >
                      <Button size="sm">Content</Button>
                      </Link>
              </div>
                </div>
              ))}
              </div>
          )}
                      </CardContent>
                    </Card>
              </div>
  );
}


