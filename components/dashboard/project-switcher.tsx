"use client";

import Link from "next/link";

export default function ProjectSwitcher() {
  return (
    <Link
      href="/"
      className="flex items-center transition-opacity hover:opacity-80"
      aria-label="Go to home page"
    >
      <img
        src="/fastlearners-logo.png"
        alt="Fast Learners Logo"
        className="h-4 w-auto object-contain"
      />
    </Link>
  );
}
