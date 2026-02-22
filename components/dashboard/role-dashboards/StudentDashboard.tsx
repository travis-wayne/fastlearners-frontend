"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BookOpen,
  Calendar,
  CheckCircle2,
  ChevronRight,
  Circle,
  Loader2,
  Play,
  Star,
  Target,
  TrendingUp,
  Trophy,
  Info,
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
import { DismissibleCard } from "@/components/ui/dismissible-card";
import { AchievementsSection } from "@/components/dashboard/AchievementsSection";
import { GlassGreetingCard } from "@/components/dashboard/glass-greeting-card";
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

export function StudentDashboard() {
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

  const termPerformance = [
    { subject: "Mathematics", progress: 68, target: 80 },
    { subject: "Physics", progress: 85, target: 80 },
    { subject: "Chemistry", progress: 92, target: 85 },
    { subject: "Biology", progress: 45, target: 70 },
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
    { rank: 1, name: "Alex Johnson", score: 2840, avatar: "/avatars/avatar-1.svg" },
    {
      rank: 2,
      name: "Sarah Wilson",
      score: 2750,
      avatar: "/avatars/avatar-2.svg",
    },
    { rank: 3, name: "Mike Chen", score: 2680, avatar: "/avatars/avatar-3.svg" },
    {
      rank: 4,
      name: "You",
      score: 2620,
      avatar: "/avatars/avatar-4.svg",
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
      className="dashboard-spacing"
    >
      <motion.div variants={itemVariants}>
        <DismissibleCard
          id="student_dashboard_intro"
          title="Welcome to your Dashboard!"
          icon={<Info className="h-5 w-5 text-blue-500" />}
          content={
            <div className="space-y-2">
              <p>Here are a few tips to get you started:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li><strong>Sidebar:</strong> Access it using the menu icon to navigate through the app.</li>
                <li><strong>Profile Editing:</strong> Click your avatar in the top right to update your details.</li>
                <li><strong>Subject Selection:</strong> Use the sidebar or quick links to navigate to your registered subjects.</li>
              </ul>
            </div>
          }
          className="mb-6 border-blue-200 bg-blue-50/50 dark:border-blue-900/50 dark:bg-blue-900/20"
        />
      </motion.div>

      {/* iOS 26 Glassmorphism Welcome Header with Apple Hello Animation */}
      <motion.div variants={itemVariants}>
        <GlassGreetingCard
          userName={dashboardData?.name || "Student"}
          role="Student"
          level={5}
          streak={7}
          lessonsToday={3}
        />
      </motion.div>

      {/* Top Stats Grid */}
      <motion.div
        variants={itemVariants}
        className="responsive-gap grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
      >
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            whileHover={{ scale: 1.02, y: -2 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <Card className="relative overflow-hidden border-gray-200/50 bg-gradient-to-br from-white to-gray-50/50 dark:border-gray-700/50 dark:from-gray-900 dark:to-gray-800/50">
              <CardContent className="responsive-padding">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">
                    {stat.label}
                  </p>
                  <div className="flex items-baseline gap-2">
                    <h3 className="text-xl font-bold sm:text-2xl">{stat.value}</h3>
                    <Badge
                      variant={stat.positive ? "default" : "secondary"}
                      className="text-[10px] sm:text-xs"
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
        className="responsive-gap grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
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
        <div className="md:col-span-2 lg:col-span-1">
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
        </div>

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
            <div className="space-y-component-sm sm:hidden">
              {todaysLessonsTable.map((lesson) => (
                <div
                  key={`lesson-card-${lesson.id}`}
                  className="responsive-padding rounded-2xl border bg-background shadow-sm"
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
              <Table className="min-w-[640px]">
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
                          className="h-9"
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
      <div className="responsive-gap grid grid-cols-1 lg:grid-cols-3">
        {/* Term Performance - extracted (takes 2 columns) */}
        <motion.div variants={itemVariants} className="lg:col-span-2">
          <PerformanceSection
            items={termPerformance.map((s) => ({
              subject: s.subject,
              percentage: s.progress,
              target: s.target,
              colorClass: "bg-primary",
            }))}
            title="Term Performance"
            description="Overall performance across all subjects this term"
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
            <CardContent className="space-y-component-sm sm:space-y-component-md">
              {achievements.map((achievement, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 * index }}
                  whileHover={{ scale: 1.02 }}
                  className={`flex items-center gap-component-md rounded-lg p-component-sm transition-colors sm:p-component-md ${achievement.earned
                    ? "border border-primary/20 bg-primary/5"
                    : "bg-muted/30"
                    }`}
                >
                  <div
                    className={`text-base sm:text-xl ${achievement.earned ? "" : "opacity-50 grayscale"}`}
                  >
                    {achievement.icon}
                  </div>
                  <div className="flex-1">
                    <span
                      className={`font-medium ${achievement.earned
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
                      <Star className="size-3.5 fill-current text-yellow-500 sm:size-4" />
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
