"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  BookOpen,
  Clock,
  Target,
  CheckCircle,
  Play,
  Pause,
  RotateCcw,
  Download,
  Share2,
  Volume2,
  FileText,
  Presentation,
  Video,
  ChevronRight,
  Home,
  ArrowRight,
  ArrowLeft as ArrowLeftIcon,
  Timer,
  Award
} from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Alert, AlertDescription } from "@/components/ui/alert";

import { getLessonById, type Lesson } from "@/data/mock-lessons";
import { getSubjectById } from "@/config/education";

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
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
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
            <BookOpen className="size-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Lesson Not Found</h3>
            <p className="text-muted-foreground mb-4">
              The lesson you&apos;re looking for doesn&apos;t exist or isn&apos;t available.
            </p>
            <Button onClick={() => router.back()} variant="outline">
              <ArrowLeft className="size-4 mr-2" />
              Go Back
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const subject = getSubjectById(lesson.subjectId);
  const progressPercentage = Math.round((currentTime / (lesson.duration * 60)) * 100);
  const isCompleted = progressPercentage >= 100;
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
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
      case 'video': return <Video className="size-4" />;
      case 'audio': return <Volume2 className="size-4" />;
      case 'document': return <FileText className="size-4" />;
      case 'presentation': return <Presentation className="size-4" />;
      default: return <FileText className="size-4" />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="container mx-auto p-6 space-y-6"
    >
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push('/dashboard')}
          className="p-0 h-auto"
        >
          <Home className="size-4 mr-1" />
          Dashboard
        </Button>
        <ChevronRight className="size-4" />
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push('/dashboard/lessons')}
          className="p-0 h-auto"
        >
          Lessons
        </Button>
        <ChevronRight className="size-4" />
        <span className="font-medium text-foreground">{lesson.title}</span>
      </div>

      {/* Header */}
      <div className="flex items-start gap-4 mb-6">
        <Button
          variant="outline"
          size="icon"
          onClick={() => router.back()}
        >
          <ArrowLeft className="size-4" />
        </Button>
        
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <div 
              className="p-3 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: `${subject?.color || '#6B7280'}20` }}
            >
              <BookOpen className="size-6" style={{ color: subject?.color || '#6B7280' }} />
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
            <Share2 className="size-4 mr-2" />
            Share
          </Button>
          <Button variant="outline" size="sm">
            <Download className="size-4 mr-2" />
            Download
          </Button>
        </div>
      </div>

      {/* Progress Section */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold">Lesson Progress</h3>
              <p className="text-sm text-muted-foreground">
                {isCompleted ? "Lesson completed!" : `${formatTime(currentTime)} of ${formatTime(lesson.duration * 60)}`}
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
                    <RotateCcw className="size-4 mr-2" />
                    Restart
                  </>
                ) : isPlaying ? (
                  <>
                    <Pause className="size-4 mr-2" />
                    Pause
                  </>
                ) : (
                  <>
                    <Play className="size-4 mr-2" />
                    {currentTime > 0 ? "Continue" : "Start"}
                  </>
                )}
              </Button>
              {!isCompleted && (
                <Button
                  variant="outline"
                  onClick={handleComplete}
                  size="sm"
                >
                  <CheckCircle className="size-4 mr-2" />
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
            <Progress value={Math.min(progressPercentage, 100)} className="h-2" />
          </div>
          
          {isCompleted && (
            <Alert className="mt-4 border-green-200 bg-green-50">
              <Award className="size-4 text-green-600" />
              <AlertDescription className="text-green-800">
                Congratulations! You have completed this lesson. You can now proceed to the next lesson or review this content.
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
              <p className="text-muted-foreground leading-relaxed">
                {lesson.content.introduction}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Lesson Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">
                {lesson.content.summary}
              </p>
            </CardContent>
          </Card>

          {lesson.content.homework && (
            <Card>
              <CardHeader>
                <CardTitle>Homework Assignment</CardTitle>
                <CardDescription>Complete this assignment to reinforce your learning</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
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
              <CardDescription>By the end of this lesson, you should be able to:</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {lesson.content.objectives.map((objective, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="size-2 rounded-full bg-primary mt-2 shrink-0" />
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
                <CardDescription>Interactive activities to enhance your understanding</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {lesson.content.activities.map((activity, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className="size-2 rounded-full bg-blue-500 mt-2 shrink-0" />
                      <span className="text-sm text-muted-foreground">{activity}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Materials Needed</CardTitle>
                <CardDescription>Items required for this lesson</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {lesson.content.materials.map((material, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className="size-2 rounded-full bg-green-500 mt-2 shrink-0" />
                      <span className="text-sm text-muted-foreground">{material}</span>
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
              <CardDescription>Additional materials to support your learning</CardDescription>
            </CardHeader>
            <CardContent>
              {lesson.media.length > 0 ? (
                <div className="grid gap-3 md:grid-cols-2">
                  {lesson.media.map((media, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer"
                    >
                      {getMediaIcon(media.type)}
                      <div className="flex-1">
                        <p className="font-medium text-sm">{media.title}</p>
                        <p className="text-xs text-muted-foreground capitalize">{media.type}</p>
                      </div>
                      <Button variant="outline" size="sm">
                        <Play className="size-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-8">
                  No media resources available for this lesson.
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Navigation */}
      <div className="flex items-center justify-between pt-6 border-t">
        <Button
          variant="outline"
          onClick={() => {
            // Navigate to previous lesson - in a real app, this would be calculated
            console.log("Navigate to previous lesson");
          }}
          disabled={lesson.prerequisiteLessonIds.length === 0}
        >
          <ArrowLeftIcon className="size-4 mr-2" />
          Previous Lesson
        </Button>
        
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => router.push('/dashboard/lessons')}
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
            <ArrowRight className="size-4 ml-2" />
          </Button>
        </div>
      </div>
    </motion.div>
  );
}