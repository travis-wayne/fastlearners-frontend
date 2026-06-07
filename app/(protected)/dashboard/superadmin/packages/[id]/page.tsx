"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Pencil } from "lucide-react";
import { toast } from "sonner";

import { adminGetPackage } from "@/lib/api/superadmin-subscription";
import { Package } from "@/lib/types/subscription";
import { normalizeAmount, parseDateString } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { PackageForm } from "@/components/superadmin/package-form";

export default function PackageDetailPage({ params }: { params: { id: string } }) {
  const [pkg, setPkg] = useState<Package | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isEditOpen, setIsEditOpen] = useState(false);

  useEffect(() => {
    async function fetchPackage() {
      setLoading(true);
      setError(null);
      const res = await adminGetPackage(Number(params.id));
      if (res.success && res.content?.package) {
        setPkg(res.content.package);
      } else {
        setError(res.message || "Failed to load package");
      }
      setLoading(false);
    }
    fetchPackage();
  }, [params.id]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-10 w-[200px]" />
        </div>
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-[150px]" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-6 w-full max-w-[400px]" />
            <Skeleton className="h-6 w-full max-w-[300px]" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error || !pkg) {
    return (
      <div className="space-y-6">
        <Link href="/dashboard/superadmin/packages">
          <Button variant="ghost" className="gap-2">
            <ArrowLeft className="size-4" />
            Back to Packages
          </Button>
        </Link>
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error || "Package not found."}</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/superadmin/packages">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="size-4" />
            </Button>
          </Link>
          <h2 className="text-2xl font-bold tracking-tight">{pkg.name}</h2>
          <Badge variant={pkg.is_active ? "default" : "secondary"}>
            {pkg.is_active ? "Active" : "Inactive"}
          </Badge>
        </div>
        <Button onClick={() => setIsEditOpen(true)} className="gap-2">
          <Pencil className="size-4" />
          Edit Package
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Package Details</CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="grid gap-4 sm:grid-cols-2">
            <div>
              <dt className="text-sm font-medium text-muted-foreground">Name</dt>
              <dd className="mt-1 text-base font-medium">{pkg.name}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-muted-foreground">Amount</dt>
              <dd className="mt-1 text-base font-medium">₦{Number(normalizeAmount(pkg.amount)).toLocaleString()}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-muted-foreground">Original Amount</dt>
              <dd className="mt-1 text-base font-medium">
                {pkg.original_amount ? (
                  <span className="text-muted-foreground line-through">
                    ₦{Number(normalizeAmount(pkg.original_amount)).toLocaleString()}
                  </span>
                ) : (
                  "-"
                )}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-muted-foreground">Billing Cycle</dt>
              <dd className="mt-1 text-base font-medium capitalize">
                <Badge variant="outline">{pkg.billing_cycle}</Badge>
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-muted-foreground">Duration</dt>
              <dd className="mt-1 text-base font-medium">{pkg.duration_days} days</dd>
            </div>
            <div className="sm:col-span-2">
              <dt className="text-sm font-medium text-muted-foreground">Description</dt>
              <dd className="mt-1 text-base">{pkg.description || "-"}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-muted-foreground">Created At</dt>
              <dd className="mt-1 text-sm">
                {parseDateString(pkg.created_at)?.toLocaleString() || "-"}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-muted-foreground">Updated At</dt>
              <dd className="mt-1 text-sm">
                {parseDateString(pkg.updated_at)?.toLocaleString() || "-"}
              </dd>
            </div>
          </dl>
        </CardContent>
      </Card>

      <Sheet open={isEditOpen} onOpenChange={setIsEditOpen}>
        <SheetContent side="right" className="w-full overflow-y-auto sm:max-w-xl">
          <SheetHeader>
            <SheetTitle>Edit Package</SheetTitle>
          </SheetHeader>
          <PackageForm
            mode="edit"
            initialData={pkg}
            onSuccess={(updatedPkg) => {
              setPkg(updatedPkg);
              setIsEditOpen(false);
            }}
            onCancel={() => setIsEditOpen(false)}
          />
        </SheetContent>
      </Sheet>
    </div>
  );
}
