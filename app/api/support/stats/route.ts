import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/server-utils";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const isAdmin = user.permissions?.includes("admin.layout");
    if (!isAdmin) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Bugünün başlangıcı
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // İstatistikleri topla
    const [
      total,
      open,
      pending,
      inProgress,
      resolved,
      closed,
      todayNew,
      todayResolved,
      avgResponseTimeResult,
      avgResolutionTimeResult,
    ] = await Promise.all([
      // Toplam ticket sayısı
      prisma.supportTicket.count(),

      // Açık ticketlar
      prisma.supportTicket.count({
        where: { status: "open" },
      }),

      // Bekleyen ticketlar
      prisma.supportTicket.count({
        where: { status: "pending" },
      }),

      // İşlemde olan ticketlar
      prisma.supportTicket.count({
        where: { status: "in_progress" },
      }),

      // Çözülmüş ticketlar
      prisma.supportTicket.count({
        where: { status: "resolved" },
      }),

      // Kapalı ticketlar
      prisma.supportTicket.count({
        where: { status: "closed" },
      }),

      // Bugün açılan ticketlar
      prisma.supportTicket.count({
        where: {
          createdAt: { gte: today },
        },
      }),

      // Bugün çözülen ticketlar
      prisma.supportTicket.count({
        where: {
          resolvedAt: { gte: today },
        },
      }),

      // Ortalama ilk yanıt süresi (saniye)
      prisma.$queryRaw<{ avg: number | null }[]>`
        SELECT AVG(EXTRACT(EPOCH FROM ("firstResponseAt" - "createdAt"))) as avg
        FROM "SupportTicket"
        WHERE "firstResponseAt" IS NOT NULL
      `,

      // Ortalama çözüm süresi (saniye)
      prisma.$queryRaw<{ avg: number | null }[]>`
        SELECT AVG(EXTRACT(EPOCH FROM ("resolvedAt" - "createdAt"))) as avg
        FROM "SupportTicket"
        WHERE "resolvedAt" IS NOT NULL
      `,
    ]);

    const avgResponseTime = avgResponseTimeResult[0]?.avg || 0;
    const avgResolutionTime = avgResolutionTimeResult[0]?.avg || 0;

    return NextResponse.json({
      total,
      open,
      pending,
      inProgress,
      resolved,
      closed,
      todayNew,
      todayResolved,
      avgResponseTime,
      avgResolutionTime,
    });
  } catch (error) {
    console.error("Error fetching support stats:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
