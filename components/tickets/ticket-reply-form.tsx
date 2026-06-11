"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2 } from "lucide-react";

import { replyToTicket, adminReplyToTicket } from "@/lib/api/tickets";
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
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";

const replySchema = z.object({
  reply: z.string().min(1, "Reply cannot be empty"),
  attachments: z.any().optional(),
});

type ReplyFormValues = z.infer<typeof replySchema>;

interface TicketReplyFormProps {
  ticketId: number;
  onSuccess: () => void;
  isAdmin?: boolean;
}

export function TicketReplyForm({ ticketId, onSuccess, isAdmin = false }: TicketReplyFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ReplyFormValues>({
    resolver: zodResolver(replySchema),
    defaultValues: {
      reply: "",
    },
  });

  async function onSubmit(data: ReplyFormValues) {
    setIsSubmitting(true);

    const formData = new FormData();
    formData.append("reply", data.reply);
    if (data.attachments && data.attachments.length > 0) {
      Array.from(data.attachments as FileList).forEach(file => {
        formData.append("attachments[]", file);
      });
    }

    const apiCall = isAdmin ? adminReplyToTicket : replyToTicket;
    
    const res = await apiCall(ticketId, formData);
    
    if (res.success) {
      showApiToast("success", res.message || "Reply sent successfully");
      form.reset();
      onSuccess();
    } else {
      showApiToast(res.type ?? "error", res.message || "Failed to send reply");
    }
    
    setIsSubmitting(false);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="reply"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Your Reply</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Type your message here..."
                  className="min-h-[100px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="attachments"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Attachments (Optional)</FormLabel>
              <FormControl>
                <Input
                  type="file"
                  multiple
                  onChange={(e) => field.onChange(e.target.files)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 size-4 animate-spin" />
              Sending...
            </>
          ) : (
            "Send Reply"
          )}
        </Button>
      </form>
    </Form>
  );
}
