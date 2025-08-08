"use client";

// =============================================================================
// AUTH HOOKS - Enhanced TanStack Query Authentication Hooks
// =============================================================================

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import { authAPI } from "../api-client";
import { QUERY_KEYS } from "../constants";
import { clearAllCacheOnLogout } from "../providers/query-provider";
import { authActions, useAuthStore } from "../stores/auth-store";
import { useUIStore } from "../stores/ui-store";
import type { LoginData, SimpleUser } from "../types";
import { useTranslations } from "next-intl";

// =============================================================================
// MODERN CLIENT-SIDE AUTH HOOKS
// =============================================================================

/**
 * Ana auth hook - TanStack Query ile optimize edilmiş
 */
export function useAuth() {
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isLoading = useAuthStore((state) => state.isLoading);
  const error = useAuthStore((state) => state.error);

  return {
    user,
    isAuthenticated,
    isLoading,
    error,
    // Permission helpers
    hasPermission: useAuthStore((state) => state.hasPermission),
    hasAdminAccess: useAuthStore((state) => state.hasAdminAccess),
    hasUserAccess: useAuthStore((state) => state.hasUserAccess),
    isAdmin: useAuthStore((state) => state.isAdmin),
    // User info helpers
    getUserInitials: useAuthStore((state) => state.getUserInitials),
    getUserDisplayName: useAuthStore((state) => state.getUserDisplayName),
    getRoleName: useAuthStore((state) => state.getRoleName),
  };
}

/**
 * Current user query - TanStack Query ile cache'li
 */
export function useCurrentUser() {
  return useQuery({
    queryKey: QUERY_KEYS.AUTH,
    queryFn: async () => {
      try {
        const response = await authAPI.getCurrentUser();

        if (
          response.success &&
          response.data &&
          typeof response.data === "object" &&
          response.data !== null &&
          "user" in response.data
        ) {
          // Zustand store'u güncelle
          const userData = (response.data as { user: SimpleUser }).user;
          authActions.setUser(userData);
          return userData;
        }

        // Auth başarısız - store'u temizle
        authActions.logout();
        return null;
      } catch (error) {
        console.error("❌ Current user fetch failed:", error);

        // 401 hatası durumunda session'ı temizle ve login'e yönlendir
        if (error instanceof Error && error.message.includes("401")) {
          console.log("🔒 Session expired, clearing auth state");
          authActions.logout();

          // Login sayfasına yönlendir (sadece korumalı sayfalarda)
          const currentPath = window.location.pathname;
          if (
            currentPath.includes("/admin") ||
            currentPath.includes("/users")
          ) {
            const locale = currentPath.split("/")[1] || "en";
            window.location.href = `/${locale}/auth/login?callbackUrl=${encodeURIComponent(
              currentPath
            )}`;
          }
        } else {
          authActions.logout();
        }

        return null;
      }
    },
    staleTime: 60 * 1000, // Increased to 60 seconds to reduce API calls
    gcTime: 5 * 60 * 1000, // Increased to 5 minutes cache
    retry: false,
    refetchOnWindowFocus: false, // Disabled to reduce unnecessary calls
    refetchOnMount: false,
    refetchIntervalInBackground: false,
  });
}

/**
 * Login mutation - TanStack Query ile
 */
export function useLogin() {
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useUIStore();
  const params = useParams();
  const locale = (params.locale as string) || "en";
  const router = useRouter();
  const t = useTranslations('Auth');

  return useMutation({
    mutationFn: async (data: LoginData): Promise<SimpleUser> => {
      authActions.setLoading(true);
      authActions.setError(null);

      try {
        const response = await authAPI.login(data);

        if (
          response.success &&
          response.data &&
          typeof response.data === "object" &&
          response.data !== null &&
          "user" in response.data
        ) {
          // Store'u güncelle
          const userData = (response.data as { user: SimpleUser }).user;
          authActions.setUser(userData);

          // Cache'i güncelle
          queryClient.setQueryData(QUERY_KEYS.AUTH, userData);

          return userData;
        }

        throw new Error(response.error || "Giriş başarısız");
      } finally {
        authActions.setLoading(false);
      }
    },
    onSuccess: (user: SimpleUser) => {
      showSuccess(t('loginSuccess'));

      // Redirect to appropriate dashboard
      const hasAdminAccess = user.permissions?.includes("admin.layout");
      const dashboardPath = hasAdminAccess
        ? "/admin/dashboard"
        : "/users/dashboard";
      router.push(`/${locale}${dashboardPath}`);
    },
    onError: (error: unknown) => {
      const errorMessage =
        error instanceof Error
          ? error.message
          : t('loginError');
      authActions.setError(errorMessage);
      showError(errorMessage);
    },
  });
}

/**
 * Logout mutation - TanStack Query ile
 */
export function useLogout() {
  const { showSuccess } = useUIStore();
  const params = useParams();
  const locale = (params.locale as string) || "en";
  const t = useTranslations('Auth');

  return useMutation<void, Error, boolean>({
    mutationFn: async (logoutAllSessions = false): Promise<void> => {
      try {
        await authAPI.logout(logoutAllSessions);
      } catch (error) {
        console.error("❌ Logout API failed:", error);
        // API başarısız olsa bile client-side logout yap
      }

      // Store'u temizle
      authActions.logout();

      // Persist store'u da temizle (localStorage)
      localStorage.removeItem("auth-store");

      // Client-side cookie'yi de temizle
      if (typeof document !== "undefined") {
        // Tüm olası domain/path kombinasyonları için cookie'yi temizle
        const cookiesToClear = [
          "ecu_session=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;",
          "ecu_session=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=localhost;",
          "ecu_session=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.localhost;",
        ];

        cookiesToClear.forEach((cookie) => {
          document.cookie = cookie;
        });

        console.log("🍪 Client-side cookies cleared");
      }

      // Özel logout cache temizleme fonksiyonunu kullan
      await clearAllCacheOnLogout();
    },
    onSuccess: (_, logoutAllSessions) => {
      const message = logoutAllSessions
        ? t('logoutSuccess')
        : t('logoutSuccess');
      showSuccess(message);

      // Hard redirect to login page to ensure clean state
      // Bu şekilde tüm client-side state tamamen temizlenir
      const redirectToLogin = () => {
        window.location.href = `/${locale}/auth/login`;
      };

      // Use requestAnimationFrame for better performance
      requestAnimationFrame(() => {
        setTimeout(redirectToLogin, 300); // Reduced from 500ms to 300ms
      });
    },
  });
}

/**
 * Admin auth hook - sadece admin kullanıcılar için
 */
export function useAdminAuth(): SimpleUser | null {
  const { user, isAuthenticated } = useAuth();
  const hasAdminAccess = useAuthStore((state) => state.hasAdminAccess());

  if (!isAuthenticated || !user || !hasAdminAccess) {
    return null;
  }

  return user;
}

/**
 * User auth hook - user veya admin kullanıcılar için
 */
export function useUserAuth(): SimpleUser | null {
  const { user, isAuthenticated } = useAuth();
  const hasUserAccess = useAuthStore((state) => state.hasUserAccess());

  if (!isAuthenticated || !user || !hasUserAccess) {
    return null;
  }

  return user;
}

/**
 * Auth guard hook - yetki kontrolü ile
 */
export function useAuthGuard(requiredPermission?: string) {
  const { user, isAuthenticated, hasPermission, isLoading } = useAuth();
  const params = useParams();
  const locale = (params.locale as string) || "en";
  const router = useRouter();

  // Loading durumu
  if (isLoading) {
    return { isAuthorized: false, isLoading: true };
  }

  // Giriş yapmamış
  if (!isAuthenticated || !user) {
    router.push(`/${locale}/auth/login`);
    return { isAuthorized: false, isLoading: false };
  }

  // Özel permission kontrolü
  if (requiredPermission && !hasPermission(requiredPermission)) {
    router.push(`/${locale}/auth/forbidden`);
    return { isAuthorized: false, isLoading: false };
  }

  return { isAuthorized: true, isLoading: false };
}

/**
 * Session monitoring hook (safe implementation)
 */
export function useSessionMonitoring() {
  const isSessionValid = useAuthStore((state) => state.isSessionValid);

  // Safe activity tracker that prevents infinite loops
  const trackActivity = () => {
    if (typeof window !== "undefined") {
      const safeUpdater = (
        window as Window & { safeUpdateActivity?: () => void }
      ).safeUpdateActivity;
      if (safeUpdater) {
        safeUpdater();
      } else {
        // Fallback to direct call with throttling
        const now = Date.now();
        const lastUpdate =
          (window as Window & { lastActivityUpdate?: number })
            .lastActivityUpdate || 0;
        if (now - lastUpdate > 1000) {
          // Throttle to once per second
          useAuthStore.getState().updateLastActivity();
          (
            window as Window & { lastActivityUpdate?: number }
          ).lastActivityUpdate = now;
        }
      }
    }
  };

  return {
    isSessionValid: isSessionValid(),
    trackActivity,
  };
}

/**
 * Permission check hooks
 */
export function useHasPermission(permission: string) {
  return useAuthStore((state) => state.hasPermission(permission));
}

export function useHasAdminAccess() {
  return useAuthStore((state) => state.hasAdminAccess());
}

export function useHasUserAccess() {
  return useAuthStore((state) => state.hasUserAccess());
}

export function useIsAdmin() {
  return useAuthStore((state) => state.isAdmin());
}

// =============================================================================
// OPTIMIZED HELPER HOOKS
// =============================================================================

// Get current user from store (for immediate access)
export function useCurrentUserFromStore() {
  return useAuthStore((state) => state.user);
}

// Get auth loading state
export function useAuthLoading() {
  const { isLoading: queryLoading } = useCurrentUser();
  const storeLoading = useAuthStore((state) => state.isLoading);

  return queryLoading || storeLoading;
}

/**
 * Refresh user permissions - Role değişikliği sonrası kullan
 */
export function useRefreshPermissions() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const response = await fetch("/api/auth/refresh-permissions", {
        method: "POST",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || "Permission refresh failed");
      }

      return data.user;
    },
    onSuccess: (refreshedUser) => {
      console.log("✅ Permissions refreshed successfully");

      // Auth store'u güncelle
      authActions.setUser(refreshedUser);

      // Current user query'sini invalidate et
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.AUTH,
      });
    },
    onError: (error) => {
      console.error("❌ Permission refresh failed:", error);
    },
  });
}

// Enhanced auth refresh utility (outside of hook)
export function refreshAuthQueries() {
  const { getQueryClient } = require("../providers/query-provider");
  const queryClient = getQueryClient();
  return queryClient.invalidateQueries({
    queryKey: QUERY_KEYS.AUTH,
  });
}
