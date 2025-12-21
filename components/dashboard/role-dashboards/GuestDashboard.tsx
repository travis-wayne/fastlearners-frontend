"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useAuthStore } from "@/store/authStore";
import { format } from "date-fns";
import { ArrowRight, BookOpen, History, ListChecks } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

function formatDisplayName(user?: {
  name?: string | null;
  username?: string | null;
  email?: string | null;
}) {
  if (!user) return "Learner";
  const candidates = [user.name, user.username, user.email].filter(
    (v): v is string => typeof v === "string" && v.trim().length > 0,
  );
  const first = candidates[0];
  if (!first) return "Learner";
  const base = first.includes("@") ? first.split("@")[0] : first;
  return base.split(" ")[0].replace(/\./g, " ");
}

export function GuestDashboard() {
  const today = format(new Date(), "EEEE do, yyyy");
  const { user } = useAuthStore();
  const displayName = formatDisplayName(user as any);
  const role = (user?.role?.[0] || "guest") as string;
  const roleLabel = role.charAt(0).toUpperCase() + role.slice(1);

  const [timePeriod, setTimePeriod] = useState<
    "morning" | "afternoon" | "evening" | "night"
  >("morning");
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
    // Guest uses bold blues as in reference
    switch (timePeriod) {
      case "morning":
        return "bg-gradient-to-br from-blue-700 via-blue-600 to-cyan-600 dark:from-blue-700 dark:via-blue-700 dark:to-cyan-700";
      case "afternoon":
        return "bg-gradient-to-br from-blue-600 via-indigo-600 to-cyan-600";
      case "evening":
        return "bg-gradient-to-br from-indigo-700 via-blue-700 to-purple-700";
      case "night":
      default:
        return "bg-gradient-to-br from-slate-800 via-blue-900 to-indigo-900";
    }
  }, [timePeriod]);

  const lessons = [
    "Chemistry: Redox Equation",
    "Physics: Radioactivity",
    "Mathematics: Simultaneous Equation",
  ];

  return (
    <div className="space-y-6">
      {/* Hero banner */}
      <div
        className={`relative overflow-hidden rounded-2xl p-4 sm:p-6 ${headerGradient} transition-all duration-700 ease-in-out`}
      >
        <div className="flex flex-col gap-4 sm:gap-6 md:flex-row md:items-center md:justify-between">
          <div className="space-y-2">
            <p className="text-sm text-white/90">{today}</p>
            <h1 className="text-xl font-bold tracking-tight text-white sm:text-2xl md:text-3xl">
              Good Morning, {displayName}
            </h1>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="h-4 px-1.5 text-[10px] sm:h-5 sm:px-2 sm:text-xs">
                Role: {roleLabel}
              </Badge>
              {user?.email ? (
                <Badge variant="outline" className="h-4 px-1.5 text-[10px] sm:h-5 sm:px-2 sm:text-xs">
                  {user.email}
                </Badge>
              ) : null}
            </div>
            <p className="max-w-xl text-sm text-white/90">
              Possible announcements // Possible announcements // Possible
              announcements.
            </p>
          </div>
          <div className="hidden select-none md:block">
            <div className="relative size-20 sm:size-24 md:size-28">
              <div className="absolute inset-0 rounded-full bg-yellow-300" />
              <div className="absolute inset-1 rounded-full bg-yellow-200" />
              <div className="absolute right-3 top-5 h-2.5 w-4 rounded bg-black sm:right-4 sm:top-6 sm:h-3 sm:w-5" />
              <div className="absolute right-8 top-5 h-2.5 w-4 rounded bg-black sm:right-10 sm:top-6 sm:h-3 sm:w-5" />
              <div className="absolute right-6 top-10 h-1.5 w-8 rounded-full bg-amber-700 sm:right-7 sm:top-12 sm:h-1.5 sm:w-10" />
            </div>
          </div>
        </div>
      </div>

      {/* Quick panels */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <BookOpen className="size-4" /> View Lessons
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-1 text-sm text-muted-foreground">
            {lessons.map((t) => (
              <p key={t}>{t}</p>
            ))}
          </CardContent>
          <CardFooter className="p-4 pt-0 sm:p-6 sm:pt-0">
            <Link href="/dashboard/lessons" className="w-full">
              <Button variant="outline" className="h-10 w-full sm:h-11">
                View All Lessons
                <ArrowRight className="ml-2 size-4" />
              </Button>
            </Link>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <ListChecks className="size-4" /> View Quiz
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-1 text-sm text-muted-foreground">
            {lessons.map((t) => (
              <p key={t}>{t}</p>
            ))}
          </CardContent>
          <CardFooter className="p-4 pt-0 sm:p-6 sm:pt-0">
            <Link href="/dashboard/quizzes" className="w-full">
              <Button className="h-10 w-full sm:h-11">
                View All Quizzes
                <ArrowRight className="ml-2 size-4" />
              </Button>
            </Link>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <History className="size-4" /> View Past Questions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-1 text-sm text-muted-foreground">
            {lessons.map((t) => (
              <p key={t}>{t}</p>
            ))}
          </CardContent>
          <CardFooter className="p-4 pt-0 sm:p-6 sm:pt-0">
            <Link href="/dashboard/past-questions" className="w-full">
              <Button variant="outline" className="h-10 w-full sm:h-11">
                View All Quizzes
                <ArrowRight className="ml-2 size-4" />
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </div>

      {/* Helpful hints */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Upgrade</CardTitle>
            <CardDescription>Access full learning experience</CardDescription>
          </CardHeader>
          <CardFooter className="p-4 pt-0 sm:p-6 sm:pt-0">
            <Button size="sm" className="h-9 w-full sm:h-10">
              Upgrade Now
            </Button>
          </CardFooter>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Support</CardTitle>
            <CardDescription>We’re here to help</CardDescription>
          </CardHeader>
          <CardFooter className="p-4 pt-0 sm:p-6 sm:pt-0">
            <Button variant="outline" size="sm" className="h-9 w-full sm:h-10">
              Contact Support
            </Button>
          </CardFooter>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">What’s New</CardTitle>
            <CardDescription>Latest features and tips</CardDescription>
          </CardHeader>
          <CardFooter className="p-4 pt-0 sm:p-6 sm:pt-0">
            <Button variant="ghost" size="sm" className="h-9 w-full sm:h-10">
              Learn More
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
