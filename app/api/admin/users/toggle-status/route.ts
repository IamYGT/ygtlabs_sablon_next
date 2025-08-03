import { canToggleUserStatus, getCurrentUser } from "@/lib";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    // Yetki kontrolü - yeni permission sistemi
    const currentUser = await getCurrentUser(request);
    if (!currentUser || !currentUser.permissions.includes("users.update")) {
      return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 403 });
    }

    const { userId, isActive } = await request.json();

    if (!userId || typeof isActive !== "boolean") {
      return NextResponse.json(
        { error: "Kullanıcı ID ve durum gereklidir" },
        { status: 400 }
      );
    }

    // Kullanıcının varlığını kontrol et
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Kullanıcı bulunamadı" },
        { status: 404 }
      );
    }

    // Güvenlik kontrolü: Kullanıcının durumu değiştirme yetkisi var mı
    const canToggle = await canToggleUserStatus(currentUser);
    if (!canToggle) {
      return NextResponse.json(
        {
          error: "Bu kullanıcının durumunu değiştirme yetkiniz yok",
        },
        { status: 403 }
      );
    }

    // Kullanıcı durumunu güncelle
    await prisma.user.update({
      where: { id: userId },
      data: { isActive },
    });

    return NextResponse.json({
      success: true,
      message: isActive
        ? "Kullanıcı aktifleştirildi"
        : "Kullanıcı pasifleştirildi",
    });
  } catch (error) {
    console.error("Kullanıcı durumu değiştirme hatası:", error);
    return NextResponse.json({ error: "Sunucu hatası" }, { status: 500 });
  }
}
