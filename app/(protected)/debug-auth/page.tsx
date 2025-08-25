"use client";

import Link from "next/link";
import { AuthDebug } from "@/components/auth/AuthDebug";
import { DashboardHeader } from "@/components/dashboard/header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuthStore } from "@/store/authStore";
import { usePermissionCheck } from "@/hooks/useRBACGuard";
import { RBACUtils } from "@/lib/rbac/role-config";
import { getUserFromCookies, getAuthCookies } from "@/lib/auth-cookies";
import { useState } from "react";

export default function AuthDebugPage() {
  const { user, isAuthenticated, hasRole, isPrimaryRole } = useAuthStore();
  const { hasPermission, userRole, permissions } = usePermissionCheck();
  const [cookieData, setCookieData] = useState<any>(null);

  const testRolePermissions = () => {
    if (!user) {
      console.log("❌ No user available for testing");
      return;
    }

    console.log("🧪 [ROLE TEST] Testing all role-related functionality:");
    console.log("📧 User Email:", user.email);
    console.log("👤 User Roles:", user.role);
    console.log("🎯 Primary Role:", user.role[0]);
    
    console.log("\n🔍 Auth Store Role Checks:");
    console.log("  hasRole('admin'):", hasRole('admin'));
    console.log("  hasRole('superadmin'):", hasRole('superadmin'));
    console.log("  hasRole('teacher'):", hasRole('teacher'));
    console.log("  isPrimaryRole('admin'):", isPrimaryRole('admin'));
    console.log("  isPrimaryRole('superadmin'):", isPrimaryRole('superadmin'));
    
    console.log("\n🛡️ RBAC Utils Direct Tests:");
    const testRole = user.role[0];
    console.log(`  RBACUtils.hasPermission(${testRole}, 'SUPERADMIN'):`, RBACUtils.hasPermission(testRole, 'SUPERADMIN'));
    console.log(`  RBACUtils.hasPermission(${testRole}, 'ADMIN'):`, RBACUtils.hasPermission(testRole, 'ADMIN'));
    console.log(`  RBACUtils.hasPermission(${testRole}, 'TEACHER'):`, RBACUtils.hasPermission(testRole, 'TEACHER'));
    console.log(`  RBACUtils.canAccessRoute(${testRole}, '/admin/lessons'):`, RBACUtils.canAccessRoute(testRole, '/admin/lessons'));
    
    console.log("\n📋 Permission Hook Results:");
    console.log("  hasPermission('manage_lessons'):", hasPermission('manage_lessons'));
    console.log("  hasPermission('manage_users'):", hasPermission('manage_users'));
    console.log("  hasPermission('system_config'):", hasPermission('system_config'));
    console.log("  hasPermission('view_admin_panel'):", hasPermission('view_admin_panel'));
    
    console.log("\n🍪 Cookie Data:");
    const cookieUser = getUserFromCookies();
    const authCookies = getAuthCookies();
    console.log("  Cookie User:", cookieUser);
    console.log("  Auth Cookies:", authCookies);
    setCookieData({ cookieUser, authCookies });
  };

  const testApiProfile = async () => {
    try {
      console.log("🌐 [API TEST] Fetching user profile from API...");
      
      const response = await fetch('/api/auth/profile', {
        headers: {
          'Authorization': `Bearer ${getAuthCookies()?.token}`,
          'Content-Type': 'application/json',
        },
      });
      
      const data = await response.json();
      console.log("📊 API Profile Response:", data);
      
      if (response.ok && data.success) {
        console.log("✅ API returned user data:");
        console.log("  Email:", data.content?.email);
        console.log("  Roles:", data.content?.role);
        console.log("  Primary Role:", data.content?.role?.[0]);
      } else {
        console.log("❌ API Error:", data.message || 'Unknown error');
      }
    } catch (error) {
      console.error("🚨 API Request failed:", error);
    }
  };

  return (
    <>
      <AuthDebug />
      
      <DashboardHeader
        heading="Authentication Debug Panel"
        text="Debug authentication state and role-based permissions"
      />

      <div className="space-y-6">
        {/* Current Auth State */}
        <Card>
          <CardHeader>
            <CardTitle>Current Authentication State</CardTitle>
            <CardDescription>
              Current user information and authentication status
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Status</div>
                  <Badge variant={isAuthenticated ? "default" : "destructive"}>
                    {isAuthenticated ? "Authenticated" : "Not Authenticated"}
                  </Badge>
                </div>
                
                {user && (
                  <>
                    <div>
                      <div className="text-sm font-medium text-muted-foreground">Email</div>
                      <div className="font-mono text-sm">{user.email}</div>
                    </div>
                    
                    <div>
                      <div className="text-sm font-medium text-muted-foreground">Primary Role</div>
                      <Badge variant="outline">{user.role[0] || 'None'}</Badge>
                    </div>
                    
                    <div>
                      <div className="text-sm font-medium text-muted-foreground">All Roles</div>
                      <div className="flex gap-1 flex-wrap">
                        {user.role.map((role, index) => (
                          <Badge key={index} variant={index === 0 ? "default" : "secondary"} className="text-xs">
                            {role}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Permission Tests */}
        <Card>
          <CardHeader>
            <CardTitle>Permission Tests</CardTitle>
            <CardDescription>
              Test various permission checks for the current user
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {user ? (
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm">Core Permissions</h4>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span>Manage Lessons:</span>
                        <Badge variant={hasPermission('manage_lessons') ? "default" : "destructive"} className="text-xs">
                          {hasPermission('manage_lessons') ? "✅" : "❌"}
                        </Badge>
                      </div>
                      <div className="flex justify-between">
                        <span>Manage Users:</span>
                        <Badge variant={hasPermission('manage_users') ? "default" : "destructive"} className="text-xs">
                          {hasPermission('manage_users') ? "✅" : "❌"}
                        </Badge>
                      </div>
                      <div className="flex justify-between">
                        <span>View Admin Panel:</span>
                        <Badge variant={hasPermission('view_admin_panel') ? "default" : "destructive"} className="text-xs">
                          {hasPermission('view_admin_panel') ? "✅" : "❌"}
                        </Badge>
                      </div>
                      <div className="flex justify-between">
                        <span>System Config:</span>
                        <Badge variant={hasPermission('system_config') ? "default" : "destructive"} className="text-xs">
                          {hasPermission('system_config') ? "✅" : "❌"}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm">Role Checks</h4>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span>Has Admin Role:</span>
                        <Badge variant={hasRole('admin') ? "default" : "destructive"} className="text-xs">
                          {hasRole('admin') ? "✅" : "❌"}
                        </Badge>
                      </div>
                      <div className="flex justify-between">
                        <span>Has SuperAdmin Role:</span>
                        <Badge variant={hasRole('superadmin') ? "default" : "destructive"} className="text-xs">
                          {hasRole('superadmin') ? "✅" : "❌"}
                        </Badge>
                      </div>
                      <div className="flex justify-between">
                        <span>Has Teacher Role:</span>
                        <Badge variant={hasRole('teacher') ? "default" : "destructive"} className="text-xs">
                          {hasRole('teacher') ? "✅" : "❌"}
                        </Badge>
                      </div>
                      <div className="flex justify-between">
                        <span>Primary is SuperAdmin:</span>
                        <Badge variant={isPrimaryRole('superadmin') ? "default" : "destructive"} className="text-xs">
                          {isPrimaryRole('superadmin') ? "✅" : "❌"}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center text-muted-foreground">
                  No user data available for permission testing
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Debug Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Debug Actions</CardTitle>
            <CardDescription>
              Run various tests to debug authentication issues
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4 flex-wrap">
              <Button onClick={testRolePermissions} variant="outline">
                🧪 Test Role Permissions
              </Button>
              
              <Button onClick={testApiProfile} variant="outline">
                🌐 Test API Profile
              </Button>
              
              {hasPermission('manage_lessons') && (
                <Link href="/superadmin/lessons/upload/csv">
                  <Button variant="outline">
                    📤 Test CSV Upload
                  </Button>
                </Link>
              )}
              
              <Button 
                onClick={() => window.location.reload()} 
                variant="outline"
              >
                🔄 Reload Page
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Raw Data Display */}
        {cookieData && (
          <Card>
            <CardHeader>
              <CardTitle>Raw Cookie Data</CardTitle>
              <CardDescription>
                Direct cookie data for debugging
              </CardDescription>
            </CardHeader>
            <CardContent>
              <pre className="bg-muted p-4 rounded-md text-xs overflow-auto">
                {JSON.stringify(cookieData, null, 2)}
              </pre>
            </CardContent>
          </Card>
        )}
      </div>
    </>
  );
}
