"use client";

import { useEffect, useState } from "react";
import { getPackage } from "@/lib/api/subscription";
import { Package } from "@/lib/types/subscription";
import { PackageCard } from "@/components/subscription/package-card";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft, AlertCircle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

export default function SubscriptionDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [pkg, setPkg] = useState<Package | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPackage() {
      if (!params.id) return;
      try {
        const response = await getPackage(Number(params.id));
        if (response.success && response.content?.package) {
          setPkg(response.content.package);
        } else {
          setError(response.message || "Failed to load package details.");
        }
      } catch (err) {
        setError("An unexpected error occurred.");
      } finally {
        setIsLoading(false);
      }
    }

    fetchPackage();
  }, [params.id]);

  return (
    <div className="space-y-6">
      <div>
        <Button variant="ghost" onClick={() => router.back()} className="mb-4">
          <ArrowLeft className="mr-2 size-4" />
          Back to Plans
        </Button>
      </div>

      {isLoading ? (
        <Skeleton className="h-64 w-full" />
      ) : error || !pkg ? (
        <Card className="mx-auto max-w-lg border-destructive">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <AlertCircle className="mb-4 size-12 text-destructive" />
            <p className="mb-6 text-lg font-medium text-destructive">
              {error || "Package not found."}
            </p>
            <Button onClick={() => router.back()}>Back to Plans</Button>
          </CardContent>
        </Card>
      ) : (
        <div className="mx-auto max-w-lg">
          <PackageCard package={pkg} showSubscribeButton showViewButton={false} />
        </div>
      )}
    </div>
  );
}
