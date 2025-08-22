// ============================================================================
// PERFORMANCE MONITOR - API Performance Tracking System
// ============================================================================

interface PerformanceMetric {
  endpoint: string;
  method: string;
  duration: number;
  timestamp: Date;
  statusCode: number;
  cacheHit: boolean;
  userId?: string;
  error?: string;
}

interface AggregatedMetrics {
  endpoint: string;
  method: string;
  count: number;
  avgDuration: number;
  minDuration: number;
  maxDuration: number;
  p50: number;
  p95: number;
  p99: number;
  errorRate: number;
  cacheHitRate: number;
  lastHour: {
    count: number;
    avgDuration: number;
  };
}

class PerformanceMonitor {
  private metrics: PerformanceMetric[] = [];
  private readonly MAX_METRICS = 10000; // Keep last 10k metrics
  private readonly CLEANUP_INTERVAL = 60 * 60 * 1000; // 1 hour
  private cleanupTimer: NodeJS.Timeout | null = null;

  constructor() {
    this.startCleanup();
  }

  /**
   * Record a performance metric
   */
  record(metric: {
    endpoint: string;
    method: string;
    duration: number;
    statusCode: number;
    cacheHit?: boolean;
    userId?: string;
    error?: string;
  }): void {
    this.metrics.push({
      ...metric,
      cacheHit: metric.cacheHit || false,
      timestamp: new Date(),
    });

    // Keep only the latest metrics
    if (this.metrics.length > this.MAX_METRICS) {
      this.metrics = this.metrics.slice(-this.MAX_METRICS);
    }

    // Slow request logging disabled for production
  }

  /**
   * Get aggregated metrics for all endpoints
   */
  getAggregatedMetrics(): AggregatedMetrics[] {
    const grouped = new Map<string, PerformanceMetric[]>();

    // Group metrics by endpoint+method
    for (const metric of this.metrics) {
      const key = `${metric.method}:${metric.endpoint}`;
      if (!grouped.has(key)) {
        grouped.set(key, []);
      }
      grouped.get(key)!.push(metric);
    }

    const results: AggregatedMetrics[] = [];

    for (const [key, metrics] of grouped.entries()) {
      const [method, endpoint] = key.split(":");
      const durations = metrics.map(m => m.duration).sort((a, b) => a - b);
      const errors = metrics.filter(m => m.statusCode >= 400).length;
      const cacheHits = metrics.filter(m => m.cacheHit).length;

      // Last hour metrics
      const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
      const lastHourMetrics = metrics.filter(
        m => m.timestamp > oneHourAgo
      );

      results.push({
        endpoint,
        method,
        count: metrics.length,
        avgDuration: this.calculateAverage(durations),
        minDuration: durations[0] || 0,
        maxDuration: durations[durations.length - 1] || 0,
        p50: this.calculatePercentile(durations, 50),
        p95: this.calculatePercentile(durations, 95),
        p99: this.calculatePercentile(durations, 99),
        errorRate: (errors / metrics.length) * 100,
        cacheHitRate: (cacheHits / metrics.length) * 100,
        lastHour: {
          count: lastHourMetrics.length,
          avgDuration: this.calculateAverage(
            lastHourMetrics.map(m => m.duration)
          ),
        },
      });
    }

    return results.sort((a, b) => b.p95 - a.p95); // Sort by p95 (worst first)
  }

  /**
   * Get metrics for a specific endpoint
   */
  getEndpointMetrics(endpoint: string, method?: string): AggregatedMetrics | null {
    const metrics = this.metrics.filter(
      m =>
        m.endpoint === endpoint &&
        (!method || m.method === method)
    );

    if (metrics.length === 0) return null;

    const durations = metrics.map(m => m.duration).sort((a, b) => a - b);
    const errors = metrics.filter(m => m.statusCode >= 400).length;
    const cacheHits = metrics.filter(m => m.cacheHit).length;

    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    const lastHourMetrics = metrics.filter(m => m.timestamp > oneHourAgo);

    return {
      endpoint,
      method: method || "ALL",
      count: metrics.length,
      avgDuration: this.calculateAverage(durations),
      minDuration: durations[0] || 0,
      maxDuration: durations[durations.length - 1] || 0,
      p50: this.calculatePercentile(durations, 50),
      p95: this.calculatePercentile(durations, 95),
      p99: this.calculatePercentile(durations, 99),
      errorRate: (errors / metrics.length) * 100,
      cacheHitRate: (cacheHits / metrics.length) * 100,
      lastHour: {
        count: lastHourMetrics.length,
        avgDuration: this.calculateAverage(
          lastHourMetrics.map(m => m.duration)
        ),
      },
    };
  }

  /**
   * Get slow queries (p95 > threshold)
   */
  getSlowEndpoints(thresholdMs: number = 500): AggregatedMetrics[] {
    return this.getAggregatedMetrics().filter(
      m => m.p95 > thresholdMs
    );
  }

  /**
   * Get cache statistics
   */
  getCacheStats(): {
    overall: number;
    byEndpoint: Record<string, number>;
  } {
    const byEndpoint: Record<string, number> = {};
    let totalHits = 0;
    let totalRequests = 0;

    for (const metric of this.metrics) {
      const key = `${metric.method}:${metric.endpoint}`;
      if (!byEndpoint[key]) {
        byEndpoint[key] = 0;
      }

      totalRequests++;
      if (metric.cacheHit) {
        totalHits++;
        byEndpoint[key]++;
      }
    }

    // Calculate hit rates
    const hitRates: Record<string, number> = {};
    for (const [key, hits] of Object.entries(byEndpoint)) {
      const total = this.metrics.filter(
        m => `${m.method}:${m.endpoint}` === key
      ).length;
      hitRates[key] = (hits / total) * 100;
    }

    return {
      overall: totalRequests > 0 ? (totalHits / totalRequests) * 100 : 0,
      byEndpoint: hitRates,
    };
  }

  /**
   * Export metrics as CSV
   */
  exportAsCSV(): string {
    const headers = [
      "Timestamp",
      "Method",
      "Endpoint",
      "Duration (ms)",
      "Status Code",
      "Cache Hit",
      "User ID",
      "Error",
    ];

    const rows = this.metrics.map(m => [
      m.timestamp.toISOString(),
      m.method,
      m.endpoint,
      m.duration.toString(),
      m.statusCode.toString(),
      m.cacheHit ? "Yes" : "No",
      m.userId || "",
      m.error || "",
    ]);

    return [
      headers.join(","),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(",")),
    ].join("\n");
  }

  /**
   * Clear all metrics
   */
  clear(): void {
    this.metrics = [];
  }

  /**
   * Calculate average
   */
  private calculateAverage(numbers: number[]): number {
    if (numbers.length === 0) return 0;
    return numbers.reduce((a, b) => a + b, 0) / numbers.length;
  }

  /**
   * Calculate percentile
   */
  private calculatePercentile(sorted: number[], percentile: number): number {
    if (sorted.length === 0) return 0;
    const index = Math.ceil((percentile / 100) * sorted.length) - 1;
    return sorted[Math.max(0, index)];
  }

  /**
   * Start cleanup timer
   */
  private startCleanup(): void {
    this.cleanupTimer = setInterval(() => {
      const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
      const beforeCount = this.metrics.length;
      
      this.metrics = this.metrics.filter(
        m => m.timestamp > oneDayAgo
      );
      
      // Cleanup logging disabled for production
    }, this.CLEANUP_INTERVAL);
  }

  /**
   * Stop cleanup timer
   */
  stopCleanup(): void {
    if (this.cleanupTimer) {
      clearInterval(this.cleanupTimer);
      this.cleanupTimer = null;
    }
  }
}

// Export singleton instance
export const performanceMonitor = new PerformanceMonitor();

// Cleanup on process termination - Singleton pattern to avoid multiple listeners
if (typeof process !== "undefined" && !(global as any).__performanceMonitorCleanupRegistered) {
  (global as any).__performanceMonitorCleanupRegistered = true;
  
  process.once("SIGINT", () => {
    performanceMonitor.stopCleanup();
  });

  process.once("SIGTERM", () => {
    performanceMonitor.stopCleanup();
  });
}

// Helper middleware for Next.js API routes
export function withPerformanceMonitoring(
  handler: Function
): Function {
  return async function (req: any, res: any) {
    const startTime = Date.now();
    const endpoint = req.url?.split("?")[0] || "unknown";
    const method = req.method || "GET";

    // Store original res.json
    const originalJson = res.json.bind(res);

    // Override res.json to capture response
    res.json = function (data: any) {
      const duration = Date.now() - startTime;
      const cacheHit = res.getHeader("X-Cache") === "HIT";

      performanceMonitor.record({
        endpoint,
        method,
        duration,
        statusCode: res.statusCode || 200,
        cacheHit,
        userId: data?.user?.id,
        error: data?.error,
      });

      // Set performance headers
      res.setHeader("X-Response-Time", `${duration}ms`);
      res.setHeader("Server-Timing", `total;dur=${duration}`);

      return originalJson(data);
    };

    try {
      return await handler(req, res);
    } catch (error: any) {
      const duration = Date.now() - startTime;

      performanceMonitor.record({
        endpoint,
        method,
        duration,
        statusCode: 500,
        cacheHit: false,
        error: error.message,
      });

      throw error;
    }
  };
}
