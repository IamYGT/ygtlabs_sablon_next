import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser, hasPermission } from "@/lib";
import { prisma } from "@/lib/prisma";

export async function GET(_request: NextRequest) {
  try {
    // Admin yetkisi kontrolü
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { error: "Giriş yapmanız gerekiyor" },
        { status: 401 }
      );
    }

    const isAdmin = await hasPermission(user, "system.status");
    if (!isAdmin) {
      return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 403 });
    }

    // Veritabanı durumu kontrolü
    let databaseStatus: "online" | "offline" | "warning" = "online";
    try {
      await prisma.$queryRaw`SELECT 1`;
    } catch (error) {
      console.error("Database health check failed:", error);
      databaseStatus = "offline";
    }

    // API durumu kontrolü (basit response time check)
    const apiStartTime = Date.now();
    let apiStatus: "online" | "offline" | "warning" = "online";
    try {
      // Basit bir query ile API response time'ı ölç
      await prisma.user.count();
      const responseTime = Date.now() - apiStartTime;

      if (responseTime > 2000) {
        apiStatus = "warning"; // 2 saniyeden fazla ise warning
      } else if (responseTime > 5000) {
        apiStatus = "offline"; // 5 saniyeden fazla ise offline
      }
    } catch (error) {
      console.error("API health check failed:", error);
      apiStatus = "offline";
    }

    // Depolama durumu kontrolü (disk kullanımı simülasyonu)
    let storageStatus: "online" | "offline" | "warning" = "online";
    try {
      // Gerçek uygulamada disk kullanımı kontrol edilebilir
      // Şimdilik session sayısına göre simüle edelim
      const sessionCount = await prisma.session.count({
        where: {
          isActive: true,
        },
      });

      // 100'den fazla aktif session varsa warning (örnek threshold)
      if (sessionCount > 100) {
        storageStatus = "warning";
      }
    } catch (error) {
      console.error("Storage health check failed:", error);
      storageStatus = "offline";
    }

    // Sistem metrikleri
    const metrics = {
      activeUsers: await prisma.session.count({
        where: {
          isActive: true,
          lastActive: {
            gte: new Date(Date.now() - 24 * 60 * 60 * 1000), // Son 24 saat
          },
        },
      }),
      totalUsers: await prisma.user.count(),
      activeSessions: await prisma.session.count({
        where: {
          isActive: true,
        },
      }),
      recentLogins: await prisma.session.count({
        where: {
          createdAt: {
            gte: new Date(Date.now() - 60 * 60 * 1000), // Son 1 saat
          },
        },
      }),
    };

    return NextResponse.json({
      success: true,
      status: {
        database: databaseStatus,
        api: apiStatus,
        storage: storageStatus,
      },
      metrics,
      timestamp: new Date().toISOString(),
      uptime: process.uptime(), // Sunucu uptime (saniye)
    });
  } catch (error) {
    console.error("System status API error:", error);
    return NextResponse.json(
      {
        error: "Sistem durumu kontrol edilemedi",
        status: {
          database: "offline",
          api: "offline",
          storage: "offline",
        },
      },
      { status: 500 }
    );
  }
}
