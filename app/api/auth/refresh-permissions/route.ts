import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session-utils";
import { NextRequest, NextResponse } from "next/server";

/**
 * User'ın permission'larını refresh eder
 * Role değişikliği sonrası yeniden login yapmadan permission'ları günceller
 */
export async function POST(request: NextRequest) {
  try {
    const currentUser = await getCurrentUser(request);

    if (!currentUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }


    // User'ın güncel bilgilerini ve rolünü al
    const user = await prisma.user.findUnique({
      where: { id: currentUser.id },
      include: { role: true },
    });

    if (!user || !user.isActive) {
      return NextResponse.json(
        { error: "User not found or inactive" },
        { status: 404 }
      );
    }

    // User'ın güncel permission'larını al
    let permissions: string[] = [];
    if (user.role) {
      const rolePermissions = await prisma.roleHasPermission.findMany({
        where: {
          roleName: user.role.name,
          isAllowed: true,
          isActive: true,
        },
        include: {
          permission: true,
        },
      });

      permissions = rolePermissions.map((rp) => rp.permission.name);
    }


    // Güncellenmiş user objesi
    const refreshedUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      profileImage: user.profileImage,
      isActive: user.isActive,
      roleId: user.roleId,
      roleAssignedAt: user.roleAssignedAt,
      permissions,
      userRoles: user.role ? [user.role.name] : [],
      primaryRole: user.role?.name,
      createdAt: user.createdAt,
      lastLoginAt: user.lastLoginAt,
    };

    return NextResponse.json({
      success: true,
      user: refreshedUser,
      message: "Permissions refreshed successfully",
    });
  } catch (error) {
    console.error("❌ Refresh permissions API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
