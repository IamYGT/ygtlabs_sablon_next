import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib";

export async function GET(request: NextRequest) {
  try {
    const currentUser = await getCurrentUser(request);

    if (!currentUser) {
      return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 401 });
    }

    // Kullanıcının detaylı bilgilerini al
    const user = await prisma.user.findUnique({
      where: { id: currentUser.id },
      include: {
        role: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Kullanıcı bulunamadı" },
        { status: 404 }
      );
    }

    // Kullanıcının yetkilerini yeni sistemden al
    let permissions: string[] = [];
    if (user.role) {
      const rolePermissions = await prisma.roleHasPermission.findMany({
        where: {
          roleName: user.role.name,
          isAllowed: true,
        },
        include: {
          permission: true,
        },
      });

      permissions = rolePermissions.map(
        (rp) => rp.permission.name
      );

      // Basit yetki isimleri de ekle (geriye uyumluluk için)
      if (user.role.name === "super_admin") {
        permissions.push(
          "admin.access",
          "function.roles.create",
          "function.roles.edit",
          "function.roles.delete"
        );
      } else if (user.role.name === "admin") {
        permissions.push("layout.admin.access", "function.roles.edit");
      } else if (user.role.layoutType === "admin") {
        permissions.push("admin.access");
      } else {
        permissions.push("user.access");
      }
    }

    return NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        isActive: user.isActive,
        role: user.role
          ? {
              id: user.role.id,
              name: user.role.name,
              displayName: user.role.displayName,
              layoutType: user.role.layoutType,
            }
          : null,
        permissions,
      },
      debug: {
        roleId: user.roleId,
        roleAssignedAt: user.roleAssignedAt,
        permissionCount: permissions.length,
      },
    });
  } catch (error) {
    console.error("Debug user simple error:", error);
    return NextResponse.json({ error: "Sunucu hatası" }, { status: 500 });
  }
}
