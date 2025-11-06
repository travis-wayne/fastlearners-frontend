"use client";

import Link from "next/link";
import { useMemo, useState, useEffect } from "react";
import {
  Bell,
  BookOpen,
  Calendar,
  ChevronRight,
  Clock,
  MessageCircle,
  Star,
  Target,
  TrendingUp,
  Trophy,
  Users,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

import { format } from "date-fns";
import { Medal, ShieldCheck, Smile } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useAuthStore } from "@/store/authStore";

function formatDisplayName(user?: { name?: string | null; username?: string | null; email?: string | null }) {
  if (!user) return "Learner";
  const candidates = [user.name, user.username, user.email].filter(
    (v): v is string => typeof v === "string" && v.trim().length > 0,
  );
  const first = candidates[0];
  if (!first) return "Learner";
  const base = first.includes("@") ? first.split("@")[0] : first;
  return base.split(" ")[0].replace(/\./g, " ");
}

export function GuardianDashboard() {
  const today = format(new Date(), "EEEE do, yyyy");
  const { user } = useAuthStore();
  const displayName = formatDisplayName(user as any);
  const role = (user?.role?.[0] || "guardian") as string;
  const roleLabel = role.charAt(0).toUpperCase() + role.slice(1);

  const [timePeriod, setTimePeriod] = useState<"morning" | "afternoon" | "evening" | "night">("morning");
  useEffect(() => {
    const update = () => {
      const h = new Date().getHours();
      if (h >= 5 && h < 12) setTimePeriod("morning");
      else if (h >= 12 && h < 17) setTimePeriod("afternoon");
      else if (h >= 17 && h < 21) setTimePeriod("evening");
      else setTimePeriod("night");
    };
    update();
    const id = setInterval(update, 60_000);
    return () => clearInterval(id);
  }, []);

  const headerGradient = useMemo(() => {
    switch (timePeriod) {
      case "morning":
        return "bg-gradient-to-br from-purple-200 via-slate-200 to-blue-100 dark:from-purple-500 dark:via-slate-700 dark:to-blue-700";
      case "afternoon":
        return "bg-gradient-to-br from-indigo-200 via-slate-200 to-teal-100 dark:from-indigo-500 dark:via-slate-700 dark:to-teal-700";
      case "evening":
        return "bg-gradient-to-br from-pink-200 via-purple-200 to-amber-100 dark:from-pink-600 dark:via-purple-700 dark:to-amber-700";
      case "night":
      default:
        return "bg-gradient-to-br from-slate-200 via-purple-200 to-blue-200 dark:from-slate-800 dark:via-purple-900 dark:to-blue-900";
    }
  }, [timePeriod]);

  // Mocked wards and metrics
  const wards = [
    { id: "w1", name: "MB" },
    { id: "w2", name: "AJ" },
  ];

  const overview = {
    learningHours: 300,
    quizzesCompleted: "6/20",
    lessonsCompleted: "10/200",
    subscription: "Active",
  };

  const performance = [
    { subject: "Mathematics", pct: 65 },
    { subject: "Physics", pct: 50 },
    { subject: "Chemistry", pct: 80 },
    { subject: "Biology", pct: 90 },
  ];

  const achievements = [
    { id: 1, label: "7-Day Learning Streak", icon: <ShieldCheck className="size-4 text-amber-500" /> },
    { id: 2, label: "Perfect Score", icon: <Medal className="size-4 text-yellow-500" /> },
    { id: 3, label: "Perfect Score", icon: <Medal className="size-4 text-yellow-500" /> },
  ];

  const Donut = ({ value }: { value: number }) => (
    <div className="relative size-24">
      <svg viewBox="0 0 36 36" className="size-24">
        <path
          className="fill-none stroke-muted"
          strokeWidth="3"
          d="M18 2.0845
             a 15.9155 15.9155 0 0 1 0 31.831
             a 15.9155 15.9155 0 0 1 0 -31.831"
        />
        <path
          className="fill-none stroke-primary"
          strokeWidth="3"
          strokeDasharray={`${value}, 100`}
          d="M18 2.0845
             a 15.9155 15.9155 0 0 1 0 31.831
             a 15.9155 15.9155 0 0 1 0 -31.831"
        />
      </svg>
      <div className="absolute inset-0 grid place-items-center">
        <span className="text-lg font-semibold">{value}%</span>
      </div>
    </div>
  );

  return (
    <div className="container mx-auto space-y-6 p-4 md:p-6">
      {/* Header banner */}
      <div className={`relative overflow-hidden rounded-2xl p-6 ${headerGradient} transition-all duration-700 ease-in-out`}>
        <div className="grid gap-6 md:grid-cols-[1fr_auto] md:items-center">
          <div>
            <p className="text-sm text-gray-900 dark:text-white/90">{today}</p>
            <h2 className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">Good Morning, {displayName}</h2>
            <div className="mt-1 flex flex-wrap items-center gap-2">
              <Badge variant="secondary" className="h-5 px-2 text-xs">Role: {roleLabel}</Badge>
              {user?.email ? (
                <Badge variant="outline" className="h-5 px-2 text-xs">{user.email}</Badge>
              ) : null}
            </div>
            <p className="mt-2 max-w-xl text-sm text-gray-700 dark:text-white/90">
              Possible announcements // Possible announcements // Possible announcements.
            </p>
          </div>
          <div className="hidden select-none md:block">
            <div className="relative size-28">
              <div className="absolute inset-0 rounded-full bg-yellow-300" />
              <div className="absolute inset-1 rounded-full bg-yellow-200" />
              <div className="absolute right-4 top-6 h-3 w-5 rounded bg-black" />
              <div className="absolute right-10 top-6 h-3 w-5 rounded bg-black" />
              <div className="absolute right-7 top-12 h-1.5 w-10 rounded-full bg-amber-700" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Progress */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Progress</CardTitle>
            <CardDescription>Physics</CardDescription>
          </CardHeader>
          <CardContent className="flex items-center justify-center">
            <Donut value={72} />
          </CardContent>
        </Card>

        {/* Achievements */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Achievements</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {achievements.map((a) => (
              <div key={a.id} className="flex items-center justify-between rounded-md border p-2">
                <div className="flex items-center gap-2 text-sm">
                  {a.icon}
                  <span>{a.label}</span>
                </div>
                <Smile className="size-4 text-primary" />
              </div>
            ))}
            <Button variant="outline" size="sm" className="mt-2 w-full">
              View All Achievements
            </Button>
          </CardContent>
        </Card>

        {/* Overview + Ward select */}
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Select Ward</CardTitle>
              <Select defaultValue={wards[0].id}>
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder="Select Ward" />
                </SelectTrigger>
                <SelectContent>
                  {wards.map((w) => (
                    <SelectItem key={w.id} value={w.id}>
                      {w.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <p className="text-sm font-medium">Overview</p>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-muted-foreground">Time Spent Learning</p>
                <p className="font-medium">{overview.learningHours} hrs</p>
              </div>
              <div>
                <p className="text-muted-foreground">Quizzes Comp.</p>
                <p className="font-medium">{overview.quizzesCompleted}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Lessons Comp.</p>
                <p className="font-medium">{overview.lessonsCompleted}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Subscription Status</p>
                <p className="font-medium">{overview.subscription}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">View Performance</CardTitle>
        </CardHeader>
        <CardContent>
            <div className="rounded-md border">
              <div className="grid grid-cols-1 items-center gap-4 px-4 py-3 text-sm font-medium text-muted-foreground md:grid-cols-[220px_1fr]">
              <span>Performance</span>
              <span>Lesson’s Progress</span>
            </div>
            <Separator />
            <div className="divide-y">
              {performance.map((row) => (
                <div key={row.subject} className="grid grid-cols-1 items-center gap-4 px-4 py-3 md:grid-cols-[220px_1fr]">
                  <span className="text-sm">{row.subject}</span>
                  <div className="flex items-center gap-3">
                    <div className="h-2 w-full rounded bg-muted">
                      <div
                        className="h-2 rounded bg-primary"
                        style={{ width: `${row.pct}%` }}
                      />
                    </div>
                    <span className="w-10 shrink-0 text-right text-xs text-muted-foreground">
                      {row.pct}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
