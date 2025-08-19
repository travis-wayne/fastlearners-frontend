"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  AlertCircle,
  CheckCircle2,
  Eye,
  EyeOff,
  Loader2,
  X,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { authApi } from "@/lib/api/auth";
import { cn } from "@/lib/utils";
import { createPasswordSchema } from "@/lib/validations/auth";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type PasswordFormData = z.infer<typeof createPasswordSchema>;

interface CreatePasswordFormProps extends React.ComponentProps<"form"> {
  email?: string;
  token?: string;
}

export function CreatePasswordForm({
  className,
  email,
  token,
  ...props
}: CreatePasswordFormProps) {
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
  } = useForm<PasswordFormData>({
    resolver: zodResolver(createPasswordSchema),
  });

  const password = watch("password") || "";

  const passwordRequirements = [
    { text: "At least 8 characters", met: password.length >= 8 },
    { text: "One uppercase letter", met: /[A-Z]/.test(password) },
    { text: "One lowercase letter", met: /[a-z]/.test(password) },
    { text: "One number", met: /\d/.test(password) },
    { text: "One special character", met: /[^A-Za-z0-9]/.test(password) },
  ];

  const onSubmit = async (data: PasswordFormData) => {
    try {
      setIsLoading(true);
      setError(null);

      // Get email and token from props or URL params
      if (!email || !token) {
        throw new Error(
          "Missing email or token. Please try the registration process again.",
        );
      }

      const response = await authApi.createPassword({
        email: email,
        password: data.password,
        password_confirmation: data.password_confirmation,
        token: token,
      });

      if (response.success) {
        toast.success("Password created!", {
          description: "Your account has been successfully set up.",
        });

        // Navigate to login page
        router.push("/auth/login");
      } else {
        setError(
          response.message || "Failed to create password. Please try again.",
        );
      }
    } catch (err: any) {
      let errorMessage = "Failed to create password. Please try again.";

      if (err && typeof err === "object") {
        if (err.message) {
          errorMessage = err.message;
        } else if (err.errors && typeof err.errors === "object") {
          // Handle field-specific validation errors
          const validationErrors = Object.values(err.errors).flat();
          errorMessage = validationErrors.join(", ");
        }
      }

      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form
      className={cn("flex flex-col gap-6", className)}
      {...props}
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Create your password</h1>
        <p className="text-balance text-sm text-muted-foreground">
          Choose a strong password to secure your account
        </p>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="size-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid gap-6">
        <div className="grid gap-3">
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Create a strong password"
              {...register("password")}
              className={errors.password ? "border-destructive pr-10" : "pr-10"}
              disabled={isLoading}
              required
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
              onClick={() => setShowPassword(!showPassword)}
              disabled={isLoading}
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
            <div className="space-y-2 text-sm">
              {passwordRequirements.map((req, index) => (
                <div key={index} className="flex items-center gap-2">
                  {req.met ? (
                    <CheckCircle2 className="size-4 text-green-500" />
                  ) : (
                    <X className="size-4 text-muted-foreground" />
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

        <div className="grid gap-3">
          <Label htmlFor="confirmPassword">Confirm password</Label>
          <div className="relative">
            <Input
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm your password"
              {...register("password_confirmation")}
              className={
                errors.password_confirmation
                  ? "border-destructive pr-10"
                  : "pr-10"
              }
              disabled={isLoading}
              required
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              disabled={isLoading}
            >
              {showConfirmPassword ? (
                <EyeOff className="size-4 text-muted-foreground" />
              ) : (
                <Eye className="size-4 text-muted-foreground" />
              )}
            </Button>
          </div>
          {errors.password_confirmation && (
            <p className="text-sm text-destructive">
              {errors.password_confirmation.message}
            </p>
          )}
        </div>

        <Button
          type="submit"
          className="w-full"
          disabled={
            isLoading ||
            isSubmitting ||
            passwordRequirements.some((req) => !req.met)
          }
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 size-4 animate-spin" />
              Creating password...
            </>
          ) : (
            "Create password"
          )}
        </Button>
      </div>

      <div className="text-center text-sm">
        <p className="text-muted-foreground">
          By creating a password, you agree to our{" "}
          <a
            href="/terms"
            className="text-primary underline-offset-4 hover:underline"
          >
            Terms of Service
          </a>{" "}
          and{" "}
          <a
            href="/privacy"
            className="text-primary underline-offset-4 hover:underline"
          >
            Privacy Policy
          </a>
        </p>
      </div>
    </form>
  );
}
