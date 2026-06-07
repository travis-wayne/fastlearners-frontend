"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  BookOpen,
  CheckCircle2,
  Eye,
  HelpCircle,
  Users,
} from "lucide-react";

import { getGuardianChildrenHistory } from "@/lib/api/guardian";
import { ChildRequestItem } from "@/lib/types/guardian";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RecordsSkeleton } from "./RecordsSkeleton";

export function GuardianRecordsPage() {
  const [acceptedChildren, setAcceptedChildren] = useState<ChildRequestItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedChildId, setSelectedChildId] = useState<number | null>(null);

  const fetchChildren = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await getGuardianChildrenHistory();
      if (res.success) {
        if (res.content?.history?.request_history) {
          const accepted = res.content.history.request_history.filter(
            (item) => item.status === "accepted"
          );
          setAcceptedChildren(accepted);
        } else {
          setAcceptedChildren([]);
        }
      } else {
        setAcceptedChildren([]);
        setError(res.message || "Unable to load children. Please try again.");
      }
    } catch (err) {
      console.error("Failed to fetch guardian children:", err);
      setAcceptedChildren([]);
      setError("Unable to load children. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchChildren();
  }, [fetchChildren]);

  if (isLoading) {
    return (
      <div className="container py-6">
        <RecordsSkeleton />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-6">
        <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-destructive">
          <div className="flex items-center gap-2 font-semibold">
            <HelpCircle className="size-4" />
            Error
          </div>
          <div className="mt-1 text-sm">{error}</div>
          <Button
            variant="outline"
            size="sm"
            className="mt-3"
            onClick={fetchChildren}
          >
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  if (acceptedChildren.length === 0) {
    return (
      <div className="container py-6">
        <Card className="mx-auto max-w-md text-center">
          <CardContent className="pt-6">
            <Users className="mx-auto mb-4 size-12 text-muted-foreground" />
            <h3 className="mb-2 text-lg font-semibold">No Linked Children</h3>
            <p className="mb-6 text-muted-foreground">
              You don&apos;t have any accepted child links yet.
            </p>
            <Button asChild>
              <Link href="/dashboard/children">Manage Children</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const selectedChild = acceptedChildren.find((c) => c.id === selectedChildId);

  return (
    <div className="container space-y-6 pb-20 pt-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="flex items-center gap-3 text-3xl font-bold">
            <Eye className="size-8 text-primary" />
            Academic Records
          </h1>
          <p className="mt-1 text-muted-foreground">
            Monitor your children&apos;s academic progress
          </p>
        </div>
        <Select
          value={selectedChildId ? String(selectedChildId) : undefined}
          onValueChange={(val) => setSelectedChildId(Number(val))}
        >
          <SelectTrigger className="w-full md:w-[250px]">
            <SelectValue placeholder="Select a child to view records" />
          </SelectTrigger>
          <SelectContent>
            {acceptedChildren.map((child) => (
              <SelectItem key={child.id} value={String(child.id)}>
                {child.child_name} — {child.class}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {selectedChild && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-6"
        >
          <Card>
            <CardContent className="flex items-center justify-between p-6">
              <div>
                <div className="mb-2 flex items-center gap-3">
                  <h2 className="text-xl font-bold">{selectedChild.child_name}</h2>
                  <Badge>{selectedChild.class}</Badge>
                  <Badge variant="secondary">Monitoring</Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  You are viewing {selectedChild.child_name}&apos;s academic records. Scores are based on their lesson activity.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="size-5 text-primary" />
                Subjects Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg border border-dashed p-8 text-center">
                <p className="text-muted-foreground">
                  Subject performance data is available when your child completes lessons. Encourage them to start learning!
                </p>
                {/* TODO: Render child subject scores when backend exposes child-scoped score endpoints */}
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <Card>
              <CardContent className="flex flex-col items-center p-6 text-center">
                <BookOpen className="mb-3 size-8 text-blue-500" />
                <h3 className="font-semibold">View Lessons</h3>
                <p className="mt-1 text-xs text-muted-foreground">
                  Accessible to your child when they log in.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex flex-col items-center p-6 text-center">
                <HelpCircle className="mb-3 size-8 text-purple-500" />
                <h3 className="font-semibold">View Quizzes</h3>
                <p className="mt-1 text-xs text-muted-foreground">
                  Accessible to your child when they log in.
                </p>
              </CardContent>
            </Card>
            <Card className="transition-colors hover:bg-muted/50">
              <Link href="/dashboard/children">
                <CardContent className="flex flex-col items-center p-6 text-center">
                  <Users className="mb-3 size-8 text-emerald-500" />
                  <h3 className="font-semibold">Manage Children</h3>
                </CardContent>
              </Link>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Guardian Tips</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-green-500" />
                  <span>Check in regularly to see your child&apos;s progress</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-green-500" />
                  <span>Encourage daily lesson completion</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-green-500" />
                  <span>Celebrate A grades (90%+) to motivate your child</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
}
