import Image from "next/image";
import { InfoLdg } from "@/types";

import { cn } from "@/lib/utils";
import { Icons } from "@/components/shared/icons";
import MaxWidthWrapper from "@/components/shared/max-width-wrapper";

interface InfoLandingProps {
  data: InfoLdg;
  reverse?: boolean;
}

export default function InfoLanding({
  data,
  reverse = false,
}: InfoLandingProps) {
  return (
    <div className="py-10 sm:py-16 md:py-20 lg:py-24">
      <MaxWidthWrapper className="grid gap-6 px-4 sm:gap-8 sm:px-6 md:grid-cols-1 lg:grid-cols-2 lg:items-center lg:px-8">
        <div className={cn(reverse ? "lg:order-2" : "lg:order-1")}>
          <h2 className="text-pretty font-heading text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl">
            {data.title}
          </h2>
          <p className="mt-6 text-balance text-base leading-relaxed text-muted-foreground sm:text-lg">
            {data.description}
          </p>
          <dl className="mt-8 space-y-6">
            {data.list.map((item, index) => {
              const Icon = Icons[item.icon || "arrowRight"];
              return (
                <div className="relative pl-12" key={index}>
                  <dt className="text-base font-semibold text-foreground sm:text-lg">
                    <div className="absolute left-0 top-0.5 flex size-8 items-center justify-center rounded-lg bg-primary/10">
                      <Icon className="size-5 text-primary" />
                    </div>
                    <span>{item.title}</span>
                  </dt>
                  <dd className="mt-1 text-sm text-muted-foreground sm:text-base">
                    {item.description}
                  </dd>
                </div>
              );
            })}
          </dl>
        </div>
        <div
          className={cn(
            "group relative overflow-hidden rounded-2xl border bg-muted/20 shadow-2xl transition-all duration-300 hover:shadow-primary/5 lg:-m-4",
            reverse ? "lg:order-1" : "lg:order-2",
          )}
        >
          <div className="aspect-video overflow-hidden">
            <Image
              className="size-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
              src={data.image}
              alt={data.title}
              width={1000}
              height={500}
              priority={true}
            />
          </div>
        </div>
      </MaxWidthWrapper>
    </div>
  );
}
