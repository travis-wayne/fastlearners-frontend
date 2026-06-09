"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getSubscriptionHistory } from "@/lib/api/subscription";
import { Subscription } from "@/lib/types/subscription";
import { Skeleton } from "@/components/ui/skeleton";
import { getSubscriptionStatusBadge } from "@/lib/utils/subscription-status";
import { parseDateString } from "@/lib/utils";
import { AlertCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

export function DisplayForm() {
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchHistory() {
      try {
        setIsLoading(true);
        setError(null);
        const response = await getSubscriptionHistory();
        if (response.code === 404) {
          setSubscription(null);
        } else if (response.success && Array.isArray(response.content) && response.content.length > 0) {
          const firstBucket = response.content[0];
          if (firstBucket && Array.isArray(firstBucket.subscriptions) && firstBucket.subscriptions.length > 0) {
            setSubscription(firstBucket.subscriptions[0]);
          } else {
            setSubscription(null);
          }
        } else {
          setError(response.message || "Failed to load subscription history.");
        }
      } catch (err) {
        setError("An unexpected error occurred while loading subscription data.");
      } finally {
        setIsLoading(false);
      }
    }
    fetchHistory();
  }, []);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Subscription Details</CardTitle>
          <CardDescription>
            Manage your account preferences and subscription.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Skeleton className="h-10 w-full" />
          <Separator />
          <Skeleton className="h-10 w-full" />
          <Separator />
          <Skeleton className="h-10 w-full" />
          <Separator />
          <Skeleton className="h-10 w-full" />
          <Separator />
          <Skeleton className="h-10 w-full" />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Subscription Details</CardTitle>
          <CardDescription>
            Manage your account preferences and subscription.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center space-y-4 py-8 text-center">
          <AlertCircle className="size-12 text-destructive" />
          <p className="text-muted-foreground">{error}</p>
          <Button onClick={() => window.location.reload()} variant="outline">
            Retry
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (!subscription) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Subscription Details</CardTitle>
          <CardDescription>
            Manage your account preferences and subscription.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center space-y-4 py-8">
          <p className="text-muted-foreground">No active subscription found</p>
          <Button asChild variant="default">
            <Link href="/dashboard/subscriptions">View Plans</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Subscription Details</CardTitle>
        <CardDescription>
          Manage your account preferences and subscription.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <Label className="text-base">Subscription Status</Label>
          </div>
          <div>{getSubscriptionStatusBadge(subscription.status)}</div>
        </div>
        <Separator />
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <Label className="text-base">Package</Label>
          </div>
          <p className="text-sm font-medium">{subscription.package}</p>
        </div>
        <Separator />
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <Label className="text-base">Reference</Label>
          </div>
          <p className="font-mono text-sm">{subscription.subscription_reference}</p>
        </div>
        <Separator />
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <Label className="text-base">Start Date</Label>
          </div>
          <p className="text-sm text-muted-foreground">
            {parseDateString(subscription.starts_at)?.toLocaleDateString() || "—"}
          </p>
        </div>
        <Separator />
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <Label className="text-base">Expiry Date</Label>
          </div>
          <p className="text-sm text-muted-foreground">
            {parseDateString(subscription.expires_at)?.toLocaleDateString() || "—"}
          </p>
        </div>
        
        <div className="mt-6 flex justify-end">
          <Button asChild variant="outline">
            <Link href="/dashboard/subscriptions">Manage Subscription</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
