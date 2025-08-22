"use client";

// Optimized User Management Hooks for TanStack Query

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "../api";
import { CACHE_CONFIG, DEFAULTS, QUERY_KEYS } from "../constants";
import type { PaginatedResponse, UserFilters } from "../types";

// Types
interface UserWithRole {
  id: string;
  name: string | null;
  email: string | null;
  isActive: boolean;
  profileImage: string | null;
  createdAt: Date;
  lastLoginAt: Date | null;
  role?: {
    id: string;
    name: string;
    displayName: string;
  };
}

// Get users list
export function useUsers(filters: UserFilters = {}) {
  return useQuery({
    queryKey: [...QUERY_KEYS.USERS, filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters.page) params.append("page", filters.page.toString());
      if (filters.limit) params.append("limit", (filters.limit || DEFAULTS.PAGE_SIZE).toString());
      if (filters.search) params.append("search", filters.search);
      if (filters.roleId) params.append("roleId", filters.roleId);
      if (filters.isActive !== undefined) params.append("isActive", filters.isActive.toString());

      const response = await api.get<PaginatedResponse<UserWithRole>>(
        `/api/admin/users?${params}`
      );

      if (!response.success) {
        throw new Error(response.error || "Failed to fetch users");
      }

      return response.data;
    },
    staleTime: CACHE_CONFIG.DEFAULT_STALE_TIME,
    gcTime: CACHE_CONFIG.DEFAULT_CACHE_TIME,
    refetchOnWindowFocus: false,
  });
}

// Get single user
export function useUser(userId: string, enabled = true) {
  return useQuery({
    queryKey: [...QUERY_KEYS.USERS, userId],
    queryFn: async () => {
      const response = await api.get<UserWithRole>(`/api/admin/users/${userId}`);
      
      if (!response.success) {
        throw new Error(response.error || "Failed to fetch user");
      }
      
      return response.data;
    },
    staleTime: CACHE_CONFIG.DEFAULT_STALE_TIME,
    gcTime: CACHE_CONFIG.DEFAULT_CACHE_TIME,
    enabled: enabled && !!userId,
    refetchOnWindowFocus: false,
  });
}

// Create user
export function useCreateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      name: string;
      email: string;
      password: string;
      roleId?: string;
    }) => {
      const response = await api.post<UserWithRole>("/api/admin/users", data);
      
      if (!response.success) {
        throw new Error(response.error || "Failed to create user");
      }
      
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.USERS });
    },
  });
}

// Update user
export function useUpdateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...data }: { id: string; name?: string; email?: string; roleId?: string }) => {
      const response = await api.patch<UserWithRole>(`/api/admin/users/${id}`, data);
      
      if (!response.success) {
        throw new Error(response.error || "Failed to update user");
      }
      
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [...QUERY_KEYS.USERS, variables.id] });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.USERS });
    },
  });
}

// Delete user
export function useDeleteUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userId: string) => {
      const response = await api.delete(`/api/admin/users/${userId}`);
      
      if (!response.success) {
        throw new Error(response.error || "Failed to delete user");
      }
      
      return userId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.USERS });
    },
  });
}

// Toggle user status
export function useToggleUserStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userId: string) => {
      const response = await api.post(`/api/admin/users/${userId}/toggle-status`);
      
      if (!response.success) {
        throw new Error(response.error || "Failed to toggle user status");
      }
      
      return response.data;
    },
    onSuccess: (_, userId) => {
      queryClient.invalidateQueries({ queryKey: [...QUERY_KEYS.USERS, userId] });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.USERS });
    },
  });
}

// Helper hooks
export function useUserCount(filters: UserFilters = {}) {
  const { data } = useUsers(filters);
  return data?.pagination?.total || 0;
}

export function useUsersByRole(roleId: string) {
  return useUsers({ roleId });
}

// Stub exports for compatibility
export const useAssignRole = useUpdateUser;
export const useRemoveRole = useUpdateUser;
export const useBulkDeleteUsers = useDeleteUser;
export const useSearchUsers = (search: string) => useUsers({ search });
export const usePrefetchUser = () => () => {};
export const useUserExists = (_id: string) => ({ exists: false, isLoading: false, user: null, error: null });
