"use client";

import Link from "next/link";
import {
  BookOpen,
  Calendar,
  ClipboardCheck,
  FileText,
  GraduationCap,
  MessageSquare,
  PlusCircle,
  TrendingUp,
  Upload,
  Users,
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

export function TeacherDashboard() {
  // Mock data for teacher - replace with real data from your API
  const classes = [
    {
      id: 1,
      name: "Grade 8 Mathematics",
      students: 28,
      avgProgress: 85,
      recentActivity: "Quiz submitted",
      pendingAssignments: 5,
    },
    {
      id: 2,
      name: "Grade 7 Science",
      students: 24,
      avgProgress: 78,
      recentActivity: "Lesson completed",
      pendingAssignments: 3,
    },
  ];

  const recentUploads = [
    {
      id: 1,
      title: "Algebra Basics - Chapter 5",
      type: "lesson",
      uploadDate: "2 days ago",
    },
    {
      id: 2,
      title: "Physics Quiz - Motion",
      type: "quiz",
      uploadDate: "1 week ago",
    },
    {
      id: 3,
      title: "Chemistry Lab Instructions",
      type: "resource",
      uploadDate: "1 week ago",
    },
  ];

  const todayTasks = [
    {
      id: 1,
      task: "Review submitted assignments",
      priority: "high",
      estimated: "30 min",
    },
    {
      id: 2,
      task: "Prepare next week's lesson plan",
      priority: "medium",
      estimated: "45 min",
    },
    { id: 3, task: "Update grade book", priority: "low", estimated: "15 min" },
  ];

  return (
    <div className="space-y-8">
      {/* Classes Overview */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6">
        {classes.map((classItem) => (
          <Card key={classItem.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <GraduationCap className="size-5 text-primary" />
                    {classItem.name}
                  </CardTitle>
                  <CardDescription>
                    {classItem.students} students
                  </CardDescription>
                </div>
                <Badge
                  variant={
                    classItem.pendingAssignments > 0 ? "destructive" : "default"
                  }
                >
                  {classItem.pendingAssignments} pending
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4 p-4 sm:p-6">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Average Progress</span>
                  <span className="text-sm text-muted-foreground">
                    {classItem.avgProgress}%
                  </span>
                </div>
                <Progress value={classItem.avgProgress} className="h-1.5 sm:h-2" />
              </div>

              <div className="flex items-center justify-between text-xs sm:text-sm">
                <span className="text-muted-foreground">Recent:</span>
                <span>{classItem.recentActivity}</span>
              </div>

              <div className="xs:flex-row flex flex-col gap-2 pt-2">
                <Link
                  href={`/teacher/class/${classItem.id}`}
                  className="flex-1"
                >
                  <Button size="sm" className="w-full">
                    View Class
                  </Button>
                </Link>
                <Link href={`/teacher/class/${classItem.id}/assignments`}>
                  <Button size="sm" variant="outline">
                    Assignments
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
        {/* Today's Tasks */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ClipboardCheck className="size-5" />
              Today&apos;s Tasks
            </CardTitle>
            <CardDescription>Your priority tasks for today</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 sm:space-y-3">
            {todayTasks.map((task) => (
              <div
                key={task.id}
                className="flex items-center justify-between rounded-lg bg-muted/50 p-1.5 sm:p-2"
              >
                <div className="flex-1">
                  <p className="text-sm font-medium">{task.task}</p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Badge
                      variant={
                        task.priority === "high"
                          ? "destructive"
                          : task.priority === "medium"
                            ? "default"
                            : "secondary"
                      }
                      className="px-1.5 py-0 text-xs sm:px-2"
                    >
                      {task.priority}
                    </Badge>
                    <span>{task.estimated}</span>
                  </div>
                </div>
              </div>
            ))}
            <Button variant="outline" size="sm" className="mt-3 w-full">
              View All Tasks
            </Button>
          </CardContent>
        </Card>

        {/* Recent Uploads */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="size-5" />
              Recent Uploads
            </CardTitle>
            <CardDescription>Your latest content</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 sm:space-y-3">
            {recentUploads.map((upload) => (
              <div
                key={upload.id}
                className="space-y-1 rounded-lg bg-muted/50 p-1.5 sm:p-2"
              >
                <p className="text-sm font-medium">{upload.title}</p>
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="text-xs">
                    {upload.type}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {upload.uploadDate}
                  </span>
                </div>
              </div>
            ))}
            <Button variant="outline" size="sm" className="mt-3 w-full">
              View All Uploads
            </Button>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="size-5" />
              Quick Stats
            </CardTitle>
            <CardDescription>This week&apos;s overview</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary sm:text-3xl">52</div>
              <div className="text-sm text-muted-foreground">
                Total Students
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600 sm:text-3xl">12</div>
              <div className="text-sm text-muted-foreground">
                Lessons Created
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-500 sm:text-3xl">8</div>
              <div className="text-sm text-muted-foreground">
                Pending Reviews
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4">
        <Card className="cursor-pointer transition-shadow hover:shadow-lg">
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center gap-3">
              <div className="flex size-9 items-center justify-center rounded-lg bg-blue-100 sm:size-10">
                <PlusCircle className="size-4 text-blue-600 sm:size-5" />
              </div>
              <div>
                <h4 className="font-medium">Create Lesson</h4>
                <p className="text-sm text-muted-foreground">Add new content</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer transition-shadow hover:shadow-lg">
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center gap-3">
              <div className="flex size-9 items-center justify-center rounded-lg bg-green-100 sm:size-10">
                <Upload className="size-4 text-green-600 sm:size-5" />
              </div>
              <div>
                <h4 className="font-medium">Upload Content</h4>
                <p className="text-sm text-muted-foreground">Add resources</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer transition-shadow hover:shadow-lg">
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center gap-3">
              <div className="flex size-9 items-center justify-center rounded-lg bg-purple-100 sm:size-10">
                <MessageSquare className="size-4 text-purple-600 sm:size-5" />
              </div>
              <div>
                <h4 className="font-medium">Messages</h4>
                <p className="text-sm text-muted-foreground">
                  Student inquiries
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer transition-shadow hover:shadow-lg">
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center gap-3">
              <div className="flex size-9 items-center justify-center rounded-lg bg-orange-100 sm:size-10">
                <FileText className="size-4 text-orange-600 sm:size-5" />
              </div>
              <div>
                <h4 className="font-medium">Grade Book</h4>
                <p className="text-sm text-muted-foreground">Manage grades</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
