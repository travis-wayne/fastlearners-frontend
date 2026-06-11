import { constructMetadata } from "@/lib/utils";
import { ClientPricingPage } from "@/components/pricing/client-pricing-page";

export const metadata = constructMetadata({
  title: "Pricing – Fastlearners",
  description:
    "Explore our flexible subscription plans for students, guardians, teachers, and schools.",
});

export default function PricingPage() {
  return <ClientPricingPage />;
}
