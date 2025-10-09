"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { format } from "date-fns";
import { ArrowRight, BookOpen, History, ListChecks } from "lucide-react";

import { useAuthStore } from "@/store/authStore";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

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

export function GuestDashboard() {
  const today = format(new Date(), "EEEE do, yyyy");
  const { user } = useAuthStore();
  const displayName = formatDisplayName(user as any);
  const role = (user?.role?.[0] || "guest") as string;
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
      <div className={`relative overflow-hidden rounded-2xl p-6 ${headerGradient} transition-all duration-700 ease-in-out`}>
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="space-y-2">
            <p className="text-sm text-white/90">{today}</p>
            <h1 className="text-2xl font-bold tracking-tight text-white md:text-3xl">
              Good Morning, {displayName}
            </h1>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="h-5 px-2 text-xs">Role: {roleLabel}</Badge>
              {user?.email ? (
                <Badge variant="outline" className="h-5 px-2 text-xs">{user.email}</Badge>
              ) : null}
            </div>
            <p className="max-w-xl text-sm text-white/90">
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

      {/* Quick panels */}
      <div className="grid gap-6 md:grid-cols-3">
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
          <CardFooter>
            <Link href="/dashboard/lessons" className="w-full">
              <Button variant="outline" className="w-full">
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
          <CardFooter>
            <Link href="/dashboard/quizzes" className="w-full">
              <Button className="w-full">
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
          <CardFooter>
            <Link href="/dashboard/past-questions" className="w-full">
              <Button variant="outline" className="w-full">
                View All Quizzes
                <ArrowRight className="ml-2 size-4" />
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </div>

      {/* Helpful hints */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Upgrade</CardTitle>
            <CardDescription>Access full learning experience</CardDescription>
          </CardHeader>
          <CardFooter className="pt-0">
            <Button size="sm" className="w-full">
              Upgrade Now
            </Button>
          </CardFooter>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Support</CardTitle>
            <CardDescription>We’re here to help</CardDescription>
          </CardHeader>
          <CardFooter className="pt-0">
            <Button variant="outline" size="sm" className="w-full">
              Contact Support
            </Button>
          </CardFooter>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">What’s New</CardTitle>
            <CardDescription>Latest features and tips</CardDescription>
          </CardHeader>
          <CardFooter className="pt-0">
            <Button variant="ghost" size="sm" className="w-full">
              Learn More
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}