"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useAuthStore } from "@/store/authStore";
import { AnimatePresence, motion } from "framer-motion";
import { AlertCircle, ArrowRight } from "lucide-react";

import { getMissingFields } from "@/lib/utils/profile-completion";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

export const ProfileCompletionBanner: React.FC = () => {
  const user = useAuthStore((state) => state.user);
  const [isVisible, setIsVisible] = useState(false);
  const [percentage, setPercentage] = useState(0);
  const [missingFields, setMissingFields] = useState<string[]>([]);

  useEffect(() => {
    if (!user) {
      setIsVisible(false);
      return;
    }

    const completion = useAuthStore.getState().getProfileCompletionPercentage();
    const missing = getMissingFields(user);

    setPercentage(completion);
    setMissingFields(missing);

    // Check dismissal state
    const dismissalKey = `profile-completion-banner-dismissed-${user.id}`;
    const dismissedAt = localStorage.getItem(dismissalKey);
    if (dismissedAt) {
      const dismissedTime = parseInt(dismissedAt, 10);
      const now = Date.now();
      const twentyFourHours = 24 * 60 * 60 * 1000; // 24 hours in ms
      if (now - dismissedTime < twentyFourHours) {
        setIsVisible(false);
        return;
      }
    }

    // Don't show if profile is complete
    if (completion === 100) {
      setIsVisible(false);
      return;
    }

    // Set visible after all checks
    setIsVisible(true);
  }, [user]);

  const handleDismiss = () => {
    if (!user) return;
    const dismissalKey = `profile-completion-banner-dismissed-${user.id}`;
    localStorage.setItem(dismissalKey, Date.now().toString());
    setIsVisible(false);
  };

  if (!user || !isVisible || percentage === 100) {
    return null;
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="w-full"
        >
          <Alert className="border-blue-200 bg-blue-50 text-blue-800 dark:border-blue-800 dark:bg-blue-950 dark:text-blue-200">
            <AlertCircle className="size-4" />
            <div className="flex w-full flex-col items-center justify-between md:flex-row">
              <div className="flex-1 text-left">
                <AlertTitle className="text-sm sm:text-base">Complete Your Profile</AlertTitle>
                <AlertDescription>
                  You&apos;re {percentage}% done! Complete your profile to
                  unlock all features. {missingFields.length} fields remaining.
                </AlertDescription>
              </div>
              <div className="mt-3 flex w-full flex-col space-y-2 sm:mt-2 sm:flex-row sm:items-center sm:space-x-2 sm:space-y-0 md:mt-0 md:w-auto">
                <Progress value={percentage} className="w-full sm:w-16 md:w-20" />
                <Button asChild className="w-full sm:w-auto" size="sm">
                  <Link href="/onboarding">
                    <span className="xs:inline hidden">Complete Profile</span>
                    <span className="xs:hidden">Complete</span>
                    <ArrowRight className="ml-1 size-3.5" />
                  </Link>
                </Button>
                <Button variant="ghost" onClick={handleDismiss} className="w-full sm:w-auto" size="sm">
                  Remind Me Later
                </Button>
              </div>
            </div>
          </Alert>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
