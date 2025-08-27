import { getCurrentUser } from "@/lib";
import { prisma } from "@/lib/prisma";
import { getTranslations } from "next-intl/server";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ roleId: string }> }
) {
  const t = await getTranslations("ApiMessages");
  try {
    // Kimlik doğrulama ve yetki kontrolü
    const currentUser = await getCurrentUser(request);

    if (!currentUser) {
      return NextResponse.json(
        { error: t("common.unauthorized") },
        { status: 401 }
      );
    }

    // Admin yetkisi kontrolü - roles.update yetkisi gerekli
    if (!currentUser.permissions.includes("roles.update")) {
      return NextResponse.json(
        { error: t("common.forbidden") },
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
      return NextResponse.json(
        { error: t("common.notFound", { entity: "Role" }) },
        { status: 404 }
      );
    }

    // Korumalı rolleri düzenlemeyi engelle
    if (existingRole.name === "super_admin" || existingRole.name === "user" || existingRole.name === "admin") {
      return NextResponse.json(
        { error: t("roles.update.protected") },
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
          { error: t("roles.update.nameConflict") },
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
      message: t("roles.update.success"),
      role: updatedRole,
    });
  } catch (error) {
    console.error("Rol güncelleme hatası:", error);
    return NextResponse.json(
      { error: t("roles.update.error") },
      { status: 500 }
    );
  }
}
