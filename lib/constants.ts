// Essential constants for Next.js 15.5 & TanStack Query

// AUTH ROUTES
export const AUTH_ROUTES = {
  LOGIN: "/auth/login",
  REGISTER: "/auth/register",
  FORBIDDEN: "/auth/forbidden",
  UNAUTHORIZED: "/auth/unauthorized",
  CUSTOMER_DASHBOARD: "/customer/dashboard",
  ADMIN_DASHBOARD: "/admin/dashboard",
} as const;

// API ENDPOINTS - Only the essentials
export const API_ENDPOINTS = {
  AUTH_LOGIN: "/api/auth/login",
  AUTH_LOGOUT: "/api/auth/logout",
  AUTH_REGISTER: "/api/auth/register",
  AUTH_CURRENT_USER: "/api/auth/current-user",
  AUTH_CHECK_PERMISSIONS: "/api/auth/check-permissions",
  
  ADMIN_USERS: "/api/admin/users",
  ADMIN_ROLES: "/api/admin/roles",
  ADMIN_PERMISSIONS: "/api/admin/permissions",
} as const;

// TANSTACK QUERY KEYS
export const QUERY_KEYS = {
  AUTH: ["auth"] as const,
  CURRENT_USER: ["auth", "currentUser"] as const,
  USER_PERMISSIONS: (userId: string) => ["auth", "permissions", userId] as const,
  USERS: ["users"] as const,
  ROLES: ["roles"] as const,
  PERMISSIONS: ["permissions"] as const,
} as const;


// ROLES
export const ROLES = {
  SUPER_ADMIN: "super_admin",
  ADMIN: "admin",
  CUSTOMER: "customer",
} as const;

// CACHE CONFIG for TanStack Query
export const CACHE_CONFIG = {
  DEFAULT_STALE_TIME: 0, // 0ms - anında stale
  DEFAULT_CACHE_TIME: 0, // 0ms - cache yok
} as const;

// DEFAULTS
export const DEFAULTS = {
  PAGE_SIZE: 10,
  MAX_PAGE_SIZE: 100,
  SESSION_DURATION_DAYS: 7,
} as const;

// NOTIFICATION CONFIG
export const NOTIFICATION_CONFIG = {
  DEFAULT_DURATION: 5000,
  SUCCESS_DURATION: 3000,
  ERROR_DURATION: 7000,
  WARNING_DURATION: 5000,
  INFO_DURATION: 4000,
  MAX_NOTIFICATIONS: 5,
} as const;

// STORAGE KEYS
export const STORAGE_KEYS = {
  AUTH_USER: "ecu_auth_user",
  THEME: "ecu_theme",
  SIDEBAR_STATE: "ecu_sidebar_state",
  PREFERENCES: "ecu_preferences",
} as const;

// ERROR MESSAGES
export const ERROR_MESSAGES = {
  UNAUTHORIZED: "Unauthorized",
  FORBIDDEN: "Forbidden",
  NETWORK_ERROR: "Network error",
  SERVER_ERROR: "Server error",
  REQUEST_TIMEOUT: "Request timeout",
  SOMETHING_WENT_WRONG: "Something went wrong",
} as const;
