"use client";

import { useEffect, useState } from "react";
import { Ticket, Pencil, Trash2, Plus, Search } from "lucide-react";
import { showApiToast } from "@/lib/utils/api-toast";

import {
  adminGetCoupons,
  adminDeleteCoupon,
  adminUpdateCouponStatus,
  adminSearchCoupons,
} from "@/lib/api/superadmin-subscription";
import { Coupon, PaginationMeta } from "@/lib/types/subscription";
import { normalizeAmount, parseDateString } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";
import { CouponForm } from "@/components/superadmin/coupon-form";
import { useDebounce } from "@/hooks/use-debounce";

export default function CouponsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [meta, setMeta] = useState<PaginationMeta | null>(null);
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearch = useDebounce(searchTerm, 500);

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);

  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (debouncedSearch) {
      searchCoupons(debouncedSearch);
    } else {
      fetchCoupons();
    }
  }, [debouncedSearch]);

  async function fetchCoupons(page: number = 1) {
    setLoading(true);
    const res = await adminGetCoupons(page);
    if (res.success && res.content) {
      setCoupons(res.content.coupons || []);
      setMeta(res.content.meta || null);
    } else {
      showApiToast(res.type ?? "error", res.message || "Failed to fetch coupons");
    }
    setLoading(false);
  }

  async function searchCoupons(term: string, page: number = 1) {
    setLoading(true);
    const res = await adminSearchCoupons(term, page);
    if (res.success && res.content) {
      setCoupons(res.content.coupons || []);
      setMeta(res.content.meta || null);
    } else {
      showApiToast(res.type ?? "error", res.message || "Failed to search coupons");
    }
    setLoading(false);
  }

  async function handleToggleStatus(coupon: Coupon) {
    const res = await adminUpdateCouponStatus(coupon.id);
    if (res.success) {
      setCoupons((prev) =>
        prev.map((c) =>
          c.id === coupon.id ? { ...c, is_active: c.is_active === "active" ? "inactive" : "active" } : c
        )
      );
      showApiToast(res.type ?? "success", res.message || "Coupon status updated");
    } else {
      showApiToast(res.type ?? "error", res.message || "Failed to update status");
    }
  }

  async function handleDelete() {
    if (!deletingId) return;
    setIsDeleting(true);
    const res = await adminDeleteCoupon(deletingId);
    if (res.success) {
      setCoupons((prev) => prev.filter((c) => c.id !== deletingId));
      showApiToast(res.type ?? "success", res.message || "Coupon deleted");
    } else {
      showApiToast(res.type ?? "error", res.message || "Failed to delete coupon");
    }
    setIsDeleting(false);
    setDeletingId(null);
  }

  function handlePageChange(newPage: number) {
    if (debouncedSearch) {
      searchCoupons(debouncedSearch, newPage);
    } else {
      fetchCoupons(newPage);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Coupons</h2>
          <p className="text-muted-foreground">
            Manage discount coupons for packages.
          </p>
        </div>
        <Button onClick={() => setIsCreateOpen(true)} className="gap-2">
          <Plus className="size-4" />
          Create Coupon
        </Button>
      </div>

      <div className="flex items-center gap-2">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search coupons..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Code</TableHead>
              <TableHead>Package</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Value</TableHead>
              <TableHead>Min Amount</TableHead>
              <TableHead>Usage</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Expiry</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell><Skeleton className="h-4 w-[100px]" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-[100px]" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-[60px]" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-[60px]" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-[80px]" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-[60px]" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-[60px]" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-[80px]" /></TableCell>
                  <TableCell className="text-right"><Skeleton className="ml-auto size-8" /></TableCell>
                </TableRow>
              ))
            ) : coupons.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9}>
                  <Card className="mx-4 mt-4 border-2 border-dashed bg-transparent shadow-none">
                    <CardContent className="flex flex-col items-center justify-center py-10">
                      <Ticket className="mb-4 size-10 text-muted-foreground" />
                      <p className="text-muted-foreground">No coupons found</p>
                    </CardContent>
                  </Card>
                </TableCell>
              </TableRow>
            ) : (
              coupons.map((coupon) => (
                <TableRow key={coupon.id}>
                  <TableCell className="font-medium">{coupon.code}</TableCell>
                  <TableCell>{coupon.package_name}</TableCell>
                  <TableCell className="capitalize">{coupon.type}</TableCell>
                  <TableCell>
                    {coupon.type === "percentage"
                      ? `${coupon.value}%`
                      : `₦${Number(normalizeAmount(coupon.value)).toLocaleString()}`
                    }
                  </TableCell>
                  <TableCell>₦{Number(normalizeAmount(coupon.minimum_amount)).toLocaleString()}</TableCell>
                  <TableCell>
                    {coupon.used_count} / {coupon.usage_limit}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={coupon.is_active === "active" ? "default" : "secondary"}
                      className="cursor-pointer"
                      onClick={() => handleToggleStatus(coupon)}
                    >
                      {coupon.is_active === "active" ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {parseDateString(coupon.expires_at)?.toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setEditingCoupon(coupon)}
                    >
                      <Pencil className="size-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                      onClick={() => setDeletingId(coupon.id)}
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {meta && meta.last_page > 1 && (
        <div className="flex items-center justify-end space-x-2 py-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(meta.current_page - 1)}
            disabled={meta.current_page === 1}
          >
            Previous
          </Button>
          <div className="text-sm text-muted-foreground">
            Page {meta.current_page} of {meta.last_page}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(meta.current_page + 1)}
            disabled={meta.current_page === meta.last_page}
          >
            Next
          </Button>
        </div>
      )}

      <Sheet open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <SheetContent side="right" className="w-full overflow-y-auto sm:max-w-xl">
          <SheetHeader>
            <SheetTitle>Create Coupon</SheetTitle>
          </SheetHeader>
          <CouponForm
            mode="create"
            onSuccess={(coupon) => {
              setCoupons((prev) => [coupon, ...prev]);
              setIsCreateOpen(false);
            }}
            onCancel={() => setIsCreateOpen(false)}
          />
        </SheetContent>
      </Sheet>

      <Sheet
        open={!!editingCoupon}
        onOpenChange={(open) => !open && setEditingCoupon(null)}
      >
        <SheetContent side="right" className="w-full overflow-y-auto sm:max-w-xl">
          <SheetHeader>
            <SheetTitle>Edit Coupon</SheetTitle>
          </SheetHeader>
          {editingCoupon && (
            <CouponForm
              mode="edit"
              initialData={editingCoupon}
              onSuccess={(updatedCoupon) => {
                setCoupons((prev) =>
                  prev.map((c) => (c.id === updatedCoupon.id ? updatedCoupon : c))
                );
                setEditingCoupon(null);
              }}
              onCancel={() => setEditingCoupon(null)}
            />
          )}
        </SheetContent>
      </Sheet>

      <ConfirmationDialog
        open={!!deletingId}
        onOpenChange={(open) => !open && !isDeleting && setDeletingId(null)}
        title="Delete Coupon"
        description="Are you sure you want to delete this coupon? This action cannot be undone."
        confirmLabel="Delete"
        variant="destructive"
        loading={isDeleting}
        onConfirm={handleDelete}
      />
    </div>
  );
}
