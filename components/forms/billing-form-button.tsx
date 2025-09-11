"use client";

import { useState } from "react";
import { SubscriptionPlan, UserSubscriptionPlan } from "@/types";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Icons } from "@/components/shared/icons";

interface BillingFormButtonProps {
  offer: SubscriptionPlan;
  subscriptionPlan: UserSubscriptionPlan;
  year: boolean;
}

export function BillingFormButton({
  year,
  offer,
  subscriptionPlan,
}: BillingFormButtonProps) {
  const [isPending, setIsPending] = useState(false);

  const handleUpgrade = async () => {
    setIsPending(true);
    // TODO: Implement Stripe integration with Fastlearners API
    toast.info("Stripe integration coming soon!");
    setIsPending(false);
  };

  const userOffer =
    subscriptionPlan.stripePriceId ===
    offer.stripeIds[year ? "yearly" : "monthly"];

  return (
    <Button
      variant={userOffer ? "default" : "outline"}
      className="w-full rounded-full"
      disabled={isPending}
      onClick={handleUpgrade}
    >
      {isPending ? (
        <>
          <Icons.spinner className="mr-2 size-4 animate-spin" /> Loading...
        </>
      ) : (
        <>{userOffer ? "Manage Subscription" : "Upgrade"}</>
      )}
    </Button>
  );
}
