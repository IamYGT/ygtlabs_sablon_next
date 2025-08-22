// ============================================================================
// PERMISSIONS CACHE - Dedicated cache for permissions data
// ============================================================================

interface PermissionCacheEntry {
  data: any;
  expiresAt: number;
  etag?: string;
}

class PermissionsCache {
  private cache: Map<string, PermissionCacheEntry>;
  private readonly DEFAULT_TTL = 10 * 60 * 1000; // 10 minutes for permissions
  private cleanupInterval: NodeJS.Timeout | null = null;
  
  // Metrics
  private hits = 0;
  private misses = 0;

  constructor() {
    this.cache = new Map();
    this.startCleanup();
  }

  /**
   * Generate cache key for permissions query
   */
  private generateKey(params: {
    category?: string;
    page?: number;
    limit?: number;
    search?: string;
    locale?: string;
  }): string {
    const parts = [
      'permissions',
      params.category || 'all',
      params.page || 1,
      params.limit || 1000,
      params.search || 'none',
      params.locale || 'tr'
    ];
    return parts.join(':');
  }

  /**
   * Get permissions from cache
   */
  get(params: {
    category?: string;
    page?: number;
    limit?: number;
    search?: string;
    locale?: string;
  }): any | null {
    const key = this.generateKey(params);
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
   * Set permissions in cache
   */
  set(params: {
    category?: string;
    page?: number;
    limit?: number;
    search?: string;
    locale?: string;
  }, data: any, ttl?: number): void {
    const key = this.generateKey(params);
    const expiresAt = Date.now() + (ttl || this.DEFAULT_TTL);
    
    // Generate ETag for cache validation
    const etag = this.generateETag(data);
    
    this.cache.set(key, { 
      data, 
      expiresAt,
      etag
    });
  }

  /**
   * Invalidate all permissions cache
   */
  invalidateAll(): void {
    const keysToDelete: string[] = [];
    
    for (const key of this.cache.keys()) {
      if (key.startsWith('permissions:')) {
        keysToDelete.push(key);
      }
    }
    
    keysToDelete.forEach(key => this.cache.delete(key));
  }

  /**
   * Invalidate permissions by category
   */
  invalidateByCategory(category: string): void {
    const keysToDelete: string[] = [];
    
    for (const key of this.cache.keys()) {
      if (key.includes(`:${category}:`)) {
        keysToDelete.push(key);
      }
    }
    
    keysToDelete.forEach(key => this.cache.delete(key));
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
      size: this.cache.size,
      memoryUsage: this.estimateMemoryUsage()
    };
  }

  /**
   * Estimate memory usage
   */
  private estimateMemoryUsage(): string {
    let totalSize = 0;
    
    for (const entry of this.cache.values()) {
      totalSize += JSON.stringify(entry.data).length;
    }
    
    return `${(totalSize / 1024).toFixed(2)} KB`;
  }

  /**
   * Generate ETag for cache validation
   */
  private generateETag(data: any): string {
    const str = JSON.stringify(data);
    let hash = 0;
    
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    
    return `W/"${hash.toString(36)}"`;
  }

  /**
   * Check if data has changed using ETag
   */
  hasChanged(params: {
    category?: string;
    page?: number;
    limit?: number;
    search?: string;
    locale?: string;
  }, newData: any): boolean {
    const key = this.generateKey(params);
    const entry = this.cache.get(key);
    
    if (!entry || !entry.etag) return true;
    
    const newETag = this.generateETag(newData);
    return entry.etag !== newETag;
  }

  /**
   * Reset metrics
   */
  private resetMetrics(): void {
    this.hits = 0;
    this.misses = 0;
  }

  /**
   * Start automatic cleanup
   */
  private startCleanup(): void {
    // Run cleanup every 5 minutes
    this.cleanupInterval = setInterval(() => {
      this.cleanupExpired();
    }, 5 * 60 * 1000);
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
   * Stop cleanup interval
   */
  stopCleanup(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
      this.cleanupInterval = null;
    }
  }
}

// Export singleton instance
export const permissionsCache = new PermissionsCache();

// Cleanup on process termination - Singleton pattern to avoid multiple listeners
if (typeof process !== "undefined" && !(global as any).__permissionsCacheCleanupRegistered) {
  (global as any).__permissionsCacheCleanupRegistered = true;
  
  process.once("SIGINT", () => {
    permissionsCache.stopCleanup();
  });
  
  process.once("SIGTERM", () => {
    permissionsCache.stopCleanup();
  });
}
