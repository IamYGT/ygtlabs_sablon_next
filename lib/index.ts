// ============================================================================
// @/lib - Modern Auth Library Export Hub
// Zustand + TanStack Query Based System
// ============================================================================

// 🎯 Core Modern Exports
export * from "./constants";
export * from "./types";

// 🔐 Modern Authentication - Selective exports to avoid conflicts
export {
  useAdminAuth,
  useAuth,
  useCurrentUser,
  useHasAdminAccess,
  useHasPermission,
  useHasUserAccess,
  useIsAdmin,
  useLogin,
  useLogout,
  useUserAuth,
} from "./hooks/useAuth";

export {
  useAssignRole,
  useBulkDeleteUsers,
  useCreateUser,
  useDeleteUser,
  usePrefetchUser,
  useRemoveRole,
  useSearchUsers,
  useToggleUserStatus,
  useUpdateUser,
  useUserCount,
  useUser as useUserDetails,
  useUserExists,
  useUsers,
  useUsersByRole,
} from "./hooks/useUsers";

// Store exports with aliases to prevent conflicts
export {
  authActions,
  canAccessAdmin,
  canAccessCustomer,
  canAccessCustomer as canAccessUser, // Alias for backward compatibility
  formatUserDisplayName,
  getUserDashboardUrl,
  getUserInitials,
  getUserRoleDisplayName,
  useAuthError,
  useAuthLoading as useAuthLoadingFromStore,
  useAuthStore,
  useHasAnyPermission as useHasAnyPermissionFromStore,
  useHasPermission as useHasPermissionFromStore,
  useIsAdmin as useIsAdminFromStore,
  useIsAuthenticated as useIsAuthenticatedFromStore,
  useIsSuperAdmin,
  useIsCustomer as useIsUserFromStore, // Alias for backward compatibility
  useIsCustomer,
  useSessionStatus,
  useUser as useUserFromStore,
} from "./stores/auth-store";

export * from "./stores/ui-store";

// 🌐 API & Providers
export * from "./api-client";
export * from "./providers/query-provider";

// 🛠️ Core Utilities
export * from "./crypto";
export * from "./prisma";
export * from "./session-utils";
export * from "./utils";

// 🎨 Re-export UI Components for convenience
export { cn } from "./utils";

// 🔧 Query Client utilities
export {
  clearQueryCache,
  getQueryClient,
  getQueryData,
  invalidateAuthQueries,
  invalidatePermissionQueries,
  invalidateQueries,
  invalidateRoleQueries,
  invalidateUserQueries,
  prefetchQuery,
  removeQueries,
  setQueryData,
} from "./providers/query-provider";

// ============================================================================
// LEGACY COMPATIBILITY FUNCTIONS (for existing API routes)
// ============================================================================

import type { SimpleUser } from "./types";

// Temporary compatibility functions for API routes
export async function verifyAdminAuth(_req: Request) {
  const { getCurrentUser } = await import("./session-utils");
  const user = await getCurrentUser();

  if (!user || !user.permissions?.includes("admin.layout")) {
    throw new Error("Admin access required");
  }

  return user;
}

export async function hasPermission(
  user: SimpleUser | null,
  permission: string
): Promise<boolean> {
  return user?.permissions?.includes(permission) || false;
}

export async function hasAdminAccess(
  user: SimpleUser | null
): Promise<boolean> {
  return hasPermission(user, "admin.layout");
}

export async function canEditUser(
  currentUser: SimpleUser | null,
  targetUser: SimpleUser | null
): Promise<boolean> {
  if (!currentUser || !hasAdminAccess(currentUser)) return false;
  if (currentUser.id === targetUser?.id) return true; // Can edit self
  return hasPermission(currentUser, "users.update");
}

export async function canToggleUserStatus(
  currentUser: SimpleUser | null
): Promise<boolean> {
  return hasPermission(currentUser, "users.update");
}

// Session management compatibility
export async function login(_email: string, _password: string) {
  // This should be implemented with your existing login logic
  throw new Error("Use modern auth hooks instead");
}

export async function getSession(sessionId: string) {
  const { prisma } = await import("./prisma");
  return prisma.session.findUnique({ where: { id: sessionId } });
}

export async function getAllUserSessions(userId: string) {
  const { prisma } = await import("./prisma");
  return prisma.session.findMany({
    where: { userId, isActive: true },
    orderBy: { lastActive: "desc" },
  });
}

export async function revokeSession(sessionId: string) {
  const { prisma } = await import("./prisma");
  return prisma.session.update({
    where: { id: sessionId },
    data: { isActive: false },
  });
}

export async function revokeAllUserSessions(userId: string) {
  const { prisma } = await import("./prisma");
  return prisma.session.updateMany({
    where: { userId },
    data: { isActive: false },
  });
}

export async function cleanupExpiredSessions() {
  const { prisma } = await import("./prisma");
  return prisma.session.deleteMany({
    where: { expires: { lt: new Date() } },
  });
}

export async function detectSuspiciousActivity(_userId: string) {
  // Implement suspicious activity detection
  return [];
}

export function parseDeviceInfo(_userAgent: string) {
  return {
    browser: "Unknown",
    os: "Unknown",
    device: "Unknown",
  };
}

export async function getUserLayoutInfo(_userId: string) {
  const { getCurrentUser } = await import("./session-utils");
  const user = await getCurrentUser();

  return {
    hasAdminAccess: user?.permissions?.includes("admin.layout") || false,
    hasUserAccess: user?.permissions?.includes("customer.layout") || false,
    permissions: user?.permissions || [],
  };
}
