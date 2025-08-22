import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/server-utils";
import { cacheManager } from "@/lib/cache-manager";

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
    const stats = cacheManager.getStats();

    // Build response
    const response = {
      success: true,
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      cache: {
        sessions: stats.sessions,
        permissions: stats.permissions,
        total: stats.total,
        type: "In-Memory",
        ttl: {
          sessions: "10 minutes",
          permissions: "15 minutes"
        }
      },
      recommendations: [
        stats.total === 0 ? "Cache boş, henüz veri yüklenmemiş" : null,
        stats.sessions < 10 ? "Session cache kullanımı düşük" : null,
        stats.permissions < 5 ? "Permission cache kullanımı düşük" : null,
        stats.total > 1000 ? "Cache boyutu büyük, temizleme gerekebilir" : null,
      ].filter(Boolean)
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
