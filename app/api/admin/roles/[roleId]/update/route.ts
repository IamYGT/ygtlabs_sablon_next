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
    const { name, displayName, description, color, layoutType, isActive, power } =
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

    // Hiyerarşi kontrolü: Kullanıcı kendinden daha güçlü veya eşit bir rolü düzenleyemez
    // Super admin bu kuralın dışındadır
    if (currentUser.primaryRole !== "super_admin") {
      if (typeof currentUser.power !== 'number' || existingRole.power >= currentUser.power) {
        return NextResponse.json(
          { error: t("roles.update.cannotEditHigherOrEqualPower") },
          { status: 403 }
        );
      }
      
      // Kullanıcı bir rolün gücünü kendisininkinden daha yüksek veya eşit yapamaz
      if (typeof power === 'number' && power >= currentUser.power) {
        return NextResponse.json(
          { error: t("roles.update.cannotSetPowerHigherThanOwn") },
          { status: 403 }
        );
      }
    }

    // Korumalı rolleri düzenlemeyi engelle
    if (existingRole.isSystemDefault && currentUser.primaryRole !== 'super_admin') {
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
        ...(typeof power === 'number' && { power }),
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
