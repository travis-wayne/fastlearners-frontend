"use client";

import Image from "next/image";
import Link from "next/link";

import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "@/components/ui/button";
import BlurImage from "@/components/shared/blur-image";
import { SectionWrapper } from "@/components/shared/section-wrapper";

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
      <div className="animate-scroll flex space-x-12">
        {/* Duplicate logos for seamless infinite scroll */}
        {[...logos, ...logos, ...logos].map((logo, index) => (
          <div key={index} className="shrink-0">
            {/* eslint-disable-next-line tailwindcss/classnames-order */}
            <Image
              src={logo}
              alt={`Logo ${index + 1}`}
              width={100}
              height={40}
              className="h-7 w-auto object-contain opacity-50 grayscale transition-all duration-300 hover:opacity-100 hover:grayscale-0 dark:invert sm:h-9 md:h-11"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default function HeroLanding() {
  return (
    <SectionWrapper
      as="section"
      className="space-y-12 pt-12 sm:pt-16 md:pt-20 lg:pt-24"
    >
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-12 xl:gap-16">
        {/* Left content */}
        <div className="relative z-10 flex flex-col justify-center space-y-8">
          <div className="space-y-6">
            <h1 className="text-balance font-urban text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl xl:text-[72px]">
              Built for{" "}
              <span className="text-gradient_indigo-purple font-extrabold">
                Learners{" "}
              </span>
              Powered by Passion
            </h1>

            <p
              className="max-w-2xl text-balance text-base leading-normal text-muted-foreground sm:text-lg sm:leading-8 md:text-xl"
              style={{
                animationDelay: "0.35s",
                animationFillMode: "forwards",
              }}
            >
              Fastlearners is a smart digital platform that makes learning
              faster, easier, and more engaging for students, professionals, and
              institutions; all in one place.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col gap-4 sm:flex-row sm:gap-6">
            <div
              className="flex justify-center space-x-2 md:space-x-4"
              style={{
                animationDelay: "0.4s",
                animationFillMode: "forwards",
              }}
            >
              <Link
                href="/auth/register"
                prefetch={true}
                className={cn(
                  buttonVariants({ size: "default" }),
                  "w-full gap-2 rounded-full sm:w-auto sm:px-8 sm:py-6 sm:text-lg",
                )}
              >
                <span>Create free account</span>
              </Link>
            </div>

            <div
              className="flex justify-center space-x-2 md:space-x-4"
              style={{
                animationDelay: "0.4s",
                animationFillMode: "forwards",
              }}
            >
              <Link
                href="/pricing"
                prefetch={true}
                className={cn(
                  buttonVariants({
                    variant: "outline",
                    size: "default",
                  }),
                  "w-full gap-2 rounded-full sm:w-auto sm:px-8 sm:py-6 sm:text-lg",
                )}
              >
                <span>Learn More</span>
                <Icons.arrowRight className="size-4" />
              </Link>
            </div>
          </div>
        </div>

        {/* Right image */}
        <div className="relative min-h-[300px] sm:min-h-[400px] md:min-h-[500px] lg:min-h-[600px]">
          <div className="absolute inset-0 -z-10 overflow-hidden rounded-2xl border bg-muted/20 shadow-2xl">
            <BlurImage
              src="/OBJECTS.jpg"
              alt="Abstract background"
              fill
              className="object-cover object-center transition-transform duration-500 hover:scale-105"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>

          <div className="aspect-square opacity-20 lg:aspect-[4/3]" />
        </div>
      </div>

      {/* Powered by section */}
      <div className="space-y-8">
        <p className="text-center text-sm font-medium text-muted-foreground">
          Powered by the tools you love
        </p>

        <InfiniteLogoSlider />
      </div>
    </SectionWrapper>
  );
}
