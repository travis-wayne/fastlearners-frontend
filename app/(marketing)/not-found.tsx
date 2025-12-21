import Image from "next/image";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center px-4 py-12">
      <h1 className="text-gradient_indigo-purple font-heading text-7xl font-bold sm:text-8xl md:text-9xl">404</h1>
      <div className="relative mb-8 mt-4 size-48 sm:size-64 md:size-80">
        <Image
          src="/_static/illustrations/rocket-crashed.svg"
          alt="404 Rocket Crashed"
          fill
          className="pointer-events-none object-contain dark:invert"
        />
      </div>
      <p className="max-w-md text-balance text-center text-lg font-medium text-muted-foreground sm:text-xl md:text-2xl">
        Oops! The page you&apos;re looking for has drifted into deep space.
      </p>
      <Link
        href="/"
        className="mt-8 rounded-full bg-primary px-8 py-3 text-sm font-semibold text-primary-foreground transition-all hover:scale-105 hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 sm:text-base"
      >
        Back to Homepage
      </Link>
    </div>
  );
}
