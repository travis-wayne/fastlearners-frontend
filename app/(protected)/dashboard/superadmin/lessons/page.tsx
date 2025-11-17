"use client";

import { useState } from "react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { DashboardHeader } from "@/components/dashboard/header";

export default function LessonsPage() {
  const [lessonId, setLessonId] = useState("");

  return (
    <div className="space-y-6">
      <DashboardHeader
        heading="Lesson Management"
        text="Manage lesson content for FastLeaners"
      />

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Open Lesson by ID</CardTitle>
            <CardDescription>Fetch specific lesson details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Input
              placeholder="Enter lesson ID (e.g. 2)"
              value={lessonId}
              onChange={(e) => setLessonId(e.target.value)}
              inputMode="numeric"
            />
            <Link
              href={
                lessonId ? `/dashboard/superadmin/lessons/${lessonId}` : "#"
              }
            >
              <Button disabled={!lessonId} className="w-full">
                Open Lesson
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Upload Content</CardTitle>
            <CardDescription>Add new lessons</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/dashboard/superadmin/lessons/upload">
              <Button className="w-full">Upload Lessons</Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Browse Lessons</CardTitle>
            <CardDescription>Search and view all lessons</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/dashboard/superadmin/lessons/browse">
              <Button variant="secondary" className="w-full">
                Browse Lessons
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
