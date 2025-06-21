import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ roleId: string }> }
) {
  try {
    // Kimlik doğrulama ve yetki kontrolü
    const currentUser = await getCurrentUser(request);

    if (!currentUser) {
      return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 401 });
    }

    // Admin yetkisi kontrolü
    if (!currentUser.permissions.includes("function.roles.edit")) {
      return NextResponse.json(
        { error: "Bu işlem için gerekli yetkiye sahip değilsiniz" },
        { status: 403 }
      );
    }

    const { roleId } = await params;
    const body = await request.json();
    const { name, displayName, description, color, layoutType, isActive } =
      body;

    // Rol varlığını kontrol et
    const existingRole = await prisma.authRole.findUnique({
      where: { id: roleId },
    });

    if (!existingRole) {
      return NextResponse.json({ error: "Rol bulunamadı" }, { status: 404 });
    }

    // Korumalı rolleri düzenlemeyi engelle
    if (existingRole.name === "super_admin" || existingRole.name === "user") {
      return NextResponse.json(
        { error: "Korumalı sistem rolleri düzenlenemez" },
        { status: 400 }
      );
    }

    // Rol adı çakışması kontrolü (sadece değiştiriliyorsa)
    if (name && name !== existingRole.name) {
      const nameConflict = await prisma.authRole.findFirst({
        where: {
          name: name,
          id: { not: roleId },
        },
      });

      if (nameConflict) {
        return NextResponse.json(
          { error: "Bu rol adı zaten kullanılıyor" },
          { status: 400 }
        );
      }
    }

    // Rolü güncelle
    const updatedRole = await prisma.authRole.update({
      where: { id: roleId },
      data: {
        ...(name && { name }),
        ...(displayName && { displayName }),
        ...(description !== undefined && { description }),
        ...(color && { color }),
        ...(layoutType && { layoutType }),
        ...(isActive !== undefined && { isActive }),
        updatedAt: new Date(),
        updatedById: currentUser.id,
      },
    });

    return NextResponse.json({
      message: "Rol başarıyla güncellendi",
      role: updatedRole,
    });
  } catch (error) {
    console.error("Rol güncelleme hatası:", error);
    return NextResponse.json(
      { error: "Rol güncellenirken bir hata oluştu" },
      { status: 500 }
    );
  }
}
