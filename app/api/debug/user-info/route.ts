import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib";

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser(request);

    if (!user) {
      return NextResponse.json(
        {
          error: "Kullanıcı bulunamadı",
          authenticated: false,
        },
        { status: 401 }
      );
    }

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        userRoles: user.userRoles,
        permissions: user.permissions,
        hasAdminAccess: user.permissions.includes("admin.access"),
        hasSystemAdmin: user.permissions.includes("system.admin"),
        isSuperAdmin: user.userRoles.includes("super_admin"),
        isAdmin: user.userRoles.includes("admin"),
      },
    });
  } catch (error) {
    console.error("Debug user info error:", error);
    return NextResponse.json(
      {
        error: "Kullanıcı bilgileri alınamadı",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
