"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";

import { AuthLayout } from "@/components/auth/AuthLayout";
import { VerifyOtpForm } from "@/components/auth/VerifyOtpForm";

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";

  return (
    <AuthLayout subtitle="Verify your email to continue">
      <VerifyOtpForm email={email} />
    </AuthLayout>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense
      fallback={
        <AuthLayout subtitle="Verify your email to continue">
          <div className="flex items-center justify-center p-component-md sm:p-component-lg lg:p-component-xl">
            <Loader2 className="size-6 animate-spin" />
          </div>
        </AuthLayout>
      }
    >
      <VerifyEmailContent />
    </Suspense>
  );
}
