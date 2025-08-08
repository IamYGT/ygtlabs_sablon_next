"use client";

// =============================================================================
// USERS HOOKS - Enhanced TanStack Query User Management Hooks
// =============================================================================

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React from "react";
import { queryKeys, usersAPI } from "../api-client";
import { CACHE_CONFIG, DEFAULTS } from "../constants";
import { useUIStore } from "../stores/ui-store";
import type { PaginatedResponse, UserFilters } from "../types";
import { useTranslations } from "next-intl";

// Hook için inline type tanımları
interface UserWithRole {
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

// =============================================================================
// ENHANCED USER LIST QUERY
// =============================================================================
export function useUsers(filters: UserFilters = {}) {
  return useQuery({
    queryKey: queryKeys.users.list(filters),
    queryFn: async () => {
      const response = await usersAPI.getUsers({
        page: filters.page || 1,
        limit: filters.limit || DEFAULTS.PAGE_SIZE,
        search: filters.search || "",
        roleId: filters.roleId || "",
        ...(filters.isActive !== undefined && { isActive: filters.isActive }),
      });

      if (!response.success) {
        throw new Error(response.error || "Failed to fetch users");
      }

      return response.data as PaginatedResponse<UserWithRole>;
    },
    staleTime: CACHE_CONFIG.USERS_STALE_TIME,
    gcTime: CACHE_CONFIG.USERS_CACHE_TIME,
    enabled: true,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
  });
}

// =============================================================================
// ENHANCED SINGLE USER QUERY
// =============================================================================
export function useUser(userId: string, enabled = true) {
  return useQuery({
    queryKey: queryKeys.users.detail(userId),
    queryFn: async () => {
      const response = await usersAPI.getUserById(userId);

      if (!response.success) {
        throw new Error(response.error || "Failed to fetch user");
      }

      return response.data as UserWithRole;
    },
    staleTime: CACHE_CONFIG.DEFAULT_STALE_TIME,
    gcTime: CACHE_CONFIG.DEFAULT_CACHE_TIME,
    enabled: enabled && !!userId,
    refetchOnWindowFocus: false,
  });
}

// =============================================================================
// ENHANCED CREATE USER MUTATION
// =============================================================================
export function useCreateUser() {
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useUIStore();
  const t = useTranslations('AdminUsers');

  return useMutation({
    mutationFn: async (data: CreateUserData) => {
      const response = await usersAPI.createUser(data);

      if (!response.success) {
        throw new Error(response.error || "Failed to create user");
      }

      return response.data as UserWithRole;
    },
    onSuccess: (newUser) => {
      // Invalidate and refetch users list
      queryClient.invalidateQueries({ queryKey: queryKeys.users.lists() });

      // Optimistically update cache if possible
      const existingQueries = queryClient.getQueriesData({
        queryKey: queryKeys.users.lists(),
      });

      existingQueries.forEach(([queryKey, data]) => {
        if (data && typeof data === "object" && "data" in data) {
          const paginatedData = data as PaginatedResponse<UserWithRole>;
          queryClient.setQueryData(queryKey, {
            ...paginatedData,
            data: [newUser, ...paginatedData.data.slice(0, -1)], // Replace last item to maintain page size
            pagination: {
              ...paginatedData.pagination,
              total: paginatedData.pagination.total + 1,
            },
          });
        }
      });

      // Set individual user cache
      queryClient.setQueryData(queryKeys.users.detail(newUser.id), newUser);

      showSuccess(t('createUser.successMessage'));
    },
    onError: (error: Error) => {
      console.error("❌ Create user error:", error);
      showError(error.message);
    },
  });
}

// =============================================================================
// ENHANCED UPDATE USER MUTATION
// =============================================================================
export function useUpdateUser() {
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useUIStore();
  const t = useTranslations('AdminUsers');

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateUserData }) => {
      const response = await usersAPI.updateUser(id, data);

      if (!response.success) {
        throw new Error(response.error || "Failed to update user");
      }

      return response.data as UserWithRole;
    },
    onSuccess: (updatedUser, { id }) => {
      // Update individual user cache
      queryClient.setQueryData(queryKeys.users.detail(id), updatedUser);

      // Update user in all list caches
      queryClient.setQueriesData(
        { queryKey: queryKeys.users.lists() },
        (oldData: unknown) => {
          if (oldData && typeof oldData === "object" && "data" in oldData) {
            const paginatedData = oldData as PaginatedResponse<UserWithRole>;
            return {
              ...paginatedData,
              data: paginatedData.data.map((user) =>
                user.id === id ? updatedUser : user
              ),
            };
          }
          return oldData;
        }
      );

      showSuccess(t('messages.updateSuccess'));
    },
    onError: (error: Error) => {
      console.error("❌ Update user error:", error);
      showError(error.message);
    },
  });
}

// =============================================================================
// ENHANCED DELETE USER MUTATION
// =============================================================================
export function useDeleteUser() {
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useUIStore();
  const t = useTranslations('AdminUsers');

  return useMutation({
    mutationFn: async (userId: string) => {
      const response = await usersAPI.deleteUser(userId);

      if (!response.success) {
        throw new Error(response.error || "Failed to delete user");
      }

      return userId;
    },
    onSuccess: (deletedUserId) => {
      // Remove user from individual cache
      queryClient.removeQueries({
        queryKey: queryKeys.users.detail(deletedUserId),
      });

      // Update all list caches
      queryClient.setQueriesData(
        { queryKey: queryKeys.users.lists() },
        (oldData: unknown) => {
          if (oldData && typeof oldData === "object" && "data" in oldData) {
            const paginatedData = oldData as PaginatedResponse<UserWithRole>;
            return {
              ...paginatedData,
              data: paginatedData.data.filter(
                (user) => user.id !== deletedUserId
              ),
              pagination: {
                ...paginatedData.pagination,
                total: Math.max(0, paginatedData.pagination.total - 1),
              },
            };
          }
          return oldData;
        }
      );

      showSuccess(t('messages.deleteSuccess'));
    },
    onError: (error: Error) => {
      console.error("❌ Delete user error:", error);
      showError(error.message);
    },
  });
}

// =============================================================================
// ENHANCED TOGGLE USER STATUS MUTATION
// =============================================================================
export function useToggleUserStatus() {
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useUIStore();
  const t = useTranslations('AdminUsers');

  return useMutation({
    mutationFn: async (userId: string) => {
      const response = await usersAPI.toggleUserStatus(userId);

      if (!response.success) {
        throw new Error(response.error || "Failed to toggle user status");
      }

      return response.data as UserWithRole;
    },
    onSuccess: (updatedUser) => {
      // Update individual user cache
      queryClient.setQueryData(
        queryKeys.users.detail(updatedUser.id),
        updatedUser
      );

      // Update user in all list caches
      queryClient.setQueriesData(
        { queryKey: queryKeys.users.lists() },
        (oldData: unknown) => {
          if (oldData && typeof oldData === "object" && "data" in oldData) {
            const paginatedData = oldData as PaginatedResponse<UserWithRole>;
            return {
              ...paginatedData,
              data: paginatedData.data.map((user) =>
                user.id === updatedUser.id ? updatedUser : user
              ),
            };
          }
          return oldData;
        }
      );

      const statusText = updatedUser.isActive
        ? "aktifleştirildi"
        : "devre dışı bırakıldı";
      showSuccess(t('messages.statusUpdateSuccess'));
    },
    onError: (error: Error) => {
      console.error("❌ Toggle user status error:", error);
      showError(error.message);
    },
  });
}

// =============================================================================
// ENHANCED ROLE MANAGEMENT MUTATIONS
// =============================================================================
export function useAssignRole() {
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useUIStore();
  const t = useTranslations('AdminUsers');

  return useMutation({
    mutationFn: async ({
      userId,
      roleId,
    }: {
      userId: string;
      roleId: string;
    }) => {
      const response = await usersAPI.assignRole(userId, roleId);

      if (!response.success) {
        throw new Error(response.error || "Failed to assign role");
      }

      return response.data as UserWithRole;
    },
    onSuccess: (updatedUser) => {
      // Update caches
      queryClient.setQueryData(
        queryKeys.users.detail(updatedUser.id),
        updatedUser
      );

      queryClient.setQueriesData(
        { queryKey: queryKeys.users.lists() },
        (oldData: unknown) => {
          if (oldData && typeof oldData === "object" && "data" in oldData) {
            const paginatedData = oldData as PaginatedResponse<UserWithRole>;
            return {
              ...paginatedData,
              data: paginatedData.data.map((user) =>
                user.id === updatedUser.id ? updatedUser : user
              ),
            };
          }
          return oldData;
        }
      );

      showSuccess(t('actionsCell.roleAssignSuccess'));
    },
    onError: (error: Error) => {
      console.error("❌ Assign role error:", error);
      showError(error.message);
    },
  });
}

export function useRemoveRole() {
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useUIStore();
  const t = useTranslations('AdminUsers');

  return useMutation({
    mutationFn: async (userId: string) => {
      const response = await usersAPI.removeRole(userId);

      if (!response.success) {
        throw new Error(response.error || "Failed to remove role");
      }

      return response.data as UserWithRole;
    },
    onSuccess: (updatedUser) => {
      // Update caches
      queryClient.setQueryData(
        queryKeys.users.detail(updatedUser.id),
        updatedUser
      );

      queryClient.setQueriesData(
        { queryKey: queryKeys.users.lists() },
        (oldData: unknown) => {
          if (oldData && typeof oldData === "object" && "data" in oldData) {
            const paginatedData = oldData as PaginatedResponse<UserWithRole>;
            return {
              ...paginatedData,
              data: paginatedData.data.map((user) =>
                user.id === updatedUser.id ? updatedUser : user
              ),
            };
          }
          return oldData;
        }
      );

      showSuccess(t('actionsCell.roleRemoveSuccess'));
    },
    onError: (error: Error) => {
      console.error("❌ Remove role error:", error);
      showError(error.message);
    },
  });
}

// =============================================================================
// ENHANCED BULK OPERATIONS
// =============================================================================
export function useBulkDeleteUsers() {
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useUIStore();
  const t = useTranslations('AdminUsers');

  return useMutation({
    mutationFn: async (userIds: string[]) => {
      const response = await usersAPI.bulkDelete(userIds);

      if (!response.success) {
        throw new Error(response.error || "Failed to delete users");
      }

      return {
        successful: userIds.length,
        total: userIds.length,
        deletedIds: userIds,
      };
    },
    onSuccess: (result) => {
      // Remove users from individual caches
      result.deletedIds.forEach((userId) => {
        queryClient.removeQueries({
          queryKey: queryKeys.users.detail(userId),
        });
      });

      // Update all list caches
      queryClient.setQueriesData(
        { queryKey: queryKeys.users.lists() },
        (oldData: unknown) => {
          if (oldData && typeof oldData === "object" && "data" in oldData) {
            const paginatedData = oldData as PaginatedResponse<UserWithRole>;
            return {
              ...paginatedData,
              data: paginatedData.data.filter(
                (user) => !result.deletedIds.includes(user.id)
              ),
              pagination: {
                ...paginatedData.pagination,
                total: Math.max(
                  0,
                  paginatedData.pagination.total - result.successful
                ),
              },
            };
          }
          return oldData;
        }
      );

      showSuccess(t('messages.bulkDeleteSuccess', { count: result.successful }));
    },
    onError: (error: Error) => {
      console.error("❌ Bulk delete users error:", error);
      showError(error.message);
    },
  });
}

// =============================================================================
// OPTIMIZED HELPER HOOKS
// =============================================================================

// Get user count with caching
export function useUserCount(filters: UserFilters = {}) {
  const { data } = useUsers(filters);
  return data?.pagination?.total || 0;
}

// Check if user exists with caching
export function useUserExists(userId: string) {
  const { data, isLoading, error } = useUser(userId, !!userId);
  return {
    exists: !!data,
    isLoading,
    user: data,
    error,
  };
}

// Get users by role with optimized caching
export function useUsersByRole(roleId: string) {
  return useUsers({ roleId });
}

// Search users with debounced query
export function useSearchUsers(searchTerm: string, debounceMs = 300) {
  const [debouncedSearchTerm, setDebouncedSearchTerm] =
    React.useState(searchTerm);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [searchTerm, debounceMs]);

  return useUsers({ search: debouncedSearchTerm });
}

// Prefetch user details
export function usePrefetchUser() {
  const queryClient = useQueryClient();

  return React.useCallback(
    (userId: string) => {
      queryClient.prefetchQuery({
        queryKey: queryKeys.users.detail(userId),
        queryFn: () => usersAPI.getUserById(userId),
        staleTime: CACHE_CONFIG.DEFAULT_STALE_TIME,
      });
    },
    [queryClient]
  );
}
