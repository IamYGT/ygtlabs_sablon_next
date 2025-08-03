import { getCurrentUser } from "@/lib";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(request: NextRequest) {
  try {
    // Yetki kontrolü - yeni permission sistemi
    const currentUser = await getCurrentUser(request);
    if (!currentUser || !currentUser.permissions.includes("users.delete")) {
      return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 403 });
    }

    const { userId } = await request.json();

    if (!userId) {
      return NextResponse.json(
        { error: "Kullanıcı ID gereklidir" },
        { status: 400 }
      );
    }

    // Kullanıcının varlığını kontrol et
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        role: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Kullanıcı bulunamadı" },
        { status: 404 }
      );
    }

    // Kendi hesabını silmesin
    if (user.id === currentUser.id) {
      return NextResponse.json(
        { error: "Kendi hesabınızı silemezsiniz" },
        { status: 400 }
      );
    }

    // Super admin rolü varsa engelle
    const hasSuperAdminRole = user.role?.name === "super_admin";

    if (hasSuperAdminRole) {
      return NextResponse.json(
        { error: "Super admin kullanıcısı silinemez" },
        { status: 400 }
      );
    }

    // Kullanıcıyı sil (rol ataması otomatik olarak temizlenir)
    await prisma.user.delete({
      where: { id: userId },
    });

    return NextResponse.json({
      success: true,
      message: "Kullanıcı başarıyla silindi",
    });
  } catch (error) {
    console.error("Kullanıcı silme hatası:", error);
    return NextResponse.json({ error: "Sunucu hatası" }, { status: 500 });
  }
}
