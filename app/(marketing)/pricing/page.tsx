import Image from "next/image";
import Link from "next/link";

import { constructMetadata } from "@/lib/utils";
import { ClientPricingPage } from "@/components/pricing/client-pricing-page";
import { ComparePlans } from "@/components/pricing/compare-plans";
import { PricingCards } from "@/components/pricing/pricing-cards";
import { PricingFaq } from "@/components/pricing/pricing-faq";

export const metadata = constructMetadata({
  title: "Pricing – Fastlearners",
  description: "Explore our flexible subscription plans for students, guardians, teachers, and schools.",
});

export default function PricingPage() {
  return <ClientPricingPage />;
}
