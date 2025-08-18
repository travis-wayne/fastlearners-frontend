import { create } from 'zustand';
import { User, AuthTokens, LoginCredentials, ProfileStatus, UserRole } from '@/lib/types/auth';
import { authApi } from '@/lib/api/auth';
import { setAuthCookies, getAuthCookies, clearAuthCookies, isAuthenticatedFromCookies, getUserFromCookies } from '@/lib/auth-cookies';

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
  login: (credentials: LoginCredentials) => Promise<void>;
  loginWithGoogle: (data: { user: User; access_token: string }) => Promise<void>;
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
}

export const useAuthStore = create<AuthState>()((set, get) => ({
  // Initial state - try to load from cookies immediately
  user: typeof window !== 'undefined' ? getUserFromCookies() : null,
  isAuthenticated: typeof window !== 'undefined' ? isAuthenticatedFromCookies() : false,
  isLoading: false,
  error: null,
  isHydrated: true, // Always hydrated with cookie approach

  // Actions
  setUser: (user: User) => {
    // Save to cookies with 7-day expiration
    const expiresAt = Date.now() + (7 * 24 * 60 * 60 * 1000);
    setAuthCookies({
      token: 'dummy-token', // You'll get this from your API
      user,
      expiresAt
    });
    
    set({
      user,
      isAuthenticated: true,
      error: null,
    });
  },

      setLoading: (loading: boolean) => set({ isLoading: loading }),

      setError: (error: string | null) => set({ error }),

  login: async (credentials: LoginCredentials) => {
    try {
      set({ isLoading: true, error: null });
      
      const response = await authApi.login(credentials);
      
      if (response.success && response.content) {
        const { user, access_token } = response.content;
        
        // Set cookies with token and user data
        const expiresAt = Date.now() + (7 * 24 * 60 * 60 * 1000); // 7 days
        setAuthCookies({
          token: access_token,
          user,
          expiresAt
        });
        
        set({
          user,
          isAuthenticated: true,
          error: null,
        });
      } else {
        const errorMessage = response.message || 'Login failed';
        set({ 
          error: errorMessage,
          isAuthenticated: false,
          user: null 
        });
        throw new Error(errorMessage);
      }
    } catch (error: any) {
      let errorMessage = 'An error occurred during login';
      
      if (error && typeof error === 'object') {
        if (error.message) {
          errorMessage = error.message;
        }
      }
      
      set({ 
        error: errorMessage,
        isAuthenticated: false,
        user: null 
      });
      
      throw new Error(errorMessage);
    } finally {
      set({ isLoading: false });
    }
  },

  loginWithGoogle: async (data: { user: User; access_token: string }) => {
    try {
      set({ isLoading: true, error: null });
      
      // Set cookies with token and user data
      const expiresAt = Date.now() + (7 * 24 * 60 * 60 * 1000); // 7 days
      setAuthCookies({
        token: data.access_token,
        user: data.user,
        expiresAt
      });
      
      set({
        user: data.user,
        isAuthenticated: true,
        error: null,
      });
      
    } catch (error: any) {
      const errorMessage = error.message || 'Google authentication failed';
      
      set({ 
        error: errorMessage,
        isAuthenticated: false,
        user: null 
      });
      
      throw new Error(errorMessage);
    } finally {
      set({ isLoading: false });
    }
  },

  logout: async () => {
    try {
      set({ isLoading: true });
      await authApi.logout();
    } catch (error) {
      console.error('Logout API error:', error);
    } finally {
      // Clear auth cookies
      clearAuthCookies();
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
        if (!user) return 'guest';
        
        const primaryRole = user.role[0];
        
        if (primaryRole === 'guest') {
          return 'guest';
        }
        
        const hasBasicInfo = user.name && user.email && user.date_of_birth;
        if (!hasBasicInfo) {
          return 'guest';
        }
        
        const hasRoleSpecificData = primaryRole === 'student' 
          ? user.school || user.class
          : primaryRole === 'parent' 
            ? user.phone
            : false;
        
        return hasRoleSpecificData ? 'complete' : 'role_details_complete';
      },

      isProfileComplete: (): boolean => {
        const status = get().getProfileStatus();
        return status === 'complete';
      },

      canAccessFeature: (feature: string): boolean => {
        const user = get().user;
        if (!user) return false;
        
        const isGuest = user.role[0] === 'guest';
        
        const restrictedFeatures = [
          'submit_assignment',
          'take_quiz', 
          'save_progress',
          'make_purchase',
          'access_personalized_content',
          'participate_in_discussions',
          'access_courses',
          'access_activities',
          'access_progress',
          'premium_content'
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
    return get().isPrimaryRole('guest');
  },
}));

// Access control checker function
export const checkGuestAccess = (action: string, user: User | null): boolean => {
  if (!user || user.role[0] !== 'guest') return true;
  
  const restrictedActions = [
    'submit_assignment', 'take_quiz', 'save_progress', 
    'make_purchase', 'access_personalized_content', 
    'participate_in_discussions'
  ];
  
  return !restrictedActions.includes(action);
};

// Role-based routing helper
export const getRoleBasedRoute = (user: User | null): string => {
  if (!user) return '/auth/login';
  
  const primaryRole = user.role[0];
  
  const roleRoutes = {
    guest: '/guest',
    student: '/dashboard', 
    parent: '/parent',
    admin: '/admin',
  };
  
  // Guest users go to guest dashboard (they can browse but with limited features)
  if (primaryRole === 'guest') {
    return '/guest';
  }
  
  return roleRoutes[primaryRole] || '/dashboard';
};

// Cookie-based auth store doesn't need manual initialization
// State is loaded directly from cookies in the initial state
