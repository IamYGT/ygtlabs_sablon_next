// Simplified API client for TanStack Query & Next.js 15.5

import type { ApiResponse, SimpleUser } from "./types";

const baseURL = process.env.NEXT_PUBLIC_API_URL || "";

// Generic fetch wrapper
async function fetchAPI<T>(
  url: string,
  options?: RequestInit
): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(`${baseURL}${url}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
      credentials: "include",
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      return {
        success: false,
        error: data?.error || `Error: ${response.status}`,
        statusCode: response.status,
      };
    }

    return {
      success: true,
      data: data?.data || data,
      message: data?.message,
      statusCode: response.status,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Network error",
    };
  }
}

// API methods
export const api = {
  get: <T>(url: string) => fetchAPI<T>(url, { method: "GET" }),
  
  post: <T>(url: string, data?: unknown) =>
    fetchAPI<T>(url, {
      method: "POST",
      body: data ? JSON.stringify(data) : undefined,
    }),
  
  put: <T>(url: string, data?: unknown) =>
    fetchAPI<T>(url, {
      method: "PUT",
      body: data ? JSON.stringify(data) : undefined,
    }),
  
  patch: <T>(url: string, data?: unknown) =>
    fetchAPI<T>(url, {
      method: "PATCH",
      body: data ? JSON.stringify(data) : undefined,
    }),
  
  delete: <T>(url: string) => fetchAPI<T>(url, { method: "DELETE" }),
};

// Helper functions for response handling
export function isSuccess<T>(
  response: ApiResponse<T>
): response is ApiResponse<T> & { success: true } {
  return response.success === true;
}

export function getErrorMessage(response: ApiResponse<unknown>): string {
  return response.error || "An error occurred";
}

// Auth API shortcuts
export const authAPI = {
  login: (data: { email: string; password: string }) =>
    api.post("/api/auth/login", data),
  
  logout: () => api.post("/api/auth/logout"),
  
  register: (data: { name: string; email: string; password: string }) =>
    api.post("/api/auth/register", data),
  
  getCurrentUser: () => api.get("/api/auth/current-user"),
  
  checkPermissions: (permissions: string[]) =>
    api.post("/api/auth/check-permissions", { permissions }),
};

// Profile API for image upload
export const profileAPI = {
  uploadProfileImage: async (formData: FormData) => {
    try {
      const response = await fetch("/api/profile/upload", {
        method: "POST",
        body: formData,
        credentials: "include",
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        return {
          success: false,
          error: data?.error || `Error: ${response.status}`,
          data: null,
        };
      }
      
      return {
        success: true,
        data,
        error: undefined,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Network error",
        data: null,
      };
    }
  },

  deleteProfileImage: () =>
    fetchAPI("/api/profile/delete", {
      method: "DELETE",
    }),

  updateProfile: (data: Partial<SimpleUser>) =>
    fetchAPI<SimpleUser>("/api/profile", {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  getProfile: () => fetchAPI<SimpleUser>("/api/profile"),
};
