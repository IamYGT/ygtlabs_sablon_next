import { getCurrentUser } from "@/lib/server-utils";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { cache } from "react";

// Bu fonksiyon, bir rolün sahip olduğu aktif izin sayısını hesaplar.
const getPermissionCount = cache(async (roleName: string): Promise<number> => {
  const count = await prisma.roleHasPermission.count({
    where: {
      roleName: roleName,
      isActive: true,
      isAllowed: true,
    },
  });
  return count;
});

export async function GET(request: NextRequest) {
  try {
    const currentUser = await getCurrentUser(request);

    if (!currentUser) {
      return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 401 });
    }

    const allRoles = await prisma.authRole.findMany({
      where: { isActive: true },
      orderBy: { displayName: "asc" },
    });

    // Super admin her zaman tüm rolleri atayabilir.
    if (currentUser.primaryRole === "super_admin") {
      return NextResponse.json(allRoles);
    }

    // Diğer kullanıcılar için, sadece kendilerinden daha az yetkiye sahip rolleri döndür.
    const currentUserPermissionCount =
      currentUser.permissions && Array.isArray(currentUser.permissions)
        ? currentUser.permissions.length
        : 0;

    const assignableRoles = [];
    for (const role of allRoles) {
      // Bir admin kendi rolünü başka bir kullanıcıya atayamaz.
      if (role.id === currentUser.roleId) {
        continue;
      }
      const targetRolePermissionCount = await getPermissionCount(role.name);
      if (currentUserPermissionCount > targetRolePermissionCount) {
        assignableRoles.push(role);
      }
    }

    return NextResponse.json(assignableRoles);
  } catch (error) {
    console.error("Atanabilir roller getirilirken hata:", error);
    return NextResponse.json(
      { error: "Roller getirilirken bir sunucu hatası oluştu." },
      { status: 500 }
    );
  }
}
