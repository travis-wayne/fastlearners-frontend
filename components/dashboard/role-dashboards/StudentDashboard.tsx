"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BookOpen,
  Calendar,
  CheckCircle2,
  ChevronRight,
  Circle,
  Clock,
  Loader2,
  Moon,
  Play,
  Star,
  Sun,
  Sunrise,
  Sunset,
  Target,
  TrendingUp,
  Trophy,
} from "lucide-react";

import { getDashboard, type DashboardContent } from "@/lib/api/dashboard";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { BentoGrid, BentoGridItem } from "@/components/ui/bento-grid";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { ChartConfig } from "@/components/ui/chart";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AchievementsSection } from "@/components/dashboard/AchievementsSection";
import { LeaderBoard } from "@/components/dashboard/LeaderBoard";
import { OverviewGrid } from "@/components/dashboard/OverviewGrid";
import { PerformanceSection } from "@/components/dashboard/PerformanceSection";
import { ProgressDonut } from "@/components/dashboard/ProgressDonut";

// Animation variants for smooth entrance
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring" as const,
      stiffness: 100,
    },
  },
};

interface TimeData {
  time: string;
  date: string;
  greeting: string;
  period: "morning" | "afternoon" | "evening" | "night";
}

export function StudentDashboard() {
  const [timeData, setTimeData] = useState<TimeData | null>(null);
  const [selectedSubject, setSelectedSubject] = useState<string>("Physics");
  const [dashboardData, setDashboardData] = useState<DashboardContent | null>(
    null,
  );
  const [isLoadingDashboard, setIsLoadingDashboard] = useState(true);
  const subjectToProgress: Record<string, number> = {
    Mathematics: 65,
    Physics: 50,
    Chemistry: 80,
    Biology: 90,
  };

  // Fetch dashboard data
  useEffect(() => {
    const fetchDashboard = async () => {
      setIsLoadingDashboard(true);
      try {
        const response = await getDashboard();
        if (response.success && response.content) {
          setDashboardData(response.content);
          // Set selected subject to the progress subject if available
          if (response.content.progress?.subject) {
            setSelectedSubject(response.content.progress.subject);
          }
        }
      } catch (error) {
        console.error("Failed to fetch dashboard:", error);
      } finally {
        setIsLoadingDashboard(false);
      }
    };

    fetchDashboard();
  }, []);

  // Update time every second
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = now.getHours();

      // Determine greeting and period based on time
      let greeting = "Good evening";
      let period: TimeData["period"] = "evening";

      if (hours >= 5 && hours < 12) {
        greeting = "Good morning";
        period = "morning";
      } else if (hours >= 12 && hours < 17) {
        greeting = "Good afternoon";
        period = "afternoon";
      } else if (hours >= 17 && hours < 21) {
        greeting = "Good evening";
        period = "evening";
      } else {
        greeting = "Good night";
        period = "night";
      }

      setTimeData({
        time: now.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        }),
        date: now.toLocaleDateString([], {
          weekday: "long",
          month: "long",
          day: "numeric",
        }),
        greeting,
        period,
      });
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Time period icons
  const getPeriodIcon = () => {
    if (!timeData) return <Sun className="size-4 text-white/80" />;

    switch (timeData.period) {
      case "morning":
        return <Sunrise className="size-4 text-white/80" />;
      case "afternoon":
        return <Sun className="size-4 text-white/80" />;
      case "evening":
        return <Sunset className="size-4 text-white/80" />;
      case "night":
        return <Moon className="size-4 text-white/80" />;
      default:
        return <Sun className="size-4 text-white/80" />;
    }
  };

  const headerGradientClass = useMemo(() => {
    switch (timeData?.period) {
      case "morning":
        return "bg-gradient-to-br from-blue-200 via-cyan-200 to-yellow-100 dark:from-blue-400 dark:via-cyan-300 dark:to-yellow-200";
      case "afternoon":
        return "bg-gradient-to-br from-blue-300 via-purple-200 to-orange-200 dark:from-blue-500 dark:via-purple-400 dark:to-orange-300";
      case "evening":
        return "bg-gradient-to-br from-purple-300 via-pink-300 to-orange-200 dark:from-purple-500 dark:via-pink-500 dark:to-orange-400";
      case "night":
      default:
        return "bg-gradient-to-br from-slate-200 via-purple-200 to-blue-200 dark:from-slate-800 dark:via-purple-900 dark:to-blue-900";
    }
  }, [timeData?.period]);

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

  const achievementHighlights = achievements.slice(0, 3).map(
    ({ title, icon }) => ({
      title,
      icon,
    }),
  );

  const stats = [
    { label: "Lessons Completed", value: "24", change: "+12%", positive: true },
    { label: "Current Streak", value: "7 days", change: "🔥", positive: true },
    { label: "Average Score", value: "85%", change: "+5%", positive: true },
    { label: "Time This Week", value: "12h", change: "+2h", positive: true },
  ];

  // NEW SECTIONS DATA for the three cards from the image

  // Leaderboard data
  const leaderboard = [
    { rank: 1, name: "Alex Johnson", score: 2840, avatar: "/avatars/alex.jpg" },
    {
      rank: 2,
      name: "Sarah Wilson",
      score: 2750,
      avatar: "/avatars/sarah.jpg",
    },
    { rank: 3, name: "Mike Chen", score: 2680, avatar: "/avatars/mike.jpg" },
    {
      rank: 4,
      name: "You",
      score: 2620,
      avatar: "/avatars/you.jpg",
      isCurrentUser: true,
    },
  ];

  // Overview data
  const overviewStats = [
    { label: "Subjects Registered", value: "8/9" },
    { label: "Lessons Completed", value: "10/20" },
    { label: "Quizzes Completed", value: "6/20" },
  ];

  // Today's Lessons for table format
  const todaysLessonsTable = [
    {
      id: 1,
      subject: "Physics",
      lesson: "Introduction to Mechanics",
      duration: "45 min",
      status: "Continue",
      progress: 65,
    },
    {
      id: 2,
      subject: "Mathematics",
      lesson: "Algebra Fundamentals",
      duration: "30 min",
      status: "Start",
      progress: 0,
    },
    {
      id: 3,
      subject: "Chemistry",
      lesson: "Atomic Structure",
      duration: "40 min",
      status: "Continue",
      progress: 80,
    },
  ];

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="container mx-auto space-y-8 p-4 md:p-6"
    >
      {/* Enhanced Welcome Header with time-based gradient */}
      <motion.div variants={itemVariants}>
        <div
          className={`relative overflow-hidden rounded-2xl p-8 ${headerGradientClass} transition-all duration-700 ease-in-out`}
        >
          <div className="relative z-10 max-w-lg">
            {/* Header with date and time */}
            {timeData && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mb-4 flex items-center justify-between text-gray-900 dark:text-white/90"
              >
                <div className="flex items-center gap-2 rounded-lg bg-black/10 px-3 py-2 backdrop-blur-sm dark:bg-white/20">
                  <Calendar className="size-4 text-gray-900 dark:text-white" />
                  <span className="text-sm font-medium">{timeData.date}</span>
                </div>
                <div className="flex items-center gap-2 rounded-lg bg-black/10 px-3 py-2 backdrop-blur-sm dark:bg-white/20">
                  <Clock className="size-4 text-gray-900 dark:text-white" />
                  <span className="font-mono text-sm font-medium">
                    {timeData.time}
                  </span>
                </div>
              </motion.div>
            )}

            {/* Greeting */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="mb-6"
            >
              <div className="mb-2 flex items-center gap-2">
                {getPeriodIcon()}
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {timeData?.greeting || "Good day"},{" "}
                  {dashboardData?.name || "Student"}! 🎓
                </h2>
              </div>
              <p className="text-base leading-relaxed text-gray-800 dark:text-white/90">
                Ready to learn something amazing today?
              </p>
            </motion.div>

            {/* Badges */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mb-4 flex items-center gap-3"
            >
              <Badge
                variant="secondary"
                className="border-white/30 bg-white/20 text-white transition-colors hover:bg-white/30"
              >
                <span className="mr-1">🎓</span>
                Student
              </Badge>

              <Badge
                variant="secondary"
                className="border-white/20 bg-white/15 text-white/90"
              >
                <Star className="mr-1 size-3" />
                Level 5
              </Badge>
            </motion.div>

            {/* Quick stats */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex items-center gap-4"
            >
              <div className="flex items-center gap-2 rounded-lg bg-white/20 px-3 py-2 backdrop-blur-sm">
                <span className="text-sm text-white">🔥</span>
                <span className="text-sm font-medium text-white">
                  7 day streak
                </span>
              </div>
              <div className="flex items-center gap-2 rounded-lg bg-white/20 px-3 py-2 backdrop-blur-sm">
                <span className="text-sm text-white">📚</span>
                <span className="text-sm font-medium text-white">
                  3 lessons today
                </span>
              </div>
            </motion.div>

            {/* Decorative icon */}
            <div className="absolute -right-4 -top-4 opacity-20">
              <motion.div
                animate={{ rotate: 360, scale: [1, 1.1, 1] }}
                transition={{
                  rotate: { duration: 20, repeat: Infinity, ease: "linear" },
                  scale: { duration: 3, repeat: Infinity },
                }}
                className="flex size-16 items-center justify-center rounded-full bg-white/10"
              >
                <span className="text-2xl">🎓</span>
              </motion.div>
            </div>
          </div>

          {/* Soft moving highlights */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <motion.div
              animate={{
                x: [0, 100, 0],
                y: [0, -50, 0],
                opacity: [0.1, 0.2, 0.1],
              }}
              transition={{ duration: 8, repeat: Infinity }}
              className="absolute -right-10 -top-10 size-32 rounded-full bg-white/5 blur-xl"
            />
            <motion.div
              animate={{
                x: [0, -80, 0],
                y: [0, 60, 0],
                opacity: [0.05, 0.15, 0.05],
              }}
              transition={{ duration: 12, repeat: Infinity, delay: 2 }}
              className="absolute -bottom-10 -left-10 size-40 rounded-full bg-white/5 blur-2xl"
            />
          </div>
        </div>
      </motion.div>

      {/* Top Stats Grid */}
      <motion.div
        variants={itemVariants}
        className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4"
      >
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            whileHover={{ scale: 1.02, y: -2 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <Card className="relative overflow-hidden border-gray-200/50 bg-gradient-to-br from-white to-gray-50/50 dark:border-gray-700/50 dark:from-gray-900 dark:to-gray-800/50">
              <CardContent className="p-4">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">
                    {stat.label}
                  </p>
                  <div className="flex items-baseline gap-2">
                    <h3 className="text-2xl font-bold">{stat.value}</h3>
                    <Badge
                      variant={stat.positive ? "default" : "secondary"}
                      className="text-xs"
                    >
                      {stat.change}
                    </Badge>
                  </div>
                </div>
                <div className="absolute right-0 top-0 flex size-8 items-center justify-center rounded-bl-xl bg-primary/10">
                  <div className="size-2 rounded-full bg-primary/40"></div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* Progress + Achievements + Overview row */}
      <motion.div
        variants={itemVariants}
        className="grid grid-cols-1 gap-4 lg:grid-cols-3"
      >
        {/* Progress Donut - Phase B replacement */}
        <ProgressDonut
          options={[
            { label: "Mathematics", value: "Mathematics", color: "#3b82f6" },
            { label: "Physics", value: "Physics", color: "#8b5cf6" },
            { label: "Chemistry", value: "Chemistry", color: "#10b981" },
            { label: "Biology", value: "Biology", color: "#f59e0b" },
          ]}
          value={selectedSubject}
          onChange={setSelectedSubject}
          progressMap={subjectToProgress}
        />

        {/* Achievements (3 cards) - extracted */}
        <AchievementsSection items={achievementHighlights} />

        {/* Overview grid - extracted */}
        {isLoadingDashboard ? (
          <Card className="h-full border bg-card">
            <CardContent className="flex items-center justify-center p-8">
              <Loader2 className="size-6 animate-spin text-muted-foreground" />
            </CardContent>
          </Card>
        ) : (
          <OverviewGrid
            stats={[
              {
                label: "Subjects",
                value: dashboardData?.subjects || "N/A",
              },
              {
                label: "Lessons",
                value: dashboardData?.lessons || "N/A",
              },
              {
                label: "Quizzes",
                value: dashboardData?.quizzes || "N/A",
              },
              {
                label: "Subscription Status",
                value: dashboardData?.subscription_status
                  ? dashboardData.subscription_status.charAt(0).toUpperCase() +
                    dashboardData.subscription_status.slice(1)
                  : "N/A",
              },
            ]}
          />
        )}

        {/* Progress Card */}
        {dashboardData?.progress && (
          <motion.div variants={itemVariants}>
            <Card className="border-primary/20 bg-gradient-to-r from-primary/5 to-blue-50/50 dark:to-blue-950/20">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <div className="rounded-lg bg-primary/10 p-2">
                    <Target className="size-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle>Progress Overview</CardTitle>
                    <CardDescription>
                      Your learning progress in {dashboardData.progress.subject}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="mb-2 flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">
                        {dashboardData.progress.subject} Progress
                      </span>
                      <span className="font-medium">
                        {dashboardData.progress.covered} /{" "}
                        {dashboardData.progress.covered +
                          dashboardData.progress.left}
                      </span>
                    </div>
                    <Progress
                      value={
                        dashboardData.progress.covered +
                          dashboardData.progress.left >
                        0
                          ? (dashboardData.progress.covered /
                              (dashboardData.progress.covered +
                                dashboardData.progress.left)) *
                            100
                          : 0
                      }
                      className="h-3"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="rounded-lg border bg-muted/50 p-3">
                      <div className="text-sm text-muted-foreground">
                        Covered
                      </div>
                      <div className="text-2xl font-bold text-primary">
                        {dashboardData.progress.covered}
                      </div>
                    </div>
                    <div className="rounded-lg border bg-muted/50 p-3">
                      <div className="text-sm text-muted-foreground">
                        Remaining
                      </div>
                      <div className="text-2xl font-bold text-muted-foreground">
                        {dashboardData.progress.left}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </motion.div>

      {/* Today's Lessons - Enhanced */}
      <motion.div variants={itemVariants}>
        <Card className="border-primary/20 bg-gradient-to-r from-primary/5 to-blue-50/50 dark:to-blue-950/20">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="rounded-lg bg-primary/10 p-2">
                  <Calendar className="size-5 text-primary" />
                </div>
                <div>
                  <CardTitle className="flex items-center gap-2">
                    Today&apos;s Lessons
                  </CardTitle>
                  <CardDescription>
                    Start with your scheduled lessons for today
                  </CardDescription>
                </div>
              </div>
              <Badge variant="secondary" className="bg-primary/10 text-primary">
                3 lessons
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 sm:hidden">
              {todaysLessonsTable.map((lesson) => (
                <div
                  key={`lesson-card-${lesson.id}`}
                  className="rounded-2xl border bg-background p-4 shadow-sm"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold">{lesson.subject}</p>
                      <p className="text-sm text-muted-foreground">
                        {lesson.lesson}
                      </p>
                    </div>
                    <Badge variant="outline">{lesson.duration}</Badge>
                  </div>
                  <div className="mt-4 flex flex-col gap-3">
                    {lesson.progress > 0 ? (
                      <div className="flex items-center gap-2">
                        <Progress value={lesson.progress} className="w-24" />
                        <span className="text-sm font-medium">
                          {lesson.progress}%
                        </span>
                      </div>
                    ) : (
                      <span className="text-sm text-muted-foreground">
                        Not started
                      </span>
                    )}
                    <Button
                      size="sm"
                      variant={lesson.progress === 0 ? "default" : "outline"}
                    >
                      {lesson.status}
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            <div className="hidden w-full overflow-x-auto sm:block">
              <Table className="min-w-[560px] lg:min-w-[680px]">
                <TableHeader>
                  <TableRow>
                    <TableHead>Subject</TableHead>
                    <TableHead>Lesson</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Progress</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {todaysLessonsTable.map((lesson) => (
                    <TableRow key={lesson.id}>
                      <TableCell className="font-medium">
                        {lesson.subject}
                      </TableCell>
                      <TableCell>{lesson.lesson}</TableCell>
                      <TableCell>{lesson.duration}</TableCell>
                      <TableCell>
                        {lesson.progress > 0 ? (
                          <div className="flex items-center gap-2">
                            <Progress
                              value={lesson.progress}
                              className="w-16"
                            />
                            <span className="text-sm">{lesson.progress}%</span>
                          </div>
                        ) : (
                          <span className="text-sm text-muted-foreground">
                            Not started
                          </span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Button
                          size="sm"
                          variant={
                            lesson.progress === 0 ? "default" : "outline"
                          }
                        >
                          {lesson.status}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Leaderboard Section - extracted */}
      <motion.div variants={itemVariants}>
        <LeaderBoard
          entries={leaderboard.map((e) => ({
            rank: e.rank,
            name: e.name,
            avatar: e.avatar,
            score: e.score,
            isCurrentUser: (e as any).isCurrentUser,
          }))}
        />
      </motion.div>

      {/* Performance (bars) + Achievements - Original */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Weekly Progress - extracted (takes 2 columns) */}
        <motion.div variants={itemVariants} className="lg:col-span-2">
          <PerformanceSection
            items={weeklyProgress.map((s) => ({
              subject: s.subject,
              percentage: s.progress,
              target: s.target,
              colorClass: "bg-primary",
            }))}
            title="Performance"
            description="Subject progress vs target for this week"
          />
        </motion.div>

        {/* Achievements - Original */}
        <motion.div variants={itemVariants}>
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="rounded-lg bg-yellow-100 p-2">
                  <Trophy className="size-5 text-yellow-600" />
                </div>
                Achievements
              </CardTitle>
              <CardDescription>Your learning milestones</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {achievements.map((achievement, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 * index }}
                  whileHover={{ scale: 1.02 }}
                  className={`flex items-center gap-3 rounded-lg p-3 transition-colors ${
                    achievement.earned
                      ? "border border-primary/20 bg-primary/5"
                      : "bg-muted/30"
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
                    <motion.div
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ type: "spring", delay: 0.3 }}
                    >
                      <Star className="size-4 fill-current text-yellow-500" />
                    </motion.div>
                  )}
                </motion.div>
              ))}
              <Button variant="outline" size="sm" className="mt-3 w-full">
                View All Achievements
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
}
