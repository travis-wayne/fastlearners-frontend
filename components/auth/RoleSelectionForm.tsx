"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import {
  AlertCircle,
  CheckCircle2,
  GraduationCap,
  Loader2,
  User,
} from "lucide-react";
import { toast } from "sonner";

import { profileApi } from "@/lib/api/auth";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function RoleSelectionForm() {
  const router = useRouter();
  const { user, updateUserProfile, canChangeRole } = useAuthStore();

  // Form state
  const [selectedRole, setSelectedRole] = useState<
    "student" | "guardian" | null
  >(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const roleOptions = [
    {
      value: "student" as const,
      title: "Student",
      description: "I want to learn and access educational content",
      icon: GraduationCap,
      route: "/dashboard",
      benefits: [
        "Access to personalized learning content",
        "Track your progress and achievements",
        "Interactive lessons and activities",
        "Homework and assignment submissions",
      ],
    },
    {
      value: "guardian" as const,
      title: "Guardian",
      description: "I want to monitor and support my child's learning",
      icon: User,
      route: "/guardian",
      benefits: [
        "View your child's progress reports",
        "Manage linked student accounts",
        "Communication with teachers",
        "Track learning milestones",
      ],
    },
  ];

  const handleRoleSelect = (role: "student" | "guardian") => {
    setSelectedRole(role);
    setError(null);
  };

  const handleSubmit = async () => {
    if (!selectedRole) {
      setError("Please select a role to continue");
      return;
    }

    if (!user) {
      setError("User information not found. Please try logging in again.");
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      console.log("=== ROLE SELECTION FORM SUBMISSION ===");
      console.log("Selected role:", selectedRole);
      console.log("User ID:", user.id);

      // Call API to update user role
      const result = await profileApi.updateRole(selectedRole);

      if (!result.success) {
        throw new Error(result.message || "Failed to update role");
      }

      console.log("Role updated successfully:", result);

      // Update user in auth store
      const updatedUser = {
        ...user,
        role: [selectedRole], // Update role array
      };

      updateUserProfile(updatedUser);

      toast.success(`Role selected!`, {
        description: `You are now registered as a ${selectedRole}`,
      });

      // Determine redirect route based on selected role
      const targetRoute =
        roleOptions.find((option) => option.value === selectedRole)?.route ||
        "/dashboard";

      console.log(`Redirecting to ${targetRoute}...`);

      // Add delay to show success message
      setTimeout(() => {
        router.push(targetRoute);
      }, 1000);
    } catch (err: any) {
      console.error("Role selection error:", err);
      setError(err.message || "Failed to select role. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="flex flex-col items-center gap-4 text-center">
        <AlertCircle className="size-16 text-orange-500" />
        <div>
          <h1 className="text-2xl font-bold text-orange-800">Session Error</h1>
          <p className="mt-2 text-sm text-orange-600">
            Your session has expired. Please log in again.
          </p>
        </div>
        <Button onClick={() => router.push("/auth/login")}>Go to Login</Button>
      </div>
    );
  }

  // Check if user can change their role (only guests can)
  if (!canChangeRole()) {
    const currentRole = user.role[0];
    const roleRoute = currentRole === "student" ? "/dashboard" : "/guardian";

    return (
      <div className="flex flex-col items-center gap-4 text-center">
        <CheckCircle2 className="size-16 text-green-500" />
        <div>
          <h1 className="text-2xl font-bold text-green-800">
            Role Already Selected
          </h1>
          <p className="mt-2 text-sm text-green-600">
            You are already registered as a {currentRole}. Role changes are not
            allowed.
          </p>
        </div>
        <Button onClick={() => router.push(roleRoute)}>
          Go to {currentRole === "student" ? "Dashboard" : "Guardian Portal"}
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-6">
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-3xl font-bold">Choose Your Role</h1>
        <p className="text-balance text-muted-foreground">
          Select your primary role to get started with the right experience for
          you
        </p>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="size-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        {roleOptions.map((option) => {
          const Icon = option.icon;
          const isSelected = selectedRole === option.value;

          return (
            <Card
              key={option.value}
              className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
                isSelected
                  ? "border-primary bg-primary/5 ring-2 ring-primary"
                  : "hover:border-primary/50"
              }`}
              onClick={() => handleRoleSelect(option.value)}
            >
              <CardHeader className="text-center">
                <div className="mb-4 flex justify-center">
                  <div
                    className={`rounded-full p-4 ${
                      isSelected
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    <Icon className="size-8" />
                  </div>
                </div>
                <CardTitle className="flex items-center justify-center gap-2">
                  {option.title}
                  {isSelected && (
                    <CheckCircle2 className="size-5 text-primary" />
                  )}
                </CardTitle>
                <CardDescription>{option.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-sm font-medium">What you can do:</p>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    {option.benefits.map((benefit, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <CheckCircle2 className="size-3 shrink-0 text-green-500" />
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="space-y-4">
        <Button
          onClick={handleSubmit}
          disabled={!selectedRole || isLoading}
          className="w-full"
          size="lg"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 size-4 animate-spin" />
              Setting up your account...
            </>
          ) : selectedRole ? (
            `Continue as ${selectedRole.charAt(0).toUpperCase() + selectedRole.slice(1)}`
          ) : (
            "Select a role to continue"
          )}
        </Button>

        <p className="text-center text-sm text-muted-foreground">
          <strong>Important:</strong> Your role selection cannot be changed
          later. Please choose carefully based on how you plan to use the
          platform.
        </p>
      </div>
    </div>
  );
}
