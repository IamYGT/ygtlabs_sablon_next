import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { verifyAdminAuth, hashPasswordPbkdf2, verifyPassword } from "@/lib";

const prisma = new PrismaClient();

export async function PUT(request: NextRequest) {
  try {
    const admin = await verifyAdminAuth(request);
    if (!admin) {
      return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 401 });
    }

    const body = await request.json();
    const { currentPassword, newPassword } = body;

    // Validasyon
    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { error: "Mevcut şifre ve yeni şifre gereklidir" },
        { status: 400 }
      );
    }

    if (newPassword.length < 6) {
      return NextResponse.json(
        { error: "Yeni şifre en az 6 karakter olmalıdır" },
        { status: 400 }
      );
    }

    // Admin'in mevcut şifresini kontrol et
    const adminData = await prisma.user.findUnique({
      where: { id: admin.id },
      select: { password: true },
    });

    if (!adminData) {
      return NextResponse.json({ error: "Admin bulunamadı" }, { status: 404 });
    }

    // Mevcut şifre doğrulaması
    const isCurrentPasswordValid = await verifyPassword(
      currentPassword,
      adminData.password
    );

    if (!isCurrentPasswordValid) {
      return NextResponse.json(
        { error: "Mevcut şifre yanlış" },
        { status: 400 }
      );
    }

    // Yeni şifrenin mevcut şifreden farklı olduğunu kontrol et
    const isSamePassword = await verifyPassword(
      newPassword,
      adminData.password
    );
    if (isSamePassword) {
      return NextResponse.json(
        { error: "Yeni şifre mevcut şifreden farklı olmalıdır" },
        { status: 400 }
      );
    }

    // Yeni şifreyi hash'le
    const hashedNewPassword = await hashPasswordPbkdf2(newPassword);

    // Şifreyi güncelle
    await prisma.user.update({
      where: { id: admin.id },
      data: {
        password: hashedNewPassword,
      },
    });

    return NextResponse.json({
      message: "Şifre başarıyla değiştirildi",
    });
  } catch (error) {
    console.error("Şifre değiştirme hatası:", error);
    return NextResponse.json(
      { error: "Şifre değiştirilirken hata oluştu" },
      { status: 500 }
    );
  }
}
