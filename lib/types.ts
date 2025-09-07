// =============================================================================
// CORE APPLICATION TYPES
// =============================================================================
// Bu dosya sadece temel application type'larını içerir
// Permission system type'ları: lib/permissions/types.ts
// Component-specific type'lar: ilgili component dosyalarında

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
  currentRole?: {
    id: string;
    name: string;
    displayName: string;
    color?: string;
  };
  createdAt?: Date;
  lastLoginAt?: Date | null;
  power?: number;
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

// User management type'ları component'lerde spesifik olarak tanımlanıyor
// SimpleUser interface'i auth işlemleri için yeterli

// =============================================================================
// ROLE & PERMISSION TYPES MOVED TO lib/permissions/
// =============================================================================
// Role ve Permission type'ları artık lib/permissions/types.ts'de yönetiliyor
// import { type Role, type Permission } from '@/lib/permissions/types';

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

// Form type'ları component'lerde gerektiğinde tanımlanıyor
// Bu genel type'lar yerine spesifik form validation şemaları kullanılıyor

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
// PERMISSION TYPES MOVED TO lib/permissions/
// =============================================================================
// Permission type'ları artık lib/permissions/types.ts'de yönetiliyor
// import { type PermissionName } from '@/lib/permissions/types';

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
