"use client";

import { RejectConsentForm } from "@/components/parental-consent/reject-consent-form";

interface RejectConsentPageProps {
  params: {
    token: string;
  };
}

export default function RejectConsentPage({ params }: RejectConsentPageProps) {
  return <RejectConsentForm token={params.token} />;
}
