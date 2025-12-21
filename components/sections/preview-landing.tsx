import Image from "next/image";

import MaxWidthWrapper from "@/components/shared/max-width-wrapper";

export default function PreviewLanding() {
  return (
    <div className="pb-12 sm:pb-16 md:pb-20 lg:pb-24">
      <MaxWidthWrapper>
        <div className="relative rounded-xl p-2 md:rounded-2xl md:bg-muted/30 md:p-3 md:ring-1 md:ring-inset md:ring-border lg:p-4">
          <div className="relative aspect-video overflow-hidden rounded-lg border shadow-2xl md:rounded-xl">
            <Image
              className="size-full object-cover object-center dark:opacity-90 dark:invert"
              src="/post.png"
              alt="Fastlearners Dashboard Preview"
              width={2000}
              height={1000}
              priority={true}
            />
          </div>
        </div>
      </MaxWidthWrapper>
    </div>
  );
}
