"use client";

import { useState } from "react";
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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AdminMotd, CreateMotdData, MotdAudience } from "@/lib/types/motd";
import { adminCreateMotd, adminUpdateMotd } from "@/lib/api/motd";

const motdSchema = z.object({
  title: z.string().min(1, "Title is required"),
  message: z.string().min(1, "Message is required"),
  audience: z.enum([
    "all",
    "app_users",
    "students",
    "agents",
    "guardians",
    "app_users_students",
    "admins",
  ]),
  is_active: z.coerce.number().min(0).max(1),
  starts_at: z.string().min(1, "Start date is required"),
  ends_at: z.string().min(1, "End date is required"),
});

type MotdFormValues = z.infer<typeof motdSchema>;

interface MotdFormProps {
  mode: "create" | "edit";
  initialData?: AdminMotd;
  onSuccess: (motd: AdminMotd) => void;
  onCancel: () => void;
}

export function MotdForm({
  mode,
  initialData,
  onSuccess,
  onCancel,
}: MotdFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<MotdFormValues>({
    resolver: zodResolver(motdSchema),
    defaultValues: {
      title: initialData?.title || "",
      message: initialData?.message || "",
      audience: initialData?.audience || "all",
      is_active: initialData?.is_active ? 1 : 0,
      starts_at: initialData?.starts_at ? initialData.starts_at.slice(0, 10) : "",
      ends_at: initialData?.ends_at ? initialData.ends_at.slice(0, 10) : "",
    },
  });

  async function onSubmit(data: MotdFormValues) {
    setIsSubmitting(true);
    try {
      const payload: CreateMotdData = {
        title: data.title,
        message: data.message,
        audience: data.audience as MotdAudience,
        is_active: data.is_active as 0 | 1,
        starts_at: new Date(data.starts_at).toISOString(),
        ends_at: new Date(data.ends_at).toISOString(),
      };

      let response;
      if (mode === "create") {
        response = await adminCreateMotd(payload);
      } else {
        if (!initialData?.id) return;
        response = await adminUpdateMotd(initialData.id, payload);
      }

      if (response.success && response.content?.motd) {
        showApiToast(
          response.type ?? "success",
          response.message || `MOTD ${mode === "create" ? "created" : "updated"} successfully`
        );
        onSuccess?.(response.content.motd);
      } else if (response.errors) {
        Object.entries(response.errors).forEach(([key, messages]) => {
          form.setError(key as any, {
            type: "server",
            message: (messages as string[])[0],
          });
        });
      } else {
        showApiToast(response.type ?? "error", response.message || `Failed to ${mode} MOTD`);
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
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="MOTD Title" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Message</FormLabel>
              <FormControl>
                <Textarea placeholder="MOTD Message" className="resize-none" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="audience"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Audience</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select audience" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="app_users">App Users</SelectItem>
                  <SelectItem value="students">Students</SelectItem>
                  <SelectItem value="agents">Agents</SelectItem>
                  <SelectItem value="guardians">Guardians</SelectItem>
                  <SelectItem value="app_users_students">App Users + Students</SelectItem>
                  <SelectItem value="admins">Admins</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="is_active"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Status</FormLabel>
              <Select
                onValueChange={(val) => field.onChange(Number(val))}
                defaultValue={field.value.toString()}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="1">Active</SelectItem>
                  <SelectItem value="0">Inactive</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="starts_at"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Starts At</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="ends_at"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ends At</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
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
            {mode === "create" ? "Create MOTD" : "Update MOTD"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
