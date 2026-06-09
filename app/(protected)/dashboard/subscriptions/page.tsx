"use client";

import { useEffect, useState } from "react";
import { getPackages } from "@/lib/api/subscription";
import { Package } from "@/lib/types/subscription";
import { PackageCard } from "@/components/subscription/package-card";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { PackageOpen, AlertCircle } from "lucide-react";

export default function SubscriptionsPage() {
  const [packages, setPackages] = useState<Package[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPackages() {
      try {
        const response = await getPackages();
        if (response.success && response.content?.packages) {
          setPackages(response.content.packages);
        } else {
          setError(response.message || "Failed to load packages.");
        }
      } catch (err) {
        setError("An unexpected error occurred.");
      } finally {
        setIsLoading(false);
      }
    }

    fetchPackages();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Subscription Plans</h1>
        <p className="mt-2 text-muted-foreground">
          Choose a plan that best fits your learning goals.
        </p>
      </div>

      {isLoading ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-48 rounded-lg" />
          ))}
        </div>
      ) : error ? (
        <Card className="border-destructive">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <AlertCircle className="mb-4 size-12 text-destructive" />
            <p className="text-lg font-medium text-destructive">{error}</p>
          </CardContent>
        </Card>
      ) : packages.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12 text-muted-foreground">
            <PackageOpen className="mb-4 size-12" />
            <p className="text-lg font-medium">No packages available</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {packages.map((pkg) => (
            <PackageCard key={pkg.id} package={pkg} />
          ))}
        </div>
      )}
    </div>
  );
}
