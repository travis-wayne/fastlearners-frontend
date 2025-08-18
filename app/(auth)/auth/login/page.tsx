import { LoginForm } from "@/components/auth/LoginForm";
import { GoogleAuthChecker } from "@/components/auth/GoogleAuthChecker";
import Image from "next/image";

export default function LoginPage() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-background p-6 text-foreground md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <a href="/" className="flex items-center gap-2 self-center font-medium" aria-label="Fast Learners">
          <Image src="/fastlearners-logo.svg" alt="Fast Learners" width={24} height={24} className="w-auto" />
        </a>
        <GoogleAuthChecker />
        <LoginForm />
      </div>
    </div>
  );
}


