import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { existsSync } from "fs";
import path from "path";
import { getCurrentUser } from "@/lib/server-utils";

export async function POST(request: NextRequest) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "Dosya bulunamadı" }, { status: 400 });
    }

    // Dosya tipini kontrol et
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Sadece JPEG, PNG ve WebP dosyaları desteklenir" },
        { status: 400 }
      );
    }

    // Dosya boyutunu kontrol et (5MB limit)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: "Dosya boyutu 5MB'dan küçük olmalıdır" },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Unique filename oluştur
    const timestamp = Date.now();
    const originalName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
    const filename = `${timestamp}_${originalName}`;

    // Upload klasörünü oluştur
    const uploadDir = path.join(
      process.cwd(),
      "public",
      "uploads",
      "hero-slider"
    );
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }

    // Dosyayı kaydet
    const filepath = path.join(uploadDir, filename);
    await writeFile(filepath, buffer);

    // Public URL'i döndür
    const publicUrl = `/uploads/hero-slider/${filename}`;

    return NextResponse.json({
      message: "Dosya başarıyla yüklendi",
      url: publicUrl,
      filename: filename,
      size: file.size,
      type: file.type,
    });
  } catch (error) {
    console.error("File upload error:", error);
    return NextResponse.json(
      { error: "Dosya yüklenirken hata oluştu" },
      { status: 500 }
    );
  }
}
