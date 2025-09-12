"use client";

import Link from "next/link";
import {
  BookOpen,
  Calendar,
  ChevronRight,
  Clock,
  Play,
  Star,
  Target,
  Trophy,
  Zap,
} from "lucide-react";

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

export function StudentDashboard() {
  // Mock data - replace with real data from your API
  const todaysLessons = [
    {
      id: 1,
      subject: "Mathematics",
      lesson: "Algebra Basics",
      duration: "45 min",
      progress: 0,
      new: true,
    },
    {
      id: 2,
      subject: "Science",
      lesson: "Physics: Motion",
      duration: "30 min",
      progress: 75,
      new: false,
    },
    {
      id: 3,
      subject: "English",
      lesson: "Grammar Review",
      duration: "25 min",
      progress: 100,
      new: false,
    },
  ];

  const weeklyProgress = [
    { subject: "Mathematics", progress: 68, target: 80 },
    { subject: "Science", progress: 85, target: 80 },
    { subject: "English", progress: 92, target: 85 },
    { subject: "History", progress: 45, target: 70 },
  ];

  const achievements = [
    { title: "7-Day Streak", icon: "🔥", earned: true },
    { title: "Perfect Score", icon: "⭐", earned: true },
    { title: "Fast Learner", icon: "⚡", earned: false },
    { title: "Subject Master", icon: "🏆", earned: false },
  ];

  return (
    <div className="space-y-8">
      {/* Today's Lessons - Priority Content */}
      <Card className="border-primary/20 bg-primary/5">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="size-5 text-primary" />
              <CardTitle>Today&apos;s Lessons</CardTitle>
            </div>
            <Badge variant="secondary">3 lessons</Badge>
          </div>
          <CardDescription>
            Start with your scheduled lessons for today
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {todaysLessons.map((lesson) => (
            <div
              key={lesson.id}
              className="flex items-center justify-between rounded-lg bg-background/50 p-3"
            >
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-full bg-primary/10">
                  <BookOpen className="size-5 text-primary" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium">{lesson.lesson}</h4>
                    {lesson.new && (
                      <Badge variant="secondary" className="text-xs">
                        New
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <span>{lesson.subject}</span>
                    <div className="flex items-center gap-1">
                      <Clock className="size-3" />
                      <span>{lesson.duration}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {lesson.progress > 0 && (
                  <div className="flex items-center gap-2">
                    <Progress value={lesson.progress} className="w-20" />
                    <span className="text-sm text-muted-foreground">
                      {lesson.progress}%
                    </span>
                  </div>
                )}
                <Button size="sm" className="gap-1">
                  <Play className="size-4" />
                  {lesson.progress === 0
                    ? "Start"
                    : lesson.progress === 100
                      ? "Review"
                      : "Continue"}
                </Button>
              </div>
            </div>
          ))}
          <div className="pt-2">
            <Link href="/dashboard/lessons">
              <Button variant="outline" className="w-full">
                View All Lessons
                <ChevronRight className="ml-2 size-4" />
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Weekly Progress */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="size-5" />
              This Week&apos;s Progress
            </CardTitle>
            <CardDescription>
              Track your progress across all subjects
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {weeklyProgress.map((subject) => (
              <div key={subject.subject} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-medium">{subject.subject}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">
                      {subject.progress}% of {subject.target}%
                    </span>
                    {subject.progress >= subject.target && (
                      <Trophy className="size-4 text-yellow-500" />
                    )}
                  </div>
                </div>
                <div className="relative">
                  <Progress value={subject.progress} className="h-2" />
                  <div
                    className="absolute top-0 h-2 w-1 rounded-full bg-primary"
                    style={{ left: `${subject.target}%` }}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Achievements */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="size-5" />
              Achievements
            </CardTitle>
            <CardDescription>Your learning milestones</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {achievements.map((achievement, index) => (
              <div
                key={index}
                className={`flex items-center gap-3 rounded-lg p-2 ${
                  achievement.earned ? "bg-primary/5" : "bg-muted/20"
                }`}
              >
                <div
                  className={`text-xl ${achievement.earned ? "" : "opacity-50 grayscale"}`}
                >
                  {achievement.icon}
                </div>
                <div className="flex-1">
                  <span
                    className={`font-medium ${
                      achievement.earned
                        ? "text-foreground"
                        : "text-muted-foreground"
                    }`}
                  >
                    {achievement.title}
                  </span>
                </div>
                {achievement.earned && (
                  <Star className="size-4 fill-current text-yellow-500" />
                )}
              </div>
            ))}
            <Button variant="outline" size="sm" className="mt-3 w-full">
              View All Achievements
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="cursor-pointer transition-shadow hover:shadow-lg">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-lg bg-blue-100">
                <BookOpen className="size-5 text-blue-600" />
              </div>
              <div>
                <h4 className="font-medium">Subjects</h4>
                <p className="text-sm text-muted-foreground">
                  Browse all subjects
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer transition-shadow hover:shadow-lg">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-lg bg-green-100">
                <Target className="size-5 text-green-600" />
              </div>
              <div>
                <h4 className="font-medium">Practice</h4>
                <p className="text-sm text-muted-foreground">
                  Test your knowledge
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer transition-shadow hover:shadow-lg">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-lg bg-purple-100">
                <Trophy className="size-5 text-purple-600" />
              </div>
              <div>
                <h4 className="font-medium">Achievements</h4>
                <p className="text-sm text-muted-foreground">
                  View your progress
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer transition-shadow hover:shadow-lg">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-lg bg-orange-100">
                <Zap className="size-5 text-orange-600" />
              </div>
              <div>
                <h4 className="font-medium">Quick Quiz</h4>
                <p className="text-sm text-muted-foreground">
                  5-minute challenge
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
