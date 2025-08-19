"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, ArrowLeft, Loader2, Shield } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { authApi } from "@/lib/api/auth";
import { cn } from "@/lib/utils";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const resetCodeSchema = z.object({
  code: z
    .string()
    .min(6, "Please enter the 6-digit code")
    .max(6, "Code must be exactly 6 digits"),
});

type ResetCodeFormData = z.infer<typeof resetCodeSchema>;

interface VerifyResetCodeFormProps extends React.ComponentProps<"div"> {
  email?: string;
}

export function VerifyResetCodeForm({
  className,
  email,
  ...props
}: VerifyResetCodeFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(0);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    setValue,
  } = useForm<ResetCodeFormData>({
    resolver: zodResolver(resetCodeSchema),
  });

  // Start countdown timer
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const onSubmit = async (data: ResetCodeFormData) => {
    if (!email) {
      setError("Email is required. Please go back and try again.");
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const response = await authApi.verifyResetCode({
        email: email,
        code: data.code,
      });

      if (response.success) {
        toast.success("Code verified!", {
          description: "You can now set a new password.",
        });

        // Store the verification token temporarily and redirect to reset password
        if (typeof window !== "undefined") {
          sessionStorage.setItem("reset_token", data.code); // Use the code as token for now
          sessionStorage.setItem("reset_email", email);
        }

        router.push(
          `/auth/reset-password?email=${encodeURIComponent(email)}&token=${data.code}`,
        );
      } else {
        throw new Error(response.message || "Invalid verification code.");
      }
    } catch (err: any) {
      const errorMessage =
        err?.message || "Invalid verification code. Please try again.";
      setError(errorMessage);
      if (
        !errorMessage.includes("Network error") &&
        !errorMessage.includes("Backend API")
      ) {
        toast.error(errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (!email || countdown > 0) return;

    try {
      setIsResending(true);
      setError(null);

      const response = await authApi.resendResetCode(email);

      if (response.success) {
        toast.success("Code sent!", {
          description: "A new reset code has been sent to your email.",
        });

        setCountdown(60); // Start 60-second countdown
      } else {
        throw new Error(response.message || "Failed to resend code.");
      }
    } catch (err: any) {
      const errorMessage =
        err?.message || "Failed to resend code. Please try again.";
      setError(errorMessage);
      if (
        !errorMessage.includes("Network error") &&
        !errorMessage.includes("Backend API")
      ) {
        toast.error(errorMessage);
      }
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
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full bg-blue-100">
            <Shield className="size-6 text-blue-600" />
          </div>
          <CardTitle>Enter reset code</CardTitle>
          <CardDescription>
            We sent a 6-digit code to
            <br />
            <span className="font-medium text-foreground">{email}</span>
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="size-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-3">
                <Label htmlFor="code" className="text-center">
                  Reset code
                </Label>
                <div className="flex justify-center gap-2">
                  {[...Array(6)].map((_, index) => (
                    <Input
                      key={index}
                      ref={(el) => {
                        inputRefs.current[index] = el;
                      }}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      className="size-12 text-center text-lg font-semibold"
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
                className="w-full"
                disabled={isLoading || isSubmitting || codeValue.length !== 6}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 size-4 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  "Verify code"
                )}
              </Button>
            </div>

            <div className="mt-6 space-y-4">
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
              </div>

              <div className="text-center">
                <Link
                  href="/auth/login"
                  className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
                >
                  <ArrowLeft className="size-4" />
                  Back to login
                </Link>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
