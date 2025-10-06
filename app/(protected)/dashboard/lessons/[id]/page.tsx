"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getLessonById, type Lesson } from "@/data/mock-lessons";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowLeft as ArrowLeftIcon,
  ArrowRight,
  Award,
  BookOpen,
  CheckCircle,
  ChevronRight,
  Clock,
  Download,
  FileText,
  Home,
  Pause,
  Play,
  Presentation,
  RotateCcw,
  Share2,
  Target,
  Timer,
  Video,
  Volume2,
} from "lucide-react";

import { getSubjectById } from "@/config/education";
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
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function LessonDetailPage() {
  const params = useParams();
  const router = useRouter();
  const lessonId = params?.id as string;

  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (lessonId) {
      const foundLesson = getLessonById(lessonId);
      setLesson(foundLesson || null);
      setIsLoading(false);
      if (foundLesson) {
        setCurrentTime(foundLesson.progress.timeSpent);
      }
    }
  }, [lessonId]);

  // Timer effect for lesson progress
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying && lesson) {
      interval = setInterval(() => {
        setCurrentTime((prev) => {
          const newTime = Math.min(prev + 1, lesson.duration * 60); // Convert minutes to seconds
          return newTime;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying, lesson]);

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 w-1/3 rounded bg-gray-200"></div>
          <div className="space-y-3">
            <div className="h-4 rounded bg-gray-200"></div>
            <div className="h-4 w-2/3 rounded bg-gray-200"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!lesson) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardContent className="p-8 text-center">
            <BookOpen className="mx-auto mb-4 size-12 text-muted-foreground" />
            <h3 className="mb-2 text-lg font-semibold">Lesson Not Found</h3>
            <p className="mb-4 text-muted-foreground">
              The lesson you&apos;re looking for doesn&apos;t exist or
              isn&apos;t available.
            </p>
            <Button onClick={() => router.back()} variant="outline">
              <ArrowLeft className="mr-2 size-4" />
              Go Back
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const subject = getSubjectById(lesson.subjectId);
  const progressPercentage = Math.round(
    (currentTime / (lesson.duration * 60)) * 100,
  );
  const isCompleted = progressPercentage >= 100;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleComplete = () => {
    setCurrentTime(lesson.duration * 60);
    setIsPlaying(false);
    // In a real app, this would update the backend
  };

  const handleReset = () => {
    setCurrentTime(0);
    setIsPlaying(false);
  };

  const getMediaIcon = (type: string) => {
    switch (type) {
      case "video":
        return <Video className="size-4" />;
      case "audio":
        return <Volume2 className="size-4" />;
      case "document":
        return <FileText className="size-4" />;
      case "presentation":
        return <Presentation className="size-4" />;
      default:
        return <FileText className="size-4" />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="container mx-auto space-y-6 p-6"
    >
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push("/dashboard")}
          className="h-auto p-0"
        >
          <Home className="mr-1 size-4" />
          Dashboard
        </Button>
        <ChevronRight className="size-4" />
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push("/dashboard/lessons")}
          className="h-auto p-0"
        >
          Lessons
        </Button>
        <ChevronRight className="size-4" />
        <span className="font-medium text-foreground">{lesson.title}</span>
      </div>

      {/* Header */}
      <div className="mb-6 flex items-start gap-4">
        <Button variant="outline" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="size-4" />
        </Button>

        <div className="flex-1">
          <div className="mb-2 flex items-center gap-3">
            <div
              className="flex items-center justify-center rounded-lg p-3"
              style={{ backgroundColor: `${subject?.color || "#6B7280"}20` }}
            >
              <BookOpen
                className="size-6"
                style={{ color: subject?.color || "#6B7280" }}
              />
            </div>
            <div>
              <h1 className="text-2xl font-bold">{lesson.title}</h1>
              <p className="text-muted-foreground">{lesson.description}</p>
            </div>
          </div>

          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Clock className="size-4" />
              <span>{lesson.duration} minutes</span>
            </div>
            <Separator orientation="vertical" className="h-4" />
            <div className="flex items-center gap-1">
              <Target className="size-4" />
              <span className="capitalize">{lesson.difficulty}</span>
            </div>
            <Separator orientation="vertical" className="h-4" />
            <span>{subject?.name}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Share2 className="mr-2 size-4" />
            Share
          </Button>
          <Button variant="outline" size="sm">
            <Download className="mr-2 size-4" />
            Download
          </Button>
        </div>
      </div>

      {/* Progress Section */}
      <Card>
        <CardContent className="p-6">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">Lesson Progress</h3>
              <p className="text-sm text-muted-foreground">
                {isCompleted
                  ? "Lesson completed!"
                  : `${formatTime(currentTime)} of ${formatTime(lesson.duration * 60)}`}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleReset}
                disabled={currentTime === 0}
              >
                <RotateCcw className="size-4" />
              </Button>
              <Button
                onClick={isCompleted ? handleReset : handlePlayPause}
                size="sm"
              >
                {isCompleted ? (
                  <>
                    <RotateCcw className="mr-2 size-4" />
                    Restart
                  </>
                ) : isPlaying ? (
                  <>
                    <Pause className="mr-2 size-4" />
                    Pause
                  </>
                ) : (
                  <>
                    <Play className="mr-2 size-4" />
                    {currentTime > 0 ? "Continue" : "Start"}
                  </>
                )}
              </Button>
              {!isCompleted && (
                <Button variant="outline" onClick={handleComplete} size="sm">
                  <CheckCircle className="mr-2 size-4" />
                  Mark Complete
                </Button>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>{isCompleted ? "Completed" : "In Progress"}</span>
              <span>{Math.min(progressPercentage, 100)}%</span>
            </div>
            <Progress
              value={Math.min(progressPercentage, 100)}
              className="h-2"
            />
          </div>

          {isCompleted && (
            <Alert className="mt-4 border-green-200 bg-green-50">
              <Award className="size-4 text-green-600" />
              <AlertDescription className="text-green-800">
                Congratulations! You have completed this lesson. You can now
                proceed to the next lesson or review this content.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Main Content */}
      <Tabs defaultValue="content" className="space-y-4">
        <TabsList>
          <TabsTrigger value="content">Lesson Content</TabsTrigger>
          <TabsTrigger value="objectives">Objectives</TabsTrigger>
          <TabsTrigger value="activities">Activities</TabsTrigger>
          <TabsTrigger value="media">Media & Resources</TabsTrigger>
        </TabsList>

        <TabsContent value="content" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Introduction</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="leading-relaxed text-muted-foreground">
                {lesson.content.introduction}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Lesson Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="leading-relaxed text-muted-foreground">
                {lesson.content.summary}
              </p>
            </CardContent>
          </Card>

          {lesson.content.homework && (
            <Card>
              <CardHeader>
                <CardTitle>Homework Assignment</CardTitle>
                <CardDescription>
                  Complete this assignment to reinforce your learning
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="leading-relaxed text-muted-foreground">
                  {lesson.content.homework}
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="objectives" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Learning Objectives</CardTitle>
              <CardDescription>
                By the end of this lesson, you should be able to:
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {lesson.content.objectives.map((objective, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="mt-2 size-2 shrink-0 rounded-full bg-primary" />
                    <span className="text-muted-foreground">{objective}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activities" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Learning Activities</CardTitle>
                <CardDescription>
                  Interactive activities to enhance your understanding
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {lesson.content.activities.map((activity, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className="mt-2 size-2 shrink-0 rounded-full bg-blue-500" />
                      <span className="text-sm text-muted-foreground">
                        {activity}
                      </span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Materials Needed</CardTitle>
                <CardDescription>
                  Items required for this lesson
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {lesson.content.materials.map((material, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className="mt-2 size-2 shrink-0 rounded-full bg-green-500" />
                      <span className="text-sm text-muted-foreground">
                        {material}
                      </span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="media" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Media & Resources</CardTitle>
              <CardDescription>
                Additional materials to support your learning
              </CardDescription>
            </CardHeader>
            <CardContent>
              {lesson.media.length > 0 ? (
                <div className="grid gap-3 md:grid-cols-2">
                  {lesson.media.map((media, index) => (
                    <div
                      key={index}
                      className="flex cursor-pointer items-center gap-3 rounded-lg border p-3 hover:bg-gray-50"
                    >
                      {getMediaIcon(media.type)}
                      <div className="flex-1">
                        <p className="text-sm font-medium">{media.title}</p>
                        <p className="text-xs capitalize text-muted-foreground">
                          {media.type}
                        </p>
                      </div>
                      <Button variant="outline" size="sm">
                        <Play className="size-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="py-8 text-center text-muted-foreground">
                  No media resources available for this lesson.
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Navigation */}
      <div className="flex items-center justify-between border-t pt-6">
        <Button
          variant="outline"
          onClick={() => {
            // Navigate to previous lesson - in a real app, this would be calculated
            console.log("Navigate to previous lesson");
          }}
          disabled={lesson.prerequisiteLessonIds.length === 0}
        >
          <ArrowLeftIcon className="mr-2 size-4" />
          Previous Lesson
        </Button>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => router.push("/dashboard/lessons")}
          >
            All Lessons
          </Button>
          <Button
            onClick={() => {
              // Navigate to next lesson - in a real app, this would be calculated
              console.log("Navigate to next lesson");
            }}
            disabled={lesson.nextLessonIds.length === 0}
          >
            Next Lesson
            <ArrowRight className="ml-2 size-4" />
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
