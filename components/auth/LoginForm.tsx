"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getRoleBasedRoute, useAuthStore } from "@/store/authStore";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, Eye, EyeOff, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { cn } from "@/lib/utils";
import { loginSchema } from "@/lib/validations/auth";
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

type LoginFormData = z.infer<typeof loginSchema>;

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const { login, isLoading, error, clearError, hydrate, isHydrated } =
    useAuthStore();

  // Ensure auth store is properly hydrated on mount
  useEffect(() => {
    if (!isHydrated) {
      hydrate();
    }
  }, [hydrate, isHydrated]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError: setFieldError,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      await login(data);

      // Show success message
      toast.success("Welcome back!", {
        description: "You have successfully logged in.",
      });

      // Get user and redirect based on role using the helper function
      const user = useAuthStore.getState().user;
      const redirectPath = getRoleBasedRoute(user);

      console.log("Login successful! Redirecting user:", {
        user: user,
        primaryRole: user?.role[0],
        allRoles: user?.role,
        redirectPath: redirectPath,
        isAuthenticated: useAuthStore.getState().isAuthenticated,
        isLoading: useAuthStore.getState().isLoading,
        authStoreState: {
          user: useAuthStore.getState().user,
          isAuthenticated: useAuthStore.getState().isAuthenticated,
          isLoading: useAuthStore.getState().isLoading,
          error: useAuthStore.getState().error,
        },
      });

      // Check if the auth data is in localStorage
      const storedAuth = localStorage.getItem("auth-storage");
      console.log(
        "Stored auth data:",
        storedAuth ? JSON.parse(storedAuth) : "No stored auth data",
      );

      // Add a small delay to ensure the success message is visible before redirect
      setTimeout(() => {
        console.log("About to redirect to:", redirectPath);
        router.push(redirectPath);
      }, 1000);
    } catch (err: any) {
      // Error handling is done in the auth store
      // Just show the error message if available
      const currentError = useAuthStore.getState().error;
      if (currentError) {
        toast.error(currentError);
      }
    }
  };

  const handleGoogleLogin = () => {
    try {
      // Show loading state briefly using the auth store
      useAuthStore.getState().setLoading(true);

      toast.info("Redirecting to Google...", {
        description: "You will be redirected back after authentication.",
      });

      // Construct Google OAuth URL with our frontend callback
      const googleOAuthUrl =
        "https://accounts.google.com/o/oauth2/auth?" +
        new URLSearchParams({
          client_id:
            "721571159309-mta5k0ge8ghrl4u5oenvuc54p6u77e67.apps.googleusercontent.com",
          redirect_uri: `${window.location.origin}/auth/google/callback`,
          scope: "openid profile email",
          response_type: "code",
        }).toString();

      // Small delay to show the loading state, then redirect
      setTimeout(() => {
        window.location.href = googleOAuthUrl;
      }, 500);
    } catch (err: any) {
      console.error("Google login error:", err);
      toast.error(
        "Unable to redirect to Google login. Please try again later.",
      );
      useAuthStore.getState().setLoading(false);
    }
  };

  return (
    <form
      className={cn("flex flex-col gap-6", className)}
      {...props}
      onSubmit={handleSubmit(onSubmit)}
    >
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Welcome back</CardTitle>
          <CardDescription>Login with your Google account</CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-2">
              <AlertCircle className="size-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="grid gap-6">
            <div className="grid gap-3">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                {...register("email_phone")}
                className={errors.email_phone ? "border-destructive" : ""}
                disabled={isLoading && isHydrated}
                required
              />
              {errors.email_phone && (
                <p className="text-sm text-destructive">
                  {errors.email_phone.message}
                </p>
              )}
            </div>

            <div className="grid gap-3">
              <div className="flex items-center">
                <Label htmlFor="password">Password</Label>
                <Link
                  href="/auth/forgot-password"
                  className="ml-auto text-sm underline-offset-4 hover:underline"
                >
                  Forgot your password?
                </Link>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  {...register("password")}
                  className={
                    errors.password ? "border-destructive pr-10" : "pr-10"
                  }
                  disabled={isLoading && isHydrated}
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoading && isHydrated}
                >
                  {showPassword ? (
                    <EyeOff className="size-4 text-muted-foreground" />
                  ) : (
                    <Eye className="size-4 text-muted-foreground" />
                  )}
                </Button>
              </div>
              {errors.password && (
                <p className="text-sm text-destructive">
                  {errors.password.message}
                </p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={(isLoading && isHydrated) || isSubmitting}
            >
              {(isLoading && isHydrated) || isSubmitting ? (
                <>
                  <Loader2 className="mr-2 size-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                "Login"
              )}
            </Button>

            <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
              <span className="relative z-10 bg-background px-2 text-muted-foreground">
                Or continue with
              </span>
            </div>

            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={handleGoogleLogin}
              disabled={isLoading && isHydrated}
            >
              <svg className="mr-2 size-4" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Login with Google
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
        By clicking continue, you agree to our <Link href="#">Terms of Service</Link> and <Link href="#">Privacy Policy</Link>.
      </div> */}

      <div className="text-center text-sm">
        Don&apos;t have an account?{" "}
        <Link href="/auth/register" className="underline underline-offset-4">
          Sign up
        </Link>
      </div>
    </form>
  );
}
