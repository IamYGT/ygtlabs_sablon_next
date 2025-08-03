import { getCurrentUser } from "@/lib";
import { NextRequest, NextResponse } from "next/server";

// Mevcut tüm yetkileri getir - Dinamik sistem
export async function GET(request: NextRequest) {
  try {
    const currentUser = await getCurrentUser(request);

    if (!currentUser) {
      return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 401 });
    }

    if (!currentUser.permissions.includes("roles.update")) {
      return NextResponse.json(
        { error: "Bu işlem için gerekli yetkiye sahip değilsiniz" },
        { status: 403 }
      );
    }

    // Dinamik sistem - Ön tanımlı yetki yok, sadece kategori şablonları
    const availableCategories = {
      system: {
        name: "Sistem",
        description: "Layout erişimi, admin sayfaları, sistem yönetimi",
        icon: "🛡️",
        color: "#dc2626",
      },
      user_management: {
        name: "Kullanıcı Yönetimi",
        description: "Kullanıcı, rol ve yetki sayfaları ve fonksiyonları",
        icon: "👥",
        color: "#ea580c",
      },
      content: {
        name: "İçerik",
        description: "İçerik sayfaları ve yönetimi",
        icon: "📄",
        color: "#0891b2",
      },
      reports: {
        name: "Raporlar",
        description: "Rapor görüntüleme ve dışa aktarma",
        icon: "📊",
        color: "#7c3aed",
      },
      general: {
        name: "Genel",
        description: "Profil, dashboard, genel fonksiyonlar",
        icon: "⚙️",
        color: "#16a34a",
      },
    };

    // Yetki türleri şablonu
    const permissionTypes = {
      layout: {
        name: "Layout",
        description: "Layout erişim yetkileri",
        icon: "🏗️",
      },
      page: {
        name: "Sayfa",
        description: "Sayfa görüntüleme yetkileri",
        icon: "📄",
      },
      function: {
        name: "Fonksiyon",
        description: "İşlevsel yetkiler",
        icon: "⚡",
      },
    };

    // Boş yetki listesi - Tüm yetkiler dinamik olarak yönetilecek
    const availablePermissions: unknown[] = [];

    // Kategoriye göre grupla (boş)
    const categorizedPermissions = Object.keys(availableCategories).reduce(
      (acc, category) => {
        acc[category] = [];
        return acc;
      },
      {} as Record<string, unknown[]>
    );

    return NextResponse.json({
      permissions: availablePermissions,
      categorizedPermissions,
      availableCategories,
      permissionTypes,
      totalCount: availablePermissions.length,
      message:
        "Dinamik yetki sistemi - Tüm yetkiler admin paneli üzerinden yönetilmektedir",
    });
  } catch (error) {
    console.error("Mevcut yetkiler getirme hatası:", error);
    return NextResponse.json(
      { error: "Mevcut yetkiler getirilirken bir hata oluştu" },
      { status: 500 }
    );
  }
}
