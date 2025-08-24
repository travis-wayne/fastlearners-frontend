"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/authStore";
import { usePermissionCheck } from "@/hooks/useRBACGuard";
import { getUserFromCookies, getAuthCookies } from "@/lib/auth-cookies";

export function AuthDebug() {
  const { user, isAuthenticated, isLoading, isHydrated, error, hasRole, isPrimaryRole } = useAuthStore();
  const { hasPermission, userRole, permissions } = usePermissionCheck();
  const [cookieData, setCookieData] = useState<any>(null);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    // Get cookie data
    const cookieUser = getUserFromCookies();
    const authCookies = getAuthCookies();
    setCookieData({ cookieUser, authCookies });

    console.log("🔍 [AUTH DEBUG] Complete Auth State Analysis:");
    console.log("📊 Auth Store State:", {
      user: user ? {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        primaryRole: user.role?.[0]
      } : null,
      isAuthenticated,
      isLoading,
      isHydrated,
      error,
    });

    console.log("🍪 Cookie Data:", {
      cookieUser,
      authCookies
    });

    console.log("🛡️ RBAC Permission Check:", {
      userRole,
      permissions,
      hasManageLessons: hasPermission('manage_lessons'),
      hasViewAdmin: hasPermission('view_admin_panel'),
      hasCreateUser: hasPermission('create_user')
    });

    if (user) {
      console.log("🎯 Role Analysis for", user.email + ":");
      console.log("   - All Roles:", user.role);
      console.log("   - Primary Role:", user.role[0]);
      console.log("   - Has Admin Role:", hasRole('admin'));
      console.log("   - Has SuperAdmin Role:", hasRole('superadmin'));
      console.log("   - Has Teacher Role:", hasRole('teacher'));
      console.log("   - Is Primary Admin:", isPrimaryRole('admin'));
      console.log("   - Is Primary SuperAdmin:", isPrimaryRole('superadmin'));
    }

    // Check localStorage directly (fallback)
    const authData = localStorage.getItem("auth-storage");
    if (authData) {
      try {
        const parsed = JSON.parse(authData);
        console.log("💾 Parsed localStorage data:", parsed);
      } catch (e) {
        console.error("❌ Error parsing localStorage data:", e);
      }
    }

    console.log("=== END AUTH DEBUG ===");
  }, [user, isAuthenticated, isLoading, isHydrated, error, hasRole, isPrimaryRole, hasPermission, userRole, permissions]);

  return (
    <div
      style={{
        position: "fixed",
        top: "10px",
        right: "10px",
        background: "rgba(0,0,0,0.9)",
        color: "white",
        padding: "12px",
        fontSize: "11px",
        borderRadius: "6px",
        zIndex: 9999,
        maxWidth: expanded ? "500px" : "300px",
        maxHeight: expanded ? "600px" : "auto",
        overflow: "auto",
        fontFamily: "monospace",
        border: "1px solid #333"
      }}
    >
      <div style={{ marginBottom: "8px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <strong>🔍 Auth Debug Panel</strong>
        <button 
          onClick={() => setExpanded(!expanded)}
          style={{ background: "#333", color: "white", border: "none", padding: "2px 6px", borderRadius: "3px", cursor: "pointer" }}
        >
          {expanded ? "➖" : "➕"}
        </button>
      </div>
      
      <div><strong>Basic Status:</strong></div>
      <div>✅ Authenticated: {isAuthenticated ? "Yes" : "No"}</div>
      <div>🔄 Hydrated: {isHydrated ? "Yes" : "No"}</div>
      <div>⏳ Loading: {isLoading ? "Yes" : "No"}</div>
      
      {user && (
        <>
          <div style={{ marginTop: "8px" }}><strong>User Info:</strong></div>
          <div>📧 Email: {user.email}</div>
          <div>👤 Name: {user.name || 'N/A'}</div>
          <div>🎯 Primary Role: <span style={{color: '#4ade80'}}>{user.role?.[0] || 'None'}</span></div>
          <div>🏷️ All Roles: {user.role ? JSON.stringify(user.role) : 'None'}</div>
          
          <div style={{ marginTop: "8px" }}><strong>RBAC Status:</strong></div>
          <div>🛡️ Current Role: <span style={{color: '#fbbf24'}}>{userRole || 'Unknown'}</span></div>
          <div>📋 Can Manage Lessons: {hasPermission('manage_lessons') ? '✅' : '❌'}</div>
          <div>⚙️ Can View Admin: {hasPermission('view_admin_panel') ? '✅' : '❌'}</div>
        </>
      )}
      
      {!user && (
        <div style={{ color: '#f87171', marginTop: "8px" }}>❌ No user data available</div>
      )}
      
      {error && (
        <div style={{ color: '#f87171', marginTop: "8px" }}>
          <strong>Error:</strong> {error}
        </div>
      )}
      
      {expanded && (
        <>
          <div style={{ marginTop: "12px", borderTop: "1px solid #333", paddingTop: "8px" }}>
            <strong>Detailed Debug Info:</strong>
          </div>
          
          {user && (
            <>
              <div style={{ marginTop: "8px" }}><strong>Role Checks:</strong></div>
              <div>🔹 hasRole(&apos;admin&apos;): {hasRole('admin') ? '✅' : '❌'}</div>
              <div>🔹 hasRole(&apos;superadmin&apos;): {hasRole('superadmin') ? '✅' : '❌'}</div>
              <div>🔹 hasRole(&apos;teacher&apos;): {hasRole('teacher') ? '✅' : '❌'}</div>
              <div>🔹 isPrimaryRole(&apos;admin&apos;): {isPrimaryRole('admin') ? '✅' : '❌'}</div>
              <div>🔹 isPrimaryRole(&apos;superadmin&apos;): {isPrimaryRole('superadmin') ? '✅' : '❌'}</div>
            </>
          )}
          
          <div style={{ marginTop: "8px" }}><strong>Raw Data:</strong></div>
          <div style={{ 
            background: "rgba(255,255,255,0.1)", 
            padding: "4px", 
            borderRadius: "3px", 
            fontSize: "10px", 
            marginTop: "4px",
            wordBreak: "break-all"
          }}>
            {JSON.stringify({ user, cookieData, permissions }, null, 1)}
          </div>
        </>
      )}
    </div>
  );
}
