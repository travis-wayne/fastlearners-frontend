"use client";

import { AcceptConsentForm } from "@/components/parental-consent/accept-consent-form";

interface AcceptConsentPageProps {
  params: {
    token: string;
  };
}

export default function AcceptConsentPage({ params }: AcceptConsentPageProps) {
  return <AcceptConsentForm token={params.token} />;
}
