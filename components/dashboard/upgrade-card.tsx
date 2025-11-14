import Link from "next/link";
import { useAuthStore } from "@/store/authStore";

import { calculateProfileCompletion } from "@/lib/utils/profile-completion";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function UpgradeCard() {
  const { user } = useAuthStore();
  const completion = user ? calculateProfileCompletion(user) : 0;

  if (!user || completion === 100) {
    return null;
  }

  const buttonText = completion > 0 ? "Continue Setup" : "Complete Profile";
  const description = `You're ${completion}% done! Finish setting up your profile to unlock all features and personalize your learning experience.`;

  return (
    <Card className="md:max-xl:rounded-none md:max-xl:border-none md:max-xl:shadow-none">
      <CardHeader className="md:max-xl:px-4">
        <CardTitle>Complete Your Profile</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="md:max-xl:px-4">
        <Link href="/onboarding">
          <Button size="sm" className="w-full">
            {buttonText}
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}
