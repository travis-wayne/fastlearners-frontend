"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  BookOpen,
  Filter,
  Search,
  Target,
  TrendingUp,
} from "lucide-react";

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
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  const [searchQuery, setSearchQuery] = useState("");

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
    setSearchQuery("");
    if (metadata) {
      setSelectedClass(metadata.classes?.[0]?.id?.toString() || "");
      setSelectedSubject(metadata.subjects?.[0]?.id?.toString() || "");
      setSelectedTerm(metadata.terms?.[0]?.id?.toString() || "");
      setSelectedWeek(metadata.weeks?.[0]?.id?.toString() || "");
    }
    setLessons([]);
    setError(null);
  };

  const filteredLessons = useMemo(() => {
    if (!searchQuery) return lessons;
    const q = searchQuery.toLowerCase();
    return lessons.filter((l) =>
      [l.topic, l.class, l.subject, l.term].some((v) =>
        v?.toLowerCase?.().includes(q),
      ),
    );
  }, [lessons, searchQuery]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
  };
  const itemVariants = {
    hidden: { y: 12, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="container mx-auto space-y-6 p-4 md:p-6"
    >
      <motion.div variants={itemVariants} className="flex items-center gap-4">
        <Link href="/dashboard/superadmin">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-2 size-4" /> Back to Dashboard
          </Button>
        </Link>
        <DashboardHeader
          heading="Browse Lessons"
          text="Search and view all lesson content"
        />
      </motion.div>

      {/* Stats */}
      <motion.div variants={itemVariants}>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <BookOpen className="size-4 text-blue-600" />
                <span className="text-sm text-muted-foreground">Results</span>
              </div>
              <p className="mt-1 text-2xl font-bold">
                {filteredLessons.length}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Target className="size-4 text-green-600" />
                <span className="text-sm text-muted-foreground">
                  Selected Subject
                </span>
              </div>
              <p className="mt-1 text-2xl font-bold">
                {metadata?.subjects?.find(
                  (s) => s.id.toString() === selectedSubject,
                )?.name || "-"}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <TrendingUp className="size-4 text-purple-600" />
                <span className="text-sm text-muted-foreground">
                  Term • Week
                </span>
              </div>
              <p className="mt-1 text-2xl font-bold">
                {metadata?.terms?.find((t) => t.id.toString() === selectedTerm)
                  ?.name || "-"}{" "}
                •{" "}
                {metadata?.weeks?.find((w) => w.id.toString() === selectedWeek)
                  ?.name || "-"}
              </p>
            </CardContent>
          </Card>
        </div>
      </motion.div>

      {/* Search + Filters */}
      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="size-5" />
              Filter Lessons
            </CardTitle>
            <CardDescription>
              Select class, subject, term and week to find lessons
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col gap-4 md:flex-row">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search lessons..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex gap-2">
                <Button onClick={onSearch} disabled={loading}>
                  {loading ? "Searching..." : "Search"}
                </Button>
                <Button variant="outline" onClick={clearFilters}>
                  Clear
                </Button>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Class</label>
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
              <div className="space-y-2">
                <label className="text-sm font-medium">Subject</label>
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
              <div className="space-y-2">
                <label className="text-sm font-medium">Term</label>
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
              <div className="space-y-2">
                <label className="text-sm font-medium">Week</label>
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
              <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-800">
                {error}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Results */}
      <motion.div variants={itemVariants}>
        <Tabs defaultValue="all" className="space-y-4">
          <TabsList className="grid w-full grid-cols-1 md:grid-cols-3">
            <TabsTrigger value="all">
              All Results ({filteredLessons.length})
            </TabsTrigger>
            <TabsTrigger value="by-subject">Group by Subject</TabsTrigger>
            <TabsTrigger value="by-week">Group by Week</TabsTrigger>
          </TabsList>

          <TabsContent value="all">
            {filteredLessons.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <BookOpen className="mx-auto mb-4 size-12 text-muted-foreground" />
                  <h3 className="mb-2 text-lg font-semibold">
                    No lessons found
                  </h3>
                  <p className="text-muted-foreground">
                    Try different filter combinations to find lessons.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {filteredLessons.map((lesson) => (
                  <Card
                    key={lesson.id}
                    className="transition-shadow hover:shadow-md"
                  >
                    <CardHeader>
                      <CardTitle className="text-lg">{lesson.topic}</CardTitle>
                      <CardDescription>
                        {lesson.class} • {lesson.subject} • {lesson.term} • Week{" "}
                        {lesson.week}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="flex justify-between gap-2">
                      <Link href={`/dashboard/superadmin/lessons/${lesson.id}`}>
                        <Button size="sm">Open</Button>
                      </Link>
                      <Link
                        href={`/dashboard/superadmin/lessons/${lesson.id}/content`}
                      >
                        <Button size="sm" variant="outline">
                          Content
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="by-subject">
            {Object.entries(
              filteredLessons.reduce(
                (acc: Record<string, typeof filteredLessons>, l) => {
                  (acc[l.subject] ||= []).push(l);
                  return acc;
                },
                {},
              ),
            ).map(([subject, items]) => (
              <div key={subject} className="mb-6 space-y-3">
                <h3 className="text-sm font-semibold text-muted-foreground">
                  {subject}
                </h3>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {items.map((lesson) => (
                    <Card
                      key={lesson.id}
                      className="transition-shadow hover:shadow-md"
                    >
                      <CardHeader>
                        <CardTitle className="text-lg">
                          {lesson.topic}
                        </CardTitle>
                        <CardDescription>
                          {lesson.class} • {lesson.term} • Week {lesson.week}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="flex justify-between gap-2">
                        <Link
                          href={`/dashboard/superadmin/lessons/${lesson.id}`}
                        >
                          <Button size="sm">Open</Button>
                        </Link>
                        <Link
                          href={`/dashboard/superadmin/lessons/${lesson.id}/content`}
                        >
                          <Button size="sm" variant="outline">
                            Content
                          </Button>
                        </Link>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
          </TabsContent>

          <TabsContent value="by-week">
            {Object.entries(
              filteredLessons.reduce(
                (acc: Record<string, typeof filteredLessons>, l) => {
                  const key = `Week ${l.week}`;
                  (acc[key] ||= []).push(l);
                  return acc;
                },
                {},
              ),
            ).map(([week, items]) => (
              <div key={week} className="mb-6 space-y-3">
                <h3 className="text-sm font-semibold text-muted-foreground">
                  {week}
                </h3>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {items.map((lesson) => (
                    <Card
                      key={lesson.id}
                      className="transition-shadow hover:shadow-md"
                    >
                      <CardHeader>
                        <CardTitle className="text-lg">
                          {lesson.topic}
                        </CardTitle>
                        <CardDescription>
                          {lesson.class} • {lesson.subject} • {lesson.term}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="flex justify-between gap-2">
                        <Link
                          href={`/dashboard/superadmin/lessons/${lesson.id}`}
                        >
                          <Button size="sm">Open</Button>
                        </Link>
                        <Link
                          href={`/dashboard/superadmin/lessons/${lesson.id}/content`}
                        >
                          <Button size="sm" variant="outline">
                            Content
                          </Button>
                        </Link>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
          </TabsContent>
        </Tabs>
      </motion.div>
    </motion.div>
  );
}
