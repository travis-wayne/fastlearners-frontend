"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, ArrowLeft, Loader2, Mail } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { authApi } from "@/lib/api/auth";
import { cn } from "@/lib/utils";
import { forgotPasswordSchema } from "@/lib/validations/auth";
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

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

export function ForgotPasswordForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const email = watch("email");

  const onSubmit = async (data: ForgotPasswordFormData) => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await authApi.forgotPassword({ email: data.email });

      if (!response.success) {
        throw new Error(response.message || "Failed to send reset code.");
      }

      setSuccess(true);
      toast.success("Reset code sent!", {
        description: "Please check your email for the password reset code.",
      });

      // Redirect to reset code verification page after a brief delay
      setTimeout(() => {
        router.push(
          `/auth/verify-reset-code?email=${encodeURIComponent(data.email)}`,
        );
      }, 2000);
    } catch (err: any) {
      let errorMessage = "Failed to send reset code. Please try again.";

      if (err && typeof err === "object") {
        if (err.message) {
          errorMessage = err.message;
        }
      }

      setError(errorMessage);
      // Don't show toast for network errors as they're already shown in the form
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

  if (success) {
    return (
      <div className={cn("flex flex-col gap-4 sm:gap-6", className)} {...props}>
        <Card>
          <CardHeader className="space-y-1 text-center sm:space-y-1.5">
            <div className="mx-auto mb-2 flex size-10 items-center justify-center rounded-full bg-green-100 sm:mb-4 sm:size-12">
              <Mail className="size-5 text-green-600 sm:size-6" />
            </div>
            <CardTitle className="text-lg sm:text-xl">Check your email</CardTitle>
            <CardDescription className="text-sm sm:text-base">
              We sent a password reset code to
              <br />
              <span className="font-medium text-foreground">{email}</span>
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 p-4 sm:p-6">
            <div className="text-center text-sm text-muted-foreground">
              <p>Didn&apos;t receive the code?</p>
              <Button
                variant="link"
                onClick={() => {
                  setSuccess(false);
                  setError(null);
                }}
                className="h-auto p-0 font-normal"
              >
                Try a different email address
              </Button>
            </div>
            <div className="text-center">
              <Link
                href="/auth/login"
                className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
              >
                <ArrowLeft className="size-4" />
                <span className="px-1 py-2">Back to login</span>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col gap-4 sm:gap-6", className)} {...props}>
      <Card>
        <CardHeader className="space-y-1 sm:space-y-1.5">
          <CardTitle className="text-lg sm:text-xl">Reset your password</CardTitle>
          <CardDescription className="text-sm sm:text-base">
            Enter your email address and we&apos;ll send you a code to reset
            your password
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4 sm:p-6">
          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="size-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-4 sm:gap-6">
              <div className="grid gap-2 sm:gap-3">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  {...register("email")}
                  className={errors.email ? "border-destructive" : ""}
                  disabled={isLoading}
                  required
                  autoComplete="email"
                />
                {errors.email && (
                  <p className="text-sm text-destructive">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                className="h-10 w-full sm:h-11"
                disabled={isLoading || isSubmitting}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 size-4 animate-spin" />
                    Sending code...
                  </>
                ) : (
                  "Send reset code"
                )}
              </Button>
            </div>

            <div className="mt-4 text-center text-sm">
              Remember your password?{" "}
              <Link href="/auth/login" className="px-1 py-2 underline underline-offset-4">
                Sign in
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
