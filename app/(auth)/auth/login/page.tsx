import { title } from "process";
import Image from "next/image";

import { GoogleAuthChecker } from "@/components/auth/GoogleAuthChecker";
import { LoginForm } from "@/components/auth/LoginForm";

export default function LoginPage() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-background p-6 text-foreground md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <a
          href="/"
          className="mb-12 flex items-center gap-2 self-center font-medium"
          aria-label="Fast Learners"
        >
          <Image
            src="/fastlearners-logo.svg"
            alt={title}
            width={100}
            height={100}
            className="size-auto max-h-[25vh] max-w-[25vh] object-contain"
          />
        </a>
        <GoogleAuthChecker />
        <LoginForm />
      </div>
    </div>
  );
}
