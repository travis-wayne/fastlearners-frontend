import { create } from "zustand";

import { authApi } from "@/lib/api/auth";
import {
  LoginCredentials,
  ProfileStatus,
  User,
  UserRole,
} from "@/lib/types/auth";

interface AuthState {
  // State
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  isHydrated: boolean; // Track if store has been rehydrated from localStorage

  // Actions
  setUser: (user: User) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  hydrate: () => void;
  login: (credentials: LoginCredentials) => Promise<void>;
  loginWithGoogle: (data: {
    user: User;
    access_token: string;
  }) => Promise<void>;
  logout: () => Promise<void>;
  updateUserProfile: (updates: Partial<User>) => void;
  clearError: () => void;

  // Profile completion helpers
  getProfileStatus: () => ProfileStatus;
  isProfileComplete: () => boolean;
  canAccessFeature: (feature: string) => boolean;

  // Role-based helpers
  hasRole: (role: UserRole) => boolean;
  isPrimaryRole: (role: UserRole) => boolean;
  isGuest: () => boolean;
  canChangeRole: () => boolean;
}

export const useAuthStore = create<AuthState>()((set, get) => ({
  // Initial state - start with null/false on both server and client
  user: null,
  isAuthenticated: false,
  isLoading: false, // Start with loading false to prevent premature loading state
  error: null,
  isHydrated: false, // Set to false initially

  // Actions
  setUser: (user: User) => {
    set({ user, isAuthenticated: true, error: null });
  },

  setLoading: (loading: boolean) => set({ isLoading: loading }),

  setError: (error: string | null) => set({ error }),

  hydrate: () => {
    if (typeof window !== "undefined") {
      // Always fetch session from server (HttpOnly cookies)
      fetch("/api/auth/session")
        .then(async (r) => {
          if (!r.ok) throw new Error("No session");
          const data = await r.json();
          set({
            user: data.user || null,
            isAuthenticated: Boolean(data.user),
            isLoading: false,
            isHydrated: true,
          });
        })
        .catch(() => {
          set({ user: null, isAuthenticated: false, isLoading: false, isHydrated: true });
        });
    }
  },

  login: async (credentials: LoginCredentials) => {
    try {
      set({ isLoading: true, error: null });

      // Always use server route to set HttpOnly cookies
      const r = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      });
      const data = await r.json();
      
      if (r.ok && data?.user) {
        set({ user: data.user, isAuthenticated: true, error: null });
        return;
      }
      
      // Handle error responses
      const errorMessage = data?.message || "Login failed";
      set({ error: errorMessage, isAuthenticated: false, user: null });
      
      // Throw error with redirect info if present (for unverified users)
      if (data?.redirect) {
        throw { message: errorMessage, redirect: data.redirect };
      }
      
      throw new Error(errorMessage);
    } catch (error: any) {
      let errorMessage = "An error occurred during login";

      if (error && typeof error === "object") {
        if (error.message) {
          errorMessage = error.message;
        }
        // Preserve redirect info if present
        if (error.redirect) {
          set({ error: errorMessage, isAuthenticated: false, user: null });
          throw error; // Throw the full error object with redirect
        }
      }

      set({
        error: errorMessage,
        isAuthenticated: false,
        user: null,
      });

      throw new Error(errorMessage);
    } finally {
      set({ isLoading: false });
    }
  },

  loginWithGoogle: async (data: { user: User; access_token: string }) => {
    try {
      set({ isLoading: true, error: null });

      // Cookies are already set by /api/auth/google/callback, so fetch session to hydrate store
      const r = await fetch("/api/auth/session", {
        method: "GET",
        headers: { Accept: "application/json" },
        credentials: "include",
      });
      
      if (!r.ok) {
        throw new Error("Failed to fetch session after OAuth");
      }
      
      const sessionData = await r.json();
      
      if (sessionData.success && sessionData.user) {
        set({
          user: sessionData.user,
          isAuthenticated: true,
          error: null,
        });
      } else {
        // Fallback to provided user data if session doesn't return user (shouldn't happen)
        set({
          user: data.user,
          isAuthenticated: true,
          error: null,
        });
      }
    } catch (error: any) {
      const errorMessage = error.message || "Google authentication failed";

      set({
        error: errorMessage,
        isAuthenticated: false,
        user: null,
      });

      throw new Error(errorMessage);
    } finally {
      set({ isLoading: false });
    }
  },

  logout: async () => {
    try {
      set({ isLoading: true });
      await fetch("/api/auth/logout", { method: "POST" });
    } catch (error) {
      console.error("Logout API error:", error);
    } finally {
      set({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      });
    }
  },

  updateUserProfile: (updates: Partial<User>) => {
    const currentUser = get().user;
    if (currentUser) {
      const updatedUser = { ...currentUser, ...updates };
      get().setUser(updatedUser);
    }
  },

  clearError: () => set({ error: null }),

  // Profile completion helpers
  getProfileStatus: (): ProfileStatus => {
    const user = get().user;
    if (!user) return "guest";

    const primaryRole = user.role[0];

    if (primaryRole === "guest") {
      return "guest";
    }

    const hasBasicInfo = user.name && user.email && user.date_of_birth;
    if (!hasBasicInfo) {
      return "guest";
    }

    const hasRoleSpecificData =
      primaryRole === "student"
        ? user.school || user.class
        : primaryRole === "guardian"
          ? user.phone
          : false;

    return hasRoleSpecificData ? "complete" : "role_details_complete";
  },

  isProfileComplete: (): boolean => {
    const status = get().getProfileStatus();
    return status === "complete";
  },

  canAccessFeature: (feature: string): boolean => {
    const user = get().user;
    if (!user) return false;

    const isGuest = user.role[0] === "guest";

    const restrictedFeatures = [
      "submit_assignment",
      "take_quiz",
      "save_progress",
      "make_purchase",
      "access_personalized_content",
      "participate_in_discussions",
      "access_courses",
      "access_activities",
      "access_progress",
      "premium_content",
    ];

    if (isGuest && restrictedFeatures.includes(feature)) {
      return false;
    }

    return true;
  },

  // Role-based helpers
  hasRole: (role: UserRole): boolean => {
    const user = get().user;
    return user ? user.role.includes(role) : false;
  },

  isPrimaryRole: (role: UserRole): boolean => {
    const user = get().user;
    return user ? user.role[0] === role : false;
  },

  isGuest: (): boolean => {
    return get().isPrimaryRole("guest");
  },

  canChangeRole: (): boolean => {
    const user = get().user;
    if (!user) return false;

    // Only guests can change their role (during onboarding)
    // Once a user has selected student or guardian, they cannot change
    return user.role[0] === "guest";
  },
}));

// Access control checker function
export const checkGuestAccess = (
  action: string,
  user: User | null,
): boolean => {
  if (!user || user.role[0] !== "guest") return true;

  const restrictedActions = [
    "submit_assignment",
    "take_quiz",
    "save_progress",
    "make_purchase",
    "access_personalized_content",
    "participate_in_discussions",
  ];

  return !restrictedActions.includes(action);
};

// Role-based routing helper (now uses RBAC utilities)
export const getRoleBasedRoute = (user: User | null): string => {
  if (!user) return "/auth/login";

  // Import RBAC utilities dynamically to avoid circular dependency
  const { RBACUtils } = require("@/lib/rbac/role-config");
  return RBACUtils.getHomeRoute(user.role[0]);
};

// Cookie-based auth store doesn't need manual initialization
// State is loaded directly from cookies in the initial state
