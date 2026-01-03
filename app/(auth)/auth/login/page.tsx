import Image from "next/image";

import { GoogleAuthChecker } from "@/components/auth/GoogleAuthChecker";
import { LoginForm } from "@/components/auth/LoginForm";

export default function LoginPage() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-component-md bg-background p-component-md text-foreground sm:gap-component-lg sm:p-component-lg lg:p-component-xl">
      <div className="flex w-full max-w-sm flex-col gap-component-md sm:gap-component-lg md:max-w-md">
        <a
          href="/"
          className="mb-component-xl flex items-center gap-2 self-center font-medium sm:mb-12"
          aria-label="Fast Learners"
        >
          <Image
            src="/fastlearners-logo.svg"
            alt="Fast Learners"
            width={100}
            height={100}
            className="size-auto max-h-[20vh] max-w-[25vh] object-contain sm:max-h-[25vh]"
          />
        </a>
        <GoogleAuthChecker />
        <LoginForm />
      </div>
    </div>
  );
}
