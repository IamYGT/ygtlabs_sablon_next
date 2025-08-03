// =============================================================================
// MODERN API CLIENT - TanStack Query Optimized
// =============================================================================

import { API_ENDPOINTS, ERROR_MESSAGES } from "./constants";
import type { ApiResponse } from "./types";

// API client için inline type tanımları
interface CreateUserData {
  name: string;
  email: string;
  password: string;
  roleId?: string;
  isActive?: boolean;
  profileImage?: string;
}

interface UpdateUserData {
  id: string;
  name?: string;
  email?: string;
  password?: string;
  roleId?: string;
  isActive?: boolean;
  profileImage?: string;
}

interface CreateRoleData {
  name: string;
  displayName: string;
  description?: string;
  color?: string;
  layoutType?: string;
  permissionIds?: string[];
}

interface UpdateRoleData {
  id: string;
  name?: string;
  displayName?: string;
  description?: string;
  color?: string;
  layoutType?: string;
  permissionIds?: string[];
}

interface Permission {
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

// =============================================================================
// ENHANCED API CLIENT CLASS
// =============================================================================
class ModernAPIClient {
  private baseURL: string;

  constructor() {
    this.baseURL = process.env.NEXT_PUBLIC_API_URL || "";
  }

  // =============================================================================
  // ENHANCED RESPONSE HANDLER
  // =============================================================================
  private async handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
    const contentType = response.headers.get("content-type");
    const isJSON = contentType?.includes("application/json");

    let data;
    try {
      data = isJSON ? await response.json() : await response.text();
    } catch (error) {
      console.error("❌ Response parsing error:", error);
      return {
        success: false,
        error: ERROR_MESSAGES.NETWORK_ERROR,
      };
    }

    if (!response.ok) {
      const errorMessage =
        data?.error ||
        data?.message ||
        this.getStatusErrorMessage(response.status);

      // 401 hatalarını konsola yazmayalım - bu standart bir durum
      if (response.status !== 401) {
        console.error(`❌ API Error [${response.status}]:`, errorMessage);
      }

      return {
        success: false,
        error: errorMessage,
        data: data?.data,
        statusCode: response.status,
      };
    }

    console.log(`✅ API Success [${response.status}]:`, response.url);
    return {
      success: true,
      data: data?.data || data,
      message: data?.message,
      statusCode: response.status,
    };
  }

  private getStatusErrorMessage(status: number): string {
    switch (status) {
      case 400:
        return ERROR_MESSAGES.BAD_REQUEST || "Geçersiz istek";
      case 401:
        return ERROR_MESSAGES.UNAUTHORIZED;
      case 403:
        return ERROR_MESSAGES.FORBIDDEN;
      case 404:
        return ERROR_MESSAGES.DATA_NOT_FOUND;
      case 409:
        return "Çakışma hatası";
      case 422:
        return "Doğrulama hatası";
      case 500:
        return ERROR_MESSAGES.SERVER_ERROR;
      default:
        return ERROR_MESSAGES.SOMETHING_WENT_WRONG;
    }
  }

  private getHeaders(): HeadersInit {
    return {
      "Content-Type": "application/json",
      "X-Requested-With": "XMLHttpRequest",
    };
  }

  // =============================================================================
  // OPTIMIZED HTTP METHODS
  // =============================================================================

  async get<T>(
    url: string,
    options?: { timeout?: number }
  ): Promise<ApiResponse<T>> {
    const controller = new AbortController();
    const timeoutId = options?.timeout
      ? setTimeout(() => controller.abort(), options.timeout)
      : null;

    try {
      const response = await fetch(`${this.baseURL}${url}`, {
        method: "GET",
        headers: this.getHeaders(),
        credentials: "include",
        signal: controller.signal,
      });

      return this.handleResponse<T>(response);
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") {
        console.error("⏱️ Request timeout:", url);
        return { success: false, error: ERROR_MESSAGES.REQUEST_TIMEOUT };
      }
      console.error("❌ GET request error:", error);
      return { success: false, error: ERROR_MESSAGES.NETWORK_ERROR };
    } finally {
      if (timeoutId) clearTimeout(timeoutId);
    }
  }

  async post<T>(
    url: string,
    data?: unknown,
    options?: { timeout?: number }
  ): Promise<ApiResponse<T>> {
    const controller = new AbortController();
    const timeoutId = options?.timeout
      ? setTimeout(() => controller.abort(), options.timeout)
      : null;

    try {
      const response = await fetch(`${this.baseURL}${url}`, {
        method: "POST",
        headers: this.getHeaders(),
        credentials: "include",
        body: data ? JSON.stringify(data) : undefined,
        signal: controller.signal,
      });

      return this.handleResponse<T>(response);
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") {
        console.error("⏱️ Request timeout:", url);
        return { success: false, error: ERROR_MESSAGES.REQUEST_TIMEOUT };
      }
      console.error("❌ POST request error:", error);
      return { success: false, error: ERROR_MESSAGES.NETWORK_ERROR };
    } finally {
      if (timeoutId) clearTimeout(timeoutId);
    }
  }

  async put<T>(url: string, data?: unknown): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${this.baseURL}${url}`, {
        method: "PUT",
        headers: this.getHeaders(),
        credentials: "include",
        body: data ? JSON.stringify(data) : undefined,
      });

      return this.handleResponse<T>(response);
    } catch (error) {
      console.error("❌ PUT request error:", error);
      return { success: false, error: ERROR_MESSAGES.NETWORK_ERROR };
    }
  }

  async patch<T>(url: string, data?: unknown): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${this.baseURL}${url}`, {
        method: "PATCH",
        headers: this.getHeaders(),
        credentials: "include",
        body: data ? JSON.stringify(data) : undefined,
      });

      return this.handleResponse<T>(response);
    } catch (error) {
      console.error("❌ PATCH request error:", error);
      return { success: false, error: ERROR_MESSAGES.NETWORK_ERROR };
    }
  }

  async delete<T>(url: string): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${this.baseURL}${url}`, {
        method: "DELETE",
        headers: this.getHeaders(),
        credentials: "include",
      });

      return this.handleResponse<T>(response);
    } catch (error) {
      console.error("❌ DELETE request error:", error);
      return { success: false, error: ERROR_MESSAGES.NETWORK_ERROR };
    }
  }

  async upload<T>(url: string, formData: FormData): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${this.baseURL}${url}`, {
        method: "POST",
        // "Content-Type" header'ı kasıtlı olarak ayarlanmadı.
        // Tarayıcı, FormData ile birlikte doğru `boundary` ile ayarlar.
        headers: {
          "X-Requested-With": "XMLHttpRequest",
        },
        credentials: "include",
        body: formData,
      });

      return this.handleResponse<T>(response);
    } catch (error) {
      console.error("❌ Upload request error:", error);
      return { success: false, error: ERROR_MESSAGES.NETWORK_ERROR };
    }
  }
}

// =============================================================================
// SINGLETON API CLIENT
// =============================================================================
export const apiClient = new ModernAPIClient();

// =============================================================================
// ORGANIZED API FUNCTIONS
// =============================================================================

// Helper function to get current locale (removed - not needed anymore)

// Helper function to create locale-aware endpoints (removed - not needed for API routes)

// Auth API functions
export const authAPI = {
  login: (data: { email: string; password: string }) =>
    apiClient.post(API_ENDPOINTS.AUTH_LOGIN, data),

  logout: (logoutAllSessions = false) =>
    apiClient.post(API_ENDPOINTS.AUTH_LOGOUT, {
      logoutAllSessions,
    }),

  getCurrentUser: () => apiClient.get(API_ENDPOINTS.AUTH_CURRENT_USER),

  checkPermissions: (permissions: string[]) =>
    apiClient.post(API_ENDPOINTS.AUTH_CHECK_PERMISSIONS, { permissions }),
} as const;

// Users API functions
export const usersAPI = {
  getUsers: (params?: Record<string, string | number | boolean>) => {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          searchParams.append(key, String(value));
        }
      });
    }
    const url = `${API_ENDPOINTS.ADMIN_USERS}?${searchParams}`;
    return apiClient.get(url);
  },

  getUserById: (id: string) => apiClient.get(API_ENDPOINTS.USER_BY_ID(id)),

  createUser: (data: CreateUserData) =>
    apiClient.post(`${API_ENDPOINTS.ADMIN_USERS}/create`, data),

  updateUser: (id: string, data: Partial<UpdateUserData>) =>
    apiClient.put(`${API_ENDPOINTS.ADMIN_USERS}/update`, { id, ...data }),

  deleteUser: (id: string) =>
    apiClient.delete(`${API_ENDPOINTS.ADMIN_USERS}/delete?id=${id}`),

  toggleUserStatus: (id: string) =>
    apiClient.post(`${API_ENDPOINTS.ADMIN_USERS}/toggle-status`, { id }),

  assignRole: (userId: string, roleId: string) =>
    apiClient.post(`${API_ENDPOINTS.ADMIN_USERS}/assign-role`, {
      userId,
      roleId,
    }),

  removeRole: (userId: string) =>
    apiClient.post(`${API_ENDPOINTS.ADMIN_USERS}/remove-role`, { userId }),

  bulkDelete: (userIds: string[]) =>
    apiClient.post(`${API_ENDPOINTS.ADMIN_USERS}/bulk-delete`, { userIds }),
} as const;

// Roles API functions
export const rolesAPI = {
  getRoles: (params?: Record<string, string | number | boolean>) => {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          searchParams.append(key, String(value));
        }
      });
    }
    const url = `${API_ENDPOINTS.ADMIN_ROLES}?${searchParams}`;
    return apiClient.get(url);
  },

  getRoleById: (id: string) => apiClient.get(API_ENDPOINTS.ROLE_BY_ID(id)),

  createRole: (data: CreateRoleData) =>
    apiClient.post(`${API_ENDPOINTS.ADMIN_ROLES}/create`, data),

  updateRole: (id: string, data: Partial<UpdateRoleData>) =>
    apiClient.put(`${API_ENDPOINTS.ADMIN_ROLES}/${id}/update`, data),

  deleteRole: (id: string) =>
    apiClient.delete(`${API_ENDPOINTS.ADMIN_ROLES}/${id}/delete`),

  getRolePermissions: (roleId: string) =>
    apiClient.get(`${API_ENDPOINTS.ADMIN_ROLES}/${roleId}/permissions`),

  updateRolePermissions: (roleId: string, permissionIds: string[]) =>
    apiClient.put(`${API_ENDPOINTS.ADMIN_ROLES}/${roleId}/permissions`, {
      permissionIds,
    }),
} as const;

// Permissions API functions
export const permissionsAPI = {
  getPermissions: (params?: Record<string, string | number | boolean>) => {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          searchParams.append(key, String(value));
        }
      });
    }
    const url = `${API_ENDPOINTS.ADMIN_PERMISSIONS}?${searchParams}`;
    return apiClient.get(url);
  },

  getAvailablePermissions: () =>
    apiClient.get(`${API_ENDPOINTS.ADMIN_PERMISSIONS}/available`),

  getPermissionById: (id: string) =>
    apiClient.get(API_ENDPOINTS.PERMISSION_BY_ID(id)),

  createPermission: (data: Omit<Permission, "id">) =>
    apiClient.post(API_ENDPOINTS.ADMIN_PERMISSIONS, data),

  updatePermission: (id: string, data: Partial<Permission>) =>
    apiClient.put(API_ENDPOINTS.PERMISSION_BY_ID(id), data),

  deletePermission: (id: string) =>
    apiClient.delete(API_ENDPOINTS.PERMISSION_BY_ID(id)),
} as const;

// Profile API functions
export const profileAPI = {
  uploadProfileImage: (formData: FormData) =>
    apiClient.upload(API_ENDPOINTS.UPLOAD_PROFILE_IMAGE, formData),

  deleteProfileImage: () =>
    apiClient.delete(API_ENDPOINTS.UPLOAD_PROFILE_IMAGE),
} as const;

// =============================================================================
// ENHANCED HELPER FUNCTIONS
// =============================================================================

// Type-safe success checker
export const isSuccess = <T>(
  response: ApiResponse<T>
): response is ApiResponse<T> & { success: true; data: T } => {
  return response.success;
};

// Enhanced error message extractor
export const getErrorMessage = (response: ApiResponse<unknown>): string => {
  return response.error || ERROR_MESSAGES.SOMETHING_WENT_WRONG;
};

// Safe data extractor
export const getData = <T>(response: ApiResponse<T>): T | undefined => {
  return isSuccess(response) ? response.data : undefined;
};

// Status code checker
export const isClientError = (response: ApiResponse<unknown>): boolean => {
  return (
    response.statusCode !== undefined &&
    response.statusCode >= 400 &&
    response.statusCode < 500
  );
};

export const isServerError = (response: ApiResponse<unknown>): boolean => {
  return response.statusCode !== undefined && response.statusCode >= 500;
};

// =============================================================================
// TANSTACK QUERY INTEGRATION HELPERS
// =============================================================================

// Query key factories for better cache management
export const queryKeys = {
  auth: {
    all: ["auth"] as const,
    currentUser: () => [...queryKeys.auth.all, "currentUser"] as const,
    permissions: (userId?: string) =>
      [...queryKeys.auth.all, "permissions", userId] as const,
  },
  users: {
    all: ["users"] as const,
    lists: () => [...queryKeys.users.all, "list"] as const,
    list: (filters?: Record<string, unknown>) =>
      [...queryKeys.users.lists(), filters] as const,
    details: () => [...queryKeys.users.all, "detail"] as const,
    detail: (id: string) => [...queryKeys.users.details(), id] as const,
  },
  roles: {
    all: ["roles"] as const,
    lists: () => [...queryKeys.roles.all, "list"] as const,
    list: (filters?: Record<string, unknown>) =>
      [...queryKeys.roles.lists(), filters] as const,
    details: () => [...queryKeys.roles.all, "detail"] as const,
    detail: (id: string) => [...queryKeys.roles.details(), id] as const,
    permissions: (roleId: string) =>
      [...queryKeys.roles.detail(roleId), "permissions"] as const,
  },
  permissions: {
    all: ["permissions"] as const,
    lists: () => [...queryKeys.permissions.all, "list"] as const,
    available: () => [...queryKeys.permissions.all, "available"] as const,
  },
} as const;
