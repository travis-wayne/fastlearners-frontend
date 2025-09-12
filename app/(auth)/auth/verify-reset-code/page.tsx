"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";

import { VerifyResetCodeForm } from "@/components/auth/verify-reset-code-form";

function VerifyResetCodeContent() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <VerifyResetCodeForm email={email} />
      </div>
    </div>
  );
}

export default function VerifyResetCodePage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
          <div className="flex w-full max-w-sm items-center justify-center">
            <Loader2 className="size-6 animate-spin" />
          </div>
        </div>
      }
    >
      <VerifyResetCodeContent />
    </Suspense>
  );
}
