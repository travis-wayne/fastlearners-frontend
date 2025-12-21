"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import {
  Globe,
  GraduationCap,
  Phone,
  Shield,
  User as UserIcon,
} from "lucide-react";
import { toast } from "sonner";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type UserRole = "student" | "guardian" | "guest";

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
  {
    value: "guest",
    title: "Guest",
    description: "Explore the platform with limited access",
    icon: Globe as any,
    dashboardRoute: "/dashboard",
    iconBg: "bg-slate-500/10",
    iconColor: "text-slate-600",
  },
];

export function RoleSelectionForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const setUser = useAuthStore((s) => s.setUser);

  // Guardian expanded form state
  const [expandedRole, setExpandedRole] = useState<UserRole | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    child_email: "",
    child_phone: "",
    address: "",
    city: "",
    state: "",
    country: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateGuardian = () => {
    const e: Record<string, string> = {};
    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.name.trim()) e.name = "Full name is required";
    if (!formData.phone.trim() || formData.phone.trim().length < 10)
      e.phone = "Valid phone is required";
    if (!emailRe.test(formData.email.trim())) e.email = "Valid email required";
    if (!emailRe.test(formData.child_email.trim()))
      e.child_email = "Valid child email required";
    if (!formData.child_phone.trim() || formData.child_phone.trim().length < 10)
      e.child_phone = "Valid child phone required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleRoleSelect = async (role: UserRole) => {
    try {
      if (role === "guardian") {
        setExpandedRole("guardian");
        return;
      }

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

      if (data?.user) {
        setUser(data.user);
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
    <div className="flex flex-col gap-6 sm:gap-8">
      {/* Header */}
      <div className="flex flex-col items-center gap-1.5 text-center sm:gap-2">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Select your role</h1>
        <p className="text-sm text-muted-foreground sm:text-base">
          Choose how you&apos;ll be using Fast Learners
        </p>
      </div>

      {/* Role Cards */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
        {roleOptions.map((option) => {
          const Icon = option.icon;

          return (
            <Card
              key={option.value}
              className={cn(
                "group relative cursor-pointer transition-all duration-200",
                "border-2 hover:border-primary hover:shadow-lg",
                isSubmitting && "pointer-events-none opacity-60",
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
              <CardContent className="flex flex-col items-center gap-3 p-6 text-center sm:gap-4 sm:p-8">
                {/* Icon */}
                <div
                  className={cn(
                    "flex size-12 items-center justify-center rounded-full transition-transform duration-200 sm:size-14 md:size-16",
                    "group-hover:scale-110",
                    option.iconBg,
                  )}
                >
                  <Icon className={cn("size-6 sm:size-7 md:size-8", option.iconColor)} />
                </div>

                {/* Title */}
                <div className="space-y-1.5 sm:space-y-2">
                  <h3 className="text-lg font-semibold sm:text-xl">{option.title}</h3>
                  <p className="text-xs text-muted-foreground sm:text-sm">
                    {option.description}
                  </p>
                </div>

                {/* Hover indicator */}
                <div className="mt-1 text-xs font-medium text-primary opacity-0 transition-opacity duration-200 group-hover:opacity-100 sm:mt-2 sm:text-sm">
                  Click to continue →
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Guardian Expanded Form */}
      {expandedRole === "guardian" && (
        <Card className="border-2">
          <CardContent className="p-4 sm:p-6">
            <div className="mb-4">
              <h3 className="text-base font-semibold sm:text-lg">Guardian Information</h3>
              <p className="text-xs text-muted-foreground sm:text-sm">
                Provide details to continue as a guardian.
              </p>
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
              <div>
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  placeholder="Parent User"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />
                {errors.name && (
                  <p className="mt-1 text-xs text-red-500">{errors.name}</p>
                )}
              </div>
              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel"
                  placeholder="01234567890"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                />
                {errors.phone && (
                  <p className="mt-1 text-xs text-red-500">{errors.phone}</p>
                )}
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="parent@fastlearnersapp.com"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
                {errors.email && (
                  <p className="mt-1 text-xs text-red-500">{errors.email}</p>
                )}
              </div>
              <div>
                <Label htmlFor="child_email">Child&apos;s Email</Label>
                <Input
                  id="child_email"
                  type="email"
                  placeholder="child@example.com"
                  value={formData.child_email}
                  onChange={(e) =>
                    setFormData({ ...formData, child_email: e.target.value })
                  }
                />
                {errors.child_email && (
                  <p className="mt-1 text-xs text-red-500">
                    {errors.child_email}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="child_phone">Child&apos;s Phone</Label>
                <Input
                  id="child_phone"
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel"
                  placeholder="08098765432"
                  value={formData.child_phone}
                  onChange={(e) =>
                    setFormData({ ...formData, child_phone: e.target.value })
                  }
                />
                {errors.child_phone && (
                  <p className="mt-1 text-xs text-red-500">
                    {errors.child_phone}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="address">Address (optional)</Label>
                <Input
                  id="address"
                  placeholder="No. 12, Abuja Road"
                  value={formData.address}
                  onChange={(e) =>
                    setFormData({ ...formData, address: e.target.value })
                  }
                />
              </div>
              <div>
                <Label htmlFor="city">City (optional)</Label>
                <Input
                  id="city"
                  placeholder="Kaduna"
                  value={formData.city}
                  onChange={(e) =>
                    setFormData({ ...formData, city: e.target.value })
                  }
                />
              </div>
              <div>
                <Label htmlFor="state">State (optional)</Label>
                <Input
                  id="state"
                  placeholder="Kaduna State"
                  value={formData.state}
                  onChange={(e) =>
                    setFormData({ ...formData, state: e.target.value })
                  }
                />
              </div>
              <div>
                <Label htmlFor="country">Country (optional)</Label>
                <Input
                  id="country"
                  placeholder="Nigeria"
                  value={formData.country}
                  onChange={(e) =>
                    setFormData({ ...formData, country: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="mt-6 flex items-center justify-end gap-2 sm:gap-3">
              <Button
                variant="outline"
                className="h-10 sm:h-11"
                onClick={() => setExpandedRole(null)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                className="h-10 sm:h-11"
                onClick={async () => {
                  if (!validateGuardian()) return;
                  try {
                    setIsSubmitting(true);
                    toast.loading("Submitting guardian details...", {
                      id: "guardian",
                    });
                    const payload: any = {
                      user_role: "guardian",
                      name: formData.name.trim(),
                      phone: formData.phone.trim(),
                      email: formData.email.trim(),
                      child_email: formData.child_email.trim(),
                      child_phone: formData.child_phone.trim(),
                    };
                    if (formData.address.trim())
                      payload.address = formData.address.trim();
                    if (formData.city.trim())
                      payload.city = formData.city.trim();
                    if (formData.state.trim())
                      payload.state = formData.state.trim();
                    if (formData.country.trim())
                      payload.country = formData.country.trim();

                    const response = await fetch("/api/auth/set-role", {
                      method: "POST",
                      headers: {
                        "Content-Type": "application/json",
                        Accept: "application/json",
                      },
                      body: JSON.stringify(payload),
                    });
                    const data = await response.json();
                    if (response.status === 200) {
                      toast.dismiss("guardian");
                      toast.success(data?.message || "Role set successfully!");
                      if (data?.user) setUser(data.user);
                      router.replace("/dashboard");
                    } else if (response.status === 422) {
                      // Show inline validation errors if provided
                      const fieldErrors = (data?.errors || {}) as Record<
                        string,
                        string[]
                      >;
                      const e: Record<string, string> = {};
                      Object.entries(fieldErrors).forEach(([k, v]) => {
                        if (v && v.length) e[k] = v[0];
                      });
                      setErrors(e);
                      toast.error(data?.message || "Validation failed");
                    } else {
                      toast.dismiss("guardian");
                      toast.error(data?.message || "Failed to set role");
                    }
                  } catch (err: any) {
                    toast.dismiss("guardian");
                    toast.error(err?.message || "Failed to set role");
                  } finally {
                    setIsSubmitting(false);
                  }
                }}
                disabled={isSubmitting}
              >
                Continue
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Info text */}
      <p className="text-center text-xs text-muted-foreground">
        Your selection will personalize your learning experience
      </p>
    </div>
  );
}
