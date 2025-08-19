"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { toast } from "sonner";

export function GoogleAuthChecker() {
  const router = useRouter();
  const { loginWithGoogle } = useAuthStore();

  useEffect(() => {
    const checkGoogleAuth = async () => {
      try {
        // Check if we have pending Google authentication data
        const authData = localStorage.getItem("google_auth_data");
        const authError = localStorage.getItem("google_auth_error");

        if (authError) {
          localStorage.removeItem("google_auth_error");
          toast.error("Google login failed", {
            description: authError,
          });
          return;
        }

        if (authData) {
          const data = JSON.parse(authData);

          if (data.success && data.content) {
            // Clear the temporary data
            localStorage.removeItem("google_auth_data");

            // Use the auth store to handle Google login
            await loginWithGoogle(data.content);

            toast.success("Welcome back!", {
              description: "You have successfully logged in with Google.",
            });

            // Redirect to dashboard
            router.push("/dashboard");
          }
        }
      } catch (error: any) {
        console.error("Google auth check error:", error);
        localStorage.removeItem("google_auth_data");
        localStorage.removeItem("google_auth_error");
      }
    };

    // Check immediately and also after a short delay
    checkGoogleAuth();
    const timeoutId = setTimeout(checkGoogleAuth, 500);

    return () => clearTimeout(timeoutId);
  }, [router, loginWithGoogle]);

  return null; // This component doesn't render anything
}
