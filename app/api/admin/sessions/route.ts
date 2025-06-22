import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser, hasPermission } from "@/lib";
import { prisma } from "@/lib/prisma";

// GET /api/admin/sessions - Session istatistikleri
export async function GET(_request: NextRequest) {
  try {
    const user = await getCurrentUser();

    if (!user || !(await hasPermission(user, "sessions.admin"))) {
      return NextResponse.json(
        { error: "Admin yetkisi gerekli" },
        { status: 403 }
      );
    }

    // Basit session istatistikleri
    const activeSessionsCount = await prisma.session.count({
      where: { isActive: true, expires: { gt: new Date() } },
    });

    const totalSessionsCount = await prisma.session.count();

    const recentSessionsCount = await prisma.session.count({
      where: {
        createdAt: {
          gte: new Date(Date.now() - 24 * 60 * 60 * 1000), // Son 24 saat
        },
      },
    });

    return NextResponse.json({
      success: true,
      stats: {
        activeCount: activeSessionsCount,
        totalCount: totalSessionsCount,
        recentCount: recentSessionsCount,
      },
    });
  } catch (error) {
    console.error("Session stats error:", error);
    return NextResponse.json(
      { error: "Session bilgileri alınırken hata oluştu" },
      { status: 500 }
    );
  }
}

// Session temizleme (Admin only)
export async function DELETE(request: NextRequest) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser || !(await hasPermission(currentUser, "sessions.admin"))) {
      return NextResponse.json(
        { error: "Bu işlem için admin yetkisi gereklidir" },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const action = searchParams.get("action");

    if (action === "cleanup") {
      // Süresi dolmuş session'ları temizle
      const result = await prisma.session.deleteMany({
        where: {
          OR: [{ expires: { lt: new Date() } }, { isActive: false }],
        },
      });

      return NextResponse.json({
        success: true,
        message: `${result.count} session temizlendi`,
        cleanedCount: result.count,
      });
    }

    return NextResponse.json(
      { error: "Geçersiz action parametresi" },
      { status: 400 }
    );
  } catch (error) {
    console.error("Session management error:", error);
    return NextResponse.json(
      { error: "Session yönetimi sırasında hata oluştu" },
      { status: 500 }
    );
  }
}
