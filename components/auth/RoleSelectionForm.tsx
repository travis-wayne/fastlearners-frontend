"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { GraduationCap, Shield } from "lucide-react";
import { toast } from "sonner";

import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";

type UserRole = "student" | "guardian";

interface RoleOption {
  value: UserRole;
  title: string;
  description: string;
  icon: typeof GraduationCap;
  dashboardRoute: string;
  iconBg: string;
  iconColor: string;
}

const roleOptions: RoleOption[] = [
  {
    value: "student",
    title: "Student",
    description: "Access lessons, quizzes, and track your progress",
    icon: GraduationCap,
    dashboardRoute: "/dashboard",
    iconBg: "bg-blue-500/10",
    iconColor: "text-blue-600",
  },
  {
    value: "guardian",
    title: "Guardian",
    description: "Monitor and support your child's learning journey",
    icon: Shield,
    dashboardRoute: "/dashboard",
    iconBg: "bg-emerald-500/10",
    iconColor: "text-emerald-600",
  },
];

export function RoleSelectionForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRoleSelect = async (role: UserRole) => {
    try {
      setIsSubmitting(true);

      // Show loading toast
      toast.loading("Setting up your account...", { id: "role-setup" });

      // Send role selection to backend
      const response = await fetch("/api/auth/set-role", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ user_role: role }),
      });

      const data = await response.json();

      if (!response.ok || !data?.success) {
        throw new Error(data?.message || "Failed to set role");
      }

      // Success - dismiss loading and redirect immediately
      toast.dismiss("role-setup");
      toast.success("Redirecting to your dashboard...", {
        duration: 1000,
      });

      // Get the appropriate dashboard route for the role
      const selectedOption = roleOptions.find((opt) => opt.value === role);
      const dashboardRoute = selectedOption?.dashboardRoute || "/dashboard";

      // Use replace to prevent back navigation to onboarding
      setTimeout(() => {
        router.replace(dashboardRoute);
      }, 500);
    } catch (error: any) {
      toast.dismiss("role-setup");
      toast.error(error?.message || "Failed to set role. Please try again.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-3xl font-bold tracking-tight">Select your role</h1>
        <p className="text-muted-foreground">
          Choose how you'll be using Fast Learners
        </p>
      </div>

      {/* Role Cards */}
      <div className="grid gap-4 sm:grid-cols-2">
        {roleOptions.map((option) => {
          const Icon = option.icon;

          return (
            <Card
              key={option.value}
              className={cn(
                "group relative cursor-pointer transition-all duration-200",
                "border-2 hover:border-primary hover:shadow-lg",
                isSubmitting && "pointer-events-none opacity-60"
              )}
              onClick={() => !isSubmitting && handleRoleSelect(option.value)}
              role="button"
              tabIndex={isSubmitting ? -1 : 0}
              aria-label={`Select ${option.title} role`}
              onKeyDown={(e) => {
                if ((e.key === "Enter" || e.key === " ") && !isSubmitting) {
                  e.preventDefault();
                  handleRoleSelect(option.value);
                }
              }}
            >
              <CardContent className="flex flex-col items-center gap-4 p-8 text-center">
                {/* Icon */}
                <div
                  className={cn(
                    "flex size-16 items-center justify-center rounded-full transition-transform duration-200",
                    "group-hover:scale-110",
                    option.iconBg
                  )}
                >
                  <Icon className={cn("size-8", option.iconColor)} />
                </div>

                {/* Title */}
                <div className="space-y-2">
                  <h3 className="text-xl font-semibold">{option.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {option.description}
                  </p>
                </div>

                {/* Hover indicator */}
                <div className="mt-2 text-xs font-medium text-primary opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                  Click to continue →
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Info text */}
      <p className="text-center text-xs text-muted-foreground">
        Your selection will personalize your learning experience
      </p>
    </div>
  );
}
