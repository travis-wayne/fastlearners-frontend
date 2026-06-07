"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2 } from "lucide-react";
import { showApiToast } from "@/lib/utils/api-toast";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Coupon, Package } from "@/lib/types/subscription";
import { normalizeAmount, toISODateString } from "@/lib/utils";
import {
  adminCreateCoupon,
  adminUpdateCoupon,
  adminGetPackages,
  CreateCouponData,
} from "@/lib/api/superadmin-subscription";

const couponSchema = z.object({
  code: z.string().min(1, "Code is required"),
  package_id: z.coerce.number().positive("Package is required"),
  type: z.enum(["percentage", "fixed"]),
  value: z.coerce.number().positive("Value must be positive"),
  minimum_amount: z.coerce.number().min(0, "Minimum amount must be non-negative"),
  usage_limit: z.coerce.number().int().positive("Usage limit must be a positive integer"),
  expires_at: z.string().min(1, "Expiry date is required"),
  description: z.string().optional().nullable(),
});

type CouponFormValues = z.infer<typeof couponSchema>;

interface CouponFormProps {
  mode: "create" | "edit";
  initialData?: Coupon;
  onSuccess: (coupon: Coupon) => void;
  onCancel: () => void;
}

export function CouponForm({
  mode,
  initialData,
  onSuccess,
  onCancel,
}: CouponFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [packages, setPackages] = useState<Package[]>([]);

  useEffect(() => {
    adminGetPackages().then((res) => {
      if (res.success && res.content) {
        setPackages(res.content.packages);
      }
    });
  }, []);

  const form = useForm<CouponFormValues>({
    resolver: zodResolver(couponSchema),
    defaultValues: {
      code: initialData?.code || "",
      package_id: initialData?.package_id || 0,
      type: initialData?.type || "percentage",
      value: Number(normalizeAmount(initialData?.value)) || 0,
      minimum_amount: Number(normalizeAmount(initialData?.minimum_amount)) || 0,
      usage_limit: initialData?.usage_limit || 1,
      expires_at: toISODateString(initialData?.expires_at),
      description: initialData?.description || "",
    },
  });

  async function onSubmit(data: CouponFormValues) {
    setIsSubmitting(true);
    try {
      const payload: CreateCouponData = {
        code: data.code,
        package_id: data.package_id,
        type: data.type,
        value: data.value,
        minimum_amount: data.minimum_amount,
        usage_limit: data.usage_limit,
        expires_at: new Date(data.expires_at).toISOString(),
        description: data.description || null,
      };

      let response;
      if (mode === "create") {
        response = await adminCreateCoupon(payload);
      } else {
        if (!initialData?.id) return;
        response = await adminUpdateCoupon(initialData.id, payload);
      }

      if (response.success && response.content?.coupon) {
        const returnedCoupon = response.content.coupon;
        if (!returnedCoupon.package_name) {
          const pkg = packages.find(p => p.id === data.package_id);
          if (pkg) {
            returnedCoupon.package_name = pkg.name;
          }
        }
        
        showApiToast(
          response.type ?? "success",
          response.message || "Coupon saved successfully"
        );
        onSuccess?.(returnedCoupon);
      } else if (response.errors) {
        Object.entries(response.errors).forEach(([key, messages]) => {
          form.setError(key as any, {
            type: "server",
            message: (messages as string[])[0],
          });
        });
      } else {
        showApiToast(response.type ?? "error", response.message || "Failed to save coupon");
      }
    } catch (error: any) {
      showApiToast("error", "An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
        <FormField
          control={form.control}
          name="code"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Code</FormLabel>
              <FormControl>
                <Input placeholder="e.g. SUMMER20" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="package_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Package</FormLabel>
              <Select
                onValueChange={(val) => field.onChange(Number(val))}
                defaultValue={field.value ? field.value.toString() : ""}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a package" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {packages.map((pkg) => (
                    <SelectItem key={pkg.id} value={pkg.id.toString()}>
                      {pkg.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Type</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="percentage">Percentage</SelectItem>
                  <SelectItem value="fixed">Fixed</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="value"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Value</FormLabel>
              <FormControl>
                <Input placeholder="20" type="number" step="0.01" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="minimum_amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Minimum Amount</FormLabel>
              <FormControl>
                <Input placeholder="0" type="number" step="0.01" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="usage_limit"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Usage Limit</FormLabel>
              <FormControl>
                <Input placeholder="100" type="number" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="expires_at"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Expires At</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description (Optional)</FormLabel>
              <FormControl>
                <Input
                  placeholder="e.g. Summer promotion"
                  {...field}
                  value={field.value || ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-2 pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 size-4 animate-spin" />}
            {mode === "create" ? "Create Coupon" : "Update Coupon"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
