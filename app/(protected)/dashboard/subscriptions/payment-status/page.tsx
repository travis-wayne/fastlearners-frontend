"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { getPaymentStatus } from "@/lib/api/subscription";
import { PaymentStatusContent } from "@/lib/types/subscription";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { CheckCircle2, XCircle, ArrowLeft } from "lucide-react";
import Link from "next/link";

function PaymentStatusInner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [data, setData] = useState<PaymentStatusContent | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const reference = searchParams.get("reference");
    
    if (!reference) {
      router.replace("/dashboard/subscriptions");
      return;
    }

    async function fetchStatus() {
      try {
        const response = await getPaymentStatus(reference as string);
        console.log("[PaymentStatus] raw response:", JSON.stringify(response, null, 2));
        if (response.success && response.content) {
          setData(response.content);
        } else {
          setError(response.message || "Failed to verify payment status.");
        }
      } catch (err) {
        setError("An unexpected error occurred while verifying payment.");
      } finally {
        setIsLoading(false);
      }
    }

    fetchStatus();
  }, [searchParams, router]);

  if (isLoading) {
    return (
      <Card className="mx-auto mt-12 max-w-lg">
        <CardHeader>
          <Skeleton className="mx-auto h-8 w-3/4" />
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="mt-6 h-10 w-full" />
        </CardContent>
      </Card>
    );
  }

  if (error || !data || !data.transaction_detail) {
    return (
      <Card className="mx-auto mt-12 max-w-lg border-destructive/50 bg-destructive/5">
        <CardContent className="flex flex-col items-center py-12">
          <XCircle className="mb-6 size-16 text-destructive" />
          <h2 className="mb-2 text-2xl font-bold">Payment Failed</h2>
          <p className="mb-6 text-center text-muted-foreground">
            {error || "Your transaction could not be completed successfully."}
            {searchParams.get("reference") && (
              <span className="mt-2 block text-sm">
                Reference: {searchParams.get("reference")}
              </span>
            )}
          </p>
          <Button asChild>
            <Link href="/dashboard/subscriptions">
              <ArrowLeft className="mr-2 size-4" />
              Try Again
            </Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  const { transaction_detail } = data;

  return (
    <Card className="mx-auto mt-12 max-w-lg border-primary/50 bg-primary/5">
      <CardContent className="flex flex-col items-center py-12">
        <CheckCircle2 className="mb-6 size-16 text-primary" />
        <h2 className="mb-2 text-2xl font-bold">Payment Successful!</h2>
        <p className="mb-8 text-muted-foreground">
          Your subscription has been activated.
        </p>

        <div className="mb-8 w-full space-y-4 rounded-lg border bg-background p-6">
          {transaction_detail.package && (
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Package</span>
              <span className="font-medium">{transaction_detail.package}</span>
            </div>
          )}
          {transaction_detail.amount && (
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Amount</span>
              <span className="font-medium">₦{transaction_detail.amount}</span>
            </div>
          )}
          {transaction_detail.coupon && (
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Coupon Applied</span>
              <span className="font-medium">{transaction_detail.coupon}</span>
            </div>
          )}
          {transaction_detail.discount_amount && transaction_detail.discount_amount !== "0.00" && (
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Discount</span>
              <span className="font-medium text-green-600">-₦{transaction_detail.discount_amount}</span>
            </div>
          )}
          {transaction_detail.final_amount && (
            <div className="flex items-center justify-between border-t pt-2">
              <span className="font-semibold">Total Paid</span>
              <span className="font-bold">₦{transaction_detail.final_amount}</span>
            </div>
          )}
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Reference</span>
            <span className="font-mono text-sm font-medium">{transaction_detail?.reference ?? searchParams.get("reference")}</span>
          </div>
          {transaction_detail.created_at && (
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Date</span>
              <span className="font-medium">{transaction_detail.created_at}</span>
            </div>
          )}
        </div>

        <Button className="w-full" asChild>
          <Link href="/dashboard">Go to Dashboard</Link>
        </Button>
      </CardContent>
    </Card>
  );
}

export default function PaymentStatusPage() {
  return (
    <Suspense
      fallback={
        <Card className="mx-auto mt-12 max-w-lg">
          <CardHeader>
            <Skeleton className="mx-auto h-8 w-3/4" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="mt-6 h-10 w-full" />
          </CardContent>
        </Card>
      }
    >
      <PaymentStatusInner />
    </Suspense>
  );
}
