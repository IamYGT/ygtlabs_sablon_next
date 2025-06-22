import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib";

// Tüm rolleri getir
export async function GET(request: NextRequest) {
  try {
    const currentUser = await getCurrentUser(request);

    if (!currentUser) {
      return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 401 });
    }

    // Yetki kontrolü - function.roles.view yetkisi gerekli
    if (!currentUser.permissions.includes("function.roles.view")) {
      return NextResponse.json(
        { error: "Bu işlem için gerekli yetkiye sahip değilsiniz" },
        { status: 403 }
      );
    }

    const roles = await prisma.authRole.findMany({
      include: {
        rolePermissions: {
          where: { isActive: true },
          include: {
            permission: true,
          },
        },
        users: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        _count: {
          select: {
            users: true,
          },
        },
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    // Format roles for frontend compatibility
    const formattedRoles = roles.map(role => ({
      id: role.id,
      name: role.name,
      displayName: role.displayName,
      description: role.description,
      color: role.color,
      isActive: role.isActive,
      isSystemDefault: role.isSystemDefault,
      createdAt: role.createdAt,
      updatedAt: role.updatedAt,
      permissions: role.rolePermissions.map(rp => ({
        permission: {
          id: rp.permission.id,
          name: rp.permission.name,
          displayName: rp.permission.displayName,
          category: rp.permission.category,
          resourcePath: rp.permission.resourcePath,
          action: rp.permission.action,
          permissionType: rp.permission.permissionType,
        },
      })),
      users: role.users,
      _count: role._count,
    }));

    return NextResponse.json({
      roles: formattedRoles,
      totalCount: formattedRoles.length,
    });
  } catch (error) {
    console.error("Roller getirme hatası:", error);
    return NextResponse.json(
      { error: "Roller getirilirken bir hata oluştu" },
      { status: 500 }
    );
  }
}
