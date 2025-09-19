/**
 * 🔐 Merkezi Permission Helper Functions
 *
 * API endpoint'ler ve middleware için merkezi permission kontrol sistemi
 * Tüm permission logic'i config.ts'den beslenir
 */

import { getCurrentUser } from "@/lib/server-utils";
import { NextRequest, NextResponse } from "next/server";
import { ALL_PERMISSIONS, type PermissionName } from "./config";

// User interface for permission checking
interface UserWithPermissions {
  id: string;
  email: string;
  primaryRole: string;
  permissions: string[];
  isActive: boolean;
}

/**
 * 🛡️ PERMISSION CHECKER FACTORY
 * API endpoint'ler için permission kontrolü oluşturucu
 */
export function createPermissionChecker(requiredPermission: PermissionName) {
  return async (user: UserWithPermissions | null): Promise<boolean> => {
    if (!user || !user.isActive) return false;

    // Super admin her şeye erişebilir
    if (user.primaryRole === "super_admin") return true;

    // Permission kontrolü
    return user.permissions.includes(requiredPermission);
  };
}

/**
 * 🚦 MIDDLEWARE PERMISSION VALIDATOR
 * Middleware'de sayfa erişimi için permission kontrolü
 */
export async function validatePagePermission(
  _request: NextRequest,
  _pagePath: string
): Promise<{
  isAllowed: boolean;
  user: UserWithPermissions | null;
  reason?: string;
}> {
  try {
    // TODO: Implement session validation
    // const sessionResult = await validateUserSession(request);
    return {
      isAllowed: false,
      user: null,
      reason:
        "Session validation not implemented - please implement validateUserSession",
    };

    // Uncomment after implementing session validation:
    // if (!sessionResult.isValid || !sessionResult.user) {
    //   return {
    //     isAllowed: false,
    //     user: null,
    //     reason: "Invalid session",
    //   };
    // }
    // const user = sessionResult.user;

    // Uncomment after implementing session validation:
    // Super admin her sayfaya erişebilir
    // if (user.primaryRole === "super_admin") {
    //   return { isAllowed: true, user };
    // }

    // Path'e göre required permission'ı bul
    // const requiredPermission = getRequiredPermissionForPath(pagePath);
    // if (!requiredPermission) {
    //   return {
    //     isAllowed: false,
    //     user,
    //     reason: "No permission mapping for path",
    //   };
    // }

    // Permission kontrolü
    // const hasPermission = user.permissions.includes(requiredPermission);
    // return {
    //   isAllowed: hasPermission,
    //   user,
    //   reason: hasPermission
    //     ? undefined
    //     : `Missing permission: ${requiredPermission}`,
    // };
  } catch (error) {
    console.error("Permission validation error:", error);
    return {
      isAllowed: false,
      user: null,
      reason: "Validation error",
    };
  }
}

/**
 * 🗺️ PATH TO PERMISSION MAPPING
 * URL path'lerini permission'lara eşler
 */
function _getRequiredPermissionForPath(path: string): PermissionName | null {
  // Admin path'leri
  if (path.includes("/admin/dashboard")) return "admin.dashboard.view";
  if (path.includes("/admin/users")) return "admin.users.view";
  if (path.includes("/admin/roles")) return "admin.roles.view";
  if (path.includes("/admin/permissions")) return "admin.permissions.view";
  if (path.includes("/admin/profile")) return "admin.profile.view";

  // Layout permission for general admin access
  if (path.includes("/admin")) return "admin.layout";
  if (path.includes("/customer")) return "customer.layout";

  return null;
}

/**
 * 🔒 API ENDPOINT PERMISSION GUARD
 * API route'lar için HOC permission guard
 */
export function withPermission(
  requiredPermission: PermissionName,
  handler: (
    request: NextRequest,
    user: UserWithPermissions
  ) => Promise<Response> | Response
) {
  return async (request: NextRequest): Promise<Response> => {
    try {
      // Session validation - getCurrentUser kullan
      const currentUser = await getCurrentUser(request);

      if (!currentUser || !currentUser.isActive) {
        return NextResponse.json(
          { error: "Unauthorized", code: "INVALID_SESSION" },
          { status: 401 }
        );
      }

      // UserWithPermissions formatına dönüştür
      const user: UserWithPermissions = {
        id: currentUser.id,
        email: currentUser.email || "",
        primaryRole: currentUser.primaryRole || "user",
        permissions: currentUser.permissions || [],
        isActive: currentUser.isActive,
      };

      // Permission kontrolü
      const hasPermission = await createPermissionChecker(requiredPermission)(
        user
      );

      if (!hasPermission) {
        return NextResponse.json(
          {
            error: "Forbidden",
            code: "INSUFFICIENT_PERMISSIONS",
            required: requiredPermission,
            user_permissions: user.permissions,
          },
          { status: 403 }
        );
      }

      // Handler'ı çalıştır
      return await handler(request, user);
    } catch (error) {
      console.error("Permission guard error:", error);
      return NextResponse.json(
        { error: "Internal server error", code: "PERMISSION_CHECK_ERROR" },
        { status: 500 }
      );
    }
  };
}

/**
 * 🔄 PERMISSION VALIDATION HELPERS
 * Permission'ları validate etmek için helper'lar
 */
export function validateUserPermissions(permissions: string[]): string[] {
  // Only return permissions that exist in our permission config
  const validPermissions = permissions.filter((permission) =>
    ALL_PERMISSIONS.some((p) => p.name === permission)
  );

  if (validPermissions.length !== permissions.length) {
    const invalidPermissions = permissions.filter(
      (permission) => !ALL_PERMISSIONS.some((p) => p.name === permission)
    );
    console.warn("Invalid permissions found:", invalidPermissions);
  }

  return validPermissions;
}

/**
 * 📊 PERMISSION ANALYTICS
 * Permission kullanım analizi için helper'lar
 */
export function getPermissionUsageStats(userPermissions: string[]) {
  const permissionStats = {
    total: userPermissions.length,
    layout: userPermissions.filter((p) => p.includes(".layout")).length,
    view: userPermissions.filter((p) => p.includes(".view")).length,
    function: userPermissions.filter(
      (p) => !p.includes(".layout") && !p.includes(".view")
    ).length,
    categories: {
      admin: userPermissions.filter((p) => p.startsWith("admin.")).length,
      customer: userPermissions.filter((p) => p.startsWith("customer.")).length,
      other: userPermissions.filter(
        (p) => !p.startsWith("admin.") && !p.startsWith("customer.")
      ).length,
    },
  };

  return permissionStats;
}

/**
 * 🔍 PERMISSION DEBUGGING
 * Development'ta permission debug için helper'lar
 */
export function debugPermissions(user: UserWithPermissions | null) {
  if (process.env.NODE_ENV !== "development") return;

  console.log("🔐 Permission Debug:", {
    user: user?.email || "Not logged in",
    role: user?.primaryRole || "No role",
    permissions: user?.permissions || [],
    stats: user ? getPermissionUsageStats(user.permissions) : null,
  });
}

/**
 * 🚀 MAIN EXPORTS
 * Ana export'lar
 */
export const PermissionHelpers = {
  createPermissionChecker,
  validatePagePermission,
  withPermission,
  validateUserPermissions,
  getPermissionUsageStats,
  debugPermissions,
} as const;

// Type exports
export type { UserWithPermissions };

