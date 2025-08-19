"use client";

import Image from "next/image";
import Link from "next/link";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import BlurImage from "@/components/shared/blur-image";

const logos = [
  "https://github.com/user-attachments/assets/a1f8b08e-26d4-4ad1-b43b-80f3e4fe3de7",
  "https://github.com/user-attachments/assets/4b7a2230-5e62-4012-b55d-9b59fa31fe7e",
  "https://github.com/user-attachments/assets/ffa88af3-71ca-4fe7-a4c8-fb4d6e938df8",
  "https://github.com/user-attachments/assets/7b96c3bb-37d5-498e-add9-de88ab0c7d2c",
  "https://github.com/user-attachments/assets/e7a2b85b-b8a0-4e8b-a58b-f6e9c96b7fef",
  "https://github.com/user-attachments/assets/3b7c1cb3-a9e9-4e43-9c1b-d7f5b24c8e5f",
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
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
                Ship 10x Faster with{" "}
                <span className="text-gradient_indigo-purple">
                  NS
                </span>
              </h1>
              
              <p className="max-w-xl text-lg text-muted-foreground sm:text-xl">
                Build modern web applications with our comprehensive Next.js starter template. 
                Authentication, payments, and deployment - all configured and ready to go.
              </p>
            </div>
            
            {/* CTA Buttons */}
            <div className="flex flex-col gap-4 sm:flex-row sm:gap-6">
              <Button size="lg" className="text-base">
                Start Building
              </Button>
              
              <Button variant="outline" size="lg" className="text-base">
                Request a demo
              </Button>
            </div>
          </div>
          
          {/* Right image */}
          <div className="relative">
            <div className="absolute inset-0 -z-10">
              <BlurImage
                src="https://github.com/user-attachments/assets/b1e32b97-6b5e-4e4b-8b5e-3e8b3b5b5b5b"
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
