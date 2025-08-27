"use client";

import { useQueryClient } from '@tanstack/react-query';
import { authActions } from './stores/auth-store';

/**
 * Cache invalidation utilities - Rol ve kullanıcı değişikliklerinde kullan
 */

// Query keys that need invalidation on role/permission changes
const _INVALIDATION_KEYS = [
  ['auth'], // Current user
  ['permissions', 'all'], // All permissions
  ['permissions', 'user'], // User permissions
  ['users'], // User list
  ['roles'], // Roles list
  ['admin'], // Admin data
  ['customer'], // Customer data
] as const;

/**
 * Client-side cache invalidation hook
 */
export function useCacheInvalidation() {
  const queryClient = useQueryClient();

  const invalidateUserCache = async (userId?: string) => {
    console.log('🔄 Invalidating user cache', { userId });
    
    // 1. TanStack Query cache'lerini temizle
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ['auth'] }),
      queryClient.invalidateQueries({ queryKey: ['permissions', 'user'] }),
      queryClient.invalidateQueries({ queryKey: ['users'] }),
      queryClient.invalidateQueries({ queryKey: ['roles'] }),
    ]);

    // 2. Auth store'u yeniden fetch'le
    await queryClient.refetchQueries({ queryKey: ['auth'] });

    console.log('✅ User cache invalidated');
  };

  const invalidatePermissionsCache = async () => {
    console.log('🔄 Invalidating permissions cache');
    
    // Tüm permission-related cache'leri temizle
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ['permissions'] }),
      queryClient.invalidateQueries({ queryKey: ['auth'] }),
      queryClient.invalidateQueries({ queryKey: ['roles'] }),
    ]);

    // Auth'u yeniden fetch'le
    await queryClient.refetchQueries({ queryKey: ['auth'] });

    console.log('✅ Permissions cache invalidated');
  };

  const invalidateAllCache = async () => {
    console.log('🔄 Invalidating all cache');
    
    // Tüm cache'leri temizle
    await queryClient.invalidateQueries();
    
    // Critical queries'leri yeniden fetch'le
    await Promise.all([
      queryClient.refetchQueries({ queryKey: ['auth'] }),
      queryClient.refetchQueries({ queryKey: ['permissions', 'user'] }),
    ]);

    console.log('✅ All cache invalidated');
  };

  // Server-side cache invalidation'ı tetikle
  const triggerServerCacheInvalidation = async (type: 'user' | 'permissions' | 'all' = 'all', userId?: string) => {
    try {
      const response = await fetch('/api/admin/cache/invalidate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ type, userId })
      });

      if (!response.ok) {
        throw new Error(`Server cache invalidation failed: ${response.status}`);
      }

      const result = await response.json();
      console.log('✅ Server cache invalidated:', result);
      return result;
    } catch (error) {
      console.error('❌ Server cache invalidation failed:', error);
      throw error;
    }
  };

  return {
    invalidateUserCache,
    invalidatePermissionsCache, 
    invalidateAllCache,
    triggerServerCacheInvalidation,
  };
}

/**
 * Role değişikliklerinde kullanılacak cache invalidation
 */
export async function invalidateOnRoleChange(userId: string, queryClient: ReturnType<typeof useQueryClient>) {
  console.log('🔄 Role changed - invalidating caches for user:', userId);

  try {
    // 1. Client-side cache invalidation
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ['auth'] }),
      queryClient.invalidateQueries({ queryKey: ['permissions'] }),
      queryClient.invalidateQueries({ queryKey: ['users'] }),
      queryClient.invalidateQueries({ queryKey: ['roles'] }),
    ]);

    // 2. Server-side cache invalidation
    await fetch('/api/admin/cache/invalidate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ type: 'user', userId })
    });

    // 3. Auth store'u yeniden fetch'le
    await queryClient.refetchQueries({ queryKey: ['auth'] });

    console.log('✅ Role change cache invalidation completed');
  } catch (error) {
    console.error('❌ Role change cache invalidation failed:', error);
    throw error;
  }
}

/**
 * Permission değişikliklerinde kullanılacak cache invalidation
 */
export async function invalidateOnPermissionChange(queryClient: ReturnType<typeof useQueryClient>) {
  console.log('🔄 Permissions changed - invalidating all permission caches');

  try {
    // 1. Client-side cache invalidation
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ['permissions'] }),
      queryClient.invalidateQueries({ queryKey: ['auth'] }),
      queryClient.invalidateQueries({ queryKey: ['roles'] }),
    ]);

    // 2. Server-side cache invalidation
    await fetch('/api/admin/cache/invalidate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ type: 'permissions' })
    });

    // 3. Critical queries'i yeniden fetch'le
    await Promise.all([
      queryClient.refetchQueries({ queryKey: ['auth'] }),
      queryClient.refetchQueries({ queryKey: ['permissions', 'user'] }),
    ]);

    console.log('✅ Permission change cache invalidation completed');
  } catch (error) {
    console.error('❌ Permission change cache invalidation failed:', error);
    throw error;
  }
}

/**
 * Utility: Tüm cache'leri acil durumda temizle
 */
export function clearAllCachesEmergency() {
  console.log('🚨 Emergency cache clear triggered');

  try {
    // 1. LocalStorage auth store'u temizle
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth-store');
      console.log('🗑️ Auth store cleared from localStorage');
    }

    // 2. Auth store'u reset et
    authActions.logout();
    console.log('🗑️ Auth store reset');

    // 3. Window reload ile tüm memory cache'leri temizle
    if (typeof window !== 'undefined') {
      console.log('🔄 Reloading window to clear all caches');
      window.location.reload();
    }
  } catch (error) {
    console.error('❌ Emergency cache clear failed:', error);
  }
}
