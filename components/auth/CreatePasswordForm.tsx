"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { AlertCircle, CheckCircle2, Eye, EyeOff, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function CreatePasswordForm() {
  const router = useRouter();
  const { setUser } = useAuthStore();

  // Form state
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Loading and error states
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Password validation
  const passwordRequirements = [
    { text: "At least 8 characters", met: password.length >= 8 },
    { text: "One uppercase letter", met: /[A-Z]/.test(password) },
    { text: "One lowercase letter", met: /[a-z]/.test(password) },
    { text: "One number", met: /\d/.test(password) },
    { text: "One special character", met: /[^A-Za-z0-9]/.test(password) },
  ];

  const isPasswordValid = passwordRequirements.every((req) => req.met);
  const doPasswordsMatch = password === confirmPassword && password.length > 0;
  const canSubmit = isPasswordValid && doPasswordsMatch && !isLoading;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!canSubmit) {
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const r = await fetch("/api/auth/create-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          password,
          password_confirmation: confirmPassword,
        }),
      });
      const response = await r.json();

      if (r.ok && response?.success) {
        setSuccess(true);
        toast.success("Password created!", {
          description: "Continue by selecting your role",
        });

        setTimeout(() => {
          router.push("/auth/set-role");
        }, 200);
      } else {
        setError(
          response?.message || "Failed to create password. Please try again.",
        );
      }
    } catch (err: any) {
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleManualRedirect = () => {
    window.location.href = "/auth/set-role";
  };

  if (success) {
    return (
      <div className="flex flex-col gap-6">
        <div className="flex flex-col items-center gap-4 text-center">
          <CheckCircle2 className="size-16 text-green-500" />
          <div>
            <h1 className="text-2xl font-bold text-green-800">
              Password Created!
            </h1>
            <p className="mt-2 text-sm text-green-600">
              Your account has been successfully set up.
            </p>
          </div>
        </div>

        <div className="space-y-3">
          <Button onClick={handleManualRedirect} className="w-full" size="lg">
            Continue to Role Selection
          </Button>

          <p className="text-center text-sm text-muted-foreground">
            You will be automatically redirected in a few seconds...
          </p>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
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

      <div className="space-y-4">
        {/* Password Input */}
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Create a strong password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
              required
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <EyeOff className="size-4" />
              ) : (
                <Eye className="size-4" />
              )}
            </Button>
          </div>
        </div>

        {/* Password Requirements */}
        {password && (
          <div className="space-y-2 text-sm">
            <p className="font-medium">Password requirements:</p>
            {passwordRequirements.map((req, index) => (
              <div key={index} className="flex items-center gap-2">
                <CheckCircle2
                  className={
                    req.met ? "size-4 text-green-500" : "size-4 text-gray-300"
                  }
                />
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

        {/* Confirm Password Input */}
        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Confirm password</Label>
          <div className="relative">
            <Input
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={isLoading}
              required
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? (
                <EyeOff className="size-4" />
              ) : (
                <Eye className="size-4" />
              )}
            </Button>
          </div>

          {confirmPassword && !doPasswordsMatch && (
            <p className="text-sm text-red-500">Passwords do not match</p>
          )}

          {confirmPassword && doPasswordsMatch && (
            <p className="text-sm text-green-600">Passwords match ✓</p>
          )}
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={!canSubmit}
          className="w-full"
          size="lg"
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
          <a href="/terms" className="text-primary hover:underline">
            Terms of Service
          </a>{" "}
          and{" "}
          <a href="/privacy" className="text-primary hover:underline">
            Privacy Policy
          </a>
        </p>
      </div>
    </form>
  );
}
