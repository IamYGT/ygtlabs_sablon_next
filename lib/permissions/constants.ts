/**
 * 🔐 Permission System Constants
 *
 * Permission sistemi için gerekli sabitler
 */

// =============================================================================
// PERMISSION ERROR MESSAGES
// =============================================================================
export const PERMISSION_ERROR_MESSAGES = {
  UNAUTHORIZED: "Yetkisiz erişim",
  FORBIDDEN: "Bu işlem için gerekli yetkiye sahip değilsiniz",
  INVALID_SESSION: "Geçersiz oturum",
  SESSION_EXPIRED: "Oturumunuz sona erdi, lütfen tekrar giriş yapın",
  INSUFFICIENT_PERMISSIONS: "Yetersiz yetki",
  PERMISSION_NOT_FOUND: "Yetki bulunamadı",
  INVALID_PERMISSION: "Geçersiz yetki",
  DEPENDENCY_NOT_MET: "Bağımlılık karşılanmadı",
} as const;

// =============================================================================
// PERMISSION SUCCESS MESSAGES
// =============================================================================
export const PERMISSION_SUCCESS_MESSAGES = {
  PERMISSION_GRANTED: "Yetki verildi",
  PERMISSION_REVOKED: "Yetki kaldırıldı",
  PERMISSIONS_SYNCED: "Yetkiler senkronize edildi",
  VALIDATION_PASSED: "Doğrulama başarılı",
  CONFIG_VALID: "Konfigürasyon geçerli",
} as const;

// =============================================================================
// PERMISSION HTTP STATUS CODES
// =============================================================================
export const PERMISSION_HTTP_STATUS = {
  OK: 200,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
  NOT_IMPLEMENTED: 501,
} as const;

// =============================================================================
// ROLE CONSTANTS
// =============================================================================
export const ROLE_TYPES = {
  SUPER_ADMIN: "super_admin",
  ADMIN: "admin",
  USER: "user",
} as const;

export const LAYOUT_TYPES = {
  ADMIN: "admin",
  USER: "user",
} as const;

// =============================================================================
// PERMISSION CATEGORIES
// =============================================================================
export const PERMISSION_CATEGORIES = {
  LAYOUT: "layout",
  VIEW: "view",
  FUNCTION: "function",
} as const;

export const PERMISSION_TYPES = {
  ADMIN: "admin",
  USER: "user",
} as const;

export const PERMISSION_ACTIONS = {
  ACCESS: "access",
  VIEW: "view",
  CREATE: "create",
  READ: "read",
  UPDATE: "update",
  DELETE: "delete",
  MANAGE: "manage",
} as const;

// =============================================================================
// VALIDATION CONSTANTS
// =============================================================================
export const VALIDATION_RULES = {
  PERMISSION_NAME_REGEX: /^[a-z]+(\.[a-z-]+)*$/,
  PERMISSION_NAME_MAX_LENGTH: 100,
  DISPLAY_NAME_MAX_LENGTH: 100,
  DESCRIPTION_MAX_LENGTH: 500,
  RESOURCE_PATH_MAX_LENGTH: 50,
} as const;

// =============================================================================
// CLI COMMAND CONSTANTS
// =============================================================================
export const CLI_COMMANDS = {
  SYNC: "sync",
  CHECK: "check",
  LIST: "list",
  VALIDATE: "validate",
  DEV: "dev",
  HELP: "help",
} as const;

// =============================================================================
// SYSTEM DEFAULTS
// =============================================================================
export const SYSTEM_DEFAULTS = {
  PERMISSION_CACHE_TTL: 5 * 60 * 1000, // 5 minutes
  SESSION_VALIDATION_TIMEOUT: 10 * 1000, // 10 seconds
  MAX_PERMISSION_DEPENDENCIES: 10,
  MAX_NAVIGATION_ITEMS: 20,
} as const;

// =============================================================================
// DEVELOPMENT CONSTANTS
// =============================================================================
export const DEV_CONFIG = {
  ENABLE_DEBUG_LOGS: process.env.NODE_ENV === "development",
  SKIP_PERMISSION_CHECKS: process.env.SKIP_PERMISSION_CHECKS === "true",
  MOCK_USER_PERMISSIONS: process.env.MOCK_USER_PERMISSIONS === "true",
} as const;
