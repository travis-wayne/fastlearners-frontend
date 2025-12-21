"use client";

import Image from "next/image";
import Link from "next/link";
import { useAuthStore } from "@/store/authStore";

import { UserSubscriptionPlan } from "types";
import { ComparePlans } from "@/components/pricing/compare-plans";
import { PricingCards } from "@/components/pricing/pricing-cards";
import { PricingFaq } from "@/components/pricing/pricing-faq";

export function ClientPricingPage() {
  const { user } = useAuthStore();

  if (user?.role.includes("admin")) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center p-6 text-center">
        <h1 className="text-3xl font-bold sm:text-4xl md:text-5xl">Seriously?</h1>
        <Image
          src="/_static/illustrations/call-waiting.svg"
          alt="403"
          width={560}
          height={560}
          className="pointer-events-none -my-10 size-full max-w-[400px] dark:invert sm:-my-20"
        />
        <p className="text-balance px-4 text-center text-lg font-medium sm:text-xl md:text-2xl">
          You are an admin. Back to{" "}
          <Link
            href="/admin"
            className="text-purple-600 underline underline-offset-4 hover:text-purple-500"
          >
            Dashboard
          </Link>
          .
        </p>
      </div>
    );
  }

  // Mock subscription plan for now
  const subscriptionPlan: UserSubscriptionPlan = {
    title: "Free",
    description: "Perfect for trying out our service",
    benefits: ["Basic features", "Community support"],
    limitations: ["Limited usage", "No premium features"],
    prices: {
      monthly: 0,
      yearly: 0,
    },
    stripeIds: {
      monthly: null,
      yearly: null,
    },
    isPaid: false,
    stripePriceId: null,
    stripeCustomerId: null,
    stripeSubscriptionId: null,
    stripeCurrentPeriodEnd: 0,
    interval: null,
    isCanceled: false,
  };

  return (
    <div className="flex w-full flex-col gap-12 py-10 sm:gap-16 sm:py-12 md:py-16">
      <PricingCards
        userId={user?.id?.toString()}
        subscriptionPlan={subscriptionPlan}
      />
      <hr className="container" />
      <ComparePlans />
      <PricingFaq />
    </div>
  );
}
