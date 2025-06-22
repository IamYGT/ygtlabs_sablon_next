import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib";

export async function POST(request: NextRequest) {
  try {
    const currentUser = await getCurrentUser(request);

    if (!currentUser) {
      return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 401 });
    }

    // Admin veya super_admin rolünü bul
    const adminRole = await prisma.authRole.findFirst({
      where: {
        OR: [{ name: "admin" }, { name: "super_admin" }],
        isActive: true,
      },
    });

    if (!adminRole) {
      return NextResponse.json(
        {
          error: "Admin rolü bulunamadı",
        },
        { status: 404 }
      );
    }

    // Kullanıcıya admin rolü ata
    await prisma.user.update({
      where: { id: currentUser.id },
      data: {
        roleId: adminRole.id,
        roleAssignedAt: new Date(),
        roleAssignedById: currentUser.id, // Kendine atama
      },
    });

    return NextResponse.json({
      success: true,
      message: `${adminRole.displayName} rolü başarıyla atandı`,
      roleName: adminRole.name,
      roleDisplayName: adminRole.displayName,
    });
  } catch (error) {
    console.error("Admin role assignment error:", error);
    return NextResponse.json(
      { error: "Rol atama sırasında hata oluştu" },
      { status: 500 }
    );
  }
}
