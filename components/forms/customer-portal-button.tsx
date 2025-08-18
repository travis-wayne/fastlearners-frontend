"use client";

import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Icons } from "@/components/shared/icons";

interface CustomerPortalButtonProps {
  userStripeId: string;
}

export function CustomerPortalButton({
  userStripeId,
}: CustomerPortalButtonProps) {
  const [isPending, setIsPending] = useState(false);

  const handleOpenPortal = async () => {
    setIsPending(true);
    // TODO: Implement customer portal with Fastlearners API
    toast.info("Customer portal coming soon!");
    setIsPending(false);
  };

  return (
    <Button disabled={isPending} onClick={handleOpenPortal}>
      {isPending ? (
        <Icons.spinner className="mr-2 size-4 animate-spin" />
      ) : null}
      Open Customer Portal
    </Button>
  );
}
