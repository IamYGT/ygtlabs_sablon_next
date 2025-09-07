import { getCurrentUser } from "@/lib";
import { prisma } from "@/lib/prisma";
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

    // Yetki kontrolü - roles.assign-permissions yetkisi gerekli
    const hasPermission = currentUser.permissions.includes("roles.assign-permissions") || 
                         currentUser.permissions.includes("roles.update");

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
    console.log("👤 Current user:", currentUser.name, "with role:", currentUser.primaryRole);

    // Rolü bul
    const role = await prisma.authRole.findUnique({
      where: { id: roleId },
      include: {
        rolePermissions: {
          where: { isActive: true, isAllowed: true },
          include: { permission: true }
        }
      }
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

    // Super admin her şeyi yapabilir
    if (currentUser.primaryRole !== "super_admin") {
      // 1. Kullanıcı sadece kendisinde olan yetkileri atayabilir
      const userHasAllPermissions = incomingPermissionNames.every(
        (permName: string) => currentUser.permissions.includes(permName)
      );

      if (!userHasAllPermissions) {
        const missingPermissions = incomingPermissionNames.filter(
          (permName: string) => !currentUser.permissions.includes(permName)
        );
        console.warn(
          `⚠️ User ${currentUser.name} tried to assign permissions they don't have: ${missingPermissions.join(", ")}`
        );
        return NextResponse.json(
          { 
            error: t("roles.permissions.cannotAssignPermissionsYouDontHave"),
            missingPermissions 
          },
          { status: 403 }
        );
      }

      // 2. Kullanıcı kendinden fazla veya eşit sayıda yetkiye sahip bir rolü düzenleyemez
      const targetRolePermissionCount = role.rolePermissions.length;
      const userPermissionCount = currentUser.permissions.length;
      
      if (targetRolePermissionCount >= userPermissionCount) {
        console.warn(
          `⚠️ User ${currentUser.name} (${userPermissionCount} permissions) tried to edit role ${role.name} (${targetRolePermissionCount} permissions)`
        );
        return NextResponse.json(
          { 
            error: t("roles.permissions.cannotEditRoleWithEqualOrMorePermissions"),
            details: {
              yourPermissions: userPermissionCount,
              rolePermissions: targetRolePermissionCount
            }
          },
          { status: 403 }
        );
      }

      // 3. Rolün mevcut yetkilerinin hepsine kullanıcı sahip olmalı
      // Aksi halde kullanıcı bilmediği/sahip olmadığı yetkileri kaybettirebilir
      const rolePermissionNames = role.rolePermissions.map(rp => rp.permission.name);
      const userCanManageAllExistingPermissions = rolePermissionNames.every(
        (permName: string) => currentUser.permissions.includes(permName)
      );

      if (!userCanManageAllExistingPermissions) {
        const unmanageablePermissions = rolePermissionNames.filter(
          (permName: string) => !currentUser.permissions.includes(permName)
        );
        console.warn(
          `⚠️ User ${currentUser.name} cannot edit role ${role.name} because the role has permissions the user doesn't have: ${unmanageablePermissions.join(", ")}`
        );
        return NextResponse.json(
          { 
            error: t("roles.permissions.roleHasPermissionsYouDontHave"),
            unmanageablePermissions 
          },
          { status: 403 }
        );
      }
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

        // 2. Super admin değilse, sadece kendisinde olan yetkileri filtrele
        let permissionsToCreate = incomingPermissionNames.filter(
          (name: string) => validPermissionNames.has(name)
        );
        
        if (currentUser.primaryRole !== "super_admin") {
          // Kullanıcı sadece kendisinde olan yetkileri atayabilir
          permissionsToCreate = permissionsToCreate.filter(
            (name: string) => currentUser.permissions.includes(name)
          );
          
          const filteredOutPermissions = incomingPermissionNames.filter(
            (name: string) => validPermissionNames.has(name) && !currentUser.permissions.includes(name)
          );
          
          if (filteredOutPermissions.length > 0) {
            console.warn(
              `⚠️ Filtered out permissions user doesn't have: ${filteredOutPermissions.join(", ")}`
            );
          }
        }

        if (incomingPermissionNames.length !== permissionsToCreate.length) {
          const invalidPermissions = incomingPermissionNames.filter(
            (name: string) => !validPermissionNames.has(name)
          );
          if (invalidPermissions.length > 0) {
            console.warn(
              `[Role Update] DİKKAT: Aşağıdaki geçersiz yetkiler role eklenemedi çünkü veritabanında bulunmuyorlar: ${invalidPermissions.join(
                ", "
              )}`
            );
          }
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
        
        // Rolün gücünü güncelle
        const newPermissionCount = permissionsToCreate.length;
        await tx.authRole.update({
          where: { name: role.name },
          data: { power: newPermissionCount },
        });

        console.log(`✅ Successfully updated role ${role.name} with ${permissionsToCreate.length} permissions`);
        console.log(`⚡️ Updated power for role ${role.name} to ${newPermissionCount}`);
      } else {
        // Eğer tüm yetkiler kaldırılıyorsa, gücü sıfırla
        await tx.authRole.update({
          where: { name: role.name },
          data: { power: 0 },
        });
        console.log(`✅ Successfully removed all permissions from role ${role.name}`);
        console.log(`⚡️ Updated power for role ${role.name} to 0`);
      }
    });

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
