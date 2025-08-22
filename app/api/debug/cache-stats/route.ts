import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/session-utils";
import { sessionCache } from "@/lib/session-cache";
import { permissionsCache } from "@/lib/permissions-cache";
import { performanceMonitor } from "@/lib/performance-monitor";

// GET /api/debug/cache-stats
export async function GET(request: NextRequest) {
  try {
    // Only allow in development mode or for super admins
    const currentUser = await getCurrentUser(request);
    
    if (
      process.env.NODE_ENV === "production" &&
      (!currentUser || currentUser.primaryRole !== "super_admin")
    ) {
      return NextResponse.json(
        { error: "Bu endpoint sadece development modunda veya super admin için erişilebilir" },
        { status: 403 }
      );
    }

    // Get cache statistics
    const sessionStats = sessionCache.getStats();
    const permissionsStats = permissionsCache.getStats();
    
    // Get performance metrics
    const performanceMetrics = performanceMonitor.getAggregatedMetrics();
    const slowEndpoints = performanceMonitor.getSlowEndpoints(300);
    const cacheHitRates = performanceMonitor.getCacheStats();

    // Build comprehensive response
    const response = {
      success: true,
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      caches: {
        session: {
          ...sessionStats,
          hitRate: `${sessionStats.hitRate.toFixed(2)}%`,
          type: "In-Memory",
          ttl: "2 minutes",
        },
        permissions: {
          ...permissionsStats,
          hitRate: `${permissionsStats.hitRate.toFixed(2)}%`,
          type: "In-Memory",
          ttl: "10 minutes",
        },
      },
      performance: {
        summary: {
          totalEndpoints: performanceMetrics.length,
          slowEndpoints: slowEndpoints.length,
          overallCacheHitRate: `${cacheHitRates.overall.toFixed(2)}%`,
        },
        topSlowest: performanceMetrics.slice(0, 5).map(m => ({
          endpoint: `${m.method} ${m.endpoint}`,
          p95: `${m.p95}ms`,
          avgDuration: `${m.avgDuration.toFixed(0)}ms`,
          cacheHitRate: `${m.cacheHitRate.toFixed(2)}%`,
          requestCount: m.count,
        })),
        problematicEndpoints: slowEndpoints.map(m => ({
          endpoint: `${m.method} ${m.endpoint}`,
          issue: m.p95 > 1000 ? "Very Slow" : "Slow",
          p95: `${m.p95}ms`,
          suggestion: m.cacheHitRate < 50 
            ? "Consider implementing caching"
            : "Optimize database queries",
        })),
      },
      recommendations: generateRecommendations(
        sessionStats,
        permissionsStats,
        performanceMetrics
      ),
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Cache stats error:", error);
    return NextResponse.json(
      { error: "Cache istatistikleri alınırken hata oluştu" },
      { status: 500 }
    );
  }
}

function generateRecommendations(
  sessionStats: any,
  permissionsStats: any,
  metrics: any[]
): string[] {
  const recommendations: string[] = [];

  // Session cache recommendations
  if (sessionStats.hitRate < 70) {
    recommendations.push(
      "Session cache hit oranı düşük (%" + sessionStats.hitRate.toFixed(0) + "). TTL süresini artırın veya sık erişilen session'ları ön yükleyin."
    );
  }

  // Permissions cache recommendations
  if (permissionsStats.hitRate < 80) {
    recommendations.push(
      "Permissions cache hit oranı düşük (%" + permissionsStats.hitRate.toFixed(0) + "). İzinleri daha agresif şekilde cache'leyin."
    );
  }

  // Performance recommendations
  if (metrics.length > 0) {
    const avgP95 = metrics.reduce((sum, m) => sum + m.p95, 0) / metrics.length;
    if (avgP95 > 500) {
      recommendations.push(
        "Ortalama P95 yanıt süresi yüksek (" + avgP95.toFixed(0) + "ms). Database sorgularını optimize edin ve pagination uygulayın."
      );
    }

    // Check for endpoints without caching
    const noCacheEndpoints = metrics.filter(m => m.cacheHitRate === 0);
    if (noCacheEndpoints.length > 0) {
      recommendations.push(
        noCacheEndpoints.length + " endpoint'te cache yok. Sık erişilen endpoint'ler için cache uygulayın."
      );
    }
  }

  if (recommendations.length === 0) {
    recommendations.push("Performans metrikleri iyi görünüyor! Acil optimizasyon gerekmiyor.");
  }

  return recommendations;
}
