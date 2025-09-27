"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import {
  AlertCircle,
  CheckCircle2,
  GraduationCap,
  Loader2,
  Shield,
  Users,
} from "lucide-react";
import { toast } from "sonner";

import { profileApi } from "@/lib/api/auth";
import { cn } from "@/lib/utils";
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
  const { user, updateUserProfile, canChangeRole, hydrate, isHydrated } = useAuthStore();

  // Form state
  const [selectedRole, setSelectedRole] = useState<
    "student" | "guardian" | null
  >(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Ensure auth store is properly hydrated on mount
  useEffect(() => {
    if (!isHydrated) {
      hydrate();
    }
  }, [hydrate, isHydrated]);

  const roleOptions = [
    {
      value: "student" as const,
      title: "Student",
      description: "Learning and accessing educational content",
      icon: GraduationCap,
      route: "/dashboard",
      color: "blue",
    },
    {
      value: "guardian" as const,
      title: "Guardian", 
      description: "Monitoring and supporting child's learning",
      icon: Shield,
      route: "/dashboard",
      color: "green",
    },
  ];

  const handleRoleSelect = (role: "student" | "guardian") => {
    // Allow deselection if the same role is clicked
    if (selectedRole === role) {
      setSelectedRole(null);
    } else {
      setSelectedRole(role);
    }
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

      // TODO: Replace with actual API endpoint when ready
      // Call API to update user role
      const result = await profileApi.updateRole(selectedRole);

      if (!result.success) {
        throw new Error(result.message || "Failed to update role");
      }

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
    const roleRoute = currentRole === "student" ? "/dashboard" : "/dashboard";

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
          Go to Dashboard
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Choose Your Role</h1>
        <p className="text-muted-foreground">
          Select your primary role to get started. Click again to deselect.
        </p>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="size-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-4 max-w-md mx-auto">
        {roleOptions.map((option) => {
          const Icon = option.icon;
          const isSelected = selectedRole === option.value;

          return (
            <Card
              key={option.value}
              className={cn(
                "relative cursor-pointer transition-all duration-200 p-4 group",
                "border border-gray-200 rounded-lg",
                isSelected 
                  ? "border-primary bg-primary/5 hover:bg-primary/10 hover:border-primary/80" 
                  : "hover:border-gray-300 hover:bg-gray-50/50"
              )}
              onClick={() => handleRoleSelect(option.value)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "rounded-lg p-2 flex-shrink-0",
                    option.color === "blue" ? "bg-blue-100" : "bg-green-100"
                  )}>
                    <Icon className={cn(
                      "size-5",
                      option.color === "blue" ? "text-blue-600" : "text-green-600"
                    )} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm uppercase tracking-wide text-gray-600">
                      {option.title.toUpperCase()}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-0.5">
                      {option.description}
                    </p>
                  </div>
                </div>
                
                <div className="flex-shrink-0">
                  {isSelected ? (
                    <CheckCircle2 className="size-5 text-primary transition-colors" />
                  ) : (
                    <div className="size-5 rounded-full border-2 border-gray-300 transition-colors group-hover:border-gray-400" />
                  )}
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      <div className="space-y-4 max-w-md mx-auto">
        <Button
          onClick={handleSubmit}
          disabled={!selectedRole || isLoading}
          className={cn(
            "w-full h-12 text-base font-medium transition-all duration-200",
            selectedRole && "shadow-lg hover:shadow-xl",
            !selectedRole && "opacity-60"
          )}
          size="lg"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 size-5 animate-spin" />
              Setting up your account...
            </>
          ) : selectedRole ? (
            `Continue as ${selectedRole.charAt(0).toUpperCase() + selectedRole.slice(1)}`
          ) : (
            "Select a role to continue"
          )}
        </Button>

        <div className="text-center space-y-2">
          <p className="text-sm text-muted-foreground">
            Your role selection helps us customize your learning experience
          </p>
          <p className="text-xs text-muted-foreground">
            You can change this later in your profile settings if needed
          </p>
        </div>
      </div>
    </div>
  );
}
