import Image from "next/image";
import Link from "next/link";

import { constructMetadata } from "@/lib/utils";
import { ClientPricingPage } from "@/components/pricing/client-pricing-page";
import { ComparePlans } from "@/components/pricing/compare-plans";
import { PricingCards } from "@/components/pricing/pricing-cards";
import { PricingFaq } from "@/components/pricing/pricing-faq";

export const metadata = constructMetadata({
  title: "Pricing – SaaS Starter",
  description: "Explore our subscription plans.",
});

export default function PricingPage() {
  return <ClientPricingPage />;
}
