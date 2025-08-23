// Profile API client
import type { ApiResponse, SimpleUser } from "../types";

export const profileAPI = {
  uploadProfileImage: async (formData: FormData): Promise<ApiResponse<{ profileImage: string }>> => {
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
          data: null as never,
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
        data: null as never,
      };
    }
  },

  deleteProfileImage: async (): Promise<ApiResponse<void>> => {
    try {
      const response = await fetch("/api/profile/delete", {
        method: "DELETE",
        credentials: "include",
      });
      
      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        return {
          success: false,
          error: data?.error || `Error: ${response.status}`,
        };
      }
      
      return {
        success: true,
        data: undefined,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Network error",
      };
    }
  },

  updateProfile: async (data: Partial<SimpleUser>): Promise<ApiResponse<SimpleUser>> => {
    try {
      const response = await fetch("/api/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
        credentials: "include",
      });
      
      const responseData = await response.json();
      
      if (!response.ok) {
        return {
          success: false,
          error: responseData?.error || `Error: ${response.status}`,
          data: null as never,
        };
      }
      
      return {
        success: true,
        data: responseData,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Network error",
        data: null as never,
      };
    }
  },

  getProfile: async (): Promise<ApiResponse<SimpleUser>> => {
    try {
      const response = await fetch("/api/profile", {
        method: "GET",
        credentials: "include",
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        return {
          success: false,
          error: data?.error || `Error: ${response.status}`,
          data: null as never,
        };
      }
      
      return {
        success: true,
        data,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Network error",
        data: null as never,
      };
    }
  },
};
