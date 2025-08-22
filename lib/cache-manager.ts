// ============================================================================
// UNIFIED CACHE MANAGER - Optimized for Next.js 15.5 & TanStack Query
// ============================================================================

import type { SimpleUser } from "./types";

interface CacheEntry<T> {
  data: T;
  expiresAt: number;
  etag?: string;
}

class CacheManager {
  private cache = new Map<string, CacheEntry<unknown>>();
  private readonly SESSION_TTL = 10 * 60 * 1000; // 10 minutes
  private readonly PERMISSION_TTL = 15 * 60 * 1000; // 15 minutes
  
  // Session Cache Methods
  getSession(key: string): SimpleUser | null {
    const entry = this.cache.get(`session:${key}`);
    if (!entry || Date.now() > entry.expiresAt) {
      if (entry) {
        this.cache.delete(`session:${key}`);
      }
      return null;
    }
    return entry.data as SimpleUser;
  }

  setSession(key: string, data: SimpleUser): void {
    this.cache.set(`session:${key}`, {
      data,
      expiresAt: Date.now() + this.SESSION_TTL
    });
  }

  // Permission Cache Methods
  getPermissions(userId: string): unknown | null {
    const entry = this.cache.get(`permissions:${userId}`);
    if (!entry || Date.now() > entry.expiresAt) {
      if (entry) {
        this.cache.delete(`permissions:${userId}`);
      }
      return null;
    }
    return entry.data;
  }

  setPermissions(userId: string, data: unknown): void {
    this.cache.set(`permissions:${userId}`, {
      data,
      expiresAt: Date.now() + this.PERMISSION_TTL,
      etag: this.generateETag(data)
    });
  }

  // Invalidation Methods
  invalidateUser(userId: string): void {
    const keysToDelete: string[] = [];
    for (const key of this.cache.keys()) {
      if (key.includes(userId)) keysToDelete.push(key);
    }
    keysToDelete.forEach(key => this.cache.delete(key));
  }

  // Alias for backward compatibility
  invalidateByUserId(userId: string): void {
    this.invalidateUser(userId);
  }

  // Delete specific key
  delete(key: string): boolean {
    return this.cache.delete(key);
  }

  invalidateAll(): void {
    this.cache.clear();
  }

  // Utility Methods
  private generateETag(data: unknown): string {
    const str = JSON.stringify(data);
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = ((hash << 5) - hash) + str.charCodeAt(i);
      hash = hash & hash;
    }
    return `W/"${hash.toString(36)}"`;
  }

  // Generic cache methods for backward compatibility
  get<T = unknown>(key: string | Record<string, unknown>): T | null {
    const cacheKey = typeof key === 'string' ? key : JSON.stringify(key);
    const entry = this.cache.get(cacheKey);
    if (!entry || Date.now() > entry.expiresAt) {
      if (entry) {
        this.cache.delete(cacheKey);
      }
      return null;
    }
    return entry.data as T;
  }

  set<T = unknown>(key: string | Record<string, unknown>, data: T, ttl?: number): void {
    const cacheKey = typeof key === 'string' ? key : JSON.stringify(key);
    this.cache.set(cacheKey, {
      data,
      expiresAt: Date.now() + (ttl || this.SESSION_TTL),
      etag: this.generateETag(data)
    });
  }

  getStats() {
    let sessions = 0, permissions = 0;
    for (const key of this.cache.keys()) {
      if (key.startsWith('session:')) sessions++;
      else if (key.startsWith('permissions:')) permissions++;
    }
    return { sessions, permissions, total: this.cache.size };
  }
}

export const cacheManager = new CacheManager();
