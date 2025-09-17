import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPasswordPbkdf2 } from "@/lib";

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();

    // Gerekli alanları kontrol et
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Tüm alanlar doldurulmalıdır" },
        { status: 400 }
      );
    }

    // E-posta formatını kontrol et
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Geçerli bir e-posta adresi giriniz" },
        { status: 400 }
      );
    }

    // Şifre uzunluğunu kontrol et
    if (password.length < 6) {
      return NextResponse.json(
        { error: "Şifre en az 6 karakter olmalıdır" },
        { status: 400 }
      );
    }

    // E-posta adresi zaten kullanılıyor mu kontrol et
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Bu e-posta adresi zaten kullanılıyor" },
        { status: 409 }
      );
    }

    // Şifreyi PBKDF2 ile hashle
    const hashedPassword = await hashPasswordPbkdf2(password);

    // Default 'user' rolünü bul
    const userRole = await prisma.authRole.findFirst({
      where: { name: "customer" },
    });

    if (!userRole) {
      // Bu kritik bir hata, user rolü sistemde olmalı.
      console.error("Default 'user' role not found in database.");
      return NextResponse.json(
        {
          error:
            "Sistem yapılandırma hatası: Varsayılan kullanıcı rolü bulunamadı.",
        },
        { status: 500 }
      );
    }

    // Yeni kullanıcıyı tek rol sistemi ile oluştur
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        isActive: true, // Kullanıcıyı varsayılan olarak aktif yap
        roleId: userRole.id,
        roleAssignedAt: new Date(),
      },
    });

    // Hassas bilgileri çıkar
    const { password: _, ...safeUser } = user;

    return NextResponse.json(
      {
        success: true,
        user: safeUser,
        message: "Kullanıcı başarıyla oluşturuldu",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Kayıt API Hatası:", error);
    let errorMessage = "Bilinmeyen bir sunucu hatası oluştu.";
    if (error instanceof Error) {
      errorMessage = "Sunucu hatası: " + error.message;
    }
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
