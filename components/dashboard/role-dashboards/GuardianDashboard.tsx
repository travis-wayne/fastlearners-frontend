"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  TrendingUp, 
  Clock, 
  Trophy,
  Target,
  Calendar,
  ChevronRight,
  Star,
  BookOpen,
  MessageCircle,
  Bell
} from "lucide-react";

export function GuardianDashboard() {
  // Mock data for children - replace with real data from your API
  const children = [
    { 
      id: 1, 
      name: "Alex Johnson", 
      grade: "Grade 8", 
      weeklyProgress: 85, 
      currentStreak: 7,
      todayStatus: "completed",
      upcomingAssignments: 2
    },
    { 
      id: 2, 
      name: "Emma Johnson", 
      grade: "Grade 5", 
      weeklyProgress: 78, 
      currentStreak: 3,
      todayStatus: "in-progress", 
      upcomingAssignments: 1
    },
  ];

  const weeklyOverview = [
    { day: "Mon", completion: 95 },
    { day: "Tue", completion: 88 },
    { day: "Wed", completion: 92 },
    { day: "Thu", completion: 85 },
    { day: "Fri", completion: 90 },
    { day: "Sat", completion: 78 },
    { day: "Sun", completion: 82 },
  ];

  const notifications = [
    { 
      id: 1, 
      child: "Alex", 
      message: "Completed Math assignment with 95% score", 
      time: "2 hours ago",
      type: "achievement"
    },
    { 
      id: 2, 
      child: "Emma", 
      message: "Has an upcoming Science quiz tomorrow", 
      time: "5 hours ago",
      type: "reminder"
    },
  ];

  return (
    <div className="space-y-8">
      {/* Children Overview Cards */}
      <div className="grid gap-6 md:grid-cols-2">
        {children.map((child) => (
          <Card key={child.id} className="relative">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <div className="flex size-8 items-center justify-center rounded-full bg-primary/10">
                      <Users className="size-4 text-primary" />
                    </div>
                    {child.name}
                  </CardTitle>
                  <CardDescription>{child.grade}</CardDescription>
                </div>
                <Badge 
                  variant={child.todayStatus === "completed" ? "default" : "secondary"}
                >
                  {child.todayStatus === "completed" ? "✓ Today Complete" : "In Progress"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Weekly Progress</span>
                  <span className="text-sm text-muted-foreground">{child.weeklyProgress}%</span>
                </div>
                <Progress value={child.weeklyProgress} className="h-2" />
              </div>
              
              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">{child.currentStreak}</div>
                  <div className="text-xs text-muted-foreground">Day Streak</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-500">{child.upcomingAssignments}</div>
                  <div className="text-xs text-muted-foreground">Due Soon</div>
                </div>
              </div>
              
              <div className="pt-2">
                <Link href={`/dashboard/guardian/child/${child.id}`}>
                  <Button variant="outline" size="sm" className="w-full">
                    View Details
                    <ChevronRight className="ml-2 size-4" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Weekly Family Progress */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="size-5" />
              Family Weekly Overview
            </CardTitle>
            <CardDescription>
              Combined progress across all children
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {weeklyOverview.map((day, index) => (
                <div key={day.day} className="flex items-center gap-3">
                  <div className="w-12 text-sm font-medium">{day.day}</div>
                  <div className="flex-1">
                    <Progress value={day.completion} className="h-2" />
                  </div>
                  <div className="w-12 text-right text-sm text-muted-foreground">
                    {day.completion}%
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Notifications */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="size-5" />
              Recent Updates
            </CardTitle>
            <CardDescription>
              Latest activity from your children
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {notifications.map((notification) => (
              <div key={notification.id} className="space-y-1 rounded-lg bg-muted/50 p-3">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">{notification.child}</Badge>
                  {notification.type === "achievement" && (
                    <Trophy className="size-3 text-yellow-500" />
                  )}
                </div>
                <p className="text-sm">{notification.message}</p>
                <p className="text-xs text-muted-foreground">{notification.time}</p>
              </div>
            ))}
            <Button variant="outline" size="sm" className="mt-3 w-full">
              View All Notifications
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
                <h4 className="font-medium">Progress Reports</h4>
                <p className="text-sm text-muted-foreground">View detailed reports</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer transition-shadow hover:shadow-lg">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-lg bg-green-100">
                <MessageCircle className="size-5 text-green-600" />
              </div>
              <div>
                <h4 className="font-medium">Contact Teachers</h4>
                <p className="text-sm text-muted-foreground">Send messages</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer transition-shadow hover:shadow-lg">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-lg bg-purple-100">
                <Calendar className="size-5 text-purple-600" />
              </div>
              <div>
                <h4 className="font-medium">Schedule</h4>
                <p className="text-sm text-muted-foreground">View upcoming events</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer transition-shadow hover:shadow-lg">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-lg bg-orange-100">
                <Target className="size-5 text-orange-600" />
              </div>
              <div>
                <h4 className="font-medium">Set Goals</h4>
                <p className="text-sm text-muted-foreground">Family learning goals</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
