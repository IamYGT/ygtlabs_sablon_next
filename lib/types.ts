// =============================================================================
// BASIT TYPE TANIMLARI - Junior Developer İçin Kolay Anlaşılır
// =============================================================================

// =============================================================================
// MODERN TYPE DEFINITIONS FOR ZUSTAND + TANSTACK QUERY
// Simplified types for junior developers
// =============================================================================

// =============================================================================
// AUTH TYPES (Temel Kimlik Doğrulama)
// =============================================================================

export interface SimpleUser {
  id: string;
  name: string | null;
  email: string | null;
  profileImage: string | null;
  isActive: boolean;
  roleId?: string | null;
  roleAssignedAt?: Date | null;
  permissions: string[];
  userRoles: string[];
  primaryRole?: string;
  createdAt?: Date;
  lastLoginAt?: Date | null;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  error?: string;
  user?: SimpleUser;
  sessionToken?: string;
}

// =============================================================================
// API RESPONSE TYPES (API Yanıtları)
// =============================================================================

export interface ApiResponse<T = unknown> {
  success: boolean;
  error?: string;
  data?: T;
  message?: string;
  statusCode?: number;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  error?: string;
}

// =============================================================================
// USER MANAGEMENT TYPES (Kullanıcı Yönetimi)
// =============================================================================

export interface UserWithRole {
  id: string;
  name: string | null;
  email: string | null;
  isActive: boolean;
  profileImage: string | null;
  createdAt: Date;
  lastLoginAt: Date | null;
  roles: Array<{
    id: string;
    name: string;
    displayName: string;
  }>;
}

export interface CreateUserData {
  name: string;
  email: string;
  password: string;
  roleId?: string;
  isActive?: boolean;
  profileImage?: string;
}

export interface UpdateUserData {
  id: string;
  name?: string;
  email?: string;
  password?: string;
  roleId?: string;
  isActive?: boolean;
  profileImage?: string;
}

// =============================================================================
// ROLE & PERMISSION TYPES (Rol ve Yetki)
// =============================================================================

export interface Role {
  id: string;
  name: string;
  displayName: string;
  description?: string;
  color?: string;
  isActive: boolean;
  layoutType: string;
  userCount?: number;
  permissions?: Permission[];
}

export interface Permission {
  id: string;
  name: string;
  displayName: string;
  description?: string;
  category: string;
  resourcePath: string;
  action: string;
  permissionType: string;
  isActive: boolean;
}

export interface CreateRoleData {
  name: string;
  displayName: string;
  description?: string;
  color?: string;
  layoutType?: string;
  permissionIds?: string[];
}

export interface UpdateRoleData {
  id: string;
  name?: string;
  displayName?: string;
  description?: string;
  color?: string;
  layoutType?: string;
  permissionIds?: string[];
}

// =============================================================================
// UI STATE TYPES (Arayüz Durumları)
// =============================================================================

export interface LoadingState {
  [key: string]: boolean;
}

export interface ModalState {
  isOpen: boolean;
  type?: string;
  data?: unknown;
}

export interface NotificationState {
  id: string;
  type: "success" | "error" | "warning" | "info";
  title: string;
  message?: string;
  duration?: number;
  createdAt: Date;
}

// =============================================================================
// FORM TYPES (Form Verileri)
// =============================================================================

export interface LoginFormData {
  email: string;
  password: string;
}

export interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface ChangePasswordFormData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface UserFormData {
  name: string;
  email: string;
  password?: string;
  roleId?: string;
  isActive: boolean;
}

export interface RoleFormData {
  name: string;
  displayName: string;
  description?: string;
  color?: string;
  layoutType: string;
  permissionIds: string[];
}

// =============================================================================
// FILTER & SEARCH TYPES (Filtreleme ve Arama)
// =============================================================================

export interface UserFilters {
  search?: string;
  page?: number;
  limit?: number;
  isActive?: boolean;
  roleId?: string;
  [key: string]: unknown;
}

// =============================================================================
// PERMISSION CHECK TYPES (Yetki Kontrolleri)
// =============================================================================

export const PERMISSION_NAMES = {
  // Layout permissions
  LAYOUT_ADMIN_ACCESS: "layout.admin.access",
  LAYOUT_USER_ACCESS: "layout.user.access",

  // View permissions
  VIEW_ADMIN_DASHBOARD: "view./admin/dashboard.view",
  VIEW_ADMIN_USERS: "view./admin/users.view",
  VIEW_ADMIN_ROLES: "view./admin/roles.view",
  VIEW_ADMIN_PERMISSIONS: "view./admin/permissions.view",

  // Function permissions
  FUNCTION_USERS_CREATE: "function.users.create",
  FUNCTION_USERS_EDIT: "function.users.edit",
  FUNCTION_USERS_DELETE: "function.users.delete",
  FUNCTION_USERS_VIEW: "function.users.view",

  FUNCTION_ROLES_CREATE: "function.roles.create",
  FUNCTION_ROLES_EDIT: "function.roles.edit",
  FUNCTION_ROLES_DELETE: "function.roles.delete",
  FUNCTION_ROLES_VIEW: "function.roles.view",

  FUNCTION_PERMISSIONS_CREATE: "function.permissions.create",
  FUNCTION_PERMISSIONS_EDIT: "function.permissions.edit",
  FUNCTION_PERMISSIONS_DELETE: "function.permissions.delete",
  FUNCTION_PERMISSIONS_VIEW: "function.permissions.view",
} as const;

export type PermissionName =
  (typeof PERMISSION_NAMES)[keyof typeof PERMISSION_NAMES];

// =============================================================================
// ERROR TYPES
// =============================================================================

export interface AppError extends Error {
  code?: string;
  statusCode?: number;
  details?: unknown;
}

export interface ValidationError extends AppError {
  field?: string;
  validation?: string;
}

// =============================================================================
// UTILITY TYPES
// =============================================================================

export type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };
export type XOR<T, U> = T | U extends object
  ? (Without<T, U> & U) | (Without<U, T> & T)
  : T | U;

export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
export type Required<T, K extends keyof T> = T & { [P in K]-?: T[P] };

// =============================================================================
// COMPONENT PROP TYPES
// =============================================================================

export interface BaseComponentProps {
  className?: string;
  children?: React.ReactNode;
}

export interface TableProps<T> extends BaseComponentProps {
  data: T[];
  columns: Array<{
    key: keyof T;
    label: string;
    render?: (value: unknown, item: T) => React.ReactNode;
  }>;
  loading?: boolean;
  onRowClick?: (item: T) => void;
}

export interface FormProps<T> extends BaseComponentProps {
  initialData?: Partial<T>;
  onSubmit: (data: T) => void | Promise<void>;
  loading?: boolean;
  error?: string;
}

// =============================================================================
// HOOK RETURN TYPES
// =============================================================================

export interface UseAuthReturn {
  user: SimpleUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (data: LoginData) => Promise<void>;
  logout: () => Promise<void>;
  hasPermission: (permission: string) => boolean;
  hasAnyPermission: (permissions: string[]) => boolean;
  isAdmin: boolean;
  isSuperAdmin: boolean;
}

export interface UsePaginationReturn<T> {
  data: T[];
  loading: boolean;
  error: string | null;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  setPage: (page: number) => void;
  setLimit: (limit: number) => void;
  refetch: () => void;
}
