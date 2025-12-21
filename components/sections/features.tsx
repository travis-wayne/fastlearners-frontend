import Link from "next/link";

import { features } from "@/config/landing";
import { Button } from "@/components/ui/button";
import { HeaderSection } from "@/components/shared/header-section";
import { Icons } from "@/components/shared/icons";
import { SectionWrapper } from "@/components/shared/section-wrapper";

export default function Features() {
  return (
    <SectionWrapper as="section" className="pt-16 sm:pt-20 lg:pt-24">
      <HeaderSection
        label="Features"
        title="Everything You Need to Excel"
        subtitle="From progress tracking to past questions, leaderboards to personalized learning — discover the powerful features that make Fastlearners the ultimate study companion."
      />

      <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6 lg:grid-cols-3">
        {features.map((feature) => {
          const Icon = Icons[feature.icon || "nextjs"];
          return (
            <div
              className="group relative overflow-hidden rounded-2xl border bg-background p-4 sm:p-5 md:p-6 lg:p-8"
              key={feature.title}
            >
              <div
                aria-hidden="true"
                className="absolute inset-0 aspect-video -translate-y-1/2 rounded-full border bg-gradient-to-b from-purple-500/80 to-white opacity-25 blur-2xl duration-300 group-hover:-translate-y-1/4 dark:from-white dark:to-white dark:opacity-5 dark:group-hover:opacity-10"
              />
              <div className="relative">
                <div className="relative flex size-10 rounded-2xl border border-border shadow-sm *:relative *:m-auto *:size-5 sm:size-12 sm:*:size-6">
                  <Icon />
                </div>

                <p className="mt-6 pb-6 text-sm text-muted-foreground sm:text-base md:text-lg">
                  {feature.description}
                </p>

                <div className="-mb-5 flex gap-3 border-t border-muted py-4 md:-mb-7">
                  <Button
                    variant="secondary"
                    size="sm"
                    className="rounded-xl px-4"
                  >
                    <Link href="/" className="flex items-center gap-2">
                      <span className="text-xs sm:text-sm">Visit the site</span>
                      <Icons.arrowUpRight className="size-4" />
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </SectionWrapper>
  );
}
