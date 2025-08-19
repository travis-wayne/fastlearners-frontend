import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function UpgradeCard() {
  return (
    <Card className="md:max-xl:rounded-none md:max-xl:border-none md:max-xl:shadow-none">
      <CardHeader className="md:max-xl:px-4">
        <CardTitle>Complete Your Profile</CardTitle>
        <CardDescription>
          Finish setting up your profile to unlock all features and personalize
          your learning experience.
        </CardDescription>
      </CardHeader>
      <CardContent className="md:max-xl:px-4">
        <Link href="/onboarding/complete-profile">
          <Button size="sm" className="w-full">
            Complete Profile
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}
