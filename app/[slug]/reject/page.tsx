"use client";

import { RejectConsentForm } from "@/components/parental-consent/reject-consent-form";

interface RejectConsentPageProps {
  params: {
    slug: string;
  };
}

export default function RejectConsentPage({ params }: RejectConsentPageProps) {
  return <RejectConsentForm token={params.slug} />;
}
