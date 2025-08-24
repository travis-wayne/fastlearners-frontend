"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useAuthStore } from "@/store/authStore";
import { RBACUtils } from "@/lib/rbac/role-config";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  ShieldX, 
  Home, 
  ArrowLeft, 
  AlertTriangle,
  Lock
} from "lucide-react";

export function UnauthorizedPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuthStore();
  const [attemptedRoute, setAttemptedRoute] = useState<string>("");

  useEffect(() => {
    // Get the attempted route from URL params or headers
    const route = searchParams.get("route") || searchParams.get("callbackUrl") || "";
    setAttemptedRoute(route);
  }, [searchParams]);

  const userRole = user?.role[0];
  const homeRoute = userRole ? RBACUtils.getHomeRoute(userRole) : "/auth/login";

  const handleGoHome = () => {
    router.push(homeRoute);
  };

  const handleGoBack = () => {
    router.back();
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md mx-4">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 size-12 rounded-full bg-destructive/10 flex items-center justify-center">
              <Lock className="size-6 text-destructive" />
            </div>
            <CardTitle>Authentication Required</CardTitle>
            <CardDescription>
              You need to be logged in to access this resource
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <Link href="/auth/login">
              <Button className="w-full">
                Sign In
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <Card className="w-full max-w-2xl mx-4">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 size-16 rounded-full bg-destructive/10 flex items-center justify-center">
            <ShieldX className="size-8 text-destructive" />
          </div>
          <CardTitle className="text-2xl">Access Denied</CardTitle>
          <CardDescription className="text-base">
            You don&apos;t have permission to access this resource
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* User Info */}
          <div className="bg-muted p-4 rounded-lg">
            <h4 className="font-medium mb-2">Your Account Details:</h4>
            <div className="space-y-1 text-sm">
              <div>Name: {user.name || "No name set"}</div>
              <div>Email: {user.email}</div>
              <div className="flex items-center gap-2">
                Role: <Badge variant="secondary">{userRole}</Badge>
              </div>
            </div>
          </div>

          {/* Attempted Route Info */}
          {attemptedRoute && (
            <Alert>
              <AlertTriangle className="size-4" />
              <AlertDescription>
              <strong>Attempted to access:</strong> <code className="bg-muted rounded px-1">{attemptedRoute}</code>
              </AlertDescription>
            </Alert>
          )}

          {/* Role-based Messaging */}
          <div className="space-y-3">
            <h4 className="font-medium">Why am I seeing this?</h4>
            <div className="text-sm text-muted-foreground space-y-2">
              {userRole === 'guest' && (
                <p>
                  As a <Badge variant="outline">Guest</Badge>, you need to complete onboarding 
                  and choose either Student or Guardian role to access most features.
                </p>
              )}
              {userRole === 'student' && (
                <p>
                  As a <Badge variant="outline">Student</Badge>, you can access lessons, 
                  exercises, and your progress dashboard, but not administrative features.
                </p>
              )}
              {userRole === 'guardian' && (
                <p>
                  As a <Badge variant="outline">Guardian</Badge>, you can view children&apos;s 
                  progress and manage family settings, but cannot access teaching or admin tools.
                </p>
              )}
              {userRole === 'teacher' && (
                <p>
                  As a <Badge variant="outline">Teacher</Badge>, you can create and manage 
                  lessons but cannot access user management or system settings.
                </p>
              )}
              {userRole === 'admin' && (
                <p>
                  As an <Badge variant="outline">Admin</Badge>, you have broad access 
                  but cannot modify system-level configurations or assign roles.
                </p>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-3 pt-4 sm:flex-row">
            <Button onClick={handleGoHome} className="flex-1">
              <Home className="mr-2 size-4" />
              Go to My Dashboard
            </Button>
            
            <Button variant="outline" onClick={handleGoBack} className="flex-1">
              <ArrowLeft className="mr-2 size-4" />
              Go Back
            </Button>
          </div>

          {/* Help Section */}
          <div className="border-t pt-4">
            <h5 className="mb-2 font-medium">Need help?</h5>
            <div className="space-y-1 text-sm text-muted-foreground">
              <p>• Contact your administrator if you think you should have access</p>
              <p>• Check if you&apos;re using the correct account</p>
              <p>• Guest users need to complete onboarding first</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
