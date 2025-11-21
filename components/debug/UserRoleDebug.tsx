"use client";

import { useState } from "react";
import { useAuthStore } from "@/store/authStore";
import { Eye, EyeOff, RefreshCw } from "lucide-react";

import { Z_INDEX } from "@/config/z-index";
import { profileApi } from "@/lib/api/auth";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export function UserRoleDebug() {
  const { user, isAuthenticated } = useAuthStore();
  const [profileData, setProfileData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [showDebug, setShowDebug] = useState(false);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const response = await profileApi.getProfile();
      setProfileData(response);
      console.log("🔍 Profile API Response:", response);
    } catch (error) {
      console.error("❌ Profile fetch error:", error);
      setProfileData({ error: error });
    } finally {
      setLoading(false);
    }
  };

  if (!showDebug) {
    return (
      <Button
        variant="outline"
        size="sm"
        onClick={() => setShowDebug(true)}
        className="fixed bottom-4 right-4"
        style={{ zIndex: Z_INDEX.debugTools }}
      >
        <Eye className="mr-2 size-4" />
        Show Debug
      </Button>
    );
  }

  return (
    <Card
      className="fixed bottom-4 right-4 max-h-96 w-96 overflow-auto"
      style={{ zIndex: Z_INDEX.debugTools }}
    >
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm">User Role Debug</CardTitle>
          <Button variant="ghost" size="sm" onClick={() => setShowDebug(false)}>
            <EyeOff className="size-4" />
          </Button>
        </div>
        <CardDescription>Current user authentication state</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Current Auth State */}
        <div>
          <h4 className="mb-2 text-sm font-medium">Auth Store State:</h4>
          <div className="space-y-1 text-xs">
            <div>
              Authenticated:{" "}
              <Badge variant={isAuthenticated ? "default" : "destructive"}>
                {isAuthenticated ? "Yes" : "No"}
              </Badge>
            </div>
            {user && (
              <>
                <div>ID: {user.id}</div>
                <div>Name: {user.name || "No name"}</div>
                <div>Email: {user.email}</div>
                <div>
                  Roles:{" "}
                  {user.role.map((role) => (
                    <Badge key={role} variant="outline" className="ml-1">
                      {role}
                    </Badge>
                  ))}
                </div>
                <div>
                  Primary Role:{" "}
                  <Badge variant="secondary">{user.role[0]}</Badge>
                </div>
              </>
            )}
          </div>
        </div>

        <Separator />

        {/* Fetch Current Profile */}
        <div>
          <div className="mb-2 flex items-center justify-between">
            <h4 className="text-sm font-medium">API Profile Data:</h4>
            <Button
              variant="outline"
              size="sm"
              onClick={fetchProfile}
              disabled={loading}
            >
              <RefreshCw
                className={`mr-1 size-3 ${loading ? "animate-spin" : ""}`}
              />
              Fetch
            </Button>
          </div>
          {profileData && (
            <div className="rounded bg-muted p-2 text-xs">
              <pre className="whitespace-pre-wrap">
                {JSON.stringify(profileData, null, 2)}
              </pre>
            </div>
          )}
        </div>

        <Separator />

        {/* Cookie Information (note: HttpOnly cookies won't appear in document.cookie) */}
        <div>
          <h4 className="mb-2 text-sm font-medium">Cookie Data:</h4>
          <div className="space-y-1 text-xs">
            <div>
              Token:{" "}
              {document.cookie.includes("auth_token") ? "Present" : "Missing"}
            </div>
            <div>
              Expires:{" "}
              {document.cookie.includes("auth_expires") ? "Present" : "Missing"}
            </div>
          </div>
        </div>

        {/* Local Storage */}
        <div>
          <h4 className="mb-2 text-sm font-medium">Local Storage:</h4>
          <div className="text-xs">
            <div>
              Access Token:{" "}
              {localStorage.getItem("access_token") ? "Present" : "Missing"}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
