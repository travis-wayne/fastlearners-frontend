import * as React from "react";
import Link from "next/link";

import { footerLinks, siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";
import { ModeToggle } from "@/components/layout/mode-toggle";
import { SectionWrapper } from "@/components/shared/section-wrapper";

import { NewsletterForm } from "../forms/newsletter-form";
import { Icons } from "../shared/icons";

export function SiteFooter({ className }: React.HTMLAttributes<HTMLElement>) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={cn("border-t", className)}>
      <SectionWrapper
        as="div"
        className="grid grid-cols-1 gap-10 py-10 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5"
      >
        {footerLinks.map((section) => (
          <div key={section.title}>
            <span className="text-sm font-medium text-foreground">
              {section.title}
            </span>
            <ul className="mt-4 list-inside space-y-3 sm:space-y-4">
              {section.items?.map((link) => (
                <li key={link.title}>
                  <Link
                    href={link.href}
                    className="block py-1 text-sm text-muted-foreground hover:text-primary"
                  >
                    {link.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
        <div className="md:col-span-2 lg:col-span-2">
          <NewsletterForm />
        </div>
      </SectionWrapper>

      <div className="border-t">
        <SectionWrapper
          as="div"
          disableVerticalPadding
          className="flex flex-col items-center justify-between gap-4 py-6 sm:flex-row sm:py-4"
        >
          <span className="text-center text-sm text-muted-foreground sm:text-left">
            Copyright &copy; {currentYear}. All rights reserved.
          </span>
          <div className="flex items-center gap-3">
            <ModeToggle />
          </div>
        </SectionWrapper>
      </div>
    </footer>
  );
}
