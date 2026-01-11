import React from "react";

interface SectionColumnsType {
  title: string;
  description?: string;
  children: React.ReactNode;
}

export function SectionColumns({
  title,
  description,
  children,
}: SectionColumnsType) {
  return (
    <div className="grid grid-cols-1 gap-x-component-lg gap-y-component-md py-component-lg sm:py-component-xl md:grid-cols-10 lg:gap-x-component-xl">
      <div className="col-span-4 space-y-component-xs sm:space-y-component-sm">
        <h2 className="text-heading-md font-semibold leading-none sm:text-heading-lg">{title}</h2>
        <p className="responsive-text text-balance text-muted-foreground">
          {description}
        </p>
      </div>
      <div className="col-span-6">{children}</div>
    </div>
  );
}
