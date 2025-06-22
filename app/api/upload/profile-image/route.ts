import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib";

const UPLOAD_DIR = path.join(process.cwd(), "public/uploads/profile-images");
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

export async function POST(request: NextRequest) {
  try {
    // Kullanıcının kimlik doğrulamasını kontrol et
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { error: "Oturum açmanız gerekiyor" },
        { status: 401 }
      );
    }

    // FormData'yı al
    const formData = await request.formData();
    const file = formData.get("profileImage") as File;

    if (!file) {
      return NextResponse.json({ error: "Dosya seçilmedi" }, { status: 400 });
    }

    // Dosya boyutu kontrolü
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "Dosya boyutu 5MB'dan fazla olamaz" },
        { status: 400 }
      );
    }

    // Dosya tipi kontrolü
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        {
          error:
            "Desteklenmeyen dosya formatı. PNG, JPG, JPEG veya WebP kullanın",
        },
        { status: 400 }
      );
    }

    // Upload dizininin var olduğundan emin ol
    try {
      await fs.mkdir(UPLOAD_DIR, { recursive: true });
    } catch (error) {
      console.error("Dizin oluşturma hatası:", error);
    }

    // Dosya adını oluştur (kullanıcı ID + timestamp + uzantı)
    const fileExtension = path.extname(file.name);
    const fileName = `${user.id}_${Date.now()}${fileExtension}`;
    const filePath = path.join(UPLOAD_DIR, fileName);

    // Dosyayı kaydet
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    await fs.writeFile(filePath, buffer);

    // Eski profil resmini sil (varsa)
    const existingUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: { profileImage: true },
    });

    if (existingUser?.profileImage) {
      const oldFilePath = path.join(
        process.cwd(),
        "public",
        existingUser.profileImage
      );
      try {
        await fs.unlink(oldFilePath);
      } catch (error) {
        console.log("Eski dosya silinemedi:", error);
      }
    }

    // Veritabanında güncelle
    const profileImagePath = `/uploads/profile-images/${fileName}`;
    await prisma.user.update({
      where: { id: user.id },
      data: { profileImage: profileImagePath },
    });

    return NextResponse.json({
      success: true,
      message: "Profil resmi başarıyla yüklendi",
      profileImage: profileImagePath,
    });
  } catch (error) {
    console.error("Profil resmi yükleme hatası:", error);
    return NextResponse.json(
      { error: "Profil resmi yüklenirken bir hata oluştu" },
      { status: 500 }
    );
  }
}

export async function DELETE(_request: NextRequest) {
  try {
    // Kullanıcının kimlik doğrulamasını kontrol et
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { error: "Oturum açmanız gerekiyor" },
        { status: 401 }
      );
    }

    // Mevcut profil resmini bul
    const existingUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: { profileImage: true },
    });

    if (!existingUser?.profileImage) {
      return NextResponse.json(
        { error: "Silinecek profil resmi bulunamadı" },
        { status: 404 }
      );
    }

    // Dosyayı sil
    const filePath = path.join(
      process.cwd(),
      "public",
      existingUser.profileImage
    );
    try {
      await fs.unlink(filePath);
    } catch (error) {
      console.log("Dosya silinemedi:", error);
    }

    // Veritabanından kaldır
    await prisma.user.update({
      where: { id: user.id },
      data: { profileImage: null },
    });

    return NextResponse.json({
      success: true,
      message: "Profil resmi başarıyla silindi",
    });
  } catch (error) {
    console.error("Profil resmi silme hatası:", error);
    return NextResponse.json(
      { error: "Profil resmi silinirken bir hata oluştu" },
      { status: 500 }
    );
  }
}
