"use client";

import { useAuthStore } from "@/store/authStore";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { DeleteAccountSection } from "@/components/dashboard/delete-account";
import { ChangePasswordForm } from "@/components/profile/change-password-form";
import { ShieldCheck, CalendarDays, Activity } from "lucide-react";

export function AccountForm() {
  const { user } = useAuthStore();

  const getStatusBadgeProps = (status: string) => {
    if (status === "active") {
      return {
        variant: "outline" as const,
        className: "border-green-200 bg-green-50 text-green-700 hover:bg-green-100",
      };
    }
    return {
      variant: "outline" as const,
      className: "border-red-200 bg-red-50 text-red-700 hover:bg-red-100",
    };
  };

  return (
    <div className="space-y-8 duration-500 animate-in fade-in-50">
      
      {/* Password Section */}
      <section>
        <div className="mb-6">
             <h2 className="text-2xl font-semibold tracking-tight">Security & Password</h2>
             <p className="text-muted-foreground">Manage your credentials and login security.</p>
        </div>
        <ChangePasswordForm />
      </section>

      {/* Account Status Card */}
      <section>
          <div className="mb-6 mt-10">
             <h2 className="text-2xl font-semibold tracking-tight">Account Overview</h2>
             <p className="text-muted-foreground">Information about your subscription and status.</p>
        </div>
          <Card className="border-border/60 shadow-sm">
            <CardHeader className="bg-muted/10">
              <div className="flex items-center gap-3">
                 <div className="flex size-10 items-center justify-center rounded-lg bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                    <ShieldCheck className="size-5" />
                 </div>
                 <div>
                     <CardTitle className="text-lg">Account Status</CardTitle>
                     <CardDescription>
                        Current standing and creation details.
                     </CardDescription>
                 </div>
              </div>
            </CardHeader>
            <CardContent className="grid gap-6 p-6 sm:grid-cols-2">
              
              <div className="flex flex-col gap-2 rounded-xl border p-4 transition-colors hover:bg-muted/30">
                <div className="flex items-center gap-2 text-muted-foreground">
                    <Activity className="size-4" />
                    <span className="text-sm font-medium">Current Status</span>
                </div>
                <div className="flex items-center justify-between">
                     <span className="text-2xl font-bold capitalize">{user?.status || "Unknown"}</span>
                     <Badge {...getStatusBadgeProps(user?.status || "inactive")} className="px-3 py-1">
                      {user?.status}
                    </Badge>
                </div>
              </div>

              <div className="flex flex-col gap-2 rounded-xl border p-4 transition-colors hover:bg-muted/30">
                 <div className="flex items-center gap-2 text-muted-foreground">
                    <CalendarDays className="size-4" />
                    <span className="text-sm font-medium">Member Since</span>
                </div>
                <div className="flex items-center">
                    <span className="text-xl font-semibold">
                         {user?.created_at
                          ? new Date(user.created_at).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })
                          : "N/A"}
                    </span>
                </div>
              </div>

            </CardContent>
          </Card>
      </section>

      {/* Danger Zone */}
      <section>
         <div className="mb-6 mt-10">
             <h2 className="text-2xl font-semibold tracking-tight text-destructive">Danger Zone</h2>
             <p className="text-muted-foreground">Irreversible account actions.</p>
        </div>
        <DeleteAccountSection />
      </section>
    </div>
  );
}
