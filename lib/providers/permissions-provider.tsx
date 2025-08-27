'use client';

import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';

interface Permission {
  id: string;
  name: string;
  category: string;
  resourcePath: string;
  action: string;
  permissionType: string;
  displayName?: { tr: string; en: string };
  description?: { tr: string; en: string };
  isActive: boolean;
}

interface PermissionsContextValue {
  permissions: Permission[];
  userPermissions: Set<string>;
  loading: boolean;
  error: string | null;
  has: (permissionName: string) => boolean;
  hasLayoutAccess: (layoutType: 'admin' | 'user') => boolean;
  hasViewAccess: (viewName: string) => boolean;
  hasFunctionAccess: (functionName: string) => boolean;
  refetch: () => void;
}

const PermissionsContext = createContext<PermissionsContextValue | null>(null);

// Cache keys
const PERMISSIONS_CACHE_KEY = ['permissions', 'all'];
const USER_PERMISSIONS_CACHE_KEY = ['permissions', 'user'];

export function PermissionsProvider({ children }: { children: React.ReactNode }) {
  const [userPermissions, setUserPermissions] = useState<Set<string>>(new Set());

  // Single API call for all permissions - heavily cached
  const { data: permissionsData, isLoading: permissionsLoading, error: permissionsError } = useQuery({
    queryKey: PERMISSIONS_CACHE_KEY,
    queryFn: async () => {
      const response = await fetch('/api/admin/permissions?limit=500');
      if (!response.ok) throw new Error('Failed to fetch permissions');
      return response.json();
    },
    staleTime: 0, // Hiç cache yok - anlık permissions
    gcTime: 60 * 1000, // 1 dakika cache
    refetchOnWindowFocus: true, // Pencere odağında yenile
    refetchOnMount: true, // Mount'ta yenile
    refetchInterval: false,
  });

  // Single API call for user permissions - heavily cached
  const { data: userData, isLoading: userLoading, error: userError, refetch } = useQuery({
    queryKey: USER_PERMISSIONS_CACHE_KEY,
    queryFn: async () => {
      const response = await fetch('/api/auth/current-user');
      if (!response.ok) throw new Error('Failed to fetch user');
      return response.json();
    },
    staleTime: 0, // Hiç cache yok - anlık user data
    gcTime: 30 * 1000, // 30 saniye cache
    refetchOnWindowFocus: true, // Pencere odağında yenile
    refetchOnMount: true, // Mount'ta yenile 
    refetchInterval: false,
  });

  // Update user permissions when data changes
  useEffect(() => {
    if (userData?.user?.permissions) {
      setUserPermissions(new Set(userData.user.permissions));
    }
  }, [userData]);

  // Memoized permission check functions
  const has = useCallback(
    (permissionName: string): boolean => {
      return userPermissions.has(permissionName);
    },
    [userPermissions]
  );

  const hasLayoutAccess = useCallback(
    (layoutType: 'admin' | 'user'): boolean => {
      return has(`${layoutType}.layout`);
    },
    [has]
  );

  const hasViewAccess = useCallback(
    (viewName: string): boolean => {
      return has(viewName);
    },
    [has]
  );

  const hasFunctionAccess = useCallback(
    (functionName: string): boolean => {
      return has(functionName);
    },
    [has]
  );

  // Memoized context value
  const contextValue = useMemo<PermissionsContextValue>(() => ({
    permissions: permissionsData?.permissions || [],
    userPermissions,
    loading: permissionsLoading || userLoading,
    error: permissionsError?.message || userError?.message || null,
    has,
    hasLayoutAccess,
    hasViewAccess,
    hasFunctionAccess,
    refetch,
  }), [
    permissionsData,
    userPermissions,
    permissionsLoading,
    userLoading,
    permissionsError,
    userError,
    has,
    hasLayoutAccess,
    hasViewAccess,
    hasFunctionAccess,
    refetch,
  ]);

  return (
    <PermissionsContext.Provider value={contextValue}>
      {children}
    </PermissionsContext.Provider>
  );
}

// Custom hook with better error handling
export function usePermissions() {
  const context = useContext(PermissionsContext);
  
  if (!context) {
    // Return safe defaults if provider is not available
    console.warn('usePermissions must be used within PermissionsProvider');
    return {
      permissions: [],
      userPermissions: new Set<string>(),
      loading: false,
      error: 'PermissionsProvider not found',
      has: () => false,
      hasLayoutAccess: () => false,
      hasViewAccess: () => false,
      hasFunctionAccess: () => false,
      refetch: () => {},
    };
  }
  
  return context;
}
