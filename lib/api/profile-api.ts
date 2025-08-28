// Profile API client
import type { ApiResponse, SimpleUser } from "../types";

export const profileAPI = {
  uploadProfileImage: async (formData: FormData): Promise<ApiResponse<{ profileImage: string }>> => {
    try {
      const response = await fetch("/api/upload/profile-image", {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      const json: unknown = await response.json().catch(() => null);

      const extractMessage = (payload: unknown): string | undefined => {
        if (payload && typeof payload === "object") {
          const obj = payload as { error?: unknown; message?: unknown };
          return typeof obj.error === "string"
            ? obj.error
            : typeof obj.message === "string"
            ? obj.message
            : undefined;
        }
        return undefined;
      };

      if (!response.ok) {
        return {
          success: false,
          error: extractMessage(json) || `Error: ${response.status}`,
          data: null as never,
        };
      }

      const pickProfileImage = (payload: unknown): { profileImage: string } | null => {
        if (!payload || typeof payload !== "object") return null;
        const root = payload as { data?: unknown; profileImage?: unknown };
        if (root.data && typeof root.data === "object") {
          const data = root.data as { profileImage?: unknown };
          if (typeof data.profileImage === "string") {
            return { profileImage: data.profileImage };
          }
        }
        if (typeof root.profileImage === "string") {
          return { profileImage: root.profileImage };
        }
        return null;
      };

      const normalized = pickProfileImage(json);
      if (!normalized) {
        return {
          success: false,
          error: "Invalid response format",
          data: null as never,
        };
      }

      return {
        success: true,
        data: normalized,
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
      const response = await fetch("/api/upload/profile-image", {
        method: "DELETE",
        credentials: "include",
      });

      if (!response.ok) {
        const data: unknown = await response.json().catch(() => ({}));
        const message = (() => {
          if (data && typeof data === "object") {
            const o = data as { error?: unknown; message?: unknown };
            if (typeof o.error === "string") return o.error;
            if (typeof o.message === "string") return o.message;
          }
          return undefined;
        })();
        return {
          success: false,
          error: message || `Error: ${response.status}`,
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
