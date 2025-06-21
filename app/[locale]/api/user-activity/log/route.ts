import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib";
import { prisma } from "@/lib/prisma";

// Kullanıcı aktivitelerini kaydetmek için API endpoint
export async function POST(request: NextRequest) {
  try {
    // Middleware'den geldiğini kontrol et
    const middlewareRequest = request.headers.get("x-middleware-request");
    if (!middlewareRequest) {
      return NextResponse.json(
        { error: "Bu endpoint yalnızca middleware tarafından kullanılabilir" },
        { status: 403 }
      );
    }

    // Kullanıcı bilgilerini al
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Oturum açılmamış" }, { status: 401 });
    }

    // İstek gövdesini analiz et
    const body = await request.json();
    const { action, details } = body;

    if (!action) {
      return NextResponse.json(
        { error: "Aktivite tipi belirtilmedi" },
        { status: 400 }
      );
    }

    // IP adresi ve kullanıcı ajanını belirle
    const ipAddress =
      request.headers.get("x-forwarded-for") || details?.ip || "bilinmiyor";

    const userAgent =
      request.headers.get("user-agent") || details?.userAgent || "bilinmiyor";

    // Aktivite kaydını oluştur
    await prisma.userActivityLog.create({
      data: {
        userId: user.id,
        action,
        details: details || {},
        ipAddress,
        userAgent,
      },
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("[API User Activity Log] Hata:", error);
    return NextResponse.json({ error: "Sunucu hatası" }, { status: 500 });
  }
}
