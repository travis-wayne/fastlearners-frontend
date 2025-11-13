"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle, ArrowRight } from "lucide-react";

import { useAuthStore } from "@/store/authStore";
import { getMissingFields } from "@/lib/utils/profile-completion";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";

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
          <Alert className="bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-950 dark:border-blue-800 dark:text-blue-200">
            <AlertCircle className="h-4 w-4" />
            <div className="flex flex-col md:flex-row items-center justify-between w-full">
              <div className="flex-1">
                <AlertTitle>Complete Your Profile</AlertTitle>
                <AlertDescription>
                  You're {percentage}% done! Complete your profile to unlock all features. {missingFields.length} fields remaining.
                </AlertDescription>
              </div>
              <div className="flex items-center space-x-2 mt-2 md:mt-0">
                <Progress value={percentage} className="w-20" />
                <Button asChild>
                  <Link href="/onboarding">
                    Complete Profile <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button variant="ghost" onClick={handleDismiss}>
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