import Image from "next/image";

import { testimonials } from "@/config/landing";
import { HeaderSection } from "@/components/shared/header-section";
import { SectionWrapper } from "@/components/shared/section-wrapper";

export default function Testimonials() {
  return (
    <SectionWrapper as="section" className="py-12 sm:py-16 lg:py-24">
      <div className="flex flex-col gap-10 sm:gap-y-16">
        <HeaderSection
          label="Testimonials"
          title="What our learners are saying."
          subtitle="Discover insights and feedback from students and educators using Fastlearners to transform their educational experience."
        />

        <div className="columns-1 gap-4 space-y-4 sm:columns-2 sm:gap-6 sm:space-y-6 lg:columns-3">
          {testimonials.map((item) => (
            <div className="break-inside-avoid" key={item.name}>
              <div className="relative rounded-xl border bg-muted/25">
                <div className="flex flex-col p-4 sm:p-5 md:p-6">
                  <div>
                    <div className="relative mb-4 flex items-center gap-3">
                      <span className="relative inline-flex size-8 shrink-0 items-center justify-center rounded-full text-base sm:size-10">
                        <Image
                          width={40}
                          height={40}
                          className="size-full rounded-full border"
                          src={item.image}
                          alt={item.name}
                        />
                      </span>
                      <div>
                        <p className="text-sm font-semibold text-foreground">
                          {item.name}
                        </p>
                        <p className="text-xs text-muted-foreground sm:text-sm">
                          {item.job}
                        </p>
                      </div>
                    </div>
                    <q className="text-balance text-sm text-muted-foreground sm:text-base">
                      {item.review}
                    </q>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </SectionWrapper>
  );
}
