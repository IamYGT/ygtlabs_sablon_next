// Core API client for Next.js 15.5
// Sadece temel HTTP metodları - özel API'ler kendi dosyalarında olmalı

import type { ApiResponse } from "./types";

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

// Core API methods - sadece HTTP metodları
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
