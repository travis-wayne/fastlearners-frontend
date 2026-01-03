"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, Loader2, Mail } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { authApi } from "@/lib/api/auth";
import { cn } from "@/lib/utils";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const otpSchema = z.object({
  code: z
    .string()
    .min(6, "Please enter the 6-digit code")
    .max(6, "Code must be exactly 6 digits"),
});

type OtpFormData = z.infer<typeof otpSchema>;

interface VerifyOtpFormProps extends React.ComponentProps<"form"> {
  email?: string;
}

export function VerifyOtpForm({
  className,
  email,
  ...props
}: VerifyOtpFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(0);
  const { setUser } = useAuthStore();
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    setValue,
  } = useForm<OtpFormData>({
    resolver: zodResolver(otpSchema),
  });

  // Start countdown timer
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const onSubmit = async (data: OtpFormData) => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await authApi.verifyEmail({
        email: email || "",
        code: data.code,
      });

      if (response.success && response.content) {
        toast.success("Email verified!", {
          description: "Your email has been successfully verified.",
        });

        // Store user in auth store (token is in HttpOnly cookie)
        const { user } = response.content;
        setUser(user);

        // Navigate to create password page (no token in URL)
        router.push("/auth/create-password");
      } else {
        setError(
          response.message || "Email verification failed. Please try again.",
        );
      }
    } catch (err: any) {
      // Handle different error response formats
      let errorMessage = "Invalid verification code. Please try again.";

      if (err?.message) {
        errorMessage = err.message;
      } else if (err?.errors) {
        // Handle validation errors from API
        const validationErrors = Object.values(err.errors).flat();
        errorMessage = validationErrors.join(", ");
      } else if (typeof err === "string") {
        errorMessage = err;
      }

      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (!email || countdown > 0) return;

    try {
      setIsResending(true);
      setError(null);

      const response = await authApi.resendVerificationCode(email);

      if (response.success) {
        toast.success("Code sent!", {
          description: "A new verification code has been sent to your email.",
        });

        setCountdown(60); // Start 60-second countdown
      } else {
        setError(
          response.message || "Failed to resend code. Please try again.",
        );
      }
    } catch (err: any) {
      const errorMessage =
        err?.message || "Failed to resend code. Please try again.";
      setError(errorMessage);
    } finally {
      setIsResending(false);
    }
  };

  const handleInputChange = (index: number, value: string) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const currentCode = watch("code") || "";
      const newCode = currentCode.split("");
      newCode[index] = value;

      const finalCode = newCode.join("").slice(0, 6);
      setValue("code", finalCode);

      // Auto-focus next input
      if (value && index < 5) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !watch("code")?.[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const codeValue = watch("code") || "";

  return (
    <form
      className={cn("flex flex-col gap-component-md sm:gap-component-lg", className)}
      {...props}
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="flex flex-col items-center gap-component-xs text-center sm:gap-component-sm">
        <div className="flex size-12 items-center justify-center rounded-full bg-primary/10">
          <Mail className="size-6 text-primary" />
        </div>
        <h1 className="text-heading-xl font-bold sm:text-2xl">Check your email</h1>
        <p className="text-balance text-sm text-muted-foreground sm:text-base">
          We sent a verification code to
          <br />
          <span className="font-medium text-foreground">{email}</span>
        </p>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="size-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid gap-component-md sm:gap-component-lg">
        <div className="grid gap-component-sm sm:gap-component-md">
          <Label htmlFor="code" className="text-center">
            Verification code
          </Label>
          <div className="flex justify-center gap-component-xs sm:gap-component-sm">
            {[...Array(6)].map((_, index) => (
              <Input
                key={index}
                ref={(el) => {
                  inputRefs.current[index] = el;
                }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                className="size-12 text-center text-base font-semibold sm:size-14 sm:text-heading-md"
                value={codeValue[index] || ""}
                onChange={(e) => handleInputChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                disabled={isLoading}
              />
            ))}
          </div>
          <input type="hidden" {...register("code")} />
          {errors.code && (
            <p className="text-center text-sm text-destructive">
              {errors.code.message}
            </p>
          )}
        </div>

        <Button
          type="submit"
          size="responsive"
          className="w-full"
          disabled={isLoading || isSubmitting || codeValue.length !== 6}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 size-4 animate-spin" />
              Verifying...
            </>
          ) : (
            "Verify email"
          )}
        </Button>
      </div>

      <div className="text-center text-sm">
        <p className="text-muted-foreground">
          Didn&apos;t receive the code?{" "}
          {countdown > 0 ? (
            <span className="text-muted-foreground">
              Resend in {countdown}s
            </span>
          ) : (
            <button
              type="button"
              onClick={handleResendCode}
              disabled={isResending || !email}
              className="text-primary underline-offset-4 hover:underline disabled:opacity-50"
            >
              {isResending ? "Sending..." : "Click to resend"}
            </button>
          )}
        </p>
        <p className="mt-2">
          <Link
            href="/auth/login"
            className="text-primary underline-offset-4 hover:underline"
          >
            Back to login
          </Link>
        </p>
      </div>
    </form>
  );
}
