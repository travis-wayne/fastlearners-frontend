"use client";

import Link from "next/link";
import Image from "next/image";

export default function ProjectSwitcher() {
  return (
    <Link
      href="/"
      className="flex items-center transition-opacity hover:opacity-80"
      aria-label="Go to home page"
    >
      <Image
        src="/fastlearners-logo.png"
        alt="Fast Learners Logo"
        width={100}
        height={16}
        className="h-5 w-auto object-contain sm:h-4"
      />
    </Link>
  );
}
