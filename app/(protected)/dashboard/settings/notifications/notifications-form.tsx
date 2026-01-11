"use client";

import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { showSubmittedData } from "@/lib/show-submitted-data";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Bell, Mail, MessageSquare, Shield, Smartphone, Zap } from "lucide-react";
import { toast } from "sonner";

const notificationsFormSchema = z.object({
  type: z.enum(["all", "mentions", "none"], {
    required_error: "Please select a notification type.",
    invalid_type_error: "Please select a notification type.",
  }),
  mobile: z.boolean().default(false).optional(),
  communication_emails: z.boolean().default(false).optional(),
  social_emails: z.boolean().default(false).optional(),
  marketing_emails: z.boolean().default(false).optional(),
  security_emails: z.boolean(),
});

type NotificationsFormValues = z.infer<typeof notificationsFormSchema>;

// This can come from your database or API.
const defaultValues: Partial<NotificationsFormValues> = {
  communication_emails: false,
  marketing_emails: false,
  social_emails: true,
  security_emails: true,
};

export function NotificationsForm() {
  const form = useForm<NotificationsFormValues>({
    resolver: zodResolver(notificationsFormSchema),
    defaultValues,
  });

  function onSubmit(data: NotificationsFormValues) {
    showSubmittedData(data);
    toast.success("Notification preferences saved.")
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8 duration-500 animate-in fade-in-50"
      >
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Zap className="size-5 text-primary" />
                    Global Behavior
                </CardTitle>
                <CardDescription>How much do you want to be disturbed?</CardDescription>
            </CardHeader>
            <CardContent>
                <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                    <FormItem className="relative space-y-4">
                    <FormControl>
                        <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="grid grid-cols-1 gap-4 md:grid-cols-3"
                        >
                        <FormItem>
                            <FormControl>
                                <RadioGroupItem value="all" className="peer sr-only" />
                            </FormControl>
                            <FormLabel className="flex cursor-pointer flex-col items-center justify-between rounded-xl border-2 border-muted bg-transparent p-4 transition-all hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary">
                                <Bell className="mb-3 size-6 text-primary" />
                                <div className="text-center">
                                    <span className="text-sm font-semibold">Everything</span>
                                    <span className="mt-1 block text-xs text-muted-foreground">Get notified about all activity.</span>
                                </div>
                            </FormLabel>
                        </FormItem>

                        <FormItem>
                            <FormControl>
                                <RadioGroupItem value="mentions" className="peer sr-only" />
                            </FormControl>
                            <FormLabel className="flex cursor-pointer flex-col items-center justify-between rounded-xl border-2 border-muted bg-transparent p-4 transition-all hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary">
                                <MessageSquare className="mb-3 size-6 text-primary" />
                                <div className="text-center">
                                    <span className="text-sm font-semibold">Mentions Only</span>
                                    <span className="mt-1 block text-xs text-muted-foreground">Only when someone tags you.</span>
                                </div>
                            </FormLabel>
                        </FormItem>

                        <FormItem>
                            <FormControl>
                                <RadioGroupItem value="none" className="peer sr-only" />
                            </FormControl>
                            <FormLabel className="flex cursor-pointer flex-col items-center justify-between rounded-xl border-2 border-muted bg-transparent p-4 transition-all hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary">
                                <Bell className="mb-3 size-6 text-muted-foreground opacity-50" />
                                <div className="text-center">
                                    <span className="text-sm font-semibold">Nothing</span>
                                    <span className="mt-1 block text-xs text-muted-foreground">Silence is golden.</span>
                                </div>
                            </FormLabel>
                        </FormItem>
                        </RadioGroup>
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
            </CardContent>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Mail className="size-5 text-primary" />
                    Email Subscriptions
                </CardTitle>
                <CardDescription>Manage which emails you receive from us.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="communication_emails"
              render={({ field }) => (
                <div className="flex flex-row items-center justify-between rounded-lg border p-4 shadow-sm">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base font-semibold">
                      Communication emails
                    </FormLabel>
                    <FormDescription>
                      Receive emails about your account activity and essential updates.
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </div>
              )}
            />
            <FormField
              control={form.control}
              name="marketing_emails"
              render={({ field }) => (
                <div className="flex flex-row items-center justify-between rounded-lg border p-4 shadow-sm">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base font-semibold">
                      Marketing emails
                    </FormLabel>
                    <FormDescription>
                      Receive emails about new products, features, and special offers.
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </div>
              )}
            />
            <FormField
              control={form.control}
              name="social_emails"
              render={({ field }) => (
                <div className="flex flex-row items-center justify-between rounded-lg border p-4 shadow-sm">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base font-semibold">Social emails</FormLabel>
                    <FormDescription>
                      Receive emails for friend requests, follows, and interactions.
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </div>
              )}
            />
            <FormField
              control={form.control}
              name="security_emails"
              render={({ field }) => (
                <div className="flex flex-row items-center justify-between rounded-lg border bg-muted/20 p-4 shadow-sm">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                        <Shield className="size-4 text-green-600" />
                        <FormLabel className="text-base font-semibold">Security emails</FormLabel>
                    </div>
                    
                    <FormDescription>
                      Critical alerts about your account security.
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      disabled
                      aria-readonly
                    />
                  </FormControl>
                </div>
              )}
            />
          </CardContent>
        </Card>

        <Card>
            <CardContent className="pt-6">
                <FormField
                control={form.control}
                name="mobile"
                render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                        <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                        <FormLabel className="flex items-center gap-2">
                            <Smartphone className="size-4" />
                            Use different settings for mobile devices
                        </FormLabel>
                        <FormDescription>
                        You can manage specific mobile notifications in the mobile app settings.
                        </FormDescription>
                    </div>
                    </FormItem>
                )}
                />
            </CardContent>
        </Card>
        
        <div className="flex justify-end">
             <Button type="submit" size="lg">Update Preferences</Button>
        </div>
        
      </form>
    </Form>
  );
}
