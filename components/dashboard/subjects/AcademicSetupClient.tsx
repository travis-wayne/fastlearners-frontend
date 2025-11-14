"use client";

import { useRouter } from "next/navigation";

import { AcademicSetupForm } from "./AcademicSetupForm";

interface AcademicSetupClientProps {
  token?: string;
}

export function AcademicSetupClient({ token }: AcademicSetupClientProps) {
  const router = useRouter();

  const handleComplete = () => {
    router.refresh();
  };

  return <AcademicSetupForm token={token} onComplete={handleComplete} />;
}
