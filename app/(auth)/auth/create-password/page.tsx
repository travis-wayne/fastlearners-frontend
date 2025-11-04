"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";

import { AuthLayout } from "@/components/auth/AuthLayout";
import { CreatePasswordForm } from "@/components/auth/CreatePasswordForm";

function CreatePasswordContent() {
  const searchParams = useSearchParams();
  // Email/token are no longer read from query; server uses HttpOnly cookie
  return (
    <AuthLayout subtitle="Set up your secure password">
      <CreatePasswordForm />
    </AuthLayout>
  );
}

export default function CreatePasswordPage() {
  return (
    <Suspense
      fallback={
        <AuthLayout subtitle="Set up your secure password">
          <div className="flex items-center justify-center p-6">
            <Loader2 className="size-6 animate-spin" />
          </div>
        </AuthLayout>
      }
    >
      <CreatePasswordContent />
    </Suspense>
  );
}
