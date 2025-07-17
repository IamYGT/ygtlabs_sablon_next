import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  AdminProfile,
  ProfileFormData,
  ProfileUpdateResponse,
  ProfilePreferences,
} from "../types/profile.types";
import { QUERY_KEYS } from "@/lib/constants";

// Profile query
export const useProfile = () => {
  const queryClient = useQueryClient();

  const profileQuery = useQuery({
    queryKey: ["admin-profile"],
    queryFn: async (): Promise<AdminProfile> => {
      const response = await fetch("/api/admin/profile");
      if (!response.ok) {
        throw new Error("Failed to fetch profile");
      }
      return response.json();
    },
  });

  const updateProfileMutation = useMutation({
    mutationFn: async (
      data: ProfileFormData
    ): Promise<ProfileUpdateResponse> => {
      const response = await fetch("/api/admin/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to update profile");
      }

      return response.json();
    },
    onSuccess: (data) => {
      queryClient.setQueryData(["admin-profile"], data.data);
      toast.success(data.message || "Profile updated successfully");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update profile");
    },
  });

  return {
    profile: profileQuery.data,
    isLoading: profileQuery.isLoading,
    isError: profileQuery.isError,
    error: profileQuery.error,
    updateProfile: updateProfileMutation,
    isUpdating: updateProfileMutation.isPending,
  };
};

// Profile update mutation
export const useProfileUpdate = () => {
  const queryClient = useQueryClient();

  return useMutation<ProfileUpdateResponse, Error, ProfileFormData>({
    mutationFn: async (data: ProfileFormData) => {
      const response = await fetch("/api/admin/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Profil güncellenemedi");
      }

      return response.json();
    },
    onSuccess: (data) => {
      // Optimistic update
      queryClient.setQueryData<AdminProfile>(
        QUERY_KEYS.CURRENT_USER,
        (oldData) => (oldData ? { ...oldData, ...data.data } : data.data)
      );

      // Invalidate to refetch
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.CURRENT_USER });

      toast.success(data.message || "Profil başarıyla güncellendi");
    },
    onError: (error) => {
      toast.error(error.message || "Profil güncellenirken hata oluştu");
    },
  });
};

// Password change mutation
export const usePasswordChange = () => {
  return useMutation<
    { success: boolean; message: string },
    Error,
    {
      currentPassword: string;
      newPassword: string;
    }
  >({
    mutationFn: async (data) => {
      const response = await fetch("/api/admin/change-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Şifre değiştirilemedi");
      }

      return response.json();
    },
    onSuccess: (data) => {
      toast.success(data.message || "Şifre başarıyla değiştirildi");
    },
    onError: (error) => {
      toast.error(error.message || "Şifre değiştirilirken hata oluştu");
    },
  });
};

// Profile image upload mutation
export const useProfileImageUpload = () => {
  const queryClient = useQueryClient();

  return useMutation<
    { success: boolean; imageUrl: string; message: string },
    Error,
    File
  >({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append("image", file);

      const response = await fetch("/api/upload/profile-image", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Resim yüklenemedi");
      }

      return response.json();
    },
    onSuccess: (data) => {
      // Update profile with new image
      queryClient.setQueryData<AdminProfile>(
        QUERY_KEYS.CURRENT_USER,
        (oldData) =>
          oldData ? { ...oldData, profileImage: data.imageUrl } : oldData
      );

      toast.success(data.message || "Profil resmi başarıyla güncellendi");
    },
    onError: (error) => {
      toast.error(error.message || "Resim yüklenirken hata oluştu");
    },
  });
};

// Profile image remove mutation
export const useProfileImageRemove = () => {
  const queryClient = useQueryClient();

  return useMutation<{ success: boolean; message: string }, Error, void>({
    mutationFn: async () => {
      const response = await fetch("/api/upload/profile-image", {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Resim silinemedi");
      }

      return response.json();
    },
    onSuccess: (data) => {
      // Update profile by removing image
      queryClient.setQueryData<AdminProfile>(
        QUERY_KEYS.CURRENT_USER,
        (oldData) => (oldData ? { ...oldData, profileImage: null } : oldData)
      );

      toast.success(data.message || "Profil resmi başarıyla silindi");
    },
    onError: (error) => {
      toast.error(error.message || "Resim silinirken hata oluştu");
    },
  });
};

// Preferences update mutation
export const usePreferencesUpdate = () => {
  const queryClient = useQueryClient();

  return useMutation<{ success: boolean; message: string }, Error, ProfilePreferences>({
    mutationFn: async (preferences: ProfilePreferences) => {
      const response = await fetch("/api/admin/profile/preferences", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(preferences),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Tercihler güncellenemedi");
      }

      return response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.CURRENT_USER });
      toast.success(data.message || "Tercihler başarıyla güncellendi");
    },
    onError: (error) => {
      toast.error(error.message || "Tercihler güncellenirken hata oluştu");
    },
  });
};
