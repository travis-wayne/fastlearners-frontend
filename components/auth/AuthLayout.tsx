'use client';

import Image from 'next/image';

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
  showLogo = true
}: AuthLayoutProps) {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="relative hidden bg-muted lg:block">
        <div className="absolute inset-0 bg-[#00519C]">
          <div className="absolute inset-0 bg-black/20" />
          <div className="relative flex h-full flex-col items-center justify-center p-10 text-white">
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
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            {showLogo && (
              <div className="mb-6 flex justify-center">
                <a href="/" aria-label={title} className="inline-flex items-center">
                  <Image src="/fastlearners-logo.svg" alt={title} width={24} height={24} className="w-auto" />
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
