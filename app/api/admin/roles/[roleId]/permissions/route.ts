import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib";
import { getTranslations } from "next-intl/server";

// Rolün yetkilerini getir
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ roleId: string }> }
) {
  const t = await getTranslations("ApiMessages");
  try {
    const currentUser = await getCurrentUser(request);

    if (!currentUser) {
      return NextResponse.json(
        { error: t("common.unauthorized") },
        { status: 401 }
      );
    }

    // Yetki kontrolü - yeni permission sistemi
    const hasPermission = currentUser.permissions.includes(
      "function.roles.edit"
    );

    if (!hasPermission) {
      return NextResponse.json(
        { error: t("common.forbidden") },
        { status: 403 }
      );
    }

    const { roleId } = await params;

    // Rolü bul
    const role = await prisma.authRole.findUnique({
      where: { id: roleId },
      include: {
        rolePermissions: {
          where: {
            isAllowed: true,
            isActive: true,
          },
          include: {
            permission: true,
          },
        },
      },
    });

    if (!role) {
      return NextResponse.json(
        { error: t("common.notFound", { entity: "Role" }) },
        { status: 404 }
      );
    }

    return NextResponse.json({
      role: {
        id: role.id,
        name: role.name,
        displayName: role.displayName,
      },
      permissions: role.rolePermissions.map((rp) => ({
        id: rp.permission.id,
        name: rp.permission.name,
        category: rp.permission.category,
        resourcePath: rp.permission.resourcePath,
        action: rp.permission.action,
        displayName: rp.permission.displayName,
        description: rp.permission.description,
        permissionType: rp.permission.permissionType,
      })),
    });
  } catch (error) {
    console.error("Rol yetkileri getirme hatası:", error);
    return NextResponse.json(
      { error: t("roles.permissions.getError") },
      { status: 500 }
    );
  }
}

// Rolün yetkilerini güncelle
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ roleId: string }> }
) {
  const t = await getTranslations("ApiMessages");
  try {
    const currentUser = await getCurrentUser(request);

    if (!currentUser) {
      return NextResponse.json(
        { error: t("common.unauthorized") },
        { status: 401 }
      );
    }

    // Yetki kontrolü - yeni permission sistemi
    const hasPermission = currentUser.permissions.includes(
      "function.roles.edit"
    );

    if (!hasPermission) {
      return NextResponse.json(
        { error: t("common.forbidden") },
        { status: 403 }
      );
    }

    const { roleId } = await params;
    const body = await request.json();
    const { permissions } = body;

    console.log("🔄 Updating permissions for role:", roleId);
    console.log("📋 Received permissions:", permissions);

    // Rolü bul
    const role = await prisma.authRole.findUnique({
      where: { id: roleId },
    });

    if (!role) {
      return NextResponse.json(
        { error: t("common.notFound", { entity: "Role" }) },
        { status: 404 }
      );
    }

    // Korumalı rollerin yetkilerini değiştirmeyi engelle
    if (role.name === "super_admin" || role.name === "user") {
      return NextResponse.json(
        { error: t("roles.permissions.updateProtected") },
        { status: 400 }
      );
    }

    // Transaction kullanarak atomik işlem yap
    await prisma.$transaction(async (tx) => {
      // Mevcut yetkileri sil
      await tx.roleHasPermission.deleteMany({
        where: { roleName: role.name },
      });

      // Yeni yetkileri ekle
      if (permissions && permissions.length > 0) {
        const rolePermissionData = permissions.map(
          (permissionName: string) => ({
            roleName: role.name,
            permissionName: permissionName,
            isAllowed: true,
            isActive: true,
            grantedById: currentUser.id,
          })
        );

        await tx.roleHasPermission.createMany({
          data: rolePermissionData,
        });
      }
    });

    return NextResponse.json({
      message: t("roles.permissions.updateSuccess", {
        roleName: role.displayName,
      }),
      updatedPermissions: permissions.length,
    });
  } catch (error) {
    console.error("Rol yetkileri güncelleme hatası:", error);
    return NextResponse.json(
      { error: t("roles.permissions.updateError") },
      { status: 500 }
    );
  }
}
