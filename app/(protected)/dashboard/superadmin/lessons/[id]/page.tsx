"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { getLesson as getLessonById, getErrorMessage } from "@/lib/api/lessons-api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function LessonDetailPage() {
  const params = useParams<{ id: string }>();
  const id = Number(params?.id);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lesson, setLesson] = useState<any>(null);

  useEffect(() => {
    let mounted = true;
    async function load() {
      if (!id || Number.isNaN(id)) {
        setError("Invalid lesson id");
        setLoading(false);
        return;
      }
      setLoading(true);
      setError(null);
      try {
        const res = await getLessonById(id);
        if (mounted) {
          if (res.success) setLesson(res.content);
          else setError(res.message || "Failed to load lesson");
        }
      } catch (e: any) {
        if (mounted) setError(getErrorMessage(e));
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => { mounted = false; };
  }, [id]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Lesson Detail</h1>
{id ? (
          <Link href={`/dashboard/superadmin/lessons/${id}/content`}>
            <Button variant="secondary">View Full Content</Button>
          </Link>
        ) : null}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lesson</CardTitle>
          <CardDescription>Fetched from /api/v1/superadmin/lessons/lesson/{id}</CardDescription>
        </CardHeader>
        <CardContent>
          {loading && <p>Loading…</p>}
          {error && (
            <div className="rounded-md border border-red-300 bg-red-50 p-3 text-red-800">
              {error}
            </div>
          )}
          {!loading && !error && lesson && (
            <div className="space-y-4">
              <div>
                <h2 className="text-xl font-medium">{lesson.topic}</h2>
                <p className="text-sm text-muted-foreground">Status: {lesson.status}</p>
              </div>
              <Separator />
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                <div>
                  <div className="text-xs text-muted-foreground">Class</div>
                  <div className="font-medium">{lesson.class}</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Subject</div>
                  <div className="font-medium">{lesson.subject}</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Term</div>
                  <div className="font-medium">{lesson.term}</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Week</div>
                  <div className="font-medium">{lesson.week}</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Created</div>
                  <div className="font-medium">{lesson.created_at}</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Updated</div>
                  <div className="font-medium">{lesson.updated_at}</div>
                </div>
              </div>
              <Separator />
              <div className="space-y-2">
                <div className="text-sm font-medium">Overview</div>
                <p className="text-sm leading-relaxed">{lesson.overview}</p>
              </div>
              <div className="space-y-2">
                <div className="text-sm font-medium">Summary</div>
                <p className="text-sm leading-relaxed">{lesson.summary}</p>
              </div>
              <div className="space-y-2">
                <div className="text-sm font-medium">Application</div>
                <p className="text-sm leading-relaxed">{lesson.application}</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex gap-3">
<Link href="/dashboard/superadmin/lessons">
          <Button variant="outline">Back to Lessons</Button>
        </Link>
{id ? (
          <Link href={`/dashboard/superadmin/lessons/${id}/content`}>
            <Button>Open Content</Button>
          </Link>
        ) : null}
      </div>
    </div>
  );
}
