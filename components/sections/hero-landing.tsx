"use client";

import Image from "next/image";
import Link from "next/link";

import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "@/components/ui/button";
import BlurImage from "@/components/shared/blur-image";
import { Icons } from "../shared/icons";

const logos = [
  "/fastlearners-logo.png",
  "/fastlearners-logo.png",
  "/fastlearners-logo.png",
  "/fastlearners-logo.png",
  "/fastlearners-logo.png",
  "/fastlearners-logo.png",
];

const InfiniteLogoSlider = () => {
  return (
    <div className="relative overflow-hidden">
      {/* Left blur overlay */}
      <div className="absolute left-0 top-0 z-10 h-full w-16 bg-gradient-to-r from-background to-transparent" />

      {/* Right blur overlay */}
      <div className="absolute right-0 top-0 z-10 h-full w-16 bg-gradient-to-l from-background to-transparent" />

      {/* Scrolling container */}
      <div className="flex animate-scroll space-x-12">
        {/* Duplicate logos for seamless infinite scroll */}
        {[...logos, ...logos, ...logos].map((logo, index) => (
          <div key={index} className="shrink-0">
            <Image
              src={logo}
              alt={`Logo ${index + 1}`}
              width={80}
              height={32}
              className="h-8 w-auto object-contain opacity-60 transition-opacity hover:opacity-100 dark:invert"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default function HeroLanding() {
  return (
    <section className="py-12 md:py-20">
      {/* Main hero container */}
      <div className="container max-w-7xl">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Left content */}
          <div className="relative z-10 flex flex-col justify-center space-y-8">
            <div className="space-y-6">
              <h1 className="text-balance font-urban text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-[66px]">
                Built for{" "}
                <span className="text-gradient_indigo-purple font-extrabold">
                  Learners {" "}
                </span>
                Powered by Passion
              </h1>

              <p
                className="max-w-2xl text-balance leading-normal text-muted-foreground sm:text-xl sm:leading-8"
                style={{ animationDelay: "0.35s", animationFillMode: "forwards" }}
              >
                Fastlearners is a smart digital platform that makes learning faster, easier, and more engaging for students, professionals, and institutions; all in one place.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col gap-4 sm:flex-row sm:gap-6">
              <div
                className="flex justify-center space-x-2 md:space-x-4"
                style={{ animationDelay: "0.4s", animationFillMode: "forwards" }}
              >
                <Link
                  href="/auth/register"
                  prefetch={true}
                  className={cn(
                    buttonVariants({ size: "lg", rounded: "full" }),
                    "gap-2",
                  )}
                >
                  <span>Create free account</span>
                </Link>
              </div>

              <div
                className="flex justify-center space-x-2 md:space-x-4"
                style={{ animationDelay: "0.4s", animationFillMode: "forwards" }}
              >
                <Link
                  href="/#"
                  prefetch={true}
                  className={cn(
                    buttonVariants({ variant: "outline", size: "lg", rounded: "full" }),
                    "gap-2",
                  )}
                >
                  <span>Learn More</span>
                  <Icons.arrowRight className="size-4" />
                </Link>
              </div>
            </div>
          </div>

          {/* Right image */}
          <div className="relative">
            <div className="absolute inset-0 -z-10">
              <BlurImage
                src="/OBJECTS.jpg"
                alt="Abstract background"
                fill
                className="object-cover object-center"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>

            {/* Placeholder for main hero image if needed */}
            <div className="aspect-square opacity-20 lg:aspect-[4/3]" />
          </div>
        </div>
      </div>

      {/* Powered by section */}
      <div className="mt-16 md:mt-24">
        <div className="container max-w-7xl">
          <div className="space-y-8">
            <p className="text-center text-sm font-medium text-muted-foreground">
              Powered by the tools you love
            </p>

            <InfiniteLogoSlider />
          </div>
        </div>
      </div>
    </section>
  );
}
