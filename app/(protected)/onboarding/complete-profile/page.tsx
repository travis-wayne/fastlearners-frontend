"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { useAuthStore } from "@/store/authStore";
import { calculateProfileCompletion } from "@/lib/utils/profile-completion";
import { OnboardingWizard } from "@/components/onboarding/onboarding-wizard";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, Loader2 } from "lucide-react";

export default function CompleteProfilePage() {
  const { user, isLoading: authLoading } = useAuthStore();
  const router = useRouter();
  const [completionPercentage, setCompletionPercentage] = useState(0);

  useEffect(() => {
    if (user) {
      const percentage = calculateProfileCompletion(user);
      setCompletionPercentage(percentage);
    }
  }, [user]);

  const handleComplete = () => {
    toast.success("Profile completed successfully!");
    // Clear banner dismissal from localStorage
    if (typeof window !== "undefined" && user?.id) {
      localStorage.removeItem(`profile-completion-banner-dismissed-${user.id}`);
    }
    setTimeout(() => {
      router.push("/dashboard");
    }, 1000);
  };

  const handleBack = () => {
    // TODO: Add confirmation dialog if form has unsaved changes
    router.push("/dashboard");
  };

  if (authLoading || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="size-8 animate-spin" />
        <span className="ml-2">Loading...</span>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="mb-6">
        <Button variant="ghost" onClick={handleBack} className="mb-4">
          <ArrowLeft className="size-4 mr-2" />
          Back to Dashboard
        </Button>
        <h1 className="text-3xl font-bold">Complete Your Profile</h1>
        <div className="mt-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Profile Completion</span>
            <span className="text-sm text-muted-foreground">{completionPercentage}%</span>
          </div>
          <Progress value={completionPercentage} className="w-full" />
        </div>
      </div>
      <OnboardingWizard onComplete={handleComplete} />
    </div>
  );
}