/**
 * 🔐 Permission System Types
 *
 * Permission sistemi için TypeScript type tanımları
 */

import type { PermissionConfig, PermissionName } from "./config";

import type { UserWithPermissions } from "./helpers";

// Re-export main types from config for convenience (navigation removed)
export type {
  PermissionConfig,
  PermissionName,
  PermissionSyncObject,
} from "./config";

// Re-export helper types
export type { UserWithPermissions } from "./helpers";

// =============================================================================
// CORE PERMISSION TYPES
// =============================================================================

export type PermissionCategory = "layout" | "view" | "function";
export type PermissionType = "admin" | "user";
export type PermissionAction =
  | "access"
  | "view"
  | "create"
  | "read"
  | "update"
  | "delete"
  | "manage";

// =============================================================================
// ROLE SYSTEM TYPES
// =============================================================================

export interface RoleInfo {
  id: string;
  name: string;
  displayName: string;
  description?: string;
  color?: string;
  isSystemDefault: boolean;
  isActive: boolean;
  layoutType: "admin" | "user";
  createdAt: Date;
  updatedAt: Date;
}

export interface RolePermissionRelation {
  id: string;
  roleName: string;
  permissionName: string;
  isAllowed: boolean;
  isActive: boolean;
  conditions?: Record<string, unknown>;
  grantedAt: Date;
}

// =============================================================================
// USER PERMISSION TYPES
// =============================================================================

export interface UserPermissionContext {
  userId: string;
  roleId?: string;
  roleName?: string;
  permissions: string[];
  layoutType: "admin" | "user";
  isActive: boolean;
  sessionId?: string;
}

export interface PermissionCheckResult {
  hasPermission: boolean;
  permission: string;
  user: UserPermissionContext | null;
  reason?: string;
  timestamp: Date;
}

// =============================================================================
// VALIDATION TYPES
// =============================================================================

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
}

export interface ValidationError {
  type: "error";
  code: string;
  message: string;
  field?: string;
  value?: unknown;
}

export interface ValidationWarning {
  type: "warning";
  code: string;
  message: string;
  field?: string;
  suggestion?: string;
}

// =============================================================================
// SYNC TYPES
// =============================================================================

export interface SyncResult {
  success: boolean;
  permissionsCreated: number;
  permissionsUpdated: number;
  permissionsDeleted: number;
  errors: SyncError[];
  warnings: SyncWarning[];
  duration: number;
}

export interface SyncError {
  permission: string;
  operation: "create" | "update" | "delete";
  error: string;
  details?: unknown;
}

export interface SyncWarning {
  permission: string;
  operation: "create" | "update" | "delete";
  warning: string;
  suggestion?: string;
}

// =============================================================================
// NAVIGATION TYPES REMOVED
// =============================================================================
// Navigation types artık hooks/useAdminNavigation.ts'de yönetiliyor

// =============================================================================
// API RESPONSE TYPES
// =============================================================================

export interface PermissionAPIResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: unknown;
  };
  metadata?: {
    total?: number;
    page?: number;
    limit?: number;
    hasMore?: boolean;
  };
}

export interface PermissionListResponse {
  permissions: PermissionConfig[];
  total: number;
  categories: Record<PermissionCategory, number>;
  types: Record<PermissionType, number>;
}

// =============================================================================
// ANALYTICS TYPES
// =============================================================================

export interface PermissionUsageStats {
  total: number;
  layout: number;
  view: number;
  function: number;
  categories: {
    admin: number;
    user: number;
    other: number;
  };
}

export interface PermissionAnalytics {
  userStats: PermissionUsageStats;
  roleStats: Record<string, PermissionUsageStats>;
  popularPermissions: Array<{
    permission: string;
    usage: number;
    percentage: number;
  }>;
  unusedPermissions: string[];
}

// =============================================================================
// SESSION TYPES
// =============================================================================

export interface SessionValidationResult {
  isValid: boolean;
  user: UserWithPermissions | null;
  session?: {
    id: string;
    expiresAt: Date;
    lastActive: Date;
  };
  error?: string;
}

// =============================================================================
// MIDDLEWARE TYPES
// =============================================================================

export interface MiddlewarePermissionConfig {
  requiredPermission?: string;
  allowUnauthenticated?: boolean;
  redirectTo?: string;
  skipValidation?: boolean;
}

export interface PagePermissionRule {
  path: string;
  requiredPermission: string;
  exact?: boolean;
  children?: PagePermissionRule[];
}

// =============================================================================
// CLI TYPES
// =============================================================================

export interface CLICommandResult {
  success: boolean;
  message: string;
  details?: unknown;
  duration?: number;
}

export interface CLICommand {
  name: string;
  description: string;
  execute: () => Promise<CLICommandResult>;
}

// =============================================================================
// UTILITY TYPES
// =============================================================================

export type RequiredPermission<T> = T extends { requiredPermission: infer P }
  ? P
  : never;

export type PermissionMatch<T extends string> = T extends PermissionName
  ? T
  : never;

export type DeepReadonly<T> = {
  readonly [P in keyof T]: T[P] extends object ? DeepReadonly<T[P]> : T[P];
};
