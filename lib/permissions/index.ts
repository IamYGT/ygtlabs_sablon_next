/**
 * 🔐 Permission System - Main Exports
 *
 * Bu dosya permission sisteminin ana export'larını sağlar.
 * Tüm permission sistemi buradan import edilebilir.
 */

// Main configuration exports
export * from "./config";
export * from "./constants";
export * from "./helpers";
export * from "./types";

// Default exports for convenience (navigation removed)
export {
  ALL_PERMISSIONS,
  PERMISSION_STATS,
  SYSTEM_CONFIG,
  getPermissionByName,
  getPermissionsByCategory,
  getPermissionsByType,
  validatePermissionExists,
} from "./config";

export {
  PermissionHelpers,
  createPermissionChecker,
  debugPermissions,
  getPermissionUsageStats,
  validatePagePermission,
  validateUserPermissions,
  withPermission,
} from "./helpers";

export {
  LAYOUT_TYPES,
  PERMISSION_ACTIONS,
  PERMISSION_CATEGORIES,
  PERMISSION_ERROR_MESSAGES,
  PERMISSION_HTTP_STATUS,
  PERMISSION_SUCCESS_MESSAGES,
  PERMISSION_TYPES,
  ROLE_TYPES,
} from "./constants";
