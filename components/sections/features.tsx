import { features } from "@/config/landing";
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

      <div className="mt-10 grid grid-cols-1 gap-component-md sm:grid-cols-2 sm:gap-component-lg lg:grid-cols-3">
        {features.map((feature) => {
          const Icon = Icons[feature.icon || "nextjs"];
          return (
            <div
              className="group relative overflow-hidden rounded-lg border bg-background p-component-md sm:p-component-lg lg:p-component-xl"
              key={feature.title}
            >
              <div
                aria-hidden="true"
                className="absolute inset-0 aspect-video -translate-y-1/2 rounded-full border bg-gradient-to-b from-cyan-400/25 via-primary/10 to-yellow-300/20 opacity-70 blur-2xl duration-300 group-hover:-translate-y-1/4 dark:from-cyan-400/10 dark:via-primary/10 dark:to-yellow-300/10 dark:opacity-60"
              />
              <div className="relative">
                <div className="relative flex size-control-md rounded-2xl border border-border shadow-sm *:relative *:m-auto *:size-5 sm:size-control-lg sm:*:size-6">
                  <Icon />
                </div>

                <p className="mt-6 pb-6 text-sm text-muted-foreground sm:text-base">
                  {feature.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </SectionWrapper>
  );
}
