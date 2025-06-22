import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { verifyAdminAuth } from "@/lib";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const admin = await verifyAdminAuth(request);
    if (!admin) {
      return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 401 });
    }

    // Admin bilgilerini getir
    const adminData = await prisma.user.findUnique({
      where: { id: admin.id },
      select: {
        id: true,
        name: true,
        email: true,
        profileImage: true,
        createdAt: true,
        lastLoginAt: true,
      },
    });

    if (!adminData) {
      return NextResponse.json({ error: "Admin bulunamadı" }, { status: 404 });
    }

    return NextResponse.json(adminData);
  } catch (error) {
    console.error("Admin profil getirme hatası:", error);
    return NextResponse.json(
      { error: "Profil bilgileri alınırken hata oluştu" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const admin = await verifyAdminAuth(request);
    if (!admin) {
      return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 401 });
    }

    const body = await request.json();
    const { name, email } = body;

    // Validasyon
    if (!name || !email) {
      return NextResponse.json(
        { error: "Ad ve e-posta alanları zorunludur" },
        { status: 400 }
      );
    }

    // E-posta formatı kontrolü
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Geçerli bir e-posta adresi girin" },
        { status: 400 }
      );
    }

    // E-posta benzersizlik kontrolü (kendi e-postası hariç)
    const existingAdmin = await prisma.user.findFirst({
      where: {
        email: email,
        NOT: {
          id: admin.id,
        },
      },
    });

    if (existingAdmin) {
      return NextResponse.json(
        { error: "Bu e-posta adresi zaten kullanılıyor" },
        { status: 400 }
      );
    }

    // Profil güncelleme
    const updatedAdmin = await prisma.user.update({
      where: { id: admin.id },
      data: {
        name: name.trim(),
        email: email.trim().toLowerCase(),
      },
      select: {
        id: true,
        name: true,
        email: true,
        profileImage: true,
        createdAt: true,
        lastLoginAt: true,
      },
    });

    return NextResponse.json({
      message: "Profil başarıyla güncellendi",
      admin: updatedAdmin,
    });
  } catch (error) {
    console.error("Admin profil güncelleme hatası:", error);
    return NextResponse.json(
      { error: "Profil güncellenirken hata oluştu" },
      { status: 500 }
    );
  }
}
