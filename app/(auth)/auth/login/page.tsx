import { LoginForm } from "@/components/auth/LoginForm";
import { GoogleAuthChecker } from "@/components/auth/GoogleAuthChecker";

export default function LoginPage() {
  return (
    <div className="bg-background text-foreground flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <a href="/" className="flex items-center gap-2 self-center font-medium" aria-label="Fast Learners">
          <img src="/fastlearners-logo.svg" alt="Fast Learners" className="h-6 w-auto" />
        </a>
        <GoogleAuthChecker />
        <LoginForm />
      </div>
    </div>
  );
}


