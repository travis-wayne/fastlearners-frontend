'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { VerifyOtpForm } from '@/components/auth/VerifyOtpForm';
import { AuthLayout } from '@/components/auth/AuthLayout';
import { Loader2 } from 'lucide-react';

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const email = searchParams.get('email') || '';

  return (
    <AuthLayout subtitle="Verify your email to continue">
      <VerifyOtpForm email={email} />
    </AuthLayout>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={
      <AuthLayout subtitle="Verify your email to continue">
        <div className="flex items-center justify-center p-6">
          <Loader2 className="h-6 w-6 animate-spin" />
        </div>
      </AuthLayout>
    }>
      <VerifyEmailContent />
    </Suspense>
  );
}


