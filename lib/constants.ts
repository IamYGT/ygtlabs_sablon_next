// Constants that can be used both server-side and client-side

// =============================================================================
// BASIT SABİTLER - Junior Developer İçin Kolay Anlaşılır
// =============================================================================

// =============================================================================
// AUTH ROUTES (Kimlik Doğrulama Rotaları)
// =============================================================================
export const AUTH_ROUTES = {
  LOGIN: "/auth/login",
  REGISTER: "/auth/register",
  FORBIDDEN: "/auth/forbidden",
  UNAUTHORIZED: "/auth/unauthorized",
  USER_DASHBOARD: "/customer/dashboard",
  ADMIN_DASHBOARD: "/admin/dashboard",
} as const;

// =============================================================================
// API ENDPOINTS (API Uç Noktaları)
// =============================================================================
export const API_ENDPOINTS = {
  // Auth endpoints
  AUTH_LOGIN: "/api/auth/login",
  AUTH_LOGOUT: "/api/auth/logout",
  AUTH_REGISTER: "/api/auth/register",
  AUTH_CURRENT_USER: "/api/auth/current-user",
  AUTH_CHECK_PERMISSIONS: "/api/auth/check-permissions",
  AUTH_USER_LAYOUT_INFO: "/api/auth/user-layout-info",

  // Admin endpoints
  ADMIN_PROFILE: "/api/admin/profile",
  ADMIN_CHANGE_PASSWORD: "/api/admin/change-password",
  ADMIN_SESSIONS: "/api/admin/sessions",
  ADMIN_NOTIFICATIONS: "/api/admin/notifications",
  ADMIN_SYSTEM_STATUS: "/api/admin/system-status",

  // User management
  ADMIN_USERS: "/api/admin/users",
  ADMIN_USERS_CREATE: "/api/admin/users/create",
  ADMIN_USERS_UPDATE: "/api/admin/users/update",
  ADMIN_USERS_DELETE: "/api/admin/users/delete",
  ADMIN_USERS_TOGGLE_STATUS: "/api/admin/users/toggle-status",
  ADMIN_USERS_ASSIGN_ROLE: "/api/admin/users/assign-role",
  ADMIN_USERS_REMOVE_ROLE: "/api/admin/users/remove-role",
  ADMIN_USERS_BULK_DELETE: "/api/admin/users/bulk-delete",

  // Role management
  ADMIN_ROLES: "/api/admin/roles",
  ADMIN_ROLES_CREATE: "/api/admin/roles/create",

  // Permission management
  ADMIN_PERMISSIONS: "/api/admin/permissions",
  ADMIN_PERMISSIONS_AVAILABLE: "/api/admin/permissions/available",

  // Dynamic endpoints
  USER_BY_ID: (id: string) => `/api/users/${id}`,
  ROLE_BY_ID: (id: string) => `/api/admin/roles/${id}`,
  ROLE_UPDATE: (id: string) => `/api/admin/roles/${id}/update`,
  ROLE_DELETE: (id: string) => `/api/admin/roles/${id}/delete`,
  ROLE_PERMISSIONS: (id: string) => `/api/admin/roles/${id}/permissions`,
  PERMISSION_BY_ID: (id: string) => `/api/admin/permissions/${id}`,

  // Upload endpoints
  UPLOAD_PROFILE_IMAGE: "/api/upload/profile-image",
} as const;

// =============================================================================
// QUERY KEYS (TanStack Query Anahtarları)
// =============================================================================
export const QUERY_KEYS = {
  // Auth queries
  AUTH: ["auth"] as const,
  CURRENT_USER: ["auth", "currentUser"] as const,
  USER_PERMISSIONS: (userId: string) =>
    ["auth", "permissions", userId] as const,
  USER_LAYOUT_INFO: ["auth", "layoutInfo"] as const,

  // User queries
  USERS: ["users"] as const,
  USERS_LIST: ["users", "list"] as const,
  USERS_PAGINATED: (filters?: Record<string, unknown>) =>
    ["users", "paginated", filters] as const,
  USER_BY_ID: (id: string) => ["users", "detail", id] as const,
  USER_SESSIONS: (userId: string) => ["users", userId, "sessions"] as const,

  // Role queries
  ROLES: ["roles"] as const,
  ROLES_LIST: ["roles", "list"] as const,
  ROLE_BY_ID: (id: string) => ["roles", "detail", id] as const,
  ROLE_PERMISSIONS: (roleId: string) =>
    ["roles", roleId, "permissions"] as const,

  // Permission queries
  PERMISSIONS: ["permissions"] as const,
  PERMISSIONS_LIST: ["permissions", "list"] as const,
  PERMISSIONS_AVAILABLE: ["permissions", "available"] as const,
  PERMISSION_BY_ID: (id: string) => ["permissions", "detail", id] as const,

  // System queries
  SYSTEM_STATUS: ["system", "status"] as const,
  NOTIFICATIONS: ["notifications"] as const,
  SESSIONS: ["sessions"] as const,
} as const;

// =============================================================================
// 🚀 MERKEZI PERMISSION SİSTEMİ
// =============================================================================
//
// Tüm permission'lar artık merkezi olarak lib/permissions.config.ts'de yönetiliyor!
//
// Kullanım:
// import { ALL_PERMISSIONS, type PermissionName } from "@/lib/permissions.config";
// import { useHasPermission } from "@/hooks/useAdminNavigation";
//
// CLI Komutları:
// npm run permissions:list     - Tüm permission'ları listele
// npm run permissions:types    - TypeScript types generate et
// npm run permissions:roles    - Role'leri listele
// =============================================================================

// ============================================================================
// 🚀 MERKEZI ROLE SİSTEMİ
// ============================================================================
//
// Tüm roller artık merkezi olarak lib/permissions.config.ts'de yönetiliyor!
//
// Kullanım:
// import { ROLE_CONFIGURATIONS, type RoleName } from "@/lib/permissions.config";
// import { getAllRoles, getSystemRoles } from "@/lib/permissions.config";
//
// CLI Komutları:
// npm run permissions:roles    - Role'leri listele
// ============================================================================

// Backward compatibility için minimal ROLES constant (sadece useAuth için)
export const ROLES = {
  SUPER_ADMIN: "super_admin",
  ADMIN: "admin",
  USER: "user",
} as const;

// ============================================================================
// NOTIFICATION SETTINGS
// ============================================================================

export const NOTIFICATION_CONFIG = {
  DEFAULT_DURATION: 5000, // 5 seconds
  SUCCESS_DURATION: 3000, // 3 seconds
  ERROR_DURATION: 7000, // 7 seconds
  WARNING_DURATION: 5000, // 5 seconds
  INFO_DURATION: 4000, // 4 seconds

  MAX_NOTIFICATIONS: 5,
  POSITION: "top-right" as const,
} as const;

// ============================================================================
// CACHE CONFIGURATION
// ============================================================================

export const CACHE_CONFIG = {
  // Default cache times (in milliseconds)
  DEFAULT_STALE_TIME: 5 * 60 * 1000, // 5 minutes
  DEFAULT_CACHE_TIME: 10 * 60 * 1000, // 10 minutes

  // Specific cache times for different data types
  CURRENT_USER_STALE_TIME: 2 * 60 * 1000, // 2 minutes
  CURRENT_USER_CACHE_TIME: 5 * 60 * 1000, // 5 minutes

  USERS_STALE_TIME: 30 * 1000, // 30 seconds
  USERS_CACHE_TIME: 2 * 60 * 1000, // 2 minutes

  ROLES_STALE_TIME: 2 * 60 * 1000, // 2 minutes
  ROLES_CACHE_TIME: 5 * 60 * 1000, // 5 minutes

  PERMISSIONS_STALE_TIME: 5 * 60 * 1000, // 5 minutes
  PERMISSIONS_CACHE_TIME: 10 * 60 * 1000, // 10 minutes

  SYSTEM_STATUS_STALE_TIME: 10 * 1000, // 10 seconds
  SYSTEM_STATUS_CACHE_TIME: 30 * 1000, // 30 seconds
} as const;

// =============================================================================
// DEFAULT VALUES (Varsayılan Değerler)
// =============================================================================
export const DEFAULTS = {
  // Pagination
  PAGE_SIZE: 10,
  MAX_PAGE_SIZE: 100,

  // Session
  SESSION_DURATION_DAYS: 7,

  // Cache times (in milliseconds)
  CACHE_TIME: {
    SHORT: 1000 * 60 * 5, // 5 minutes
    MEDIUM: 1000 * 60 * 30, // 30 minutes
    LONG: 1000 * 60 * 60 * 24, // 24 hours
  },

  // Stale times (in milliseconds)
  STALE_TIME: {
    SHORT: 1000 * 60, // 1 minute
    MEDIUM: 1000 * 60 * 5, // 5 minutes
    LONG: 1000 * 60 * 30, // 30 minutes
  },
} as const;

// =============================================================================
// ERROR MESSAGES (Hata Mesajları)
// =============================================================================
export const ERROR_MESSAGES = {
  // Auth errors
  UNAUTHORIZED: "Yetkisiz erişim",
  FORBIDDEN: "Bu işlem için gerekli yetkiye sahip değilsiniz",
  INVALID_CREDENTIALS: "Geçersiz e-posta veya şifre",
  ACCOUNT_INACTIVE: "Hesabınız aktif değil",
  SESSION_EXPIRED: "Oturumunuz sona erdi, lütfen tekrar giriş yapın",

  // Validation errors
  REQUIRED_FIELD: "Bu alan gereklidir",
  INVALID_EMAIL: "Geçersiz e-posta adresi",
  PASSWORD_TOO_SHORT: "Şifre en az 6 karakter olmalıdır",
  PASSWORDS_DONT_MATCH: "Şifreler eşleşmiyor",
  EMAIL_ALREADY_EXISTS: "Bu e-posta adresi zaten kullanılıyor",

  // Network errors
  NETWORK_ERROR: "Ağ bağlantısı hatası",
  SERVER_ERROR: "Sunucu hatası",
  REQUEST_TIMEOUT: "İstek zaman aşımına uğradı",
  BAD_REQUEST: "Geçersiz istek",

  // Generic errors
  SOMETHING_WENT_WRONG: "Bir şeyler ters gitti",
  OPERATION_FAILED: "İşlem başarısız oldu",
  DATA_NOT_FOUND: "Veri bulunamadı",
  ACCESS_DENIED: "Erişim reddedildi",
} as const;

// =============================================================================
// SUCCESS MESSAGES (Başarı Mesajları)
// =============================================================================
export const SUCCESS_MESSAGES = {
  // Auth messages
  LOGIN_SUCCESS: "Başarıyla giriş yaptınız",
  LOGOUT_SUCCESS: "Başarıyla çıkış yaptınız",
  REGISTER_SUCCESS: "Hesabınız başarıyla oluşturuldu",
  PASSWORD_CHANGED: "Şifreniz başarıyla değiştirildi",

  // User messages
  USER_CREATED: "Kullanıcı başarıyla oluşturuldu",
  USER_UPDATED: "Kullanıcı bilgileri güncellendi",
  USER_DELETED: "Kullanıcı silindi",
  USER_STATUS_CHANGED: "Kullanıcı durumu değiştirildi",
  ROLE_ASSIGNED: "Rol başarıyla atandı",
  ROLE_REMOVED: "Rol kaldırıldı",

  // Role messages
  ROLE_CREATED: "Rol başarıyla oluşturuldu",
  ROLE_UPDATED: "Rol güncellendi",
  ROLE_DELETED: "Rol silindi",
  PERMISSIONS_UPDATED: "Yetkiler güncellendi",

  // Generic messages
  OPERATION_SUCCESS: "İşlem başarıyla tamamlandı",
  DATA_SAVED: "Veriler kaydedildi",
  CHANGES_SAVED: "Değişiklikler kaydedildi",
} as const;

// =============================================================================
// HTTP STATUS CODES (HTTP Durum Kodları)
// =============================================================================
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  INTERNAL_SERVER_ERROR: 500,
} as const;

// =============================================================================
// LOCAL STORAGE KEYS
// =============================================================================
export const STORAGE_KEYS = {
  AUTH_USER: "ecu_auth_user",
  THEME: "ecu_theme",
  SIDEBAR_STATE: "ecu_sidebar_state",
  LANGUAGE: "ecu_language",
  PREFERENCES: "ecu_preferences",
} as const;

// =============================================================================
// VALIDATION RULES
// =============================================================================
export const VALIDATION_RULES = {
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PASSWORD_MIN_LENGTH: 6,
  NAME_MIN_LENGTH: 2,
  NAME_MAX_LENGTH: 50,
  EMAIL_MAX_LENGTH: 255,
  DESCRIPTION_MAX_LENGTH: 500,
} as const;

// =============================================================================
// UI CONSTANTS
// =============================================================================
export const UI_CONSTANTS = {
  DEBOUNCE_DELAY: 300, // milliseconds
  ANIMATION_DURATION: 200, // milliseconds
  MODAL_ANIMATION_DURATION: 150, // milliseconds
  TOAST_ANIMATION_DURATION: 300, // milliseconds

  // Breakpoints (matching Tailwind CSS)
  BREAKPOINTS: {
    SM: 640,
    MD: 768,
    LG: 1024,
    XL: 1280,
    "2XL": 1536,
  },
} as const;

// =============================================================================
// FILE UPLOAD CONSTANTS
// =============================================================================
export const FILE_UPLOAD = {
  MAX_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_TYPES: ["image/jpeg", "image/png", "image/webp"] as const,
  ALLOWED_EXTENSIONS: [".jpg", ".jpeg", ".png", ".webp"] as const,
} as const;
