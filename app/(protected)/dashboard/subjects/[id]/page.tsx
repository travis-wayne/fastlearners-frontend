"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Award,
  BookOpen,
  Calendar,
  CheckCircle,
  Circle,
  Clock,
  Download,
  FileText,
  PlayCircle,
  Share2,
  Target,
  TrendingUp,
} from "lucide-react";

import { getSubjectById } from "@/config/education";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AcademicSelector } from "@/components/dashboard/student/shared/academic-selector";
import {
  useAcademicContext,
  useAcademicDisplay,
} from "@/components/providers/academic-context";
import { getStudentSubjects } from "@/lib/api/subjects";
import { Loader2 } from "lucide-react";

interface SubjectDetailData {
  id: number;
  name: string;
  progress: number;
  grade: string;
  caScore: number;
  currentWeek: number;
  totalWeeks: number;
  upcomingAssessments: number;
  schemeOfWork: Array<{
    week: number;
    topics: string[];
    objectives: string[];
    activities: string[];
    resources: string[];
    assessment: string;
  }>;
}

export default function SubjectDetailPage() {
  const params = useParams();
  const router = useRouter();
  const subjectId = params?.id as string;

  const { currentClass, currentTerm } = useAcademicContext();
  const { classDisplay, termDisplay } = useAcademicDisplay();

  const [subjectDetail, setSubjectDetail] = useState<SubjectDetailData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);

  const subject = getSubjectById(subjectId);

  // Validate subject is registered and fetch data
  useEffect(() => {
    const fetchSubjectData = async () => {
      if (!subjectId) {
        setError("Subject ID is required");
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        // First, validate subject is registered
        const subjectsResponse = await getStudentSubjects();
        if (!subjectsResponse.success || !subjectsResponse.content) {
          setIsAuthorized(false);
          setIsLoading(false);
          return;
        }

        const allSubjects = [
          ...(subjectsResponse.content.compulsory_selective || []),
          ...(subjectsResponse.content.subjects || []),
          ...(subjectsResponse.content.selective || []),
        ];

        const isRegistered = allSubjects.some((s: any) => String(s.id) === subjectId);
        
        if (!isRegistered) {
          setIsAuthorized(false);
          setIsLoading(false);
          return;
        }

        setIsAuthorized(true);

        // Fetch subject detail
        const response = await fetch(`/api/subjects/${subjectId}`, {
          headers: {
            'Accept': 'application/json',
          },
          credentials: 'include',
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to fetch subject detail');
        }

        const result = await response.json();
        if (result.success && result.content) {
          setSubjectDetail(result.content);
        } else {
          throw new Error(result.message || 'Failed to fetch subject detail');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch subject data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchSubjectData();
  }, [subjectId]);

  // Use subject detail data or fallback to config subject
  const subjectProgress = subjectDetail ? {
    totalTopics: 12,
    completedTopics: Math.round((subjectDetail.progress / 100) * 12),
    currentWeek: subjectDetail.currentWeek,
    totalWeeks: subjectDetail.totalWeeks,
    upcomingAssessments: subjectDetail.upcomingAssessments,
    lastAccessed: "2 hours ago",
    termProgress: subjectDetail.progress,
    grade: subjectDetail.grade,
    caScore: subjectDetail.caScore,
  } : {
    totalTopics: 12,
    completedTopics: 8,
    currentWeek: 9,
    totalWeeks: 11,
    upcomingAssessments: 2,
    lastAccessed: "2 hours ago",
    termProgress: 75,
    grade: "B2",
    caScore: 82,
  };

  const schemeOfWork = subjectDetail?.schemeOfWork || [];

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardContent className="p-8 text-center">
            <Loader2 className="mx-auto mb-4 size-12 animate-spin text-primary" />
            <p className="text-muted-foreground">Loading subject details...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isAuthorized === false || (!subject && !subjectDetail)) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardContent className="p-8 text-center">
            <BookOpen className="mx-auto mb-4 size-12 text-muted-foreground" />
            <h3 className="mb-2 text-lg font-semibold">Subject Not Found or Unauthorized</h3>
            <p className="mb-4 text-muted-foreground">
              {isAuthorized === false
                ? "This subject is not registered or you don't have access to it."
                : "The subject you're looking for doesn't exist or isn't available."}
            </p>
            <div className="flex gap-2 justify-center">
              <Button onClick={() => router.push('/dashboard/subjects')} variant="outline">
                Go to Subjects
              </Button>
              <Button onClick={() => router.back()} variant="outline">
                <ArrowLeft className="mr-2 size-4" />
                Go Back
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardContent className="p-8 text-center">
            <BookOpen className="mx-auto mb-4 size-12 text-muted-foreground" />
            <h3 className="mb-2 text-lg font-semibold">Error Loading Subject</h3>
            <p className="mb-4 text-muted-foreground">{error}</p>
            <div className="flex gap-2 justify-center">
              <Button onClick={() => window.location.reload()} variant="outline">
                Retry
              </Button>
              <Button onClick={() => router.push('/dashboard/subjects')} variant="outline">
                Go to Subjects
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Use subjectDetail name if available, otherwise use config subject
  const displaySubject = subject || {
    id: subjectId,
    name: subjectDetail?.name || "Subject",
    code: subjectDetail?.name?.substring(0, 3).toUpperCase() || "SUB",
    description: subjectDetail?.name || "",
    icon: "bookOpen",
    color: "#6366f1",
    compulsory: true,
    levels: [],
  };

  if (!currentClass || !currentTerm) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardContent className="p-8 text-center">
            <Calendar className="mx-auto mb-4 size-12 text-muted-foreground" />
            <h3 className="mb-2 text-lg font-semibold">
              Select Class and Term
            </h3>
            <p className="mb-4 text-muted-foreground">
              Please select your class and term to view the scheme of work.
            </p>
            <AcademicSelector variant="default" />
          </CardContent>
        </Card>
      </div>
    );
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="container mx-auto space-y-6 p-6"
    >
      {/* Header */}
      <motion.div variants={itemVariants}>
        <div className="mb-4 flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="size-4" />
          </Button>
          <div className="flex-1">
            <div className="mb-2 flex items-center gap-3">
                <div
                  className="flex items-center justify-center rounded-lg p-2"
                  style={{ backgroundColor: `${displaySubject.color}20` }}
                >
                  <BookOpen className="size-5" style={{ color: displaySubject.color }} />
                </div>
              <div>
                <h1 className="text-2xl font-bold">{displaySubject.name}</h1>
                <p className="text-muted-foreground">{displaySubject.description}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>{classDisplay}</span>
              <Separator orientation="vertical" className="h-4" />
              <span>{termDisplay}</span>
              <Separator orientation="vertical" className="h-4" />
              <span>Code: {displaySubject.code}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <AcademicSelector variant="compact" />
            <Button variant="outline" size="sm">
              <Share2 className="mr-2 size-4" />
              Share
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Subject Overview Cards */}
      <motion.div variants={itemVariants}>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          <Card>
            <CardContent className="p-4">
              <div className="mb-2 flex items-center gap-2">
                <TrendingUp className="size-4 text-green-600" />
                <span className="text-sm text-muted-foreground">Progress</span>
              </div>
              <div className="space-y-2">
                <p className="text-2xl font-bold">
                  {subjectProgress.termProgress}%
                </p>
                <Progress
                  value={subjectProgress.termProgress}
                  className="h-2"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="mb-2 flex items-center gap-2">
                <Award className="size-4 text-blue-600" />
                <span className="text-sm text-muted-foreground">
                  Current Grade
                </span>
              </div>
              <p className="text-2xl font-bold">{subjectProgress.grade}</p>
              <p className="text-sm text-muted-foreground">
                CA: {subjectProgress.caScore}%
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="mb-2 flex items-center gap-2">
                <Calendar className="size-4 text-purple-600" />
                <span className="text-sm text-muted-foreground">
                  Current Week
                </span>
              </div>
              <p className="text-2xl font-bold">
                {subjectProgress.currentWeek}
              </p>
              <p className="text-sm text-muted-foreground">
                of {subjectProgress.totalWeeks} weeks
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="mb-2 flex items-center gap-2">
                <Target className="size-4 text-orange-600" />
                <span className="text-sm text-muted-foreground">
                  Assessments
                </span>
              </div>
              <p className="text-2xl font-bold">
                {subjectProgress.upcomingAssessments}
              </p>
              <p className="text-sm text-muted-foreground">upcoming</p>
            </CardContent>
          </Card>
        </div>
      </motion.div>

      {/* Main Content */}
      <motion.div variants={itemVariants}>
        <Tabs defaultValue="scheme" className="space-y-4">
          <TabsList>
            <TabsTrigger value="scheme">Scheme of Work</TabsTrigger>
            <TabsTrigger value="lessons">Lessons</TabsTrigger>
            <TabsTrigger value="assessments">Assessments</TabsTrigger>
            <TabsTrigger value="resources">Resources</TabsTrigger>
          </TabsList>

          <TabsContent value="scheme" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Scheme of Work</CardTitle>
                    <CardDescription>
                      {displaySubject.name} for {classDisplay} - {termDisplay}
                    </CardDescription>
                  </div>
                  <Button variant="outline" size="sm">
                    <Download className="mr-2 size-4" />
                    Download PDF
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {schemeOfWork.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <p>Scheme of work not available for this subject.</p>
                  </div>
                ) : (
                  <Accordion type="single" collapsible className="space-y-2">
                    {schemeOfWork.map((week, index) => (
                    <AccordionItem
                      key={week.week}
                      value={`week-${week.week}`}
                    >
                      <AccordionTrigger className="hover:no-underline">
                        <div className="flex flex-1 items-center gap-4">
                          <div className="flex items-center gap-2">
                            {week.week <= subjectProgress.currentWeek ? (
                              <CheckCircle className="size-5 text-green-600" />
                            ) : (
                              <Circle className="size-5 text-muted-foreground" />
                            )}
                            <span className="font-semibold">
                              Week {week.week}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <span>{week.topics.join(", ")}</span>
                          </div>
                          {week.week === subjectProgress.currentWeek && (
                            <Badge variant="default" className="ml-auto">
                              Current
                            </Badge>
                          )}
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="pt-4">
                        <div className="grid gap-6 md:grid-cols-2">
                          <div className="space-y-4">
                            <div>
                              <h4 className="mb-2 flex items-center gap-2 font-semibold">
                                <BookOpen className="size-4" />
                                Topics
                              </h4>
                              <ul className="space-y-1">
                                {week.topics.map((topic, i) => (
                                  <li
                                    key={i}
                                    className="flex items-center gap-2 text-sm text-muted-foreground"
                                  >
                                    <div className="size-1.5 rounded-full bg-current opacity-60" />
                                    {topic}
                                  </li>
                                ))}
                              </ul>
                            </div>
                            <div>
                              <h4 className="mb-2 flex items-center gap-2 font-semibold">
                                <Target className="size-4" />
                                Learning Objectives
                              </h4>
                              <ul className="space-y-1">
                                {week.objectives.map((objective, i) => (
                                  <li
                                    key={i}
                                    className="flex items-center gap-2 text-sm text-muted-foreground"
                                  >
                                    <div className="size-1.5 rounded-full bg-current opacity-60" />
                                    {objective}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                          <div className="space-y-4">
                            <div>
                              <h4 className="mb-2 flex items-center gap-2 font-semibold">
                                <PlayCircle className="size-4" />
                                Activities
                              </h4>
                              <ul className="space-y-1">
                                {week.activities.map((activity, i) => (
                                  <li
                                    key={i}
                                    className="flex items-center gap-2 text-sm text-muted-foreground"
                                  >
                                    <div className="size-1.5 rounded-full bg-current opacity-60" />
                                    {activity}
                                  </li>
                                ))}
                              </ul>
                            </div>
                            <div>
                              <h4 className="mb-2 flex items-center gap-2 font-semibold">
                                <FileText className="size-4" />
                                Resources
                              </h4>
                              <ul className="space-y-1">
                                {week.resources.map((resource, i) => (
                                  <li
                                    key={i}
                                    className="flex items-center gap-2 text-sm text-muted-foreground"
                                  >
                                    <div className="size-1.5 rounded-full bg-current opacity-60" />
                                    {resource}
                                  </li>
                                ))}
                              </ul>
                            </div>
                            <div>
                              <h4 className="mb-2 flex items-center gap-2 font-semibold">
                                <Award className="size-4" />
                                Assessment
                              </h4>
                              <p className="text-sm text-muted-foreground">
                                {week.assessment}
                              </p>
                            </div>
                          </div>
                        </div>
                        {week.week <= subjectProgress.currentWeek && (
                          <div className="mt-6 border-t pt-4">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2 text-sm text-green-600">
                                <CheckCircle className="size-4" />
                                <span>Week completed</span>
                              </div>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() =>
                                  router.push(
                                    `/dashboard/lessons?subjectId=${subjectId}`
                                  )
                                }
                              >
                                View Lessons
                              </Button>
                            </div>
                          </div>
                        )}
                        {week.week === subjectProgress.currentWeek && (
                          <div className="mt-6 border-t pt-4">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2 text-sm text-blue-600">
                                <Clock className="size-4" />
                                <span>Currently studying this week</span>
                              </div>
                              <div className="flex gap-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() =>
                                    router.push(
                                      `/dashboard/lessons?subjectId=${subjectId}`
                                    )
                                  }
                                >
                                  Continue Lesson
                                </Button>
                                <Button size="sm">Take Quiz</Button>
                              </div>
                            </div>
                          </div>
                        )}
                      </AccordionContent>
                    </AccordionItem>
                    ))}
                  </Accordion>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="lessons" className="space-y-4">
            <Card>
              <CardContent className="p-8 text-center">
                <PlayCircle className="mx-auto mb-4 size-12 text-muted-foreground" />
                <h3 className="mb-2 text-lg font-semibold">
                  Lessons
                </h3>
                <p className="mb-4 text-muted-foreground">
                  View interactive lessons for {displaySubject.name}.
                </p>
                <Button
                  onClick={() =>
                    router.push(`/dashboard/lessons?subjectId=${subjectId}`)
                  }
                >
                  View Lessons
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="assessments" className="space-y-4">
            <Card>
              <CardContent className="p-8 text-center">
                <Award className="mx-auto mb-4 size-12 text-muted-foreground" />
                <h3 className="mb-2 text-lg font-semibold">
                  Assessments Coming Soon
                </h3>
                <p className="text-muted-foreground">
                  Quizzes and assessments for {displaySubject.name} will be available
                  soon.
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="resources" className="space-y-4">
            <Card>
              <CardContent className="p-8 text-center">
                <FileText className="mx-auto mb-4 size-12 text-muted-foreground" />
                <h3 className="mb-2 text-lg font-semibold">
                  Resources Coming Soon
                </h3>
                <p className="text-muted-foreground">
                  Additional resources and materials for {displaySubject.name} will be
                  available soon.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>
    </motion.div>
  );
}

