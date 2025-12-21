"use client";

import Image from "next/image";

interface AuthLayoutProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  showLogo?: boolean;
}

export function AuthLayout({
  children,
  title = "Fast Learners",
  subtitle = "Accelerate your learning journey",
  showLogo = true,
}: AuthLayoutProps) {
  return (
    <div className="grid min-h-svh grid-cols-1 lg:grid-cols-2">
      <div className="relative hidden bg-muted lg:block">
        <div className="absolute inset-0 bg-[#00519C]">
          <div className="absolute inset-0 bg-black/20" />
          <div className="relative flex h-full flex-col items-center justify-center p-6 text-white sm:p-8 md:p-10">
            {/* <div className="text-center space-y-4">
              <div className="flex justify-center md:justify-start">
                <a href="/" aria-label={title} className="inline-flex items-center">
                  <img src="/fastlearners-logo.svg" alt={title} className="h-4 md:h-4 w-auto" />
                </a>
              </div>
              <p className="text-lg opacity-90">{subtitle}</p>
              <div className="mt-8 space-y-2 text-sm opacity-75">
                <p>✓ Interactive learning modules</p>
                <p>✓ Progress tracking & analytics</p>
                <p>✓ Expert-curated content</p>
                <p>✓ Community-driven discussions</p>
              </div>
            </div> */}
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-4 p-4 sm:gap-6 sm:p-6 md:p-8 lg:p-10">
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-sm md:max-w-md">
            {showLogo && (
              <div className="mb-12 flex justify-center">
                <a
                  href="/"
                  aria-label={title}
                  className="inline-flex items-center"
                >
                  <Image
                    src="/fastlearners-logo.svg"
                    alt={title}
                    width={100}
                    height={100}
                    className="size-auto max-h-[20vh] max-w-[25vh] object-contain sm:max-h-[25vh]"
                  />
                </a>
              </div>
            )}
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
