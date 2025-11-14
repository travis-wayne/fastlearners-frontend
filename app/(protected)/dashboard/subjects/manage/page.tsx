"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { AlertTriangle, ArrowLeft, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { SimpleSubjectSelector } from "@/components/dashboard/subjects/SimpleSubjectSelector";
import { getProfile } from "@/lib/api/profile";
import { useAuthStore } from "@/store/authStore";

export default function ManageSubjectsPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [isLoading, setIsLoading] = useState(true);
  const [profileError, setProfileError] = useState<string | null>(null);

  useEffect(() => {
    const checkProfile = async () => {
      setIsLoading(true);
      setProfileError(null);
      
      try {
        // Fetch user profile to verify class and discipline are set
        const profile = await getProfile();
        
        // Check if user has a class set (required for subject selection)
        if (!profile.class) {
          setProfileError(
            "You need to set your class in your profile before selecting subjects. " +
            "Please update your profile first."
          );
        }
      } catch (error: any) {
        setProfileError(error.message || "Failed to load profile information");
      } finally {
        setIsLoading(false);
      }
    };

    checkProfile();
  }, []);

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="space-y-4 text-center">
          <Loader2 className="mx-auto size-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Show error if profile doesn't have class set
  if (profileError || !user?.class) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="size-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Manage Subjects</h1>
            <p className="text-muted-foreground">
              Update your subject selections based on your profile
            </p>
          </div>
        </div>

        <Alert variant="destructive">
          <AlertTriangle className="size-4" />
          <AlertDescription>
            {profileError || "Your profile doesn't have a class set. Please update your profile first."}
          </AlertDescription>
        </Alert>

        <Card>
          <CardContent className="pt-6">
            <Button onClick={() => router.push("/dashboard/settings/profile")}>
              Update Profile
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="size-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Manage Subjects</h1>
          <p className="text-muted-foreground">
            Update your subject selections for {user.class}
            {user.discipline && ` - ${user.discipline}`}
          </p>
        </div>
      </div>

      {/* Info Card */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card className="border-blue-200 bg-blue-50 dark:border-blue-900 dark:bg-blue-950">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-900 dark:text-blue-100">
              <AlertTriangle className="size-5" />
              Important Notice
            </CardTitle>
            <CardDescription className="text-blue-800 dark:text-blue-200">
              Subject selections are based on your profile information
            </CardDescription>
          </CardHeader>
          <CardContent className="text-blue-800 dark:text-blue-200">
            <ul className="list-inside list-disc space-y-1 text-sm">
              <li>
                Your class ({user.class}) and discipline ({user.discipline || "N/A"}) are taken from your profile
              </li>
              <li>
                Modifying your subject selections will overwrite your current registration
              </li>
              <li>
                You can always come back to modify your selections again
              </li>
            </ul>
          </CardContent>
        </Card>
      </motion.div>

      {/* Subject Selector */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <SimpleSubjectSelector />
      </motion.div>
    </div>
  );
}

