'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { CreatePasswordForm } from '@/components/auth/CreatePasswordForm';
import { AuthLayout } from '@/components/auth/AuthLayout';
import { Loader2 } from 'lucide-react';

function CreatePasswordContent() {
  const searchParams = useSearchParams();
  const email = searchParams.get('email') || '';
  const token = searchParams.get('token') || '';

  return (
    <AuthLayout subtitle="Set up your secure password">
      <CreatePasswordForm email={email} token={token} />
    </AuthLayout>
  );
}

export default function CreatePasswordPage() {
  return (
    <Suspense fallback={
      <AuthLayout subtitle="Set up your secure password">
        <div className="flex items-center justify-center p-6">
          <Loader2 className="size-6 animate-spin" />
        </div>
      </AuthLayout>
    }>
      <CreatePasswordContent />
    </Suspense>
  );
}


