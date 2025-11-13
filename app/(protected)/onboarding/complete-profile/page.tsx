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
    router.push("/dashboard");
  };

  if (authLoading || !user) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="size-8 animate-spin text-primary" />
          <span className="text-sm text-muted-foreground">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleBack}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="size-4" />
            Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Complete Your Profile</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Fill in your information to get the most out of Fast Learner
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Profile Completion</span>
          <span className="font-medium">{completionPercentage}%</span>
        </div>
        <Progress value={completionPercentage} className="h-2" />
      </div>

      <OnboardingWizard onComplete={handleComplete} />
    </div>
  );
}