// ============================================================================
// SESSION CACHE - In-Memory Cache for Session Management
// Reduces database queries and improves performance
// ============================================================================

import type { SimpleUser } from "./types";

interface CacheEntry<T> {
  data: T;
  expiresAt: number;
}

class SessionCache {
  private cache: Map<string, CacheEntry<SimpleUser>>;
  private readonly DEFAULT_TTL = 5 * 60 * 1000; // 5 minutes in milliseconds
  private cleanupInterval: NodeJS.Timeout | null = null;
  
  // Metrics for monitoring
  private hits = 0;
  private misses = 0;

  constructor() {
    this.cache = new Map();
    this.startCleanup();
  }

  /**
   * Get item from cache
   */
  get(key: string): SimpleUser | null {
    const entry = this.cache.get(key);
    
    if (!entry) {
      this.misses++;
      return null;
    }
    
    // Check if expired
    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      this.misses++;
      return null;
    }
    
    this.hits++;
    return entry.data;
  }

  /**
   * Set item in cache with TTL
   */
  set(key: string, data: SimpleUser, ttl?: number): void {
    const expiresAt = Date.now() + (ttl || this.DEFAULT_TTL);
    this.cache.set(key, { data, expiresAt });
  }

  /**
   * Delete specific item from cache
   */
  delete(key: string): boolean {
    return this.cache.delete(key);
  }

  /**
   * Clear all cache entries
   */
  clear(): void {
    this.cache.clear();
    this.resetMetrics();
  }

  /**
   * Invalidate cache entries by user ID
   */
  invalidateByUserId(userId: string): void {
    // Remove all cache entries related to this user
    for (const [key, entry] of this.cache.entries()) {
      if (entry.data.id === userId) {
        this.cache.delete(key);
      }
    }
  }

  /**
   * Get cache statistics
   */
  getStats() {
    const total = this.hits + this.misses;
    return {
      hits: this.hits,
      misses: this.misses,
      hitRate: total > 0 ? (this.hits / total) * 100 : 0,
      size: this.cache.size
    };
  }

  /**
   * Reset metrics
   */
  private resetMetrics(): void {
    this.hits = 0;
    this.misses = 0;
  }

  /**
   * Start automatic cleanup of expired entries
   */
  private startCleanup(): void {
    // Run cleanup every minute
    this.cleanupInterval = setInterval(() => {
      this.cleanupExpired();
    }, 60 * 1000);
  }

  /**
   * Clean up expired entries
   */
  private cleanupExpired(): void {
    const now = Date.now();
    let removed = 0;
    
    for (const [key, entry] of this.cache.entries()) {
      if (now > entry.expiresAt) {
        this.cache.delete(key);
        removed++;
      }
    }
    
    // Cleanup logging disabled for production
  }

  /**
   * Stop cleanup interval (for cleanup on app shutdown)
   */
  stopCleanup(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
      this.cleanupInterval = null;
    }
  }
}

// Export singleton instance
export const sessionCache = new SessionCache();

// Cleanup on process termination - Singleton pattern to avoid multiple listeners
if (typeof process !== "undefined" && !(global as any).__sessionCacheCleanupRegistered) {
  (global as any).__sessionCacheCleanupRegistered = true;
  
  process.once("SIGINT", () => {
    sessionCache.stopCleanup();
  });
  
  process.once("SIGTERM", () => {
    sessionCache.stopCleanup();
  });
}
