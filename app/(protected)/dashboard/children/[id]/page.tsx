"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, BookOpen } from "lucide-react";

import { DashboardHeader } from "@/components/dashboard/header";
import { getGuardianChild } from "@/lib/api/guardian";
import { GuardianChildDetail } from "@/lib/types/guardian";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

export default function ChildDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  
  const [childDetail, setChildDetail] = useState<GuardianChildDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      const fetchDetail = async () => {
        setIsLoading(true);
        try {
          const res = await getGuardianChild(Number(id));
          if (res.success && res.content) {
            setChildDetail(res.content);
          } else {
            setError(res.message || "Failed to load child details");
          }
        } catch (err: any) {
          setError(err.message || "An error occurred");
        } finally {
          setIsLoading(false);
        }
      };
      fetchDetail();
    }
  }, [id]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-[200px]" />
        <Skeleton className="h-6 w-[300px]" />
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map(i => <Skeleton key={i} className="h-40 w-full" />)}
        </div>
      </div>
    );
  }

  if (error || !childDetail) {
    return (
      <div className="space-y-6 py-12 text-center">
        <h3 className="text-lg font-medium text-red-500">{error || "Child not found"}</h3>
        <Button onClick={() => router.back()} variant="outline" className="mt-4">
          <ArrowLeft className="mr-2 size-4" /> Go Back
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button onClick={() => router.push("/dashboard/children")} variant="ghost" size="icon">
          <ArrowLeft className="size-5" />
        </Button>
        <DashboardHeader
          heading={`Child Dashboard: ${childDetail.child_id}`}
          text="View enrolled subjects and progress."
        />
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {childDetail.child_subjects.length === 0 ? (
          <div className="col-span-full rounded-lg border border-dashed py-12 text-center text-muted-foreground">
            No subjects found for this child.
          </div>
        ) : (
          childDetail.child_subjects.map((subject) => (
            <Card key={subject.id} className="transition-shadow hover:shadow-md">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="rounded-lg bg-primary/10 p-2">
                    <BookOpen className="size-5 text-primary" />
                  </div>
                  <Badge variant="secondary">{subject.slug}</Badge>
                </div>
                <CardTitle className="mt-4">{subject.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <Button asChild className="w-full">
                  <Link href={`/dashboard/children/${id}/subjects/${subject.id}?classId=${childDetail.class_id}&childId=${childDetail.child_id}`}>
                    View Subject Progress
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
