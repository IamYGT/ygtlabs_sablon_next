"use client";

// ============================================================================
// ENHANCED AUTH STORE - Tight TanStack Query Integration
// ============================================================================

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { ROLES, STORAGE_KEYS } from "../constants";
import type { SimpleUser } from "../types";

// ============================================================================
// ENHANCED AUTH STORE INTERFACE
// ============================================================================

interface AuthState {
  user: SimpleUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  lastActivity: Date | null;
  sessionExpiry: Date | null;
}

interface AuthStore extends AuthState {
  // Enhanced Actions
  setUser: (user: SimpleUser | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  logout: () => void;
  updateLastActivity: () => void;
  setSessionExpiry: (expiry: Date | null) => void;

  // Enhanced Permission helpers
  hasPermission: (permission: string) => boolean;
  hasAnyPermission: (permissions: string[]) => boolean;
  hasAllPermissions: (permissions: string[]) => boolean;

  // Enhanced Role helpers
  hasRole: (role: string) => boolean;
  hasAnyRole: (roles: string[]) => boolean;
  isAdmin: () => boolean;
  isSuperAdmin: () => boolean;
  isUser: () => boolean;

  // Session management
  isSessionValid: () => boolean;
  getTimeUntilExpiry: () => number | null;

  // Utility functions
  reset: () => void;
  hydrate: () => void;

  // New computed functions
  hasAdminAccess: () => boolean;
  hasUserAccess: () => boolean;
  getUserInitials: () => string;
  getUserDisplayName: () => string;
  getRoleName: () => string;
}

// ============================================================================
// ENHANCED AUTH STORE IMPLEMENTATION
// ============================================================================

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      // Enhanced initial state
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      lastActivity: null,
      sessionExpiry: null,

      // Enhanced Actions
      setUser: (user: SimpleUser | null) => {
        set({
          user,
          isAuthenticated: !!user,
          error: null,
          lastActivity: user ? new Date() : null,
        });
      },

      setLoading: (loading: boolean) => {
        set({ isLoading: loading });
      },

      setError: (error: string | null) => {
        set({ error });
      },

      clearError: () => {
        set({ error: null });
      },

      logout: () => {
        set({
          user: null,
          isAuthenticated: false,
          isLoading: false,
          error: null,
          lastActivity: null,
          sessionExpiry: null,
        });
      },

      updateLastActivity: () => {
        set({ lastActivity: new Date() });
      },

      setSessionExpiry: (expiry: Date | null) => {
        set({ sessionExpiry: expiry });
      },

      // Enhanced Permission helpers
      hasPermission: (permission: string) => {
        const { user } = get();
        return user?.permissions?.includes(permission) || false;
      },

      hasAnyPermission: (permissions: string[]) => {
        const { user } = get();
        if (!user || !user.permissions) return false;
        return permissions.some((permission) =>
          user.permissions.includes(permission)
        );
      },

      hasAllPermissions: (permissions: string[]) => {
        const { user } = get();
        if (!user || !user.permissions) return false;
        return permissions.every((permission) =>
          user.permissions.includes(permission)
        );
      },

      // Enhanced Role helpers
      hasRole: (role: string) => {
        const { user } = get();
        if (!user || !user.userRoles) return false;
        return user.userRoles.includes(role);
      },

      hasAnyRole: (roles: string[]) => {
        const { user } = get();
        if (!user || !user.userRoles) return false;
        return roles.some((role) => user.userRoles.includes(role));
      },

      isAdmin: () => {
        const { hasPermission } = get();
        return hasPermission("admin.layout");
      },

      isSuperAdmin: () => {
        const { user } = get();
        return (
          user?.primaryRole === "super_admin" ||
          user?.userRoles?.includes("super_admin") ||
          false
        );
      },

      isUser: () => {
        const { hasPermission } = get();
        return hasPermission("user.layout");
      },

      // Enhanced Session management
      isSessionValid: () => {
        const { sessionExpiry } = get();
        if (!sessionExpiry) return true; // No expiry set
        return new Date() < sessionExpiry;
      },

      getTimeUntilExpiry: () => {
        const { sessionExpiry } = get();
        if (!sessionExpiry) return null;
        const now = new Date();
        const expiry = new Date(sessionExpiry);
        return Math.max(0, expiry.getTime() - now.getTime());
      },

      // Enhanced Utility functions
      reset: () => {
        set({
          user: null,
          isAuthenticated: false,
          isLoading: false,
          error: null,
          lastActivity: null,
          sessionExpiry: null,
        });
      },

      hydrate: () => {
        // This will be called after hydration from localStorage
        const { user, sessionExpiry } = get();
        if (user && sessionExpiry) {
          const isValid = new Date() < new Date(sessionExpiry);
          if (!isValid) {
            get().reset();
          }
        }
      },

      // New computed functions
      hasAdminAccess: () => {
        const { hasPermission } = get();
        return hasPermission("admin.layout");
      },

      hasUserAccess: () => {
        const { hasPermission } = get();
        return hasPermission("user.layout") || hasPermission("admin.layout");
      },

      getUserInitials: () => {
        const { user } = get();
        if (!user) return "";

        if (user.name) {
          return user.name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
            .slice(0, 2);
        }

        if (user.email) {
          return user.email.slice(0, 2).toUpperCase();
        }

        return "U";
      },

      getUserDisplayName: () => {
        const { user } = get();
        return user?.name || user?.email || "Kullanıcı";
      },

      getRoleName: () => {
        const { user } = get();
        return user?.primaryRole || user?.userRoles?.[0] || "Kullanıcı";
      },
    }),
    {
      name: STORAGE_KEYS.AUTH_USER,
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        lastActivity: state.lastActivity,
        sessionExpiry: state.sessionExpiry,
      }),
      onRehydrateStorage: () => (state) => {
        state?.hydrate();
      },
    }
  )
);

// ============================================================================
// ENHANCED SELECTOR HOOKS
// ============================================================================

export const useUser = () => useAuthStore((state) => state.user);
export const useIsAuthenticated = () =>
  useAuthStore((state) => state.isAuthenticated);
export const useAuthLoading = () => useAuthStore((state) => state.isLoading);
export const useAuthError = () => useAuthStore((state) => state.error);

export const useHasPermission = (permission: string) =>
  useAuthStore((state) => state.hasPermission(permission));

export const useHasAnyPermission = (permissions: string[]) =>
  useAuthStore((state) => state.hasAnyPermission(permissions));

export const useIsAdmin = () => useAuthStore((state) => state.isAdmin());
export const useIsSuperAdmin = () =>
  useAuthStore((state) => state.isSuperAdmin());

export const useIsUser = () => useAuthStore((state) => state.isUser());

export const useSessionStatus = () =>
  useAuthStore((state) => ({
    isValid: state.isSessionValid(),
    timeUntilExpiry: state.getTimeUntilExpiry(),
    lastActivity: state.lastActivity,
  }));

export const authActions = {
  setUser: (user: SimpleUser | null) => useAuthStore.getState().setUser(user),
  setLoading: (loading: boolean) => useAuthStore.getState().setLoading(loading),
  setError: (error: string | null) => useAuthStore.getState().setError(error),
  logout: () => useAuthStore.getState().logout(),
  updateActivity: () => useAuthStore.getState().updateLastActivity(),
  setSessionExpiry: (expiry: Date | null) =>
    useAuthStore.getState().setSessionExpiry(expiry),
};

// ============================================================================
// ENHANCED HELPER FUNCTIONS
// ============================================================================

export const canAccessAdmin = (user: SimpleUser | null): boolean => {
  if (!user || !user.permissions) return false;
  return user.permissions.includes("admin.layout");
};

export const canAccessUser = (user: SimpleUser | null): boolean => {
  if (!user || !user.permissions) return false;
  return user.permissions.includes("user.layout");
};

export const getUserDashboardUrl = (user: SimpleUser | null): string => {
  if (!user) return "/auth/login";

  if (canAccessAdmin(user)) {
    return "/admin/dashboard";
  }

  if (canAccessUser(user)) {
    return "/users/dashboard";
  }

  return "/auth/forbidden";
};

export const formatUserDisplayName = (user: SimpleUser | null): string => {
  if (!user) return "Misafir";
  return user.name || user.email || "İsimsiz Kullanıcı";
};

export const getUserInitials = (user: SimpleUser | null): string => {
  if (!user) return "M";

  const name = user.name || user.email || "Misafir";
  const words = name.split(" ");

  if (words.length >= 2) {
    return (words[0][0] + words[1][0]).toUpperCase();
  }

  return name.substring(0, 2).toUpperCase();
};

export const getUserRoleDisplayName = (user: SimpleUser | null): string => {
  if (!user || !user.primaryRole) return "Kullanıcı";

  switch (user.primaryRole) {
    case ROLES.SUPER_ADMIN:
      return "Süper Admin";
    case ROLES.ADMIN:
      return "Admin";
    case ROLES.USER:
      return "Kullanıcı";
    default:
      return user.primaryRole;
  }
};

// ============================================================================
// SESSION MONITORING
// ============================================================================

// ============================================================================
// SESSION MONITORING (SAFE IMPLEMENTATION)
// ============================================================================

// Session monitoring without causing infinite loops
if (typeof window !== "undefined") {
  let previousUser: SimpleUser | null = null;
  let previousExpiry: Date | null = null;
  let isUpdatingActivity = false; // Flag to prevent infinite loops

  useAuthStore.subscribe((state) => {
    // Monitor user changes (but don't update activity automatically to avoid loops)
    if (state.user !== previousUser) {
      if (state.user && !isUpdatingActivity) {
        console.log("👤 User changed:", state.user.email);
        // Don't auto-update activity here to avoid infinite loops
        // Activity will be updated on actual user interactions
      }
      previousUser = state.user;
    }

    // Monitor session expiry changes
    if (state.sessionExpiry !== previousExpiry) {
      const expiry = state.sessionExpiry;
      if (expiry) {
        const timeUntilExpiry = new Date(expiry).getTime() - Date.now();
        const warningTime = 5 * 60 * 1000; // 5 minutes

        if (timeUntilExpiry > warningTime && timeUntilExpiry > 0) {
          // Use requestAnimationFrame for better performance
          const scheduleWarning = () => {
            setTimeout(() => {
              const currentExpiry = useAuthStore.getState().sessionExpiry;
              if (
                currentExpiry &&
                new Date(currentExpiry).getTime() === new Date(expiry).getTime()
              ) {
                console.warn("⚠️ Session will expire in 5 minutes");
                // You can dispatch a notification here
              }
            }, Math.min(timeUntilExpiry - warningTime, 300000)); // Max 5 minutes
          };

          requestAnimationFrame(scheduleWarning);
        }
      }
      previousExpiry = expiry;
    }
  });

  // Safe activity updater
  const safeUpdateActivity = () => {
    if (!isUpdatingActivity) {
      isUpdatingActivity = true;
      useAuthStore.getState().updateLastActivity();
      // Use requestAnimationFrame for better performance
      requestAnimationFrame(() => {
        setTimeout(() => {
          isUpdatingActivity = false;
        }, 50); // Reduced from 100ms to 50ms
      });
    }
  };

  // Export for external use
  (window as Window & { safeUpdateActivity?: () => void }).safeUpdateActivity =
    safeUpdateActivity;
}
