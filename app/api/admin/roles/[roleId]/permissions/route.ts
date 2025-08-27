import { getCurrentUser } from "@/lib";
import { prisma } from "@/lib/prisma";
import { cacheManager } from "@/lib/cache-manager";
import { getTranslations } from "next-intl/server";
import { NextRequest, NextResponse } from "next/server";

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
    const hasPermission = currentUser.permissions.includes("roles.update");

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
    const hasPermission = currentUser.permissions.includes("roles.update");

    if (!hasPermission) {
      return NextResponse.json(
        { error: t("common.forbidden") },
        { status: 403 }
      );
    }

    const { roleId } = await params;
    const body = await request.json();
    const { permissions: incomingPermissionNames = [] } = body;

    console.log("🔄 Updating permissions for role:", roleId);
    console.log("📋 Received permission names:", incomingPermissionNames);

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
    if (role.name === "super_admin" || role.name === "user" || role.name === "admin") {
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
      if (incomingPermissionNames.length > 0) {
        // 1. Gelen yetki isimlerinin veritabanında var olup olmadığını kontrol et
        const existingPermissions = await tx.permission.findMany({
          where: {
            name: {
              in: incomingPermissionNames,
            },
          },
          select: {
            name: true, // Sadece isimleri al, bu yeterli
          },
        });

        const validPermissionNames = new Set(
          existingPermissions.map((p) => p.name)
        );

        // 2. Sadece geçerli (veritabanında var olan) yetkileri ekle
        const permissionsToCreate = incomingPermissionNames.filter(
          (name: string) => validPermissionNames.has(name)
        );

        if (incomingPermissionNames.length !== permissionsToCreate.length) {
          const invalidPermissions = incomingPermissionNames.filter(
            (name: string) => !validPermissionNames.has(name)
          );
          console.warn(
            `[Role Update] DİKKAT: Aşağıdaki geçersiz yetkiler role eklenemedi çünkü veritabanında bulunmuyorlar: ${invalidPermissions.join(
              ", "
            )}`
          );
        }

        if (permissionsToCreate.length > 0) {
          const rolePermissionData = permissionsToCreate.map(
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
      }
    });

    // Permission değişiklikleri tüm cache'leri etkiler - ALL cache'leri temizle
    console.log(`🔄 Role permissions updated for ${role.name} - invalidating ALL caches`);
    cacheManager.invalidateAll(); // Tüm cache'leri temizle

    return NextResponse.json({
      message: t("roles.permissions.updateSuccess", {
        roleName: role.displayName,
      }),
      updatedPermissions: incomingPermissionNames.length,
    });
  } catch (error) {
    console.error("Rol yetkileri güncelleme hatası:", error);
    return NextResponse.json(
      { error: t("roles.permissions.updateError") },
      { status: 500 }
    );
  }
}
