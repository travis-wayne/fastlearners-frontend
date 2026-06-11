"use client";

import { useEffect, useState } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Clock, Calendar } from "lucide-react";

import { DashboardHeader } from "@/components/dashboard/header";
import { getGuardianChildSubjectDetails } from "@/lib/api/guardian";
import { GuardianChildSubjectDetail } from "@/lib/types/guardian";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function SubjectDetailPage() {
  const { id, subjectId } = useParams();
  const searchParams = useSearchParams();
  const classId = searchParams.get("classId");
  const childId = searchParams.get("childId");
  const router = useRouter();

  const [subjectDetail, setSubjectDetail] = useState<GuardianChildSubjectDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id && subjectId && classId && childId) {
      const fetchDetail = async () => {
        setIsLoading(true);
        try {
          const res = await getGuardianChildSubjectDetails(Number(childId), Number(classId), Number(subjectId));
          if (res.success && res.content) {
            setSubjectDetail(res.content);
          } else {
            setError(res.message || "Failed to load subject details");
          }
        } catch (err: any) {
          setError(err.message || "An error occurred");
        } finally {
          setIsLoading(false);
        }
      };
      fetchDetail();
    } else {
      setIsLoading(false);
      setError("Missing required parameters (id, subjectId, classId, or childId)");
    }
  }, [id, subjectId, classId, childId]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-[200px]" />
        <Skeleton className="h-6 w-[300px]" />
        <Skeleton className="h-[120px] w-full" />
        <Skeleton className="h-[400px] w-full" />
      </div>
    );
  }

  if (error || !subjectDetail) {
    return (
      <div className="space-y-6 text-center py-12">
        <h3 className="text-lg font-medium text-red-500">{error || "Subject not found"}</h3>
        <Button onClick={() => router.back()} variant="outline" className="mt-4">
          <ArrowLeft className="mr-2 size-4" /> Go Back
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button onClick={() => router.push(`/dashboard/children/${id}`)} variant="ghost" size="icon">
          <ArrowLeft className="size-5" />
        </Button>
        <DashboardHeader
          heading={`Subject Progress`}
          text="Review performance and lesson scores for this subject."
        />
      </div>

      <Card className="bg-gradient-to-br from-primary/10 to-transparent border-primary/20">
        <CardContent className="p-6">
          <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Overall Score</h3>
          <p className="mt-2 text-4xl font-bold">{subjectDetail.subject_total_score}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Lesson Scores</CardTitle>
        </CardHeader>
        <CardContent>
          {subjectDetail.lesson_scores.length === 0 ? (
             <div className="py-8 text-center text-muted-foreground border rounded-lg border-dashed">
                No lessons completed yet.
             </div>
          ) : (
            <div className="rounded-md border overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Lesson Topic</TableHead>
                    <TableHead>Term</TableHead>
                    <TableHead>Start Date</TableHead>
                    <TableHead>Last Attempted</TableHead>
                    <TableHead className="text-right">Total Score</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {subjectDetail.lesson_scores.map((lesson) => (
                    <TableRow key={lesson.id}>
                      <TableCell className="font-medium">{lesson.lesson_topic}</TableCell>
                      <TableCell>{lesson.term_name}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-muted-foreground text-sm">
                          <Calendar className="size-3" />
                          {lesson.start_date || "N/A"}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-muted-foreground text-sm">
                          <Clock className="size-3" />
                          {lesson.last_attempted_date || "N/A"}
                        </div>
                      </TableCell>
                      <TableCell className="text-right font-semibold">{lesson.lesson_total_score}</TableCell>
                      <TableCell className="text-right">
                        <Button asChild size="sm" variant="secondary">
                          <Link href={`/dashboard/children/${id}/lessons/${lesson.lesson_id}?childId=${lesson.child_id}`}>
                            Details
                          </Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
