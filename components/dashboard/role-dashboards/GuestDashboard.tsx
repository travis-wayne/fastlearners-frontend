"use client";

import Link from "next/link";
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
  if (user.name && user.name.trim()) return user.name.split(" ")[0];
  if (user.username && user.username.trim()) return user.username;
  if (user.email) return (user.email.split("@")[0] || "Learner").replace(/\./g, " ");
  return "Learner";
}

export function GuestDashboard() {
  const today = format(new Date(), "EEEE do, yyyy");
  const { user } = useAuthStore();
  const displayName = formatDisplayName(user as any);
  const role = (user?.role?.[0] || "guest") as string;
  const roleLabel = role.charAt(0).toUpperCase() + role.slice(1);

  const lessons = [
    "Chemistry: Redox Equation",
    "Physics: Radioactivity",
    "Mathematics: Simultaneous Equation",
  ];

  return (
    <div className="space-y-6">
      {/* Hero banner */}
      <Card className="overflow-hidden border-none bg-gradient-to-br from-muted to-background shadow-none">
        <CardContent className="flex flex-col gap-6 p-6 md:flex-row md:items-center md:justify-between">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">{today}</p>
            <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
              Good Morning, {displayName}
            </h1>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="h-5 px-2 text-xs">Role: {roleLabel}</Badge>
              {user?.email ? (
                <Badge variant="outline" className="h-5 px-2 text-xs">{user.email}</Badge>
              ) : null}
            </div>
            <p className="max-w-xl text-sm text-muted-foreground">
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
        </CardContent>
      </Card>

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