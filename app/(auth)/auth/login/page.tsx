import Image from "next/image";

import { GoogleAuthChecker } from "@/components/auth/GoogleAuthChecker";
import { LoginForm } from "@/components/auth/LoginForm";

export default function LoginPage() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-4 bg-background p-4 text-foreground sm:gap-6 sm:p-6 md:p-8 lg:p-10">
      <div className="flex w-full max-w-sm flex-col gap-4 sm:gap-6 md:max-w-md">
        <a
          href="/"
          className="mb-8 flex items-center gap-2 self-center font-medium sm:mb-12"
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
