import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib";
import { getTranslations } from "next-intl/server";

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ roleId: string }> }
) {
  const t = await getTranslations("ApiMessages");

  try {
    // Kimlik doğrulama ve yetki kontrolü - yeni permission sistemi
    const currentUser = await getCurrentUser(request);

    if (!currentUser) {
      return NextResponse.json(
        { error: t("common.unauthorized") },
        { status: 401 }
      );
    }

    // Yetki kontrolü - function.roles.delete yetkisi gerekli
    if (!currentUser.permissions.includes("function.roles.delete")) {
      return NextResponse.json(
        { error: t("common.forbidden") },
        { status: 403 }
      );
    }

    const { roleId } = await params;

    // Request body'den transfer bilgilerini al
    const body = await request.json().catch(() => ({}));
    const { transferUsers = false, userTransfers = [] } = body;

    // Rol varlığını kontrol et
    const role = await prisma.authRole.findUnique({
      where: { id: roleId },
      include: {
        users: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    if (!role) {
      return NextResponse.json(
        { error: t("common.notFound", { entity: "Role" }) },
        { status: 404 }
      );
    }

    // Korumalı rolleri silmeyi engelle (super_admin ve user)
    if (role.name === "super_admin" || role.name === "user") {
      return NextResponse.json(
        {
          error: t("roles.delete.protected", { roleName: role.displayName }),
        },
        { status: 400 }
      );
    }

    const hasUsers = role.users.length > 0;
    let transferResults: Array<{
      userId: string;
      targetRoleId: string;
      targetRoleName: string;
    }> = [];

    // Kullanıcıları transfer et veya varsayılan role ata
    if (hasUsers && transferUsers) {
      // Default user rolünü bul
      const defaultUserRole = await prisma.authRole.findUnique({
        where: { name: "user" },
      });

      if (!defaultUserRole) {
        return NextResponse.json(
          { error: t("roles.delete.defaultUserRoleNotFound") },
          { status: 500 }
        );
      }

      // Her kullanıcı için transfer işlemi
      for (const user of role.users) {
        // Kullanıcı için belirtilen hedef rol, yoksa default user rolü
        const userTransfer = userTransfers.find(
          (ut: { userId: string; targetRoleId: string }) =>
            ut.userId === user.id
        );
        const targetRoleId = userTransfer?.targetRoleId || defaultUserRole.id;

        // Hedef rolün varlığını kontrol et
        const targetRole = await prisma.authRole.findUnique({
          where: { id: targetRoleId },
        });

        if (!targetRole) {
          return NextResponse.json(
            {
              error: t("roles.delete.targetRoleNotFound", {
                roleId: targetRoleId,
              }),
            },
            { status: 400 }
          );
        }

        // Kullanıcıyı hedef role aktar
        await prisma.user.update({
          where: { id: user.id },
          data: {
            roleId: targetRoleId,
            roleAssignedAt: new Date(),
            roleAssignedById: currentUser.id,
          },
        });

        transferResults.push({
          userId: user.id,
          targetRoleId: targetRoleId,
          targetRoleName: targetRole.displayName,
        });

        console.log(
          `Kullanıcı ${user.name || user.email} ${role.displayName} rolünden ${
            targetRole.displayName
          } rolüne aktarıldı`
        );
      }
    } else if (hasUsers && !transferUsers) {
      // Transfer edilmiyorsa kullanıcıları user rolüne ata
      const defaultUserRole = await prisma.authRole.findUnique({
        where: { name: "user" },
      });

      if (defaultUserRole) {
        await prisma.user.updateMany({
          where: { roleId: roleId },
          data: {
            roleId: defaultUserRole.id,
            roleAssignedAt: new Date(),
            roleAssignedById: currentUser.id,
          },
        });

        transferResults = role.users.map((user) => ({
          userId: user.id,
          targetRoleId: defaultUserRole.id,
          targetRoleName: defaultUserRole.displayName,
        }));
      }
    }

    // Role yetkilerini sil (yeni sistem)
    await prisma.roleHasPermission.deleteMany({
      where: { roleName: role.name },
    });

    // Rolü sil
    await prisma.authRole.delete({
      where: { id: roleId },
    });

    // Transfer mesajını oluştur
    let transferMessage = "";
    if (hasUsers && transferResults.length > 0) {
      const uniqueTargetRoles = [
        ...new Set(transferResults.map((t) => t.targetRoleName)),
      ];
      if (uniqueTargetRoles.length === 1) {
        transferMessage = t("roles.delete.successWithTransfer", {
          count: transferResults.length,
          targetRole: uniqueTargetRoles[0],
        });
      } else {
        transferMessage = t("roles.delete.successWithMultiTransfer", {
          count: transferResults.length,
        });
      }
    } else {
      transferMessage = t("roles.delete.success", {
        roleName: role.displayName,
      });
    }

    return NextResponse.json({
      message: transferMessage,
      deletedRole: {
        id: role.id,
        name: role.name,
        displayName: role.displayName,
      },
      transferredUsers: transferResults.length,
      transferResults: transferResults,
    });
  } catch (error) {
    console.error("Rol silme hatası:", error);
    return NextResponse.json(
      { error: t("roles.delete.error") },
      { status: 500 }
    );
  }
}
