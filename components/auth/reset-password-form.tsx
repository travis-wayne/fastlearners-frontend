"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  AlertCircle,
  CheckCircle2,
  Eye,
  EyeOff,
  KeyRound,
  Loader2,
  X,
} from "lucide-react";
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

const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/\d/, "Password must contain at least one number")
      .regex(
        /[^A-Za-z0-9]/,
        "Password must contain at least one special character",
      ),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

interface ResetPasswordFormProps extends React.ComponentProps<"div"> {
  email?: string;
  token?: string;
}

export function ResetPasswordForm({
  className,
  email,
  token,
  ...props
}: ResetPasswordFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const password = watch("password") || "";

  const passwordRequirements = [
    { text: "At least 8 characters", met: password.length >= 8 },
    { text: "One uppercase letter", met: /[A-Z]/.test(password) },
    { text: "One lowercase letter", met: /[a-z]/.test(password) },
    { text: "One number", met: /\d/.test(password) },
    { text: "One special character", met: /[^A-Za-z0-9]/.test(password) },
  ];

  const onSubmit = async (data: ResetPasswordFormData) => {
    if (!email) {
      setError("Email is required. Please go back and try again.");
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      // Get email and token from props or session storage
      const emailToUse =
        email ||
        (typeof window !== "undefined"
          ? sessionStorage.getItem("reset_email")
          : "") ||
        "";
      const tokenToUse =
        token ||
        (typeof window !== "undefined"
          ? sessionStorage.getItem("reset_token")
          : "") ||
        "";

      if (!emailToUse) {
        throw new Error(
          "Email is missing. Please start the reset process again.",
        );
      }

      const response = await authApi.resetPassword({
        email: emailToUse,
        password: data.password,
        password_confirmation: data.confirmPassword,
      });

      if (response.success) {
        // Clear session storage
        if (typeof window !== "undefined") {
          sessionStorage.removeItem("reset_email");
          sessionStorage.removeItem("reset_token");
        }

        toast.success("Password reset successful!", {
          description: "You can now sign in with your new password.",
        });

        // Redirect to login page
        router.push("/auth/login?reset=success");
      } else {
        throw new Error(response.message || "Failed to reset password.");
      }
    } catch (err: any) {
      const errorMessage =
        err?.message || "Failed to reset password. Please try again.";
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

  return (
    <div className={cn("flex flex-col gap-4 sm:gap-6", className)} {...props}>
      <Card>
        <CardHeader className="space-y-1 text-center sm:space-y-1.5">
          <div className="mx-auto mb-2 flex size-10 items-center justify-center rounded-full bg-green-100 sm:mb-4 sm:size-12">
            <KeyRound className="size-5 text-green-600 sm:size-6" />
          </div>
          <CardTitle className="text-lg sm:text-xl">Set new password</CardTitle>
          <CardDescription className="text-sm sm:text-base">
            Create a strong password for your account
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
                <Label htmlFor="password">New password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a strong password"
                    {...register("password")}
                    className={
                      errors.password ? "border-destructive pr-10" : "pr-10"
                    }
                    disabled={isLoading}
                    required
                    autoComplete="new-password"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full w-10 px-3 py-2 hover:bg-transparent sm:w-11"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isLoading}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      <EyeOff className="size-4 text-muted-foreground" />
                    ) : (
                      <Eye className="size-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>

                {/* Password Requirements */}
                {password && (
                  <div className="space-y-1.5 text-xs sm:space-y-2 sm:text-sm">
                    {passwordRequirements.map((req, index) => (
                      <div key={index} className="flex items-center gap-2">
                        {req.met ? (
                          <CheckCircle2 className="size-3.5 text-green-500 sm:size-4" />
                        ) : (
                          <X className="size-3.5 text-muted-foreground sm:size-4" />
                        )}
                        <span
                          className={
                            req.met ? "text-green-700" : "text-muted-foreground"
                          }
                        >
                          {req.text}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {errors.password && (
                  <p className="text-sm text-destructive">
                    {errors.password.message}
                  </p>
                )}
              </div>

              <div className="grid gap-2 sm:gap-3">
                <Label htmlFor="confirmPassword">Confirm new password</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm your password"
                    {...register("confirmPassword")}
                    className={
                      errors.confirmPassword
                        ? "border-destructive pr-10"
                        : "pr-10"
                    }
                    disabled={isLoading}
                    required
                    autoComplete="new-password"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full w-10 px-3 py-2 hover:bg-transparent sm:w-11"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    disabled={isLoading}
                    aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="size-4 text-muted-foreground" />
                    ) : (
                      <Eye className="size-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-sm text-destructive">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                className="h-10 w-full sm:h-11"
                disabled={
                  isLoading ||
                  isSubmitting ||
                  passwordRequirements.some((req) => !req.met)
                }
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 size-4 animate-spin" />
                    Resetting password...
                  </>
                ) : (
                  "Reset password"
                )}
              </Button>
            </div>

            <div className="mt-4 text-center text-sm">
              <Link
                href="/auth/login"
                className="px-1 py-2 text-muted-foreground hover:text-foreground"
              >
                Back to sign in
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
