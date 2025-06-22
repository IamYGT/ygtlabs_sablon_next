import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib";

interface BulkDeleteResponse {
  success: boolean;
  message: string;
  deletedCount: number;
  warnings?: string[];
}

export async function POST(request: NextRequest) {
  try {
    // Yetki kontrolü - yeni permission sistemi
    const currentUser = await getCurrentUser(request);
    if (
      !currentUser ||
      !currentUser.permissions.includes("function.users.delete")
    ) {
      return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 403 });
    }

    const { userIds } = await request.json();

    if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
      return NextResponse.json(
        { error: "En az bir kullanıcı ID gereklidir" },
        { status: 400 }
      );
    }

    // Kullanıcıları kontrol et
    const users = await prisma.user.findMany({
      where: { id: { in: userIds } },
      include: {
        role: true,
      },
    });

    if (users.length === 0) {
      return NextResponse.json(
        { error: "Hiçbir kullanıcı bulunamadı" },
        { status: 404 }
      );
    }

    // Güvenlik kontrolleri
    const errors: string[] = [];
    const validUserIds: string[] = [];

    for (const user of users) {
      // Kendi hesabını silmeye çalışıyor mu?
      if (user.id === currentUser.id) {
        errors.push(
          `${user.name || user.email}: Kendi hesabınızı silemezsiniz`
        );
        continue;
      }

      // Super admin rolü var mı?
      const hasSuperAdminRole = user.role?.name === "super_admin";

      if (hasSuperAdminRole) {
        errors.push(
          `${user.name || user.email}: Super admin kullanıcısı silinemez`
        );
        continue;
      }

      validUserIds.push(user.id);
    }

    if (validUserIds.length === 0) {
      return NextResponse.json(
        {
          error: "Hiçbir kullanıcı silinemedi",
          details: errors,
        },
        { status: 400 }
      );
    }

    // Transaction ile silme işlemi
    const result = await prisma.$transaction(async (tx) => {
      // Önce session'ları sil
      await tx.session.deleteMany({
        where: { userId: { in: validUserIds } },
      });

      // Kullanıcıları sil (rol ataması otomatik olarak temizlenir)
      const deleteResult = await tx.user.deleteMany({
        where: { id: { in: validUserIds } },
      });

      return deleteResult;
    });

    const message = `${result.count} kullanıcı başarıyla silindi`;
    const response: BulkDeleteResponse = {
      success: true,
      message,
      deletedCount: result.count,
    };

    if (errors.length > 0) {
      response.warnings = errors;
      response.message += ` (${errors.length} kullanıcı silinemedi)`;
    }

    return NextResponse.json(response);
  } catch (error) {
    console.error("Toplu kullanıcı silme hatası:", error);
    return NextResponse.json({ error: "Sunucu hatası" }, { status: 500 });
  }
}
